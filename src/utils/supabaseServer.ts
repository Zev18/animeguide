import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function supabaseServerComponentClient<Database>() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}
