"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

function SyncUserWithConvex() {
  const { user } = useUser();

  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) {
      return;
    }
    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: user.fullName ?? "",
          email: user.primaryEmailAddress?.emailAddress ?? "",
        });
      } catch (error) {
        console.error("Failed to sync user with Convex", error);
      }
    };

    syncUser();
  }, [user, updateUser]);

  return null;
}

export default SyncUserWithConvex;
