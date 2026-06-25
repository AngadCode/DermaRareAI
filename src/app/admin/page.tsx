"use client";

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Database, ClipboardList, BarChart3, Plus, 
  Trash2, Edit, Save, LogOut, CheckCircle2, ShieldAlert, 
  Search, Download, Lock, RefreshCw, Eye, Activity, Bot 
} from "lucide-react";

// Admin Authentication Screen Component
export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("diseases"); // "diseases" | "logs" | "reports"
  
  // Data States
  const [diseases, setDiseases] = useState<any[]>([]);
  const [logs, setLogs] = useState<any>({ predictions: [], chats: [], logs: [] });
  const [reports, setReports] = useState<any>(null);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for Add/Edit Disease
  const [editMode, setEditMode] = useState(false); // false = Add, true = Edit
  const [editingId, setEditingId] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCauses, setFormCauses] = useState("");
  const [formDiagnosis, setFormDiagnosis] = useState("");
  const [formTreatment, setFormTreatment] = useState("");
  const [formRisk, setFormRisk] = useState("");
  const [formSeverity, setFormSeverity] = useState("Moderate");
  const [formSymptomsRaw, setFormSymptomsRaw] = useState(""); // Comma separated list of symptom:category:weight

  useEffect(() => {
    // Check if session token exists in localStorage
    const savedSession = localStorage.getItem("dermarare_admin_session");
    if (savedSession) {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("dermarare_admin_session", JSON.stringify(data.user));
        setIsLoggedIn(true);
        loadDashboardData();
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dermarare_admin_session");
    setIsLoggedIn(false);
  };

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch diseases
      const disRes = await fetch("/api/admin/diseases");
      const disData = await disRes.json();
      setDiseases(disData);

      // 2. Fetch logs
      const logsRes = await fetch("/api/admin/logs");
      const logsData = await logsRes.json();
      setLogs(logsData);

      // 3. Fetch reports
      const repRes = await fetch("/api/admin/reports");
      const repData = await repRes.json();
      setReports(repData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // CRUD Actions
  const handleSaveDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDesc) return;
    setActionLoading(true);

    // Parse symptom raw string: "symptom name:category:weight, symptom2:category:weight"
    // e.g. "blisters:Lesions:1.0, fragile skin:Skin Texture:0.9"
    const parsedSymptoms = formSymptomsRaw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => {
        const parts = s.split(":");
        return {
          name: parts[0]?.trim() || "",
          category: parts[1]?.trim() || "Skin Texture",
          weight: parts[2] ? Number(parts[2].trim()) : 1.0,
        };
      })
      .filter((s) => s.name.length > 0);

    const payload = {
      id: editingId,
      name: formName,
      description: formDesc,
      causes: formCauses,
      diagnosis: formDiagnosis,
      treatment: formTreatment,
      riskFactors: formRisk,
      severityLevel: formSeverity,
      symptoms: parsedSymptoms,
    };

    try {
      const url = "/api/admin/diseases";
      const method = editMode ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        loadDashboardData();
      }
    } catch (err) {
      console.error("Failed to save disease:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (disease: any) => {
    setEditMode(true);
    setEditingId(disease.id);
    setFormName(disease.name);
    setFormDesc(disease.description);
    setFormCauses(disease.causes || "");
    setFormDiagnosis(disease.diagnosis || "");
    setFormTreatment(disease.treatment || "");
    setFormRisk(disease.riskFactors || "");
    setFormSeverity(disease.severityLevel);

    // Reconstruct symptomsRaw: "name:category:weight, name2:category:weight"
    const symRawStr = disease.symptoms
      .map((s: any) => `${s.symptom.name}:${s.symptom.category}:${s.frequencyWeight}`)
      .join(", ");
    setFormSymptomsRaw(symRawStr);
  };

  const handleDeleteDisease = async (id: string) => {
    if (!confirm("Are you sure you want to delete this disease from the database?")) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/diseases?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error("Failed to delete disease:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditingId("");
    setFormName("");
    setFormDesc("");
    setFormCauses("");
    setFormDiagnosis("");
    setFormTreatment("");
    setFormRisk("");
    setFormSeverity("Moderate");
    setFormSymptomsRaw("");
  };

  // Render Login Panel if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in with your administrative account to manage conditions and view audit logs.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {authError && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-xl flex items-center space-x-2 text-rose-700 text-xs">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@dermarare.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400">
              Demo credentials: <span className="font-semibold text-slate-500">admin@dermarare.ai</span> / <span className="font-semibold text-slate-500">adminpassword123</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Manage disease listings, audit prediction history, and export data reports.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-8 gap-2">
        <button
          onClick={() => setActiveTab("diseases")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "diseases"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Disease Database</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "logs"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>System Activity Log</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "reports"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Usage Reports</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {dataLoading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
          <p className="mt-4 text-slate-500 text-sm">Loading admin dashboard statistics...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: DISEASE DATABASE */}
          {activeTab === "diseases" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Col */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-blue-600" />
                  <span>{editMode ? "Edit Condition" : "Register Condition"}</span>
                </h3>

                <form onSubmit={handleSaveDisease} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Disease Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Darier Disease"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Severity Level
                    </label>
                    <select
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white cursor-pointer"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                      <option value="Life-threatening">Life-threatening</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Brief description of the condition..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Causes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Genetic mutation details or triggers..."
                      value={formCauses}
                      onChange={(e) => setFormCauses(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Diagnosis
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Typical biopsy or DNA testing methods..."
                      value={formDiagnosis}
                      onChange={(e) => setFormDiagnosis(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Treatment
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Symptom control, creams, systemic retinoids..."
                      value={formTreatment}
                      onChange={(e) => setFormTreatment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Risk Factors
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Triggers like friction, heat, genetics..."
                      value={formRisk}
                      onChange={(e) => setFormRisk(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Associated Symptoms (comma-separated syntax)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Syntax: name:category:weight, ...&#10;e.g. blisters:Lesions & Blisters:0.9, fragile skin:Skin Texture:1.0"
                      value={formSymptomsRaw}
                      onChange={(e) => setFormSymptomsRaw(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all placeholder:text-[10px]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editMode ? "Save Changes" : "Register"}</span>
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table List Col */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-base">Registered Diseases ({diseases.length})</h3>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-1">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Condition</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Severity</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Symptoms Count</th>
                        <th className="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-150">
                      {diseases.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-800 truncate max-w-[200px]">{d.name}</td>
                          <td className="px-4 py-3 font-medium text-slate-600">{d.severityLevel}</td>
                          <td className="px-4 py-3 font-medium text-slate-500">{d.symptoms?.length || 0}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(d)}
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 font-semibold cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteDisease(d.id)}
                              className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-0.5 font-semibold cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM ACTIVITY LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-8">
              {/* Predictions Log */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-blue-600" />
                  <span>Symptom Assessment Predictions History</span>
                </h3>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Checked Symptoms</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Top Match Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-150">
                      {logs.predictions?.map((p: any) => {
                        let topMatch = "None";
                        let matchedSymptoms: string[] = [];
                        try {
                          matchedSymptoms = JSON.parse(p.inputSymptoms);
                          const result = JSON.parse(p.resultData);
                          if (result.possible_diseases && result.possible_diseases.length > 0) {
                            topMatch = `${result.possible_diseases[0].name} (${result.possible_diseases[0].confidence}%)`;
                          }
                        } catch (e) {}
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/30">
                            <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">
                              {new Date(p.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium truncate max-w-[300px]">
                              {matchedSymptoms.join(", ")}
                            </td>
                            <td className="px-4 py-3 text-blue-600 font-bold">{topMatch}</td>
                          </tr>
                        );
                      })}
                      {logs.predictions?.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-slate-400 italic">No predictions logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chat conversations Log */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <Bot className="h-4.5 w-4.5 text-blue-600" />
                  <span>AI Chatbot Conversation History Log</span>
                </h3>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">User Query</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">AI Response Summary</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-150">
                      {logs.chats?.map((c: any) => (
                        <tr key={c.id} className="hover:bg-slate-50/30">
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">
                            {new Date(c.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium truncate max-w-[250px]">{c.message}</td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[350px]">{c.response}</td>
                        </tr>
                      ))}
                      {logs.chats?.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-slate-400 italic">No chat conversations logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit operations log */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <ClipboardList className="h-4.5 w-4.5 text-blue-600" />
                  <span>Operations Audit Log</span>
                </h3>
                <div className="overflow-y-auto max-h-[250px] space-y-2 pr-1">
                  {logs.logs?.map((l: any) => (
                    <div key={l.id} className="flex items-start text-xs border border-slate-100 p-2.5 rounded-lg bg-slate-50/50 justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700 uppercase tracking-wide text-[9px] bg-slate-200 px-1 py-0.5 rounded">
                            {l.action}
                          </span>
                          <span className="text-[10px] text-slate-400">{new Date(l.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-600">{l.details}</p>
                      </div>
                    </div>
                  ))}
                  {logs.logs?.length === 0 && (
                    <p className="text-center text-slate-400 italic py-4">No operations logged.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USAGE REPORTS & EXPORTS */}
          {activeTab === "reports" && reports && (
            <div className="space-y-8">
              {/* Reports Dashboard Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Symptom Assessments</h4>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-blue-600">{reports.summary.totalPredictions}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-2">Checks executed</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Chat Conversations</h4>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-blue-600">{reports.summary.totalChats}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-2">Messages exchanged</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Export Assessment Data</h4>
                  <div className="mt-4 flex gap-2">
                    <a
                      href="/api/admin/reports?format=csv"
                      className="flex-grow flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </a>
                    <a
                      href="/api/admin/reports?format=json"
                      target="_blank"
                      className="flex items-center justify-center p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
                      title="Download JSON Report"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Lists grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top Matched Diseases */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Top Matched Rare Diseases</h3>
                  <div className="space-y-3">
                    {reports.topMatchedDiseases?.length > 0 ? (
                      reports.topMatchedDiseases.slice(0, 5).map((d: any, idx: number) => (
                        <div key={d.name} className="flex justify-between items-center text-xs border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                          <span className="font-semibold text-slate-800">{idx + 1}. {d.name}</span>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{d.count} matches</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic py-4">No disease matches recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* Frequently Checked Symptoms */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Frequently Input Symptoms</h3>
                  <div className="space-y-3">
                    {reports.frequentSymptoms?.length > 0 ? (
                      reports.frequentSymptoms.slice(0, 5).map((s: any, idx: number) => (
                        <div key={s.name} className="flex justify-between items-center text-xs border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                          <span className="font-semibold text-slate-800">{idx + 1}. {s.name}</span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{s.count} checks</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic py-4">No symptoms recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
