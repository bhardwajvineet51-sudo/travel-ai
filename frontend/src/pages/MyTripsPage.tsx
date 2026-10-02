import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { useAuthStore } from "../store/authStore";

export default function MyTripsPage() {
  const token = useAuthStore((s) => s.token);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .get("/trips")
      .then(({ data }) => setTrips(data.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="mb-4 text-slate-600">Log in to see your saved trips.</p>
        <Link to="/login" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white">Log in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My trips</h1>
      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <p className="mb-4 text-slate-500">No trips yet.</p>
          <Link to="/plan" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white">Plan a trip</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {trips.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="font-semibold text-slate-900">{t.destination}</p>
              <p className="text-sm text-slate-500">
                {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm text-slate-500">Budget: {t.currency} {t.budget.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
