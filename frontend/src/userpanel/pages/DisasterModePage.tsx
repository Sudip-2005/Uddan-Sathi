import { useState, useEffect } from "react";
import { 
  AlertTriangle, Phone, Mail, ArrowLeft, RefreshCw, 
  Plane, Train, MapPin, Hotel, CreditCard 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DisasterModePage = () => {
  const navigate = useNavigate();
  const [cancelledData, setCancelledData] = useState<any>(null);

  // --- 1. Fetch the context of the disruption ---
  useEffect(() => {
    // We fetch the most recent cancellation notice to know where the user was going
    const fetchDisruptionContext = async () => {
      try {
        // You can get the PNR from localStorage if you saved it during login/search
        const savedPnr = localStorage.getItem("activePnr") || "QR621"; 
        const response = await fetch(`http://localhost:5000/notifications/${savedPnr}`);
        const result = await response.json();
        
        if (result.ok && result.data.length > 0) {
          // Find the latest cancellation notification
          const lastCancel = result.data.reverse().find((n: any) => n.type === 'CANCELLED');
          if (lastCancel) {
            // Note: In a real app, you'd fetch the full flight details from /bookings/:pnr
            // For now, we'll assume the notification or context gives us DEL -> DOH
            setCancelledData({
              source: "DEL", 
              destination: "DOH",
              flightId: "QR621"
            });
          }
        }
      } catch (err) {
        console.error("Error fetching context", err);
      }
    };
    fetchDisruptionContext();
  }, []);

  // --- 2. Navigation Handlers ---
  const handleAlternativeFlights = () => {
    navigate('/user/alternative-flights', { 
      state: { 
        source: cancelledData?.source || "DEL", 
        destination: cancelledData?.destination || "DOH",
        flightId: cancelledData?.flightId 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="gap-2 text-red-800 hover:bg-red-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Main Alert Card */}
        <Card className="border-2 border-red-300 bg-card shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-red-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-red-800">Flight Disruption Hub</CardTitle>
            <p className="text-red-700 mt-2">Emergency protocol active for PNR: {localStorage.getItem("activePnr") || "Scanning..."}</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            
            {/* NEW SECTION: SMART SOLUTIONS GRID */}
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-red-600" /> Immediate Solutions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  onClick={handleAlternativeFlights}
                  variant="outline" 
                  className="h-28 flex-col gap-3 border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Plane className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <p className="font-bold text-blue-900">Alt. Flights</p>
                    <p className="text-xs text-blue-700">Rebook instantly</p>
                  </div>
                </Button>

                <Button 
                  onClick={() => navigate('/user/alternative-trains')}
                  variant="outline" 
                  className="h-28 flex-col gap-3 border-2 border-green-100 hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <Train className="h-8 w-8 text-green-600" />
                  <div className="text-center">
                    <p className="font-bold text-green-900">Alt. Trains</p>
                    <p className="text-xs text-green-700">Domestic routes</p>
                  </div>
                </Button>

                <Button 
                  onClick={() => navigate('/user/nearby-hotels')}
                  variant="outline" 
                  className="h-28 flex-col gap-3 border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div className="text-center">
                    <p className="font-bold text-orange-900">Nearby Hotels</p>
                    <p className="text-xs text-orange-700">Emergency stay</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Refund & Assistance */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Apply for Refund</p>
                  <p className="text-xs text-gray-500">100% full amount back</p>
                </div>
                <Button variant="destructive" size="sm">Request</Button>
              </div>

              <div className="p-5 bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Support Chat</p>
                  <p className="text-xs text-gray-500">24/7 Priority Desk</p>
                </div>
                <Button variant="secondary" size="sm">Connect</Button>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid sm:grid-cols-2 gap-3 pt-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 gap-2 h-auto py-4">
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Priority Helpline</p>
                  <p className="text-sm opacity-90">1800-URGENT-FLY</p>
                </div>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-auto py-4 border-red-200 text-red-700">
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Email Support</p>
                  <p className="text-sm opacity-90">urgent@udaansathi.com</p>
                </div>
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Reassurance Footer */}
        <p className="text-center text-red-800 font-medium animate-pulse">
          Your safety is our priority. Please do not leave the airport without confirming your next steps.
        </p>
      </div>
    </div>
  );
};

export default DisasterModePage;