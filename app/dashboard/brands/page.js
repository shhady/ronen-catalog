'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBrands();
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
      setError('אירעה שגיאה בטעינת המותגים');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המותג?')) return;

    try {
      const res = await fetch(`/api/brands?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete brand');
      }

      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      setError('אירעה שגיאה במחיקת המותג');
    }
  };

  if (loading) return <div className="text-center p-6">טוען...</div>;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ניהול מותגים</h1>
        <Link href="/dashboard/brands/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            מותג חדש
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative h-48">
              {brand.logo && (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-4"
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{brand.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {brand.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/dashboard/brands/${brand._id}/edit`}>
                  <Button size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" />
                    ערוך
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(brand._id)}
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

      {brands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">לא נמצאו מותגים</p>
          <Link href="/dashboard/brands/new">
            <Button className="mt-4">הוסף מותג חדש</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 