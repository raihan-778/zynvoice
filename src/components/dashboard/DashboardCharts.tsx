import { Invoice } from "@/hooks/useInvoice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface DashboardChartsProps {
  invoices: Invoice[];
}

export function DashboardCharts({ invoices }: DashboardChartsProps) {
  // Status distribution data
  const statusData = [
    {
      name: "Paid",
      value: invoices.filter((inv) => inv.status === "paid").length,
      color: "#10B981",
    },
    {
      name: "Sent",
      value: invoices.filter((inv) => inv.status === "sent").length,
      color: "#3B82F6",
    },
    {
      name: "Overdue",
      value: invoices.filter((inv) => inv.status === "overdue").length,
      color: "#EF4444",
    },
    {
      name: "Draft",
      value: invoices.filter((inv) => inv.status === "draft").length,
      color: "#6B7280",
    },
  ];

  // Monthly revenue data
  const monthlyData = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, invoice) => {
      const month = new Date(invoice.createdDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.revenue += invoice.amount;
      } else {
        acc.push({ month, revenue: invoice.amount });
      }
      return acc;
    }, [] as { month: string; revenue: number }[])
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Invoice Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Invoice Status Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue */}
      {monthlyData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Revenue
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    invoice.status === "paid"
                      ? "bg-green-500"
                      : invoice.status === "sent"
                      ? "bg-blue-500"
                      : invoice.status === "overdue"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {invoice.clientName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ${invoice.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(invoice.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
