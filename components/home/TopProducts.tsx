'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, MessageCircle, ArrowRight, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, type Product } from '../../lib/supabase';
import ProductCard from '../products/ProductCard';

const normalizeCoverImage = (cover_img: string | string[]): string => {
  if (Array.isArray(cover_img)) {
    return cover_img[0] || '';
  }
  return cover_img;
};
const TopProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [viewAllRef, viewAllInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('tags', ['trending'])
        .order('rating', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-3">
                <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded-md mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10"
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🔥 Trending Products
          </motion.h2>
          <motion.p 
            className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover the hottest wholesale items that businesses are buying right now
          </motion.p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <Link href={`/products/${product.category}/${product.id}`}>
                <div className="relative">
                  <Image
                    src={normalizeCoverImage(product.cover_img)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.tags.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                        product.tags[0] === 'trending' ? 
                        'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 
                        product.tags[0] === 'bestseller' ? 
                        'bg-red-500 text-white' : 
                        'bg-amber-500 text-white'
                      }`}>
                        {product.tags[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        ₹{product.price}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        MOQ: {product.moq} pieces
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="px-6 pb-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const message = `Hi! I'm interested in wholesale inquiry for ${product.name}. MOQ: ${product.moq} pieces. Price: ₹${product.price}. Please share more details.`;
                    const whatsappUrl = `https://wa.me/919821964539?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-colors flex items-center justify-center text-base transform hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Quick Inquiry
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile view */}
        <div className="grid grid-cols-2 md:hidden gap-4 mb-10">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode="grid" 
              href={`/products/${product.category}/${product.id}`}
            />
          ))}
        </div>

        {!loading && products.length > 0 && (
          <motion.div 
            ref={viewAllRef}
            className="text-center"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={viewAllInView ? { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            } : { 
              opacity: 0, 
              y: 30, 
              scale: 0.9 
            }}
          >
            <Link href="/products">
              <motion.button
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(245, 158, 11, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">View All Products</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm mt-3"
              initial={{ opacity: 0 }}
              animate={viewAllInView ? { 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.4
                }
              } : { opacity: 0 }}
            >
              Explore our complete catalog of wholesale products
            </motion.p>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-3">📊</div>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-1">
              No trending products found at the moment.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Check back soon for the latest trending items!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;
