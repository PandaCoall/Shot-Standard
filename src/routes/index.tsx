import { createFileRoute } from "@tanstack/react-router";
import { ShotDesk } from "@/components/shot-desk";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ShotDesk />;
}
