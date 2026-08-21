import React, { useState } from "react";
import { 
  Wrench, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Warehouse, 
  Barcode, 
  QrCode, 
  Tags, 
  Compass, 
  ChevronRight,
  TrendingDown,
  LineChart
} from "lucide-react";
import { SparePart } from "../types";

interface SparePartsProps {
  parts: SparePart[];
  onAddPart: (part: any) => void;
  onUpdatePart: (id: string, part: any) => void;
}

export default function SpareParts({
  parts,
  onAddPart,
  onUpdatePart
}: SparePartsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  // New Part Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<any>("Engine");
  const [stock, setStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [purchasePrice, setPurchasePrice] = useState(30);
  const [sellingPrice, setSellingPrice] = useState(60);
  const [supplier, setSupplier] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");

  const filteredParts = parts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      alert("Name and SKU are required fields");
      return;
    }

    onAddPart({
      name,
      sku,
      category,
      stock: Number(stock),
      minStock: Number(minStock),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      supplier: supplier || "OEM Direct Parts",
      warehouseLocation: warehouseLocation || "Aisle 1",
      compatibleVehicles: ["Universal Fit"]
    });

    // Reset Form
    setName("");
    setSku("");
    setStock(10);
    setMinStock(5);
    setPurchasePrice(30);
    setSellingPrice(60);
    setSupplier("");
    setWarehouseLocation("");
    setShowAddForm(false);
  };

  const handleAdjustStock = (part: SparePart, amount: number) => {
    const updatedStock = Math.max(0, part.stock + amount);
    onUpdatePart(part.id, { stock: updatedStock });
    if (selectedPart?.id === part.id) {
      setSelectedPart({
        ...selectedPart,
        stock: updatedStock
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="parts-tab-view">
      
      {/* Spare Parts List */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search parts inventory by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-950/40 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#020617] text-slate-300">All Categories</option>
              <option value="Engine" className="bg-[#020617] text-slate-300">Engine</option>
              <option value="Brakes" className="bg-[#020617] text-slate-300">Brakes</option>
              <option value="Fluids" className="bg-[#020617] text-slate-300">Fluids</option>
              <option value="Filters" className="bg-[#020617] text-slate-300">Filters</option>
              <option value="Electrical" className="bg-[#020617] text-slate-300">Electrical</option>
            </select>

            <button
              id="add-part-btn"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Catalog Part</span>
            </button>
          </div>
        </div>

        {/* Add part catalog modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 w-full max-w-lg shadow-2xl relative">
              <h3 className="font-extrabold text-slate-200 text-base mb-4">Register Inventory Spare Part</h3>
              
              <form onSubmit={handleCreatePart} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Part Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g. Brembo Brake Pads"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Unique SKU / Part Number *</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="E.g. BRM-902-CER"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg font-mono focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors cursor-pointer"
                    >
                      <option value="Engine" className="bg-[#020617] text-slate-300">Engine</option>
                      <option value="Brakes" className="bg-[#020617] text-slate-300">Brakes</option>
                      <option value="Electrical" className="bg-[#020617] text-slate-300">Electrical</option>
                      <option value="Suspension" className="bg-[#020617] text-slate-300">Suspension</option>
                      <option value="Filters" className="bg-[#020617] text-slate-300">Filters</option>
                      <option value="Fluids" className="bg-[#020617] text-slate-300">Fluids</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Opening Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Minimum Safety Level</label>
                    <input
                      type="number"
                      value={minStock}
                      onChange={(e) => setMinStock(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Purchase Unit Cost ($)</label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Selling Price ($)</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Distributor Supplier</label>
                    <input
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="E.g. AutoZone Direct"
                      className="w-full text-xs p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Warehouse Aisle Slot</label>
                    <input
                      type="text"
                      value={warehouseLocation}
                      onChange={(e) => setWarehouseLocation(e.target.value)}
                      placeholder="E.g. Aisle 3, Shelf B"
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
                    Commit to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Spare Parts Grid list */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Part Details</th>
                  <th className="p-4">SKU / Number</th>
                  <th className="p-4">Stock State</th>
                  <th className="p-4">Buying cost</th>
                  <th className="p-4">Selling cost</th>
                  <th className="p-4 text-right">Instant Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                {filteredParts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No matching spare parts in catalog.
                    </td>
                  </tr>
                ) : (
                  filteredParts.map((p) => {
                    const isLow = p.stock < p.minStock;
                    return (
                      <tr 
                        key={p.id}
                        onClick={() => setSelectedPart(p)}
                        className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${
                          selectedPart?.id === p.id ? "bg-blue-500/5 font-medium" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-bold text-slate-200">{p.name}</div>
                            <span className="text-[9px] text-slate-400 font-bold bg-slate-950/40 border border-slate-850 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                              {p.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">
                          {p.sku}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={isLow ? "text-red-400" : "text-slate-300"}>
                              {p.stock} units
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/15 text-[9px] flex items-center gap-0.5 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low stock</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium">${p.purchasePrice}</td>
                        <td className="p-4 font-bold text-slate-200">${p.sellingPrice}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleAdjustStock(p, -1)}
                              className="w-7 h-7 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 rounded font-bold text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, 1)}
                              className="w-7 h-7 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 rounded font-bold text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
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

      {/* Right details deep dive */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {selectedPart ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 border-b border-slate-850 pb-4 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <Wrench className="w-5 h-5 animate-spin-slow" />
              </div>
              <h3 className="font-extrabold text-base text-slate-200">{selectedPart.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">{selectedPart.sku}</p>
            </div>

            {/* Price margins */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pricing & Profit Margins</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Dealer Buying Cost</span>
                  <span className="font-bold text-slate-300">${selectedPart.purchasePrice}</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Retail Selling Price</span>
                  <span className="font-bold text-slate-300">${selectedPart.sellingPrice}</span>
                </div>
                <div className="p-2.5 bg-blue-500/5 border border-slate-850 rounded-lg col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Markup Gross Profit Margin</span>
                    <span className="font-bold text-blue-400">${(selectedPart.sellingPrice - selectedPart.purchasePrice).toFixed(2)}</span>
                  </div>
                  <span className="text-xs bg-blue-500/15 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/10">
                    {(((selectedPart.sellingPrice - selectedPart.purchasePrice) / selectedPart.purchasePrice) * 100).toFixed(0)}% ROI
                  </span>
                </div>
              </div>
            </div>

            {/* Physical location */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Location</h4>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center gap-3">
                <Warehouse className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-500 block text-[10px] font-medium">Warehouse Aisle Coordinates</span>
                  <span className="font-bold text-slate-200">{selectedPart.warehouseLocation || "Main Room, Shelf A"}</span>
                </div>
              </div>
            </div>

            {/* Barcode/QR Code render */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scannable Visual Identifiers</h4>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-center flex justify-around">
                <div className="text-center space-y-1">
                  <QrCode className="w-10 h-10 text-slate-400 mx-auto" />
                  <span className="text-[9px] text-slate-500 block font-semibold">QR Location Code</span>
                </div>
                <div className="text-center space-y-1">
                  <Barcode className="w-14 h-10 text-slate-400 mx-auto" />
                  <span className="text-[9px] text-slate-500 block font-semibold">UPC Barcode SKU</span>
                </div>
              </div>
            </div>

            {/* Compatible Models */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compatible Vehicle Fleets</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedPart.compatibleVehicles || []).map((v, idx) => (
                  <span key={idx} className="bg-slate-950/40 text-slate-400 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-850">
                    {v}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <Warehouse className="w-10 h-10 text-slate-700 mb-3" />
            <h4 className="font-bold text-xs text-slate-300">No Part Selected</h4>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">Select a catalog part from the table rows to access pricing markup margins, barcode labels, and physical warehouse mapping.</p>
          </div>
        )}
      </div>

    </div>
  );
}
