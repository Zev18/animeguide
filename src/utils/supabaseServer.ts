import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../../database.types";
import { createServer } from "http";

export default async function supabaseServerComponentClient<Database>() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}

// export await function supabaseServerComponentClient<Database>() {
//   return createServerComponentClient({ cookies });
// };
