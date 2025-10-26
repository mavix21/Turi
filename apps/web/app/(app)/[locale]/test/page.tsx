"use client";

import { useQuery } from "convex/react";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";

export default function TestPage() {
  const viewInfo = useQuery(api.debug.viewerInfo);
  console.log("Viewer Info:", viewInfo);
  return <Button>View Infor</Button>;
}
