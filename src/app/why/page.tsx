import type { Metadata } from "next";
import Why from "../../screens/Why";

export const metadata: Metadata = {
  title: "Why Sole Capsule",
  description:
    "Learn why SOLE Capsule exists: the gap between sneaker culture and protected display, and the shift toward intelligent preservation.",
  alternates: {
    canonical: "/why",
  },
  openGraph: {
    title: "Why Sole Capsule",
    description:
      "The problem, the gap, and the shift driving SOLE Capsule’s intelligent sneaker display experience.",
    url: "/why",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "Why SOLE Capsule" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Sole Capsule",
    description:
      "The problem, the gap, and the shift driving SOLE Capsule’s intelligent sneaker display experience.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return <Why />;
}
