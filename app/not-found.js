import Link from 'next/link';
import { Button } from './components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">הדף לא נמצא</h2>
        <p className="text-gray-600 mb-8">
          מצטערים, הדף שחיפשת אינו קיים או הוסר.
        </p>
        <Link href="/">
          <Button>
            חזרה לדף הבית
          </Button>
        </Link>
      </div>
    </div>
  );
} 