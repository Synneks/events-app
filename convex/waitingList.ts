import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { WAITING_LIST_STATUS } from "./constants";

export const getQueuePosition = query({
  args: { eventId: v.id("events"), userId: v.string() },
  handler: async (ctx, { eventId, userId }) => {
    const userEntry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) => q.eq("userId", userId).eq("eventId", eventId))
      .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
      .first();

    if (!userEntry) {
      return null;
    }

    const peopeleInFront = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.and(
          q.lt(q.field("_creationTime"), userEntry._creationTime),
          q.or(
            q.eq(q.field("status"), WAITING_LIST_STATUS.WAITING),
            q.eq(q.field("status"), WAITING_LIST_STATUS.OFFERED)
          )
        )
      )
      .collect()
      .then((people) => people.length);

    return { ...userEntry, position: peopeleInFront + 1 };
  },
});

export const releaseTicket = mutation({
  args: { eventId: v.id("events"), waitingListId: v.id("waitingList") },
  handler: async (ctx, { eventId, waitingListId }) => {
    const waitingListEntry = await ctx.db.get(waitingListId);

    if (!waitingListEntry || waitingListEntry.status !== WAITING_LIST_STATUS.OFFERED) {
      throw new Error("Invalid waiting list entry");
    }

    await ctx.db.patch(waitingListId, { status: WAITING_LIST_STATUS.EXPIRED });

    // TODO: Process the next person in the waiting list
  },
});
