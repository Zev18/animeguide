import React from "react";

export default function Page({ params }: { params: { id: string } }) {
  return <div>Editing guide #{params.id}</div>;
}
