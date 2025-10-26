import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getUserIdentity } from "./authUtils";

export const createUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.address))
      .first();

    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      walletAddress: args.address,
      name: "Traveler #" + Math.floor(Math.random() * 1000000),
      reputationScore: 0,
    });

    const userProfileId = await ctx.db.insert("userProfile", {
      userId: userId,
      documentNumber: "76543210",
      dateOfBirth: new Date("1990-01-01").toISOString(),
      issueDate: new Date().toISOString(),
      nationality: "Peruana",
      reputationScore: 0,
      expiryDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ).toISOString(),
    });

    return userId;
  },
});

export const getMyProfile = query({
  handler: async (ctx) => {
    const userId = await getUserIdentity(ctx);
    const user = await ctx.db.get(userId);

    const userProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!user || !userProfile) {
      return null;
    }

    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const verifiedStamps = checkIns.filter(
      (checkIn) => checkIn.onchainStatus.status === "synced",
    ).length;

    return {
      id: userId,
      name: user.name,
      imageUrl: user.imageUrl,
      profile: {
        documentNumber: userProfile.documentNumber,
        dateOfBirth: userProfile.dateOfBirth,
        issueDate: userProfile.issueDate,
        nationality: userProfile.nationality,
        reputationScore: userProfile.reputationScore,
        expiryDate: userProfile.expiryDate,
      },
      statistics: {
        totalCheckIns: checkIns.length || 0,
        totalVerifiedStamps: verifiedStamps || 0,
        totalScorePercentage: (verifiedStamps / checkIns.length) * 100,
      },
    };
  },
});

/**
 * Increment user's reputation score
 */
export const incrementReputationScore = mutation({
  args: {
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update userProfile reputation score
    const userProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const newScore = (userProfile.reputationScore ?? 0) + args.points;

    await ctx.db.patch(userProfile._id, {
      reputationScore: newScore,
    });

    return newScore;
  },
});
