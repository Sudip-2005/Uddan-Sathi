import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell, Plane, RefreshCw, Loader2, Calendar,
  Clock, MapPin, TrendingUp, Search, Ticket,
  AlertTriangle, CheckCircle2, ArrowRight, Sparkles,
  Sun, Cloud, Wind, Star, Zap, Shield, Heart, Info,
  Activity, Users, Globe, Wifi, XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DisasterAlert from "../components/DisasterAlert";
import { StatCard } from "../components/StatCard";
import { QuickAction } from "../components/QuickAction";
import { TravelTip } from "../components/TravelTip";
import { HeroSection } from "../components/HeroSection";
import NotificationCard from "../components/NotificationCard";

const POLLING_INTERVAL = 30000;

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [pnr, setPnr] = useState("");
  const [activePnr, setActivePnr] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const prevCountRef = useRef<number>(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchNotifications = useCallback(async (pnrValue: string) => {
    if (!pnrValue || !pnrValue.trim()) return;
    setIsLoadingNotifications(true);
    try {
      const res = await fetch(`/notifications/${pnrValue.toUpperCase()}`, { credentials: "include" });
      if (!res.ok) {
        // no data or server error; clear list and bail
        console.warn("Notifications fetch not OK", res.status);
        setNotifications([]);
        setLastUpdated(new Date());
        prevCountRef.current = 0;
        return;
      }

      const result = await res.json().catch(() => null);
      // support different response shapes
      const data: any[] = (result && (result.data || result.notifications)) || (Array.isArray(result) ? result : []);
      if (!Array.isArray(data) || data.length === 0) {
        setNotifications([]);
        setLastUpdated(new Date());
        prevCountRef.current = 0;
        return;
      }

      const sortedData = data.sort((a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // show toast only when we have more notifications than before
      const prevLen = prevCountRef.current || 0;
      if (sortedData.length > prevLen) {
        const latest = sortedData[0];
        toast({
          title: latest.title || "Flight Update",
          description: latest.message,
          variant: latest.type === 'CANCELLED' ? "destructive" : "default",
        });
      }

      setNotifications(sortedData);
      setLastUpdated(new Date());
      prevCountRef.current = sortedData.length;
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!activePnr) return;
    const interval = setInterval(() => fetchNotifications(activePnr), POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [activePnr, fetchNotifications]);

  // Load stored PNR on mount for persistent tracking
  useEffect(() => {
    const storedPnr = localStorage.getItem("activePnr");
    if (storedPnr && storedPnr.trim()) {
      setPnr(storedPnr);
      setActivePnr(storedPnr);
      fetchNotifications(storedPnr);
    }
  }, []);

  // react to admin-side in-app notifications (local fallback)
  useEffect(() => {
    const handler = (e: any) => {
      // when admin publishes a flight-notification, refetch current active PNR
      if (activePnr) fetchNotifications(activePnr);
    };
    window.addEventListener("flight-notification", handler);
    return () => window.removeEventListener("flight-notification", handler);
  }, [activePnr, fetchNotifications]);

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.trim()) {
      const trimmedPnr = pnr.trim().toUpperCase();
      setActivePnr(trimmedPnr);
      // Save to localStorage for DisasterModePage access
      localStorage.setItem("activePnr", trimmedPnr);
      fetchNotifications(trimmedPnr);
    }
  };

  const handleClearTracking = () => {
    setPnr("");
    setActivePnr("");
    setNotifications([]);
    setLastUpdated(null);
    localStorage.removeItem("activePnr");
    prevCountRef.current = 0;
  };

  // --- TRIGGER LOGIC ---
  const cancellations = notifications.filter(n => n.type === 'CANCELLED');
  const alerts = notifications.filter(n => n.type === 'DELAYED');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5">
      <div className="space-y-8 max-w-7xl mx-auto p-6 lg:p-8">
        <Toaster />

        {/* EMERGENCY TRIGGER BANNER: Only shows when a flight is cancelled */}
        {cancellations.length > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white p-6 rounded-3xl shadow-2xl border border-red-400/50 animate-in fade-in zoom-in duration-700">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/25 p-4 rounded-2xl animate-pulse backdrop-blur-sm shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Urgent</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">Flight Disrupted: Action Required</h2>
                  <p className="text-white/90 text-sm mt-1">Your flight has been cancelled. Access the emergency center for refunds and alternatives.</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/user/disruption')}
                className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 py-6 h-auto text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-white/50"
              >
                <Shield className="h-5 w-5 mr-2" />
                Resolve Now
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl"></div>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection
          greeting={getGreeting()}
          formattedDate={getFormattedDate()}
          lastUpdated={lastUpdated}
          pnr={pnr}
          setPnr={setPnr}
          onSubmit={handlePnrSearch}
          isLoading={isLoadingNotifications}
        />

        {/* Your Existing DisasterAlert Component */}
        {cancellations.length > 0 && <DisasterAlert cancellations={cancellations} />}

        {/* Active Tracking Indicator */}
        {activePnr && (
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-60"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Plane className="h-6 w-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
                    <p className="text-sm text-white/90 font-medium">Actively Tracking</p>
                  </div>
                  <p className="text-2xl font-bold text-white font-mono tracking-wider drop-shadow-md">{activePnr}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fetchNotifications(activePnr)}
                  disabled={isLoadingNotifications}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold shadow-lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingNotifications ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearTracking}
                  className="bg-white/10 hover:bg-red-500/80 text-white border-white/20 backdrop-blur-sm font-semibold shadow-lg hover:border-red-400"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>
        )}

        {/* Stats Cards - Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <StatCard icon={Bell} label="Notifications" value={notifications.length} accent={notifications.length > 0} />
          <StatCard icon={AlertTriangle} label="Active Alerts" value={alerts.length} gradient />
          <StatCard icon={CheckCircle2} label="Flight Status" value={cancellations.length > 0 ? "Disrupted" : "Normal"} accent={cancellations.length > 0} />
          <StatCard icon={TrendingUp} label="Daily Updates" value={notifications.length} gradient />
        </div>

        {/* Quick Actions - Enhanced with colors and dark mode */}
        <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 rounded-2xl">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
            <p className="text-muted-foreground dark:text-muted-foreground/80 text-lg">Access your most used features instantly</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickAction icon={Search} label="Search Flights" onClick={() => navigate('/user/flights')} color="blue" />
              <QuickAction icon={Ticket} label="My Bookings" onClick={() => navigate('/user/bookings')} color="green" />
              <QuickAction icon={AlertTriangle} label="Disruptions" onClick={() => navigate('/user/disruption')} color="orange" />
              <QuickAction icon={Heart} label="Support" onClick={() => navigate('/user/assistance')} color="purple" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed - Enhanced with dark mode */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-400/30 dark:to-indigo-400/30 rounded-2xl">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                Recent Updates
                {notifications.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-full font-bold shadow-lg shadow-primary/20 animate-pulse">
                    {notifications.length} active
                  </span>
                )}
              </CardTitle>
              <p className="text-muted-foreground dark:text-muted-foreground/80 text-lg">Real-time flight status and important notifications</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plane className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 text-xl font-semibold mb-2">
                    {activePnr ? "No updates yet" : "Start Tracking Your Flight"}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-base max-w-md mx-auto leading-relaxed mb-6">
                    {activePnr 
                      ? `We're monitoring PNR ${activePnr}. You'll be notified of any changes.`
                      : "Enter your 6-character PNR number above to receive real-time flight updates and notifications."
                    }
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">{activePnr ? "Actively monitoring" : "System ready"}</span>
                  </div>
                  {!activePnr && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm">Example: ABC123</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm">6 characters</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n, i) => (
                    <NotificationCard key={i} notification={n} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Travel Tips - Enhanced with dark mode */}
          <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-400/30 dark:to-pink-400/30 rounded-2xl">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                Travel Tips
              </CardTitle>
              <p className="text-muted-foreground dark:text-muted-foreground/80 text-lg">Expert advice for better journeys</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <TravelTip
                icon={Shield}
                title="Travel Insurance Protection"
                description="Always carry comprehensive travel insurance for complete peace of mind during your journey."
              />
              <TravelTip
                icon={Clock}
                title="Smart Check-in Timing"
                description="Web check-in opens 48 hours early. Domestic flights: 2 hours, International: 3 hours before departure."
              />
              <TravelTip
                icon={MapPin}
                title="ID Verification Essentials"
                description="Carry original ID proof. Aadhaar, Passport, or Driving License accepted at all airports."
              />
              <TravelTip
                icon={Cloud}
                title="Weather-Aware Travel"
                description="Check destination weather forecasts and pack accordingly for a comfortable, stress-free trip."
              />
              <TravelTip
                icon={Heart}
                title="Health & Wellness Priority"
                description="Stay hydrated, wear masks in crowded areas, and follow local health guidelines for safety."
              />
              <TravelTip
                icon={Globe}
                title="Digital Travel Companion"
                description="Use our mobile app for real-time updates, digital boarding passes, and instant support."
              />
              <TravelTip
                icon={Wifi}
                title="Stay Connected"
                description="Free WiFi available at major airports. Download offline maps and entertainment for flights."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;