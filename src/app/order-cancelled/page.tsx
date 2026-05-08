import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Cancelled",
  description:
    "Your SOLE Pod checkout was cancelled. No payment was taken — you can try again any time.",
  alternates: {
    canonical: "/order-cancelled",
  },
  openGraph: {
    title: "Order Cancelled | SOLE Capsule",
    description:
      "Your SOLE Pod checkout was cancelled. No payment was taken — you can try again any time.",
    url: "/order-cancelled",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "Order cancelled" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Cancelled | SOLE Capsule",
    description:
      "Your SOLE Pod checkout was cancelled. No payment was taken — you can try again any time.",
    images: ["/frame.png"],
  },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderCancelledPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const rawSessionId = params.session_id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  return (
    <section className="bg-[#121212] px-4 py-12 sm:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#191919] p-6 sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#171717]">
          <span className="text-xl">✕</span>
        </div>
        <h1 className="text-center font-ClashGrotesk-Semibold text-3xl uppercase">
          Order Cancelled
        </h1>
        <p className="mt-2 text-center text-sm text-white/65">
          Your checkout was cancelled and no payment was taken. Your reservation
          has not been confirmed.
        </p>

        {sessionId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-[#121212] p-4">
            <p className="text-xs uppercase text-white/45">Checkout Session</p>
            <p className="mt-1 break-all text-sm text-white/85">{sessionId}</p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/pod"
            className="rounded-full bg-white px-5 py-3 text-center text-sm text-black"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/30 px-5 py-3 text-center text-sm"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@solecapsule.com"
            className="underline underline-offset-2 hover:text-white/70"
          >
            support@solecapsule.com
          </a>
        </p>
      </div>
    </section>
  );
}
