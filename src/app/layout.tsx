import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import supabaseServer from "@/utils/supabaseServer";
import Login from "@/components/Login";
import { camelize } from "@/utils/utils";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  let userData;
  if (user) {
    const userDataResponse = await supabaseServer
      .from("users")
      .select()
      .eq("id", user.id);

    userData = camelize(userDataResponse.data?.[0]);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex items-center justify-between p-10">
            <h1 className="text-xl font-bold">Anime guide</h1>
            <div>
              <Login user={user} userData={userData} />
            </div>
          </div>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
