import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: List all diseases
export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        symptoms: {
          include: {
            symptom: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(diseases);
  } catch (error: any) {
    console.error("Admin GET diseases error:", error);
    return NextResponse.json({ error: "Failed to fetch diseases" }, { status: 500 });
  }
}

// POST: Add new disease
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      causes,
      diagnosis,
      treatment,
      riskFactors,
      severityLevel,
      symptoms, // Array of { name: string, category: string, weight: number }
    } = body;

    if (!name || !description || !severityLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create the disease
    const disease = await prisma.disease.create({
      data: {
        name,
        description,
        causes: causes || "",
        diagnosis: diagnosis || "",
        treatment: treatment || "",
        riskFactors: riskFactors || "",
        severityLevel,
      },
    });

    // 2. Link symptoms if provided
    if (symptoms && Array.isArray(symptoms)) {
      for (const sym of symptoms) {
        // Upsert symptom first
        const dbSymptom = await prisma.symptom.upsert({
          where: { name: sym.name },
          update: {},
          create: {
            name: sym.name,
            category: sym.category || "General",
          },
        });

        // Link with weight
        await prisma.diseaseSymptom.create({
          data: {
            diseaseId: disease.id,
            symptomId: dbSymptom.id,
            frequencyWeight: sym.weight !== undefined ? Number(sym.weight) : 1.0,
          },
        });
      }
    }

    await prisma.log.create({
      data: {
        action: "Create Disease",
        details: `Created new disease: "${name}" (Severity: ${severityLevel})`,
      },
    });

    return NextResponse.json({ success: true, disease });
  } catch (error: any) {
    console.error("Admin POST disease error:", error);
    return NextResponse.json({ error: "Failed to create disease" }, { status: 500 });
  }
}

// PUT: Update disease
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      causes,
      diagnosis,
      treatment,
      riskFactors,
      severityLevel,
      symptoms, // Array of { name: string, category: string, weight: number }
    } = body;

    if (!id || !name || !description || !severityLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Update disease details
    const disease = await prisma.disease.update({
      where: { id },
      data: {
        name,
        description,
        causes: causes || "",
        diagnosis: diagnosis || "",
        treatment: treatment || "",
        riskFactors: riskFactors || "",
        severityLevel,
      },
    });

    // 2. If symptoms are provided, replace them
    if (symptoms && Array.isArray(symptoms)) {
      // Clear old symptoms
      await prisma.diseaseSymptom.deleteMany({
        where: { diseaseId: id },
      });

      // Link new ones
      for (const sym of symptoms) {
        const dbSymptom = await prisma.symptom.upsert({
          where: { name: sym.name },
          update: {},
          create: {
            name: sym.name,
            category: sym.category || "General",
          },
        });

        await prisma.diseaseSymptom.create({
          data: {
            diseaseId: id,
            symptomId: dbSymptom.id,
            frequencyWeight: sym.weight !== undefined ? Number(sym.weight) : 1.0,
          },
        });
      }
    }

    await prisma.log.create({
      data: {
        action: "Update Disease",
        details: `Updated disease: "${name}" (ID: ${id})`,
      },
    });

    return NextResponse.json({ success: true, disease });
  } catch (error: any) {
    console.error("Admin PUT disease error:", error);
    return NextResponse.json({ error: "Failed to update disease" }, { status: 500 });
  }
}

// DELETE: Delete disease
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Disease ID is required" }, { status: 400 });
    }

    const disease = await prisma.disease.delete({
      where: { id },
    });

    await prisma.log.create({
      data: {
        action: "Delete Disease",
        details: `Deleted disease: "${disease.name}" (ID: ${id})`,
      },
    });

    return NextResponse.json({ success: true, message: `Disease ${disease.name} deleted` });
  } catch (error: any) {
    console.error("Admin DELETE disease error:", error);
    return NextResponse.json({ error: "Failed to delete disease" }, { status: 500 });
  }
}
