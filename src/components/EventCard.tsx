"use client";

import { useUser } from "@clerk/nextjs";
import { Id } from "@convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  CalendarDays,
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import { WAITING_LIST_STATUS } from "@convex/constants";
import PurchaseTicket from "./PurchaseTicket";

function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event.userId;

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== WAITING_LIST_STATUS.WAITING) {
      return null;
    }

    if (availability.purchasedCount >= availability.totalTickets) {
      return (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center">
            <Ticket className="mr-2 h-4 w-4 text-gray-600" />
            <span className="text-gray-600">Event is sold out</span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      <div className="flex flex-col items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3 lg:flex-row">
        <div className="flex items-center">
          <CircleArrowRight className="text-red-500-mr-2 h-4 w-4" />
          <span className="text-red-700">You&apos;re next in line! (Queue position: {queuePosition.position})</span>
        </div>
        <div className="flex items-center">
          <LoaderCircle className="mr-1 h-4 w-4 animate-spin to-red-500" />
          <span className="text-sm text-red-600">Waiting for ticket</span>
        </div>
      </div>;
    }

    return (
      <div>
        <div>
          <LoaderCircle className="mr-1 h-4 w-4 animate-spin to-amber-500" />
          <span className="text-sm text-amber-600">Queue position</span>
        </div>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">#{queuePosition.position}</span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) {
      return null;
    }

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={() => router.push(`/seller/event/${eventId}/edit`)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-600 shadow-md transition duration-200 ease-in hover:bg-gray-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Event
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-100 p-3">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-600" />
            <span className="text-green-700">You have a ticket!</span>
          </div>
          <button onClick={() => router.push(`/tickets/${userTicket._id}`)}>View your ticket</button>
        </div>
      );
    }

    console.log(queuePosition);

    if (queuePosition) {
      return (
        <div>
          {queuePosition.status === WAITING_LIST_STATUS.OFFERED && <PurchaseTicket eventId={eventId} />}
          {renderQueuePosition()}
          {queuePosition.status === WAITING_LIST_STATUS.EXPIRED && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <span className="flex items-center text-red-700">
                <XCircle className="h-4 w-4" /> Offer expired
              </span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white-100 cursor-pointer rounded-xl border border-yellow-400 shadow-md transition duration-200 ease-in hover:shadow-lg ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="flex h-48 items-center justify-center bg-orange-200">This will be an image!</div>

      <div className={`p-4`}>
        <div className="flex justify-between">
          {/* Event main details */}
          <div className="flex flex-col items-start gap-2">
            {isEventOwner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                <StarIcon className="h-3 w-3" /> Your Event
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>

            {isPastEvent && (
              <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs text-gray-900">
                Past Event
              </span>
            )}
          </div>

          {/* Price */}
          <div className="ml-4 flex flex-col items-end justify-center gap-2">
            <span
              className={`rounded-full px-4 py-1.5 font-semibold ${isPastEvent ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}
            >
              ${event.price.toFixed(2)}
            </span>
            {availability.purchasedCount >= availability.totalTickets && (
              <span className="text-nowrap rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Event minor details */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}
              {isPastEvent && " (Ended)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="mr-2 h-4 w-4" />
            <span>
              {availability.totalTickets - availability.purchasedCount}/{availability.totalTickets} tickets left
              {!isPastEvent && availability.activeOffers > 0 && (
                <span className="ml-2 text-sm text-amber-600">
                  ({availability.activeOffers}
                  {availability.activeOffers === 1 ? " person" : " people"} trying to buy)
                </span>
              )}
            </span>
          </div>

          <p className="mt-4 line-clamp-2 text-sm text-gray-600">{event.description}</p>
          <div onClick={(e) => e.stopPropagation()}>{!isPastEvent && renderTicketStatus()}</div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
