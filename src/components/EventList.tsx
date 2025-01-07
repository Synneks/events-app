"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Spinner from "@components/Spinner";
import { CalendarDays, Ticket } from "lucide-react";
import EventCard from "./EventCard";

function EventList() {
  const events = useQuery(api.events.get);
  if (!events) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const upcomingEvents = events
    ?.filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);
  const pastEvents = events
    ?.filter((event) => event.eventDate < Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover and book tickets for events
          </p>
        </div>
        <div className="rounded-lg border border-gray-300 px-4 py-2 shadow-md">
          <div className="flex items-center gap-4 text-gray-600">
            <CalendarDays className="h-7 w-7" />
            <span>{upcomingEvents.length} Upcoming Events</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 ? (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="mb-12 rounded-lg bg-gray-100 p-12 text-center">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mb-1 mt-2 text-lg font-medium text-gray-900">
            No upcoming events
          </h2>
          <p className="to-gray-600">Come back later for new events</p>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <h2>Past Events</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default EventList;
