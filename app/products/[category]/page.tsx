// app/products/[category]/page.tsx
import ProductListing from '../page';
import { getCategories, getCategoryDetails } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate every hour (in seconds)

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  // Fetch category details from your database
  const categoryDetails = await getCategoryDetails(params.category);
  
  // Fallback title and description in case category details aren't found
  const title = categoryDetails?.meta_title || `${params.category.replace(/-/g, ' ')} | Wholesale Products – Shiv Watches`;
  const description = categoryDetails?.meta_description || `Explore wholesale ${params.category.replace(/-/g, ' ')} products at Shiv Watches. Best bulk prices, fast delivery & trusted by 1000+ resellers in India.`;
  
  return {
    title: title,
    description: description,
    keywords: [
      `wholesale ${params.category.replace(/-/g, ' ')}`,
      `bulk ${params.category.replace(/-/g, ' ')} India`,
      ...(categoryDetails?.meta_keywords?.split(',') || []),
      "watch parts supplier",
      "buy in bulk for resale",
      "Shiv Watches products"
    ],
    alternates: {
      canonical: `https://www.shivwatches.com/products/${params.category}`,
    },
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: categoryDetails?.og_image || "/images/logo2.png",
          width: 1200,
          height: 630,
          alt: `Shiv Watches ${params.category.replace(/-/g, ' ')} Products`,
        },
      ],
    },
  };
}

export default function CategoryPage() {
  return <ProductListing />;
}