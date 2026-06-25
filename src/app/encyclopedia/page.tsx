"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, ShieldAlert, ChevronRight, BookOpen, RotateCcw } from "lucide-react";

interface Symptom {
  symptom: {
    name: string;
    category: string;
  };
}

interface Disease {
  id: string;
  name: string;
  description: string;
  severityLevel: string;
  symptoms: Symptom[];
}

export default function Encyclopedia() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [loading, setLoading] = useState(true);

  // Fetch diseases from the API
  useEffect(() => {
    async function loadDiseases() {
      try {
        const res = await fetch("/api/admin/diseases");
        const data = await res.json();
        setDiseases(data);
      } catch (err) {
        console.error("Failed to load diseases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, []);

  // Filter and sort logic
  const filteredDiseases = diseases
    .filter((disease) => {
      // 1. Search Query Match
      const matchesSearch =
        disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.symptoms.some((s) => s.symptom.name.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Severity Match
      const matchesSeverity = severityFilter === "All" || disease.severityLevel === severityFilter;

      // 3. Category Match
      const matchesCategory =
        categoryFilter === "All" ||
        disease.symptoms.some((s) => s.symptom.category === categoryFilter);

      return matchesSearch && matchesSeverity && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "severity-desc") {
        const severityScore: Record<string, number> = {
          "Life-threatening": 4,
          Severe: 3,
          Moderate: 2,
          Mild: 1,
        };
        return (
          (severityScore[b.severityLevel] || 0) - (severityScore[a.severityLevel] || 0)
        );
      } else if (sortBy === "severity-asc") {
        const severityScore: Record<string, number> = {
          "Life-threatening": 4,
          Severe: 3,
          Moderate: 2,
          Mild: 1,
        };
        return (
          (severityScore[a.severityLevel] || 0) - (severityScore[b.severityLevel] || 0)
        );
      }
      return 0;
    });

  const categories = [
    "Skin Texture",
    "Lesions & Blisters",
    "Itch & Pain",
    "Nails & Hair",
    "Systemic & Others",
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl flex items-center justify-center sm:justify-start gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <span>Disease Encyclopedia</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Search, filter, and study 30 rare dermatological conditions cataloged in our clinical database.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search diseases by name, descriptions, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>

          {/* Sort selection */}
          <div className="w-full lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white cursor-pointer"
            >
              <option value="name-asc">Sort: A to Z</option>
              <option value="name-desc">Sort: Z to A</option>
              <option value="severity-desc">Severity: High to Low</option>
              <option value="severity-asc">Severity: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center text-slate-500 text-xs font-semibold uppercase tracking-wider gap-1.5 mr-2">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Severity Filters */}
          <div className="flex flex-wrap gap-1.5">
            {["All", "Mild", "Moderate", "Severe", "Life-threatening"].map((level) => (
              <button
                key={level}
                onClick={() => setSeverityFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  severityFilter === level
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-slate-300 mx-2">|</div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                categoryFilter === "All"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(searchQuery !== "" || severityFilter !== "All" || categoryFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSeverityFilter("All");
                setCategoryFilter("All");
              }}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1.5 ml-auto font-medium py-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Diseases */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-slate-500 text-sm">Loading encyclopedia database...</p>
        </div>
      ) : filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <div
              key={disease.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">
                    {disease.name}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getSeverityBadgeColor(
                      disease.severityLevel
                    )}`}
                  >
                    {disease.severityLevel}
                  </span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {disease.description}
                </p>

                {/* Symptoms teaser */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {disease.symptoms.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium border border-slate-200/50"
                    >
                      {s.symptom.name}
                    </span>
                  ))}
                  {disease.symptoms.length > 3 && (
                    <span className="text-slate-400 text-[10px] px-1 py-0.5 font-medium">
                      +{disease.symptoms.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-sm font-semibold text-primary group-hover:bg-slate-100/50 transition-colors">
                <Link href={`/encyclopedia/${disease.id}`} className="w-full flex items-center justify-between">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No diseases match your filters</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search terms or clearing the severity and symptom filters.
          </p>
        </div>
      )}
    </div>
  );
}
