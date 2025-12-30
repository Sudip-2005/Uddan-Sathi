import { 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  CreditCard, 
  Hotel, 
  Car, 
  Headphones,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InfoRow from "../components/InfoRow";

const AssistancePage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support & Assistance</h1>
        <p className="text-muted-foreground">We're here to help you 24/7</p>
      </div>

      {/* Emergency Contact */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <Headphones className="h-5 w-5" />
            24/7 Customer Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button size="lg" className="gap-2 h-auto py-4 flex-col">
              <Phone className="h-6 w-6" />
              <div className="text-center">
                <p className="font-semibold">Call Us</p>
                <p className="text-sm opacity-90">1800-123-4567</p>
              </div>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 h-auto py-4 flex-col">
              <Mail className="h-6 w-6" />
              <div className="text-center">
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-muted-foreground">support@udaansathi.com</p>
              </div>
            </Button>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4">
            <Clock className="h-4 w-4 inline mr-1" />
            Average response time: Under 5 minutes
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Refund Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              Refund Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground">Refund Policy</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Refunds initiated within 24 hours of cancellation</li>
                <li>• Processing time: 5-7 business days</li>
                <li>• Full refund for airline-cancelled flights</li>
                <li>• Partial refund based on cancellation timing</li>
              </ul>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Track My Refund
            </Button>
          </CardContent>
        </Card>

        {/* Rebooking Assistance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Rebooking Assistance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground">Need to Rebook?</p>
              <p className="text-sm text-muted-foreground mt-2">
                Our team can help you find alternative flights at no extra charge 
                for airline-caused cancellations.
              </p>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Phone className="h-4 w-4" />
              Request Callback
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Assistance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Additional Assistance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Hotel Accommodation */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hotel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Hotel Accommodation</p>
                  <p className="text-xs text-muted-foreground">For overnight delays</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                If your flight is delayed overnight due to airline issues, 
                we'll arrange complimentary accommodation at partner hotels.
              </p>
              <InfoRow 
                label="Eligibility" 
                value="Delays over 6 hours (11 PM - 6 AM)" 
                className="mt-3 pt-3 border-t"
              />
            </div>

            {/* Ground Transport */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Ground Transport</p>
                  <p className="text-xs text-muted-foreground">Airport transfers</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Need transport to/from the airport? We can arrange pickup 
                and drop services at partner rates.
              </p>
              <InfoRow 
                label="Contact" 
                value="1800-123-4567 (Option 3)" 
                className="mt-3 pt-3 border-t"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "How do I cancel my booking?",
              "What's the baggage allowance?",
              "How to add extra baggage?",
              "Web check-in process",
              "Seat selection options",
              "Travel document requirements",
            ].map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto py-3 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistancePage;
