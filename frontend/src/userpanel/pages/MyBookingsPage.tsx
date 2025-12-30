import { useState } from "react";
import { Search, Ticket, Plane, User, Loader2, Calendar, MapPin, Armchair } from "lucide-react";
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr.trim()) return;

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
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Retrieve Booking</h1>
        <p className="text-muted-foreground italic">Access your digital boarding pass and flight status</p>
      </div>

      {/* PNR Search Card */}
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ENTER 6-DIGIT PNR"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                className="pl-10 h-12 uppercase font-mono text-lg tracking-widest border-2 focus-visible:ring-primary"
                maxLength={6}
              />
            </div>
            <Button type="submit" disabled={isLoading} size="lg" className="h-12 px-8 font-bold gap-2">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              SEARCH HUB
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Scanning aviation database...</p>
        </div>
      ) : booking ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Digital Ticket */}
          <Card className="overflow-hidden border-none shadow-2xl rounded-3xl">
            {/* Ticket Header */}
            <div className={`p-6 text-white flex justify-between items-center ${booking.status === 'Cancelled' ? 'bg-destructive' : 'bg-indigo-950'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Plane className="h-6 w-6 rotate-45" />
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Airline</p>
                  <p className="font-bold">{booking.airline || "UdaanSathi Partner"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Status</p>
                <StatusBadge status={booking.status} className="bg-white/20 border-none text-white" />
              </div>
            </div>

            <CardContent className="p-0">
              {/* Route Section */}
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white">
                <div className="text-center md:text-left space-y-1">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{booking.source}</p>
                  <p className="text-muted-foreground font-medium flex items-center gap-1 justify-center md:justify-start">
                    <MapPin className="h-3 w-3" /> Origin Airport
                  </p>
                </div>

                <div className="flex-1 w-full max-w-[200px] relative py-4">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-slate-200 -translate-y-1/2" />
                  <div className="relative flex justify-center">
                    <div className="bg-white px-4">
                      <Plane className="h-8 w-8 text-primary fill-primary/10" />
                    </div>
                  </div>
                  <p className="text-center text-[10px] font-bold text-primary mt-2 uppercase tracking-tighter">
                    {booking.flight_id}
                  </p>
                </div>

                <div className="text-center md:text-right space-y-1">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{booking.destination}</h2>
                  <p className="text-muted-foreground font-medium flex items-center gap-1 justify-center md:justify-end">
                    Target Terminal <MapPin className="h-3 w-3" />
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-slate-100 bg-slate-50/50">
                <div className="p-6 border-r border-slate-100">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Passenger</p>
                  <p className="font-bold truncate text-slate-800 flex items-center gap-2">
                    <User className="h-3 w-3 text-primary" /> {booking.passenger_name}
                  </p>
                </div>
                <div className="p-6 border-r border-slate-100">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Date</p>
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-primary" /> {booking.departure_time?.split('T')[0] || "TBD"}
                  </p>
                </div>
                <div className="p-6 border-r border-slate-100">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Seat</p>
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <Armchair className="h-3 w-3 text-primary" /> {booking.seat || "Unassigned"}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">PNR Ref</p>
                  <p className="font-mono font-black text-primary text-lg">{booking.pnr}</p>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-6 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-muted-foreground italic">
                  * All other passenger data for this flight is hidden for security.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full">Download PDF</Button>
                  {booking.status === 'Cancelled' && (
                    <Button variant="destructive" className="rounded-full px-6">Disaster Assistance</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Alert */}
          {booking.status === 'Cancelled' && (
             <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex gap-4 items-start animate-pulse">
                <div className="p-2 bg-red-100 rounded-full">🚨</div>
                <div>
                  <p className="text-red-900 font-bold text-lg">FLIGHT TERMINATED</p>
                  <p className="text-red-700 text-sm">
                    This flight has been cancelled due to technical or weather reasons. 
                    Please head to the <strong>Disaster Mode</strong> section for alternative transport options.
                  </p>
                </div>
             </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
          <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
          <h3 className="text-xl font-bold text-slate-400">No Active Search</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Enter your PNR to verify your travel documentation and real-time status.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;