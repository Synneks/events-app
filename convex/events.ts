import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.neq(q.field("is_cancelled"), true))
      .collect();
    return events;
  },
});
