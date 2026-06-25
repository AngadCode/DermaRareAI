import { NextResponse } from "next/server";
import { analyzeSymptomsWithAI } from "@/lib/groq";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: "Invalid symptoms list. Must be a non-empty array of strings." },
        { status: 400 }
      );
    }

    // Call the AI matching and reasoning engine
    const analysisResult = await analyzeSymptomsWithAI(symptoms);

    // Save prediction record to database
    await prisma.prediction.create({
      data: {
        inputSymptoms: JSON.stringify(symptoms),
        resultData: JSON.stringify(analysisResult),
      },
    });

    // Save log entry
    await prisma.log.create({
      data: {
        action: "Symptom Check",
        details: `Analyzed symptoms: [${symptoms.join(", ")}]. Top match: ${
          analysisResult.possible_diseases[0]?.name || "None"
        } (${analysisResult.possible_diseases[0]?.confidence || 0}%).`,
      },
    });

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Symptom checker API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
