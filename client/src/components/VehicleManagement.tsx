import React, { useState } from "react";
import { 
  Car, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  Fuel, 
  ShieldAlert, 
  Gauge, 
  Disc, 
  HeartPulse, 
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { Vehicle, Customer } from "../types";

interface VehicleManagementProps {
  vehicles: Vehicle[];
  customers: Customer[];
  onAddVehicle: (vehicle: any) => void;
  onUpdateVehicle: (id: string, vehicle: any) => void;
  onDeleteVehicle: (id: string) => void;
}

export default function VehicleManagement({
  vehicles,
  customers,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle
}: VehicleManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // New Vehicle state Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState<any>("Petrol");
  const [transmission, setTransmission] = useState<any>("Automatic");
  const [mileage, setMileage] = useState(0);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = selectedBrand === "All" || v.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesStatus = selectedStatus === "All" || v.status === selectedStatus;

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || !licensePlate || !brand || !model || !customerId) {
      alert("Please complete all required fields (*)");
      return;
    }

    const linkedCust = customers.find((c) => c.id === customerId);

    onAddVehicle({
      customerId,
      customerName: linkedCust?.name || "Customer",
      vin: vin.toUpperCase(),
      licensePlate: licensePlate.toUpperCase(),
      brand,
      model,
      variant,
      year: Number(year),
      color,
      fuelType,
      transmission,
      mileage: Number(mileage),
      status: "Pending",
      insuranceExpiry: "2027-07-01",
      warrantyExpiry: "2028-07-01",
      accidentHistory: []
    });

    // Reset
    setCustomerId("");
    setVin("");
    setLicensePlate("");
    setBrand("");
    setModel("");
    setVariant("");
    setYear(new Date().getFullYear());
    setColor("");
    setMileage(0);
    setShowAddForm(false);
  };

  const handleVINLookup = () => {
    if (!vin || vin.length < 5) {
      alert("Please enter at least the first 5 characters of a VIN");
      return;
    }
    // Simulate smart API decoding
    setBrand("Honda");
    setModel("Civic");
    setVariant("Touring VTEC");
    setYear(2022);
    setTransmission("Automatic");
    setFuelType("Petrol");
    setColor("Platinum White");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="vehicles-tab-view">
      
      {/* Roster list */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search vehicles by brand, license plate, VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs bg-slate-950/40 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#020617] text-slate-300">All Brands</option>
              <option value="Honda" className="bg-[#020617] text-slate-300">Honda</option>
              <option value="BMW" className="bg-[#020617] text-slate-300">BMW</option>
              <option value="Tesla" className="bg-[#020617] text-slate-300">Tesla</option>
            </select>

            <button
              id="register-vehicle-btn"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Register vehicle modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-lg shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Add Fleet / Customer Vehicle</h3>
              
              <form onSubmit={handleCreateVehicle} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Owner Customer *</label>
                    <select
                      required
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-[#020617] text-slate-400">-- Link Customer Profile --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#020617] text-slate-300">{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">License Plate *</label>
                    <input
                      type="text"
                      required
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      placeholder="E.g. APX-901"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">VIN (17 Characters) *</label>
                    <button
                      type="button"
                      onClick={handleVINLookup}
                      className="text-[10px] text-blue-400 font-semibold hover:underline cursor-pointer"
                    >
                      Instant VIN Decoder API
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={17}
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    placeholder="Enter full 17 digit VIN"
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg font-mono focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Brand/Make *</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="E.g. Honda"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Model *</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="E.g. Accord"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Variant</label>
                    <input
                      type="text"
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      placeholder="Sport 2.0T"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Color</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Steel Grey"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Odometer Mileage</label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Fuel System</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Petrol" className="bg-[#020617] text-slate-300">Petrol</option>
                      <option value="Diesel" className="bg-[#020617] text-slate-300">Diesel</option>
                      <option value="EV" className="bg-[#020617] text-slate-300">EV</option>
                      <option value="Hybrid" className="bg-[#020617] text-slate-300">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Automatic" className="bg-[#020617] text-slate-300">Automatic</option>
                      <option value="Manual" className="bg-[#020617] text-slate-300">Manual</option>
                    </select>
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
                    Register Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-2xl">
              No vehicles found.
            </div>
          ) : (
            filteredVehicles.map((v) => (
              <div 
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`p-4 bg-slate-900/40 backdrop-blur-md border rounded-2xl shadow-sm hover:bg-slate-800/20 cursor-pointer transition-all flex gap-4 ${
                  selectedVehicle?.id === v.id 
                    ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20" 
                    : "border-slate-800"
                }`}
              >
                {/* Vehicle Thumbnail */}
                <img 
                  src={v.images[0]} 
                  alt={v.model} 
                  className="w-24 h-24 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" 
                />

                {/* Details info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-sm truncate">{v.brand} {v.model}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        v.status === "In Service" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" :
                        v.status === "Ready for Pickup" ? "bg-blue-500/10 text-blue-400 border border-blue-500/10" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">Owner: {v.customerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Disc className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-mono">{v.licensePlate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{v.mileage.toLocaleString()} mi</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right detailed side panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedVehicle ? (
          <div className="space-y-6">
            
            {/* Header profile */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-4">
              <img 
                src={selectedVehicle.images[0]} 
                alt={selectedVehicle.model} 
                className="w-full h-36 object-cover rounded-xl border border-slate-800" 
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-200">{selectedVehicle.brand} {selectedVehicle.model}</h3>
                <p className="text-[11px] font-mono text-slate-500">VIN: {selectedVehicle.vin}</p>
              </div>
            </div>

            {/* Core specs matrix */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Power System</span>
                  <div className="font-semibold text-slate-300 flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedVehicle.fuelType}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Transmission</span>
                  <span className="font-semibold text-slate-300">{selectedVehicle.transmission}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Year Built</span>
                  <span className="font-semibold text-slate-300">{selectedVehicle.year}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Paint Trim</span>
                  <span className="font-semibold text-slate-300">{selectedVehicle.color}</span>
                </div>
              </div>
            </div>

            {/* Insurance and Warranties card alerts */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Dates</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Insurance Coverage</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Expires: {selectedVehicle.insuranceExpiry}</div>
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold self-center">Active</span>
                </div>
                
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Manufacturer Warranty</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Expires: {selectedVehicle.warrantyExpiry}</div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold self-center">Standard</span>
                </div>
              </div>
            </div>

            {/* Accident history */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accident & Refurb History</h4>
              {selectedVehicle.accidentHistory.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-emerald-500" />
                  <span>No recorded structural accidents. Carfax Clear!</span>
                </div>
              ) : (
                selectedVehicle.accidentHistory.map((acc) => (
                  <div key={acc.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded">{acc.severity} Severity</span>
                      <span className="text-[9px] text-slate-500 font-semibold">{acc.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">{acc.description}</p>
                  </div>
                ))
              )}
            </div>

            {/* Diagnostics triggers shortcut */}
            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Selected vehicle state passed to AI diagnostic center.`);
                  // Can save target to localStorage or local state to prepopulate
                  localStorage.setItem("ai_brand", selectedVehicle.brand);
                  localStorage.setItem("ai_model", selectedVehicle.model);
                  localStorage.setItem("ai_mileage", String(selectedVehicle.mileage));
                  localStorage.setItem("ai_year", String(selectedVehicle.year));
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Prepopulate AI Analyzer</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <Car className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Vehicle Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select a vehicle from the roster grid to inspect specifications, structural accident history reports, and policy details.</p>
          </div>
        )}
      </div>

    </div>
  );
}
