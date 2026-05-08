import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Successful",
  description:
    "Your SOLE Pod reservation was successful. Track your order and delivery status from your account.",
  alternates: {
    canonical: "/order-successful",
  },
  openGraph: {
    title: "Order Successful | SOLE Capsule",
    description:
      "Your SOLE Pod reservation was successful. Track your order and delivery status from your account.",
    url: "/order-successful",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "Order successful" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Successful | SOLE Capsule",
    description:
      "Your SOLE Pod reservation was successful. Track your order and delivery status from your account.",
    images: ["/frame.png"],
  },
};

export default function OrderSuccessfulPage() {
  return (
    <section className="bg-[#121212] px-4 py-12 sm:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#191919] p-6 sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#171717]">
          <span className="text-xl">✓</span>
        </div>
        <h1 className="text-center font-ClashGrotesk-Semibold text-3xl uppercase">
          Order Successful
        </h1>
        <p className="mt-2 text-center text-sm text-white/65">
          Your Sole Pod reservation has been confirmed.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="rounded-full bg-white px-5 py-3 text-center text-sm text-black"
          >
            View My Orders
          </Link>
          <Link
            href="/pod"
            className="rounded-full border border-white/30 px-5 py-3 text-center text-sm"
          >
            Back to Pod
          </Link>
        </div>
      </div>
    </section>
  );
}
