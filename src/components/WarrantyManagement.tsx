import React, { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Car, 
  Clock, 
  FileCheck2, 
  ShieldAlert, 
  Percent, 
  ChevronRight,
  ClipboardCheck
} from "lucide-react";
import { WarrantyPolicy, Vehicle } from "../types";

interface WarrantyManagementProps {
  policies: WarrantyPolicy[];
  vehicles: Vehicle[];
  onAddClaim: (policyId: string, claim: any) => void;
  onAddPolicy: (policy: any) => void;
}

export default function WarrantyManagement({
  policies,
  vehicles,
  onAddClaim,
  onAddPolicy
}: WarrantyManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<WarrantyPolicy | null>(null);

  // New claim state
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimPartName, setClaimPartName] = useState("");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimCost, setClaimCost] = useState(0);

  // New Policy Form state
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [vehId, setVehId] = useState("");
  const [policyType, setPolicyType] = useState<any>("Standard Manufacturer");
  const [durationMonths, setDurationMonths] = useState(36);
  const [coverageCapPrice, setCoverageCapPrice] = useState(5000);

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch = 
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehId) {
      alert("Please select a target vehicle profile");
      return;
    }

    const linkedVeh = vehicles.find((v) => v.id === vehId);
    if (!linkedVeh) return;

    onAddPolicy({
      vehicleId: vehId,
      vehicleName: `${linkedVeh.brand} ${linkedVeh.model}`,
      licensePlate: linkedVeh.licensePlate,
      customerId: linkedVeh.customerId,
      customerName: linkedVeh.customerName,
      policyNumber: `WAR-${Date.now().toString().substring(6)}`,
      policyType,
      startDate: new Date().toISOString().split("T")[0],
      durationMonths: Number(durationMonths),
      coverageCapPrice: Number(coverageCapPrice),
      deductible: 50,
      status: "Active",
      claims: []
    });

    setVehId("");
    setShowPolicyForm(false);
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy || !claimPartName || !claimDescription) {
      alert("Please enter claimed part and details");
      return;
    }

    onAddClaim(selectedPolicy.id, {
      partName: claimPartName,
      description: claimDescription,
      cost: Number(claimCost),
      claimDate: new Date().toISOString().split("T")[0],
      status: "Approved"
    });

    // Update in UI Selection
    setSelectedPolicy({
      ...selectedPolicy,
      claims: [
        ...(selectedPolicy.claims || []),
        {
          id: `CLM-${Date.now()}`,
          partName: claimPartName,
          description: claimDescription,
          cost: Number(claimCost),
          claimDate: new Date().toISOString().split("T")[0],
          status: "Approved"
        }
      ]
    });

    // Reset Form
    setClaimPartName("");
    setClaimDescription("");
    setClaimCost(0);
    setShowClaimForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="warranty-tab-view">
      
      {/* Policies List Column */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search policies by client, license plate, warranty number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              id="register-policy-btn"
              onClick={() => setShowPolicyForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Policy</span>
            </button>
          </div>
        </div>

        {/* Issue warranty policy modal */}
        {showPolicyForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Issue Warranty Coverage Policy</h3>
              
              <form onSubmit={handleCreatePolicy} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Target Vehicle Profile *</label>
                  <select
                    required
                    value={vehId}
                    onChange={(e) => setVehId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-[#020617] text-slate-400">-- Choose fleet/customer vehicle --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id} className="bg-[#020617] text-slate-300">{v.brand} {v.model} ({v.licensePlate})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Coverage Plan Type</label>
                    <select
                      value={policyType}
                      onChange={(e) => setPolicyType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Standard Manufacturer" className="bg-[#020617] text-slate-300">Standard Manufacturer</option>
                      <option value="Extended Bumper to Bumper" className="bg-[#020617] text-slate-300">Bumper-to-Bumper</option>
                      <option value="Powertrain Exclusive" className="bg-[#020617] text-slate-300">Powertrain Exclusive</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Duration Months</label>
                    <input
                      type="number"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Claims Maximum Cap Price ($)</label>
                  <input
                    type="number"
                    value={coverageCapPrice}
                    onChange={(e) => setCoverageCapPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPolicyForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    Issue Active Policy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Policies table roster */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Owner Customer</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Policy Number</th>
                  <th className="p-4">Plan Level</th>
                  <th className="p-4">Claims State</th>
                  <th className="p-4">Warranty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No warranty policy profiles registered.
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((p) => {
                    const claimsList = p.claims || [];
                    const totalClaimed = claimsList.reduce((acc, c) => acc + (c.cost || 0), 0);
                    return (
                      <tr 
                        key={p.id}
                        onClick={() => setSelectedPolicy(p)}
                        className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${
                          selectedPolicy?.id === p.id ? "bg-blue-500/5 font-medium" : ""
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-slate-200">{p.customerName}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-300 truncate max-w-[150px]">{p.vehicleName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{p.licensePlate}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-[11px] text-slate-500">
                          {p.policyNumber}
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-semibold text-slate-300">{p.policyType}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-300">{(p.claims || []).length} claims</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">${totalClaimed} of ${p.coverageCapPrice} Cap</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === "Active" 
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10" 
                              : "bg-red-500/15 text-red-400 border border-red-500/10"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Details claim deep dive panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedPolicy ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 border-b border-slate-850 pb-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-base text-slate-200">{selectedPolicy.policyNumber}</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                {selectedPolicy.policyType} PLAN
              </span>
            </div>

            {/* General policies info cards */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Coverage Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Insurance Cap</span>
                  <span className="font-bold text-slate-300">${selectedPolicy.coverageCapPrice}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Deductible Copay</span>
                  <span className="font-bold text-slate-300">${selectedPolicy.deductible}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg col-span-2">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Coverage Start Date</span>
                  <span className="font-bold text-slate-300">{selectedPolicy.startDate}</span>
                </div>
              </div>
            </div>

            {/* Claims History timeline list */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Claims History timeline ({(selectedPolicy.claims || []).length})</span>
                <button
                  id="claim-filing-btn"
                  onClick={() => setShowClaimForm(true)}
                  className="text-[10px] text-blue-400 font-bold hover:text-blue-300 transition-colors cursor-pointer"
                >
                  File New Claim
                </button>
              </div>

              {/* Claims Creation Form */}
              {showClaimForm && (
                <form onSubmit={handleCreateClaim} className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl text-xs space-y-3">
                  <h4 className="font-bold text-slate-300">File Insurance Claim Entry</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-500">Claimed Part *</label>
                      <input
                        type="text"
                        required
                        value={claimPartName}
                        onChange={(e) => setClaimPartName(e.target.value)}
                        placeholder="E.g. Caliper Rotors"
                        className="w-full p-2 bg-slate-950/40 text-slate-200 border border-slate-800 rounded focus:outline-none focus:border-slate-750 placeholder:text-slate-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-500">Estimate Price ($)</label>
                      <input
                        type="number"
                        required
                        value={claimCost}
                        onChange={(e) => setClaimCost(Number(e.target.value))}
                        className="w-full p-2 bg-slate-950/40 text-slate-200 border border-slate-800 rounded focus:outline-none focus:border-slate-750"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-500">Factual Symptoms Description *</label>
                    <input
                      type="text"
                      required
                      value={claimDescription}
                      onChange={(e) => setClaimDescription(e.target.value)}
                      placeholder="Structural failure under warranty standards..."
                      className="w-full p-2 bg-slate-950/40 text-slate-200 border border-slate-800 rounded focus:outline-none focus:border-slate-750 placeholder:text-slate-600"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowClaimForm(false)}
                      className="px-2.5 py-1 text-slate-500 hover:bg-slate-900 rounded text-[10px] font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Approve and Dispatch
                    </button>
                  </div>
                </form>
              )}

              {/* Claims feed timeline list */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
                {(!selectedPolicy.claims || selectedPolicy.claims.length === 0) ? (
                  <div className="text-xs text-slate-500 italic font-medium">No warranty claims have been filed.</div>
                ) : (
                  selectedPolicy.claims.map((clm) => (
                    <div key={clm.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 space-y-1 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-200">{clm.partName}</span>
                        <span className="text-blue-400">${clm.cost}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{clm.description}</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1.5 font-medium border-t border-slate-850">
                        <span>Filing: {clm.claimDate}</span>
                        <span className="text-emerald-400 uppercase font-bold">{clm.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <ShieldCheck className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Policy Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select a warranty policy from the rows roster to inspect claim histories, or dispatch new parts replacement approvals.</p>
          </div>
        )}
      </div>

    </div>
  );
}
