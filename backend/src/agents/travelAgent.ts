import OpenAI from "openai";
import { env, hasRealOpenAI } from "../config/env";
import { AiTripPlan, TripPlanRequest } from "../types";
import { AppError } from "../middleware/errorHandler";

const client = hasRealOpenAI ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const RESPONSE_SCHEMA_INSTRUCTIONS = `
Return ONLY a single JSON object (no markdown fences, no prose) matching exactly this shape:

{
  "destination": string,
  "tripSummary": string,
  "estimatedBudget": {
    "transport": number, "hotel": number, "food": number,
    "activities": number, "localTransport": number, "miscellaneous": number, "total": number
  },
  "hotelRecommendations": [{ "name": string, "pricePerNight": number, "rating": number, "reason": string }],
  "itinerary": [{ "day": number, "title": string, "activities": [{ "time": string, "activity": string, "estimatedCost": number }] }],
  "restaurants": [{ "name": string, "cuisine": string, "priceLevel": string }],
  "activities": [{ "name": string, "estimatedCost": number, "category": string }],
  "transportSuggestions": [{ "mode": string, "estimatedCost": number, "note": string }],
  "budgetTips": [string],
  "warnings": [string]
}

Rules:
- All costs are in the user's specified currency, as plain numbers.
- Do NOT invent real-time hotel availability or claim a booking is confirmed — these are estimates/recommendations only, real availability comes from a separate hotel API.
- estimatedBudget.total must equal the sum of its parts.
- Optimize the plan to fit the user's budget as closely as possible without exceeding it unnecessarily. If it's genuinely not feasible, say so honestly in "warnings" rather than hiding the shortfall.
- itinerary must cover every day of the trip.
`;

function buildPrompt(req: TripPlanRequest): string {
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / 86_400_000
    )
  );

  return `You are an expert travel planning agent. Create a personalized, budget-aware trip plan.

Trip request:
- Destination: ${req.destination}
- Dates: ${req.startDate} to ${req.endDate} (${days} days)
- Travelers: ${req.numberOfAdults} adult(s), ${req.numberOfChildren} child(ren)
- Total budget: ${req.budget} ${req.currency}
- Travel preferences: ${req.travelPreferences.join(", ")}
- Travel style: ${req.travelStyle}
- Transport preference: ${req.transportPreference}

${RESPONSE_SCHEMA_INSTRUCTIONS}`;
}

async function callOpenAI(req: TripPlanRequest, attempt = 1): Promise<any> {
  if (!client) throw new AppError("AI service not configured", 503, "AI_NOT_CONFIGURED");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const completion = await client.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output only valid JSON. No markdown, no commentary." },
          { role: "user", content: buildPrompt(req) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      },
      { signal: controller.signal }
    );

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");
    return JSON.parse(raw);
  } catch (err) {
    if (attempt < 2) {
      // One retry for transient failures (timeouts, rate limits, bad JSON).
      return callOpenAI(req, attempt + 1);
    }
    throw new AppError(
      "AI planning failed. Please try again.",
      502,
      "AI_PLANNING_FAILED"
    );
  } finally {
    clearTimeout(timeout);
  }
}

// Deterministic, clearly-labeled mock plan used only when OPENAI_API_KEY
// is not configured, so local development still works end-to-end.
function buildMockPlan(req: TripPlanRequest): any {
  const days = Math.max(
    1,
    Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / 86_400_000)
  );
  const perDayHotel = Math.round((req.budget * 0.3) / days);
  const transport = Math.round(req.budget * 0.25);
  const hotel = perDayHotel * days;
  const food = Math.round(req.budget * 0.2);
  const activities = Math.round(req.budget * 0.15);
  const localTransport = Math.round(req.budget * 0.06);
  const miscellaneous = Math.round(req.budget * 0.04);
  const total = transport + hotel + food + activities + localTransport + miscellaneous;

  return {
    destination: req.destination,
    tripSummary: `A ${days}-day ${req.travelStyle.toLowerCase()} trip to ${req.destination} for ${req.numberOfAdults + req.numberOfChildren} traveler(s), focused on ${req.travelPreferences.join(", ").toLowerCase()}. (Demo plan — connect OPENAI_API_KEY for real AI-generated itineraries.)`,
    estimatedBudget: { transport, hotel, food, activities, localTransport, miscellaneous, total },
    hotelRecommendations: [
      { name: `${req.destination} Comfort Stay`, pricePerNight: perDayHotel, rating: 4.1, reason: "Fits your budget and travel style (demo data)." },
    ],
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Arrival in ${req.destination}` : `Exploring ${req.destination} — Day ${i + 1}`,
      activities: [
        { time: "10:00 AM", activity: `${req.travelPreferences[0] ?? "Sightseeing"} activity (demo)`, estimatedCost: Math.round(activities / days) },
        { time: "7:00 PM", activity: "Local dinner (demo)", estimatedCost: Math.round(food / days) },
      ],
    })),
    restaurants: [{ name: "Local Favorite Cafe", cuisine: "Regional", priceLevel: "$$" }],
    activities: [{ name: `${req.travelPreferences[0] ?? "City"} tour`, estimatedCost: Math.round(activities / 2), category: req.travelPreferences[0] ?? "General" }],
    transportSuggestions: [{ mode: req.transportPreference, estimatedCost: transport, note: "Estimated only — demo data." }],
    budgetTips: ["Book hotels in advance for better rates.", "This is demo data — connect a real AI key for tailored plans."],
    warnings: total > req.budget ? [`Estimated cost exceeds budget by ${total - req.budget} ${req.currency}.`] : [],
  };
}

export async function generateTripPlan(req: TripPlanRequest): Promise<AiTripPlan> {
  const raw = hasRealOpenAI ? await callOpenAI(req) : buildMockPlan(req);
  return finalizePlan(raw, req, !hasRealOpenAI);
}

export async function optimizeBudget(
  req: TripPlanRequest,
  newBudget: number
): Promise<AiTripPlan> {
  return generateTripPlan({ ...req, budget: newBudget });
}

// Normalizes AI/mock output, recomputes budget totals defensively, and
// flags whether the plan exceeds budget.
function finalizePlan(raw: any, req: TripPlanRequest, isMockData: boolean): AiTripPlan {
  const b = raw.estimatedBudget ?? {};
  const transport = Number(b.transport ?? 0);
  const hotel = Number(b.hotel ?? 0);
  const food = Number(b.food ?? 0);
  const activities = Number(b.activities ?? 0);
  const localTransport = Number(b.localTransport ?? 0);
  const miscellaneous = Number(b.miscellaneous ?? 0);
  const total = transport + hotel + food + activities + localTransport + miscellaneous;

  const overBudgetAmount = Math.max(0, total - req.budget);

  return {
    destination: raw.destination ?? req.destination,
    tripSummary: raw.tripSummary ?? "",
    estimatedBudget: { transport, hotel, food, activities, localTransport, miscellaneous, total },
    hotelRecommendations: raw.hotelRecommendations ?? [],
    itinerary: raw.itinerary ?? [],
    restaurants: raw.restaurants ?? [],
    activities: raw.activities ?? [],
    transportSuggestions: raw.transportSuggestions ?? [],
    budgetTips: raw.budgetTips ?? [],
    warnings: [
      ...(raw.warnings ?? []),
      ...(overBudgetAmount > 0
        ? [`Your current plan exceeds your budget by ${overBudgetAmount} ${req.currency}.`]
        : []),
    ],
    isOverBudget: overBudgetAmount > 0,
    overBudgetAmount,
    isMockData,
  };
}
