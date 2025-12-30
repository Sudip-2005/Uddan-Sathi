import { cn } from "@/lib/utils";

type StatusType = 
  | 'On Time' 
  | 'Delayed' 
  | 'Cancelled' 
  | 'Boarding' 
  | 'Departed' 
  | 'Arrived'
  | 'Confirmed'
  | 'Pending'
  | 'Checked In'
  | 'Processing'
  | 'Approved'
  | 'Completed'
  | 'Rejected';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const getStatusStyles = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  
  switch (normalizedStatus) {
    case 'on_time':
    case 'confirmed':
    case 'completed':
    case 'approved':
    case 'arrived':
      return 'bg-green-100 text-green-800 border-green-200';
    
    case 'delayed':
    case 'pending':
    case 'processing':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    
    case 'cancelled':
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    
    case 'boarding':
    case 'checked_in':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    
    case 'departed':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
