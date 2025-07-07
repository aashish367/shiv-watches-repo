import { supabase } from "@/lib/supabase";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = true; // Enable dynamic params for new products
export const revalidate = 3600; // Revalidate data every hour
export const dynamic = 'force-dynamic'; // Ensure dynamic server-side rendering

// Generate static paths at build time
export async function generateStaticParams() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, category");

  if (error || !products) {
    return [];
  }

  return products.map((product) => ({
    category: product.category,
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Fetch fresh data for metadata
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return {
      title: "Product Not Found | Shiv Watches",
      description: "Product not found. Browse our wholesale collection.",
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  const categoryName = product.category.replace("-", " ");

  return {
    title: `${product.name} | Wholesale ${categoryName} – Shiv Watches`,
    description: product.description || `Wholesale ${product.name} at best prices. MOQ: ${product.moq} pieces.`,
    alternates: {
      canonical: `https://www.shivwatches.com/products/${product.category}/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Shiv Watches`,
      description: product.description || `Wholesale ${product.name} at best prices`,
      images: product.cover_img
        ? [
            {
              url: product.cover_img,
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
  // Fetch fresh data for the page
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch similar products
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  return (
    <ProductDetail 
      initialProduct={product} 
      initialSimilarProducts={similarProducts || []} 
    />
  );
}