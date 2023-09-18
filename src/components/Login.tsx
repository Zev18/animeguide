"use client";

import React, { useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import placeholder from "@/assets/images/placeholder.jpg";
import { useAtom } from "jotai";
import { userAtom as userAtomTemplate } from "@/atoms";

export default function Login({
  user,
  userData,
}: {
  user: any;
  userData: any;
}) {
  const router = useRouter();
  const [userAtom, setUserAtom] = useAtom(userAtomTemplate);

  useEffect(() => {
    setUserAtom(userData);
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserAtom(null);
    router.refresh();
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    router.refresh();
  };

  return user ? (
    <Menu as="div" className="relative">
      <Menu.Button>
        <div className="relative h-12 w-12">
          <Image
            src={userData.avatarUrl ? userData.avatarUrl : placeholder}
            alt="profile Icon"
            fill
            className="rounded-full border-4 border-slate-700 object-contain"
          />
        </div>
      </Menu.Button>
      <Menu.Items className="absolute right-0 min-w-max rounded-xl border-2 border-slate-400 p-4">
        <Menu.Item>
          <button onClick={signOut}>Sign out</button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  ) : (
    <button
      className="rounded-xl border-2 border-black px-4 py-2"
      onClick={signIn}
    >
      Login
    </button>
  );
}
