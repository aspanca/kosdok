import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/auth-context";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar, Clock, ChevronRight, X, Check, Shield } from "lucide-react";

interface AppointmentBookingProps {
  entityType: "doctor" | "clinic" | "hospital";
  entityName: string;
  entityImage?: string;
  specialty?: string;
}

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const appointmentReasons = [
  { id: "first", label: "Vizitë e parë" },
  { id: "followup", label: "Kontrolli" },
  { id: "consult", label: "Konsultë" },
  { id: "exam", label: "Ekzaminim" },
  { id: "treatment", label: "Trajtim" },
  { id: "other", label: "Tjetër" },
];

export const AppointmentBooking = ({
  entityType: _entityType,
  entityName,
  entityImage,
}: AppointmentBookingProps) => {
  void _entityType;
  const { isLoggedIn, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    dateObj: null as Date | null,
    time: "",
    reason: "",
    notes: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const resetAndClose = () => {
    setIsModalOpen(false);
    setBookingSuccess(false);
    setStep(1);
    setFormData({
      dateObj: null,
      time: "",
      reason: "",
      notes: "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: "",
      email: user?.email || "",
    });
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) dates.push(date);
    }
    return dates;
  };

  const formatDateShort = (date: Date) => ({
    day: date.toLocaleDateString("sq-AL", { weekday: "short" }).slice(0, 3),
    date: date.getDate(),
  });

  const formatDateFull = (date: Date) =>
    date.toLocaleDateString("sq-AL", { weekday: "long", day: "numeric", month: "long" });

  const availableDates = getAvailableDates();

  return (
    <>
      {/* Compact Booking Card */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-4 sm:p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] sm:text-[15px] font-semibold">Cakto takim</h3>
            <p className="text-[11px] sm:text-[12px] text-white/70">Rezervo online</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-white/60">
            <Shield className="w-3 h-3" />
            <span>Verifikuar</span>
          </div>
        </div>
        
        {isLoggedIn ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full h-10 sm:h-11 bg-white hover:bg-white/95 text-primary rounded-lg text-[13px] sm:text-[14px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <Clock className="w-4 h-4" />
            Zgjidh datën dhe orën
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to="/signin"
            className="w-full h-10 sm:h-11 bg-white hover:bg-white/95 text-primary rounded-lg text-[13px] sm:text-[14px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            Kyçu për të rezervuar
          </Link>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />
          
          <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl shadow-2xl h-full sm:h-auto sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {entityImage && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={entityImage} alt={entityName} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  </div>
                )}
                <div className="text-white">
                  <h2 className="text-[14px] sm:text-[15px] font-semibold">Cakto takim</h2>
                  <p className="text-[11px] sm:text-[12px] text-white/80 truncate max-w-[180px]">{entityName}</p>
                </div>
              </div>
              <button onClick={resetAndClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success */}
            {bookingSuccess ? (
              <div className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 text-status-success" />
                </div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-text-primary mb-1">Sukses!</h3>
                <p className="text-[12px] sm:text-[13px] text-text-muted mb-4">Takimi u caktua me sukses.</p>
                <div className="bg-background-page p-3 text-[12px] sm:text-[13px] text-text-primary mb-4 rounded-lg">
                  <strong>{formData.dateObj && formatDateFull(formData.dateObj)}</strong> • {formData.time}
                </div>
                <Button onClick={resetAndClose} className="h-10 px-6 sm:px-8 bg-primary text-white text-[13px] font-semibold rounded-lg">
                  Mbyll
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 sm:max-h-[calc(85vh-64px)]">
                {/* Steps indicator - Mobile optimized */}
                <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-background-muted border-b border-border-light flex items-center justify-center gap-2 sm:gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors ${
                        step > num ? "bg-status-success text-white" : 
                        step === num ? "bg-primary text-white" : 
                        "bg-border text-text-muted"
                      }`}>
                        {step > num ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : num}
                      </div>
                      {num < 3 && <div className={`w-6 sm:w-8 h-0.5 rounded ${step > num ? "bg-status-success" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1 - Date & Time */}
                {step === 1 && (
                  <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-text-primary mb-2">📅 Zgjidhni datën</label>
                      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                        {availableDates.map((date) => {
                          const f = formatDateShort(date);
                          const selected = formData.dateObj?.toDateString() === date.toDateString();
                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              onClick={() => setFormData({ ...formData, dateObj: date })}
                              className={`py-2 sm:py-2.5 rounded-lg border text-center transition-all ${
                                selected 
                                  ? "bg-primary text-white border-primary shadow-md" 
                                  : "border-border-light hover:border-primary/50 text-text-primary bg-white"
                              }`}
                            >
                              <div className={`text-[9px] sm:text-[10px] uppercase font-medium ${selected ? "text-white/80" : "text-text-muted"}`}>{f.day}</div>
                              <div className="text-[14px] sm:text-[16px] font-bold">{f.date}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-text-primary mb-2">🕐 Zgjidhni orën</label>
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, time })}
                            className={`py-2 sm:py-2.5 rounded-lg border text-[12px] sm:text-[13px] font-medium transition-all ${
                              formData.time === time 
                                ? "bg-primary text-white border-primary shadow-md" 
                                : "border-border-light hover:border-primary/50 text-text-primary bg-white"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - Reason */}
                {step === 2 && (
                  <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-text-primary mb-2">📋 Arsyeja e takimit</label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {appointmentReasons.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, reason: r.id })}
                            className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border text-[12px] sm:text-[13px] font-medium text-left transition-all ${
                              formData.reason === r.id 
                                ? "bg-primary-lightest border-primary text-primary" 
                                : "border-border-light hover:border-primary/50 text-text-primary bg-white"
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-semibold text-text-primary mb-2">📝 Shënime (opsionale)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Përshkruani simptomat..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-border-light text-[12px] sm:text-[13px] focus:outline-none focus:border-primary resize-none bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3 - Confirm */}
                {step === 3 && (
                  <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="bg-background-page p-3 sm:p-4 rounded-lg text-[12px] sm:text-[13px] space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Data:</span>
                        <span className="font-semibold text-text-primary">{formData.dateObj && formatDateFull(formData.dateObj)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Ora:</span>
                        <span className="font-semibold text-text-primary">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Arsyeja:</span>
                        <span className="font-semibold text-text-primary">{appointmentReasons.find((r) => r.id === formData.reason)?.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] text-text-muted mb-1">Emri</label>
                        <Input value={formData.firstName || user?.firstName || ""} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="h-9 sm:h-10 text-[12px] sm:text-[13px] rounded-lg border-border-light" required />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-[11px] text-text-muted mb-1">Mbiemri</label>
                        <Input value={formData.lastName || user?.lastName || ""} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="h-9 sm:h-10 text-[12px] sm:text-[13px] rounded-lg border-border-light" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] text-text-muted mb-1">Telefoni</label>
                      <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+383 4X XXX XXX" className="h-9 sm:h-10 text-[12px] sm:text-[13px] rounded-lg border-border-light" required />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] text-text-muted mb-1">Email</label>
                      <Input value={formData.email || user?.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-9 sm:h-10 text-[12px] sm:text-[13px] rounded-lg border-border-light" required />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-border-light px-4 py-3 sm:px-5 sm:py-4 flex gap-2 sm:gap-3">
                  {step > 1 && (
                    <Button type="button" onClick={() => setStep(step - 1)} className="flex-1 h-10 sm:h-11 bg-background-page text-text-primary text-[12px] sm:text-[13px] font-semibold hover:bg-border-light rounded-lg">
                      ← Kthehu
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={(step === 1 && (!formData.dateObj || !formData.time)) || (step === 2 && !formData.reason)}
                      className="flex-1 h-10 sm:h-11 bg-primary text-white text-[12px] sm:text-[13px] font-semibold disabled:opacity-50 rounded-lg"
                    >
                      Vazhdo →
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1 h-10 sm:h-11 bg-primary text-white text-[12px] sm:text-[13px] font-semibold rounded-lg">
                      ✓ Konfirmo takimin
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
