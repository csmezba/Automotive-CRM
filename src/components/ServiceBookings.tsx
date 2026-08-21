import React, { useState } from "react";
import { 
  CalendarDays, 
  List, 
  Layers, 
  Plus, 
  Trash2, 
  User, 
  Wrench, 
  Signature, 
  Clock, 
  CheckSquare, 
  Check, 
  FileCheck, 
  MapPin, 
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { ServiceBooking, Customer, Vehicle, Mechanic } from "../types";

interface ServiceBookingsProps {
  bookings: ServiceBooking[];
  customers: Customer[];
  vehicles: Vehicle[];
  mechanics: Mechanic[];
  onAddBooking: (booking: any) => void;
  onUpdateBooking: (updated: ServiceBooking) => void;
  onDeleteBooking: (id: string) => void;
}

export default function ServiceBookings({
  bookings,
  customers,
  vehicles,
  mechanics,
  onAddBooking,
  onUpdateBooking,
  onDeleteBooking
}: ServiceBookingsProps) {
  const [viewType, setViewType] = useState<"table" | "calendar" | "kanban">("table");
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  // New Booking state Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [serviceType, setServiceType] = useState<any>("Oil Change");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(150);
  const [estimatedTimeHours, setEstimatedTimeHours] = useState(2);
  const [pickupRequired, setPickupRequired] = useState(false);
  const [dropRequired, setDropRequired] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");

  // Signature state simulation
  const [signatureData, setSignatureData] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  // Calendar logic state (defaults to July 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed, July

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !vehicleId || !bookingDate || !bookingTime) {
      alert("Please complete all required fields (*)");
      return;
    }

    const linkedCust = customers.find(c => c.id === customerId);
    const linkedVeh = vehicles.find(v => v.id === vehicleId);
    const linkedMech = mechanics.find(m => m.id === mechanicId);

    onAddBooking({
      customerId,
      customerName: linkedCust?.name || "Customer",
      customerPhone: linkedCust?.phone || "Unlisted",
      vehicleId,
      vehicleName: `${linkedVeh?.brand} ${linkedVeh?.model} (${linkedVeh?.licensePlate})`,
      licensePlate: linkedVeh?.licensePlate || "",
      mechanicId: mechanicId || undefined,
      mechanicName: linkedMech?.name || undefined,
      serviceType,
      bookingDate,
      bookingTime,
      status: "Pending",
      estimatedCost: Number(estimatedCost),
      estimatedTimeHours: Number(estimatedTimeHours),
      pickupRequired,
      dropRequired,
      customerNotes,
      checklist: getInitialChecklist(serviceType)
    });

    // Reset Form
    setCustomerId("");
    setVehicleId("");
    setMechanicId("");
    setServiceType("Oil Change");
    setBookingDate("");
    setBookingTime("");
    setEstimatedCost(150);
    setEstimatedTimeHours(2);
    setPickupRequired(false);
    setDropRequired(false);
    setCustomerNotes("");
    setShowAddForm(false);
  };

  const getInitialChecklist = (type: string) => {
    switch (type) {
      case "Brake Service":
        return [
          { id: "ck-1", item: "Safety road testing & validation", checked: false },
          { id: "ck-2", item: "Measure rotor wear state", checked: false },
          { id: "ck-3", item: "Install premium caliper pads", checked: false },
          { id: "ck-4", item: "Pressure bleed lines & top-off", checked: false }
        ];
      case "Oil Change":
        return [
          { id: "ck-1", item: "Drain used engine crank oil", checked: false },
          { id: "ck-2", item: "Install magnetic filter gasket", checked: false },
          { id: "ck-3", item: "Refill synthetic formula lubricant", checked: false },
          { id: "ck-4", item: "Reset cabin cluster service alert", checked: false }
        ];
      default:
        return [
          { id: "ck-1", item: "Comprehensive diagnostic code sweep", checked: false },
          { id: "ck-2", item: "25-point visual safety check", checked: false },
          { id: "ck-3", item: "Coolant and washer fluid top-off", checked: false }
        ];
    }
  };

  const handleStatusShift = (booking: ServiceBooking, nextStatus: any) => {
    onUpdateBooking({
      ...booking,
      status: nextStatus
    });
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking({
        ...selectedBooking,
        status: nextStatus
      });
    }
  };

  const handleCheckboxToggle = (booking: ServiceBooking, cId: string) => {
    const updatedChecklist = booking.checklist.map(item => 
      item.id === cId ? { ...item, checked: !item.checked } : item
    );
    const checkedCount = updatedChecklist.filter(c => c.checked).length;
    let nextStatus = booking.status;
    
    if (checkedCount === updatedChecklist.length && booking.status === "In Progress") {
      nextStatus = "Ready";
    }

    const updated = {
      ...booking,
      checklist: updatedChecklist,
      status: nextStatus
    };
    onUpdateBooking(updated);
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(updated);
    }
  };

  // Signature simulation
  const handleSignSimulate = () => {
    setIsSigning(true);
    setTimeout(() => {
      const dummySig = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAYAAAA66Gf3AAAAbklEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBlU1AAEl1u0fAAAAAElFTkSuQmCC";
      setSignatureData(dummySig);
      if (selectedBooking) {
        const updated = {
          ...selectedBooking,
          digitalSignature: dummySig,
          status: "Completed" as const
        };
        onUpdateBooking(updated);
        setSelectedBooking(updated);
      }
      setIsSigning(false);
    }, 1500);
  };

  // Calendar render helper
  const renderCalendar = () => {
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const gridDays = [];

    // Pad leading empty days
    for (let i = 0; i < startDay; i++) {
      gridDays.push(null);
    }
    // Fill monthly days
    for (let i = 1; i <= daysInMonth; i++) {
      gridDays.push(i);
    }

    return (
      <div className="grid grid-cols-7 gap-1 border border-slate-800 rounded-xl overflow-hidden text-xs bg-slate-950/40 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, dIdx) => (
          <div key={dIdx} className="text-center font-bold text-slate-500 py-2 uppercase text-[10px]">
            {day}
          </div>
        ))}
        {gridDays.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="bg-slate-900/10 min-h-[60px]" />;
          }

          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayBookings = bookings.filter((b) => b.bookingDate === dateStr);

          return (
            <div 
              key={idx} 
              onClick={() => {
                setBookingDate(dateStr);
                setShowAddForm(true);
              }}
              className="bg-[#020617]/40 min-h-[60px] p-1.5 border border-slate-900 hover:bg-slate-800/40 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <span className="font-bold text-slate-500 text-[10px]">{day}</span>
              <div className="space-y-1">
                {dayBookings.map((b) => (
                  <div 
                    key={b.id} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBooking(b);
                    }}
                    className={`text-[9px] font-bold px-1 py-0.5 rounded truncate border ${
                      b.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      b.status === "Ready" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      b.status === "In Progress" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                    title={`${b.customerName}: ${b.serviceType}`}
                  >
                    {b.serviceType}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Kanban view logic
  const kanbanColumns = [
    { status: "Pending", label: "Pending Confirmed" },
    { status: "In Progress", label: "In Active Service" },
    { status: "Ready", label: "Ready for Pickup" },
    { status: "Completed", label: "Completed Service" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bookings-tab-view">
      
      {/* Bookings View Columns */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Navigation Selector bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="flex gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewType("table")}
              className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewType === "table" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewType("calendar")}
              className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewType === "calendar" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewType("kanban")}
              className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewType === "kanban" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            id="schedule-booking-btn"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Booking</span>
          </button>
        </div>

        {/* Schedule booking modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-lg shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Schedule Service Appointment</h3>
              
              <form onSubmit={handleCreateBooking} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Customer Name *</label>
                    <select
                      required
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-[#020617] text-slate-400">-- Choose Customer --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#020617] text-slate-300">{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Owner Vehicle *</label>
                    <select
                      required
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-[#020617] text-slate-400">-- Choose Vehicle --</option>
                      {vehicles.filter(v => !customerId || v.customerId === customerId).map(v => (
                        <option key={v.id} value={v.id} className="bg-[#020617] text-slate-300">{v.brand} {v.model} ({v.licensePlate})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Time Slot *</label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Assign Mechanic</label>
                    <select
                      value={mechanicId}
                      onChange={(e) => setMechanicId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-[#020617] text-slate-400">-- Let System Assign --</option>
                      {mechanics.map(m => (
                        <option key={m.id} value={m.id} className="bg-[#020617] text-slate-300">{m.name} ({m.skills[0]})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Service Category</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Oil Change" className="bg-[#020617] text-slate-300">Oil Change</option>
                      <option value="Brake Service" className="bg-[#020617] text-slate-300">Brake Service</option>
                      <option value="Full Service" className="bg-[#020617] text-slate-300">Full Service</option>
                      <option value="General Repair" className="bg-[#020617] text-slate-300">General Repair</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Estimated Price ($)</label>
                    <input
                      type="number"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Labor Hours</label>
                    <input
                      type="number"
                      value={estimatedTimeHours}
                      onChange={(e) => setEstimatedTimeHours(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pickupRequired}
                      onChange={(e) => setPickupRequired(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Requires Valet Pickup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dropRequired}
                      onChange={(e) => setDropRequired(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Requires Valet Drop-off</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Symptom Description / Comments</label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="E.g. squeaking brakes, burning scent..."
                    className="w-full text-xs p-2 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none resize-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                  />
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
                    Schedule Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic view switcher body */}
        {viewType === "table" && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Service Type</th>
                    <th className="p-4">Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                  {bookings.map((b) => (
                    <tr 
                      key={b.id} 
                      onClick={() => setSelectedBooking(b)}
                      className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${
                        selectedBooking?.id === b.id ? "bg-blue-500/5 font-medium" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-slate-200">{b.customerName}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{b.customerPhone}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-300 truncate max-w-[150px]">{b.vehicleName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{b.licensePlate}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{b.serviceType}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Assigned: {b.mechanicName || "System Pool"}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{b.bookingDate}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{b.bookingTime}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          b.status === "Completed" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10" :
                          b.status === "Ready" ? "bg-blue-500/15 text-blue-400 border border-blue-500/10" :
                          b.status === "In Progress" ? "bg-amber-500/15 text-amber-400 border border-amber-500/10" :
                          "bg-slate-900 text-slate-500 border border-slate-800"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-200">
                        ${b.estimatedCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewType === "calendar" && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-200">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                    else { setCurrentMonth(currentMonth - 1); }
                  }}
                  className="p-1.5 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                    else { setCurrentMonth(currentMonth + 1); }
                  }}
                  className="p-1.5 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {renderCalendar()}
          </div>
        )}

        {viewType === "kanban" && (
          <div className="grid grid-cols-4 gap-3">
            {kanbanColumns.map((col) => {
              const colBookings = bookings.filter((b) => {
                if (col.status === "Pending") return b.status === "Pending" || b.status === "Confirmed";
                return b.status === col.status;
              });

              return (
                <div key={col.status} className="bg-slate-900/20 p-3 rounded-2xl border border-slate-800 flex flex-col min-h-[400px]">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span>{col.label}</span>
                    <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-bold">
                      {colBookings.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-0.5 scrollbar-thin">
                    {colBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-3 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl shadow-sm hover:bg-slate-800/20 cursor-pointer relative group transition-all ${
                          selectedBooking?.id === b.id ? "ring-2 ring-blue-500/30 border-blue-500/20" : ""
                        }`}
                      >
                        <div className="font-bold text-slate-200 truncate text-[11px]">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{b.licensePlate}</div>
                        <div className="text-[10px] text-slate-300 font-semibold mt-2">{b.serviceType}</div>
                        
                        {/* Interactive column shifts */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (b.status === "In Progress") handleStatusShift(b, "Pending");
                              if (b.status === "Ready") handleStatusShift(b, "In Progress");
                              if (b.status === "Completed") handleStatusShift(b, "Ready");
                            }}
                            disabled={b.status === "Pending"}
                            className="text-[9px] text-slate-500 hover:text-slate-300 disabled:opacity-20 font-bold"
                          >
                            ◄ Shift Back
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (b.status === "Pending") handleStatusShift(b, "In Progress");
                              else if (b.status === "In Progress") handleStatusShift(b, "Ready");
                              else if (b.status === "Ready") handleStatusShift(b, "Completed");
                            }}
                            disabled={b.status === "Completed"}
                            className="text-[9px] text-blue-400 hover:text-blue-300 disabled:opacity-20 font-bold"
                          >
                            Advance ►
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Right Details Panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedBooking ? (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-slate-500 font-mono">BOOKING REF: {selectedBooking.id}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedBooking.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" :
                  selectedBooking.status === "Ready" ? "bg-blue-500/10 text-blue-400 border border-blue-500/10" :
                  "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                }`}>
                  {selectedBooking.status}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-200">{selectedBooking.customerName}</h3>
              <p className="text-xs text-slate-400 font-semibold">{selectedBooking.vehicleName}</p>
            </div>

            {/* General appointment slots */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Appointment Slots</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <span className="text-[9px] text-slate-500 block font-medium">Target Date</span>
                  <span className="font-bold">{selectedBooking.bookingDate}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg">
                  <span className="text-[9px] text-slate-500 block font-medium">Scheduled Time</span>
                  <span className="font-bold">{selectedBooking.bookingTime}</span>
                </div>
              </div>
            </div>

            {/* Checklist synchronization */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technician Checklist Progress</h4>
              <div className="space-y-2 text-xs">
                {selectedBooking.checklist.map((item) => (
                  <label key={item.id} className="flex items-start gap-2.5 p-3 bg-slate-950/40 border border-slate-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxToggle(selectedBooking, item.id)}
                      className="rounded text-blue-600 mt-0.5 focus:ring-blue-500"
                    />
                    <span className={`text-[11px] leading-normal ${item.checked ? "line-through text-slate-600 font-medium" : "text-slate-300"}`}>
                      {item.item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Digital signature simulation */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Work Authorization</h4>
              
              {selectedBooking.digitalSignature ? (
                <div className="p-3 border border-slate-800 rounded-xl bg-slate-950/20 text-center">
                  <img src={selectedBooking.digitalSignature} alt="Signature" className="mx-auto h-12 object-contain" />
                  <span className="text-[9px] text-slate-500 font-semibold block mt-1">Authorized Completed Digital Stamp</span>
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center">
                  <Signature className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                  <span className="text-[11px] text-slate-500 font-medium block mb-2">Customer signature required to lock files</span>
                  
                  <button
                    onClick={handleSignSimulate}
                    disabled={isSigning}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    {isSigning ? "Scanning..." : "Simulate Live Authorize Signature"}
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <CalendarDays className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Appointment Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select an appointment card or list row to sync progress checkmarks, capture signature stamps, or change job status.</p>
          </div>
        )}
      </div>

    </div>
  );
}
