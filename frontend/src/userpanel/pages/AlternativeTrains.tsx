import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Train, MapPin, Loader2, ArrowLeft, Search, AlertCircle, History, Share2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AlternativeTrains = () => {
  const navigate = useNavigate();
  
  // Data States
  const [allTrains, setAllTrains] = useState<any[]>([]);
  const [stationLookup, setStationLookup] = useState<Record<string, string>>({});
  
  // UI States
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
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
        setError("Failed to load data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

    if (filtered.length === 0) setError(`No direct trains found.`);
    else setError("");
    
    setResults(filtered);
  };

  const copyToClipboard = (t: any) => {
    const text = `Train: ${t.name} (${t.number})\nDep: ${t.departure} from ${t.from_station_name}\nArr: ${t.arrival} at ${t.to_station_name}`;
    navigator.clipboard.writeText(text);
    alert("Train details copied!");
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600 mb-2" />
      <p className="text-xs font-bold text-slate-400 uppercase">Syncing Live Trains...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full"><ArrowLeft /></Button>
          <h1 className="text-xl font-black italic tracking-tighter">EXPRESS<span className="text-emerald-500">FINDER</span></h1>
          <div className="w-10" />
        </header>

        {/* Search Panel */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="relative">
                <Input placeholder="Origin" value={fromCode} onChange={(e) => setFromCode(e.target.value)} className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold uppercase" />
                <MapPin className="absolute left-4 top-4 text-slate-300" />
              </div>
              <p className="text-[10px] ml-4 font-bold text-emerald-600 truncate">{stationLookup[fromCode.toUpperCase()]}</p>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input placeholder="Destination" value={toCode} onChange={(e) => setToCode(e.target.value)} className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold uppercase" />
                <MapPin className="absolute left-4 top-4 text-slate-300" />
              </div>
              <p className="text-[10px] ml-4 font-bold text-emerald-600 truncate">{stationLookup[toCode.toUpperCase()]}</p>
            </div>

            <Button type="submit" className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-100">
              <Search className="mr-2" /> FIND TRAINS
            </Button>
          </form>

          {/* Recent Searches Chips */}
          {recentSearches.length > 0 && (
            <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
              <History size={14} className="text-slate-400 shrink-0" />
              {recentSearches.map((s, i) => (
                <button key={i} onClick={() => {
                  const [f, t] = s.split(" → ");
                  setFromCode(f); setToCode(t);
                  handleSearch(undefined, f, t);
                }} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((t, idx) => (
            <Card key={idx} className="border-none shadow-sm rounded-[2rem] hover:scale-[1.02] transition-transform">
              <CardContent className="p-8">
                <div className="flex justify-between mb-4">
                  <Badge className="bg-emerald-50 text-emerald-700 border-none">#{t.number}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(t)}><Share2 size={14} /></Button>
                </div>
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-6">{t.name}</h3>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-slate-900">{t.departure}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">DEPARTURE</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-4 relative">
                    <Train size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-slate-300" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{t.arrival}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ARRIVAL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlternativeTrains;