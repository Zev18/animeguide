"use client";

import { Provider } from "jotai";
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: any) {
  return (
    <NextUIProvider>
      <Provider>{children}</Provider>
    </NextUIProvider>
  );
}
