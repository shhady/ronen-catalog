'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  Tags,
  Users,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const StatCard = ({ title, value, icon: Icon, isLoading }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 text-gray-900">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            value.toLocaleString()
          )}
        </h3>
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    brands: 0,
    websiteViews: 0,
    whatsappClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats', {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('אירעה שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 pt-6">לוח בקרה</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Package className="w-4 h-4" />
            מוצר חדש
          </Button>
        </Link>
        <Link href="/dashboard/brands/new">
          <Button className="gap-2">
            <Tags className="w-4 h-4" />
            מותג חדש
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="סך הכל מוצרים"
          value={stats.products}
          icon={Package}
          isLoading={loading}
        />
        <StatCard
          title="סך הכל מותגים"
          value={stats.brands}
          icon={Tags}
          isLoading={loading}
        />
        <StatCard
          title="מבקרים"
          value={stats.websiteViews}
          icon={Users}
          isLoading={loading}
        />
        <StatCard
          title="לחיצות וואטסאפ"
          value={stats.whatsappClicks}
          icon={MessageSquare}
          isLoading={loading}
        />
      </div>
    </div>
  );
} 