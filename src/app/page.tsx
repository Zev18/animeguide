import { redirect } from "next/navigation";
import supabaseServer from "@/utils/supabaseServer";
import Login from "@/components/Login";

export default async function Home() {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (session) {
    redirect("/success");
  }

  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Anime Guide</h1>
      <p>Please login.</p>
      <Login loggedIn={!!session} />
    </main>
  );
}
