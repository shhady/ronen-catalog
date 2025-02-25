'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

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
  text = text.replace(/\n\s*\n/g, '\n').trim(); // Remove multiple consecutive line breaks
  
  // Get only first three lines
  const lines = text.split('\n');
  const threeLines = lines.slice(0, 3);
  return threeLines.join('\n') + (lines.length > 3 ? '...' : '');
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    brandId: ''
  });

  useEffect(() => {
    Promise.all([fetchProducts(), fetchBrands()]);
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('query', filters.search);
      if (filters.brandId) queryParams.append('brand', filters.brandId);

      const res = await fetch(`/api/products?${queryParams}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('אירעה שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  // Add debounce to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brandId: ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('אירעה שגיאה במחיקת המוצר');
    }
  };

  if (loading) return <div className="text-center p-6">טוען...</div>;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ניהול מוצרים</h1>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            מוצר חדש
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">חיפוש לפי שם</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="הקלד לחיפוש..."
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">סינון לפי מותג</label>
            <select
              value={filters.brandId}
              onChange={(e) => handleFilterChange('brandId', e.target.value)}
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
        </div>
        {(filters.search || filters.brandId) && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              נקה סינון
            </Button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow overflow-hidden"
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
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3 whitespace-pre-line">
                    {stripHtml(product.description)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/dashboard/products/${product._id}/edit`}>
                  <Button size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" />
                    ערוך
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  מחק
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">לא נמצאו מוצרים</p>
          <Link href="/dashboard/products/new">
            <Button className="mt-4">הוסף מוצר חדש</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 