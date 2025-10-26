import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { getUserIdentity } from "./authUtils";

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    documentNumber: v.optional(v.string()),
    nationality: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    // Update user table
    if (args.name) {
      await ctx.db.patch(userId, {
        name: args.name,
      });
    }

    // Update userProfile table
    const userProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const updates: Record<string, string> = {};
    if (args.documentNumber) updates.documentNumber = args.documentNumber;
    if (args.nationality) updates.nationality = args.nationality;
    if (args.dateOfBirth) updates.dateOfBirth = args.dateOfBirth;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userProfile._id, updates);
    }

    return { success: true };
  },
});
