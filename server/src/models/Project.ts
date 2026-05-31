import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
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

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    tools: [{ type: String }],
    imageUrl: { type: String, default: "" },
    projectUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
