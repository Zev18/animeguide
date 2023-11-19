"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "jotai";
import { useRouter } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Provider>
      {/* @ts-ignore*/}
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </Provider>
  );
}
