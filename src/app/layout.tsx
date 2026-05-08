import type { Metadata } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Layout from "../components/layout/Layout";
import { AuthProvider } from "../context/AuthContext";
import { AUTH_TOKEN_COOKIE_KEY, AUTH_USER_COOKIE_KEY, type User } from "../api";

export const metadata: Metadata = {
  metadataBase: new URL("https://solecapsule.vercel.app"),
  title: {
    default: "SOLE Capsule | Every Step Protected",
    template: "%s | SOLE Capsule",
  },
  description:
    "SOLE Capsule blends design, sneaker culture, and smart display technology to protect and showcase your collection.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "SOLE Capsule",
    url: "/",
    title: "SOLE Capsule | Every Step Protected",
    description:
      "Smart sneaker display ecosystem with ambient lighting, security, and personalized ownership experiences.",
    images: [
      {
        url: "/frame.png",
        width: 1200,
        height: 630,
        alt: "SOLE Capsule",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLE Capsule | Every Step Protected",
    description:
      "Smart sneaker display ecosystem with ambient lighting, security, and personalized ownership experiences.",
    images: ["/frame.png"],
  },
};

const parseUserCookie = (value?: string): User | null => {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    return JSON.parse(decoded) as User;
  } catch {
    try {
      return JSON.parse(value) as User;
    } catch {
      return null;
    }
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialToken = cookieStore.get(AUTH_TOKEN_COOKIE_KEY)?.value ?? null;
  const initialUser = parseUserCookie(
    cookieStore.get(AUTH_USER_COOKIE_KEY)?.value,
  );

  return (
    <html lang="en">
      <body>
        <AuthProvider initialToken={initialToken} initialUser={initialUser}>
          <NextTopLoader color="#ffffff" showSpinner={false} crawlSpeed={220} height={2} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "13px",
              },
            }}
          />
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
