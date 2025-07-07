import { supabase } from "@/lib/supabase";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return {
      title: "Product Not Found | Shiv Watches",
      description: "Product not found. Browse our wholesale collection.",
    };
  }

  const categoryName = product.category.replace("-", " ");

  return {
    title: `${product.name} | Wholesale ${categoryName} – Shiv Watches`,
    description: product.description,
    alternates: {
      canonical: `https://www.shivwatches.com/products/${product.category}/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Shiv Watches`,
      description: product.description,
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

export const revalidate = 3600; // Revalidate data every hour

export default async function Page({ params }: any) {
  // Fetch the product
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound(); // This will show the 404 page
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