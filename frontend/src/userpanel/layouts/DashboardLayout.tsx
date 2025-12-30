import { Outlet } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react"; // Import Clerk hooks/components
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const DashboardLayout = () => {
  // 1. Get real user data from Clerk
  const { user, isLoaded } = useUser();

  // 2. Loading state to prevent layout shift
  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse text-indigo-600 font-bold">UdaanSathi Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      {/* SIDEBAR: Stays visible on the left */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        {/* TOPBAR: Updated to show real user info and Clerk's UserButton */}
        <header className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
             {/* Dynamic Greeting */}
             <h2 className="text-lg font-semibold text-slate-800">
               Welcome back, <span className="text-indigo-600">{user?.firstName || "Passenger"}</span>
             </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Badge Placeholder (as you had before) */}
            <div className="relative cursor-pointer opacity-70 hover:opacity-100 transition">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* CLERK USER BUTTON: Replaces manual logout button */}
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                  {user?.publicMetadata?.role === 'admin' ? 'Ops Center Admin' : 'Passenger'}
                </p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        
        {/* MAIN CONTENT: Dynamic pages render here */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;