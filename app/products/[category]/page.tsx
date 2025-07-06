import ProductListing from '../page';
import { getCategories } from '@/lib/supabase';

// Opt out of static generation for this route
export const dynamic = 'force-dynamic';

// Optional: Keep generateStaticParams for initial categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category
  }));
}

// This ensures new categories won't 404
export const dynamicParams = true;

export default function CategoryPage() {
  return <ProductListing />;
}