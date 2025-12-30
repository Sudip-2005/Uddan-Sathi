import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function WelcomePage() {
  const { isSignedIn } = useAuth();

  // Redirect if already logged in
  if (isSignedIn) return <Navigate to="/user/dashboard" replace />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-6xl font-black mb-4">UDAANSATHI ✈️</h1>
      <p className="text-xl opacity-70 mb-8 max-w-md text-center">
        Real-time flight disruption management and passenger assistance.
      </p>
      
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-bold transition">
            Sign In
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button className="border border-white/20 hover:bg-white/10 px-8 py-3 rounded-lg font-bold transition">
            Create Account
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}