import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { XCircle } from "lucide-react";
import { useState } from "react";

function ReleaseTicket({ eventId, waitingListId }: { eventId: Id<"events">; waitingListId: Id<"waitingList"> }) {
  const [isReleasing, setIsReleasing] = useState(false);
  const releaseTicket = useMutation(api.waitingList.releaseTicket);

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release this ticket?")) {
      return;
    }

    try {
      setIsReleasing(true);
      await releaseTicket({ eventId, waitingListId });
    } catch (error) {
      console.error("Error when releaseing ticket: ", error);
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <button
      onClick={handleRelease}
      disabled={isReleasing}
      className="idsabled:opacity-50 mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed"
    >
      <XCircle className="h-4 w-4" />
      {isReleasing ? "Releasing ticket..." : "Release Ticket"}
    </button>
  );
}

export default ReleaseTicket;
