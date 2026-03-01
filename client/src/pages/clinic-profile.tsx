import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Clock,
  Stethoscope,
  Save,
  Check,
  Plus,
  Trash2,
  Image,
} from "lucide-react";
import * as clinicApi from "../lib/api/clinic";
import type { ClinicProfile, ClinicLocation, Service } from "../lib/api/clinic";
import { formInputClass } from "../lib/form-styles";

const WEEK_DAYS = [
  { id: "monday", label: "E Hënë" },
  { id: "tuesday", label: "E Martë" },
  { id: "wednesday", label: "E Mërkurë" },
  { id: "thursday", label: "E Enjte" },
  { id: "friday", label: "E Premte" },
  { id: "saturday", label: "E Shtunë" },
  { id: "sunday", label: "E Diel" },
];

const emptySchedule = () =>
  Object.fromEntries(
    WEEK_DAYS.map((d) => [d.id, { open: "08:00", close: "17:00", closed: d.id === "sunday" }])
  );

export const ClinicProfilePage = () => {
  const { user, isLoggedIn, isClinic } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    clinicName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    description: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    pictures: [] as string[],
    schedule: emptySchedule() as Record<string, { open: string; close: string; closed: boolean }>,
    serviceIds: [] as number[],
    locations: [] as ClinicLocation[],
  });

  useEffect(() => {
    if (!isLoggedIn || !isClinic) {
      navigate({ to: "/signin" });
      return;
    }
    Promise.all([clinicApi.getClinicProfile(), clinicApi.getServices()])
      .then(([profileData, servicesData]) => {
        setProfile(profileData);
        setServices(servicesData);
        setForm({
          clinicName: profileData.clinic_name ?? "",
          email: profileData.email ?? "",
          phone: profileData.phone ?? "",
          website: profileData.website ?? "",
          address: profileData.address ?? "",
          city: profileData.city ?? "",
          description: profileData.description ?? "",
          instagram: profileData.instagram ?? "",
          facebook: profileData.facebook ?? "",
          linkedin: profileData.linkedin ?? "",
          pictures: profileData.pictures ?? [],
          schedule:
            Object.keys(profileData.schedule || {}).length > 0
              ? { ...emptySchedule(), ...profileData.schedule }
              : emptySchedule(),
          serviceIds: profileData.serviceIds ?? [],
          locations: profileData.locations ?? [],
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Diçka shkoi gabim"))
      .finally(() => setLoading(false));
  }, [isLoggedIn, isClinic, navigate]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const updated = await clinicApi.updateClinicProfile({
        clinicName: form.clinicName,
        email: form.email,
        phone: form.phone,
        website: form.website || undefined,
        address: form.address,
        city: form.city,
        description: form.description,
        instagram: form.instagram || undefined,
        facebook: form.facebook || undefined,
        linkedin: form.linkedin || undefined,
        pictures: form.pictures,
        schedule: form.schedule,
        serviceIds: form.serviceIds,
        locations: form.locations.filter((l) => l.address || l.name || l.city),
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Diçka shkoi gabim");
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (id: number) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) ? prev.serviceIds.filter((s) => s !== id) : [...prev.serviceIds, id],
    }));
  };

  const updateSchedule = (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], [field]: value },
      },
    }));
  };

  const addLocation = () => {
    setForm((prev) => ({
      ...prev,
      locations: [...prev.locations, { name: "", address: "", city: "", phone: "" }],
    }));
  };

  const updateLocation = (idx: number, updates: Partial<ClinicLocation>) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.map((l, i) => (i === idx ? { ...l, ...updates } : l)),
    }));
  };

  const removeLocation = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== idx),
    }));
  };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await clinicApi.uploadClinicPicture(file);
      setForm((prev) => ({ ...prev, pictures: updated.pictures }));
      setProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ngarkimi dështoi");
    }
  };

  const removePicture = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== idx),
    }));
  };

  if (!isLoggedIn || !isClinic) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-[#9fa4b4]">Duke u ngarkuar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/clinic-dashboard" className="text-[#9fa4b4] hover:text-primary">
              ← Kthehu te paneli
            </Link>
            <h1 className="text-[26px] font-[600] text-[#494e60]">Redaktimi i profilit</h1>
          </div>
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> U ruajt!
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white h-11 px-6"
            >
              {saving ? "Duke ruajtur…" : "Ruaj ndryshimet"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <div className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informacioni bazë
            </h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">Emri</label>
                <Input
                  value={form.clinicName}
                  onChange={(e) => setForm((p) => ({ ...p, clinicName: e.target.value }))}
                  placeholder="Emri i klinikës"
                  className={formInputClass}
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">Përshkrimi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Përshkruani klinikën tuaj..."
                  rows={4}
                  className={`${formInputClass} resize-none`}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" /> Lokacioni / Adresa
                  </label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Adresa"
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] text-[#494e60] mb-2">Qyteti</label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Qyteti"
                    className={formInputClass}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                    <Phone className="w-4 h-4 inline mr-1" /> Telefoni
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+383 4X XXX XXX"
                    className={formInputClass}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="info@klinika.com"
                    type="email"
                    className={formInputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                  <Globe className="w-4 h-4 inline mr-1" /> Website
                </label>
                <Input
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://www.klinika.com"
                  className={formInputClass}
                />
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6">Rrjetet sociale</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                  <Instagram className="w-4 h-4 inline mr-1" /> Instagram
                </label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                  placeholder="instagram.com/..."
                  className={formInputClass}
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                  <Facebook className="w-4 h-4 inline mr-1" /> Facebook
                </label>
                <Input
                  value={form.facebook}
                  onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))}
                  placeholder="facebook.com/..."
                  className={formInputClass}
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-[#494e60] mb-2">
                  <Linkedin className="w-4 h-4 inline mr-1" /> LinkedIn
                </label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                  placeholder="linkedin.com/..."
                  className={formInputClass}
                />
              </div>
            </div>
          </section>

          {/* Pictures */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6 flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Fotot
            </h2>
            <div className="flex flex-wrap gap-4">
              {form.pictures.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removePicture(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-[#dedede] rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
                <Plus className="w-8 h-8 text-[#9fa4b4]" />
              </label>
            </div>
          </section>

          {/* Locations (multiple) */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Lokacionet (Google Maps - placeholder)
            </h2>
            <div className="space-y-4">
              {form.locations.map((loc, i) => (
                <div key={i} className="p-4 border border-[#e5e7eb] rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-[600] text-[#494e60]">Lokacioni {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation(i)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Emri"
                      value={loc.name ?? ""}
                      onChange={(e) => updateLocation(i, { name: e.target.value })}
                      className={formInputClass}
                    />
                    <Input
                      placeholder="Adresa"
                      value={loc.address ?? ""}
                      onChange={(e) => updateLocation(i, { address: e.target.value })}
                      className={formInputClass}
                    />
                    <Input
                      placeholder="Qyteti"
                      value={loc.city ?? ""}
                      onChange={(e) => updateLocation(i, { city: e.target.value })}
                      className={formInputClass}
                    />
                    <Input
                      placeholder="Telefoni"
                      value={loc.phone ?? ""}
                      onChange={(e) => updateLocation(i, { phone: e.target.value })}
                      className={formInputClass}
                    />
                  </div>
                  <div className="h-24 bg-[#f3f4f6] rounded flex items-center justify-center text-[#9fa4b4] text-sm">
                    Harta me Google Maps (placeholder)
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addLocation} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Shto lokacion
              </Button>
            </div>
          </section>

          {/* Services */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Shërbimet
            </h2>
            <p className="text-sm text-[#9fa4b4] mb-4">Zgjidhni shërbimet që ofron klinika juaj</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {services.map((s) => {
                const isSelected = form.serviceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected ? "border-primary bg-primary/5" : "border-[#e5e7eb] hover:border-primary/30"
                    }`}
                  >
                    <div className="text-sm font-[600] text-[#494e60]">{s.name}</div>
                    {s.category && <div className="text-xs text-[#9fa4b4] mt-0.5">{s.category}</div>}
                    {isSelected && <Check className="w-4 h-4 text-primary mt-2" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-white border border-[#dedede] rounded-xl p-6">
            <h2 className="text-lg font-[600] text-[#494e60] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Orari
            </h2>
            <div className="space-y-3">
              {WEEK_DAYS.map((day) => {
                const daySchedule = form.schedule[day.id] || { open: "08:00", close: "17:00", closed: false };
                return (
                  <div
                    key={day.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      daySchedule.closed ? "bg-[#f8f8f8] border-[#e5e7eb]" : "border-[#e5e7eb]"
                    }`}
                  >
                    <div className="w-24 font-[600] text-[#494e60]">{day.label}</div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daySchedule.closed}
                        onChange={(e) => updateSchedule(day.id, "closed", e.target.checked)}
                        className="w-4 h-4 rounded border-[#dedede] text-primary"
                      />
                      <span className="text-sm text-[#9fa4b4]">Mbyllur</span>
                    </label>
                    {!daySchedule.closed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <Input
                          type="time"
                          value={daySchedule.open}
                          onChange={(e) => updateSchedule(day.id, "open", e.target.value)}
                          className="w-28 h-9 text-sm"
                        />
                        <span className="text-[#9fa4b4]">-</span>
                        <Input
                          type="time"
                          value={daySchedule.close}
                          onChange={(e) => updateSchedule(day.id, "close", e.target.value)}
                          className="w-28 h-9 text-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
