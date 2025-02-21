export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Loading State */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="text-center">
          <div className="h-12 w-3/4 bg-gray-300 rounded-lg mb-4 mx-auto"></div>
          <div className="h-6 w-1/2 bg-gray-300 rounded-lg mb-8 mx-auto"></div>
          <div className="h-12 w-40 bg-gray-300 rounded-lg mx-auto"></div>
        </div>
      </section>

      {/* Brands Section Loading State */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="h-10 w-48 bg-gray-200 rounded-lg mb-12 mx-auto"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="relative h-40 mb-4 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 