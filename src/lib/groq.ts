import Groq from "groq-sdk";
import { matchSymptoms } from "./symptomMatcher";

// Initialize Groq SDK only if API key is provided
const apiKey = process.env.GROQ_API_KEY || "";
const groq = apiKey ? new Groq({ apiKey }) : null;

// The model we will use
const MODEL_NAME = "llama-3.1-8b-instant";

export interface AIResponse {
  possible_diseases: {
    name: string;
    confidence: number;
    matched_symptoms: string[];
    explanation: string;
  }[];
  follow_up_questions: string[];
  disclaimer: string;
}

export async function analyzeSymptomsWithAI(
  symptoms: string[],
  chatHistory: { role: "user" | "assistant"; content: string }[] = []
): Promise<AIResponse> {
  const localMatches = await matchSymptoms(symptoms);

  // If no Groq client is configured, use local simulated AI fallback
  if (!groq) {
    console.log("GROQ_API_KEY not found. Using local simulated AI fallback.");
    return simulateAIResponse(symptoms, localMatches);
  }

  try {
    const systemPrompt = `You are a professional medical education AI assistant specializing in rare dermatological conditions.
Your task is to analyze user-provided symptoms and match them against known rare skin diseases.

RULES:
1. Provide educational insights only. This is NOT a medical diagnosis.
2. Return a valid, structured JSON object matching the requested schema. Do not output any other text before or after the JSON.
3. Compare the user's symptoms against this set of rare skin diseases: ${localMatches.map((m) => m.name).join(", ") || "Known rare dermatological diseases"}.
4. Provide up to 5 possible matching diseases, sorted by confidence.
5. Provide 2-3 logical follow-up questions to help clarify the skin presentation (e.g. asking about texture, pain, onset, triggers, genetic factors).
6. Always include a strict medical disclaimer.

JSON Output Schema:
{
  "possible_diseases": [
    {
      "name": "Disease Name",
      "confidence": 85,
      "matched_symptoms": ["Symptom A", "Symptom B"],
      "explanation": "Why it matches"
    }
  ],
  "follow_up_questions": [
    "Are the blisters painful to touch or itchy?",
    "Did this condition begin at birth or develop later in life?"
  ],
  "disclaimer": "This information is for educational purposes only and does not constitute medical advice. Consult a qualified dermatologist for diagnosis."
}`;

    const userMessage = `User symptoms: ${symptoms.join(", ")}
Recent Conversation history:
${chatHistory.map((h) => `${h.role === "user" ? "Patient" : "AI"}: ${h.content}`).join("\n")}

Analyze and return the structured JSON object:`;

    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed: AIResponse = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    // If Groq API fails, fallback to simulated response so the site doesn't crash
    return simulateAIResponse(symptoms, localMatches);
  }
}

// Generates a mock AI response following the requested format when Groq is unavailable
function simulateAIResponse(symptoms: string[], localMatches: any[]): AIResponse {
  const topMatches = localMatches.slice(0, 5).map((match) => ({
    name: match.name,
    confidence: match.confidence,
    matched_symptoms: match.matched_symptoms,
    explanation: `[Simulated AI Insight] Based on the entered symptoms (${symptoms.join(", ")}), there is an overlap with the profile of ${match.name}. ${match.explanation}`,
  }));

  // Generate generic follow-up questions based on typical rare skin disease factors
  const follow_up_questions = [
    "Did these symptoms appear at birth, in infancy, or later in life?",
    "Is there any family history of skin fragility, scaling, or similar skin conditions?",
    "Do you experience burning pain or sensitivity when the skin is exposed to direct sunlight?",
  ];

  return {
    possible_diseases: topMatches,
    follow_up_questions,
    disclaimer: "This simulated AI analysis is for educational purposes only. It is not a clinical diagnosis. Please consult a qualified dermatologist.",
  };
}
