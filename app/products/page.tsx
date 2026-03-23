'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mockData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/app/providers';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scentFilter, setScentFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceSort, setPriceSort] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  const scents = [...new Set(mockProducts.map((p) => p.scent))];
  const sizes = [...new Set(mockProducts.map((p) => p.size))];

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesScent = !scentFilter || product.scent === scentFilter;
      const matchesSize = !sizeFilter || product.size === sizeFilter;

      return matchesSearch && matchesScent && matchesSize;
    });

    if (priceSort === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchTerm, scentFilter, sizeFilter, priceSort]);

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addToCart(product, 1);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of premium scented candles, each one crafted to bring warmth and elegance to your space.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search candles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Section */}
          <div className={`bg-card border border-border rounded-lg p-6 mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Scent Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Scent Type</label>
                <select
                  value={scentFilter}
                  onChange={(e) => setScentFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">All Scents</option>
                  {scents.map((scent) => (
                    <option key={scent} value={scent}>
                      {scent}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Size</label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Sort */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sort by Price</label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="none">Default</option>
                  <option value="low-high">Low to High</option>
                  <option value="high-low">High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setScentFilter('');
                    setSizeFilter('');
                    setPriceSort('none');
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground text-xl font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setScentFilter('');
                  setSizeFilter('');
                  setPriceSort('none');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                          {product.scent}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-5">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                      <span className="bg-muted px-2 py-1 rounded">{product.size}</span>
                      <span className="bg-muted px-2 py-1 rounded">{product.burnTime}h burn</span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">Rs. {product.price}</span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
