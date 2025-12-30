import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  className?: string;
  valueClassName?: string;
}

const InfoRow = ({ icon: Icon, label, value, className, valueClassName }: InfoRowProps) => {
  return (
    <div className={cn("flex items-start gap-3 py-2", className)}>
      {Icon && (
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={cn("text-sm font-medium text-foreground mt-0.5", valueClassName)}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
};

export default InfoRow;
