import { defineTable } from "convex/server";
import { v } from "convex/values";

export const companies = defineTable({
  name: v.string(),
  logoUrl: v.optional(v.string()),
}).index("by_name", ["name"]);
