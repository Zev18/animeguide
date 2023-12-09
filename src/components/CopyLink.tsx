"use client";

import { usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { Link } from "react-feather";
import React, { useState, useEffect } from "react";

export default function CopyLink() {
  const [pathname, setPathname] = useState("");
  const slug = usePathname();

  useEffect(() => {
    if (window && !pathname) {
      setPathname(window.location.origin + slug);
    }
  }, [pathname, slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pathname);
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
  };

  return (
    <Tooltip content="Copy link" closeDelay={0} delay={300} size="sm">
      <Button
        isIconOnly
        className="opacity-50 hover:opacity-100"
        variant="light"
        startContent={<Link size={20} />}
        onClick={copyToClipboard}
      />
    </Tooltip>
  );
}
