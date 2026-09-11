import { useQuery } from "@tanstack/react-query";
import { useOnboardingModalStore } from "@/shared/hooks/useOnboardingModalStore";
import React from "react";

export interface UserData {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string;
  profile?: {
    fullName: string;
    gradeLevel: string;
    track: string;
    school: string;
    hasOnboarded: boolean;
  } | null;
}

export function useUser() {
  const { openOnboardingModal } = useOnboardingModalStore();

  const query = useQuery<{ user: UserData | null }>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) return { user: null };
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = query.data?.user ?? null;

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
