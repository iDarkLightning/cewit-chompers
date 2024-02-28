import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User } from "@prisma/client";
import { Lucia } from "lucia";
import { pick } from "radash";

import { AUTH_COOKIE_NAME } from "~/shared/constants";
import { prisma } from "../db";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
    name: AUTH_COOKIE_NAME,
  },
  getUserAttributes(databaseUserAttributes) {
    return pick(databaseUserAttributes, ["id", "email", "name", "image"]);
  },
});

export type AuthUser = Pick<User, "id" | "email" | "name" | "image">;

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: User;
  }
}
