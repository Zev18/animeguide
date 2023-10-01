"use client";

import React, { useEffect } from "react";
import supabaseComponentClient from "@/utils/supabaseServer";
import { camelize } from "@/utils/utils";
import { redirect } from "next/navigation";
import { getUser } from "@/utils/getUser";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const userData = await getUser();

  // if (userData?.username) {
  //   redirect(`/user/${userData.username}`);
  // }

  const [user] = useAtom(userAtom);
  if (user?.username) redirect(`/user/${user.username}`);

  // Redirect to user's profile page if the profile is fully set up
  // useEffect(() => {
  //   if (user?.username) redirect(`/user/${user.username}`);
  // });

  return (
    <div className="flex justify-center">
      {user ? children : <div>Please log in.</div>}
    </div>
  );
}
