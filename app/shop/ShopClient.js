'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Search, Filter, X } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';

// Function to convert HTML to formatted text while preserving structure
const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  
  // Process block elements to add line breaks
  const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'];
  blockElements.forEach(tag => {
    const elements = tmp.getElementsByTagName(tag);
    for (let el of elements) {
      el.innerHTML = el.innerHTML + '\n';
    }
  });

  // Get text content and trim extra whitespace
  let text = tmp.textContent || tmp.innerText || '';
  return text.replace(/\n\s*\n/g, '\n').trim(); // Remove multiple consecutive line breaks
};

export default function ShopClient({ initialProducts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const initialQuery = searchParams.get('query');
  const initialSort = searchParams.get('sort');
  
  // Set initial loading state to true if there are URL filters
  const [loading, setLoading] = useState(
    !!(initialBrand || initialQuery || (initialSort && initialSort !== 'newest'))
  );
  const [products, setProducts] = useState(
    !!(initialBrand || initialQuery || (initialSort && initialSort !== 'newest'))
      ? []
      : initialProducts
  );
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    query: searchParams.get('query') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const isInitialLoad = useRef(true);
  const { setSelectedProduct } = useProduct();
  const [selectedBrand, setSelectedBrand] = useState(null);

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    // If there are initial filters, fetch filtered products
    if (initialBrand || initialQuery || (initialSort && initialSort !== 'newest')) {
      setLoading(true);
      fetchProducts({
        brand: initialBrand || '',
        query: initialQuery || '',
        sort: initialSort || 'newest'
      });
    }
  }, []); // Empty dependency array as this should only run once on mount

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Only update filters and fetch if not the initial load
    if (!isInitialLoad.current) {
      const newFilters = {
        brand: searchParams.get('brand') || '',
        query: searchParams.get('query') || '',
        sort: searchParams.get('sort') || 'newest',
      };
      setFilters(newFilters);
      setPage(1);
      // Only fetch if there are actual filters
      if (newFilters.brand || newFilters.query || newFilters.sort !== 'newest') {
        setLoading(true);
        setProducts([]);
        fetchProducts(newFilters);
      } else {
        // Reset to initial products if no filters
        setProducts(initialProducts);
        setLoading(false);
      }
    } else {
      isInitialLoad.current = false;
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (filters.brand) {
      const brand = brands.find(b => b._id === filters.brand);
      setSelectedBrand(brand);
    } else {
      setSelectedBrand(null);
    }
  }, [filters.brand, brands]);

  const fetchProducts = async (currentFilters) => {
    try {
      const queryParams = new URLSearchParams();
      if (currentFilters.brand) queryParams.append('brand', currentFilters.brand);
      if (currentFilters.query) queryParams.append('query', currentFilters.query);
      if (currentFilters.sort) queryParams.append('sort', currentFilters.sort);
      queryParams.append('page', '1');
      queryParams.append('limit', '20');

      const res = await fetch(`/api/products?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data = await res.json();
      setProducts(data);
      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('אירעה שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreProducts = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      const queryParams = new URLSearchParams({
        ...filters,
        page: nextPage,
        limit: 20
      });

      const res = await fetch(`/api/products?${queryParams}`);
      const newProducts = await res.json();

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(newProducts.length === 20);
      }
    } catch (error) {
      setError('אירעה שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      setError('אירעה שגיאה בטעינת המותגים');
    }
  };

  const handleFilterChange = (key, value) => {
    setProducts([]); // Clear products immediately
    setLoading(true); // Show loading state immediately
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    const queryParams = new URLSearchParams(newFilters);
    router.push(`/shop?${queryParams}`);
  };

  const clearFilters = () => {
    setLoading(true);
    setProducts(initialProducts);
    setFilters({
      brand: '',
      query: '',
      sort: 'newest',
    });
    setPage(1);
    setHasMore(true);
    router.push('/shop');
    setLoading(false);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Add this function to group products by brand
  const groupProductsByBrand = (products) => {
    return products.reduce((groups, product) => {
      const brandId = product.brandId?._id;
      if (!brandId) return groups;
      
      if (!groups[brandId]) {
        groups[brandId] = {
          brand: product.brandId,
          products: []
        };
      }
      groups[brandId].products.push(product);
      return groups;
    }, {});
  };

  // Function to fetch brand details
  const fetchBrandDetails = async (brandId) => {
    try {
      const res = await fetch(`/api/brands/${brandId}`);
      if (!res.ok) throw new Error('Failed to fetch brand details');
      const data = await res.json();
      setSelectedBrand(data);
    } catch (error) {
      console.error('Error fetching brand details:', error);
    }
  };

  // Effect to fetch brand details when brand filter changes
  useEffect(() => {
    if (filters.brand) {
      fetchBrandDetails(filters.brand);
    } else {
      setSelectedBrand(null);
    }
  }, [filters.brand]);

  if (loading && products.length === 0) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Static Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">סינון</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              נקה סינון
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4">
            <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">מותג</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">כל המותגים</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">מיון</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="newest">חדש ביותר</option>
                <option value="oldest">ישן ביותר</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Products Grid Loading State */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow border border-gray-400 overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
    

      <div className="flex flex-col gap-8">
       

        {/* Filters Sidebar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">סינון</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              נקה סינון
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4">
            <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">בחר מותג</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">כל המותגים</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">מיון</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="newest">חדש ביותר</option>
                <option value="oldest">ישן ביותר</option>
              </select>
            </div> */}
          </div>
        </div>
  {/* Brand Description Section */}
  {selectedBrand && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <div className="relative w-32 h-32">
              <Image
                src={selectedBrand.logo}
                alt={selectedBrand.name}
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold">{selectedBrand.name}</h1>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">
              {stripHtml(selectedBrand.longDescription || selectedBrand.description)}
            </p>
          </div>
        </div>
      )}
        {/* Products Grid */}
        <div className="flex-1">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {Object.values(groupProductsByBrand(products)).map((group) => (
              <div key={group.brand._id} className="space-y-4">
               {!selectedBrand && <h2 className="text-xl font-bold border-b pb-2">{group.brand.name}</h2>} 
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {group.products.map((product, index) => (
                    <div
                      key={product._id}
                      ref={index === products.length - 1 ? lastProductElementRef : null}
                      className="bg-white rounded-lg shadow overflow-hidden relative"
                    >
                      <Link 
                        href={`/product/${product._id}`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="relative h-48">
                          {product.imageUrl && (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-contain p-4"
                            />
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/product/${product._id}`}>
                              <h3 className="text-md font-semibold">{product.name}</h3>
                            </Link>
                            <div className="text-sm text-gray-600 mt-1">
                              משקל: {product.weight || 'לא צוין'} {product.weightUnit || ''}
                            </div>
                            {/* <div className="text-sm text-gray-600">
                              מחיר: {product.price ? `₪${product.price}` : 'אין במלאי'}
                            </div> */}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product._id);
                            }}
                            className="text-gray-500 hover:text-red-500 absolute top-2 left-2"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                favorites.includes(product._id)
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">לא נמצאו מוצרים</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">טוען מוצרים נוספים...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 