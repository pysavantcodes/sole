"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiImage, FiSave } from "react-icons/fi";
import { HiCheck } from "react-icons/hi";
import { ecommerceAPI } from "../api";
import { PiMedalLight } from "react-icons/pi";
import GlowingButton from "../components/ui/GlowingButton";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import {
  getCheckoutSelection,
  setCheckoutSelection,
  type CheckoutSelection,
} from "../lib/checkoutSelection";

type PodType = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type Finish = {
  id: string;
  name: string;
  color_hex?: string;
  secondary_color_hex?: string;
};

type Scent = {
  id: string;
  name: string;
  image_url?: string;
};

type AddOn = {
  id: string;
  name: string;
  description?: string;
  price: number;
  optional?: boolean | string;
  image_url?: string;
};

const FALLBACK_DISPLAY: PodType = {
  id: "default",
  name: "SOLE POD OG",
  description:
    "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security.",
  price: 199,
  image:
    "https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fonyx.gif?alt=media&token=fac8a589-cfcb-4078-8327-afdeb1a84e07",
};

const buildAutoGradient = (hex?: string) => {
  const primary = (hex ?? "#ffffff").trim();
  const normalized = primary.startsWith("#") ? primary.slice(1) : primary;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return {
      background: "linear-gradient(180deg, #ffffff 0%, #d8d8d8 100%)",
    };
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  const darken = (channel: number) => Math.max(0, Math.round(channel * 0.72));
  const secondary = `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;

  return {
    background: `linear-gradient(180deg, ${primary} 0%, ${secondary} 100%)`,
  };
};

type ProductApiData = {
  title?: string;
  subtitle?: string;
  starting_price?: string | number;
  unit_limit?: number;
  pod_types?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
    image_url?: string;
  }>;
  finishes?: Array<{
    id: string;
    name: string;
    color_hex?: string;
    secondary_color_hex?: string;
  }>;
  scents?: Array<{ id: string; name: string; image_url?: string }>;
  add_ons?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
    optional?: boolean | string;
    image_url?: string;
  }>;
  sole_card?: { name_max_length?: string | number };
};

const applyDataToState = (data: ProductApiData) => {
  const pods: PodType[] =
    (data.pod_types ?? []).map((pod, index) => ({
      id: pod.id,
      name: pod.name,
      description: pod.description ?? "",
      price: Number(pod.price ?? 0),
      image:
        pod.image_url && pod.image_url.trim().length > 0
          ? pod.image_url
          : index === 0
            ? "https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fonyx.gif?alt=media&token=fac8a589-cfcb-4078-8327-afdeb1a84e07"
            : "https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fhero.gif?alt=media&token=69b3a9ce-e2a7-495c-a137-54e93ac2be10",
    })) ?? [];

  const mappedFinishes: Finish[] =
    (data.finishes ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      color_hex: item.color_hex,
      secondary_color_hex: item.secondary_color_hex,
    })) ?? [];

  const mappedScents: Scent[] =
    (data.scents ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
    })) ?? [];

  const mappedAddOns: AddOn[] =
    (data.add_ons ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price ?? 0),
      optional: item.optional,
      image_url: item.image_url,
    })) ?? [];

  return {
    title: (data.title ?? "Reserve Sole Pod OG").toUpperCase(),
    subtitle: data.subtitle ?? "Starting from $199 today",
    unitLimit: Number(data.unit_limit ?? 200),
    startingPrice: Number(data.starting_price ?? 199),
    pods,
    finishes: mappedFinishes,
    scents: mappedScents,
    addOns: mappedAddOns,
    maxLen: Number(data.sole_card?.name_max_length ?? 10),
  };
};

const Product = ({ initialData }: { initialData?: ProductApiData }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const initialState = initialData ? applyDataToState(initialData) : null;
  const [loading, setLoading] = useState(!initialState);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [title, setTitle] = useState(
    initialState?.title ?? "RESERVE SOLE POD OG",
  );
  const [subtitle, setSubtitle] = useState(
    initialState?.subtitle ?? "Starting from $199 today",
  );
  const [unitLimit, setUnitLimit] = useState(initialState?.unitLimit ?? 200);
  const [startingPrice, setStartingPrice] = useState(
    initialState?.startingPrice ?? 199,
  );

  const [displayOptions, setDisplayOptions] = useState<PodType[]>(
    initialState?.pods ?? [],
  );
  const [finishes, setFinishes] = useState<Finish[]>(
    initialState?.finishes ?? [],
  );
  const [scents, setScents] = useState<Scent[]>(initialState?.scents ?? []);
  const [addOns, setAddOns] = useState<AddOn[]>(initialState?.addOns ?? []);
  const [maxCardNameLength, setMaxCardNameLength] = useState(
    initialState?.maxLen ?? 10,
  );

  const [display, setDisplay] = useState<string>(
    initialState?.pods[0]?.id ?? "",
  );
  const [finish, setFinish] = useState<string>(
    initialState?.finishes[0]?.id ?? "",
  );
  const [scent, setScent] = useState<string>(initialState?.scents[0]?.id ?? "");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(
    initialState?.addOns[0]?.id ? [initialState.addOns[0].id] : [],
  );
  const [savedSection, setSavedSection] = useState<
    "finish" | "scent" | "sole-card" | "add-ons" | null
  >(null);
  const [letters, setLetters] = useState<string[]>(
    Array(initialState?.maxLen ?? 10).fill(""),
  );
  const [hydrated, setHydrated] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const applyNormalizedWithSaved = (
    normalized: ReturnType<typeof applyDataToState>,
  ) => {
    setTitle(normalized.title);
    setSubtitle(normalized.subtitle);
    setUnitLimit(normalized.unitLimit);
    setStartingPrice(normalized.startingPrice);
    setDisplayOptions(normalized.pods);
    setFinishes(normalized.finishes);
    setScents(normalized.scents);
    setAddOns(normalized.addOns);
    setMaxCardNameLength(normalized.maxLen);

    const saved = getCheckoutSelection();
    const savedPodValid =
      saved && normalized.pods.some((p) => p.id === saved.pod_type_id);
    const savedFinishValid =
      saved && normalized.finishes.some((f) => f.id === saved.variant_id);
    const savedScentValid =
      saved && normalized.scents.some((s) => s.id === saved.scent_id);
    const useSaved = !!(
      saved &&
      savedPodValid &&
      savedFinishValid &&
      savedScentValid
    );

    setDisplay(
      useSaved ? saved!.pod_type_id : (normalized.pods[0]?.id ?? ""),
    );
    setFinish(
      useSaved ? saved!.variant_id : (normalized.finishes[0]?.id ?? ""),
    );
    setScent(
      useSaved ? saved!.scent_id : (normalized.scents[0]?.id ?? ""),
    );
    setSelectedAddOnIds(
      useSaved
        ? (saved!.add_on_ids ?? []).filter((id) =>
            normalized.addOns.some((a) => a.id === id),
          )
        : normalized.addOns[0]?.id
          ? [normalized.addOns[0].id]
          : [],
    );

    const restoredLetters = Array(normalized.maxLen).fill("");
    if (useSaved && saved!.sole_card_name) {
      const trimmed = saved!.sole_card_name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, normalized.maxLen);
      trimmed.split("").forEach((char, index) => {
        restoredLetters[index] = char;
      });
    }
    setLetters(restoredLetters);

    setLoading(false);
    setHydrated(true);
  };

  useEffect(() => {
    if (!initialData) return;
    applyNormalizedWithSaved(applyDataToState(initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    const load = async () => {
      try {
        setError(null);
        const response = await ecommerceAPI.getSolePodConfig();
        if (cancelled) return;
        applyNormalizedWithSaved(
          applyDataToState(response.data as ProductApiData),
        );
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load product.",
        );
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (!hydrated) return;
    if (!display || !finish || !scent) return;
    const draftDisplay = displayOptions.find((item) => item.id === display);
    const draftFinish = finishes.find((item) => item.id === finish);
    const draftScent = scents.find((item) => item.id === scent);
    const soleCardName = letters.join("").replace(/\s+/g, "").trim();
    const draft: CheckoutSelection = {
      pod_type_id: display,
      variant_id: finish,
      scent_id: scent,
      sole_card_name: soleCardName,
      add_on_ids: selectedAddOnIds,
      display_name: draftDisplay?.name,
      finish_name: draftFinish?.name ?? "",
      scent_name: draftScent?.name ?? "",
      display_price: Number(draftDisplay?.price ?? 0),
      created_at: Date.now(),
    };
    setCheckoutSelection(draft);
  }, [
    hydrated,
    display,
    finish,
    scent,
    selectedAddOnIds,
    letters,
    displayOptions,
    finishes,
    scents,
  ]);

  const activeDisplay = useMemo(
    () =>
      displayOptions.find((item) => item.id === display) ??
      displayOptions[0] ??
      FALLBACK_DISPLAY,
    [display, displayOptions],
  );

  const activeFinish = useMemo(
    () => finishes.find((item) => item.id === finish) ?? finishes[0],
    [finish, finishes],
  );

  const selectedAddOns = useMemo(
    () => addOns.filter((item) => selectedAddOnIds.includes(item.id)),
    [addOns, selectedAddOnIds],
  );

  const selectedScent = useMemo(
    () => scents.find((item) => item.id === scent)?.name ?? "Unscented",
    [scent, scents],
  );

  const handleProceedToCheckout = () => {
    const soleCardName = letters
      .slice(0, maxCardNameLength)
      .join("")
      .replace(/\s+/g, "")
      .trim();

    if (
      !letters
        .slice(0, maxCardNameLength)
        .some((entry) => entry.trim().length > 0)
    ) {
      const msg = "Enter at least one character for your Sole Card.";
      setCardError(msg);
      setToastMessage(msg);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 2200);
      return;
    }
    setCardError(null);

    const payload = {
      pod_type_id: display,
      variant_id: finish,
      scent_id: scent,
      sole_card_name: soleCardName,
      add_on_ids: selectedAddOnIds,
      display_name: activeDisplay.name,
      finish_name: activeFinish?.name ?? "Finish",
      scent_name: selectedScent,
      display_price: Number(activeDisplay.price ?? 0),
      created_at: Date.now(),
    };

    setCheckoutSelection(payload);

    if (!isAuthenticated) {
      router.push("/login?from=/checkout");
      return;
    }

    router.push("/checkout");
  };

  const handleLetterChange = (index: number, raw: string) => {
    const value = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(-1);
    const next = [...letters];
    next[index] = value;
    setLetters(next);
    if (cardError && next.some((entry) => entry.trim().length > 0)) {
      setCardError(null);
    }
    if (value && index < maxCardNameLength - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !letters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSaveEntry = (
    section: "finish" | "scent" | "sole-card" | "add-ons",
  ) => {
    setSavedSection(section);
    window.setTimeout(() => {
      setSavedSection((current) => (current === section ? null : current));
    }, 1300);
  };

  if (error) {
    return (
      <div className="px-4 py-12 text-sm text-red-300 sm:px-8 lg:px-12 xl:px-20">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full pt-8">
      <section className=" pb-10 pt-8">
        <div className="mb-8 px-4  sm:px-8 lg:px-12 xl:px-20 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-ClashGrotesk-Bold text-2xl sm:text-3xl uppercase">
              {title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/70">{subtitle}</p>
          </div>
          <span className="hidden rounded-full bg-[#161616] px-4 py-2 text-xs text-white/80 md:inline-block">
            Limited to first {unitLimit} units
          </span>
        </div>

        <div className="flex px-4  sm:px-8 lg:px-12 xl:px-20 flex-col gap-8 lg:flex-row lg:items-start bg-[#040404] py-15">
          <div className="lg:w-[62%] lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border-3 border-white/15 bg-[#070707] p-3">
              <div className="rounded-xl bg-black">
                <img
                  src={activeDisplay.image}
                  alt={activeDisplay.name}
                  className="mx-auto w-full max-h-[400px] object-cover rounded-xl"
                />
              </div>
            </div>

            <h3 className="mt-4 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
              {activeDisplay.name}
            </h3>
            <p className="mt-1 max-w-xl text-xs sm:text-sm text-white/55">
              {activeDisplay.description}
            </p>
          </div>

          <aside className="lg:w-[38%] space-y-14 lg:px-12">
            <div>
              {toastMessage ? (
                <div className="fixed right-4 top-20 z-[90] rounded-lg border border-red-300/30 bg-[#1d1111] px-4 py-2 text-xs text-red-200 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                  {toastMessage}
                </div>
              ) : null}
              <h2 className="my-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                CHOOSE YOUR BEST DISPLAY
              </h2>
              <div className="space-y-3">
                {displayOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDisplay(item.id)}
                    className={`w-full rounded-2xl border p-6 text-left transition ${
                      display === item.id
                        ? "border-white/70 bg-[#121212]"
                        : "border-white/12 bg-[#121212]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                        {item.name}
                      </h3>
                      <PiMedalLight className="text-xl shrink-0" />
                    </div>
                    <p className="mt-2 text-sm text-white/45 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/12 pt-14">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                PICK YOUR FINISH
              </h2>
              <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                {finishes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFinish(item.id)}
                    className="flex items-center gap-2"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-white/30">
                      {finish === item.id ? (
                        <HiCheck className="text-[10px]" />
                      ) : null}
                    </span>
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {finishes.map((item) => (
                  <button
                    key={`${item.id}-swatch`}
                    onClick={() => setFinish(item.id)}
                    style={buildAutoGradient(item.color_hex)}
                    className={`h-12 rounded-lg ${finish === item.id ? "ring-2 ring-white/80" : ""}`}
                  />
                ))}
              </div>
              <button
                onClick={() => handleSaveEntry("finish")}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5"
              >
                {savedSection === "finish" ? <HiCheck /> : <FiSave />}
                {savedSection === "finish" ? "Saved" : "Save entry"}
              </button>
            </div>

            <div className="border-t border-white/12 pt-14">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                CHOOSE YOUR SCENT
              </h2>
              <div className="grid grid-cols-3 gap-5">
                {scents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScent(item.id)}
                    className="text-center flex items-center flex-col"
                  >
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-lg border text-xl ${scent === item.id ? "border-white/80" : "border-white/15 bg-white/5"}`}
                    >
                      <img
                        src={item.image_url || "/verify.png"}
                        alt={item.name}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                    <p className="mt-3 text-[14px] text-white/85">
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleSaveEntry("scent")}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5"
              >
                {savedSection === "scent" ? <HiCheck /> : <FiSave />}
                {savedSection === "scent" ? "Saved" : "Save entry"}
              </button>
            </div>

            <div className="border-t border-white/12 pt-14">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                SOLE CARD
              </h2>
              {(() => {
                const cardName = letters.join("").trim();
                return (
                  <div
                    className="relative aspect-2/1 w-full overflow-hidden rounded-2xl text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)]"
                    style={{
                      background:
                        "linear-gradient(180deg, #1c1c1c 0%, #0a0a0a 100%)",
                      boxShadow:
                        "0 20px 60px -20px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                    aria-label="Sole Card preview"
                  >
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-1/4 w-px bg-white/5" />
                    <div className="pointer-events-none absolute inset-y-0 right-1/3 w-px bg-white/5" />

                    <div className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-4">
                      {/* Top row: signal icon + SOLE CAPSULE */}
                      <div className="flex items-center justify-between">
                        <svg
                          viewBox="0 0 16 14"
                          className="h-3 w-3.5"
                          fill="currentColor"
                          aria-hidden
                        >
                          <rect x="0" y="9" width="2.2" height="5" rx="0.6" opacity="0.85" />
                          <rect x="3.5" y="6" width="2.2" height="8" rx="0.6" opacity="0.85" />
                          <rect x="7" y="3" width="2.2" height="11" rx="0.6" opacity="0.85" />
                        </svg>
                        <p className="font-ClashGrotesk-Bold text-[10px] uppercase tracking-[0.18em]">
                          SOLE <span className="text-white/55">CAPSULE</span>
                        </p>
                        <span className="h-3 w-3.5" aria-hidden />
                      </div>

                      {/* Center: (SOLE) logo */}
                      <div className="flex items-center justify-center">
                        <svg
                          viewBox="0 0 96 28"
                          className="h-5 sm:h-6 w-auto"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          aria-label="SOLE"
                        >
                          <path d="M 14 2 Q 3 2 3 14 Q 3 26 14 26" />
                          <text
                            x="18"
                            y="21"
                            stroke="none"
                            fill="currentColor"
                            fontFamily="ClashGrotesk-Bold, ui-sans-serif, system-ui"
                            fontSize="20"
                            fontWeight="700"
                            letterSpacing="0.5"
                          >
                            SOLE
                          </text>
                        </svg>
                      </div>

                      {/* Bottom row: cardholder name + SOLEMATE pill */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                            Cardholder
                          </p>
                          <p
                            className="mt-0.5 font-ClashGrotesk-Bold text-sm sm:text-base uppercase tracking-[0.16em] truncate min-h-[1.2rem]"
                            style={{
                              textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                            }}
                          >
                            {cardName || (
                              <span className="text-[10px] tracking-normal normal-case italic text-white/35">
                                Type your name below
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-full border border-white/18 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white/55">
                          SOLEMATE SINCE{" "}
                          <span className="font-ClashGrotesk-Bold text-white">
                            {String(new Date().getFullYear()).slice(-2)}&rdquo;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              <p className="mt-2 text-[11px] text-white/70">
                Customize name on your card
              </p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {letters.map((letter, index) =>
                  index < maxCardNameLength ? (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      value={letter}
                      onChange={(e) =>
                        handleLetterChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e.key)}
                      maxLength={1}
                      className="h-10 rounded-md border border-white/15 bg-[#0e1014] text-center text-base sm:text-sm uppercase outline-none focus:border-white/70"
                    />
                  ) : null,
                )}
              </div>
              {cardError ? (
                <p className="mt-2 text-xs text-red-300">{cardError}</p>
              ) : null}
              <button
                onClick={() => handleSaveEntry("sole-card")}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5"
              >
                {savedSection === "sole-card" ? <HiCheck /> : <FiSave />}
                {savedSection === "sole-card" ? "Saved" : "Save entry"}
              </button>
            </div>

            <div className="border-t border-white/12 pt-14">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                ADD-ONS <span className="text-white/45">(optional)</span>
              </h2>
              <div className="space-y-4">
                {addOns.map((item) => {
                  const selected = selectedAddOnIds.includes(item.id);
                  return (
                    <article className="pb-10" key={item.id}>
                      <div className="mb-4 flex h-44 w-full items-center justify-center rounded-xl overflow-hidden bg-[#0c0c0c]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiImage className="text-white/30" />
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-ClashGrotesk-Bold text-base uppercase">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-white/55">
                            {item.description?.trim() ||
                              `${item.name} accessory available`}
                          </p>
                        </div>
                        <p className="shrink-0 text-2xl font-ClashGrotesk-Bold">
                          {item.price > 0 ? `+$${item.price}.` : "$0."}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedAddOnIds((prev) =>
                            selected
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id],
                          )
                        }
                        className={`mt-4 flex w-full items-center justify-center gap-3 rounded-full border py-3 text-xs transition ${
                          selected
                            ? "border-white/60 bg-white text-black"
                            : "border-white/25 hover:bg-white/5"
                        }`}
                      >
                        <ShoppingCart className="w-4" />
                        {selected ? "Remove" : "Add to cart"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/12 pt-6">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                PROCEED TO CHECKOUT
              </h2>
              <GlowingButton
                onClick={handleProceedToCheckout}
                className="w-full!"
                containerClassName="w-full! text-xs"
              >
                Proceed to Checkout
              </GlowingButton>
              <p className="mt-2 text-[11px] text-white/45">
                {activeDisplay?.name} · {activeFinish?.name ?? "Finish"} ·{" "}
                {selectedScent}
                {selectedAddOns.length
                  ? ` · ${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? "s" : ""}`
                  : ""}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-8 text-center font-ClashGrotesk-Bold text-xl sm:text-2xl uppercase">
            WHAT&apos;S IN THE BOX
          </h2>
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-5 min-w-max">
              {[
                [
                  "PREMIUM SOLE POD PACKAGING",
                  "Custom-designed packaging built to protect and present your Sole Pod from unboxing to setup.",
                ],
                [
                  "SOLE POD",
                  "The core experience. Smart display, ambient lighting, and security for footwear worth showing.",
                ],
              ].map(([title, desc]) => (
                <article
                  key={title}
                  className="w-[82vw] max-w-[520px] sm:w-[460px] md:w-[500px]"
                >
                  <div className="rounded-xl border-2 border-white/12 bg-[#070707] p-3">
                    <div className="rounded-lg bg-black p-4">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fonyx.gif?alt=media&token=fac8a589-cfcb-4078-8327-afdeb1a84e07"
                        alt={title}
                        className="mx-auto w-full max-w-md object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="mt-3 font-ClashGrotesk-Bold text-sm sm:text-base uppercase">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-white/55">{desc}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <GlowingButton href="/pod" className="text-xs">
              Buy Now
            </GlowingButton>
            <p className="mt-2 text-xs sm:text-sm">
              From ${startingPrice} only {unitLimit} available
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mx-auto mb-8 max-w-2xl text-center font-ClashGrotesk-Bold text-xl sm:text-2xl uppercase">
            YOUR SOLE POD COMES WITH SO MUCH MORE
          </h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              [
                "SOLE APP+",
                "Exclusive access to all Sole App features from personalization and authentication to live pricing and future drops.",
              ],
              [
                "200+ SOLE TOKENS",
                "Virtual currency included with your Sole Pod, used for sneaker authentication, digital personalization, and premium app features.",
              ],
              [
                "SOLE BOT . AI",
                "A smart sneaker assistant designed to identify shoes, authenticate pairs, and recommend cleaning and care tips.",
              ],
              [
                "SOLE LOCKER",
                "A virtual wardrobe that lets you build outfits around your displayed shoes and generate them on your real body.",
              ],
            ].map(([title, desc]) => (
              <article
                key={title}
                className="rounded-xl bg-[#0A0A0A] p-4 text-center"
              >
                <div className="mx-auto mb-7 h-20 w-20 rounded-xl bg-white/5" />
                <h3 className="font-ClashGrotesk-Bold text-base uppercase">
                  {title}
                </h3>
                <p className="mt-2 text-xs text-white/55">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 text-center">
            <GlowingButton href="/pod" className="text-xs">
              Buy Now
            </GlowingButton>
            <p className="mt-2 text-xs sm:text-sm">
              From ${startingPrice} only {unitLimit} available
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 pt-12 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="mb-8 text-center font-ClashGrotesk-Bold text-xl sm:text-2xl uppercase">
            YOUR SOLE POD UNLOCKS
          </h2>
          <div className="mx-auto grid gap-10 max-md:gap-5 grid-cols-2 lg:grid-cols-3">
            {[
              ["SOLE APP+", "Arrives Today"],
              ["SOLE STATUS", "Arriving Summer 26"],
              ["100 SOLE TOKEN", "Arriving Summer 26"],
              ["SOLE BOT", "Arrives Today"],
              ["SOLE LOCKER", "Arrives Today"],
              ["AUTHENTICATION", "Arrives Today"],
            ].map(([name, eta]) => (
              <article key={name} className="text-center">
                <div className="rounded-2xl bg-[#111111] p-3">
                  <div className="mb-3 aspect-square rounded-xl bg-[#1C1C1C]" />
                  <p className="font-ClashGrotesk-Bold text-xl max-md:text-base uppercase py-2">
                    {name}
                  </p>
                </div>
                <p className="mt-5 text-sm text-white/70">{eta}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <GlowingButton href="/pod" className="text-xs">
              Buy Now
            </GlowingButton>
            <p className="mt-2 text-xs sm:text-sm">
              From $199 only 200 available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
