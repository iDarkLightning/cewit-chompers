import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/home")({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-screen flex-col justify-center gap-1">
        <div className="my-4">
        <h1 className="text-4xl font-semibold animate-fade-right">Welcome to Choosy Chompers</h1>
        <p className="font-medium text-neutral-600 animate-fade-up">
          Choose the foods you'd like to eat.
        </p>
        <video id="video" loop autoplay="" muted className = "rounded-[100px] block">
          <source src="/public/chompers.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}