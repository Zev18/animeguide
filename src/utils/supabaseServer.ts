import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../../database.types";

const supabaseServer = createServerComponentClient<Database>({ cookies });

export default supabaseServer;
