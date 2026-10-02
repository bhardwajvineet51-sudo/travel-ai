import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import PlannerPage from "./pages/PlannerPage";
import TripResultsPage from "./pages/TripResultsPage";
import HotelSearchPage from "./pages/HotelSearchPage";
import LoginPage from "./pages/LoginPage";
import MyTripsPage from "./pages/MyTripsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<PlannerPage />} />
          <Route path="/trip-results" element={<TripResultsPage />} />
          <Route path="/hotels" element={<HotelSearchPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
