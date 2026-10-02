import { Star, MapPin } from "lucide-react";
import type { Hotel } from "../types";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <p className="font-semibold text-slate-900">{hotel.name}</p>
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
            <Star size={11} fill="currentColor" /> {hotel.rating}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} /> {hotel.location} · {hotel.distanceFromCenterKm} km from center
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{a}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm">
            <span className="text-lg font-bold text-slate-900">{hotel.currency} {hotel.pricePerNight.toLocaleString()}</span>
            <span className="text-slate-400"> / night</span>
          </p>
          <button className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
