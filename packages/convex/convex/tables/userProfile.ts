import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userProfile = defineTable({
  userId: v.id("users"),
  reputationScore: v.number(),
  documentNumber: v.string(), // "PE-127845693"
  nationality: v.string(),
  dateOfBirth: v.string(), // "1992-03-15"
  issueDate: v.string(), // "2022-01-10"
  expiryDate: v.string(), // "2032-01-10"
}).index("by_user", ["userId"]);
