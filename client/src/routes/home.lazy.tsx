import { createLazyFileRoute } from "@tanstack/react-router";

import { Welcome } from "../components/welcome";

export const Route = createLazyFileRoute("/home")({
  component: Home,
});

function Home() {
  return (
    <div className="align-items-center flex h-screen flex-col justify-center">
      <Welcome />
    </div>
  );
}
