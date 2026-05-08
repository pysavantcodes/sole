"use client";

export const CHECKOUT_SELECTION_KEY = "sole_checkout_selection_v1";
const CHECKOUT_SELECTION_EVENT = "sole-checkout-selection-updated";

export type CheckoutSelection = {
  pod_type_id: string;
  variant_id: string;
  scent_id: string;
  sole_card_name: string;
  add_on_ids: string[];
  display_name?: string;
  finish_name?: string;
  scent_name?: string;
  display_price?: number;
  created_at?: number;
};

export const getCheckoutSelection = (): CheckoutSelection | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CHECKOUT_SELECTION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CheckoutSelection;
    if (!parsed?.pod_type_id || !parsed?.variant_id || !parsed?.scent_id) {
      return null;
    }
    return {
      ...parsed,
      add_on_ids: Array.isArray(parsed.add_on_ids) ? parsed.add_on_ids : [],
      sole_card_name: parsed.sole_card_name ?? "",
    };
  } catch {
    return null;
  }
};

export const setCheckoutSelection = (selection: CheckoutSelection) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_SELECTION_KEY, JSON.stringify(selection));
  window.dispatchEvent(new Event(CHECKOUT_SELECTION_EVENT));
};

export const subscribeCheckoutSelection = (
  listener: () => void,
): (() => void) => {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === CHECKOUT_SELECTION_KEY) listener();
  };
  const onCustomEvent = () => listener();

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHECKOUT_SELECTION_EVENT, onCustomEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHECKOUT_SELECTION_EVENT, onCustomEvent);
  };
};
