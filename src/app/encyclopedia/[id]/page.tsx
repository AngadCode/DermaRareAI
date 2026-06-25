"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Bot, ShieldCheck, Heart, AlertOctagon, 
  HelpCircle, ClipboardList, Activity, Sparkles, Dna 
} from "lucide-react";

interface Symptom {
  frequencyWeight: number;
  symptom: {
    id: string;
    name: string;
    category: string;
  };
}

interface Disease {
  id: string;
  name: string;
  description: string;
  causes: string;
  diagnosis: string;
  treatment: string;
  riskFactors: string;
  severityLevel: string;
  symptoms: Symptom[];
}

export default function DiseaseDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [disease, setDisease] = useState<Disease | null>(null);
  const [allDiseases, setAllDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/diseases");
        const data = await res.json();
        setAllDiseases(data);
        
        const current = data.find((d: Disease) => d.id === id);
        if (current) {
          setDisease(current);
        }
      } catch (err) {
        console.error("Failed to load disease data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-slate-500 text-sm">Loading disease profile...</p>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertOctagon className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Disease Profile Not Found</h2>
        <p className="text-slate-600 mb-6">The requested condition could not be found in our database.</p>
        <Link href="/encyclopedia" className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Encyclopedia</span>
        </Link>
      </div>
    );
  }

  // Calculate related diseases: sorting other diseases based on number of overlapping symptoms
  const currentSymptomIds = new Set(disease.symptoms.map((s) => s.symptom.id));
  
  const relatedDiseases = allDiseases
    .filter((d) => d.id !== disease.id)
    .map((d) => {
      const overlapCount = d.symptoms.filter((s) => currentSymptomIds.has(s.symptom.id)).length;
      return { disease: d, overlapCount };
    })
    .filter((item) => item.overlapCount > 0)
    .sort((a, b) => b.overlapCount - a.overlapCount)
    .slice(0, 3)
    .map((item) => item.disease);

  const getSeverityBadgeColor = (level: string) => {
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

  const handleAskAI = () => {
    const prompt = encodeURIComponent(`Tell me more about the causes, typical onset, and clinical symptoms of ${disease.name}.`);
    router.push(`/chat?prompt=${prompt}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/encyclopedia"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Encyclopedia</span>
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getSeverityBadgeColor(disease.severityLevel)}`}>
                Severity: {disease.severityLevel}
              </span>
              <span className="text-xs bg-blue-50 text-blue-800 border border-blue-100 px-2.5 py-1 rounded-full font-medium">
                Rare Condition
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{disease.name}</h1>
          </div>

          <button
            onClick={handleAskAI}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer text-sm"
          >
            <Bot className="h-5 w-5" />
            <span>Ask AI about this disease</span>
          </button>
        </div>

        <p className="mt-6 text-slate-700 text-base sm:text-lg leading-relaxed border-t border-slate-100 pt-6">
          {disease.description}
        </p>
      </div>

      {/* Grid of Medical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Breakdown Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symptoms List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Symptom Profile & Frequency</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {disease.symptoms.map((s, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold uppercase">
                      {s.symptom.category}
                    </span>
                    <p className="font-semibold text-sm text-slate-800">{s.symptom.name}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Clinical Weight:</span>
                    <span className="font-bold text-slate-700">{Math.round(s.frequencyWeight * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Causes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Dna className="h-5 w-5 text-cyan-600" />
              <span>Causes & Etiology</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{disease.causes}</p>
          </div>

          {/* Diagnosis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
              <span>Diagnosis Protocols</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{disease.diagnosis}</p>
          </div>

          {/* Treatment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <span>Therapy & Treatment</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{disease.treatment}</p>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              <span>Risk Factors & Demographics</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{disease.riskFactors}</p>
          </div>
        </div>

        {/* Right 1 Col: Related Diseases & Clinical Guidance */}
        <div className="space-y-6">
          {/* Related Diseases */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <span>Related Conditions</span>
            </h2>
            {relatedDiseases.length > 0 ? (
              <div className="space-y-3">
                {relatedDiseases.map((d) => (
                  <Link
                    key={d.id}
                    href={`/encyclopedia/${d.id}`}
                    className="block p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors">
                        {d.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {d.severityLevel}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2">{d.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No related conditions identified.</p>
            )}
          </div>

          {/* Clinical Guidance Box */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 mb-3">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Educational Standard</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              The definitions and classifications listed on this page match standard dermatological literature for clinical education. If you are a medical student, you can consult the AI agent to quiz you on this condition.
            </p>
            <button
              onClick={handleAskAI}
              className="w-full bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Start AI Study Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
