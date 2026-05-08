import type { Metadata } from "next";
import Login from "../../screens/Login";
import PublicOnlyRoute from "../../routes/PublicOnlyRoute";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your SOLE Capsule account to manage orders, profile details, and checkout your reservation.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Login | SOLE Capsule",
    description:
      "Sign in to your SOLE Capsule account to manage orders, profile details, and checkout your reservation.",
    url: "/login",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Capsule Login" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | SOLE Capsule",
    description:
      "Sign in to your SOLE Capsule account to manage orders, profile details, and checkout your reservation.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <PublicOnlyRoute>
      <Login />
    </PublicOnlyRoute>
  );
}
