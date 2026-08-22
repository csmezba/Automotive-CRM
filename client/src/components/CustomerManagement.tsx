import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  PlusCircle, 
  FileText, 
  Upload, 
  Paperclip,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Customer, Vehicle } from "../types";

interface CustomerManagementProps {
  customers: Customer[];
  vehicles: Vehicle[];
  onAddCustomer: (customer: any) => void;
  onUpdateCustomer: (id: string, customer: any) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomerManagement({
  customers,
  vehicles,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer State Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustGroup, setNewCustGroup] = useState("Retail");
  const [newCustTags, setNewCustTags] = useState("");

  // Customer Note State Form
  const [newNoteText, setNewNoteText] = useState("");

  // Search/Filters logic
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery);

    const matchesGroup = selectedGroup === "All" || cust.group === selectedGroup;
    const matchesStatus = selectedStatus === "All" || cust.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;

    const parsedTags = newCustTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddCustomer({
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone,
      group: newCustGroup,
      tags: parsedTags,
      status: "Active",
      loyaltyPoints: 50, // Welcome points
    });

    // Clear form
    setNewCustName("");
    setNewCustEmail("");
    setNewCustPhone("");
    setNewCustTags("");
    setShowAddForm(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText || !selectedCustomer) return;

    const newNote = {
      id: `N-${Date.now()}`,
      author: "Service Advisor",
      text: newNoteText,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...(selectedCustomer.notes || []), newNote];
    onUpdateCustomer(selectedCustomer.id, { notes: updatedNotes });
    
    // Sync UI selection state
    setSelectedCustomer({
      ...selectedCustomer,
      notes: updatedNotes
    });
    setNewNoteText("");
  };

  const handleFileUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedCustomer) return;
    const file = e.target.files[0];
    
    const newDoc = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      type: file.type.includes("pdf") ? "pdf" : "image",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: "#",
      uploadedAt: new Date().toISOString()
    };

    const updatedDocs = [...(selectedCustomer.documents || []), newDoc];
    onUpdateCustomer(selectedCustomer.id, { documents: updatedDocs });
    
    setSelectedCustomer({
      ...selectedCustomer,
      documents: updatedDocs
    });
  };

  const linkedVehicles = selectedCustomer 
    ? vehicles.filter(v => v.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="customers-tab-view">
      
      {/* Customers List Section */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search customers by name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-slate-950/40 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#020617] text-slate-300">All Groups</option>
              <option value="Premium" className="bg-[#020617] text-slate-300">Premium Segment</option>
              <option value="Retail" className="bg-[#020617] text-slate-300">Retail Segment</option>
            </select>

            {/* Register New customer button */}
            <button
              id="register-customer-btn"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Customer Register Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Register New Customer Profile</h3>
              
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="E.g. Samantha Reed"
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      placeholder="samantha@example.com"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="206-555-xxxx"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Customer Segment</label>
                    <select
                      value={newCustGroup}
                      onChange={(e) => setNewCustGroup(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Retail" className="bg-[#020617] text-slate-300">Retail</option>
                      <option value="Premium" className="bg-[#020617] text-slate-300">Premium Segment</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tags (Comma Sep)</label>
                    <input
                      type="text"
                      value={newCustTags}
                      onChange={(e) => setNewCustTags(e.target.value)}
                      placeholder="VIP, Fleet-Owner"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
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
                    Register Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Customers Table List */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-850 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Segment</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Loyalty Points</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-xs text-slate-300">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No customer profiles matched the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr 
                      key={cust.id} 
                      onClick={() => setSelectedCustomer(cust)}
                      className={`hover:bg-slate-950/30 transition-colors cursor-pointer ${
                        selectedCustomer?.id === cust.id ? "bg-blue-500/5 font-medium" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-blue-500/10">
                            {cust.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200">{cust.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{cust.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          cust.group === "Premium" 
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                            : "bg-slate-950/60 text-slate-400 border border-slate-850"
                        }`}>
                          {cust.group}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {cust.tags.map((t, idx) => (
                            <span key={idx} className="bg-slate-950/40 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-slate-850">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-300">
                        {cust.loyaltyPoints} pts
                      </td>
                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to archive this profile?")) {
                              onDeleteCustomer(cust.id);
                              if (selectedCustomer?.id === cust.id) setSelectedCustomer(null);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-850 shrink-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deep-Dive Detailed Sidebar/Panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedCustomer ? (
          <div className="space-y-6">
            
            {/* Customer Core details */}
            <div className="text-center pb-4 border-b border-slate-800 space-y-2">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto uppercase shadow-lg shadow-blue-500/20">
                {selectedCustomer.name.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-200">{selectedCustomer.name}</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/10 mt-1 inline-block">
                  {selectedCustomer.status} PROFILE
                </span>
              </div>
              <div className="text-slate-400 text-xs flex justify-center items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-300">{selectedCustomer.loyaltyPoints} Loyalty points</span>
              </div>
            </div>

            {/* Communication Grid */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Information</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{selectedCustomer.email || "No Email Registered"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{selectedCustomer.phone || "No Phone Registered"}</span>
                </div>
              </div>
            </div>

            {/* Linked Vehicles list */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ownership Vehicles ({linkedVehicles.length})</h4>
              <div className="space-y-2">
                {linkedVehicles.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No vehicles registered under this profile.</div>
                ) : (
                  linkedVehicles.map(v => (
                    <div key={v.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-bold text-slate-200">{v.brand} {v.model}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{v.licensePlate} / VIN: {v.vin.substring(0, 7)}...</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded-full font-bold">{v.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes Section with Immediate Save */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timeline Timeline & Notes</h4>
              
              {/* Note creator */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add quick timeline note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs p-2 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 placeholder:text-slate-600 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center shrink-0 transition-colors"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                </button>
              </form>

              {/* Notes Timeline feed */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedCustomer.notes || []).map((note) => (
                  <div key={note.id} className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-xl text-[11px]">
                    <p className="text-slate-300 leading-normal">{note.text}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-medium mt-1.5">
                      <span>By {note.author}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents & File Drag/Drop Simulations */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document attachments</h4>
              
              {/* Upload Drop Simulator */}
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 text-center hover:bg-slate-950/30 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  onChange={handleFileUploadSimulate} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                <span className="text-[11px] text-slate-500 font-medium block">Drag PDF/Images or click to upload</span>
              </div>

              {/* File list */}
              <div className="space-y-1.5">
                {(selectedCustomer.documents || []).map((doc) => (
                  <div key={doc.id} className="p-2 bg-slate-950/40 rounded-lg flex items-center justify-between text-xs border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate text-[11px]">{doc.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 shrink-0">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <Users className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Customer Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select a customer profile from the roster to access communication timeline, attached documents, and notes.</p>
          </div>
        )}
      </div>

    </div>
  );
}
