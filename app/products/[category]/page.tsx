import { supabase } from '@/lib/supabase';
import ProductDetail from './[id]/ProductDetail';

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  // Fetch all products to generate static paths
  const { data: products } = await supabase
    .from('products')
    .select('id, category');
    
  return products?.map((product) => ({
    category: product.category,
    id: product.id.toString()
  })) || [];
}

async function getProductData(id: string, category: string) {
  try {
    // Fetch the product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return { product: null, similarProducts: [] };
    }

    // Fetch similar products
    const { data: similarProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', id)
      .limit(4);

    return {
      product,
      similarProducts: similarProducts || [],
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return { product: null, similarProducts: [] };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string; category: string };
}) {
  const { product, similarProducts } = await getProductData(
    params.id,
    params.category
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h1>
          <a
            href="/products"
            className="text-amber-600 hover:text-amber-700"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <ProductDetail
      initialProduct={product}
      initialSimilarProducts={similarProducts}
    />
  );
}