'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Upload, Edit2 } from 'lucide-react';

export default function HeroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentHero, setCurrentHero] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchHero();
  }, []);
console.log(newImageUrl)
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero');
      if (!res.ok) throw new Error('Failed to fetch hero');
      const data = await res.json();
      setCurrentHero(data);
    } catch (error) {
      console.error('Error fetching hero:', error);
      setError('אירעה שגיאה בטעינת תמונת הראשית');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ronen-catalog');
      formData.append('folder', 'hero');

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
          setNewImageUrl(data.secure_url);
          setIsEditing(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newImageUrl) return;

    try {
      setLoading(true);
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: newImageUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to save hero image');
      }

      // Update current hero and reset editing state
      setCurrentHero({ imageUrl: newImageUrl });
      setNewImageUrl('');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
      setError('אירעה שגיאה בשמירת התמונה');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setNewImageUrl('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ניהול תמונה ראשית</h1>
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowRight className="w-4 h-4" />
            חזרה ללוח בקרה
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Current Hero Image */}
          {currentHero?.imageUrl && !isEditing && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">תמונה ראשית נוכחית</h2>
              <div className="relative w-full h-[400px]">
                <Image
                  src={currentHero.imageUrl}
                  alt="Current hero"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                ערוך תמונה ראשית
              </Button>
            </div>
          )}

          {/* Upload New Image */}
          {isEditing && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">העלה תמונה חדשה</h2>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                <div className="space-y-2 text-center w-full">
                  {newImageUrl ? (
                    <div className="relative w-full h-[400px]">
                      <Image
                        src={newImageUrl}
                        alt="New hero preview"
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full px-24"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-medium text-primary hover:text-primary/90">
                          העלה קובץ
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG עד 10MB</p>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={loading}
                      />
                    </label>
                  )}
                  {!newImageUrl && uploadProgress > 0 && (
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
                </div>
              </div>

              {/* Submit and Cancel Buttons */}
              {newImageUrl && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'שומר...' : 'שמור שינויים'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    ביטול
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 