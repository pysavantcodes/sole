import { useMemo, useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import { PiMedalLight } from "react-icons/pi";
import GlowingButton from "../../components/ui/GlowingButton";
import StarField from "../../components/ui/StarField";

type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  optionLabel?: string;
  optionValue?: string;
  price: number;
  selected: boolean;
  showBadge?: boolean;
};

const initialItems: CartItem[] = [
  {
    id: "pod-og",
    title: "SOLE POD OG",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    image: "/onyx.gif",
    optionLabel: "COLOR",
    optionValue: "Ivory",
    price: 199,
    selected: true,
    showBadge: true,
  },
  {
    id: "sole-card",
    title: "SOLE CARD",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    optionLabel: "NAME ON CARD",
    optionValue: "MAYOWA DAN",
    price: 0,
    selected: true,
  },
  {
    id: "deodorizer",
    title: "SOLE DEODORIZER",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    optionLabel: "SCENT",
    optionValue: "Lavender Calm",
    price: 0,
    selected: true,
  },
  {
    id: "mount",
    title: "SOLE MOUNT",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    price: 25,
    selected: true,
  },
  {
    id: "mini",
    title: "SOLE POD MINI",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    price: 0,
    selected: true,
  },
  {
    id: "cloth",
    title: "SOLE WIPE CLOTH",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    price: 0,
    selected: true,
  },
  {
    id: "adapter",
    title: "SOLE ADAPTER",
    subtitle:
      "SoleCore Intelligent Motion & Lighting Engine. Real-time coordination for motion, lighting, and security",
    price: 0,
    selected: true,
  },
];

const money = (amount: number) =>
  `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const itemCount = items.length;
  const selectedTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => (item.selected ? sum + Number(item.price) : sum),
        0,
      ),
    [items],
  );

  const toggleSelected = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeAll = () => setItems([]);

  return (
    <StarField className="w-full">
      <div className="bg-[#121212] min-h-[70dvh]">
        <section className="px-4 py-7 sm:px-8 lg:px-12 xl:px-20 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h1 className="font-ClashGrotesk-Semibold text-3xl uppercase">
              CART{" "}
              <span className="ml-2 text-sm text-white/40">
                ({itemCount} ITEMS)
              </span>
            </h1>
            <button
              onClick={removeAll}
              className="inline-flex items-center gap-2 rounded-md bg-[#1b1b1b] px-3 py-2 text-xs text-[#ff4d4d] hover:bg-[#232323]"
            >
              <FiTrash2 />
              Delete all
            </button>
          </div>
        </section>

        <section className="px-4 py-7 sm:px-8 lg:px-12 xl:px-20">
          <div className="rounded-2xl border border-white/10 p-3 sm:p-5">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-7 max-md:gap-4 rounded-2xl bg-[#191919] p-4 sm:grid-cols-[30px_150px_1fr] sm:p-7"
                >
                  <button
                    onClick={() => toggleSelected(item.id)}
                    className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md border ${
                      item.selected
                        ? "border-white text-white"
                        : "border-white/30 text-white/30"
                    }`}
                  >
                    {item.selected ? <FiCheck className="text-sm" /> : null}
                  </button>

                  <div className="rounded-xl border-4 border-white/15 bg-black p-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-34 w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center text-white/25">
                        +
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-ClashGrotesk-Semibold text-xl uppercase">
                        {item.title}
                      </h2>
                      {item.showBadge ? (
                        <PiMedalLight className="text-lg" />
                      ) : (
                        <span />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/35 max-w-3xl">
                      {item.subtitle}
                    </p>

                    {item.optionLabel && item.optionValue ? (
                      <div className="mt-3 rounded-md bg-white/5 px-3 py-2 text-xs text-white/55">
                        {item.optionLabel}:{" "}
                        <span className="text-white font-ClashGrotesk-Semibold">
                          {item.optionValue}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-3 h-[30px]" />
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/35 hover:text-white/75"
                      >
                        <FiTrash2 />
                      </button>
                      <p className="font-ClashGrotesk-Semibold text-3xl text-white/85">
                        {money(item.price)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GlowingButton className="text-sm">
              Proceed to Checkout
            </GlowingButton>
            <button className="w-40 rounded-full border border-white/40 py-3 text-sm sm:w-56">
              Member Checkout
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/45">
            Selected total: {money(selectedTotal)}
          </p>
        </section>
      </div>
    </StarField>
  );
};

export default Cart;
