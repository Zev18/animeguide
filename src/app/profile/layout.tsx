"use client";

import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms";
import { useRouter } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  // Redirect to user's profile page if the profile is fully set up
  useEffect(() => {
    if (user?.username) router.push(`/user/${user.username}`);
  });

  return (
    <div className="flex justify-center">
      {user ? children : <div>Please log in.</div>}
    </div>
  );
}
