import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Wallet, Sparkles, Star, ChevronDown } from "lucide-react";
import { useState } from "react";

const destinations = [
  { name: "Goa", tag: "Beaches & nightlife", img: "https://picsum.photos/seed/goa/500/380" },
  { name: "Manali", tag: "Mountains & adventure", img: "https://picsum.photos/seed/manali/500/380" },
  { name: "Dubai", tag: "Luxury & skyline", img: "https://picsum.photos/seed/dubai/500/380" },
  { name: "Paris", tag: "Romance & art", img: "https://picsum.photos/seed/paris/500/380" },
  { name: "Bali", tag: "Nature & wellness", img: "https://picsum.photos/seed/bali/500/380" },
  { name: "Jaipur", tag: "Heritage & culture", img: "https://picsum.photos/seed/jaipur/500/380" },
];

const steps = [
  { title: "Tell us your trip", desc: "Destination, dates, travelers, and your total budget.", icon: MapPin },
  { title: "AI builds your plan", desc: "A personalized day-by-day itinerary optimized to your budget.", icon: Sparkles },
  { title: "Book with confidence", desc: "Real hotel pricing, secure payments, instant confirmation.", icon: Wallet },
];

const testimonials = [
  { name: "Ananya R.", quote: "Planned my entire Goa trip in five minutes and stayed under budget.", rating: 5 },
  { name: "Rohit S.", quote: "The day-by-day itinerary for Manali was spot on for a first-timer.", rating: 5 },
  { name: "Priya M.", quote: "Loved how it flagged when I was overspending and suggested cheaper hotels.", rating: 4 },
];

const faqs = [
  { q: "How does the AI create my itinerary?", a: "You share your destination, dates, budget and preferences — our AI Travel Agent estimates costs across transport, hotels, food and activities, then builds a day-by-day plan that fits your budget." },
  { q: "Are the hotel prices real?", a: "Hotel availability and pricing come from our hotel booking partner. Demo environments clearly label any sample data." },
  { q: "Can I change my budget after generating a trip?", a: "Yes — use the budget slider on your results page and we'll re-optimize the plan instantly." },
  { q: "Is payment secure?", a: "All payments are verified server-side before any booking is confirmed — we never trust payment status from the browser alone." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              <Sparkles size={13} /> AI-powered trip planning
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Plan Your Perfect Trip With AI
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-600 md:text-lg">
              Tell us where you want to go, your budget and travel style. Our AI Travel Agent will create a personalized trip for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/plan"
                className="flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
              >
                Plan My Trip <ArrowRight size={16} />
              </Link>
              <Link
                to="/hotels"
                className="rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Browse Hotels
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://picsum.photos/seed/travelhero/700/520"
              alt="Scenic travel destination"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <p className="text-xs text-slate-500">Estimated trip cost</p>
              <p className="text-lg font-bold text-slate-900">₹24,500 <span className="text-xs font-normal text-emerald-600">under budget</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular destinations</h2>
            <p className="mt-1 text-sm text-slate-500">Trending picks from travelers like you.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {destinations.map((d) => (
            <Link
              key={d.name}
              to="/plan"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={d.img} alt={d.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-slate-900">{d.name}</p>
                <p className="text-xs text-slate-500">{d.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-100">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <s.icon size={22} />
                </div>
                <p className="mb-1 text-xs font-semibold text-brand-600">Step {i + 1}</p>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">What travelers say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="mb-4 text-sm text-slate-600">"{t.quote}"</p>
              <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-900"
                >
                  {f.q}
                  <ChevronDown size={16} className={`transition ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-slate-500">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
