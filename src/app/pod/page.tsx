import type { Metadata } from "next";
import Product from "../../screens/Product";

const SITE_URL = "https://solecapsule.vercel.app";

async function getSolePodConfig() {
  try {
    const res = await fetch("https://api.solecapsule.com/api/ecommerce/sole-pod", {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSolePodConfig();

  const title = data?.title
    ? `${data.title} | SOLE Capsule`
    : "Reserve Sole Pod OG | SOLE Capsule";
  const description =
    data?.subtitle ??
    "Reserve your Sole Pod. Smart display, ambient lighting, and secure sneaker showcasing.";
  const podImage =
    data?.pod_types?.[0]?.image_url ??
    data?.pod_types?.[0]?.image ??
    null;
  const image = podImage
    ? podImage.startsWith("http")
      ? podImage
      : `${SITE_URL}${podImage}`
    : `${SITE_URL}/frame.png`;
  const canonical = `${SITE_URL}/pod`;

  return {
    title,
    description,
    keywords: [
      "sole pod",
      "sneaker display",
      "smart shoe case",
      "sole capsule",
      "sneaker security",
      "ambient sneaker lighting",
      "shoe showcase",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data?.title ?? "Sole Pod",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page() {
  const initialData = await getSolePodConfig();
  const podImage =
    initialData?.pod_types?.[0]?.image_url ??
    initialData?.pod_types?.[0]?.image ??
    null;
  const productImage = podImage
    ? podImage.startsWith("http")
      ? podImage
      : `${SITE_URL}${podImage}`
    : `${SITE_URL}/frame.png`;
  const productJsonLd =
    initialData && initialData?.pod_types?.length
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: initialData.title ?? "Sole Pod",
          description: initialData.subtitle ?? "Reserve your Sole Pod",
          image: [productImage],
          brand: {
            "@type": "Brand",
            name: "SOLE Capsule",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: (initialData.currency ?? "usd").toUpperCase(),
            price: String(initialData.starting_price ?? "199"),
            availability: "https://schema.org/PreOrder",
            url: `${SITE_URL}/pod`,
          },
        }
      : null;

  return (
    <>
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}
      <Product initialData={initialData ?? undefined} />
    </>
  );
}
