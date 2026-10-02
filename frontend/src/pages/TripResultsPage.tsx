import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, AlertTriangle, Star, Loader2, Info } from "lucide-react";
import type { AiTripPlan, TripPlanRequest } from "../types";
import BudgetChart from "../components/BudgetChart";
import { optimizeBudget } from "../services/tripApi";

export default function TripResultsPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<AiTripPlan | null>(null);
  const [request, setRequest] = useState<TripPlanRequest | null>(null);
  const [sliderBudget, setSliderBudget] = useState(0);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    const rawPlan = sessionStorage.getItem("lastTripPlan");
    const rawReq = sessionStorage.getItem("lastTripRequest");
    if (!rawPlan || !rawReq) {
      navigate("/plan");
      return;
    }
    const parsedPlan = JSON.parse(rawPlan) as AiTripPlan;
    const parsedReq = JSON.parse(rawReq) as TripPlanRequest;
    setPlan(parsedPlan);
    setRequest(parsedReq);
    setSliderBudget(parsedReq.budget);
  }, [navigate]);

  async function handleSliderCommit(newBudget: number) {
    if (!request) return;
    setOptimizing(true);
    try {
      const result = await optimizeBudget(request, newBudget);
      setPlan(result.plan);
      const updatedReq = { ...request, budget: newBudget };
      setRequest(updatedReq);
      sessionStorage.setItem("lastTripPlan", JSON.stringify(result.plan));
      sessionStorage.setItem("lastTripRequest", JSON.stringify(updatedReq));
    } catch {
      // Keep the previous plan visible; the slider value itself already reverted on error is fine.
    } finally {
      setOptimizing(false);
    }
  }

  if (!plan || !request) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  const days = Math.max(1, Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 86_400_000));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {plan.isMockData && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <Info size={16} /> This plan uses demo data — connect a real AI/hotel API key to generate live recommendations.
        </div>
      )}

      {/* Overview */}
      <div className="mb-6 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Your trip to {plan.destination}</h1>
        <p className="mt-2 text-sm text-slate-600">{plan.tripSummary}</p>
        <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-600">
          <span className="flex items-center gap-1.5"><MapPin size={15} /> {request.destination}</span>
          <span className="flex items-center gap-1.5"><Calendar size={15} /> {request.startDate} → {request.endDate} ({days} days)</span>
          <span className="flex items-center gap-1.5"><Users size={15} /> {request.numberOfAdults} adults, {request.numberOfChildren} children</span>
        </div>
      </div>

      {plan.warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {plan.warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
              <AlertTriangle size={16} /> {w}
            </div>
          ))}
        </div>
      )}

      {/* Budget slider + chart */}
      <div className="mb-6 grid gap-6 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 md:grid-cols-2">
        <div>
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Budget breakdown</h2>
          <p className="mb-4 text-sm text-slate-500">
            Total: {request.currency} {plan.estimatedBudget.total.toLocaleString()} of {request.currency} {request.budget.toLocaleString()}
          </p>
          <BudgetChart budget={plan.estimatedBudget} currency={request.currency} />
        </div>
        <div className="flex flex-col justify-center">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Adjust budget: {request.currency} {sliderBudget.toLocaleString()}
          </label>
          <input
            type="range"
            min={Math.round(request.budget * 0.5)}
            max={Math.round(request.budget * 2)}
            step={500}
            value={sliderBudget}
            onChange={(e) => setSliderBudget(Number(e.target.value))}
            onMouseUp={() => handleSliderCommit(sliderBudget)}
            onTouchEnd={() => handleSliderCommit(sliderBudget)}
            className="accent-brand-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{request.currency} {Math.round(request.budget * 0.5).toLocaleString()}</span>
            <span>{request.currency} {Math.round(request.budget * 2).toLocaleString()}</span>
          </div>
          {optimizing && <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Loader2 size={12} className="animate-spin" /> Re-optimizing your plan...</p>}

          {plan.budgetTips.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-sm text-slate-600">
              {plan.budgetTips.map((tip, i) => (
                <li key={i} className="flex gap-2"><span className="text-brand-500">•</span>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Hotel recommendations */}
      {plan.hotelRecommendations.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Hotel recommendations</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {plan.hotelRecommendations.map((h, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{h.name}</p>
                  <span className="flex items-center gap-1 text-sm text-amber-500"><Star size={13} fill="currentColor" /> {h.rating}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{request.currency} {h.pricePerNight.toLocaleString()} / night</p>
                <p className="mt-2 text-xs text-slate-500">{h.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Day-by-day itinerary</h2>
        <div className="space-y-6">
          {plan.itinerary.map((day) => (
            <div key={day.day} className="border-l-2 border-brand-100 pl-5">
              <p className="mb-2 text-sm font-semibold text-brand-600">Day {day.day} — {day.title}</p>
              <div className="space-y-2">
                {day.activities.map((a, i) => (
                  <div key={i} className="flex items-start justify-between text-sm text-slate-600">
                    <span><span className="font-medium text-slate-800">{a.time}</span> — {a.activity}</span>
                    <span className="whitespace-nowrap text-slate-400">{request.currency} {a.estimatedCost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
