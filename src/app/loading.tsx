import React from "react";
import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div className="flex h-full w-full justify-center">
      <Spinner />
    </div>
  );
}
