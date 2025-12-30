import { AlertTriangle, Phone, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DisasterModePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
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
        <Card className="border-2 border-red-300 bg-card">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">
              Flight Disruption Mode
            </CardTitle>
            <p className="text-red-700 mt-2">
              We understand this is stressful. We're here to help.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reassurance Message */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">What's happening?</p>
              <p className="text-sm text-blue-700 mt-2">
                Your flight has been affected by a disruption. Our team is actively 
                working on solutions including alternative flights, refunds, and 
                accommodation arrangements.
              </p>
            </div>

            {/* Immediate Actions */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Immediate Assistance</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button size="lg" className="gap-2 h-auto py-4">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-semibold">Priority Helpline</p>
                    <p className="text-sm opacity-90">1800-URGENT-FLY</p>
                  </div>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 h-auto py-4">
                  <Mail className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-muted-foreground">urgent@udaansathi.com</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* What We're Doing */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">What We're Doing</h3>
              <ul className="space-y-2">
                {[
                  "Searching for alternative flights on all partner airlines",
                  "Processing refunds for eligible cancellations",
                  "Arranging hotel accommodation if needed",
                  "Coordinating ground transport assistance",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Refresh */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh for Latest Updates
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Updates are pushed automatically every 30 seconds
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Helpful Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">1.</span>
                Keep your phone charged and ringer on for updates
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">2.</span>
                Save your PNR number for quick reference
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">3.</span>
                Check your email regularly for rebooking options
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">4.</span>
                Visit the airport help desk for immediate assistance
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisasterModePage;
