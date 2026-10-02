import { env, hasRealWeatherApi } from "../../config/env";

export interface WeatherInfo {
  temperatureC: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  forecast: { date: string; high: number; low: number; condition: string }[];
  isMockData: boolean;
}

/**
 * Weather adapter. Mock data (clearly labeled via isMockData) is used
 * whenever WEATHER_API_KEY is unset. To go live, wire this up to a
 * provider like OpenWeatherMap or WeatherAPI.com.
 */
export async function getWeather(destination: string): Promise<WeatherInfo> {
  if (hasRealWeatherApi) {
    return callRealWeatherApi(destination);
  }
  return buildMockWeather();
}

async function callRealWeatherApi(_destination: string): Promise<WeatherInfo> {
  // TODO: call e.g. https://api.weatherapi.com/v1/forecast.json?key=${env.weatherApiKey}
  throw new Error("Real weather API integration not implemented. Set WEATHER_API_KEY.");
}

function buildMockWeather(): WeatherInfo {
  const conditions = ["Sunny", "Partly Cloudy", "Light Rain", "Clear"];
  return {
    temperatureC: 29,
    condition: "Partly Cloudy",
    rainProbability: 20,
    humidity: 65,
    forecast: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + i * 86_400_000).toISOString().slice(0, 10),
      high: 30 + (i % 3),
      low: 22 + (i % 2),
      condition: conditions[i % conditions.length],
    })),
    isMockData: true,
  };
}
