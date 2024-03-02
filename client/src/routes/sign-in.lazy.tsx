import { createLazyFileRoute } from "@tanstack/react-router";

const createAuthMethodUrl = (
  provider: string,
  redirectPathname?: string,
  token?: string,
) => {
  return `${
    import.meta.env.VITE_PUBLIC_APP_URL
  }/auth/sign-in/${provider}?${new URLSearchParams({
    redirect: `${import.meta.env.VITE_PUBLIC_APP_URL}${redirectPathname || "/"}`,
    token: token || "",
  }).toString()}`;
};

export const Route = createLazyFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  const searchParams = Route.useSearch();

  return (
    <div>
      Sign in
      <a
        href={createAuthMethodUrl(
          "google",
          searchParams.callback,
          searchParams.token,
        )}
      >
        Sign In
      </a>
    </div>
  );
}
