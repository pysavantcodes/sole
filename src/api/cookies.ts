import Cookies from "js-cookie";
import {
  AUTH_COOKIE_DAYS,
  AUTH_TOKEN_COOKIE_KEY,
  AUTH_USER_COOKIE_KEY,
} from "./constants";
import type { User } from "./types";

export const authCookies = {
  getToken: () => Cookies.get(AUTH_TOKEN_COOKIE_KEY) ?? null,

  setToken: (token: string) => {
    Cookies.set(AUTH_TOKEN_COOKIE_KEY, token, {
      expires: AUTH_COOKIE_DAYS,
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
  },

  clearToken: () => Cookies.remove(AUTH_TOKEN_COOKIE_KEY),

  getUser: (): User | null => {
    const raw = Cookies.get(AUTH_USER_COOKIE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User) => {
    Cookies.set(AUTH_USER_COOKIE_KEY, JSON.stringify(user), {
      expires: AUTH_COOKIE_DAYS,
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
  },

  clearUser: () => Cookies.remove(AUTH_USER_COOKIE_KEY),

  clearAll: () => {
    Cookies.remove(AUTH_TOKEN_COOKIE_KEY);
    Cookies.remove(AUTH_USER_COOKIE_KEY);
  },
};
