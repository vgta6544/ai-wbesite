export type ProjectCategory =
  | 'Graphic Design'
  | 'Branding'
  | 'Social Media'
  | 'CGI'
  | 'UGC Ads'
  | 'Websites'
  | 'Other';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  coverImage: string;
  images: string[];
  videoUrl?: string;
  tools: string[];
  projectDate: string;
  client?: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  product?: string;
  isChat?: boolean;
  status: MessageStatus;
  createdAt: string;
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  behance?: string;
  github?: string;
  x?: string;
  dribbble?: string;
}

export interface SiteSettings {
  id: string;
  siteTitle: string;
  professionalTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  bio: string;
  email: string;
  whatsapp: string;
  location: string;
  availabilityStatus: string;
  isOnline: boolean;
  socialLinks: SocialLinks;
  footerText: string;
  updatedAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  picture?: string;
  role: 'admin';
  lastLogin: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  step: 'login' | 'pin' | 'authenticated';
  googleUser: AdminUser | null;
  token: string | null;
  lockoutUntil: number | null;
  attemptsLeft: number;
}
