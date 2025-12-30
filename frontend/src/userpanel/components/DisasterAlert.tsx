import { AlertTriangle, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notification } from "../services/notificationService";
import { cn } from "../../lib/utils";

interface DisasterAlertProps {
  cancellations: Notification[];
  className?: string;
}

const DisasterAlert = ({ cancellations, className }: DisasterAlertProps) => {
  if (cancellations.length === 0) return null;

  return (
    <Card className={cn("border-2 border-red-300 bg-red-50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-red-800 flex items-center gap-2">
              Flight Disruption Alert
            </CardTitle>
            <p className="text-sm text-red-700 mt-1">
              {cancellations.length} flight{cancellations.length > 1 ? 's' : ''} affected
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cancellation Details */}
        <div className="space-y-3">
          {cancellations.map((notification, index) => (
            <div 
              key={notification.id || index}
              className="p-3 bg-card rounded-lg border border-red-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {notification.flight_id && (
                    <p className="font-semibold text-foreground">
                      Flight {notification.flight_id}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(notification.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Help Info */}
        <div className="pt-3 border-t border-red-200">
          <p className="text-sm text-red-800 font-medium mb-3">
            We're here to help. Please don't worry - our team is working on alternative arrangements.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2 border-red-300 text-red-700 hover:bg-red-100">
              <Phone className="h-4 w-4" />
              Call Support
            </Button>
            <Button size="sm" variant="outline" className="gap-2 border-red-300 text-red-700 hover:bg-red-100">
              <Mail className="h-4 w-4" />
              Email Us
            </Button>
            <Button size="sm" variant="outline" className="gap-2 border-red-300 text-red-700 hover:bg-red-100">
              <ExternalLink className="h-4 w-4" />
              Refund Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterAlert;
