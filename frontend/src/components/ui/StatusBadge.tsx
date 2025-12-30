import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "on time":
      case "scheduled":
        return "bg-green-100 text-green-700 border-green-200";
      case "delayed":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        getStatusStyles(status),
        className
      )}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;