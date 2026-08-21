import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  CreditCard, 
  Printer, 
  Send, 
  ChevronRight,
  TrendingUp,
  Receipt
} from "lucide-react";
import { Invoice, Customer, Vehicle, ServiceBooking } from "../types";

interface InvoicesProps {
  invoices: Invoice[];
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: ServiceBooking[];
  onAddInvoice: (invoice: any) => void;
  onUpdateInvoice: (id: string, invoice: any) => void;
}

export default function Invoices({
  invoices,
  customers,
  vehicles,
  bookings,
  onAddInvoice,
  onUpdateInvoice
}: InvoicesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10); // Default 10%
  const [paymentMethod, setPaymentMethod] = useState<any>("Cash");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "All" || inv.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // KPI computations
  const totalRevenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((acc, i) => acc + (i.totalAmount ?? i.total ?? 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === "Unpaid")
    .reduce((acc, i) => acc + (i.totalAmount ?? i.total ?? 0), 0);

  const overdueCount = invoices
    .filter(i => i.status === "Overdue")
    .length;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      alert("Please choose an active Booking reference to compute invoice elements.");
      return;
    }

    const linkedBooking = bookings.find(b => b.id === bookingId);
    if (!linkedBooking) return;

    // Calculate details
    const base = linkedBooking.estimatedCost;
    const computedTax = Number(((base * taxRate) / 100).toFixed(2));
    const computedDiscount = Number(discount.toFixed(2));
    const total = base + computedTax - computedDiscount;

    onAddInvoice({
      bookingId,
      customerId: linkedBooking.customerId,
      customerName: linkedBooking.customerName,
      customerPhone: linkedBooking.customerPhone,
      vehicleId: linkedBooking.vehicleId,
      vehicleName: linkedBooking.vehicleName,
      licensePlate: linkedBooking.licensePlate,
      subtotal: base,
      tax: computedTax,
      discount: computedDiscount,
      totalAmount: total,
      status: "Unpaid",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      paymentMethod,
      items: [
        {
          id: `ITEM-1`,
          description: `${linkedBooking.serviceType} Package Fee`,
          quantity: 1,
          unitPrice: base,
          totalPrice: base
        }
      ]
    });

    setBookingId("");
    setDiscount(0);
    setShowAddForm(false);
  };

  const handleCollectPayment = (inv: Invoice) => {
    onUpdateInvoice(inv.id, { status: "Paid" });
    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice({
        ...selectedInvoice,
        status: "Paid"
      });
    }
  };

  const handleSimulatePrint = () => {
    if (!selectedInvoice) return;
    alert(`Generating printable PDF document for Invoice reference: ${selectedInvoice.id}`);
  };

  const handleSimulateSend = () => {
    if (!selectedInvoice) return;
    alert(`Sending digital SMS/Email receipt statement link directly to client phone: ${selectedInvoice.customerPhone || "N/A"}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="invoices-tab-view">
      
      {/* Roster column with KPI Header */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* KPI Mini Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Cleared Revenue</span>
            <div className="text-base font-extrabold text-emerald-400">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div className="p-3.5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Unpaid Balance</span>
            <div className="text-base font-extrabold text-amber-500">${pendingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div className="p-3.5 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Overdue Accounts</span>
            <div className="text-base font-extrabold text-red-500">{overdueCount} invoices</div>
          </div>
        </div>

        {/* Search / Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoices by client name, reference ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-950/40 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#020617] text-slate-300">All statuses</option>
              <option value="Paid" className="bg-[#020617] text-slate-300">Paid</option>
              <option value="Unpaid" className="bg-[#020617] text-slate-300">Unpaid</option>
              <option value="Overdue" className="bg-[#020617] text-slate-300">Overdue</option>
            </select>

            <button
              id="create-invoice-btn"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Create Invoice model */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Draft New Billing Invoice</h3>
              
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Linked Service Appointment *</label>
                  <select
                    required
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-[#020617] text-slate-400">-- Choose Completed/Ready Bookings --</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id} className="bg-[#020617] text-slate-300">{b.customerName} - {b.serviceType} (${b.estimatedCost})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Deduction Discount ($)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Payment Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                  >
                    <option value="Cash" className="bg-[#020617] text-slate-300">Cash Ledger</option>
                    <option value="Credit Card" className="bg-[#020617] text-slate-300">Credit/Debit Card Terminal</option>
                    <option value="Bank Transfer" className="bg-[#020617] text-slate-300">Bank ACH Wire</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    Commit Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice table list */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Billing Reference</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Invoice Total</th>
                  <th className="p-4 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr 
                      key={inv.id} 
                      onClick={() => setSelectedInvoice(inv)}
                      className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${
                        selectedInvoice?.id === inv.id ? "bg-blue-500/5 font-medium" : ""
                      }`}
                    >
                      <td className="p-4 font-bold text-slate-200">
                        {inv.customerName}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {inv.id}
                      </td>
                      <td className="p-4 text-[11px]">
                        {inv.dueDate}
                      </td>
                      <td className="p-4 font-extrabold text-slate-200">
                        ${(inv.totalAmount ?? inv.total ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === "Paid" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10" :
                          inv.status === "Overdue" ? "bg-red-500/15 text-red-400 border border-red-500/10" :
                          "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Details PDF Simulation Receipt */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedInvoice ? (
          <div className="space-y-6">
            
            {/* Stamp Logo Receipt */}
            <div className="border border-slate-850 p-4 rounded-xl space-y-4 bg-slate-950/40 font-mono text-xs text-slate-300">
              <div className="text-center pb-3 border-b border-dashed border-slate-800 space-y-1">
                <Receipt className="w-6 h-6 text-slate-500 mx-auto" />
                <h3 className="font-extrabold text-slate-200 uppercase tracking-widest">Aero CRM Invoicing</h3>
                <span className="text-[10px] text-slate-500">Invoice: {selectedInvoice.id}</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-bold text-slate-200">{selectedInvoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-semibold text-slate-300">{selectedInvoice.vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plate:</span>
                  <span className="text-slate-300">{selectedInvoice.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="text-slate-300">{selectedInvoice.dueDate}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-800 py-2.5 space-y-1 text-[11px]">
                {selectedInvoice.items?.map((itm) => (
                  <div key={itm.id} className="flex justify-between">
                    <span className="text-slate-400">{itm.description} (x{itm.quantity})</span>
                    <span className="text-slate-300">${itm.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="text-slate-300">${(selectedInvoice.subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax Fee ({taxRate}%):</span>
                  <span className="text-slate-300">${(selectedInvoice.tax ?? 0).toFixed(2)}</span>
                </div>
                {(selectedInvoice.discount ?? selectedInvoice.discountAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount Applied:</span>
                    <span>-${(selectedInvoice.discount ?? selectedInvoice.discountAmount ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-extrabold text-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-400">${(selectedInvoice.totalAmount ?? selectedInvoice.total ?? 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-dashed border-slate-800">
                Payment Channel: {selectedInvoice.paymentMethod}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 pt-2">
              {selectedInvoice.status !== "Paid" ? (
                <button
                  onClick={() => handleCollectPayment(selectedInvoice)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-emerald-500/10 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as Settled / Cash Collected</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-xl text-center border border-emerald-500/10 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Invoice Completely Settled</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSimulatePrint}
                  className="py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={handleSimulateSend}
                  className="py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS/Mail</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <FileText className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Invoice Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select an invoice from the roster list to generate dynamic receipts, execute card/cash clearing, or dispatch client reminders.</p>
          </div>
        )}
      </div>

    </div>
  );
}
