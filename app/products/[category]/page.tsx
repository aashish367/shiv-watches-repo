// app/products/[category]/page.tsx
import ProductListing from '../page';
import { getCategories } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate every hour (in seconds)

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category
  }));
}

export default function CategoryPage() {
  return <ProductListing />;
}