import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Wallet, Sparkles, Compass, Plane, Loader2 } from "lucide-react";
import { useTripPlannerStore } from "../store/tripPlannerStore";
import PreferenceSelector from "../components/PreferenceSelector";
import { planTrip } from "../services/tripApi";
import type { TravelPreference } from "../types";

const TOTAL_STEPS = 7;

const PREFERENCES: TravelPreference[] = [
  "Adventure", "Beach", "Nature", "Luxury", "Budget", "Family",
  "Couple", "Solo", "Nightlife", "Food", "Shopping", "Historical", "Spiritual",
];
const STYLES = ["Budget", "Moderate", "Premium", "Luxury"] as const;
const TRANSPORTS = ["Flight", "Train", "Bus", "Car", "No preference"] as const;

export default function PlannerPage() {
  const { step, data, setStep, update } = useTripPlannerStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const canProceed: Record<number, boolean> = {
    1: Boolean(data.destination && data.destination.trim().length > 1),
    2: Boolean(data.startDate && data.endDate),
    3: Boolean(data.numberOfAdults && data.numberOfAdults >= 1),
    4: Boolean(data.budget && data.budget > 0),
    5: Boolean(data.travelPreferences && data.travelPreferences.length > 0),
    6: Boolean(data.travelStyle),
    7: Boolean(data.transportPreference),
  };

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await planTrip(data as any);
      sessionStorage.setItem("lastTripPlan", JSON.stringify(result.plan));
      sessionStorage.setItem("lastTripRequest", JSON.stringify(data));
      navigate("/trip-results");
    } catch (e: any) {
      setError(e.message ?? "AI planning failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-brand-500 transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 md:p-9">
        {step === 1 && (
          <StepShell icon={MapPin} title="Where do you want to go?" subtitle="Enter your dream destination">
            <input
              autoFocus
              value={data.destination ?? ""}
              onChange={(e) => update({ destination: e.target.value })}
              placeholder="Goa, Dubai, Paris, Manali, Bali..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell icon={Calendar} title="When are you traveling?" subtitle="Pick your travel dates">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Start date</label>
                <input
                  type="date"
                  value={data.startDate ?? ""}
                  onChange={(e) => update({ startDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">End date</label>
                <input
                  type="date"
                  value={data.endDate ?? ""}
                  onChange={(e) => update({ endDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell icon={Users} title="Who's traveling?" subtitle="Number of travelers">
            <div className="grid grid-cols-2 gap-3">
              <Counter label="Adults" value={data.numberOfAdults ?? 1} min={1} onChange={(v) => update({ numberOfAdults: v })} />
              <Counter label="Children" value={data.numberOfChildren ?? 0} min={0} onChange={(v) => update({ numberOfChildren: v })} />
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell icon={Wallet} title="What's your budget?" subtitle="Total trip budget">
            <div className="flex gap-3">
              <select
                value={data.currency ?? "INR"}
                onChange={(e) => update({ currency: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-3.5 focus:border-brand-500 focus:outline-none"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
              <input
                type="number"
                min={0}
                value={data.budget ?? ""}
                onChange={(e) => update({ budget: Number(e.target.value) })}
                placeholder="30000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell icon={Sparkles} title="What are you into?" subtitle="Select all that apply">
            <PreferenceSelector
              options={PREFERENCES}
              selected={data.travelPreferences ?? []}
              onToggle={(opt) => {
                const current = data.travelPreferences ?? [];
                update({
                  travelPreferences: current.includes(opt as TravelPreference)
                    ? current.filter((p) => p !== opt)
                    : [...current, opt as TravelPreference],
                });
              }}
            />
          </StepShell>
        )}

        {step === 6 && (
          <StepShell icon={Compass} title="Pick your travel style" subtitle="This shapes hotel and activity picks">
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ travelStyle: s })}
                  className={`rounded-xl border px-4 py-3.5 text-sm font-semibold ${
                    data.travelStyle === s ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 7 && (
          <StepShell icon={Plane} title="How do you want to travel?" subtitle="Transportation preference">
            <div className="grid grid-cols-2 gap-3">
              {TRANSPORTS.map((t) => (
                <button
                  key={t}
                  onClick={() => update({ transportPreference: t })}
                  className={`rounded-xl border px-4 py-3.5 text-sm font-semibold ${
                    data.transportPreference === t ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-500 disabled:opacity-0"
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed[step]}
              className="rounded-full bg-brand-500 px-7 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!canProceed[step] || loading}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-7 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating your trip..." : "Create My AI Trip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepShell({ icon: Icon, title, subtitle, children }: any) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={20} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      <div className="flex items-center justify-between">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="h-8 w-8 rounded-full bg-slate-100 font-bold text-slate-700">−</button>
        <span className="text-lg font-semibold text-slate-900">{value}</span>
        <button onClick={() => onChange(value + 1)} className="h-8 w-8 rounded-full bg-slate-100 font-bold text-slate-700">+</button>
      </div>
    </div>
  );
}
