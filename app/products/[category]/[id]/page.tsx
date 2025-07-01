import { supabase } from "@/lib/supabase";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";

// Generate static paths at build time
export async function generateStaticParams() {
  // Fetch all product IDs and categories from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("id, category");

  if (error || !products) {
    return [];
  }

  // Return the paths in the correct format
  return products.map((product) => ({
    category: product.category,
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return {
      title: "Product Not Found | Shiv Watches",
      description: "Product not found. Browse our wholesale collection.",
      openGraph: {
        title: "Product Not Found | Shiv Watches",
        description: "Product not found. Browse our wholesale collection.",
        images: ["/images/og-default.jpg"],
      },
    };
  }

  const categoryName = product.category.replace("-", " ");

  return {
    title: `${product.name} | Wholesale ${categoryName} – Shiv Watches`,
    description: product.description,
    keywords: [
      `wholesale ${categoryName}`,
      `bulk ${product.name}`,
      `${categoryName} supplier India`,
    ],
    alternates: {
      canonical: `https://www.shivwatches.com/products/${product.category}/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Shiv Watches`,
      description: product.description,
      images: product.cover_img?.[0]
        ? [
            {
              url: product.cover_img[0],
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : [
            {
              url: "/images/og-default.jpg",
              width: 1200,
              height: 630,
              alt: "Shiv Watches",
            },
          ],
    },
  };
}

export default async function Page({ params }: any) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return <div>Product not found</div>;
  }

  return <ProductDetail />;
}