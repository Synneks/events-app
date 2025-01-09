"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useEffect, useState } from "react";
import { WAITING_LIST_STATUS } from "@convex/constants";
import { Ticket } from "lucide-react";
import ReleaseTicket from "@components/ReleaseTicket";

function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = offerExpiresAt < Date.now();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const timeDiff = offerExpiresAt - Date.now();
      const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
      const hours = Math.floor(timeDiff / 1000 / 60 / 60);
      const minutes = Math.floor(timeDiff / 1000 / 60);
      const seconds = Math.floor((timeDiff / 1000) % 60);

      if (days > 0) {
        setTimeRemaining(`${days} day${days === 1 ? "" : "s"}`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours} hour${hours === 1 ? "" : "s"}`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}minute${minutes === 1 ? "" : "s"} ${seconds} second${seconds === 1 ? "" : "s"}`);
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  // Stripe checkout
  const handlePurchase = async () => {};

  if (!user || !queuePosition || queuePosition.status !== WAITING_LIST_STATUS.OFFERED) {
    return null;
  }

  return (
    <div className="rounded-xl border border-yellow-400 p-6 shadow-lg">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300">
                <Ticket className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ticket Reserved</h3>
                <p className="text-sm text-gray-500">Expires in {timeRemaining}</p>
              </div>
            </div>
            <div className="text-sm leading-relaxed text-gray-600">
              A ticket has been reserved for you. Complete the purchase before the timer expires to secure your ticket.
            </div>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          disabled={isLoading || isExpired}
          className="w-full transform rounded-lg border border-red-700 bg-gradient-to-br from-yellow-300 to-amber-500 px-8 py-4 text-lg font-bold shadow-md transition-all duration-200 ease-in hover:scale-105 hover:from-yellow-400 hover:to-amber-600 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
        >
          {isLoading ? "Redirecting to checkout..." : "Purchase Ticket Now"}
        </button>
        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}

export default PurchaseTicket;
