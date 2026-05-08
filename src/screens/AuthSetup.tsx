"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import { authAPI } from "../api";
import { authCookies } from "../api/cookies";
import { useAuth } from "../context/AuthContext";
import type { User } from "../api";

type Status = "processing" | "success" | "error";

const decodePayload = (raw: string | null): Partial<User> | null => {
  if (!raw) return null;
  try {
    const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    const decoded =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    const candidate =
      (parsed.user as Record<string, unknown> | undefined) ??
      (parsed.data as Record<string, unknown> | undefined) ??
      parsed;
    if (
      candidate &&
      typeof candidate === "object" &&
      "email" in candidate &&
      "id" in candidate
    ) {
      return candidate as Partial<User>;
    }
    return null;
  } catch {
    return null;
  }
};

const AuthSetup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [status, setStatus] = useState<Status>("processing");
  const [provider, setProvider] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(window.location.search);

      const get = (key: string) =>
        hashParams.get(key) ?? queryParams.get(key) ?? null;

      const responseStatus = get("status");
      const accessToken = get("access_token");
      const providerName = get("provider") ?? "";
      const errorParam = get("error") ?? get("message");

      setProvider(providerName);

      if (responseStatus && responseStatus !== "success") {
        setStatus("error");
        setErrorMessage(
          errorParam || `Sign-in with ${providerName || "provider"} was cancelled or failed.`,
        );
        return;
      }

      if (!accessToken) {
        setStatus("error");
        setErrorMessage(
          errorParam ||
            "Sign-in did not return a token. Please try again.",
        );
        return;
      }

      try {
        // Stage the token in the cookie so apiClient's Bearer interceptor
        // includes it on the /details call below.
        authCookies.setToken(accessToken);
        const payloadUser = decodePayload(get("payload"));

        let user: User | null = null;
        if (payloadUser && payloadUser.id && payloadUser.email) {
          user = {
            id: Number(payloadUser.id),
            name: String(payloadUser.name ?? ""),
            email: String(payloadUser.email),
            ...payloadUser,
          } as User;
        }

        if (!user) {
          const detailsResponse = await authAPI.getDetails();
          user = detailsResponse?.data?.user ?? null;
        }

        if (!user) {
          throw new Error("Unable to load your profile after sign-in.");
        }

        setSession(accessToken, user);
        setStatus("success");

        const from = searchParams.get("from");
        const target = from && from.startsWith("/") ? from : "/account";

        // Strip auth params from the URL before redirecting
        window.history.replaceState(null, "", window.location.pathname);
        router.replace(target);
        router.refresh();
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "We couldn't complete your sign-in. Please try again.",
        );
      }
    };

    void run();
  }, [router, searchParams, setSession]);

  return (
    <section className="flex min-h-[72vh] items-center justify-center bg-[#121212] px-4 py-12">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#191919] p-8 text-center">
        {status === "processing" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#171717]">
              <FiLoader className="animate-spin text-2xl text-white/85" />
            </div>
            <h1 className="font-ClashGrotesk-Semibold text-2xl uppercase">
              Signing you in
            </h1>
            <p className="mt-2 text-sm text-white/55">
              {provider
                ? `Finishing your ${provider} sign-in…`
                : "Finalizing your session…"}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
              <span className="text-2xl text-emerald-300">✓</span>
            </div>
            <h1 className="font-ClashGrotesk-Semibold text-2xl uppercase">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Redirecting to your account…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
              <span className="text-2xl text-red-300">!</span>
            </div>
            <h1 className="font-ClashGrotesk-Semibold text-2xl uppercase">
              Sign-in failed
            </h1>
            <p className="mt-2 text-sm text-white/55">
              {errorMessage}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-3 text-center text-sm text-black"
              >
                Back to sign in
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/30 px-5 py-3 text-center text-sm"
              >
                Home
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthSetup;
