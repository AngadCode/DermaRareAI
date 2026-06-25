import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Groq from "groq-sdk";
import { matchSymptoms } from "@/lib/symptomMatcher";

const apiKey = process.env.GROQ_API_KEY || "";
const groq = apiKey ? new Groq({ apiKey }) : null;
const MODEL_NAME = "llama-3.1-8b-instant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const conversationHistory = history || [];

    // Analyze if there are symptoms mentioned in the user message
    // We can extract keywords that overlap with our symptom dictionary
    const allSymptoms = await prisma.symptom.findMany();
    const detectedSymptoms: string[] = [];
    const messageLower = message.toLowerCase();

    allSymptoms.forEach((s) => {
      const symNameLower = s.name.toLowerCase();
      if (messageLower.includes(symNameLower) || symNameLower.includes(messageLower)) {
        detectedSymptoms.push(s.name);
      }
    });

    // Also run matcher if symptoms are found
    const matches = detectedSymptoms.length > 0 ? await matchSymptoms(detectedSymptoms) : [];

    let chatResponseText = "";
    let possibleDiseases: any[] = [];
    let followUpQuestions: string[] = [];

    if (groq) {
      try {
        const systemPrompt = `You are a professional medical education AI assistant for the DermaRare AI platform. 
Your goal is to answer user questions about rare skin diseases in a conversational, helpful, and highly professional manner.

RULES:
1. Provide educational insights only. Never declare a diagnosis or prescribe treatments.
2. If the user describes symptoms, reference the possible matching diseases from our database (Matched: ${matches.map((m) => `${m.name} (${m.confidence}%)`).join(", ") || "None"}).
3. Always include 2-3 logical follow-up questions.
4. Output your response as a valid JSON object matching the schema below. Do not add any text before or after the JSON.

Output JSON Schema:
{
  "message": "AI conversational message to the user here...",
  "possible_diseases": [
    {
      "name": "Disease Name",
      "confidence": 75,
      "matched_symptoms": ["Symptom A"],
      "explanation": "Why it matches"
    }
  ],
  "follow_up_questions": [
    "Suggested follow-up question 1?",
    "Suggested follow-up question 2?"
  ],
  "disclaimer": "This chat is for educational purposes only. Never disregard professional medical advice because of something you read here."
}`;

        const messages = [
          { role: "system", content: systemPrompt },
          ...conversationHistory.slice(-6).map((h: any) => ({
            role: h.role,
            content: h.content,
          })),
          { role: "user", content: message },
        ];

        const response = await groq.chat.completions.create({
          model: MODEL_NAME,
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        chatResponseText = parsed.message || "";
        possibleDiseases = parsed.possible_diseases || [];
        followUpQuestions = parsed.follow_up_questions || [];
      } catch (err) {
        console.error("Groq chat completion error:", err);
        // Fallback to simulated chat logic if API fails
        const simulated = getSimulatedChat(message, detectedSymptoms, matches);
        chatResponseText = simulated.message;
        possibleDiseases = simulated.possible_diseases;
        followUpQuestions = simulated.follow_up_questions;
      }
    } else {
      // Fallback to simulated chat logic when GROQ_API_KEY is missing
      const simulated = getSimulatedChat(message, detectedSymptoms, matches);
      chatResponseText = simulated.message;
      possibleDiseases = simulated.possible_diseases;
      followUpQuestions = simulated.follow_up_questions;
    }

    // Save chat exchange in database
    await prisma.chatHistory.create({
      data: {
        message,
        response: chatResponseText,
      },
    });

    // Save log entry
    await prisma.log.create({
      data: {
        action: "Chat Conversation",
        details: `User: "${message.substring(0, 50)}${
          message.length > 50 ? "..." : ""
        }" -> AI response: "${chatResponseText.substring(0, 50)}..."`,
      },
    });

    return NextResponse.json({
      message: chatResponseText,
      possible_diseases: possibleDiseases,
      follow_up_questions: followUpQuestions,
      disclaimer: "This response is for educational purposes only. It is not a clinical diagnosis. Always consult a licensed medical professional.",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getSimulatedChat(message: string, detectedSymptoms: string[], matches: any[]) {
  const msgLower = message.toLowerCase();
  let chatResponseText = "";
  let followUpQuestions: string[] = [];

  if (matches.length > 0) {
    const topMatch = matches[0];
    chatResponseText = `I've analyzed your description and noted symptoms like: ${detectedSymptoms.join(
      ", "
    )}. In our database of 30 rare skin diseases, this matches closest with **${
      topMatch.name
    }** (Confidence: ${topMatch.confidence}%). Other possible matches could include ${matches
      .slice(1, 3)
      .map((m) => m.name)
      .join(", ")}.`;
    
    followUpQuestions = [
      `How long have you noticed these skin changes?`,
      `Are these lesions itchy, burning, or painful?`,
      `Is there anyone in your family with a similar condition?`,
    ];
  } else if (
    msgLower.includes("hello") ||
    msgLower.includes("hi ") ||
    msgLower.includes("hey")
  ) {
    chatResponseText = `Hello! I am the DermaRare AI assistant. I can help answer questions about 30 rare skin diseases and cross-reference symptoms you might be experiencing. How can I assist you today?`;
    followUpQuestions = [
      "Can you tell me about Epidermolysis Bullosa?",
      "How does the symptom checker work?",
      "What causes Harlequin Ichthyosis?",
    ];
  } else {
    chatResponseText = `Thank you for sharing. I can help provide educational information on rare skin conditions. If you're looking for potential matches, please try describing specific skin changes (like blisters, scaly patches, waxy skin, or nail changes) or select them using our Symptom Checker.`;
    followUpQuestions = [
      "What are the symptoms of Darier Disease?",
      "Can we check symptoms like fragile skin?",
      "Tell me about Xeroderma Pigmentosum.",
    ];
  }

  return {
    message: chatResponseText,
    possible_diseases: matches.slice(0, 3).map((m) => ({
      name: m.name,
      confidence: m.confidence,
      matched_symptoms: m.matched_symptoms,
      explanation: m.explanation,
    })),
    follow_up_questions: followUpQuestions,
  };
}
