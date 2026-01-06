import { AlertTriangle, Phone, Mail, ExternalLink, RefreshCw, X, Shield, Clock, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notification } from "../services/notificationService";
import { cn } from "../../lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DisasterAlertProps {
  cancellations: Notification[];
  className?: string;
}

const DisasterAlert = ({ cancellations, className }: DisasterAlertProps) => {
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState<string | null>(null); // PNR of active form
  const [formData, setFormData] = useState({ upi_id: "", amount: "5000" });
  const [submitStatus, setSubmitStatus] = useState<Record<string, string>>({}); // Success messages
  const [isMinimized, setIsMinimized] = useState(false);
  
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const openRefundForm = (notification: Notification) => {
    const pnr = notification.pnr || notification.id || "";
    setShowForm(pnr);
    setFormData({ upi_id: "", amount: "5000" }); // Reset form
  };

  const handleRefundRequest = async (notification: Notification) => {
    const pnr = notification.pnr || notification.id;
    if (!pnr) {
      alert("Missing PNR information");
      return;
    }

    setSubmitting(prev => ({ ...prev, [pnr]: true }));
    
    try {
      const flightId = notification.flight_id || notification.message?.match(/Flight (\w+)/)?.[1];
      const airport = notification.source || "DEL";
      
      if (!flightId) {
        throw new Error("Could not determine flight ID");
      }
      
      // Validate UPI
      if (!formData.upi_id || formData.upi_id.trim().length === 0) {
        throw new Error("Please enter a valid UPI ID");
      }

      const payload = {
        airport_code: airport,
        flight_id: flightId,
        passenger_id: pnr,
        name: notification.passenger_name || "Passenger",
        pnr: pnr,
        upi_id: formData.upi_id.trim(),
        amount: parseInt(formData.amount) || 5000,
        status: "pending",
        reason: notification.message || "Flight Cancelled",
        timestamp: Date.now()
      };

      console.log("Submitting refund:", payload);

      const response = await fetch(`${API_BASE}/api/refunds/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit refund");
      }
      
      // Show success message
      setSubmitStatus(prev => ({ ...prev, [pnr]: "✅ Refund submitted successfully!" }));
      setShowForm(null); // Close form
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[pnr];
          return newStatus;
        });
      }, 5000);

    } catch (error) {
      console.error("Refund submission error:", error);
      alert(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(prev => ({ ...prev, [pnr]: false }));
    }
  };

  if (cancellations.length === 0) return null;

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden border-2 border-red-300/50 bg-gradient-to-br from-red-50/80 to-red-25/80 dark:from-red-950/30 dark:to-red-900/20 backdrop-blur-sm shadow-xl dark:shadow-2xl dark:shadow-red-900/20 animate-in fade-in slide-in-from-top-4 duration-700",
        isMinimized && "max-h-20 overflow-hidden",
        className
      )}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg animate-pulse">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5" />
                  Flight Disruption Alert
                </CardTitle>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1 font-medium">
                  {cancellations.length} flight{cancellations.length > 1 ? 's' : ''} affected • Immediate action required
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-red-700 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-6 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
            {/* Cancellation Details */}
            <div className="space-y-4">
              {cancellations.map((notification, index) => {
                const pnr = notification.pnr || notification.id || "";
                const isSubmitting = submitting[pnr];
                const statusMsg = submitStatus[pnr];

                return (
                  <div
                    key={notification.id || index}
                    className="p-6 bg-gradient-to-r from-white/80 to-white/60 dark:from-white/5 dark:to-white/10 rounded-2xl border border-red-200/50 dark:border-red-800/30 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          {notification.flight_id && (
                            <p className="font-bold text-foreground text-lg group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors duration-300">
                              Flight {notification.flight_id}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Success Message */}
                    {statusMsg && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-sm text-green-700 dark:text-green-400 animate-in slide-in-from-top-2 duration-300">
                        ✅ {statusMsg}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => openRefundForm(notification)}
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : statusMsg ? (
                          "Update Refund Details"
                        ) : (
                          "Request Refund"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help Info */}
            <div className="pt-6 border-t border-red-200/50 dark:border-red-800/30">
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-blue-200/30 dark:border-blue-800/20">
                <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  We're here to help you
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed mb-4">
                  Our dedicated support team is working around the clock to assist you with alternative arrangements.
                  Don't worry - we've got you covered.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" className="gap-2 border-red-300/50 text-red-700 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105">
                    <Phone className="h-4 w-4" />
                    Emergency Line
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 border-red-300/50 text-red-700 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300/50 text-blue-700 hover:bg-blue-50 dark:border-blue-800/50 dark:text-blue-400 dark:hover:bg-blue-950/20 transition-all duration-300 hover:scale-105">
                    <ExternalLink className="h-4 w-4" />
                    Alternative Flights
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Refund Form Dialog */}
      <Dialog open={showForm !== null} onOpenChange={(open) => !open && setShowForm(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Refund Request</DialogTitle>
            <DialogDescription>
              Enter your UPI ID and refund amount. You can update this information anytime.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="upi">UPI ID *</Label>
              <Input
                id="upi"
                placeholder="example@paytm"
                value={formData.upi_id}
                onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID for direct refund transfer
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Refund Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Default: ₹5000. Adjust if needed.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const notification = cancellations.find(n => 
                  (n.pnr || n.id) === showForm
                );
                if (notification) handleRefundRequest(notification);
              }}
              disabled={!formData.upi_id.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisasterAlert;
