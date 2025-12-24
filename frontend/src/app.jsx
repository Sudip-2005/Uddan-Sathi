import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import WelcomePage from "./pages/WelcomePage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn><RoleBasedRedirect /></SignedIn>
                <SignedOut><Navigate to="/" /></SignedOut>
              </>
            } 
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

function RoleBasedRedirect() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div style={{color: 'white', padding: '20px'}}>Loading...</div>;
  const role = user?.publicMetadata?.role;
  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}

export default App;