import { AuthTokenGetter, AuthTokenSetter } from "core/model";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

const ACCESS_TOKEN_COOKIE_NAME = "ACCESS_TOKEN";

export const getAccessToken: AuthTokenGetter = async () => {
  const cookieStore = await cookies();
  const token = (cookieStore as unknown as UnsafeUnwrappedCookies).get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  return token || null;
};

export const setAccessToken: AuthTokenSetter = async (token: string | null) => {
  const cookieStore = await cookies();
  if (token) {
    (cookieStore as unknown as UnsafeUnwrappedCookies).set(ACCESS_TOKEN_COOKIE_NAME, token, { httpOnly: true });
  } else {
    (cookieStore as unknown as UnsafeUnwrappedCookies).delete(ACCESS_TOKEN_COOKIE_NAME);
  }
};
