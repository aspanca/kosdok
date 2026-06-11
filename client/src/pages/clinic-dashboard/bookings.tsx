import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import {
  getClinicAppointments,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  type AppointmentStatus,
} from "../../lib/api/appointments";
import { ClinicDashboardLayout, REASON_LABELS, formatDateSq } from "./dashboard-layout";
import { Calendar, Clock, Phone, Mail } from "lucide-react";

const STATUS_TABS: { key: AppointmentStatus | "all"; label: string }[] = [
  { key: "all", label: "Të gjitha" },
  { key: "pending", label: "Në pritje" },
  { key: "confirmed", label: "Konfirmuara" },
  { key: "completed", label: "Përfunduara" },
  { key: "cancelled", label: "Anuluara" },
];

const STATUS_BADGES: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: "Në pritje", className: "bg-primary/10 text-primary" },
  confirmed: { label: "Konfirmuar", className: "bg-[#7ED321]/10 text-[#5fae12]" },
  completed: { label: "Përfunduar", className: "bg-[#7ED321]/10 text-[#7ED321]" },
  cancelled: { label: "Anuluar", className: "bg-red-100 text-red-600" },
};

export const ClinicBookingsPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["clinic-appointments"],
    queryFn: () => getClinicAppointments(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["clinic-appointments"] });
    queryClient.invalidateQueries({ queryKey: ["clinic-patients"] });
  };

  const confirmMutation = useMutation({
    mutationFn: confirmAppointment,
    onSuccess: invalidate,
    onError: (err) => setActionError(err instanceof Error ? err.message : "Diçka shkoi gabim"),
  });
  const completeMutation = useMutation({
    mutationFn: completeAppointment,
    onSuccess: invalidate,
    onError: (err) => setActionError(err instanceof Error ? err.message : "Diçka shkoi gabim"),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: invalidate,
    onError: (err) => setActionError(err instanceof Error ? err.message : "Diçka shkoi gabim"),
  });

  const filtered =
    statusFilter === "all" ? appointments : appointments.filter((a) => a.status === statusFilter);

  const countFor = (key: AppointmentStatus | "all") =>
    key === "all" ? appointments.length : appointments.filter((a) => a.status === key).length;

  return (
    <ClinicDashboardLayout
      active="bookings"
      title="Rezervimet"
      subtitle="Menaxhoni kërkesat dhe takimet e klinikës suaj"
    >
      <div className="bg-white border border-[#dedede]">
        {/* Status filter */}
        <div className="px-6 py-4 border-b border-[#dedede] flex gap-1 bg-[#fafafa] overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`py-2 px-4 min-w-max text-[13px] font-[600] rounded-md transition-colors ${
                statusFilter === tab.key
                  ? "bg-white text-[#494e60] shadow-sm border border-[#dedede]"
                  : "text-[#9fa4b4] hover:text-[#494e60]"
              }`}
            >
              {tab.label} ({countFor(tab.key)})
            </button>
          ))}
        </div>

        {actionError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-lg">
            {actionError}
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-[#dedede]">
          {isLoading ? (
            <div className="p-12 text-center text-[#9fa4b4]">Duke ngarkuar...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-[#9fa4b4]">
              Nuk ka rezervime{statusFilter !== "all" ? " në këtë status" : ""}.
            </div>
          ) : (
            filtered.map((appointment) => {
              const badge = STATUS_BADGES[appointment.status];
              return (
                <div key={appointment.id} className="p-5 hover:bg-[#fafafa] transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Patient avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
                      {appointment.patientPicture ? (
                        <img
                          src={appointment.patientPicture}
                          alt={appointment.patientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        appointment.patientName.split(" ").map((n) => n[0]).join("").toUpperCase()
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <h3 className="text-[15px] font-[600] text-[#494e60]">
                            {appointment.patientName}
                          </h3>
                          <p className="text-[13px] text-[#9fa4b4]">
                            {REASON_LABELS[appointment.reason] ?? appointment.reason}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-[12px] font-[600] ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#494e60] mb-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#9fa4b4]" />
                          {formatDateSq(appointment.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#9fa4b4]" />
                          {appointment.time}
                        </span>
                        {appointment.patientPhone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-[#9fa4b4]" />
                            {appointment.patientPhone}
                          </span>
                        )}
                        {appointment.patientEmail && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#9fa4b4]" />
                            {appointment.patientEmail}
                          </span>
                        )}
                      </div>

                      {appointment.notes && (
                        <p className="text-[13px] text-[#757b8c] bg-[#f8f8f8] px-3 py-2 rounded mt-2">
                          {appointment.notes}
                        </p>
                      )}

                      {/* Actions */}
                      {(appointment.status === "pending" || appointment.status === "confirmed") && (
                        <div className="flex gap-2 mt-3">
                          {appointment.status === "pending" && (
                            <Button
                              onClick={() => confirmMutation.mutate(appointment.id)}
                              disabled={confirmMutation.isPending}
                              className="h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[12px] font-[600] disabled:opacity-50"
                            >
                              Konfirmo
                            </Button>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button
                              onClick={() => completeMutation.mutate(appointment.id)}
                              disabled={completeMutation.isPending}
                              className="h-9 px-4 bg-[#7ED321] hover:bg-[#6cb91c] text-white text-[12px] font-[600] disabled:opacity-50"
                            >
                              Përfundo
                            </Button>
                          )}
                          <Button
                            onClick={() => cancelMutation.mutate(appointment.id)}
                            disabled={cancelMutation.isPending}
                            className="h-9 px-4 bg-white border border-red-200 text-red-600 text-[12px] font-[600] hover:bg-red-50 disabled:opacity-50"
                          >
                            Anulo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};
