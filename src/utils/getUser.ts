import { supabaseServerComponentClient } from "./supabaseServer";
import { camelize } from "./utils";
import User from "@/types/user";

export async function getUser<User>() {
  const supabase = await supabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData;
  if (user) {
    const userDataResponse = await supabase
      .from("users")
      .select()
      .eq("id", user.id);

    userData = camelize(userDataResponse.data?.[0]);
  }

  return userData;
}
