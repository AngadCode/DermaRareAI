import Link from "next/link";
import { BookOpen, Activity, Bot, Shield, ChevronRight, Dna, Layers, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-grid-pattern min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Radial Gradient Backdrop */}
      <div className="absolute inset-0 bg-radial-gradient z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/50 rounded-full px-4 py-1.5 mb-6 text-sm text-blue-700 font-medium">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <span>Interactive Clinical Education Tool</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          AI-Powered Rare Skin Disease <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Identification & Education
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Access specialized descriptions, causes, and treatment insights for 30 rare dermatological conditions. Use our advanced symptom checker and conversational AI assistant.
        </p>

        {/* Hero Actions */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/checker"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-cyan-500/20 hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
          >
            <Activity className="h-5 w-5" />
            <span>Check Symptoms</span>
          </Link>
          <Link
            href="/encyclopedia"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
          >
            <BookOpen className="h-5 w-5 text-slate-500" />
            <span>Explore 30 Diseases</span>
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Disease Encyclopedia</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Detailed clinical breakdown of 30 rare genetic and inflammatory dermatological conditions, complete with symptoms, causes, diagnosis, and treatment.
              </p>
            </div>
            <Link href="/encyclopedia" className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2">
              <span>View Database</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Symptom Checker</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Select from anatomical checklists or enter symptoms directly. Our algorithm ranks possible disease matches based on clinical weighting and symptom overlap.
              </p>
            </div>
            <Link href="/checker" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 text-sm font-semibold mt-2">
              <span>Run Assessment</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI Chatbot</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Have a conversational dialogue with our clinical education assistant. Powered by Groq AI, it asks smart follow-up questions to understand specific skin changes.
              </p>
            </div>
            <Link href="/chat" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-semibold mt-2">
              <span>Consult AI Agent</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>

      {/* Safety Notice Footer Banner */}
      <div className="relative z-10 bg-blue-50 border-t border-blue-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-4 justify-between text-slate-700">
          <div className="flex items-center space-x-3 text-sm">
            <Shield className="h-6 w-6 text-blue-600 shrink-0" />
            <p>
              <strong>Important Safety Notice:</strong> This application is for educational purposes and is not a diagnostic tool. Always consult a qualified dermatologist for any skin condition.
            </p>
          </div>
          <Link
            href="/encyclopedia"
            className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors font-medium shrink-0"
          >
            Review Database
          </Link>
        </div>
      </div>
    </div>
  );
}
