import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Stethoscope,
  Pencil,
  ChevronRight,
  Image,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import * as clinicApi from "../lib/api/clinic";
import type { ClinicProfile, ClinicLocation, Service } from "../lib/api/clinic";

const WEEK_DAYS: { id: string; label: string }[] = [
  { id: "monday", label: "E Hënë" },
  { id: "tuesday", label: "E Martë" },
  { id: "wednesday", label: "E Mërkurë" },
  { id: "thursday", label: "E Enjte" },
  { id: "friday", label: "E Premte" },
  { id: "saturday", label: "E Shtunë" },
  { id: "sunday", label: "E Diel" },
];

export const ClinicDashboardPage = () => {
  const { isLoggedIn, isClinic } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !isClinic) {
      navigate({ to: "/signin" });
      return;
    }
    Promise.all([clinicApi.getClinicProfile(), clinicApi.getServices()])
      .then(([profileData, servicesData]) => {
        setProfile(profileData);
        setServices(servicesData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Diçka shkoi gabim"))
      .finally(() => setLoading(false));
  }, [isLoggedIn, isClinic, navigate]);

  const getServiceNames = (): string[] => {
    if (!profile?.serviceIds?.length || !services.length) return [];
    return profile.serviceIds
      .map((id: number) => services.find((s: Service) => s.id === id)?.name)
      .filter((n: string | undefined): n is string => !!n);
  };

  const formatSchedule = (): string => {
    if (!profile?.schedule || typeof profile.schedule !== "object") return "—";
    const parts: string[] = [];
    for (const day of WEEK_DAYS) {
      const d = profile.schedule[day.id];
      if (!d) continue;
      if (d.closed) parts.push(`${day.label}: Mbyllur`);
      else parts.push(`${day.label}: ${d.open ?? "—"} - ${d.close ?? "—"}`);
    }
    return parts.length ? parts.join("\n") : "—";
  };

  if (!isLoggedIn || !isClinic) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center">
        <div className="text-text-muted">Duke u ngarkuar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md shadow-sm border border-border">
          <p className="text-status-error mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Provoni përsëri
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const serviceNames = getServiceNames();
  const hasMainInfo =
    profile.clinic_name ||
    profile.address ||
    profile.city ||
    profile.phone ||
    profile.email ||
    profile.website ||
    profile.description;
  const hasLocations = profile.locations?.length > 0;
  const hasServices = serviceNames.length > 0;

  return (
    <div className="min-h-screen bg-background-page">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            Mirë se vini, {profile.clinic_name || "Klinikë"}
          </h1>
          <p className="text-text-muted mt-1">
            Këtu mund të shihni dhe ndryshoni të dhënat e klinikës suaj.
          </p>
        </div>

        {/* Edit profile CTA */}
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
              <Pencil className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Ndryshoni profilin tuaj</p>
              <p className="text-sm text-text-muted">
                Përditësoni informacionin, shërbimet dhe lokacionet.
              </p>
            </div>
          </div>
          <Link to="/clinic-profile">
            <Button variant="primary" size="lg" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Shko te redaktimi
            </Button>
          </Link>
        </div>

        {/* Main info */}
        <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informacioni kryesor
            </h2>
            <Link to="/clinic-profile">
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>
                Ndrysho
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {!hasMainInfo ? (
              <p className="text-text-muted text-sm">
                Nuk keni plotësuar ende informacionin.{" "}
                <Link to="/clinic-profile" className="text-primary hover:underline">
                  Shtoni të dhënat tuaja
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {profile.logo && (
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.logo}
                      alt="Logo"
                      className="w-16 h-16 rounded-xl object-cover border border-border"
                    />
                  </div>
                )}
                {profile.clinic_name && (
                  <div>
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      Emri
                    </span>
                    <p className="text-text-primary font-medium mt-0.5">{profile.clinic_name}</p>
                  </div>
                )}
                {profile.description && (
                  <div>
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      Përshkrimi
                    </span>
                    <p className="text-text-primary mt-0.5 whitespace-pre-wrap">{profile.description}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {(profile.address || profile.city) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          Adresa
                        </span>
                        <p className="text-text-primary mt-0.5">
                          {[profile.address, profile.city].filter(Boolean).join(", ") || "—"}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          Telefoni
                        </span>
                        <p className="text-text-primary mt-0.5">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          Email
                        </span>
                        <p className="text-text-primary mt-0.5">{profile.email}</p>
                      </div>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          Website
                        </span>
                        <a
                          href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mt-0.5 block"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {(profile.instagram || profile.facebook || profile.linkedin) && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {profile.instagram && (
                      <a
                        href={profile.instagram.startsWith("http") ? profile.instagram : `https://${profile.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-text-muted hover:text-primary"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm">Instagram</span>
                      </a>
                    )}
                    {profile.facebook && (
                      <a
                        href={profile.facebook.startsWith("http") ? profile.facebook : `https://${profile.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-text-muted hover:text-primary"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="text-sm">Facebook</span>
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-text-muted hover:text-primary"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                  </div>
                )}
                {profile.schedule && Object.keys(profile.schedule).length > 0 && (
                  <div className="flex items-start gap-3 pt-2">
                    <Clock className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                        Orari
                      </span>
                      <pre className="text-text-primary text-sm mt-0.5 whitespace-pre-wrap font-sans">
                        {formatSchedule()}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Shërbimet
            </h2>
            <Link to="/clinic-profile">
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>
                Ndrysho
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {!hasServices ? (
              <p className="text-text-muted text-sm">
                Nuk keni zgjedhur ende shërbime.{" "}
                <Link to="/clinic-profile" className="text-primary hover:underline">
                  Shtoni shërbimet
                </Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {serviceNames.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Locations */}
        <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Lokacionet
            </h2>
            <Link to="/clinic-profile">
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>
                Ndrysho
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {!hasLocations ? (
              <p className="text-text-muted text-sm">
                Nuk keni shtuar ende lokacione.{" "}
                <Link to="/clinic-profile" className="text-primary hover:underline">
                  Shtoni lokacionet
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {profile.locations!.map((loc: ClinicLocation, i: number) => (
                  <div
                    key={loc.id ?? i}
                    className="p-4 rounded-lg border border-border-light bg-background-page"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        {loc.name && (
                          <p className="font-medium text-text-primary">{loc.name}</p>
                        )}
                        <p className="text-text-secondary text-sm">
                          {[loc.address, loc.city].filter(Boolean).join(", ") || "—"}
                        </p>
                        {loc.phone && (
                          <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {loc.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pictures preview */}
        {profile.pictures && profile.pictures.length > 0 && (
          <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Fotot
              </h2>
              <Link to="/clinic-profile">
                <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>
                  Ndrysho
                </Button>
              </Link>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {profile.pictures.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border border-border"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to home */}
        <div className="text-center pt-4">
          <Link to="/" className="text-sm text-text-muted hover:text-primary">
            ← Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    </div>
  );
};
