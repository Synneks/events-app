"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Spinner from "@components/Spinner";
import { CalendarDays } from "lucide-react";

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
    </div>
  );
}

export default EventList;
