import mongoose, { Schema, Document } from "mongoose";

export interface IService {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface ISocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface ISiteContent extends Document {
  heroTitle: string;
  heroRole: string;
  heroBio: string;
  heroNameDisplay: string;
  heroAvatarUrl: string;
  valueHeadline: string;
  valueBody: string;
  contactHeading: string;
  footerNote: string;
  services: IService[];
  socialLinks: ISocialLink[];
  techIcons: string[];
  clientLogos: string[];
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const socialSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const siteContentSchema = new Schema<ISiteContent>(
  {
    heroTitle: { type: String, default: "Nemi RZX" },
    heroRole: { type: String, default: "Creative Technologist" },
    heroBio: {
      type: String,
      default:
        "I am Emmanuel Nemi, a creative technologist building web products, multimedia systems, campaign experiences, and SEO-ready digital platforms for ambitious brands.",
    },
    heroNameDisplay: { type: String, default: "EMMANUEL NEMI" },
    heroAvatarUrl: { type: String, default: "/images/emmanuel-nemi-hero.jpg" },
    valueHeadline: {
      type: String,
      default:
        "I turn technical ideas, visual stories, and growth goals into polished digital experiences.",
    },
    valueBody: {
      type: String,
      default:
        "My work blends engineering, design judgment, content systems, and campaign thinking so every project can look sharp, load fast, and convert across web, social, and search.",
    },
    contactHeading: { type: String, default: "Let's build something great together" },
    footerNote: {
      type: String,
      default: "Available for freelance, partnerships, and digital product work.",
    },
    services: [serviceSchema],
    socialLinks: [socialSchema],
    techIcons: [{ type: String }],
    clientLogos: [{ type: String }],
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model<ISiteContent>(
  "SiteContent",
  siteContentSchema
);
