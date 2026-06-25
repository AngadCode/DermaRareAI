"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Bot, Send, ShieldAlert, Sparkles, User, Info, 
  ArrowRight, HeartPulse, RefreshCw 
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  possible_diseases?: {
    name: string;
    confidence: number;
    matched_symptoms: string[];
    explanation: string;
  }[];
  follow_up_questions?: string[];
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidePanelMatches, setSidePanelMatches] = useState<any[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggestions list
  const suggestedPrompts = [
    "What are the symptoms of Epidermolysis Bullosa?",
    "Tell me about Hailey-Hailey Disease.",
    "Explain the cause of Harlequin Ichthyosis.",
    "Can you check symptoms like waxy skin and joint pain?",
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initial trigger for prompt from query param
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      const decodedPrompt = decodeURIComponent(initialPrompt);
      handleSendMessage(decodedPrompt);
    } else if (messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          role: "assistant",
          content: "Hello! I am your clinical education AI assistant. I can answer questions about the 30 rare skin diseases in our database and analyze symptoms. What would you like to discuss today?",
          follow_up_questions: [
            "What is Epidermolysis Bullosa?",
            "How do I use the Symptom Checker?",
            "Tell me about Xeroderma Pigmentosum.",
          ]
        }
      ]);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Format history for the backend API
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        possible_diseases: data.possible_diseases,
        follow_up_questions: data.follow_up_questions,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update side panel matches if any diseases are returned
      if (data.possible_diseases && data.possible_diseases.length > 0) {
        setSidePanelMatches(data.possible_diseases);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error communicating with the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am your clinical education AI assistant. I can answer questions about the 30 rare skin diseases in our database and analyze symptoms. What would you like to discuss today?",
        follow_up_questions: [
          "What is Epidermolysis Bullosa?",
          "How do I use the Symptom Checker?",
          "Tell me about Xeroderma Pigmentosum.",
        ]
      }
    ]);
    setSidePanelMatches([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Disclaimer Sticky Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl mb-4 flex items-center space-x-2 shrink-0">
        <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0" />
        <p className="text-[11px] text-slate-700 leading-relaxed">
          <strong>Medical Education Disclaimer:</strong> This chatbot is powered by Groq AI and does not provide clinical diagnosis. All matches are for educational research.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Chat Thread Container (8 cols desktop) */}
        <div className="flex-grow lg:w-3/4 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm min-h-0 overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Clinical Assistant</h2>
                <p className="text-[10px] text-slate-500 font-medium">Groq Llama-3 Powered</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 min-h-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3.5 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1.5">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                        : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>

                  {/* Suggestive follow-up questions from AI */}
                  {msg.role === "assistant" && msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                    <div className="pl-2 space-y-1">
                      {msg.follow_up_questions.slice(0, 3).map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendMessage(q)}
                          className="block text-left text-xs bg-slate-50 hover:bg-blue-50/30 text-slate-600 hover:text-blue-700 hover:border-blue-200 border border-slate-200/60 rounded-lg px-2.5 py-1.5 transition-all w-full cursor-pointer font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-3.5 max-w-[80%] mr-auto">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center space-x-1 shadow-sm">
                  <span className="h-2 w-2 bg-slate-400 rounded-full typing-dot" />
                  <span className="h-2 w-2 bg-slate-400 rounded-full typing-dot" />
                  <span className="h-2 w-2 bg-slate-400 rounded-full typing-dot" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestions Tray (Before user starts typing, or at bottom) */}
          {messages.length <= 1 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested prompts:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form input */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about symptoms, conditions, or causes (e.g. 'Tell me about Darier Disease')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side Panel: Matched Diseases (1 col / 1/4 width desktop) */}
        <div className="hidden lg:flex lg:w-1/4 flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-sm min-h-0 overflow-hidden">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4 shrink-0">
            <HeartPulse className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">AI Match Analyzer</h3>
          </div>

          <div className="flex-grow overflow-y-auto space-y-4 pr-1 min-h-0">
            {sidePanelMatches.length > 0 ? (
              sidePanelMatches.map((disease, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2.5 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-xs truncate max-w-[130px]">
                      {disease.name}
                    </h4>
                    <span className="font-extrabold text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {disease.confidence}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1.5 rounded-full"
                      style={{ width: `${disease.confidence}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {disease.explanation}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 py-10">
                <Sparkles className="h-8 w-8 text-slate-300 mb-2 animate-pulse" />
                <p className="text-xs font-semibold">Ready for analysis</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[160px] mx-auto">
                  Describe symptoms in chat to view active disease match confidence scores.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-slate-500 text-sm">Loading Chat interface...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
