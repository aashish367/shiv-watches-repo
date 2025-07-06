import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  moq: number;
  category: string;
  subcategory: string;
  brand?: string;
  model?: string;
  rating: number;
  reviews: number;
  tags: string[];
  inStock: boolean;
  cover_img: string;
  images: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

// Helper function to get categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) throw error;

    const categories = Array.from(new Set(data?.map(item => item.category) || []));
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
// lib/supabase.ts
export async function getCategoryDetails(categorySlug: string) {
  // Query your Supabase database for category details
  const { data, error } = await supabase
    .from('categories')
    .select('meta_title, meta_description, meta_keywords, og_image')
    .eq('slug', categorySlug)
    .single();

  if (error) {
    console.error('Error fetching category details:', error);
    return null;
  }

  return data;
}