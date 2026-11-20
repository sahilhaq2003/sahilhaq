import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    label: { type: String, default: "" },
    cats: { type: [String], default: [] },
    desc: { type: String, default: "" },
    prob: { type: String, default: "" },
    sol: { type: String, default: "" },
    features: { type: [String], default: [] },
    methods: { type: [String], default: [] },
    arch: { type: String, default: "" },
    contrib: { type: String, default: "" },
    challenges: { type: String, default: "" },
    screenshots: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    github: { type: String, default: "" },
    demo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
