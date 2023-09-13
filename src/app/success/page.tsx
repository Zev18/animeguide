import React from "react";
import { redirect } from "next/navigation";
import supabaseServer from "@/utils/supabaseServer";
import Login from "@/components/Login";

export default async function Success() {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold">Success</h1>
      <p>{`Congrats, ${
        session.user.user_metadata.name.split(" ")[0]
      }! You're signed in. Want to sign out now?`}</p>
      <Login loggedIn={!!session} />
    </div>
  );
}
