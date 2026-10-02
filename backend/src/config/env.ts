import "dotenv/config";

function required(name: string, fallbackForDev = ""): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return fallbackForDev;
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),

  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET", "dev-insecure-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",

  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  hotelApiKey: process.env.HOTEL_API_KEY ?? "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? "",
  weatherApiKey: process.env.WEATHER_API_KEY ?? "",

  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",

  emailApiKey: process.env.EMAIL_API_KEY ?? "",

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};

// Feature flags: true only when a real key is configured.
// Every adapter checks its own flag and falls back to a clearly-labeled
// mock implementation when the flag is false. Nothing pretends mock data
// is real — see services/*Adapter.ts.
export const hasRealOpenAI = Boolean(env.openaiApiKey);
export const hasRealHotelApi = Boolean(env.hotelApiKey);
export const hasRealWeatherApi = Boolean(env.weatherApiKey);
export const hasRealMapsApi = Boolean(env.googleMapsApiKey);
export const hasRealPaymentGateway = Boolean(env.razorpayKeyId && env.razorpayKeySecret);
