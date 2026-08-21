import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  BrainCircuit, 
  Wrench, 
  AlertTriangle, 
  DollarSign, 
  HeartPulse, 
  Lightbulb, 
  Cpu, 
  HelpCircle,
  Gauge,
  CalendarCheck
} from "lucide-react";

interface AICenterProps {
  currentBrand?: string;
  currentModel?: string;
  currentMileage?: number;
  currentYear?: number;
}

export default function AICenter({
  currentBrand = "",
  currentModel = "",
  currentMileage = 0,
  currentYear = 2022
}: AICenterProps) {
  // Inputs
  const [brand, setBrand] = useState(currentBrand);
  const [model, setModel] = useState(currentModel);
  const [year, setYear] = useState(currentYear || 2022);
  const [mileage, setMileage] = useState(currentMileage || 42000);
  const [symptoms, setSymptoms] = useState("");
  
  // Loading & Results
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Auto prepopulate if values are in localStorage from vehicles page
  useEffect(() => {
    const cachedBrand = localStorage.getItem("ai_brand");
    const cachedModel = localStorage.getItem("ai_model");
    const cachedMileage = localStorage.getItem("ai_mileage");
    const cachedYear = localStorage.getItem("ai_year");

    if (cachedBrand) {
      setBrand(cachedBrand);
      localStorage.removeItem("ai_brand");
    }
    if (cachedModel) {
      setModel(cachedModel);
      localStorage.removeItem("ai_model");
    }
    if (cachedMileage) {
      setMileage(Number(cachedMileage));
      localStorage.removeItem("ai_mileage");
    }
    if (cachedYear) {
      setYear(Number(cachedYear));
      localStorage.removeItem("ai_year");
    }
  }, []);

  const handleRunDiagnostics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !mileage) {
      alert("Please enter make, model, and current odometer mileage.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setLoadingStep(1);

    // Dynamic loading micro-copy simulation for amazing premium feel
    const timer1 = setTimeout(() => setLoadingStep(2), 1200);
    const timer2 = setTimeout(() => setLoadingStep(3), 2600);
    const timer3 = setTimeout(() => setLoadingStep(4), 4000);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          model,
          year,
          mileage,
          symptoms,
          partsHistory: []
        }),
      });

      const data = await response.json();
      
      // Delay response slightly if it finishes too fast, to preserve high-tech scan vibe
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 5200);

    } catch (error) {
      console.error("AI Scan error:", error);
      setIsLoading(false);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 1: return "Parsing vehicle metadata and odometer metrics...";
      case 2: return "Cross-referencing typical engineering tolerances and repair schedules...";
      case 3: return "Querying server-side LLM diagnostics and parts failure nodes...";
      case 4: return "Finalizing predicted service blueprints and custom care insights...";
      default: return "Initializing neural diagnosis...";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="ai-center-view">
      
      {/* Left parameters form panel */}
      <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-800">
          <BrainCircuit className="w-6 h-6 text-blue-500 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-sm text-slate-200">AI Diagnostic Parameters</h3>
            <p className="text-[10px] text-slate-500 font-medium">Server-side deep learning vehicle models.</p>
          </div>
        </div>

        <form onSubmit={handleRunDiagnostics} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Brand/Make *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="E.g. BMW"
                className="w-full p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Variant *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="E.g. 3 Series"
                className="w-full p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Odometer (mi) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reported Symptoms / Scent / Noises</label>
            <textarea
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g. Grinding sound during light braking, high vibration on steering column above 60mph..."
              className="w-full p-2.5 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 transition-colors resize-none leading-normal placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Sparkles className="w-4.5 h-4.5 text-blue-300 animate-bounce" />
            <span>{isLoading ? "Running Diagnostic Matrix..." : "Execute AI Diagnostic"}</span>
          </button>

        </form>

      </div>

      {/* Right results presentation board */}
      <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[460px]">
        
        {/* Dynamic State 1: Fresh / Empty */}
        {!isLoading && !result && (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-12 text-slate-400">
            <Cpu className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
            <h3 className="font-extrabold text-slate-200 text-sm">Diagnostic Deck Standby</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-normal">
              Supply vehicle parameters (brand, variant, symptoms) and launch the AI diagnostics engine. Predictions are sourced server-side with Gemini 3.5.
            </p>
          </div>
        )}

        {/* Dynamic State 2: Processing Scanner */}
        {isLoading && (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-12 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
              <BrainCircuit className="w-7 h-7 text-blue-500 absolute top-4.5 left-4.5 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-200 text-sm">Executing Neural Scan Sequence</h4>
              <p className="text-xs text-slate-500 font-semibold max-w-xs">{getLoadingMessage()}</p>
            </div>

            {/* Glowing fake progress bar */}
            <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${loadingStep * 25}%` }}
              />
            </div>
          </div>
        )}

        {/* Dynamic State 3: Analysis Loaded */}
        {!isLoading && result && (
          <div className="space-y-6">
            
            {/* Predictions Summary Card */}
            <div className="p-4 bg-blue-950/20 border border-blue-500/10 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400">
                <BrainCircuit className="w-4.5 h-4.5" />
                <span className="font-extrabold text-xs uppercase tracking-wider">AI Predictive Maintenance Forecast</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {result.maintenancePrediction}
              </p>
            </div>

            {/* Failure Risk sliders */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Failure Probability Matrix</span>
                <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded uppercase">Active Risk Checks</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.probabilityOfPartsFailure?.map((p: any, idx: number) => {
                  const isHighRisk = p.probability > 70;
                  return (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-200 text-xs truncate max-w-[120px]">{p.part}</span>
                        <span className={`text-[10px] font-extrabold ${isHighRisk ? "text-red-400" : "text-amber-400"}`}>{p.probability}%</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isHighRisk ? "bg-red-500" : "bg-amber-400"}`}
                          style={{ width: `${p.probability}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed truncate" title={p.reason}>{p.reason}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service recommendations list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prescribed Action Blueprint</span>
                <span className="text-[10px] text-slate-500 font-medium">Pricing approximations include custom labor schedules.</span>
              </div>
              <div className="space-y-2">
                {result.recommendedServices?.map((srv: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-bold text-slate-200">{srv.service}</div>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded mt-1 inline-block ${
                          srv.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {srv.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-extrabold text-sm text-slate-200">
                      ${srv.estimatedPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart care proactive tips footer */}
            <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl flex gap-3 text-xs">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Proactive Engineering Tip</span>
                <p className="text-slate-300 leading-normal mt-0.5">{result.customerCareTip}</p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
