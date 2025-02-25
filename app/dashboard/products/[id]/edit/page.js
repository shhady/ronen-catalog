'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg overflow-hidden bg-white min-h-[300px] animate-pulse" />
  ),
});

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brandId: '',
    country: '',
    imageUrl: '',
    units: '',
    weight: '',
    weightUnit: '',
  });

  useEffect(() => {
    Promise.all([fetchProduct(), fetchBrands()]);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      const product = await res.json();
      setFormData({
        name: product.name,
        description: product.description || '',
        brandId: product.brandId?._id || product.brandId || '',
        country: product.country || '',
        imageUrl: product.imageUrl || '',
        units: product.units || '',
        weight: product.weight || '',
        weightUnit: product.weightUnit || '',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('אירעה שגיאה בטעינת המוצר');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          brandId: formData.brandId,
          country: formData.country,
          imageUrl: formData.imageUrl,
          units: formData.units,
          weight: formData.weight,
          weightUnit: formData.weightUnit,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error('JSON parse error:', err);
        throw new Error('אירעה שגיאה בעדכון המוצר');
      }

      if (!res.ok) {
        throw new Error(data?.message || 'אירעה שגיאה בעדכון המוצר');
      }

      router.push('/dashboard/products');
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ronen-catalog');
      formData.append('folder', 'products');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.response);
          setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
          setUploadProgress(0);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setError('אירעה שגיאה בהעלאת התמונה: ' + error.message);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return <div className="text-center p-6">טוען...</div>;
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">עריכת מוצר</h1>
        <Link href="/dashboard/products">
          <Button className="gap-2">
            <ArrowRight className="w-4 h-4" />
            חזרה למוצרים
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">שם המוצר</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">מותג</label>
            <select
              value={formData.brandId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brandId: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">בחר מותג</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ארץ ייצור</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">יחידות באריזה</label>
            <input
              type="number"
              value={formData.units}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, units: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">משקל</label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, weight: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">יחידת משקל</label>
            <select
              value={formData.weightUnit}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, weightUnit: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">בחר יחידת משקל</option>
              <option value='ק"ג'>ק"ג</option>
              <option value="גרם">גרם</option>
              <option value="ליטר">ליטר</option>
              <option value="מ״ל">מ״ל</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">תיאור</label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תמונה
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary/50 transition-colors">
            <div className="space-y-2 text-center">
              {formData.imageUrl ? (
                <div className="relative w-40 h-40 mx-auto">
                  <Image
                    src={formData.imageUrl}
                    alt="Product preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <> 
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-full px-24"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="font-medium text-primary hover:text-primary/90">העלה קובץ</span>
                      {/* <p className="pr-1">או גרור ושחרר</p> */}
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG עד 10MB</p>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {!formData.imageUrl && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">מעלה... {uploadProgress}%</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'שומר...' : 'עדכן מוצר'}
          </Button>
          <Link href="/dashboard/products">
            <Button type="button" >
              ביטול
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
} 