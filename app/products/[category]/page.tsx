import { Metadata } from 'next';
import ProductListing from '../page';
import { getCategories, getCategoryDetails } from '@/lib/supabase';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface CategoryPageParams {
  category: string;
}

interface CategoryPageProps {
  params: CategoryPageParams;
}

export async function generateStaticParams(): Promise<CategoryPageParams[]> {
  const categories = await getCategories();
  return categories.map((category: string) => ({
    category,
  }));
}

export async function generateMetadata(
  { params }: { params: CategoryPageParams }
): Promise<Metadata> {
  const categoryDetails = await getCategoryDetails(params.category);

  const title = categoryDetails?.meta_title || `${params.category.replace(/-/g, ' ')} | Wholesale Products – Shiv Watches`;
  const description = categoryDetails?.meta_description || `Explore wholesale ${params.category.replace(/-/g, ' ')} products at Shiv Watches. Best bulk prices, fast delivery & trusted by 1000+ resellers in India.`;

  return {
    title,
    description,
    keywords: [
      `wholesale ${params.category.replace(/-/g, ' ')}`,
      `bulk ${params.category.replace(/-/g, ' ')} India`,
      ...(categoryDetails?.meta_keywords?.split(',') || []),
      'watch parts supplier',
      'buy in bulk for resale',
      'Shiv Watches products',
    ],
    alternates: {
      canonical: `https://www.shivwatches.com/products/${params.category}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: categoryDetails?.og_image || '/images/logo2.png',
          width: 1200,
          height: 630,
          alt: `Shiv Watches ${params.category.replace(/-/g, ' ')} Products`,
        },
      ],
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <ProductListing />;
}