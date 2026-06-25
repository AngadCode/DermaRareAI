import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    // Fetch predictions and logs
    const predictions = await prisma.prediction.findMany();
    const chats = await prisma.chatHistory.findMany();
    const logs = await prisma.log.findMany();

    // 1. Calculate stats
    const totalPredictions = predictions.length;
    const totalChats = chats.length;

    // 2. Count disease matches
    const diseaseMatchesCount: Record<string, number> = {};
    predictions.forEach((pred) => {
      try {
        const data = JSON.parse(pred.resultData);
        if (data.possible_diseases && data.possible_diseases.length > 0) {
          const topMatch = data.possible_diseases[0].name;
          diseaseMatchesCount[topMatch] = (diseaseMatchesCount[topMatch] || 0) + 1;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    });

    // 3. Count symptom usage
    const symptomFrequency: Record<string, number> = {};
    predictions.forEach((pred) => {
      try {
        const symptoms: string[] = JSON.parse(pred.inputSymptoms);
        symptoms.forEach((s) => {
          symptomFrequency[s] = (symptomFrequency[s] || 0) + 1;
        });
      } catch (e) {
        // Ignore JSON parse errors
      }
    });

    const reportData = {
      summary: {
        totalPredictions,
        totalChats,
        totalLogs: logs.length,
        timestamp: new Date().toISOString(),
      },
      topMatchedDiseases: Object.entries(diseaseMatchesCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      frequentSymptoms: Object.entries(symptomFrequency)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };

    // Return as CSV if requested
    if (format === "csv") {
      let csvContent = "REPORT SUMMARY\n";
      csvContent += `Generated At,${reportData.summary.timestamp}\n`;
      csvContent += `Total Predictions,${reportData.summary.totalPredictions}\n`;
      csvContent += `Total Chats,${reportData.summary.totalChats}\n\n`;

      csvContent += "TOP MATCHED DISEASES\nDisease,Match Count\n";
      reportData.topMatchedDiseases.forEach((d) => {
        csvContent += `"${d.name}",${d.count}\n`;
      });

      csvContent += "\nFREQUENTLY CHECKED SYMPTOMS\nSymptom,Check Count\n";
      reportData.frequentSymptoms.forEach((s) => {
        csvContent += `"${s.name}",${s.count}\n`;
      });

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=dermarare_ai_report.csv",
        },
      });
    }

    // Default JSON response
    return NextResponse.json(reportData);
  } catch (error: any) {
    console.error("Admin GET reports error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
