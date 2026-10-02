import { Link, useNavigate } from "react-router-dom";
import { Plane, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const links = [
    { to: "/plan", label: "Plan a Trip" },
    { to: "/hotels", label: "Hotels" },
    { to: "/trips", label: "My Trips" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Plane size={18} />
          </span>
          <span className="text-lg tracking-tight">Voyagent</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <User size={15} /> Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</Link>
              <Link to="/plan" className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
                Plan My Trip
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                {l.label}
              </Link>
            ))}
            <Link to="/plan" onClick={() => setOpen(false)} className="rounded-full bg-brand-500 px-5 py-2.5 text-center text-sm font-semibold text-white">
              Plan My Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
