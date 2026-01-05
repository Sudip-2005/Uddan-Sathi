import { Clock, Search, Plane, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HeroSectionProps {
  greeting: string;
  formattedDate: string;
  lastUpdated: Date | null;
  pnr: string;
  setPnr: (pnr: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const HeroSection = ({
  greeting,
  formattedDate,
  lastUpdated,
  pnr,
  setPnr,
  onSubmit,
  isLoading
}: HeroSectionProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-indigo-600 dark:from-primary/90 dark:via-indigo-600 dark:to-violet-700 p-8 md:p-10 text-primary-foreground shadow-2xl dark:shadow-primary/20 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Animated background patterns */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE5NiAwIDYuMTkzLS44MzQgOC43ODgtMi4yOTRsNC41MTIgMi4yNTZ2LTVjMy4yMzYtMy4wNzggNS4yLTcuMzU4IDUuMi0xMi4xODggMC05LjA5NC03LjI0My0xNi41NDUtMTYuNS0xNy45MzZWMThoLTJ6IiBzdHJva2U9IiNGRkYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30 animate-pulse" />

      {/* Floating elements */}
      <div className="absolute top-4 right-8 w-16 h-16 bg-white/5 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="absolute top-20 right-20 w-12 h-12 bg-white/5 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-8 left-12 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 animate-in slide-in-from-left-4 duration-500 delay-200">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 dark:bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium animate-pulse">
              <Plane className="h-4 w-4" />
              Welcome to UdaanSathi
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg animate-in slide-in-from-left-4 duration-500 delay-300">
              {greeting}!
            </h1>
            <p className="text-white/80 text-lg animate-in slide-in-from-left-4 duration-500 delay-400">{formattedDate}</p>
            <p className="text-white/70 text-sm max-w-md animate-in slide-in-from-left-4 duration-500 delay-500">
              Track your flights, manage bookings, and stay updated with real-time notifications
            </p>
          </div>

          <div className="flex items-center gap-4 animate-in slide-in-from-right-4 duration-500 delay-300">
            <div className="text-sm bg-white/15 dark:bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-3 border border-white/20 shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-medium">Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Not synced'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 max-w-2xl animate-in slide-in-from-bottom-4 duration-500 delay-600">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur-xl transition-all duration-300 ${isFocused ? 'blur-2xl scale-105' : ''}`}></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors duration-300" />
                <Input
                  placeholder="Enter your PNR number to track flights..."
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="pl-12 h-16 bg-white/15 dark:bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl text-lg font-medium focus:bg-white/20 focus:border-white/40 transition-all duration-300 hover:bg-white/18"
                  maxLength={6}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="h-16 px-8 bg-white dark:bg-white/95 text-primary hover:bg-white/90 dark:hover:bg-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 group"
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span>{isLoading ? 'Searching...' : 'Track Flight'}</span>
              </div>
            </Button>
          </div>
        </form>
      </div>

      {/* Animated plane in background */}
      <Plane className="absolute -right-8 -bottom-8 h-40 w-40 text-white/10 rotate-12 animate-pulse" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-3xl" />
    </div>
  );
};