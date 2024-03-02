import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { parse as parseCookie } from "cookie";

const AUTH_COOKIE_NAME = "auth-cookie";

export function createFetchContext(options: FetchCreateContextFnOptions) {
  const cookies = parseCookie(options.req.headers.get("cookie") ?? "");

  return {
    authCookie: cookies[AUTH_COOKIE_NAME],
  };
}
