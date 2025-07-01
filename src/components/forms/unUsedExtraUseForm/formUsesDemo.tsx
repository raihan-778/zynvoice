import {
  Building,
  Calculator,
  Eye,
  Hash,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const InvoiceFormBuilder = () => {
  // Company Information State
  const [companyInfo, setCompanyInfo] = useState({
    name: "Your Company Name",
    address: "123 Business Street",
    city: "City",
    state: "State",
    zip: "12345",
    phone: "(555) 123-4567",
    email: "info@company.com",
    website: "www.company.com",
  });

  // Client Information State
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Client A",
      email: "clienta@email.com",
      address: "456 Client St, City, State 67890",
    },
    {
      id: 2,
      name: "Client B",
      email: "clientb@email.com",
      address: "789 Customer Ave, City, State 54321",
    },
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Invoice Details State
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    terms: "Net 30",
    notes: "",
  });

  // Line Items State
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  // Tax and Discount State
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [discountType, setDiscountType] = useState("percentage"); // 'percentage' or 'fixed'

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * discountRate) / 100
      : discountRate;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  // Update line item amount when quantity or rate changes
  useEffect(() => {
    setLineItems((items) =>
      items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      }))
    );
  }, []);

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map((item) => item.id)) + 1;
    setLineItems([
      ...lineItems,
      {
        id: newId,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id, field, value) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addClient = () => {
    if (newClient.name && newClient.email) {
      const newId = Math.max(...clients.map((c) => c.id)) + 1;
      const clientToAdd = { ...newClient, id: newId };
      setClients([...clients, clientToAdd]);
      setSelectedClient(clientToAdd);
      setNewClient({ name: "", email: "", address: "" });
      setShowNewClient(false);
    }
  };

  const handleSave = () => {
    const invoiceData = {
      companyInfo,
      client: selectedClient,
      invoiceDetails,
      lineItems,
      taxRate,
      discountRate,
      discountType,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      createdAt: new Date().toISOString(),
    };

    console.log("Invoice Data:", invoiceData);
    alert("Invoice saved! Check console for data structure.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Invoice
        </h1>
        <p className="text-gray-600">
          Build and customize your invoice with dynamic calculations
        </p>
      </div>

      {/* Company Information Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border">
        <div className="flex items-center mb-4">
          <Building className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Company Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={companyInfo.address}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="City"
              value={companyInfo.city}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, city: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              value={companyInfo.state}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, state: e.target.value })
              }
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="ZIP"
              value={companyInfo.zip}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, zip: e.target.value })
              }
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Client Information Section */}
      <div className="mb-8 p-6 bg-green-50 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Client Information
            </h2>
          </div>
          <button
            onClick={() => setShowNewClient(!showNewClient)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Client
          </button>
        </div>

        {showNewClient && (
          <div className="mb-4 p-4 bg-white rounded-md border-2 border-green-200">
            <h3 className="font-medium text-gray-900 mb-3">Add New Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Client Email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <input
              type="text"
              placeholder="Client Address"
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={addClient}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Client
              </button>
              <button
                onClick={() => setShowNewClient(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Client
          </label>
          <select
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const client = clients.find(
                (c) => c.id === parseInt(e.target.value)
              );
              setSelectedClient(client || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Choose a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        </div>

        {selectedClient && (
          <div className="mt-4 p-3 bg-white rounded-md border">
            <p className="font-medium">{selectedClient.name}</p>
            <p className="text-gray-600">{selectedClient.email}</p>
            <p className="text-gray-600">{selectedClient.address}</p>
          </div>
        )}
      </div>

      {/* Invoice Details Section */}
      <div className="mb-8 p-6 bg-purple-50 rounded-lg border">
        <div className="flex items-center mb-4">
          <Hash className="h-5 w-5 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Invoice Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceDetails.invoiceNumber}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  invoiceNumber: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDetails.date}
              onChange={(e) =>
                setInvoiceDetails({ ...invoiceDetails, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={invoiceDetails.dueDate}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  dueDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms
            </label>
            <select
              value={invoiceDetails.terms}
              onChange={(e) =>
                setInvoiceDetails({ ...invoiceDetails, terms: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="mb-8 p-6 bg-orange-50 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
          </div>
          <button
            onClick={addLineItem}
            className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-700">
                  Description
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700 w-20">
                  Qty
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700 w-24">
                  Rate
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700 w-24">
                  Amount
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Description of work or product..."
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculations & Totals Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Calculations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax and Discount Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <div className="flex gap-2">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">$</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountRate}
                  onChange={(e) =>
                    setDiscountRate(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Totals Display */}
          <div className="bg-white p-4 rounded-md border-2 border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({taxRate}%):</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
              )}

              <hr className="my-2" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-8 p-6 bg-yellow-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Notes & Terms
        </h3>
        <textarea
          value={invoiceDetails.notes}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })
          }
          placeholder="Additional notes, payment instructions, or terms..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => window.print()}
          className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Eye className="h-5 w-5 mr-2" />
          Preview
        </button>

        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Invoice
        </button>
      </div>

      {/* Summary Card */}
      <div className="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Invoice Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Client:</span>
            <p className="font-medium">
              {selectedClient?.name || "Not selected"}
            </p>
          </div>
          <div>
            <span className="text-blue-700">Items:</span>
            <p className="font-medium">{lineItems.length}</p>
          </div>
          <div>
            <span className="text-blue-700">Due Date:</span>
            <p className="font-medium">{invoiceDetails.dueDate}</p>
          </div>
          <div>
            <span className="text-blue-700">Total:</span>
            <p className="font-medium text-lg">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormBuilder;
