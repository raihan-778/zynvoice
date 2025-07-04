// GET Handler - Enhanced Invoice Retrieval with Filtering

import { authOptions } from "@/lib/auth/auth.config";
import DBConnect from "@/lib/database/connection";
import mongoose from "mongoose";

import InvoiceModel from "@/models/Invoice";

// Assuming you have a Mongoose model for invoices

import { getServerSession, User } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  await DBConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id as string);

  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: Record<string, unknown> = { userId };

    // Status filter - supports multiple statuses
    const status = searchParams.get("status");
    if (status) {
      const statusArray = status
        .split(",")
        .map((s) => s.trim())
        .filter((s) => ["draft", "sent", "paid", "overdue"].includes(s));
      if (statusArray.length === 1) {
        filter.status = statusArray[0];
      } else if (statusArray.length > 1) {
        filter.status = { $in: statusArray };
      }
    }

    // Invoice number search (partial match)
    const invoiceNumber = searchParams.get("invoiceNumber");
    if (invoiceNumber) {
      filter.invoiceNumber = { $regex: invoiceNumber, $options: "i" };
    }

    // Date range filter
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const dateField = searchParams.get("dateField") || "invoiceDate"; // invoiceDate, dueDate, createdAt

    if (startDate || endDate) {
      filter[dateField] = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          (filter[dateField] as Record<string, unknown>).$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Set end date to end of day
          end.setHours(23, 59, 59, 999);
          (filter[dateField] as Record<string, unknown>).$lte = end;
        }
      }
    }

    // Amount range filter
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    if (minAmount || maxAmount) {
      filter.total = {};
      if (minAmount && !isNaN(parseFloat(minAmount))) {
        (filter.total as Record<string, unknown>).$gte = parseFloat(minAmount);
      }
      if (maxAmount && !isNaN(parseFloat(maxAmount))) {
        (filter.total as Record<string, unknown>).$lte = parseFloat(maxAmount);
      }
    }

    // Recurring filter
    const isRecurring = searchParams.get("isRecurring");
    if (
      isRecurring !== null &&
      (isRecurring === "true" || isRecurring === "false")
    ) {
      filter["recurring.isRecurring"] = isRecurring === "true";
    }

    // Search in multiple fields
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { terms: { $regex: search, $options: "i" } },
        { "items.description": { $regex: search, $options: "i" } },
      ];
    }

    // Currency filter
    const currency = searchParams.get("currency");
    if (currency) {
      filter.currency = currency.toUpperCase();
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = [
      "createdAt",
      "invoiceDate",
      "dueDate",
      "total",
      "status",
      "invoiceNumber",
      "updatedAt",
    ];

    const sort: Record<string, 1 | -1> = {};
    if (allowedSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder as 1 | -1;
    } else {
      sort.createdAt = -1; // Default sort
    }

    // Include/exclude fields
    const includeFields = searchParams.get("fields");
    const projection: Record<string, number> = {};
    if (includeFields) {
      const fields = includeFields.split(",").map((f) => f.trim());
      fields.forEach((field) => {
        projection[field] = 1;
      });
      // Always include essential fields
      projection._id = 1;
      projection.userId = 1;
    }

    // Execute main query
    const invoiceQuery = InvoiceModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (Object.keys(projection).length > 0) {
      invoiceQuery.select(projection);
    }

    // Execute parallel queries
    const [invoices, total, summaryStats] = await Promise.all([
      invoiceQuery.lean(),
      InvoiceModel.countDocuments(filter),
      // Get summary statistics
      InvoiceModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
            totalPaid: { $sum: "$paidAmount" },
            totalOutstanding: {
              $sum: { $subtract: ["$total", "$paidAmount"] },
            },
            statusCounts: {
              $push: {
                status: "$status",
                count: 1,
                amount: "$total",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: 1,
            totalPaid: 1,
            totalOutstanding: 1,
            statusBreakdown: {
              $reduce: {
                input: "$statusCounts",
                initialValue: {},
                in: {
                  $mergeObjects: [
                    "$$value",
                    {
                      $arrayToObject: [
                        [
                          {
                            k: "$$this.status",
                            v: {
                              $add: [
                                {
                                  $ifNull: [
                                    {
                                      $getField: {
                                        field: "$$this.status",
                                        input: "$$value",
                                      },
                                    },
                                    0,
                                  ],
                                },
                                1,
                              ],
                            },
                          },
                        ],
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ]),
    ]);

    // Format response
    const response = {
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        summary: summaryStats[0] || {
          totalAmount: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          statusBreakdown: {},
        },
        filters: {
          status: status?.split(",") || [],
          invoiceNumber,
          startDate,
          endDate,
          dateField,
          minAmount: minAmount ? parseFloat(minAmount) : null,
          maxAmount: maxAmount ? parseFloat(maxAmount) : null,
          isRecurring:
            isRecurring === "true"
              ? true
              : isRecurring === "false"
              ? false
              : null,
          search,
          currency,
          sortBy,
          sortOrder: sortOrder === 1 ? "asc" : "desc",
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get Invoices Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
