import type { Metadata } from "next";
import Orders from "../../../screens/account/Orders";
import ProtectedRoute from "../../../routes/ProtectedRoute";

export const metadata: Metadata = {
  title: "My Orders",
  description:
    "Track your SOLE Capsule orders, view reservation history, and monitor delivery progress.",
  alternates: {
    canonical: "/account/orders",
  },
  openGraph: {
    title: "My Orders | SOLE Capsule",
    description:
      "Track your SOLE Capsule orders, view reservation history, and monitor delivery progress.",
    url: "/account/orders",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "My Orders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | SOLE Capsule",
    description:
      "Track your SOLE Capsule orders, view reservation history, and monitor delivery progress.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
}
