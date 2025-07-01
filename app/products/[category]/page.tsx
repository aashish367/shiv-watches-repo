import ProductListing from '../page';
import { getCategories } from '@/lib/supabase';

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category // Now passing just the string
  }));
}

export default function CategoryPage() {
  return <ProductListing />;
}