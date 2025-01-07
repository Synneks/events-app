"use client";

import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CalendarDays, MapPin, StarIcon } from "lucide-react";

function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });

  if (!event) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event.userId;

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white-100 cursor-pointer rounded-xl border border-yellow-400 shadow-md transition duration-200 ease-in hover:shadow-lg ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="flex h-48 items-center justify-center bg-orange-200">
        This will be an image!
      </div>

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
          <div className="ml-4 flex flex-col items-end justify-center">
            <span
              className={`rounded-full px-4 py-1.5 font-semibold ${isPastEvent ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}
            >
              ${event.price.toFixed(2)}
            </span>
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

          <p className="mt-4 line-clamp-2 text-sm text-gray-600">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
