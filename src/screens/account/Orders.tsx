"use client";

import { useEffect, useMemo, useState } from "react";
import { PiMedalLight } from "react-icons/pi";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import AccountLayout from "../../components/sections/account/AccountLayout";
import { ordersAPI, type UserOrder } from "../../api";

type Step = "ordered" | "confirmed" | "out_for_delivery" | "delivered";

const steps: { key: Step; label: string }[] = [
  { key: "ordered", label: "Ordered" },
  { key: "confirmed", label: "Confirmed" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const stepIndex = (step: Step) => steps.findIndex((s) => s.key === step);

const formatPlacedAt = (value?: string) => {
  if (!value) return "Order placed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Order placed";
  const formatted = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  return `Placed ${formatted}`;
};

const Orders = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setError(null);
        const response = await ordersAPI.getUserOrders(10, page);
        setOrders(response.data.orders ?? []);
        setTotalPages(Math.max(1, Number(response.data.total_page ?? 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [page]);

  const formattedOrders = useMemo(
    () =>
      orders
        .filter((order) => (order.status ?? "").toLowerCase() === "paid")
        .map((order) => ({
          id: `#${order.reservation_number}`,
          placedAt: formatPlacedAt(order.created_at),
          title: String(order.pod_type || "Sole Pod")
            .replace(/-/g, " ")
            .toUpperCase(),
          color: order.finish || "—",
          scent: order.scent || "—",
          price: `$${Number(order.total_amount || 0).toFixed(2)}`,
          status: (steps.some((s) => s.key === (order.delivery_status as Step))
            ? (order.delivery_status as Step)
            : "ordered") as Step,
          trackingNumber: order.metadata?.tracking_number?.trim() || "",
          trackingUrl: order.metadata?.tracking_url?.trim() || "",
        })),
    [orders],
  );

  const copyTracking = async (value: string) => {
    if (!value || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* noop */
    }
  };

  return (
    <AccountLayout
      title="ORDERS"
      subtitle="View your order history and check the delivery status for items"
      activeTab="orders"
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((key) => (
            <div key={key} className="rounded-2xl bg-[#191919] p-6">
              <div className="mb-4 h-4 w-40 animate-pulse rounded bg-white/10" />
              <div className="grid gap-5 lg:grid-cols-[170px_1fr_200px]">
                <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
                <div className="space-y-3">
                  <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-28 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-[#191919] p-6 text-sm text-red-300">
          {error}
        </div>
      ) : formattedOrders.length === 0 ? (
        <div className="rounded-2xl bg-[#191919] p-6 text-sm text-white/70">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {formattedOrders.map((order) => {
          const activeStep = stepIndex(order.status);
          return (
            <article key={order.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-ClashGrotesk-Semibold text-lg sm:text-xl uppercase">
                  {order.id}
                </h3>
                <span className="text-xs uppercase text-white/45">
                  {order.placedAt}
                </span>
              </div>

              <div className="rounded-2xl bg-[#191919] p-4 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px]">
                  <div className="py-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-ClashGrotesk-Semibold text-lg sm:text-xl uppercase">
                        {order.title}
                      </h4>
                      <PiMedalLight className="text-lg" />
                    </div>
                    <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/40">
                      SoleCore Intelligent Motion & Lighting Engine. Real-time
                      coordination for motion, lighting, and security.
                    </p>
                    <p className="mt-4 text-xs sm:text-sm text-white/50">
                      COLOR:{" "}
                      <span className="text-white font-ClashGrotesk-Semibold">
                        {order.color}
                      </span>
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-white/50">
                      SCENT:{" "}
                      <span className="text-white font-ClashGrotesk-Semibold">
                        {order.scent}
                      </span>
                    </p>
                    <p className="mt-5 font-ClashGrotesk-Semibold text-2xl">
                      {order.price}
                    </p>
                  </div>

                  <div className="relative pl-7 pr-2">
                    <span className="absolute left-0.5 top-1 bottom-1 w-[3px] rounded-full bg-white/12" />
                    <span
                      className={`absolute left-0.5 top-1 w-[3px] rounded-full ${
                        order.status === "delivered"
                          ? "bg-[#45FF66]"
                          : "bg-white"
                      }`}
                      style={{
                        height:
                          steps.length <= 1
                            ? "0%"
                            : `${(activeStep / (steps.length - 1)) * 100}%`,
                      }}
                    />

                    <ul className="space-y-8">
                      {steps.map((s, i) => {
                        const complete = i <= activeStep;
                        const green = order.status === "delivered";
                        return (
                          <li key={s.key} className="flex items-center gap-3">
                            <span
                              className={`h-3.5 w-3.5 rounded-full ${
                                complete
                                  ? green
                                    ? "bg-[#45FF66] outline outline-[#45FF66] outline-offset-3"
                                    : "bg-white outline outline-white outline-offset-3"
                                  : "border border-white/50 bg-[#191919]"
                              }`}
                            />
                            <span
                              className={`${complete ? "text-white" : "text-white/55"} text-sm`}
                            >
                              {s.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {(order.trackingNumber || order.trackingUrl) && (
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#121212] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Tracking
                      </p>
                      {order.trackingNumber ? (
                        <div className="mt-1 flex items-center gap-2">
                          <p className="font-ClashGrotesk-Semibold text-sm sm:text-base truncate">
                            {order.trackingNumber}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyTracking(order.trackingNumber)}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60 hover:bg-white/5"
                            aria-label="Copy tracking number"
                          >
                            <FiCopy className="text-xs" />
                            Copy
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-white/55">
                          Carrier link available
                        </p>
                      )}
                    </div>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-ClashGrotesk-Semibold uppercase tracking-wider text-black transition hover:bg-white/85"
                      >
                        Track package
                        <FiExternalLink className="text-sm" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
          })}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-full border border-white/20 px-4 py-2 text-xs disabled:opacity-40"
            >
              Prev
            </button>
            <p className="text-xs text-white/60">
              Page {page} of {totalPages}
            </p>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-white/20 px-4 py-2 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default Orders;
