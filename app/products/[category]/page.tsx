import { Metadata } from 'next';
import { getCategories, getCategoryDetails } from '@/lib/supabase';
import ProductListing from '../page';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category: string) => ({
    category,
  }));
}

export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const categoryDetails = await getCategoryDetails(params.category);

  if (!categoryDetails) {
    return {
      title: `${params.category.replace(/-/g, ' ')} | Wholesale Products – Shiv Watches`,
      description: `Explore wholesale ${params.category.replace(/-/g, ' ')} products at Shiv Watches. Best bulk prices, fast delivery & trusted by 1000+ resellers in India.`,
      keywords: [
        `wholesale ${params.category.replace(/-/g, ' ')}`,
        `${params.category.replace(/-/g, ' ')} best wholesale prices`,
        `wholesale ${params.category.replace(/-/g, ' ')} India`,
        "wholesaler in delhi",
        "buy in bulk for resale",
        "Shiv Watches",
        "B2B supplier",
      ],
      alternates: {
        canonical: `https://www.shivwatches.com/products/${params.category}`,
      },
      openGraph: {
        title: `${params.category.replace(/-/g, ' ')} | Wholesale Products – Shiv Watches`,
        description: `Explore wholesale ${params.category.replace(/-/g, ' ')} products at Shiv Watches.`,
        images: [
          {
            url: "/images/logo2.png",
            width: 1200,
            height: 630,
            alt: `Shiv Watches ${params.category.replace(/-/g, ' ')} Products`,
          },
        ],
      },
    };
  }

  return {
    title: categoryDetails.meta_title,
    description: categoryDetails.meta_description,
    keywords: [
      `wholesale ${params.category.replace(/-/g, ' ')}`,
      `bulk ${params.category.replace(/-/g, ' ')} India`,
      ...(categoryDetails.meta_keywords?.split(',') || []),
      "watch parts supplier",
      "buy in bulk for resale",
      "Shiv Watches products"
    ],
    alternates: {
      canonical: `https://www.shivwatches.com/products/${params.category}`,
    },
    openGraph: {
      title: categoryDetails.meta_title,
      description: categoryDetails.meta_description,
      images: [
        {
          url: categoryDetails.og_image || "/images/logo2.png",
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
