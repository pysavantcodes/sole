import type { Metadata } from "next";
import ForgotPassword from "../../screens/ForgotPassword";
import PublicOnlyRoute from "../../routes/PublicOnlyRoute";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Request a secure password reset code for your SOLE Capsule account.",
  alternates: {
    canonical: "/forgot-password",
  },
  openGraph: {
    title: "Forgot Password | SOLE Capsule",
    description: "Request a secure password reset code for your SOLE Capsule account.",
    url: "/forgot-password",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "Forgot Password" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password | SOLE Capsule",
    description: "Request a secure password reset code for your SOLE Capsule account.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <PublicOnlyRoute>
      <ForgotPassword />
    </PublicOnlyRoute>
  );
}
