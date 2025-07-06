import ProductListing from '../page';
import { getCategories } from '@/lib/supabase';

export async function generateStaticParams() {
  const categories = await getCategories();
  
  if (!categories) {
    return [];
  }

  return categories.map((category) => ({
    category: category.toString()
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  return <ProductListing />;
}