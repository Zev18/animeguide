"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && <div className={className}>{children}</div>;
}
