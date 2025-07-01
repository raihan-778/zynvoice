import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, Calendar, Search, Building2, User, FileText, Calculator } from 'lucide-react';

// Types based on your schemas
interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate: number;
}

interface InvoiceFormData {
  companyId: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  currency: string;
  notes: string;
  terms: string;
  paymentTerms: number;
}

// Mock data - replace with actual API calls
const mockCompanies = [
  { _id: '1', name: 'Acme Corp', email: 'info@acme.com' },
  { _id: '2', name: 'Tech Solutions Ltd', email: 'hello@techsolutions.com' },
];

const mockClients = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', company: 'Client Corp', paymentTerms: 30 },
  { _id: '2', name: 'Jane Smith', email: 'jane@business.com', company: 'Business Inc', paymentTerms: 15 },
  { _id: '3', name: 'Bob Johnson', email: 'bob@startup.com', company: 'Startup LLC', paymentTerms: 45 },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export default function InvoiceFormBuilder() {
  const [companies] = useState(mockCompanies);
  const [clients] = useState(mockClients);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0
  });

  const form = useForm<InvoiceFormData>({
    defaultValues: {
      companyId: '',
      clientId: '',
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, rate: 0, amount: 0, taxRate: 0 }],
      taxRate: 0,
      discountType: 'percentage',
      discountValue: 0,
      currency: 'USD',
      notes: '',
      terms: '',
      paymentTerms: 30
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const watchedItems = form.watch('items');
  const watchedTaxRate = form.watch('taxRate');
  const watchedDiscountType = form.watch('discountType');
  const watchedDiscountValue = form.watch('discountValue');

  // Calculate amounts whenever items change
  useEffect(() => {
    const items = watchedItems || [];
    
    // Calculate item amounts and subtotal
    let subtotal = 0;
    items.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      form.setValue(`items.${index}.amount`, amount);
      subtotal += amount;
    });

    // Calculate discount
    let discountAmount = 0;
    if (watchedDiscountType === 'percentage') {
      discountAmount = (subtotal * (watchedDiscountValue || 0)) / 100;
    } else {
      discountAmount = watchedDiscountValue || 0;
    }

    // Calculate tax
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * (watchedTaxRate || 0)) / 100;

    // Calculate total
    const total = taxableAmount + taxAmount;

    setCalculations({
      subtotal,
      discountAmount,
      taxAmount,
      total
    });
  }, [watchedItems, watchedTaxRate, watchedDiscountType, watchedDiscountValue, form]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    form.setValue('clientId', client._id);
    form.setValue('paymentTerms', client.paymentTerms);
    setClientSearch(client.name);
    setShowClientDropdown(false);
    
    // Update due date based on payment terms
    const dueDate = new Date(Date.now() + client.paymentTerms * 24 * 60 * 60 * 1000);
    form.setValue('dueDate', dueDate.toISOString().split('T')[0]);
  };

  const addLineItem = () => {
    append({ description: '', quantity: 1, rate: 0, amount: 0, taxRate: 0 });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = (data: InvoiceFormData) => {
    console.log('Invoice Data:', {
      ...data,
      subtotal: calculations.subtotal,
      discountAmount: calculations.discountAmount,
      taxAmount: calculations.taxAmount,
      total: calculations.total
    });
    // Here you would submit to your API
    alert('Invoice created successfully! Check console for data.');
  };

  const selectedCurrency = currencies.find(c => c.code === form.watch('currency'));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Invoice</h1>
        <p className="text-gray-600">Fill in the details below to generate your invoice</p>
      </div>

      <div className="space-y-8">
        {/* Company & Client Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Company *
              </label>
              <select
                {...form.register('companyId', { required: 'Company is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a company...</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.companyId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyId.message}</p>
              )}
            </div>
          </div>

          {/* Client Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder="Search clients..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              
              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <button
                        key={client._id}
                        type="button"
                        onClick={() => handleClientSelect(client)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                        {client.company && (
                          <div className="text-sm text-gray-400">{client.company}</div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No clients found</div>
                  )}
                </div>
              )}
              {form.formState.errors.clientId && (
                <p className="text-red-500 text-sm mt-1">Client is required</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number *
            </label>
            <input
              {...form.register('invoiceNumber', { required: 'Invoice number is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date *
            </label>
            <div className="relative">
              <input
                type="date"
                {...form.register('invoiceDate', { required: 'Invoice date is required' })}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <div className="relative">
              <input
                type="date"
                {...form.register('dueDate', { required: 'Due date is required' })}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="px-4 py-3 grid grid-cols-12 gap-4 border-t border-gray-200">
                <div className="col-span-5">
                  <input
                    {...form.register(`items.${index}.description`, { 
                      required: 'Description is required' 
                    })}
                    placeholder="Item description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...form.register(`items.${index}.quantity`, { 
                      required: 'Quantity is required',
                      min: { value: 0.01, message: 'Quantity must be greater than 0' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l">
                      {selectedCurrency?.symbol || '$'}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`items.${index}.rate`, { 
                        required: 'Rate is required',
                        min: { value: 0, message: 'Rate cannot be negative' }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-300 rounded text-gray-700">
                    {selectedCurrency?.symbol || '$'}{form.watch(`items.${index}.amount`)?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    disabled={fields.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...form.register('taxRate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  {...form.register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  {...form.register('discountType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l">
                    {form.watch('discountType') === 'percentage' ? '%' : selectedCurrency?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('discountValue')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Invoice Summary</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{selectedCurrency?.symbol || '$'}{calculations.subtotal.toFixed(2)}</span>
              </div>
              
              {calculations.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{selectedCurrency?.symbol || '$'}{calculations.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {calculations.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({form.watch('taxRate')}%):</span>
                  <span className="font-medium">{selectedCurrency?.symbol || '$'}{calculations.taxAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{selectedCurrency?.symbol || '$'}{calculations.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...form.register('notes')}
              rows={4}
              placeholder="Additional notes for this invoice..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              {...form.register('terms')}
              rows={4}
              placeholder="Payment terms and conditions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}