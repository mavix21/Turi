import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookings = defineTable({
  userId: v.id("users"),
  tourPackageId: v.id("tourPackages"),

  tourDate: v.number(),
  participants: v.number(),
  totalPricePaid: v.number(),

  status: v.union(
    v.literal("confirmed"),
    v.literal("pending"),
    v.literal("cancelled"),
  ),
}).index("by_user", ["userId"]);
