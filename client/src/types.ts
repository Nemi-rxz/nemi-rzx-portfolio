export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  tools: string[];
  imageUrl: string;
  projectUrl: string;
  featured: boolean;
  order: number;
  published: boolean;
}

export interface Service {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface SiteContent {
  _id?: string;
  heroTitle: string;
  heroRole: string;
  heroBio: string;
  heroNameDisplay: string;
  heroAvatarUrl: string;
  valueHeadline: string;
  valueBody: string;
  contactHeading: string;
  footerNote: string;
  services: Service[];
  socialLinks: SocialLink[];
  techIcons: string[];
  clientLogos: string[];
}
