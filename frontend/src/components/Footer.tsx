import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Plane size={16} />
              </span>
              Voyagent
            </div>
            <p className="text-sm text-slate-500">AI-planned trips that respect your budget, down to the rupee.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>AI Trip Planner</li>
              <li>Hotel Search</li>
              <li>Budget Optimizer</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Voyagent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
