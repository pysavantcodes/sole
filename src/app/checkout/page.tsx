import type { Metadata } from "next";
import Checkout from "../../screens/checkout/Checkout";
import ProtectedRoute from "../../routes/ProtectedRoute";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your SOLE Pod reservation securely with shipping details and live order summary.",
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: "Checkout | SOLE Capsule",
    description:
      "Complete your SOLE Pod reservation securely with shipping details and live order summary.",
    url: "/checkout",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Checkout" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | SOLE Capsule",
    description:
      "Complete your SOLE Pod reservation securely with shipping details and live order summary.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  );
}
