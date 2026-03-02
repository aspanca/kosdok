import {
  Heart,
  Activity,
  Brain,
  Bone,
  Baby,
  Ear,
  Eye,
  Stethoscope,
  Syringe,
  Pill,
  Microscope,
  ScanSearch,
  Video,
  Calendar,
  Droplet,
  Ambulance,
  Building2,
  Scissors,
  X,
  Car,
  Wifi,
  Accessibility,
  Shield,
  Siren,
  CreditCard,
  Monitor,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  brain: Brain,
  bone: Bone,
  baby: Baby,
  ear: Ear,
  eye: Eye,
  stethoscope: Stethoscope,
  syringe: Syringe,
  pill: Pill,
  microscope: Microscope,
  "scan-search": ScanSearch,
  video: Video,
  calendar: Calendar,
  droplet: Droplet,
  ambulance: Ambulance,
  "building-2": Building2,
  scissors: Scissors,
  x: X,
  car: Car,
  wifi: Wifi,
  accessibility: Accessibility,
  shield: Shield,
  siren: Siren,
  "credit-card": CreditCard,
  monitor: Monitor,
};

export function getServiceIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Stethoscope;
  const key = name.toLowerCase().replace(/\s+/g, "-");
  return iconMap[key] ?? Stethoscope;
}

export function getFacilityIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Building2;
  const key = name.toLowerCase().replace(/\s+/g, "-");
  return iconMap[key] ?? Building2;
}
