import { Doc } from "./_generated/dataModel";

// Time constants in milliseconds
export const DURATIONS = {
  TICKET_OFFER: 30 * 60 * 1000, // 30 minutes (Minimum Stripe allows for checkout expiry)
} as const;

type WaitinglistStatusType = Doc<"waitingList">["status"];
type WaitinglistStatusRecord = {
  [K in WaitinglistStatusType as Uppercase<K>]: K;
};

// Status types for better type safety
export const WAITING_LIST_STATUS: WaitinglistStatusRecord = {
  WAITING: "waiting",
  OFFERED: "offered",
  PURCHASED: "purchased",
  EXPIRED: "expired",
} as const;

type TicketStatusType = Doc<"tickets">["status"];
type TicketStatusRecord = { [K in TicketStatusType as Uppercase<K>]: K };

export const TICKET_STATUS: TicketStatusRecord = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;
