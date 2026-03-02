import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import {
  LayoutDashboard,
  MapPin,
  Stethoscope,
  Building2,
  Users,
  FlaskConical,
  Pill,
  UserCog,
  LogOut,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cities", label: "Qytetet", icon: MapPin },
  { to: "/services", label: "Shërbimet", icon: Stethoscope },
  { to: "/facilities", label: "Lehtësirat", icon: Building2 },
  { to: "/patients", label: "Pacientët", icon: Users },
  { to: "/clinics", label: "Klinikat", icon: Building2 },
  { to: "/labs", label: "Laboratorët", icon: FlaskConical },
  { to: "/pharmacies", label: "Barnatorët", icon: Pill },
  { to: "/doctors", label: "Mjekët", icon: UserCog },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background-page flex">
      <aside className="w-56 bg-white border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="font-semibold text-text-primary">Kosdok Admin</h1>
          <p className="text-xs text-text-muted">{user?.email}</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 hover:text-primary ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary"}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-text-muted hover:bg-status-error/10 hover:text-status-error"
          >
            <LogOut className="w-4 h-4" />
            Dil
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
