"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiLoader, FiTrash2 } from "react-icons/fi";
import { ecommerceAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import GlowingButton from "../../components/ui/GlowingButton";
import {
  getCheckoutSelection,
  setCheckoutSelection,
  subscribeCheckoutSelection,
  type CheckoutSelection,
} from "../../lib/checkoutSelection";

type SolePodConfigData = {
  estimated_delivery_label?: string;
  tax_amount?: string | number;
  currency?: string;
  pod_types?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
  }>;
  finishes?: Array<{ id: string; name: string }>;
  scents?: Array<{ id: string; name: string }>;
  add_ons?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
  }>;
};

type AddressForm = {
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
};

const defaultAddress: AddressForm = {
  email: "",
  first_name: "",
  last_name: "",
  country: "NG",
  company: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postal_code: "",
  phone: "",
};

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const Checkout = () => {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  const [selection, setSelection] = useState<
    CheckoutSelection | null | undefined
  >(undefined);
  const [config, setConfig] = useState<SolePodConfigData | null>(null);
  const [form, setForm] = useState<AddressForm>(defaultAddress);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);

  useEffect(() => {
    const hydrateSelection = () => {
      const parsed = getCheckoutSelection();
      if (!parsed) {
        setSelection(null);
        return;
      }
      setSelection(parsed);
    };

    hydrateSelection();
    const unsubscribe = subscribeCheckoutSelection(hydrateSelection);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selection === null) {
      router.replace("/pod");
    }
  }, [selection, router]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      email: user?.email ?? prev.email,
      first_name: user?.name?.split(" ")[0] ?? prev.first_name,
      last_name: user?.name?.split(" ").slice(1).join(" ") ?? prev.last_name,
    }));
  }, [user]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setError(null);
        const response = await ecommerceAPI.getSolePodConfig();
        setConfig(response.data as SolePodConfigData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load checkout details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadConfig();
  }, []);

  const summary = useMemo(() => {
    if (!selection || !config) {
      return {
        podName: selection?.display_name ?? "Sole Pod",
        podDesc: "",
        podImage: "/frame.png",
        finishName: selection?.finish_name ?? "",
        scentName: selection?.scent_name ?? "",
        subtotal: 0,
        tax: 0,
        total: 0,
        deliveryLabel: "Aug",
        currency: "USD",
        addOnItems: [] as Array<{ id: string; name: string; price: number }>,
      };
    }

    const pod = (config.pod_types ?? []).find(
      (p) => p.id === selection.pod_type_id,
    );
    const finish = (config.finishes ?? []).find(
      (f) => f.id === selection.variant_id,
    );
    const scent = (config.scents ?? []).find(
      (s) => s.id === selection.scent_id,
    );
    const addOnItems = (config.add_ons ?? []).filter((a) =>
      (selection.add_on_ids ?? []).includes(a.id),
    );

    const podPrice = Number(pod?.price ?? selection.display_price ?? 0);
    const addOnTotal = addOnItems.reduce(
      (sum, item) => sum + Number(item.price ?? 0),
      0,
    );
    const subtotal = podPrice + addOnTotal;
    const tax = Number(config.tax_amount ?? 0);
    const total = subtotal + tax;

    return {
      podName: pod?.name ?? selection.display_name ?? "Sole Pod",
      podDesc:
        pod?.description ??
        "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
      podImage: pod?.image_url || "/frame.png",
      finishName: finish?.name ?? selection.finish_name ?? "",
      scentName: scent?.name ?? selection.scent_name ?? "",
      subtotal,
      tax,
      total,
      deliveryLabel: config.estimated_delivery_label ?? "Aug",
      currency: (config.currency ?? "usd").toUpperCase(),
      addOnItems,
    };
  }, [selection, config]);

  const summaryItems = useMemo(() => {
    const base = [
      {
        id: "pod",
        type: "pod" as const,
        name: summary.podName,
        meta: summary.finishName ? `Color: ${summary.finishName}` : "",
        price:
          Number(summary.subtotal) -
          summary.addOnItems.reduce(
            (acc, item) => acc + Number(item.price ?? 0),
            0,
          ),
      },
      {
        id: "scent",
        type: "scent" as const,
        name: "Sole Deodorizer",
        meta: summary.scentName ? `Scent: ${summary.scentName}` : "",
        price: 0,
      },
      {
        id: "sole-card",
        type: "sole_card" as const,
        name: "Sole Card",
        meta: selection?.sole_card_name
          ? `Name: ${selection.sole_card_name}`
          : "",
        price: 0,
      },
    ];

    const mappedAddons = summary.addOnItems.map((item) => ({
      id: item.id,
      type: "add_on" as const,
      name: item.name,
      meta: "Add-on",
      price: Number(item.price ?? 0),
    }));

    return [...base, ...mappedAddons];
  }, [selection?.sole_card_name, summary]);

  const handleRemoveAddOn = (addOnId: string) => {
    if (!selection) return;
    const next: CheckoutSelection = {
      ...selection,
      add_on_ids: (selection.add_on_ids ?? []).filter((id) => id !== addOnId),
    };
    setSelection(next);
    setCheckoutSelection(next);
  };

  const handleChange = (key: keyof AddressForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckout = async () => {
    if (!selection) return;

    if (!isAuthenticated) {
      router.push("/login?from=/checkout");
      return;
    }

    if (
      !form.email ||
      !form.first_name ||
      !form.last_name ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.postal_code ||
      !form.country ||
      !form.phone
    ) {
      setError("Please complete all required shipping fields.");
      return;
    }

    setPaying(true);
    setError(null);

    try {
      const payload = {
        pod_type_id: selection.pod_type_id,
        variant_id: selection.variant_id,
        scent_id: selection.scent_id,
        sole_card_name: selection.sole_card_name || "SOLE",
        add_on_ids: selection.add_on_ids ?? [],
        shipping_address: {
          name: `${form.first_name} ${form.last_name}`.trim(),
          line1: form.address,
          line2: form.apartment || form.company || "",
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
          country: form.country.toUpperCase(),
        },
        use_shipping_as_billing: true,
        payment_method: "card",
        metadata: {
          customer_phone: form.phone,
        },
      };

      const response = await ecommerceAPI.createPaymentLink(payload);
      if (!response?.url) {
        throw new Error("Checkout link not returned.");
      }

      window.location.href = response.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to start checkout.",
      );
    } finally {
      setPaying(false);
    }
  };

  if (isBootstrapping || loading || selection === undefined || !selection) {
    return (
      <section className="flex min-h-[65dvh] items-center justify-center bg-[#121212] px-4 py-12">
        <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/10 bg-[#191919] p-8 text-center">
          <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_65%)]" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#171717]">
            <FiLoader className="animate-spin text-xl text-white/85" />
          </div>
          <p className="relative mt-4 font-ClashGrotesk-Semibold text-sm uppercase tracking-wide text-white/90">
            Preparing checkout
          </p>
          <p className="relative mt-1 text-xs text-white/45">
            Loading your pod configuration and order summary.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#121212] pb-20">
      <div className=" py-7 ">
        <div className="grid border-b sm:px-8 lg:px-12 xl:px-20 px-4 border-white/10 lg:grid-cols-2">
          <div className="py-6 lg:pr-8 max-md:py-4">
            <h1 className="font-ClashGrotesk-Semibold text-2xl uppercase">
              Checkout
            </h1>
          </div>
          <div className="py-6 lg:pl-10 max-lg:hidden">
            <h2 className="font-ClashGrotesk-Semibold text-2xl uppercase">
              Summary
            </h2>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="pt-6 max-md:pt-3 lg:pr-8 sm:px-8 lg:px-12 xl:px-20 px-4">
            <div className="space-y-3">
              <input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="First name"
                  className="h-12 rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
                />
                <input
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Last name"
                  className="h-12 rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
                />
              </div>
              <input
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Country or region code (e.g. NG)"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
              <input
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Company (optional)"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
              <input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Address"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
              <input
                value={form.apartment}
                onChange={(e) => handleChange("apartment", e.target.value)}
                placeholder="Apartment (optional)"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  className="h-12 rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
                />
                <input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="Province"
                  className="h-12 rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
                />
                <input
                  value={form.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  placeholder="Postal code"
                  className="h-12 rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
                />
              </div>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone"
                className="h-12 w-full rounded-lg border border-white/12 bg-[#171717] px-4 text-sm outline-none focus:border-white/40"
              />
            </div>

            <div className="max-lg:hidden">
              {error ? (
                <p className="mt-4 text-sm text-red-300">{error}</p>
              ) : null}

              <p className="mt-6 text-xs text-white/40">
                By submitting your order you agree to our Terms and Service &
                Privacy Policy
              </p>

              <GlowingButton
                onClick={handleCheckout}
                className=" w-full!"
                containerClassName="w-full! mt-5"
              >
                {paying ? (
                  <span className="inline-flex items-center gap-2">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </GlowingButton>
            </div>
          </div>

          <aside className="pt-6 lg:pl-8 sm:px-8 lg:px-12 xl:px-10 px-4">
            <div className="py-6 lg:pl-10 lg:hidden">
              <h2 className="font-ClashGrotesk-Semibold text-2xl uppercase">
                Summary
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-4">
              <article className="rounded-xl bg-[#191919] p-7 max-md:p-5">
                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="rounded-xl border-4 border-white/15 bg-black p-2">
                    <img
                      src={summary.podImage}
                      alt={summary.podName}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-ClashGrotesk-Semibold text-xl uppercase">
                      {summary.podName}
                    </h3>
                    <p className="mt-1 text-xs text-white/35">
                      {summary.podDesc}
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      Color:{" "}
                      <span className="text-white">{summary.finishName}</span>
                    </p>
                    <p className="text-xs text-white/60">
                      Scent:{" "}
                      <span className="text-white">{summary.scentName}</span>
                    </p>
                    <p className="mt-2 text-2xl font-ClashGrotesk-Semibold">
                      {money(summary.subtotal, summary.currency)}
                    </p>
                  </div>
                </div>
              </article>

              <button
                type="button"
                onClick={() => setShowAllItems((prev) => !prev)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-sm text-white/80"
              >
                {showAllItems
                  ? "View less"
                  : `View all ${summaryItems.length} items`}
                <FiChevronDown
                  className={`transition-transform ${showAllItems ? "rotate-180" : ""}`}
                />
              </button>

              {showAllItems ? (
                <div className="mt-3 space-y-3">
                  {summaryItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-[#191919] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-ClashGrotesk-Semibold text-sm uppercase text-white/90">
                            {item.name}
                          </p>
                          {item.meta ? (
                            <p className="mt-1 text-xs text-white/45">
                              {item.meta}
                            </p>
                          ) : null}
                          {item.type === "add_on" ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveAddOn(item.id)}
                              className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-300 hover:text-red-200"
                            >
                              <FiTrash2 /> Remove
                            </button>
                          ) : null}
                        </div>
                        <p className="font-ClashGrotesk-Semibold text-xl text-white/85">
                          {money(item.price, summary.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/70">
                  <span>Total items</span>
                  <span>
                    {String(summaryItems.length).padStart(2, "0")} items
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Sub total</span>
                  <span className="text-[#2ce35f]">
                    {money(summary.subtotal, summary.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Est. delivery</span>
                  <span className="text-white/60">{summary.deliveryLabel}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-white/70">Taxes</span>
                  <span className="text-[#ff5e5e]">
                    +{money(summary.tax, summary.currency)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-white/90">Final payment</span>
                  <span className="font-ClashGrotesk-Semibold text-white">
                    {money(summary.total, summary.currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/pod")}
                className="mt-4 inline-flex items-center gap-2 text-xs text-white/45 hover:text-white/75"
              >
                <FiTrash2 /> Edit selection
              </button>
            </div>
            <div className="lg:hidden">
              {error ? (
                <p className="mt-4 text-sm text-red-300">{error}</p>
              ) : null}

              <p className="mt-6 text-xs text-white/40">
                By submitting your order you agree to our Terms and Service &
                Privacy Policy
              </p>

              <GlowingButton
                onClick={handleCheckout}
                className=" w-full!"
                containerClassName="w-full! mt-5"
              >
                {paying ? (
                  <span className="inline-flex items-center gap-2">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </GlowingButton>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
