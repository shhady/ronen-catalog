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

export default function EditBrandPage({ params }) {
  const id = use(params).id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    logo: '',
  });

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${id}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch brand');
      }
      const data = await res.json();
      setFormData({
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        logo: data.logo,
      });
    } catch (error) {
      console.error('Error fetching brand:', error);
      setError('אירעה שגיאה בטעינת המותג');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/brands', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'אירעה שגיאה בעדכון המותג');
      }

      router.push('/dashboard/brands');
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
      formData.append('folder', 'brands');

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
          setFormData((prev) => ({ ...prev, logo: data.secure_url }));
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
        <h1 className="text-3xl font-bold text-gray-900">עריכת מותג</h1>
        <Link href="/dashboard/brands">
          <Button className="gap-2">
            <ArrowRight className="w-4 h-4" />
            חזרה למותגים
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">שם המותג</label>
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
            <label className="block text-sm font-medium mb-1">תיאור קצר</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">תיאור מלא</label>
            <RichTextEditor
              value={formData.longDescription}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, longDescription: value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              לוגו
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary/50 transition-colors">
              <div className="space-y-2 text-center">
                {formData.logo ? (
                  <div className="relative w-40 h-40 mx-auto">
                    <Image
                      src={formData.logo}
                      alt="Brand logo preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>

        {!formData.logo && uploadProgress > 0 && (
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
            {loading ? 'שומר...' : 'עדכן מותג'}
          </Button>
          <Link href="/dashboard/brands">
            <Button type="button" >
              ביטול
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
} 