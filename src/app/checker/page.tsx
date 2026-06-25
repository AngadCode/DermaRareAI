"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, ShieldAlert, Plus, X, ArrowRight, 
  RotateCcw, Info, CheckCircle2, ChevronDown, ChevronUp 
} from "lucide-react";

interface Symptom {
  name: string;
  category: string;
}

interface MatchResult {
  diseaseId: string;
  name: string;
  confidence: number;
  matched_symptoms: string[];
  explanation: string;
  severityLevel: string;
}

interface CheckerResponse {
  possible_diseases: MatchResult[];
  follow_up_questions: string[];
  disclaimer: string;
}

export default function SymptomChecker() {
  const [symptomList, setSymptomList] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CheckerResponse | null>(null);
  const [activeExplanationIdx, setActiveExplanationIdx] = useState<number | null>(0);

  // Fetch unique symptoms list on mount
  useEffect(() => {
    async function loadSymptoms() {
      try {
        const res = await fetch("/api/admin/diseases");
        const diseases = await res.json();
        
        // Extract unique symptoms
        const uniqueMap = new Map<string, string>(); // name -> category
        diseases.forEach((d: any) => {
          d.symptoms.forEach((s: any) => {
            uniqueMap.set(s.symptom.name, s.symptom.category);
          });
        });

        const list: Symptom[] = Array.from(uniqueMap.entries()).map(([name, category]) => ({
          name,
          category,
        }));
        setSymptomList(list);
      } catch (err) {
        console.error("Failed to load symptoms:", err);
      }
    }
    loadSymptoms();
  }, []);

  // Group symptoms by category
  const symptomsByCategory = symptomList.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom.name);
    return acc;
  }, {} as Record<string, string[]>);

  const toggleSymptom = (name: string) => {
    if (selectedSymptoms.includes(name)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== name));
    } else {
      setSelectedSymptoms([...selectedSymptoms, name]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() === "") return;
    
    // Normalize and add if not already selected
    const tag = customTag.trim();
    if (!selectedSymptoms.includes(tag)) {
      setSelectedSymptoms([...selectedSymptoms, tag]);
    }
    setCustomTag("");
  };

  const removeSymptom = (name: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== name));
  };

  const handleClear = () => {
    setSelectedSymptoms([]);
    setResults(null);
    setActiveExplanationIdx(0);
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await res.json();
      setResults(data);
      setActiveExplanationIdx(0);
    } catch (err) {
      console.error("Failed to run symptom check:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "Life-threatening":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Severe":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Moderate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Mild":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl flex items-center justify-center sm:justify-start gap-3">
          <Activity className="h-8 w-8 text-primary animate-pulse" />
          <span>AI Symptom Checker</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Select or enter symptoms to identify possible rare skin disease matches.
        </p>
      </div>

      {/* Warning Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl mb-8 flex items-start space-x-3">
        <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">Educational Notice & Guidance</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            This tool is for educational purposes only and does NOT provide medical diagnosis. It calculates probabilistic scores based on symptom overlap. Please consult a qualified dermatologist for official medical advice.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Symptom Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">1. Select Symptoms</h2>
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {Object.entries(symptomsByCategory).map(([category, names]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {names.map((name) => {
                      const isSelected = selectedSymptoms.includes(name);
                      return (
                        <button
                          key={name}
                          onClick={() => toggleSymptom(name)}
                          className={`flex items-center text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-4.5 w-4.5 rounded-md border mr-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-slate-300"
                            }`}
                          >
                            {isSelected && <span className="text-[10px] font-bold">✓</span>}
                          </span>
                          <span className="truncate">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom tags input */}
            <form onSubmit={handleAddCustomTag} className="mt-6 pt-5 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Or enter custom symptom tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. painful blisters, scaling, sun allergy..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active selection display */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Selected Symptoms ({selectedSymptoms.length})
              </h2>
              {selectedSymptoms.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {selectedSymptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => removeSymptom(s)}
                      className="ml-1.5 text-blue-400 hover:text-blue-600 p-0.5 rounded-full focus:outline-none"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">
                No symptoms selected. Click checkboxes above or enter custom tags to begin.
              </p>
            )}

            {selectedSymptoms.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3.5 rounded-xl shadow-md hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <span>Run AI Matching Check</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Match Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4">2. Assessment Results</h2>

            {loading ? (
              <div className="flex-grow flex flex-col justify-center items-center py-20">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
                <p className="mt-4 text-slate-500 text-sm font-medium">Running mathematical matching...</p>
                <p className="text-[11px] text-slate-400 mt-1">Consulting medical database & AI...</p>
              </div>
            ) : results ? (
              <div className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  {results.possible_diseases.length > 0 ? (
                    results.possible_diseases.map((match, idx) => {
                      const isActive = activeExplanationIdx === idx;
                      return (
                        <div
                          key={match.diseaseId}
                          className={`rounded-xl border p-4 transition-all ${
                            isActive
                              ? "bg-slate-50/50 border-blue-500 shadow-sm"
                              : "bg-white border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {/* Top row */}
                          <div
                            onClick={() => setActiveExplanationIdx(isActive ? null : idx)}
                            className="flex justify-between items-start cursor-pointer group"
                          >
                            <div className="space-y-1">
                              <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors text-sm">
                                {idx + 1}. {match.name}
                              </h3>
                              <span
                                className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold border ${getSeverityColor(
                                  match.severityLevel
                                )}`}
                              >
                                {match.severityLevel}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-blue-600 text-base">
                                {match.confidence}%
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium">Match Score</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${match.confidence}%` }}
                            />
                          </div>

                          {/* Collapsible Details */}
                          {isActive && (
                            <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs space-y-3 animate-fade-in">
                              <div className="space-y-1.5">
                                <span className="font-semibold text-slate-700">Matched Symptoms:</span>
                                <div className="flex flex-wrap gap-1">
                                  {match.matched_symptoms.map((ms) => (
                                    <span
                                      key={ms}
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                    >
                                      {ms}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="font-semibold text-slate-700">AI Explanation:</span>
                                <p className="text-slate-600 leading-relaxed bg-slate-100/50 p-2.5 rounded-lg border border-slate-200/20">
                                  {match.explanation}
                                </p>
                              </div>

                              <div className="pt-1 flex justify-end">
                                <Link
                                  href={`/encyclopedia/${match.diseaseId}`}
                                  className="text-[11px] text-blue-600 font-semibold flex items-center hover:underline"
                                >
                                  <span>View Detailed Disease Profile</span>
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-slate-500 text-xs font-semibold">No matches found</p>
                      <p className="text-[10px] text-slate-400 mt-1 px-4">
                        Try entering different symptoms or select them from the checklist.
                      </p>
                    </div>
                  )}
                </div>

                {/* Follow-up Questions from AI */}
                {results.follow_up_questions && results.follow_up_questions.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Info className="h-3.5 w-3.5 text-blue-500" />
                      <span>Suggested AI Follow-ups</span>
                    </div>
                    <ul className="space-y-1.5">
                      {results.follow_up_questions.map((q, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            const prompt = encodeURIComponent(`Regarding the symptoms I checked, I want to answer: "${q}"`);
                            window.location.href = `/chat?prompt=${prompt}`;
                          }}
                          className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 text-xs text-slate-700 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex justify-between items-center group"
                        >
                          <span className="truncate">{q}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-center items-center py-20 text-center text-slate-400">
                <Activity className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-xs font-semibold">Waiting for Assessment</p>
                <p className="text-[11px] max-w-[240px] mt-1 mx-auto">
                  Select your symptoms in the left panel and click "Run AI Matching Check".
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
