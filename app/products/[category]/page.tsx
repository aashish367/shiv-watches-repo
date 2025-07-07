import { Metadata } from 'next';
import ProductListing from '../page';
import { getCategories, getCategoryDetails } from '@/lib/supabase';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category: string) => ({
    category,
  }));
}

export async function generateMetadata(
  props: { params: { category: string } }
): Promise<Metadata> {
  const { params } = props;
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

export default function CategoryPage() {
  return <ProductListing />;
}
