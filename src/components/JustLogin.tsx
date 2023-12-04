"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import Google from "@/assets/vector/google";

export default function JustLogin({ redirect }: { redirect?: string | null }) {
  const router = useRouter();

  const signIn = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      if (!redirect) {
        router.push("/");
      } else {
        router.push(redirect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={signIn}
      startContent={<Google />}
      variant="ghost"
      color="primary"
      className="max-w-fit"
    >
      Sign in with Google
    </Button>
  );
}
