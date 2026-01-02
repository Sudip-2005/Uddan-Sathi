import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Plane, ArrowLeft, Loader2, Calendar, Clock, 
  ChevronRight, Sparkles, ShieldCheck, MapPin 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AlternativeFlights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const source = location.state?.source || "DEL";
  const destination = location.state?.destination || "DOH";
  const flightId = location.state?.flightId || "";

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        const response = await fetch(`http://localhost:5000/flights/search?source=${source}&destination=${destination}`);
        const result = await response.json();
        if (result.ok) {
          // Filter out the disrupted flight and show others
          setFlights(result.data.filter((f: any) => f.flight_no !== flightId));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setTimeout(() => setLoading(false), 800); // Small delay for "AI Thinking" feel
      }
    };
    fetchAlternatives();
  }, [source, destination, flightId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Premium Header Section */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-slate-100 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Alternate Flights</span>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        {/* AI Insight Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            Finding your way home
          </h1>
          <p className="mt-2 text-indigo-100 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {source} to {destination}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Priority Level</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Urgent Recovery
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Status</p>
              <p className="text-lg font-semibold">Analyzing {flights.length} Options</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Available Re-bookings</h2>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">Partner Airlines Only</Badge>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
              <p className="text-slate-500 font-medium animate-pulse">Scanning live schedules...</p>
            </div>
          ) : flights.length > 0 ? (
            <div className="grid gap-4">
              {flights.map((f: any) => (
                <Card key={f.flight_no} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-stretch">
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                              <Plane className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{f.airline}</p>
                              <p className="text-xs text-slate-500 uppercase tracking-tighter">{f.flight_no}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-none">Fastest Route</Badge>
                        </div>

                        <div className="flex items-center justify-between px-2">
                          <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{f.dep_time}</p>
                            <p className="text-sm font-bold text-slate-400">{f.source}</p>
                          </div>
                          <div className="flex-1 px-8 flex flex-col items-center">
                            <div className="w-full h-[2px] bg-slate-200 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-indigo-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Direct</span>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{f.arrival_time || "01:30"}</p>
                            <p className="text-sm font-bold text-slate-400">{f.destination}</p>
                          </div>
                        </div>
                      </div>

                      <button className="bg-slate-900 group-hover:bg-indigo-600 text-white px-8 py-6 flex items-center justify-center transition-colors">
                        <span className="font-bold text-sm whitespace-nowrap flex items-center gap-2">
                          Book Now <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Plane className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No alternatives found</h3>
              <p className="text-slate-500 mt-2">All flights on this route are currently booked. Please check Trains or Hotels.</p>
            </div>
          )}
        </div>

        {/* Security Reassurance */}
        <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </main>
    </div>
  );
};

export default AlternativeFlights;