"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "jotai";

export default function Providers({ children }: any) {
  return (
    <Provider>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}
