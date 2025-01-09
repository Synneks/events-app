"use client";

import EventDetail from "@/components/event/EventDetail";
import EventCard from "@/components/EventCard";
import Spinner from "@/components/Spinner";
import { useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { useParams } from "next/navigation";

function EventPage() {
  const { user } = useUser();
  const params = useParams<{ id: Id<"events"> }>();
  const event = useQuery(api.events.getById, { eventId: params.id });
  const availability = useQuery(api.events.getEventAvailability, { eventId: params.id });

  if (!event || !availability) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Event Image */}
          <div className="relative aspect-[21/9] w-full">
            <div className="flex h-48 items-center justify-center bg-orange-200">This will be an image!</div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left Column */}
              <section className="space-y-8">
                <div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">{event.name}</h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <EventDetail
                    icon={CalendarDays}
                    detailName="Date"
                    detailValue={new Date(event.eventDate).toLocaleDateString()}
                  />
                  <EventDetail icon={MapPin} detailName="Location" detailValue={event.location} />
                  <EventDetail icon={Ticket} detailName="Price" detailValue={`$${event.price.toFixed(2)}`} />
                  <EventDetail
                    icon={Users}
                    detailName="Availability"
                    detailValue={getAvailabilityAsString(availability)}
                  />
                </div>

                <div className="rounded-lg border border-yellow-300 bg-yellow-100 p-6">
                  <h3>Event Information</h3>
                  <ul>
                    <li>Please arrive 30 minutes before the event starts</li>
                    <li>Tickets are non-refundable</li>
                    <li>Age restriction: 18+</li>
                  </ul>
                </div>
              </section>
              {/* Right Column */}
              <section>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={params.id} />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAvailabilityAsString({
  totalTickets,
  purchasedCount,
}: {
  totalTickets: number;
  purchasedCount: number;
}): string {
  if (totalTickets - purchasedCount === 0) {
    return "Sold Out";
  }
  return `${totalTickets - purchasedCount}/${totalTickets} left`;
}

export default EventPage;
