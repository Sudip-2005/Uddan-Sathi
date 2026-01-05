import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color?: "primary" | "blue" | "green" | "purple" | "orange";
  className?: string;
}

export const QuickAction = ({
  icon: Icon,
  label,
  onClick,
  color = "primary",
  className
}: QuickActionProps) => {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 dark:bg-primary/20 dark:hover:bg-primary/30 dark:border-primary/40",
    blue: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 dark:border-blue-400/40",
    green: "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 dark:bg-green-500/20 dark:hover:bg-green-500/30 dark:border-green-400/40",
    purple: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 dark:border-purple-400/40",
    orange: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 dark:border-orange-400/40",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 bg-card/50 dark:bg-card/40 backdrop-blur-sm hover:bg-card dark:hover:bg-card/60 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20",
        colorClasses[color] || colorClasses.primary,
        className
      )}
    >
      <div className="p-4 rounded-full bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 shadow-lg dark:shadow-xl group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold text-center text-foreground dark:text-foreground">{label}</span>
      <div className="w-0 group-hover:w-full h-0.5 bg-current rounded-full transition-all duration-300" />
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-current group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
    </button>
  );
};