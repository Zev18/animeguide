"use client";

import placeholder from "@/assets/images/placeholder.jpg";
import { userAtom as userAtomTemplate } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login({
  user,
  userData,
}: {
  user: any;
  userData: any;
}) {
  const router = useRouter();
  const [userAtom, setUserAtom] = useAtom(userAtomTemplate);
  const [firstTime, setFirstTime] = useState(true);

  if (!userAtom && userData && firstTime) {
    setUserAtom(userData);
    setFirstTime(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserAtom(null);
    router.refresh();
  };

  const signIn = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      if (!data?.url) throw new Error("No url returned");
      router.push(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  return user ? (
    <Dropdown>
      <DropdownTrigger>
        <div className="relative h-12 w-12">
          <Image
            src={userData.avatarUrl ? userData.avatarUrl : placeholder}
            alt="profile Icon"
            fill
            className="cursor-pointer rounded-full border-4 border-slate-700 object-contain"
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions">
        <DropdownItem
          onClick={() =>
            router.push(
              userData.username ? `/user/${userData.username}` : "/profile",
            )
          }
        >
          {userData.username ? "Profile" : "Set Up Profile"}
        </DropdownItem>
        <DropdownItem onClick={signOut}>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <button
      className="rounded-xl border-2 border-black px-4 py-2"
      onClick={signIn}
    >
      Login
    </button>
  );
}
