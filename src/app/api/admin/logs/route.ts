import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const predictions = await prisma.prediction.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    const chats = await prisma.chatHistory.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    const logs = await prisma.log.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return NextResponse.json({
      predictions,
      chats,
      logs,
    });
  } catch (error: any) {
    console.error("Admin GET logs error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
