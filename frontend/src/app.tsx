import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

// Layouts
import DashboardLayout from "./userpanel/layouts/DashboardLayout";

// Components (Pages) - Adjusted to your exact folder structure
import UserDashboard from "./userpanel/pages/UserDashboard";
import FlightSearchPage from "./userpanel/pages/FlightSearchPage";
import MyBookingsPage from "./userpanel/pages/MyBookingsPage";
import AssistancePage from "./userpanel/pages/AssistancePage";
import DisasterModePage from "./userpanel/pages/DisasterModePage";
import LandingPage from "./userpanel/pages/LandingPage"; // New cinematic landing page
import AdminDashboard from "./userpanel/pages/AdminDashboard";
import AlternativeFlights from "./userpanel/pages/AlternativeFlights";
import AlternativeTrains from "./userpanel/pages/AlternativeTrains";
import NearbyHotels from "./userpanel/pages/NearbyHotels";
import TravelAssistant from "./userpanel/components/TravelAssistant";

// Environment Variable Check
const CLERK_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

// GitHub Pages base path
const BASE_PATH = import.meta.env.BASE_URL || "/";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Check your .env file.");
}

// GitHub Pages SPA redirect - check for stored path
(function() {
  const redirect = sessionStorage.getItem('gh-pages-redirect');
  if (redirect) {
    sessionStorage.removeItem('gh-pages-redirect');
    window.history.replaceState(null, '', redirect);
  }
})();

function App() {
  // Patch global fetch so relative requests (e.g. "/flights") are forwarded to API_URL
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    const apiBase = API_URL.replace(/\/$/, ""); // remove trailing slash

    const patchedFetch = async (input: RequestInfo, init?: RequestInit) => {
      try {
        // determine URL string
        let urlStr = typeof input === "string" ? input : (input as Request).url;

        // Only rewrite relative URLs that start with '/'
        if (urlStr.startsWith("/")) {
          urlStr = apiBase + urlStr;
        }

        if (typeof input === "string") {
          return originalFetch(urlStr, init);
        } else {
          const originalReq = input as Request;
          const newReq = new Request(urlStr, {
            method: originalReq.method,
            headers: originalReq.headers,
            body: originalReq.body,
            mode: originalReq.mode,
            credentials: originalReq.credentials,
            cache: originalReq.cache,
            redirect: originalReq.redirect,
            referrer: originalReq.referrer,
            integrity: originalReq.integrity,
            keepalive: originalReq.keepalive,
          });
          return originalFetch(newReq, init);
        }
      } catch (err) {
        return originalFetch(input, init);
      }
    };

    // install patch
    // @ts-ignore
    window.fetch = patchedFetch;

    return () => {
      // restore original fetch
      // @ts-ignore
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router basename={BASE_PATH}>
        <Routes>
          {/* 1. Public Route - Cinematic Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Protected User Routes wrapped in DashboardLayout (for passengers) or bare Outlet (for admins) */}
          <Route
            path="/user"
            element={<AuthenticatedLayout />}
          >
            {/* Redirect /user to /user/dashboard */}
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            
            {/* The dashboard handles Admin vs Passenger rendering */}
            <Route path="dashboard" element={<RoleBasedRedirect />} />
            <Route path="flights" element={<FlightSearchPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="assistance" element={<AssistancePage />} />
            <Route path="disruption" element={<DisasterModePage />} />

            {/* Alternative / Nearby routes as children of /user */}
            <Route path="alternative-flights" element={<AlternativeFlights />} />
            <Route path="alternative-trains" element={<AlternativeTrains />} />
            <Route path="nearby-hotels" element={<NearbyHotels />} />
          </Route>

          {/* 3. Catch-all: Redirect unknown routes to user dashboard */}
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

function AuthenticatedLayout() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-600"></div>
        <p className="mt-4">Securing your session...</p>
      </div>
    );
  }

  const role = user?.publicMetadata?.role;

  return (
    <>
      <SignedIn>
        {role === "admin" ? (
          // Admins: do not mount the user DashboardLayout (no blue sidebar) — allow child routes to render full-screen
          <Outlet />
        ) : (
          // Passengers: mount DashboardLayout which itself contains an Outlet for child routes
          <>
            <DashboardLayout />
            <TravelAssistant />
          </>
        )}
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
}

function RoleBasedRedirect() {
  const { user, isLoaded } = useUser();
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  useEffect(() => {
    // lightweight ping to backend root to verify connectivity
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-600"></div>
        <p className="mt-4">Securing your session...</p>
      </div>
    );
  }

  if (backendOk === false) {
    console.warn("Backend unreachable at", API_URL);
  }

  const role = user?.publicMetadata?.role;
  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}

export default App;