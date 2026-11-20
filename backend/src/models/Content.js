import mongoose from "mongoose";

/**
 * Small content collections used by the portfolio sections.
 * Each is ordered by `order` so you can rearrange items in the database.
 */

const opts = { timestamps: true };

export const Expertise = mongoose.model(
  "Expertise",
  new mongoose.Schema(
    {
      icon: { type: String, default: "✦" },
      title: { type: String, required: true },
      desc: { type: String, default: "" },
      tags: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "expertise"
);

export const SkillGroup = mongoose.model(
  "SkillGroup",
  new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
      items: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "skillgroups"
);

export const Gig = mongoose.model(
  "Gig",
  new mongoose.Schema(
    {
      icon: { type: String, default: "✦" },
      title: { type: String, required: true },
      desc: { type: String, default: "" },
      tags: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "gigs"
);

export const FiverrProject = mongoose.model(
  "FiverrProject",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      desc: { type: String, default: "" },
      tech: { type: [String], default: [] },
      year: { type: String, default: "" },
      url: { type: String, default: "" },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "fiverrprojects"
);

export const Experience = mongoose.model(
  "Experience",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      tagline: { type: String, default: "" },
      dates: { type: String, default: "" },
      description: { type: String, default: "" },
      bullets: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "experiences"
);

export const ResearchInterest = mongoose.model(
  "ResearchInterest",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "researchinterests"
);

export const Certification = mongoose.model(
  "Certification",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      issuer: { type: String, required: true },
      issued: { type: String, default: "" },
      credentialId: { type: String, default: "" },
      credentialUrl: { type: String, default: "" },
      skills: { type: [String], default: [] },
      order: { type: Number, default: 0 },
    },
    opts
  ),
  "certifications"
);

/** Single document holding links / profile settings & site-wide text content. */
export const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema(
    {
      key: { type: String, default: "main", unique: true },
      github: { type: String, default: "" },
      email: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      fiverr: { type: String, default: "" },
      instagram: { type: String, default: "" },
      x: { type: String, default: "" },
      categories: { type: [String], default: [] },
      portrait: { type: String, default: "" },
      hero: {
        badge: { type: String, default: "" },
        greeting: { type: String, default: "" },
        name: { type: String, default: "" },
        roles: { type: [String], default: [] },
        subtitle: { type: String, default: "" },
      },
      about: {
        paragraphs: { type: [String], default: [] },
        interests: { type: [String], default: [] },
        learning: { type: [String], default: [] },
      },
      education: {
        degree: { type: String, default: "" },
        school: { type: String, default: "" },
        dates: { type: String, default: "" },
        description: { type: String, default: "" },
      },
      fiverrSteps: {
        type: [
          {
            num: { type: String, default: "" },
            title: { type: String, default: "" },
            desc: { type: String, default: "" },
          },
        ],
        default: [],
      },
      footer: {
        tagline: { type: String, default: "" },
      },
    },
    opts
  ),
  "profile"
);
