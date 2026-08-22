import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export function generateMockAiAnalysis(brand: string, model: string, mileage: number, symptoms: string) {
  const isHighMileage = mileage > 80000;
  const Grinds = String(symptoms).toLowerCase().includes("grind") || String(symptoms).toLowerCase().includes("brake");
  const Squeals = String(symptoms).toLowerCase().includes("squeal") || String(symptoms).toLowerCase().includes("noise");
  const Electric = brand.toLowerCase() === "tesla" || brand.toLowerCase() === "nissan leaf";

  return {
    maintenancePrediction: `Based on a mileage of ${mileage} miles, this ${brand} ${model} is approaching standard ${isHighMileage ? "major drivetrain" : "mid-tier wear"} service boundaries. Focus should reside on fluid degradation checks and structural elastomer boots.`,
    probabilityOfPartsFailure: [
      {
        part: Grinds || Squeals ? "Brake Rotors & Pads" : "Cabin HEPA Filters",
        probability: Grinds || Squeals ? 92 : 65,
        reason: Grinds ? "Reported grinding directly indicates metal-on-metal rotor shaving." : "Standard high dust load and filtration limits.",
      },
      {
        part: Electric ? "Coolant Control Valves" : "Spark Plugs & Ignition Coils",
        probability: Electric ? 35 : 55,
        reason: Electric ? "Thermal balancing cycle counts on early EV iterations." : "Wear degradation cycle of heavy duty electrodes.",
      },
      {
        part: "Suspension Control Arm Bushings",
        probability: isHighMileage ? 75 : 25,
        reason: "Polyurethane decomposition accelerated by road moisture ingress.",
      },
    ],
    recommendedServices: [
      {
        service: Grinds || Squeals ? "Front Ventilated Brake System Overhaul" : "Complete Induction System Flush",
        estimatedPrice: Grinds || Squeals ? 450 : 185,
        priority: "High",
      },
      {
        service: Electric ? "Battery Coolant Recirculation Sweep" : "Synthetic Oil & Filter Service",
        estimatedPrice: Electric ? 220 : 85,
        priority: "Medium",
      },
    ],
    customerCareTip: `Proactive Tip: ${Electric ? "Regenerative braking reduces standard brake pad wear by up to 60%, but slider pins require lubricating annually to prevent winter binding." : "Regular throttle body wipe-downs prevent carbon buildup, keeping idle RPMs completely smooth."}`,
  };
}
