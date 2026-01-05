import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TravelTipProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const TravelTip = ({
  title,
  description,
  icon: Icon = Sparkles,
  className
}: TravelTipProps) => (
  <div className={cn(
    "flex gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 dark:from-muted/30 dark:to-muted/10 border border-border/50 dark:border-border/30 hover:border-border dark:hover:border-border/50 hover:bg-muted/40 dark:hover:bg-muted/20 transition-all duration-300 group cursor-pointer",
    className
  )}>
    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary dark:text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground dark:text-foreground group-hover:text-primary transition-colors duration-300">{title}</p>
      <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 mt-1 leading-relaxed">{description}</p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
    </div>
  </div>
);