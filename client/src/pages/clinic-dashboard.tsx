import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Stethoscope,
  Settings,
  Save,
  Plus,
  X,
  Check,
  Upload,
  Monitor,
  Car,
  Accessibility,
  Shield,
  Baby,
  Siren,
  CreditCard,
  Wifi,
  ChevronRight,
  Trash2,
  Image,
  LucideIcon,
} from "lucide-react";

// Mock existing doctors
const existingDoctors = [
  { id: "1", name: "Dr. Alban Gashi", specialty: "Dermatolog", avatar: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg" },
  { id: "2", name: "Dr. Anita Dent", specialty: "Kardiolog", avatar: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg" },
  { id: "3", name: "Dr. Eliza Shehu", specialty: "Dermatolog", avatar: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg" },
  { id: "4", name: "Dr. Arben Krasniqi", specialty: "Neurolog", avatar: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg" },
  { id: "5", name: "Dr. Leonora Berisha", specialty: "Pediatër", avatar: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg" },
];

// Available services
const availableServices = [
  { id: "cardio", name: "Kardiologji", icon: "❤️" },
  { id: "derma", name: "Dermatologji", icon: "🧴" },
  { id: "neuro", name: "Neurologji", icon: "🧠" },
  { id: "ortho", name: "Ortopedi", icon: "🦴" },
  { id: "pedia", name: "Pediatri", icon: "👶" },
  { id: "ent", name: "ORL", icon: "👂" },
  { id: "optha", name: "Oftalmologji", icon: "👁️" },
  { id: "dental", name: "Stomatologji", icon: "🦷" },
  { id: "gyneco", name: "Gjinekologji", icon: "🩺" },
  { id: "uro", name: "Urologji", icon: "💧" },
  { id: "gastro", name: "Gastroenterologji", icon: "🫁" },
  { id: "radio", name: "Radiologji", icon: "📷" },
];

// Amenities with icons
const availableAmenities: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "online", label: "Konsultim online", icon: Monitor },
  { id: "parking", label: "Parking", icon: Car },
  { id: "wheelchair", label: "Akses për invalidë", icon: Accessibility },
  { id: "insurance", label: "Pranon sigurim", icon: Shield },
  { id: "children", label: "Miqësor për fëmijë", icon: Baby },
  { id: "emergency", label: "Shërbim urgjence", icon: Siren },
  { id: "creditcard", label: "Kartë krediti", icon: CreditCard },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
];

const weekDays = [
  { id: "monday", label: "E Hënë" },
  { id: "tuesday", label: "E Martë" },
  { id: "wednesday", label: "E Mërkurë" },
  { id: "thursday", label: "E Enjte" },
  { id: "friday", label: "E Premte" },
  { id: "saturday", label: "E Shtunë" },
  { id: "sunday", label: "E Diel" },
];

type TabType = "info" | "services" | "staff" | "schedule" | "amenities";

export const ClinicDashboardPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [clinicInfo, setClinicInfo] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, { open: string; close: string; closed: boolean }>>({
    monday: { open: "08:00", close: "17:00", closed: false },
    tuesday: { open: "08:00", close: "17:00", closed: false },
    wednesday: { open: "08:00", close: "17:00", closed: false },
    thursday: { open: "08:00", close: "17:00", closed: false },
    friday: { open: "08:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "14:00", closed: false },
    sunday: { open: "", close: "", closed: true },
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const updateSchedule = (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md shadow-lg">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-text-primary mb-2">Kyçu si Klinikë</h1>
          <p className="text-text-muted mb-6">Duhet të kyçeni për të menaxhuar profilin e klinikës suaj.</p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => navigate({ to: "/" })}>
              Kthehu
            </Button>
            <Button variant="primary" fullWidth onClick={() => navigate({ to: "/signin" })}>
              Kyçu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: TabType; label: string; icon: LucideIcon }[] = [
    { key: "info", label: "Informacioni", icon: Building2 },
    { key: "services", label: "Shërbimet", icon: Stethoscope },
    { key: "staff", label: "Stafi", icon: Users },
    { key: "schedule", label: "Orari", icon: Clock },
    { key: "amenities", label: "Lehtësirat", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background-page">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Paneli i Klinikës</h1>
                <p className="text-xs text-text-muted">Menaxhoni profilin tuaj</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-sm text-status-success flex items-center gap-1">
                  <Check className="w-4 h-4" /> U ruajt!
                </span>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Ruaj ndryshimet
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-px -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informacioni i Klinikës
            </h2>

            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-background-page rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  {clinicInfo.logo ? (
                    <img src={clinicInfo.logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <Image className="w-8 h-8 text-text-muted" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
                    Ngarko logo
                  </Button>
                  <p className="text-xs text-text-muted mt-1">PNG, JPG deri në 2MB</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Emri i Klinikës *</label>
                <Input
                  value={clinicInfo.name}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                  placeholder="p.sh. Klinika Dentare Smile"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Përshkrimi</label>
                <textarea
                  value={clinicInfo.description}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, description: e.target.value })}
                  placeholder="Përshkruani klinikën tuaj..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-1" /> Adresa
                  </label>
                  <Input
                    value={clinicInfo.address}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                    placeholder="Rruga, Numri"
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Qyteti</label>
                  <Input
                    value={clinicInfo.city}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, city: e.target.value })}
                    placeholder="p.sh. Prishtinë"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1" /> Telefoni
                  </label>
                  <Input
                    value={clinicInfo.phone}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                    placeholder="+383 4X XXX XXX"
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </label>
                  <Input
                    value={clinicInfo.email}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                    placeholder="info@klinika.com"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  <Globe className="w-4 h-4 inline mr-1" /> Website (opsionale)
                </label>
                <Input
                  value={clinicInfo.website}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, website: e.target.value })}
                  placeholder="https://www.klinika.com"
                  className="h-11"
                />
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Shërbimet
            </h2>
            <p className="text-sm text-text-muted mb-6">Zgjidhni shërbimet që ofron klinika juaj</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary-lightest"
                        : "border-border-light hover:border-primary/30 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="text-sm font-medium text-text-primary">{service.name}</div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-status-success mt-2" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border-light">
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Shto shërbim të ri
              </Button>
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Stafi Mjekësor
            </h2>
            <p className="text-sm text-text-muted mb-6">Zgjidhni mjekët që punojnë në klinikën tuaj</p>

            <div className="space-y-3">
              {existingDoctors.map((doctor) => {
                const isSelected = selectedStaff.includes(doctor.id);
                return (
                  <div
                    key={doctor.id}
                    onClick={() => toggleStaff(doctor.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-lightest"
                        : "border-border-light hover:border-primary/30 bg-white"
                    }`}
                  >
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{doctor.name}</div>
                      <div className="text-sm text-primary">{doctor.specialty}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border-light">
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Fto mjek të ri
              </Button>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Orari i Punës
            </h2>
            <p className="text-sm text-text-muted mb-6">Caktoni orarin e hapjes dhe mbylljes</p>

            <div className="space-y-3">
              {weekDays.map((day) => {
                const daySchedule = schedule[day.id];
                return (
                  <div
                    key={day.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      daySchedule.closed
                        ? "border-border-light bg-background-page"
                        : "border-border-light bg-white"
                    }`}
                  >
                    <div className="w-24 font-medium text-text-primary">{day.label}</div>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daySchedule.closed}
                        onChange={(e) => updateSchedule(day.id, "closed", e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-muted">Mbyllur</span>
                    </label>

                    {!daySchedule.closed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <Input
                          type="time"
                          value={daySchedule.open}
                          onChange={(e) => updateSchedule(day.id, "open", e.target.value)}
                          className="w-28 h-9 text-sm"
                        />
                        <span className="text-text-muted">-</span>
                        <Input
                          type="time"
                          value={daySchedule.close}
                          onChange={(e) => updateSchedule(day.id, "close", e.target.value)}
                          className="w-28 h-9 text-sm"
                        />
                      </div>
                    )}

                    {daySchedule.closed && (
                      <span className="ml-auto text-sm text-status-error">Mbyllur</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === "amenities" && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Lehtësirat
            </h2>
            <p className="text-sm text-text-muted mb-6">Zgjidhni lehtësirat që ofron klinika juaj</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableAmenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                const Icon = amenity.icon;
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary-lightest"
                        : "border-border-light hover:border-primary/30 bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-primary" : "bg-background-page"
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-text-muted"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{amenity.label}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Preview Link */}
        <div className="mt-6 text-center">
          <Link
            to="/hospital"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Shiko profilin publik
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
