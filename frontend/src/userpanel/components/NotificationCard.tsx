import { Bell, AlertTriangle, Info, Clock, Plane, DoorOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Notification } from "../services/notificationService";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  className?: string;
}

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'cancelled':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-red-50 border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
      };
    case 'delayed':
      return {
        icon: Clock,
        bgColor: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-800',
      };
    case 'gate_change':
      return {
        icon: DoorOpen,
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
      };
    case 'boarding':
      return {
        icon: Plane,
        bgColor: 'bg-green-50 border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-800',
      };
    default:
      return {
        icon: Info,
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
      };
  }
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
};

const NotificationCard = ({ notification, className }: NotificationCardProps) => {
  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  return (
    <Card className={cn("border overflow-hidden", config.bgColor, className)}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className={cn("flex-shrink-0 p-2 rounded-full", config.bgColor)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn("font-medium text-sm capitalize", config.titleColor)}>
                {notification.type.replace(/_/g, ' ')}
              </p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>
            <p className="text-sm text-foreground mt-1 leading-relaxed">
              {notification.message}
            </p>
            {notification.flight_id && (
              <p className="text-xs text-muted-foreground mt-2">
                Flight: <span className="font-medium">{notification.flight_id}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
