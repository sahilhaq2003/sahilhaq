/**
 * Seeds MongoDB with the portfolio content.
 *   npm run seed          -> replaces content collections (messages are kept)
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Project from "../models/Project.js";
import { Expertise, SkillGroup, Gig, FiverrProject, Profile, Experience, ResearchInterest, Certification } from "../models/Content.js";
import { PROFILE, EXPERTISE, SKILLS, GIGS, FIVERR_PROJECTS, PROJECTS, EXPERIENCE, RESEARCH, CERTIFICATIONS } from "./content.js";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Promise.all([
    Profile.deleteMany({}),
    Expertise.deleteMany({}),
    SkillGroup.deleteMany({}),
    Gig.deleteMany({}),
    FiverrProject.deleteMany({}),
    Project.deleteMany({}),
    Experience.deleteMany({}),
    ResearchInterest.deleteMany({}),
    Certification.deleteMany({}),
  ]);

  await Profile.create(PROFILE);
  await Expertise.insertMany(EXPERTISE);
  await SkillGroup.insertMany(Object.entries(SKILLS).map(([name, items], order) => ({ name, items, order })));
  await Gig.insertMany(GIGS);
  if (FIVERR_PROJECTS.length) await FiverrProject.insertMany(FIVERR_PROJECTS.map((p, order) => ({ ...p, order })));
  await Project.insertMany(PROJECTS);
  await Experience.insertMany(EXPERIENCE);
  await ResearchInterest.insertMany(RESEARCH);
  await Certification.insertMany(CERTIFICATIONS);

  console.log(`✔ Seeded: ${PROJECTS.length} projects, ${EXPERTISE.length} expertise items, ${Object.keys(SKILLS).length} skill groups, ${GIGS.length} gigs`);
}

seed()
  .catch((err) => {
    console.error("✖ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
