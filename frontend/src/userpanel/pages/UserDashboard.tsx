import { useState, useEffect, useCallback } from "react";
import { 
  Bell, Plane, RefreshCw, Loader2, Calendar, 
  Clock, MapPin, TrendingUp, Search, Ticket,
  AlertTriangle, CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DisasterAlert from "../components/DisasterAlert";

const POLLING_INTERVAL = 30000;

// --- KEEPING YOUR ORIGINAL COMPONENTS ---
const StatCard = ({ icon: Icon, label, value, subtext, accent = false }: any) => (
  <Card className={`relative overflow-hidden ${accent ? 'border-primary/30 bg-primary/5' : ''}`}>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-lg ${accent ? 'bg-primary/10' : 'bg-muted'}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({ icon: Icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-200 group">
    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <span className="text-sm font-medium text-foreground">{label}</span>
  </button>
);

const TravelTip = ({ title, description }: any) => (
  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [pnr, setPnr] = useState("");
  const [activePnr, setActivePnr] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
    if (!pnrValue.trim()) return;
    setIsLoadingNotifications(true);
    try {
      const response = await fetch(`http://localhost:5000/notifications/${pnrValue.toUpperCase()}`);
      const result = await response.json();
      
      if (result.ok && result.data.length > 0) {
        const sortedData = result.data.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        if (notifications.length === 0 || sortedData.length > notifications.length) {
          const latest = sortedData[0];
          toast({
            title: latest.title || "Flight Update",
            description: latest.message,
            variant: latest.type === 'CANCELLED' ? "destructive" : "default",
          });
        }

        setNotifications(sortedData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [notifications, toast]);

  useEffect(() => {
    if (!activePnr) return;
    const interval = setInterval(() => fetchNotifications(activePnr), POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [activePnr, fetchNotifications]);

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.trim()) {
      setActivePnr(pnr.trim());
      fetchNotifications(pnr.trim());
    }
  };

  // --- TRIGGER LOGIC ---
  const cancellations = notifications.filter(n => n.type === 'CANCELLED');
  const alerts = notifications.filter(n => n.type === 'DELAYED');

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <Toaster />

      {/* EMERGENCY TRIGGER BANNER: Only shows when a flight is cancelled */}
      {cancellations.length > 0 && (
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl border-2 border-red-400 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Flight Disrupted: Urgent Action Required</h2>
                <p className="text-red-100 text-sm">Your flight has been cancelled. Access the control center for refunds and alternatives.</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/user/disruption')} 
              className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-6 h-auto text-lg shadow-lg"
            >
              Resolve Now
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}!</h1>
              <p className="text-primary-foreground/80 mt-1">{getFormattedDate()}</p>
            </div>
            <div className="text-sm bg-primary-foreground/10 px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Not synced'}</span>
            </div>
          </div>
          
          <form onSubmit={handlePnrSearch} className="mt-6 flex gap-3 max-w-lg">
            <Input
              placeholder="Enter PNR"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.toUpperCase())}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" variant="secondary" disabled={isLoadingNotifications}>
              {isLoadingNotifications ? <Loader2 className="animate-spin" /> : <Search className="h-4 w-4" />}
              Track
            </Button>
          </form>
        </div>
        <Plane className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
      </div>

      {/* Your Existing DisasterAlert Component */}
      {cancellations.length > 0 && <DisasterAlert cancellations={cancellations} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bell} label="Notifications" value={notifications.length} accent={notifications.length > 0} />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={alerts.length} />
        <StatCard icon={CheckCircle2} label="Status" value={cancellations.length > 0 ? "Disrupted" : "Normal"} />
        <StatCard icon={TrendingUp} label="Daily Updates" value={notifications.length} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickAction icon={Search} label="Search" onClick={() => navigate('/user/flights')} />
            <QuickAction icon={Ticket} label="Bookings" onClick={() => navigate('/user/bookings')} />
            <QuickAction icon={AlertTriangle} label="Disruptions" onClick={() => navigate('/user/disruption')} />
            <QuickAction icon={Bell} label="Support" onClick={() => navigate('/user/assistance')} />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Recent Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No updates found for PNR: {activePnr || "---"}</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 ${n.type === 'CANCELLED' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm uppercase">{n.title || n.type}</p>
                    <span className="text-[10px] text-muted-foreground">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm mt-1">{n.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Travel Tips */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Travel Tips</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <TravelTip title="Check-in" description="Web check-in opens 48h early." />
            <TravelTip title="ID Proof" description="Carry Aadhaar/Passport." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;