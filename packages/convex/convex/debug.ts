import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { getUserIdentity } from "./authUtils";

export const viewerInfo = query({
  args: {},
  handler: async (ctx) => {
    // Assuming this query is only called after authentication
    const id = await getUserIdentity(ctx);
    return await ctx.db.get(id);
  },
});
