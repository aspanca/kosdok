export interface UserProfile {
  userId: string;
  fullName: string;
  phone: string | null;
  city: string | null;
  locale: string;
  avatarUrl: string | null;
}
