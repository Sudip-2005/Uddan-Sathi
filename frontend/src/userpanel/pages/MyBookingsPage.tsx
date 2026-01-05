import { useState } from "react";
import { Search, Ticket, Plane, User, Loader2, Calendar, MapPin, Armchair, Sparkles, Download, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "../components/StatusBadge";
import InfoRow from "../components/InfoRow";
import { bookingService, Booking } from "../services/bookingService";

const MyBookingsPage = () => {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr.trim()) return;

    setIsSearching(true);
    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const result = await bookingService.getBookingByPNR(pnr.trim());
      setBooking(result);
      if (!result) {
        setError("No booking found with this PNR");
      }
    } catch (err) {
      setError("Failed to fetch booking details");
      setBooking(null);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5">
      <div className="space-y-8 max-w-4xl mx-auto p-6 lg:p-8 pb-10">
        {/* Animated Page Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm animate-pulse">
            <Ticket className="h-4 w-4" />
            Digital Boarding Pass
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access your digital boarding pass, track flight status, and manage your travel documents with ease.
          </p>
        </div>

        {/* Enhanced PNR Search Card */}
        <Card className="bg-gradient-to-br from-card to-card/80 dark:from-card/80 dark:to-card/40 backdrop-blur-sm border-border/50 dark:border-border/30 shadow-xl dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardContent className="pt-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Enter Your PNR</h3>
                <p className="text-muted-foreground">Find your booking details instantly</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <Input
                      type="text"
                      placeholder="ENTER 6-DIGIT PNR"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value.toUpperCase())}
                      className="pl-12 h-14 text-center uppercase font-mono text-xl tracking-widest border-2 border-border/50 dark:border-border/30 focus:border-primary/50 focus:ring-primary/20 bg-background/50 dark:bg-background/30 rounded-xl transition-all duration-300 hover:bg-background/80 dark:hover:bg-background/50"
                      maxLength={6}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || isSearching}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    {isLoading || isSearching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    <span>{isSearching ? 'Searching...' : 'Find Booking'}</span>
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-primary/40"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Retrieving your booking...</p>
              <p className="text-muted-foreground animate-pulse">Scanning aviation database...</p>
            </div>
          </div>
        )}

        {/* Enhanced Results Section */}
        {!isLoading && booking && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 space-y-6">
            {/* Main Digital Ticket */}
            <Card className="overflow-hidden border-none shadow-2xl dark:shadow-black/50 rounded-3xl bg-gradient-to-br from-card to-card/50 dark:from-card/80 dark:to-card/30">
              {/* Ticket Header */}
              <div className={`p-8 text-white flex justify-between items-center relative overflow-hidden ${
                booking.status === 'Cancelled'
                  ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800'
              }`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE5NiAwIDYuMTkzLS44MzQgOC43ODgtMi4yOTRsNC41MTIgMi4yNTZ2LTVjMy4yMzYtMy4wNzggNS4yLTcuMzU4IDUuMi0xMi4xODggMC05LjA5NC03LjI0My0xNi41NDUtMTYuNS0xNy45MzZWMThoLTJ6IiBzdHJva2U9IiNGRkYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/15 dark:bg-white/10 rounded-2xl backdrop-blur-sm">
                    <Plane className="h-7 w-7 rotate-45" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Airline</p>
                    <p className="font-bold text-lg">{booking.airline || "UdaanSathi Partner"}</p>
                  </div>
                </div>
                <div className="relative z-10 text-right">
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Status</p>
                  <StatusBadge status={booking.status} className="bg-white/20 dark:bg-white/15 border-none text-white shadow-lg" />
                </div>
              </div>

              <CardContent className="p-0">
                {/* Route Section */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-background to-background/50 dark:from-background dark:to-background/80">
                  <div className="text-center md:text-left space-y-2 animate-in slide-in-from-left-4 duration-500">
                    <p className="text-6xl md:text-7xl font-black text-foreground tracking-tighter animate-pulse">
                      {booking.source}
                    </p>
                    <p className="text-muted-foreground font-medium flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="h-4 w-4 text-primary" />
                      Origin Airport
                    </p>
                  </div>

                  <div className="flex-1 w-full max-w-[250px] relative py-6 animate-in zoom-in duration-700 delay-200">
                    <div className="absolute top-1/2 left-0 w-full h-[3px] border-t-2 border-dashed border-border -translate-y-1/2"></div>
                    <div className="relative flex justify-center">
                      <div className="bg-background dark:bg-card p-4 rounded-full shadow-lg border border-border/50 animate-bounce">
                        <Plane className="h-10 w-10 text-primary fill-primary/10 rotate-90" />
                      </div>
                    </div>
                    <p className="text-center text-sm font-bold text-primary mt-3 uppercase tracking-wider bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
                      {booking.flight_id}
                    </p>
                  </div>

                  <div className="text-center md:text-right space-y-2 animate-in slide-in-from-right-4 duration-500">
                    <h2 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter animate-pulse">
                      {booking.destination}
                    </h2>
                    <p className="text-muted-foreground font-medium flex items-center gap-2 justify-center md:justify-end">
                      Target Terminal
                      <MapPin className="h-4 w-4 text-primary" />
                    </p>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-border/50 bg-muted/30 dark:bg-muted/10">
                  <div className="p-6 border-r border-border/50 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-300">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Passenger</p>
                    <p className="font-bold truncate text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {booking.passenger_name}
                    </p>
                  </div>
                  <div className="p-6 border-r border-border/50 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-300">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Departure Time</p>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {booking.departure_time || "TBD"}
                    </p>
                  </div>
                  <div className="p-6 border-r border-border/50 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-300">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Seat</p>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-primary" />
                      {booking.seat || "Unassigned"}
                    </p>
                  </div>
                  <div className="p-6 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-300">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">PNR Ref</p>
                    <p className="font-mono font-black text-primary text-xl bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-lg inline-block">
                      {booking.pnr}
                    </p>
                  </div>
                </div>

                {/* Action Area */}
                <div className="p-8 bg-gradient-to-r from-background to-background/50 dark:from-background dark:to-background/80 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="text-sm text-muted-foreground italic flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    * All other passenger data for this flight is hidden for security.
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full px-6 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    {booking.status === 'Cancelled' && (
                      <Button
                        variant="destructive"
                        className="rounded-full px-6 py-3 font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Disaster Assistance
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Cancellation Alert */}
            {booking.status === 'Cancelled' && (
              <Card className="border-red-200/50 dark:border-red-800/50 bg-gradient-to-r from-red-50/50 to-red-25/50 dark:from-red-950/30 dark:to-red-900/20 animate-in slide-in-from-bottom-4 duration-500 delay-500">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-2xl animate-pulse">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-red-900 dark:text-red-200 font-bold text-xl">FLIGHT TERMINATED</p>
                      <p className="text-red-700 dark:text-red-300 text-base leading-relaxed">
                        This flight has been cancelled due to technical or weather reasons.
                        Please head to the <strong className="text-red-800 dark:text-red-200">Disaster Mode</strong> section for alternative transport options.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-3">
                        <Clock className="h-4 w-4" />
                        <span>Assistance available 24/7</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!isLoading && !booking && hasSearched && (
          <div className="py-20 text-center animate-in fade-in duration-500 delay-300">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/10 rounded-full animate-pulse"></div>
              <Ticket className="absolute inset-0 m-auto h-16 w-16 text-muted-foreground/50 animate-bounce" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-muted-foreground">No Booking Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                We couldn't find any booking with the PNR you entered. Please check your PNR and try again.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Double-check your 6-digit PNR code</span>
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !hasSearched && (
          <div className="py-20 text-center animate-in fade-in duration-500 delay-300">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full animate-pulse"></div>
              <Ticket className="absolute inset-0 m-auto h-16 w-16 text-primary/60" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-muted-foreground">Ready to Search</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your PNR number above to retrieve your booking details and digital boarding pass.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;