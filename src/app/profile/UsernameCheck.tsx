import { Spinner } from "@nextui-org/react";
import React from "react";
import { CheckCircle, X } from "react-feather";

export default function UsernameCheck({ status }: { status: string }) {
  function getComponent(status: string) {
    switch (status) {
      case "loading":
        return <Spinner size="sm" />;
      case "true":
        return <CheckCircle className="text-success" />;
      case "false":
        return <X className="text-danger" />;
      default:
        return <div />;
    }
  }
  return getComponent(status);
}
