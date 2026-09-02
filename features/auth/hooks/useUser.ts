import { useQuery } from "@tanstack/react-query";
import { useOnboardingModalStore } from "@/shared/hooks/useOnboardingModalStore";
import React from "react";

export function useUser() {
  const { openOnboardingModal } = useOnboardingModalStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) return { user: null };
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = query.data?.user;

  React.useEffect(() => {
    if (user && user.profile && !user.profile.hasOnboarded) {
      openOnboardingModal();
    }
  }, [user, openOnboardingModal]);

  return {
    user,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
