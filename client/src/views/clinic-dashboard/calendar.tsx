"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClinicAppointments, type AppointmentStatus } from "../../lib/api/appointments";
import { ClinicDashboardLayout, REASON_LABELS } from "./dashboard-layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "border-l-primary bg-primary/5",
  confirmed: "border-l-[#7ED321] bg-[#7ED321]/5",
  completed: "border-l-[#b8b8b8] bg-[#f5f5f5]",
  cancelled: "border-l-red-400 bg-red-50 opacity-60",
};

function toDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as first day
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export const ClinicCalendarPage = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["clinic-appointments"],
    queryFn: () => getClinicAppointments(),
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const shiftWeek = (weeks: number) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + weeks * 7);
    setWeekStart(next);
  };

  const todayKey = toDateParam(new Date());
  const weekLabel = `${days[0].toLocaleDateString("sq-AL", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <ClinicDashboardLayout
      active="calendar"
      title="Kalendari"
      subtitle="Pamja javore e takimeve të klinikës"
    >
      <div className="bg-white border border-[#dedede]">
        {/* Week navigation */}
        <div className="px-6 py-4 border-b border-[#dedede] flex items-center justify-between">
          <button
            onClick={() => shiftWeek(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#dedede] text-[#757b8c] hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[15px] font-[600] text-[#494e60]">{weekLabel}</span>
            <button
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="block mx-auto text-[12px] text-primary hover:underline"
            >
              Sot
            </button>
          </div>
          <button
            onClick={() => shiftWeek(1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#dedede] text-[#757b8c] hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week grid */}
        {isLoading ? (
          <div className="p-12 text-center text-[#9fa4b4]">Duke ngarkuar...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-[#f0f0f0]">
            {days.map((day) => {
              const dayKey = toDateParam(day);
              const dayAppointments = appointments
                .filter((a) => a.date === dayKey && a.status !== "cancelled")
                .sort((a, b) => a.time.localeCompare(b.time));
              const isToday = dayKey === todayKey;

              return (
                <div key={dayKey} className="min-h-[140px]">
                  <div
                    className={`px-3 py-2 text-center border-b border-[#f0f0f0] ${
                      isToday ? "bg-primary text-white" : "bg-[#fafafa] text-[#494e60]"
                    }`}
                  >
                    <div className={`text-[11px] uppercase font-[600] ${isToday ? "text-white/80" : "text-[#9fa4b4]"}`}>
                      {day.toLocaleDateString("sq-AL", { weekday: "short" })}
                    </div>
                    <div className="text-[16px] font-bold">{day.getDate()}</div>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {dayAppointments.length === 0 ? (
                      <p className="text-[11px] text-[#c4c4c4] text-center py-3">—</p>
                    ) : (
                      dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`border-l-2 px-2 py-1.5 rounded-r text-[12px] ${STATUS_COLORS[appointment.status]}`}
                        >
                          <div className="font-[600] text-[#494e60]">{appointment.time}</div>
                          <div className="text-[#494e60] truncate">{appointment.patientName}</div>
                          <div className="text-[11px] text-[#9fa4b4] truncate">
                            {REASON_LABELS[appointment.reason] ?? appointment.reason}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-[12px] text-[#757b8c]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/20 border-l-2 border-primary" /> Në pritje
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#7ED321]/20 border-l-2 border-[#7ED321]" /> Konfirmuar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#f0f0f0] border-l-2 border-[#b8b8b8]" /> Përfunduar
        </span>
      </div>
    </ClinicDashboardLayout>
  );
};
