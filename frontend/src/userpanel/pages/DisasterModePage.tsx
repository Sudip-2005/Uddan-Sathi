import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle, Phone, Mail, ArrowLeft, RefreshCw, ExternalLink,
  Plane, Train, MapPin, Hotel, CreditCard, Shield, Navigation,
  Clock, CheckCircle, XCircle, Zap, Heart, MessageSquare, Headphones,
  ChevronRight, Users, Star, Sparkles, IndianRupee, Copy, Check,
  AlertCircle, Loader2, Send, Info, PhoneCall, ArrowRightLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FlightDetails {
  source: string;
  destination: string;
  flightId: string;
  airline?: string;
  scheduledTime?: string;
}

interface RefundFormData {
  name: string;
  pnr: string;
  amount: string;
  upiId: string;
  reason: string;
}

const DisasterModePage = () => {
  const navigate = useNavigate();
  
  // Core state
  const [pnr, setPnr] = useState<string>("");
  const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'solutions' | 'refund' | 'support'>('overview');
  
  // Refund state
  const [refundForm, setRefundForm] = useState<RefundFormData>({
    name: "",
    pnr: "",
    amount: "5500",
    upiId: "",
    reason: "Flight cancelled due to operational issues"
  });
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundStatus, setRefundStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [refundMessage, setRefundMessage] = useState("");
  
  // Copied state for PNR
  const [copied, setCopied] = useState(false);

  // Load disruption context
  useEffect(() => {
    const loadContext = async () => {
      setIsLoading(true);
      
      // Get PNR from localStorage or URL params
      const storedPnr = localStorage.getItem("activePnr") || "";
      const storedName = localStorage.getItem("userName") || "";
      
      if (storedPnr) {
        setPnr(storedPnr);
        setRefundForm(prev => ({ ...prev, pnr: storedPnr, name: storedName }));
        
        // Try to fetch flight details from notifications
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/${storedPnr}`);
          const result = await response.json().catch(() => null);
          
          if (result?.ok && Array.isArray(result.data) && result.data.length > 0) {
            const lastCancel = result.data.slice().reverse().find((n: any) => 
              n.type === "CANCELLED" || n.type?.toLowerCase().includes("cancel")
            );
            
            if (lastCancel) {
              setFlightDetails({
                source: lastCancel.source || "DEL",
                destination: lastCancel.destination || "BOM",
                flightId: lastCancel.flightId || lastCancel.flight_number || "Unknown",
                airline: lastCancel.airline || "UdaanSathi Airlines",
                scheduledTime: lastCancel.scheduledTime
              });
            }
          }
        } catch (err) {
          console.error("Error fetching flight context:", err);
        }
        
        // Check if refund already requested
        if (localStorage.getItem(`refundRequested:${storedPnr}`)) {
          setRefundStatus('success');
          setRefundMessage("Your refund request was already submitted.");
        }
      }
      
      setIsLoading(false);
    };
    
    loadContext();
  }, []);

  // Copy PNR to clipboard
  const copyPnr = useCallback(() => {
    if (pnr) {
      navigator.clipboard.writeText(pnr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [pnr]);

  // Submit refund request
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!refundForm.pnr || !refundForm.name) {
      setRefundStatus('error');
      setRefundMessage("Please fill in all required fields.");
      return;
    }

    setRefundLoading(true);
    setRefundStatus('pending');
    setRefundMessage("Submitting your refund request...");

    try {
      const payload = {
        airport_code: flightDetails?.source || "DEL",
        flight_id: flightDetails?.flightId || "UNKNOWN",
        passenger_id: refundForm.pnr.toUpperCase(),
        name: refundForm.name,
        pnr: refundForm.pnr.toUpperCase(),
        upi_id: refundForm.upiId,
        amount: parseFloat(refundForm.amount) || 5500,
        reason: refundForm.reason,
        status: "pending"
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/refunds/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (response.ok) {
        setRefundStatus('success');
        setRefundMessage("Your refund request has been submitted successfully! You'll receive updates via email.");
        localStorage.setItem(`refundRequested:${refundForm.pnr}`, "1");
        localStorage.setItem("activePnr", refundForm.pnr);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setRefundStatus('error');
        setRefundMessage(errorData.error || "Failed to submit refund request. Please try again.");
      }
    } catch (err) {
      console.error("Refund submission error:", err);
      setRefundStatus('error');
      setRefundMessage("Network error. Please check your connection and try again.");
    } finally {
      setRefundLoading(false);
    }
  };

  // Navigation handlers with proper state passing
  const navigateToAlternativeFlights = () => {
    navigate('/user/alternative-flights', {
      state: {
        source: flightDetails?.source || "DEL",
        destination: flightDetails?.destination || "BOM",
        flightId: flightDetails?.flightId,
        fromDisruption: true
      }
    });
  };

  const navigateToAlternativeTrains = () => {
    navigate('/user/alternative-trains', {
      state: {
        source: flightDetails?.source || "DEL",
        destination: flightDetails?.destination || "BOM",
        fromDisruption: true
      }
    });
  };

  const navigateToNearbyHotels = () => {
    navigate('/user/nearby-hotels', {
      state: {
        location: flightDetails?.source || "DEL",
        fromDisruption: true
      }
    });
  };

  const navigateToSupport = () => {
    navigate('/user/assistance');
  };

  // Open phone dialer
  const callHelpline = () => {
    window.open('tel:1800123456', '_self');
  };

  // Open email client
  const sendEmail = () => {
    const subject = encodeURIComponent(`Urgent: Flight Disruption - PNR ${pnr || 'Unknown'}`);
    const body = encodeURIComponent(`Dear UdaanSathi Support,\n\nI am writing regarding my cancelled flight.\n\nPNR: ${pnr}\nFlight: ${flightDetails?.flightId || 'Unknown'}\nRoute: ${flightDetails?.source || ''} → ${flightDetails?.destination || ''}\n\nPlease assist me with immediate rebooking options.\n\nThank you.`);
    window.open(`mailto:support@udaansathi.com?subject=${subject}&body=${body}`, '_blank');
  };

  // Open WhatsApp chat
  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hi, I need urgent assistance with my cancelled flight. PNR: ${pnr || 'Not available'}, Flight: ${flightDetails?.flightId || 'Unknown'}`);
    window.open(`https://wa.me/911800123456?text=${text}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-200 dark:border-red-800 rounded-full animate-spin border-t-red-600 dark:border-t-red-400 mx-auto"></div>
            <AlertTriangle className="absolute inset-0 m-auto h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Emergency Response Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20">
      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <span className="font-medium">Flight Disruption Alert Active</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Emergency assistance available 24/7</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={callHelpline}
            className="text-white hover:bg-white/20 ml-2 gap-1"
          >
            <PhoneCall className="h-3 w-3" />
            Call Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between animate-in fade-in duration-500">
          <Button
            variant="outline"
            onClick={() => navigate('/user/dashboard')}
            className="gap-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-pulse gap-1">
              <AlertTriangle className="h-3 w-3" />
              Emergency Mode
            </Badge>
          </div>
        </div>

        {/* Main Hero Section */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-red-950 text-white animate-in slide-in-from-top-4 duration-700">
          <CardContent className="p-6 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Info */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="font-medium">We're Here to Help</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Flight Disruption
                    <br />
                    <span className="text-red-200">Response Center</span>
                  </h1>
                  <p className="text-red-100 text-lg max-w-xl">
                    Your flight has been disrupted. Don't worry - we have multiple options to get you to your destination safely.
                  </p>
                </div>

                {/* Flight Details Card */}
                {(pnr || flightDetails) && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-3">
                    <h3 className="font-semibold text-red-100 flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Affected Booking
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {pnr && (
                        <div>
                          <span className="text-red-200">PNR:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono font-bold text-lg">{pnr}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={copyPnr}
                              className="h-6 w-6 p-0 hover:bg-white/20"
                            >
                              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      )}
                      {flightDetails?.flightId && (
                        <div>
                          <span className="text-red-200">Flight:</span>
                          <p className="font-bold text-lg">{flightDetails.flightId}</p>
                        </div>
                      )}
                      {flightDetails && (
                        <div className="col-span-2">
                          <span className="text-red-200">Route:</span>
                          <div className="flex items-center gap-2 mt-1 font-semibold">
                            <MapPin className="h-4 w-4" />
                            {flightDetails.source}
                            <ArrowRightLeft className="h-4 w-4" />
                            {flightDetails.destination}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={navigateToAlternativeFlights}
                  className="h-auto py-6 flex-col gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Plane className="h-8 w-8" />
                  <span className="font-semibold">Alt. Flights</span>
                  <span className="text-xs text-red-200">Rebook instantly</span>
                </Button>
                
                <Button
                  onClick={navigateToAlternativeTrains}
                  className="h-auto py-6 flex-col gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Train className="h-8 w-8" />
                  <span className="font-semibold">Alt. Trains</span>
                  <span className="text-xs text-red-200">Rail options</span>
                </Button>
                
                <Button
                  onClick={navigateToNearbyHotels}
                  className="h-auto py-6 flex-col gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Hotel className="h-8 w-8" />
                  <span className="font-semibold">Hotels</span>
                  <span className="text-xs text-red-200">Emergency stay</span>
                </Button>
                
                <Button
                  onClick={() => setActiveSection('refund')}
                  className="h-auto py-6 flex-col gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <CreditCard className="h-8 w-8" />
                  <span className="font-semibold">Refund</span>
                  <span className="text-xs text-red-200">Claim money</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-2 animate-in fade-in duration-500 delay-200">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'solutions', label: 'Travel Solutions', icon: Zap },
            { id: 'refund', label: 'Request Refund', icon: CreditCard },
            { id: 'support', label: 'Get Support', icon: Headphones }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeSection === id ? 'default' : 'outline'}
              onClick={() => setActiveSection(id as any)}
              className={`gap-2 transition-all duration-300 ${
                activeSection === id 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                  : 'hover:bg-red-50 dark:hover:bg-red-950/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Flight Status</h3>
                <Badge variant="destructive" className="text-base px-4 py-1">Cancelled</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  We apologize for the inconvenience caused.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Solutions Ready</h3>
                <Badge variant="secondary" className="text-base px-4 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">4 Options</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Multiple alternatives available for you.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Support Team</h3>
                <Badge variant="secondary" className="text-base px-4 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">24/7 Active</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Our team is ready to assist you.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Solutions Section */}
        {activeSection === 'solutions' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Alternative Flights */}
            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              onClick={navigateToAlternativeFlights}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plane className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alternative Flights</h3>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Available</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Find and book the next available flight to your destination. Priority rebooking for disrupted passengers.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Same-day options</Badge>
                      <Badge variant="outline">No extra charges</Badge>
                      <Badge variant="outline">Priority boarding</Badge>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white gap-2 group-hover:shadow-lg transition-all duration-300">
                      Search Flights
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Trains */}
            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              onClick={navigateToAlternativeTrains}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Train className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Railway Alternatives</h3>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Available</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Explore premium train connections. Comfortable AC coaches with meal service included.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">AC First Class</Badge>
                      <Badge variant="outline">Meals included</Badge>
                      <Badge variant="outline">Direct routes</Badge>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2 group-hover:shadow-lg transition-all duration-300">
                      Search Trains
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Hotels */}
            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              onClick={navigateToNearbyHotels}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Hotel className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Emergency Accommodation</h3>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">Limited</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Complimentary hotel stays at partner properties. Airport shuttle service included.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">5-star hotels</Badge>
                      <Badge variant="outline">Free meals</Badge>
                      <Badge variant="outline">Airport transfer</Badge>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white gap-2 group-hover:shadow-lg transition-all duration-300">
                      Find Hotels
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ground Transport */}
            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              onClick={navigateToSupport}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Navigation className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ground Transport</h3>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Available</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Premium cab and taxi services. Professional drivers with real-time GPS tracking.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Premium vehicles</Badge>
                      <Badge variant="outline">GPS tracking</Badge>
                      <Badge variant="outline">24/7 service</Badge>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white gap-2 group-hover:shadow-lg transition-all duration-300">
                      Book Transport
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Refund Section */}
        {activeSection === 'refund' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
              
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Request Refund</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">Fill in your details to claim your refund</p>
              </CardHeader>

              <CardContent className="p-6">
                {refundStatus === 'success' ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Request Submitted!</h3>
                    <p className="text-gray-600 dark:text-gray-400">{refundMessage}</p>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      Processing Time: 5-7 Business Days
                    </Badge>
                  </div>
                ) : (
                  <form onSubmit={handleRefundSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={refundForm.name}
                          onChange={(e) => setRefundForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pnr" className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-500" />
                          PNR Number *
                        </Label>
                        <Input
                          id="pnr"
                          value={refundForm.pnr}
                          onChange={(e) => setRefundForm(prev => ({ ...prev, pnr: e.target.value.toUpperCase() }))}
                          placeholder="e.g., ABC123"
                          className="h-12 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-gray-500" />
                          Refund Amount (₹)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={refundForm.amount}
                          onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="5500"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="upi" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          UPI ID (for quick refund)
                        </Label>
                        <Input
                          id="upi"
                          value={refundForm.upiId}
                          onChange={(e) => setRefundForm(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="yourname@upi"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        Reason for Refund
                      </Label>
                      <Input
                        id="reason"
                        value={refundForm.reason}
                        onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Brief reason for refund"
                        className="h-12"
                      />
                    </div>

                    {refundStatus === 'error' && (
                      <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">{refundMessage}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={refundLoading}
                      className="w-full h-14 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 gap-2"
                    >
                      {refundLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Submit Refund Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      By submitting, you agree to our refund policy. Refunds are processed within 5-7 business days.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Support Section */}
        {activeSection === 'support' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={callHelpline}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Emergency Helpline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">24/7 Priority Support</p>
                <p className="font-mono font-bold text-red-600 dark:text-red-400">1800-123-456</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-green-600 dark:text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Available Now
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={openWhatsApp}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">WhatsApp Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick responses</p>
                <p className="font-semibold text-green-600 dark:text-green-400">Chat Now</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-green-600 dark:text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={sendEmail}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Detailed assistance</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 break-all">support@udaansathi.com</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  Send Email
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={navigateToSupport}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Support Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Full assistance portal</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">Visit Center</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 text-sm">
                  <ChevronRight className="h-3 w-3" />
                  Open Portal
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Message */}
        <Card className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 dark:from-red-600 dark:via-red-700 dark:to-red-600 border-red-400 dark:border-red-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Your Safety is Our Priority</h3>
            </div>
            <p className="text-white max-w-2xl mx-auto leading-relaxed mb-6">
              Please do not leave the airport without confirming your next steps. Our team is working around the clock to ensure your journey continues safely and comfortably.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-white">24/7 Emergency Support</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <Heart className="h-4 w-4 text-white" />
                <span className="text-white">Dedicated Care Team</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <Star className="h-4 w-4 text-white" />
                <span className="text-white">Priority Assistance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisasterModePage;
