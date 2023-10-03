"use client";

import { userAtom } from "@/atoms";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import React from "react";

export default function UserRouter() {
  const [user] = useAtom(userAtom);

  if (user?.username) {
    redirect(`/user/${user.username}`);
  } else {
    redirect("/");
  }

  return <></>;
}
