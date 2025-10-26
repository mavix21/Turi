import { Id } from "./_generated/dataModel";
import { GenericCtx } from "./_generated/server";

export const getUserIdentity = async (ctx: GenericCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Must be logged in to access data");
  }
  return identity.subject as Id<"users">;
};
