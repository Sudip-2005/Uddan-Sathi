import { AlertTriangle, Clock, Info, CheckCircle, Plane, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "../services/notificationService";

interface NotificationCardProps {
  notification: Notification;
  className?: string;
}

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'cancelled':
      return {
        icon: AlertTriangle,
        bg: 'bg-gradient-to-r from-red-50 to-red-50/50 border-red-500 dark:from-red-950/40 dark:to-red-900/20 dark:border-red-500/80',
        iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        titleColor: 'text-red-800 dark:text-red-300',
        icon: AlertTriangle
      };
    case 'delayed':
      return {
        icon: Clock,
        bg: 'bg-gradient-to-r from-amber-50 to-amber-50/50 border-amber-500 dark:from-amber-950/40 dark:to-amber-900/20 dark:border-amber-500/80',
        iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
        titleColor: 'text-amber-800 dark:text-amber-300',
        icon: Clock
      };
    case 'gate_change':
      return {
        icon: DoorOpen,
        bg: 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-blue-500 dark:from-blue-950/40 dark:to-blue-900/20 dark:border-blue-500/80',
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        titleColor: 'text-blue-800 dark:text-blue-300',
        icon: DoorOpen
      };
    case 'boarding':
      return {
        icon: Plane,
        bg: 'bg-gradient-to-r from-green-50 to-green-50/50 border-green-500 dark:from-green-950/40 dark:to-green-900/20 dark:border-green-500/80',
        iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        titleColor: 'text-green-800 dark:text-green-300',
        icon: Plane
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bg: 'bg-gradient-to-r from-amber-50 to-amber-50/50 border-amber-500 dark:from-amber-950/40 dark:to-amber-900/20 dark:border-amber-500/80',
        iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
        titleColor: 'text-amber-800 dark:text-amber-300',
        icon: AlertTriangle
      };
    default:
      return {
        icon: Info,
        bg: 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-blue-500 dark:from-blue-950/40 dark:to-blue-900/20 dark:border-blue-500/80',
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        titleColor: 'text-blue-800 dark:text-blue-300',
        icon: Info
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
    <div className={cn(
      "p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/10 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2 duration-500",
      config.bg,
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg group-hover:scale-110 transition-transform duration-300", config.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className={cn("font-bold text-sm uppercase tracking-wide group-hover:text-primary transition-colors duration-300", config.titleColor)}>
              {notification.type.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(notification.timestamp).toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground bg-background/60 dark:bg-background/40 px-3 py-1 rounded-full font-medium">
            {new Date(notification.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      <p className="text-foreground/90 dark:text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors duration-300">
        {notification.message}
      </p>

      {notification.flight_id && (
        <div className="mt-4 flex items-center gap-2">
          <Plane className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Flight: <span className="font-semibold text-foreground">{notification.flight_id}</span>
          </span>
        </div>
      )}

      {/* Subtle animation indicator */}
      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Real-time update</span>
      </div>
    </div>
  );
};

export default NotificationCard;
