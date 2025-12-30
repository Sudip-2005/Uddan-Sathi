import { Plane, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { Flight } from "../services/flightService";
import { cn } from "@/lib/utils";

interface FlightCardProps {
  flight: Flight;
  className?: string;
  compact?: boolean;
}

const FlightCard = ({ flight, className, compact = false }: FlightCardProps) => {
  const flightId = (flight as any).flight_id || flight.id;

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <CardContent className={cn("p-4", compact && "p-3")}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Plane className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{flightId}</p>
              <p className="text-xs text-muted-foreground">{flight.airline}</p>
            </div>
          </div>
          <StatusBadge status={flight.status} />
        </div>

        {/* Route */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">From</span>
            </div>
            <p className="font-semibold text-foreground">{flight.source}</p>
          </div>
          
          <div className="flex-shrink-0 px-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-12 h-0.5 bg-primary/30" />
              <Plane className="h-4 w-4 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs text-muted-foreground">To</span>
              <MapPin className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">{flight.destination}</p>
          </div>
        </div>

        {/* Time Info (if available) */}
        {(flight.departure_time || flight.gate) && !compact && (
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            {flight.departure_time && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{flight.departure_time}</span>
              </div>
            )}
            {flight.gate && (
              <div className="text-sm text-muted-foreground">
                Gate: <span className="font-medium text-foreground">{flight.gate}</span>
              </div>
            )}
            {flight.terminal && (
              <div className="text-sm text-muted-foreground">
                Terminal: <span className="font-medium text-foreground">{flight.terminal}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightCard;
