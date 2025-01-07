import { v } from "convex/values";
import { query } from "./_generated/server";
import { TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";

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

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    return event;
  },
});

export const getEventAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const purchasedTicketsCount = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), TICKET_STATUS.VALID),
          q.eq(q.field("status"), TICKET_STATUS.USED)
        )
      )
      .collect()
      .then((tickets) => tickets.length);

    const now = Date.now();
    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) =>
        q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then(
        (offers) =>
          offers.filter((offer) => offer.offerExpiresAt ?? 0 > now).length
      );
    const totalReserved = purchasedTicketsCount + activeOffers;

    return {
      idSoldOut: totalReserved >= event.totalTickets,
      totalTickets: event.totalTickets,
      purchasedCount: purchasedTicketsCount,
      activeOffers,
      remainingTickets: Math.max(0, event.totalTickets - totalReserved),
    };
  },
});
