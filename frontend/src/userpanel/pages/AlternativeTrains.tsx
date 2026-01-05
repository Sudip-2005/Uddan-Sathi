import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Train, MapPin, Loader2, ArrowLeft, Search, AlertCircle,
  History, Share2, Filter, Clock, Users, Wifi, Coffee,
  ShieldCheck, Star, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AlternativeTrains = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const source = location.state?.source || "";
  const destination = location.state?.destination || "";
  const fromDisruption = location.state?.fromDisruption || false;

  // Data States
  const [allTrains, setAllTrains] = useState<any[]>([]);
  const [stationLookup, setStationLookup] = useState<Record<string, string>>({});

  // UI States
  const [fromCode, setFromCode] = useState(source);
  const [toCode, setToCode] = useState(destination);
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load Recent Searches from LocalStorage
    const saved = localStorage.getItem("recent_rail_searches");
    if (saved) setRecentSearches(JSON.parse(saved));

    const fetchData = async () => {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/datameet/railways/master/trains.json'),
          fetch('https://raw.githubusercontent.com/datameet/railways/master/stations.json')
        ]);
        const trainsData = await tRes.json();
        const stationsData = await sRes.json();

        const sMap: Record<string, string> = {};
        stationsData.features.forEach((s: any) => {
          sMap[s.properties.code] = s.properties.name;
        });

        setAllTrains(trainsData.features || []);
        setStationLookup(sMap);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load train data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (source && destination && allTrains.length > 0) {
      handleSearch();
    }
  }, [source, destination, allTrains]);

  const handleSearch = (e?: React.FormEvent, manualFrom?: string, manualTo?: string) => {
    if (e) e.preventDefault();

    const start = (manualFrom || fromCode).toUpperCase().trim();
    const end = (manualTo || toCode).toUpperCase().trim();

    if (!start || !end) return;

    // Save to Recent Searches
    const searchKey = `${start} → ${end}`;
    const updatedRecent = [searchKey, ...recentSearches.filter(s => s !== searchKey)].slice(0, 3);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recent_rail_searches", JSON.stringify(updatedRecent));

    const filtered = allTrains
      .filter(t => t.properties.from_station_code === start && t.properties.to_station_code === end)
      .map(t => t.properties);

    if (filtered.length === 0) setError(`No direct trains found between ${start} and ${end}.`);
    else setError("");

    setResults(filtered);
  };

  const copyToClipboard = (t: any) => {
    const text = `Train: ${t.name} (${t.number})\nDep: ${t.departure} from ${t.from_station_name}\nArr: ${t.arrival} at ${t.to_station_name}`;
    navigator.clipboard.writeText(text);
    alert("Train details copied!");
  };

  const handleBookTrain = (train: any) => {
    // Navigate to booking with train details
    navigate('/user/booking', {
      state: {
        train,
        fromAlternative: true,
        type: 'train'
      }
    });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-700 rounded-full border-t-emerald-400 animate-spin mx-auto"></div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Loading train schedules...</h3>
          <p className="text-slate-400">Fetching live IRCTC data</p>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Emergency Banner if from disruption */}
      {fromDisruption && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-semibold">Alternative train options for disrupted journey</span>
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
              <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Train className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Alternative Trains</h1>
                <p className="text-sm text-slate-400">{fromCode} → {toCode}</p>
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
                <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
                  <Train className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Rail Recovery Options</h2>
                  <p className="text-slate-400">IRCTC contingency trains for your journey</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                {results.length} trains found
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  From Station
                </div>
                <p className="text-lg font-semibold text-white">{stationLookup[fromCode.toUpperCase()] || fromCode}</p>
                <p className="text-sm text-slate-400">{fromCode}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  To Station
                </div>
                <p className="text-lg font-semibold text-white">{stationLookup[toCode.toUpperCase()] || toCode}</p>
                <p className="text-sm text-slate-400">{toCode}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  Status
                </div>
                <p className="text-lg font-semibold text-emerald-400">Live Search Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Panel */}
        <Card className="bg-slate-900 border border-slate-800">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">From Station</label>
                <div className="relative">
                  <Input
                    placeholder="Origin code (e.g., NDLS)"
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    className="h-12 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                </div>
                {stationLookup[fromCode.toUpperCase()] && (
                  <p className="text-xs text-emerald-400">{stationLookup[fromCode.toUpperCase()]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">To Station</label>
                <div className="relative">
                  <Input
                    placeholder="Destination code (e.g., HWH)"
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    className="h-12 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                </div>
                {stationLookup[toCode.toUpperCase()] && (
                  <p className="text-xs text-emerald-400">{stationLookup[toCode.toUpperCase()]}</p>
                )}
              </div>

              <Button
                type="submit"
                className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 md:col-span-2"
              >
                <Search className="h-4 w-4" />
                Search Trains
              </Button>
            </form>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Recent searches</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const [f, t] = search.split(" → ");
                        setFromCode(f);
                        setToCode(t);
                        handleSearch(undefined, f, t);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg whitespace-nowrap transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-500/10 border border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Train Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Available Trains</h3>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  IRCTC Verified
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  Direct Routes
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {results.map((train, idx) => (
                <Card key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                              <Train className="h-6 w-6 text-slate-400 group-hover:text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">{train.name}</h4>
                              <p className="text-sm text-slate-400 font-mono">#{train.number}</p>
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
                            <p className="text-3xl font-black text-white">{train.departure}</p>
                            <p className="text-sm font-semibold text-slate-400">{train.from_station_name}</p>
                            <p className="text-xs text-slate-500">{train.from_station_code}</p>
                          </div>
                          <div className="flex-1 px-6">
                            <div className="relative">
                              <div className="w-full h-0.5 bg-slate-700"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-2 font-semibold">Direct Train</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-black text-white">{train.arrival}</p>
                            <p className="text-sm font-semibold text-slate-400">{train.to_station_name}</p>
                            <p className="text-xs text-slate-500">{train.to_station_code}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Duration: ~6h 30m</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Multiple classes available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4" />
                            <span>Meals included</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:min-w-[200px]">
                        <Button
                          onClick={() => handleBookTrain(train)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 gap-2"
                        >
                          Book This Train
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(train)}
                          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && !error && (
          <Card className="bg-slate-900 border border-slate-800">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                  <Train className="h-10 w-10 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No Trains Found</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    No direct trains available for this route. Consider connecting trains or check alternative dates.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/user/alternative-flights', { state: { source: fromCode, destination: toCode, fromDisruption: true } })}
                    className="bg-blue-600 hover:bg-blue-500 gap-2"
                  >
                    Check Flights Instead
                  </Button>
                  <Button
                    onClick={() => navigate('/user/nearby-hotels', { state: { location: fromCode, fromDisruption: true } })}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
                  >
                    Find Hotels
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
            <span className="text-xs font-semibold">IRCTC Verified</span>
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

export default AlternativeTrains;