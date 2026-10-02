import { useState } from "react";
import { Search, Loader2, Info } from "lucide-react";
import { searchHotels } from "../services/hotelApi";
import type { Hotel } from "../types";
import HotelCard from "../components/HotelCard";

export default function HotelSearchPage() {
  const [destination, setDestination] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!destination.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const result = await searchHotels({ destination, guests: 2, rooms: 1 });
      setHotels(result.hotels);
      setIsMock(result.isMockData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Search hotels</h1>

      <div className="mb-6 flex gap-3">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Where are you staying?"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Search size={16} /> Search
        </button>
      </div>

      {isMock && searched && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <Info size={16} /> Showing demo hotel data — connect a real hotel API key for live availability and pricing.
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-brand-500" size={28} />
        </div>
      )}

      {!loading && searched && hotels.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-500">No hotels found for that search.</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h) => (
          <HotelCard key={h.externalHotelId} hotel={h} />
        ))}
      </div>
    </div>
  );
}
