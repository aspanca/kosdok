"use client";

import { useQuery } from "@tanstack/react-query";
import { getClinicPatients } from "../../lib/api/appointments";
import { ClinicDashboardLayout, formatDateSq } from "./dashboard-layout";

export const ClinicPatientsPage = () => {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["clinic-patients"],
    queryFn: getClinicPatients,
  });

  return (
    <ClinicDashboardLayout
      active="patients"
      title="Pacientët"
      subtitle="Pacientët që kanë rezervuar takime në klinikën tuaj"
    >
      <div className="bg-white border border-[#dedede] overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center text-[#9fa4b4]">Duke ngarkuar...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-[#9fa4b4]">
            Ende nuk keni pacientë me rezervime.
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#dedede] text-left text-[12px] uppercase tracking-wide text-[#9fa4b4]">
                <th className="px-5 py-3 font-[600]">Pacienti</th>
                <th className="px-5 py-3 font-[600]">Kontakti</th>
                <th className="px-5 py-3 font-[600]">Qyteti</th>
                <th className="px-5 py-3 font-[600] text-center">Takime</th>
                <th className="px-5 py-3 font-[600]">Takimi i fundit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                        {patient.picture ? (
                          <img src={patient.picture} alt={patient.name} className="w-full h-full object-cover" />
                        ) : (
                          patient.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                        )}
                      </div>
                      <span className="text-[14px] font-[600] text-[#494e60]">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[13px] text-[#494e60]">{patient.email}</div>
                    {patient.phone && <div className="text-[12px] text-[#9fa4b4]">{patient.phone}</div>}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#494e60]">{patient.city || "—"}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-primary/10 text-primary text-[13px] font-[600] rounded-full">
                      {patient.appointmentCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#494e60]">
                    {formatDateSq(patient.lastAppointment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ClinicDashboardLayout>
  );
};
