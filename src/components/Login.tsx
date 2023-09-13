"use client";

import React from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();

  const signOut = async () => {
    console.log("signing out");
    await supabase.auth.signOut();
    router.refresh();
  };

  const signIn = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    router.refresh();
  };
  return loggedIn ? (
    <button
      className="m-4 rounded-xl border-2 border-black p-4"
      onClick={signOut}
    >
      Sign out
    </button>
  ) : (
    <button
      className="m-4 rounded-xl border-2 border-black p-4"
      onClick={signIn}
    >
      Login
    </button>
  );
}
