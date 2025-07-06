// app/products/[category]/page.tsx
import ProductListing from '../page';
import { getCategories } from '@/lib/supabase';

interface PageProps {
  params: {
    category: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

// For static generation of known categories
export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category.toString()
  }));
}

// Dynamic parameters configuration
export const dynamicParams = true; // Allow new categories not generated at build time
export const dynamic = 'auto'; // Let Next.js decide when to use static/dynamic

// The actual page component
export default function CategoryPage({ params }: PageProps) {
  return <ProductListing />;
}