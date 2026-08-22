import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, generateMockAiAnalysis } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { brand, model, mileage, year, symptoms, partsHistory } = await req.json();

    const ai = getGeminiClient();
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Returning emulated server-side AI response.");
      return NextResponse.json(generateMockAiAnalysis(brand, model, mileage, symptoms));
    }

    const prompt = `You are an elite automotive diagnostic artificial intelligence. Analyze this vehicle:
Brand: ${brand}
Model: ${model}
Year: ${year}
Current Mileage: ${mileage} miles
Reported Symptoms / Customer Description: ${symptoms || "Regular checkup"}
Replaced Parts History: ${JSON.stringify(partsHistory || [])}

Provide a production-ready JSON analysis. Return exactly a single JSON object. Do not add any markdown decorators (like \`\`\`json). The JSON object must have exactly the following structure:
{
  "maintenancePrediction": "A detailed 1-2 sentence forecast of maintenance needs based on typical wear patterns for this model at this mileage.",
  "probabilityOfPartsFailure": [
    { "part": "Brake Pads", "probability": 85, "reason": "Due to reported grinding symptoms and standard wear timeline." },
    { "part": "12V Battery", "probability": 30, "reason": "Typical lifecycle expiration at this age/mileage." }
  ],
  "recommendedServices": [
    { "service": "Front Rotor & Pad Replacement", "estimatedPrice": 350, "priority": "High" }
  ],
  "customerCareTip": "A friendly proactive advice tip regarding this vehicle variant."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const cleanedText = response.text?.trim() || "{}";
    let parsedResult;
    try {
      const jsonStart = cleanedText.indexOf("{");
      const jsonEnd = cleanedText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        parsedResult = JSON.parse(cleanedText.substring(jsonStart, jsonEnd + 1));
      } else {
        parsedResult = JSON.parse(cleanedText);
      }
    } catch (parseError) {
      console.error("Gemini output parsing failed, clean response was:", cleanedText);
      parsedResult = generateMockAiAnalysis(brand, model, mileage, symptoms);
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    return NextResponse.json({
      error: "Gemini analysis error",
      details: error.message,
      fallback: generateMockAiAnalysis("Honda", "Accord", 41200, "Grinding noise"),
    }, { status: 500 });
  }
}
