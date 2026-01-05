import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Hotel, MapPin, Search, Star, Loader2, ArrowLeft, Heart,
  Info, Globe, ShieldCheck, Share2, Wifi, Coffee, Car,
  Utensils, Dumbbell, AlertCircle, History, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getHotelsByCity } from "../services/hotelService";

const NearbyHotels = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const locationParam = location.state?.location || "";
  const fromDisruption = location.state?.fromDisruption || false;

  const [city, setCity] = useState(locationParam);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load Recent Searches from LocalStorage
    const saved = localStorage.getItem("recent_hotel_searches");
    if (saved) setRecentSearches(JSON.parse(saved));

    // Auto-search if location provided
    if (locationParam) {
      handleSearch();
    }
  }, [locationParam]);

  const handleSearch = async (e?: React.FormEvent, manualCity?: string) => {
    if (e) e.preventDefault();

    const searchCity = (manualCity || city).trim();
    if (!searchCity) return;

    // Save to Recent Searches
    const updatedRecent = [searchCity, ...recentSearches.filter(s => s !== searchCity)].slice(0, 3);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recent_hotel_searches", JSON.stringify(updatedRecent));

    setLoading(true);
    setError("");

    try {
      const data = await getHotelsByCity(searchCity);
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

  const handleBookHotel = (hotel: any) => {
    // Navigate to booking with hotel details
    navigate('/user/booking', {
      state: {
        hotel,
        fromAlternative: true,
        type: 'hotel'
      }
    });
  };

  const copyHotelDetails = (hotel: any) => {
    const text = `Hotel: ${hotel.name}\nLocation: ${hotel.address}\nRating: ${hotel.rating}⭐\nPrice: ${hotel.amount}/night`;
    navigator.clipboard.writeText(text);
    alert("Hotel details copied!");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-700 rounded-full border-t-emerald-400 animate-spin mx-auto"></div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Finding perfect stays...</h3>
          <p className="text-slate-400">Searching premium hotels in {city}</p>
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
            <span className="font-semibold">Alternative accommodation options for disrupted journey</span>
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
                <Hotel className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Nearby Hotels</h1>
                <p className="text-sm text-slate-400">{city || "Search accommodations"}</p>
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
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Accommodation Recovery</h2>
                  <p className="text-slate-400">Premium stays near your destination</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                {hotels.length} hotels found
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="text-lg font-semibold text-white">{city || "Search required"}</p>
                <p className="text-sm text-slate-400">City/Airport</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Star className="h-4 w-4" />
                  Average Rating
                </div>
                <p className="text-lg font-semibold text-emerald-400">4.2+</p>
                <p className="text-sm text-slate-400">Premium stays</p>
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
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-semibold text-slate-300">City or Airport</label>
                  <div className="relative">
                    <Input
                      placeholder="Search city or airport (e.g. Delhi, Kolkata)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search Hotels
                </Button>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Recent searches</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCity(search);
                          handleSearch(undefined, search);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg whitespace-nowrap transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
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

        {/* Hotel Results */}
        {hotels.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Available Hotels</h3>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Verified Stays
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  Best Price
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 group overflow-hidden">
                  {/* Photo Section with Price Badge */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
                      <p className="text-sm font-bold text-emerald-400">{hotel.amount}
                        <span className="text-xs text-slate-400 font-medium"> /night</span>
                      </p>
                    </div>
                    <button className="absolute bottom-4 right-4 p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-all">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="max-w-[75%]">
                        <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
                          {hotel.name}
                        </h3>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-400" /> {hotel.address.split(',')[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-400/40">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span className="text-sm font-bold">{hotel.rating}</span>
                      </div>
                    </div>

                    {/* Amenities / Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {hotel.tags?.map((tag: string, i: number) => (
                        <Badge key={i} className="bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {/* Default amenities if none exist */}
                      {!hotel.tags && (
                        <>
                          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs gap-1">
                            <Wifi className="h-3 w-3" />
                            WiFi
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs gap-1">
                            <Coffee className="h-3 w-3" />
                            Breakfast
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs gap-1">
                            <Car className="h-3 w-3" />
                            Parking
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleBookHotel(hotel)}
                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2"
                      >
                        Book Now
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyHotelDetails(hotel)}
                        className="h-12 w-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && hotels.length === 0 && !error && (
          <Card className="bg-slate-900 border border-slate-800">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                  <Hotel className="h-10 w-10 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No Hotels Found</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    No accommodations available for this location. Try searching a nearby city or check alternative dates.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/user/alternative-trains', { state: { source: city, destination: city, fromDisruption: true } })}
                    className="bg-blue-600 hover:bg-blue-500 gap-2"
                  >
                    Check Trains Instead
                  </Button>
                  <Button
                    onClick={() => navigate('/user/alternative-flights', { state: { source: city, destination: city, fromDisruption: true } })}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
                  >
                    Find Flights
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
            <span className="text-xs font-semibold">Verified Stays</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Star className="h-4 w-4" />
            <span className="text-xs font-semibold">Premium Partners</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">Global Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyHotels;