import type { Metadata } from "next";
import ResetPassword from "../../screens/ResetPassword";
import PublicOnlyRoute from "../../routes/PublicOnlyRoute";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Verify your reset code and set a new password for your SOLE Capsule account.",
  alternates: {
    canonical: "/reset-password",
  },
  openGraph: {
    title: "Reset Password | SOLE Capsule",
    description:
      "Verify your reset code and set a new password for your SOLE Capsule account.",
    url: "/reset-password",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "Reset Password" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | SOLE Capsule",
    description:
      "Verify your reset code and set a new password for your SOLE Capsule account.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <PublicOnlyRoute>
      <ResetPassword />
    </PublicOnlyRoute>
  );
}
