import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plane, 
  Ticket, 
  HeadphonesIcon, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  // These must start with /user to match your App.tsx Route path="/user"
  { label: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { label: "Flights", path: "/user/flights", icon: Plane },
  { label: "My Bookings", path: "/user/bookings", icon: Ticket },
  { label: "Support", path: "/user/assistance", icon: HeadphonesIcon },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-primary text-primary-foreground transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Plane className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg leading-tight">UdaanSathi</h1>
                <p className="text-xs text-primary-foreground/70">Fly with confidence</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  active 
                    ? "bg-primary-foreground text-primary font-medium" 
                    : "hover:bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", active && "text-primary")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-4 w-4" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="p-3 border-t border-primary-foreground/20 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-foreground/20 transition-colors text-sm"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "" : "rotate-180")} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
