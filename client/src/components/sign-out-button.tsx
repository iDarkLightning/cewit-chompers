import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useSignOut = (opts: UseMutationOptions = {}) => {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_APP_URL}/auth/sign-out`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }
    },
    onSuccess: () => {
      window.location.reload();
    },
    ...opts,
  });
};

export const SignOutButton: React.FC = () => {
  const signOut = useSignOut();

  return (
    <button
      onClick={() => {
        signOut.mutate();
      }}
    >
      Sign Out
    </button>
  );
};
