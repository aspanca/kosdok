import { Link } from "@tanstack/react-router";
import { MapPin, Stethoscope, Building2, Users, FlaskConical, Pill, UserCog } from "lucide-react";

const cards = [
  { to: "/cities", label: "Qytetet", icon: MapPin },
  { to: "/services", label: "Shërbimet", icon: Stethoscope },
  { to: "/facilities", label: "Lehtësirat", icon: Building2 },
  { to: "/patients", label: "Pacientët", icon: Users },
  { to: "/clinics", label: "Klinikat", icon: Building2 },
  { to: "/labs", label: "Laboratorët", icon: FlaskConical },
  { to: "/pharmacies", label: "Barnatorët", icon: Pill },
  { to: "/doctors", label: "Mjekët", icon: UserCog },
];

export const DashboardPage = () => (
  <div>
    <h1 className="text-2xl font-semibold text-text-primary mb-6">Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.to}
            to={c.to}
            className="p-6 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <span className="font-medium text-text-primary">{c.label}</span>
          </Link>
        );
      })}
    </div>
  </div>
);
