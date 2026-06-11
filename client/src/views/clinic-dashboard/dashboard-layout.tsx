"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth-context";
import { CalendarDays, ClipboardList, Users, Building2 } from "lucide-react";

type DashboardTab = "bookings" | "calendar" | "patients";

const TABS: { key: DashboardTab; label: string; to: string; icon: typeof CalendarDays }[] = [
  { key: "bookings", label: "Rezervimet", to: "/clinic-dashboard/bookings", icon: ClipboardList },
  { key: "calendar", label: "Kalendari", to: "/clinic-dashboard/calendar", icon: CalendarDays },
  { key: "patients", label: "Pacientët", to: "/clinic-dashboard/patients", icon: Users },
];

export const REASON_LABELS: Record<string, string> = {
  first: "Vizitë e parë",
  followup: "Kontrolli",
  consult: "Konsultë",
  exam: "Ekzaminim",
  treatment: "Trajtim",
  other: "Tjetër",
};

export function formatDateSq(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const ClinicDashboardLayout = ({
  active,
  title,
  subtitle,
  children,
}: {
  active: DashboardTab;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const { isLoggedIn, isClinic } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || !isClinic) {
      router.push("/signin?mode=login");
    }
  }, [isLoggedIn, isClinic, router]);

  if (!isLoggedIn || !isClinic) return null;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[26px] font-[600] tracking-[0.72px] text-[#494e60]">{title}</h1>
            <p className="text-[14px] text-[#9fa4b4] mt-1">{subtitle}</p>
          </div>
          <Link
            href="/clinic-profile"
            className="inline-flex items-center gap-2 h-10 px-4 border border-[#dedede] bg-white rounded-lg text-[13px] font-[600] text-[#494e60] hover:border-primary hover:text-primary transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Redakto profilin
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#dedede] p-1 rounded-lg mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.key}
                href={tab.to}
                className={`flex items-center justify-center gap-2 flex-1 min-w-max py-2.5 px-4 rounded-md text-[13px] font-[600] transition-colors ${
                  active === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#757b8c] hover:text-[#494e60] hover:bg-[#f8f8f8]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
};
