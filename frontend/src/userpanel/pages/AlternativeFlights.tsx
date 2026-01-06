import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plane, ArrowLeft, Loader2, Calendar, Clock,
  ChevronRight, Sparkles, ShieldCheck, MapPin,
  Search, Filter, Star, Wifi, Coffee, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AlternativeFlights = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const source = location.state?.source || "DEL";
  const destination = location.state?.destination || "DOH";
  const flightId = location.state?.flightId || "";
  const fromDisruption = location.state?.fromDisruption || false;

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/flights/search?source=${source}&destination=${destination}`);
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

  const handleBookFlight = (flight: any) => {
    // Navigate to booking with flight details
    navigate('/user/booking', {
      state: {
        flight,
        fromAlternative: true,
        originalFlightId: flightId
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Emergency Banner if from disruption */}
      {fromDisruption && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-semibold">Alternative flight options for disrupted journey</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Alternative Flights</h1>
                <p className="text-sm text-slate-400">{source} → {destination}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Route Overview Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Flight Recovery Options</h2>
                  <p className="text-slate-400">Smart alternatives for your disrupted journey</p>
                </div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                {flights.length} options found
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  Route
                </div>
                <p className="text-lg font-semibold text-white">{source} → {destination}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  Priority
                </div>
                <p className="text-lg font-semibold text-green-400">Urgent Rebooking</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                  Status
                </div>
                <p className="text-lg font-semibold text-blue-400">Live Search Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="bg-slate-900 border border-slate-800">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-slate-700 rounded-full border-t-blue-400 animate-spin mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Scanning flight schedules...</h3>
                  <p className="text-slate-400">Finding the best alternatives for your route</p>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flights List */}
        {!loading && flights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Available Flights</h3>
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                  Partner Airlines
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  Direct Routes
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {flights.map((f: any) => (
                <Card key={f.flight_no} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                              <Plane className="h-6 w-6 text-slate-400 group-hover:text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">{f.airline}</h4>
                              <p className="text-sm text-slate-400 font-mono">{f.flight_no}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-3xl font-black text-white">{f.dep_time}</p>
                            <p className="text-sm font-semibold text-slate-400">{f.source}</p>
                          </div>
                          <div className="flex-1 px-6">
                            <div className="relative">
                              <div className="w-full h-0.5 bg-slate-700"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-2 font-semibold">Direct Flight</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-black text-white">{f.arrival_time || "01:30"}</p>
                            <p className="text-sm font-semibold text-slate-400">{f.destination}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Duration: ~2h 30m</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            <span>WiFi Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4" />
                            <span>Meals Included</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:min-w-[200px]">
                        <Button
                          onClick={() => handleBookFlight(f)}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 gap-2"
                        >
                          Book This Flight
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Flights Found */}
        {!loading && flights.length === 0 && (
          <Card className="bg-slate-900 border border-slate-800">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                  <Plane className="h-10 w-10 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No Alternative Flights Available</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    All flights on this route are currently at capacity. Consider train options or nearby hotels while we monitor for openings.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/user/alternative-trains', { state: { source, destination, fromDisruption: true } })}
                    className="bg-emerald-600 hover:bg-emerald-500 gap-2"
                  >
                    Check Train Options
                  </Button>
                  <Button
                    onClick={() => navigate('/user/nearby-hotels', { state: { location: source, fromDisruption: true } })}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
                  >
                    Find Nearby Hotels
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 py-6 opacity-60">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-semibold">Secure Booking</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Star className="h-4 w-4" />
            <span className="text-xs font-semibold">Best Price Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeFlights;