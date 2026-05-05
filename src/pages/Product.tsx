import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiSave, FiShoppingCart } from "react-icons/fi";
import { HiCheck } from "react-icons/hi";
import { ecommerceAPI } from "../api";
import { PiMedalLight } from "react-icons/pi";
import GlowingButton from "../components/ui/GlowingButton";

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

const Product = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("RESERVE SOLE POD OG");
  const [subtitle, setSubtitle] = useState("Starting from $199 today");
  const [unitLimit, setUnitLimit] = useState(200);
  const [startingPrice, setStartingPrice] = useState(199);

  const [displayOptions, setDisplayOptions] = useState<PodType[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [scents, setScents] = useState<Scent[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [maxCardNameLength, setMaxCardNameLength] = useState(10);

  const [display, setDisplay] = useState<string>("");
  const [finish, setFinish] = useState<string>("");
  const [scent, setScent] = useState<string>("");
  const [selectedAddOnId, setSelectedAddOnId] = useState<string | null>(null);
  const [letters, setLetters] = useState<string[]>([
    "M",
    "A",
    "Y",
    "O",
    "W",
    "A",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ecommerceAPI.getSolePodConfig();
        const data = response.data;

        setTitle((data.title ?? "Reserve Sole Pod OG").toUpperCase());
        setSubtitle(data.subtitle ?? "Starting from $199 today");
        setUnitLimit(Number(data.unit_limit ?? 200));
        setStartingPrice(Number(data.starting_price ?? 199));
        const pods: PodType[] =
          (data.pod_types as any[] | undefined)?.map((pod, index) => ({
            id: pod.id,
            name: pod.name,
            description: pod.description ?? "",
            price: Number(pod.price ?? 0),
            image: index === 0 ? "/onyx.gif" : "/hero.gif",
          })) ?? [];
        setDisplayOptions(pods);
        setDisplay(pods[0]?.id ?? "");

        const apiFinishes: Finish[] =
          (data.finishes as any[] | undefined)?.map((item) => ({
            id: item.id,
            name: item.name,
            color_hex: item.color_hex,
            secondary_color_hex: item.secondary_color_hex,
          })) ?? [];
        setFinishes(apiFinishes);
        setFinish(apiFinishes[0]?.id ?? "");

        const apiScents: Scent[] =
          (data.scents as any[] | undefined)?.map((item) => ({
            id: item.id,
            name: item.name,
            image_url: item.image_url,
          })) ?? [];
        setScents(apiScents);
        setScent(apiScents[0]?.id ?? "");

        const apiAddOns: AddOn[] =
          (data.add_ons as any[] | undefined)?.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price ?? 0),
            optional: item.optional,
          })) ?? [];
        setAddOns(apiAddOns);
        setSelectedAddOnId(apiAddOns[0]?.id ?? null);

        const maxLen = Number((data as any)?.sole_card?.name_max_length ?? 10);
        setMaxCardNameLength(maxLen);
        setLetters((prev) => {
          const seeded = prev.slice(0, maxLen);
          while (seeded.length < maxLen) seeded.push("");
          return seeded;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load product.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activeDisplay = useMemo(
    () =>
      displayOptions.find((item) => item.id === display) ?? displayOptions[0],
    [display],
  );

  const activeFinish = useMemo(
    () => finishes.find((item) => item.id === finish) ?? finishes[0],
    [finish, finishes],
  );

  const activeAddOn = useMemo(
    () => addOns.find((item) => item.id === selectedAddOnId) ?? addOns[0],
    [selectedAddOnId, addOns],
  );

  const selectedScent = useMemo(
    () => scents.find((item) => item.id === scent)?.name ?? "Unscented",
    [scent],
  );

  const handleLetterChange = (index: number, raw: string) => {
    const value = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(-1);
    const next = [...letters];
    next[index] = value;
    setLetters(next);
    if (value && index < maxCardNameLength - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !letters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-12 text-sm text-white/70 sm:px-8 lg:px-12 xl:px-20">
        Loading product...
      </div>
    );
  }

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
            <div className="rounded-2xl border-2 border-white/15 bg-[#070707] p-3">
              <div className="rounded-xl bg-black p-4 sm:p-6">
                <img
                  src={activeDisplay.image}
                  alt={activeDisplay.name}
                  className="mx-auto h-auto w-full max-w-[560px] object-contain"
                />
              </div>
              <div className="mx-auto mt-3 w-fit rounded-full bg-[#1a1a1a] px-4 py-2">
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

            <h3 className="mt-4 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
              {activeDisplay.name}
            </h3>
            <p className="mt-1 max-w-xl text-xs sm:text-sm text-white/55">
              {activeDisplay.description}
            </p>
          </div>

          <aside className="lg:w-[38%] space-y-7 lg:px-12 ">
            <div>
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
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

            <div className="border-t border-white/12 pt-6">
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
              <button className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5">
                <FiSave /> Save entry
              </button>
            </div>

            <div className="border-t border-white/12 pt-6">
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
              <button className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5">
                <FiSave /> Save entry
              </button>
            </div>

            <div className="border-t border-white/12 pt-6">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                SOLE CARD
              </h2>
              <div className="flex h-28 items-center justify-center rounded-lg bg-[#111317] text-white/30">
                <FiImage />
              </div>
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
                      className="h-9 rounded-md border border-white/15 bg-[#0e1014] text-center text-sm uppercase outline-none focus:border-white/70"
                    />
                  ) : null,
                )}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5">
                <FiSave /> Save entry
              </button>
            </div>

            <div className="border-t border-white/12 pt-6">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                SOLE MOUNT <span className="text-white/45">(optional)</span>
              </h2>
              <div className="flex h-28 items-center justify-center rounded-lg bg-[#111317] text-white/30">
                <FiImage />
              </div>
              <p className="mt-2 text-xs text-white/50">
                {activeAddOn?.name ?? "Sole Mount"} accessory available for{" "}
                <span className="font-ClashGrotesk-Bold text-white">
                  +${activeAddOn?.price ?? 25}.
                </span>
              </p>
              <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-white/20 py-3 text-xs sm:text-sm hover:bg-white/5">
                <FiShoppingCart /> Add to cart
              </button>
            </div>

            <div className="border-t border-white/12 pt-6">
              <h2 className="mb-3 font-ClashGrotesk-Bold text-base sm:text-lg uppercase">
                PROCEED TO CHECKOUT
              </h2>
              <GlowingButton
                href="/product"
                className="w-full!"
                containerClassName="w-full! text-xs"
              >
                Proceed to Cart
              </GlowingButton>
              <p className="mt-2 text-[11px] text-white/45">
                {activeDisplay?.name} · {activeFinish?.name ?? "Finish"} ·{" "}
                {selectedScent}
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
                        src="/onyx.gif"
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
