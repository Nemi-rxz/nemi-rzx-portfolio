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
    heroBio: { type: String, default: "" },
    heroNameDisplay: { type: String, default: "NEMI RZX" },
    heroAvatarUrl: { type: String, default: "" },
    valueHeadline: { type: String, default: "" },
    valueBody: { type: String, default: "" },
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
