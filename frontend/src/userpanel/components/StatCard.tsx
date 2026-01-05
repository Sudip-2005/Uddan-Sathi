import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  accent?: boolean;
  gradient?: boolean;
  className?: string;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  accent = false,
  gradient = false,
  className
}: StatCardProps) => (
  <Card className={cn(
    "relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-pointer",
    accent
      ? 'border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/20 dark:to-primary/5 shadow-lg shadow-primary/10 dark:shadow-primary/20'
      : gradient
        ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/30'
        : 'bg-card/80 dark:bg-card/60 backdrop-blur-sm border-border/50 dark:border-border/30',
    'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/5',
    className
  )}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider font-medium">{label}</p>
          <p className={cn(
            "text-3xl font-bold",
            accent
              ? 'text-primary dark:text-primary'
              : 'text-foreground dark:text-foreground'
          )}>
            {value}
          </p>
          {subtext && <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">{subtext}</p>}
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
          accent
            ? 'bg-primary/20 dark:bg-primary/30 shadow-lg shadow-primary/20 dark:shadow-primary/30'
            : gradient
              ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-400/30 dark:to-indigo-400/30'
              : 'bg-muted/80 dark:bg-muted/50'
        )}>
          <Icon className={cn(
            "h-6 w-6",
            accent
              ? 'text-primary dark:text-primary'
              : 'text-muted-foreground dark:text-muted-foreground/80'
          )} />
        </div>
      </div>
      {/* Animated background elements */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/5 dark:from-primary/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-300" />
    </CardContent>
  </Card>
);