import { Google } from "arctic";
import { z } from "zod";

export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/sign-in/google/callback",
);
export const googleAuthScopes = ["openid", "email", "profile"];

const googleUserInfoResponseSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
  id: z.string(),
});

export const getGoogleUser = async (accessToken: string) => {
  const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 200) throw new Error("failed to get google user");

  const data = await res.json();
  return googleUserInfoResponseSchema.parse(data);
};
