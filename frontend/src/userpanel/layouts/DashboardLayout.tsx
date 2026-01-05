import { Outlet } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react"; // Import Clerk hooks/components
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationCard from "../components/NotificationCard";
import { Notification } from "../services/notificationService";
import { ThemeToggle } from "@/components/theme-toggle";

const DashboardLayout = () => {
  // 1. Get real user data from Clerk
  const { user, isLoaded } = useUser();

  // Demo notifications for the web app
  const demoNotifications: Notification[] = [
    {
      id: "1",
      pnr: "demo",
      type: "info",
      message: "Welcome to UdaanSathi! Your travel companion is now active.",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      pnr: "demo",
      type: "info",
      message: "New feature: Real-time flight tracking is now available.",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: false,
    },
    {
      id: "3",
      pnr: "demo",
      type: "warning",
      message: "Don't forget to check your booking details before travel.",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      read: false,
    },
  ];

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
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {demoNotifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                  Notifications
                </div>
                <DropdownMenuSeparator />
                {demoNotifications.map((notification) => (
                  <div key={notification.id} className="px-2 py-1">
                    <NotificationCard notification={notification} />
                  </div>
                ))}
                {demoNotifications.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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