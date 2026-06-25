import Link from "next/link";
import { HeartPulse, ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <HeartPulse className="h-6 w-6 text-cyan-400" />
              <span>DermaRare AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Providing medical students, clinicians, and patients with research-backed educational insights into the world's rarest skin conditions.
            </p>
          </div>

          {/* Nav Links Col */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/encyclopedia" className="hover:text-white transition-colors duration-150">
                  Disease Encyclopedia
                </Link>
              </li>
              <li>
                <Link href="/checker" className="hover:text-white transition-colors duration-150">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors duration-150">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors duration-150">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer Highlight Col */}
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-start space-x-2.5 text-amber-400">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-white font-medium text-xs uppercase tracking-wider">Medical Disclaimer</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This tool is for educational purposes only and does not provide medical diagnosis. Always consult a qualified healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} DermaRare AI. Educational Resource Only.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/encyclopedia" className="hover:text-white transition-colors duration-150">
              Database
            </Link>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">Not a Diagnostic Tool</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
