import { useState, useEffect } from "react";
import { Search, Plane, MapPin, Loader2 } from "lucide-react";
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

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await flightService.searchFlights(source, destination);
      setFilteredFlights(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Search Flights</h1>
        <p className="text-muted-foreground">Find available flights by route</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  From (Source)
                </Label>
                <Input
                  id="source"
                  placeholder="e.g., Delhi"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  To (Destination)
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Mumbai"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search Flights
              </Button>
              {hasSearched && (
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plane className="h-5 w-5 text-primary" />
            {hasSearched ? "Search Results" : "All Available Flights"}
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="font-medium">No flights found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightSearchPage;