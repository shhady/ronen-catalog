'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Separate component for search functionality
function SearchComponent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeoutRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      const res = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
      setShowSearchDropdown(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  return (
    <div className="relative max-w-md w-full mx-4">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש מוצרים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showSearchDropdown && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              {product.imageUrl && (
                <div className="relative w-12 h-12 mr-3">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              )}
              <div>
                <div className="text-gray-900 font-medium">{product.name}</div>
                {product.brandId && (
                  <div className="text-gray-500 text-sm">{product.brandId.name}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchBrands();
    checkAuthStatus();
    // Close mobile menu when pathname changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      setIsAuthenticated(res.ok);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            {/* <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            /> */}
            <span className="text-xl font-bold text-gray-900 mr-2">רונן קטלוג</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between flex-1 mr-8">
            <div className="flex items-center  gap-4">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
              >
                דף הבית
              </Link>

              <Link 
                href="/favorites" 
                className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
              >
                מועדפים
              </Link>

            
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-900 hover:text-gray-600 transition-colors font-medium"
                >
                  מותגים
                  <ChevronDown className={`w-4 h-4 mr-1 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    {brands?.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/shop?brand=${brand._id}&query=&sort=newest`}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        

                        <div className="text-gray-900 font-medium mb-1 flex items-center gap-2"><Image src={brand.logo} alt={brand.name} width={20} height={20} className="object-contain rounded" />{brand.name}</div>
                        <div className="text-gray-600 text-sm line-clamp-2">{brand.description}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
                >
                  לוח בקרה
                </Link>
              )}
              
            </div>

            {/* Search Component wrapped in Suspense */}
            <Suspense fallback={<div className="w-full max-w-md h-10 bg-gray-100 rounded-lg animate-pulse" />}>
              <SearchComponent />
            </Suspense>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                <SearchComponent />
              </Suspense>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  דף הבית
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  מועדפים
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    לוח בקרה
                  </Link>
                )}

                {/* Mobile Brands */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">מותגים</h3>
                  <div className="space-y-2">
                    {brands?.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/shop?brand=${brand._id}`}
                        className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Image src={brand.logo} alt={brand.name} width={20} height={20} className="object-contain rounded" />
                          {brand.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 