import type { Metadata } from "next";
import MyAccount from "../../screens/account/MyAccount";
import ProtectedRoute from "../../routes/ProtectedRoute";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your SOLE Capsule account details, profile information, and personalization settings.",
  alternates: {
    canonical: "/account",
  },
  openGraph: {
    title: "My Account | SOLE Capsule",
    description:
      "Manage your SOLE Capsule account details, profile information, and personalization settings.",
    url: "/account",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "My Account" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Account | SOLE Capsule",
    description:
      "Manage your SOLE Capsule account details, profile information, and personalization settings.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <MyAccount />
    </ProtectedRoute>
  );
}
