import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Hotel, MapPin, Search, Star, Loader2, 
  ArrowLeft, Heart, Info, Globe, ShieldCheck, Share2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHotelsByCity } from "../services/hotelService";

const NearbyHotels = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await getHotelsByCity(city);
      if (data.length === 0) {
        setError("No stays found. Please check your city name or API Key.");
      }
      setHotels(data);
    } catch (err) {
      setError("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sleek Glassmorphism Header */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Hotel size={20} />
            </div>
            <span className="text-slate-800">STAY</span>
            <span className="text-blue-600">PRO</span>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <header className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-8 tracking-tight text-slate-900">
          Find your perfect <br/> 
          <span className="text-blue-600">travel sanctuary.</span>
        </h1>
        
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <Input 
            placeholder="Search city or airport (e.g. Delhi, Kolkata)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-16 pl-14 pr-36 rounded-2xl border-none shadow-2xl shadow-blue-100 text-lg font-medium focus:ring-2 focus:ring-blue-500"
          />
          <MapPin className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
          <Button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : "SEARCH"}
          </Button>
        </form>
      </header>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-8 pb-24">
        {error && (
          <div className="max-w-md mx-auto p-4 bg-white border-l-4 border-red-500 rounded-xl shadow-sm flex items-center gap-3 text-slate-600 mb-8">
            <Info className="text-red-500" /> 
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {hotels.map((hotel) => (
            <Card 
              key={hotel.id} 
              className="group border-none bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Photo Section with Dynamic Price Badge */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xl">
                  <p className="text-sm font-black text-blue-600">{hotel.amount} <span className="text-[10px] text-slate-400 font-bold uppercase">/ night</span></p>
                </div>
                <button className="absolute bottom-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-rose-500 transition-all">
                  <Heart size={18} />
                </button>
              </div>

              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[75%]">
                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 truncate">
                      {hotel.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="text-blue-500" /> {hotel.address.split(',')[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl">
                    <Star size={14} className="fill-amber-400" />
                    <span className="text-sm font-black">{hotel.rating}</span>
                  </div>
                </div>

                {/* Amenities / Tags Section */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {hotel.tags?.map((tag: string, i: number) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-tighter"
                    >
                      {tag}
                    </span>
                  ))}
                  {/* Default Tag if none exist */}
                  {!hotel.tags && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <ShieldCheck size={10} /> VERIFIED STAY
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 h-12 bg-slate-900 hover:bg-blue-600 rounded-2xl font-black transition-all shadow-lg hover:shadow-blue-200">
                    BOOK NOW
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 hover:bg-slate-50">
                    <Share2 size={18} className="text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {!loading && hotels.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Globe size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-center">
              Explore premium stays <br/> near any destination.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NearbyHotels;