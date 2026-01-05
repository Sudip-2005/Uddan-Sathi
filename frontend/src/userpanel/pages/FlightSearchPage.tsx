import { useState, useEffect } from "react";
import { Search, Plane, MapPin, Loader2, Sparkles, ArrowRight, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlightCard from "../components/FlightCard";
import { flightService, Flight } from "../services/flightService";

const FlightSearchPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Initial Load: Get all flights from backend
  useEffect(() => {
    const loadFlights = async () => {
      setIsLoading(true);
      try {
        const data = await flightService.getFlights();
        console.log("Flights loaded:", data);
        setFlights(data);
        setFilteredFlights(data);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlights();
  }, []);

  // 2. Search Logic: Now uses the backend search route
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) {
       // Optional: you could filter locally if one field is empty
       return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await flightService.searchFlights(source, destination);
      setFilteredFlights(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  // 3. Clear Search: Resets to all flights
  const handleClear = () => {
    setSource("");
    setDestination("");
    setFilteredFlights(flights);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5">
      <div className="space-y-8 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Animated Header Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm animate-pulse">
            <Sparkles className="h-4 w-4" />
            Find Your Perfect Flight
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Search Flights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover amazing flight deals and book your journey with ease. Search by route and find the best options for your travel.
          </p>
        </div>

        {/* Enhanced Search Form Card */}
        <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 rounded-xl">
                <Search className="h-6 w-6 text-primary" />
              </div>
              Search Criteria
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Real-time Search
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <Label htmlFor="source" className="flex items-center gap-2 text-sm font-semibold">
                    <div className="p-1 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    From (Source)
                  </Label>
                  <div className="relative">
                    <Input
                      id="source"
                      placeholder="e.g., Delhi, Mumbai..."
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="h-12 pl-12 bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80 dark:hover:bg-background/50"
                    />
                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-3 group">
                  <Label htmlFor="destination" className="flex items-center gap-2 text-sm font-semibold">
                    <div className="p-1 bg-green-500/10 dark:bg-green-500/20 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300">
                      <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    To (Destination)
                  </Label>
                  <div className="relative">
                    <Input
                      id="destination"
                      placeholder="e.g., Mumbai, Bangalore..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="h-12 pl-12 bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80 dark:hover:bg-background/50"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Animated Search Button */}
              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || isSearching}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    {isLoading || isSearching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    <span>{isSearching ? 'Searching...' : 'Search Flights'}</span>
                    {!isLoading && !isSearching && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />}
                  </div>
                </Button>
                {hasSearched && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="h-12 px-6 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Results Section */}
        <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-xl">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              {hasSearched ? "Search Results" : "All Available Flights"}
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/40"></div>
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">Searching for flights...</p>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="text-center py-16 space-y-4 animate-in fade-in duration-500">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/10 rounded-full animate-pulse"></div>
                  <Plane className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground/50 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-lg text-muted-foreground">No flights found</p>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500 delay-200">
                {filteredFlights.map((flight, index) => (
                  <div
                    key={flight.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FlightCard flight={flight} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlightSearchPage;