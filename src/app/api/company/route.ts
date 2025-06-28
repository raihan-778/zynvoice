// app/api/company/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CompanyInfo } from "@/models/CompanyInfo";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const company = await CompanyInfo.findOne();

    if (!company) {
      return NextResponse.json({
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        taxId: "",
      });
    }

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch company info" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();

    const companyData: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      website: formData.get("website"),
      taxId: formData.get("taxId"),
    };

    // Handle logo upload
    const logoFile = formData.get("logo") as File;
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);

      await writeFile(filepath, buffer);
      companyData.logo = `/uploads/${filename}`;
    }

    // Update or create company info
    const company = await CompanyInfo.findOneAndUpdate({}, companyData, {
      upsert: true,
      new: true,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Company update error:", error);
    return NextResponse.json(
      { error: "Failed to update company info" },
      { status: 500 }
    );
  }
}
