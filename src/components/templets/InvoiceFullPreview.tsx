// components/templates/InvoiceFullPreview.tsx
interface InvoiceFullPreviewProps {
  template: any;
  data: any;
}

export function InvoiceFullPreview({ template, data }: InvoiceFullPreviewProps) {
  const getLayoutStyles = () => {
    const { layout, primaryColor, secondaryColor, fontFamily } =
      template.styles;

    return {
      fontFamily:
        fontFamily === "Inter"
          ? "Inter, sans-serif"
          : fontFamily === "Roboto"
          ? "Roboto, sans-serif"
          : "Arial, sans-serif",
      "--primary-color": primaryColor,
      "--secondary-color": secondaryColor,
    } as React.CSSProperties;
  };

  return (
    <div className="h-full" style={getLayoutStyles()}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-color)" }}
          >
            {data.company.name}
          </h1>
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {data.company.address}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>{data.company.email}</p>
            <p>{data.company.phone}</p>
          </div>
        </div>

        <div className="text-right">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--primary-color)" }}
          >
            INVOICE
          </h2>
          <div className="text-sm">
            <p>
              <strong>Invoice #:</strong> {data.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {data.date}
            </p>
            <p>
              <strong>Due Date:</strong> {data.dueDate}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--primary-color)" }}
        >
          Bill To:
        </h3>
        <div className="text-sm">
          <p className="font-medium">{data.client.name}</p>
          <div className="text-gray-600 whitespace-pre-line">
            {data.client.address}
          </div>
          <p className="text-gray-600 mt-1">{data.client.email}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr
              className="text-white text-sm"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <th className="text-left p-3">Description</th>
              <th className="text-center p-3">Qty</th>
              <th className="text-right p-3">Rate</th>
              <th className="text-right p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-3 text-sm">{item.description}</td>
                <td className="p-3 text-sm text-center">{item.quantity}</td>
                <td className="p-3 text-sm text-right">${item.rate}</td>
                <td className="p-3 text-sm text-right">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span>Subtotal:</span>
            <span>${data.subtotal}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Tax:</span>
            <span>${data.tax}</span>
          </div>
          <div
            className="flex justify-between py-3 font-bold text-white rounded"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            <span className="px-3">Total:</span>
            <span className="px-3">${data.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
        <p className="mt-2">
          Questions? Contact us at {data.company.email} or {data.company.phone}
        </p>
      </div>
    </div>
  );
}
