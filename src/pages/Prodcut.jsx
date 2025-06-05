import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";
import { fetchProducts, refreshProducts } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import {
  FiFilter,
  FiX,
  FiSearch,
  FiShoppingBag,
  FiTag,
  FiSliders,
  FiRefreshCw
} from "react-icons/fi";

function ProductList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, loading: productsLoading, refreshing } = useSelector((state) => state.products);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high, newest
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Fetch products from Redux store
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch categories
        const cats = await getCategories();
        setCategories(cats.data);

        // Fetch products if not already loaded
        if (products.length === 0) {
          dispatch(fetchProducts());
        } else {
          setFilteredProducts(products);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch, products.length]);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?._id === activeCategory
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.category?.name.toLowerCase().includes(query) || false)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "featured":
      default:
        // Keep the original order or apply a featured sorting logic
        break;
    }

    setFilteredProducts(filtered);
  }, [activeCategory, searchQuery, products, sortBy, priceRange]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setPriceRange([0, 1000]);
  };

  // Handle manual refresh of products
  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(refreshProducts()).finally(() => {
      setIsRefreshing(false);
    });
  };

  if (loading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/25" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-base-100 shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-base-content">Filters</h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Mobile Categories */}
              <div>
                <h3 className="font-medium text-base-content mb-2">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === "all" ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'}`}
                      onClick={() => handleCategoryClick("all")}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === cat._id ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'}`}
                        onClick={() => handleCategoryClick(cat._id)}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Price Range */}
              <div>
                <h3 className="font-medium text-base-content mb-2">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2 text-sm text-base-content/60">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="range range-xs range-primary mb-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="range range-xs range-primary"
                  />
                </div>
              </div>

              {/* Mobile Sort Options */}
              <div>
                <h3 className="font-medium text-base-content mb-2">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "newest", label: "Newest" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === option.value ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Reset Filters */}
              {(activeCategory !== "all" || searchQuery || sortBy !== "featured" || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <button
                  onClick={resetFilters}
                  className="btn btn-sm btn-outline btn-primary w-full"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-base-content">Our Products</h1>
            <p className="mt-2 text-base-content/70">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content placeholder:text-base-content/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline bg-base-100 text-base-content border-base-300 hover:bg-base-200 hover:text-base-content hover:border-base-content"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <FiRefreshCw className={`w-5 h-5 mr-2 text-base-content ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                className="btn btn-outline lg:hidden bg-base-100 text-base-content border-base-300 hover:bg-base-200"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Sort Controls - Desktop */}
        <div className="hidden lg:flex justify-between items-center mb-6 bg-base-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-base-content/70">Sort by:</span>
            <select
              className="select select-bordered select-sm bg-base-100 text-base-content"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <span className="text-sm text-base-content/60">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300 sticky top-8">
              <h2 className="font-medium text-base-content mb-4 flex items-center gap-2">
                <FiSliders className="w-5 h-5 text-primary" />
                Filters
              </h2>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-base-content mb-3 flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-primary" />
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === "all" ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'}`}
                        onClick={() => handleCategoryClick("all")}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === cat._id ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'}`}
                          onClick={() => handleCategoryClick(cat._id)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-base-content mb-3 flex items-center gap-2">
                    <FiShoppingBag className="w-4 h-4 text-primary" />
                    Price Range
                  </h3>
                  <div className="px-2">
                    <div className="flex justify-between mb-2 text-sm text-base-content/60">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="range range-xs range-primary mb-2"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="range range-xs range-primary"
                    />
                  </div>
                </div>

                {/* Reset Filters */}
                {(activeCategory !== "all" || searchQuery || sortBy !== "featured" || priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <button
                    onClick={resetFilters}
                    className="btn btn-sm btn-outline btn-primary w-full"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-12 text-center">
                <div className="mx-auto h-24 w-24 text-base-content/40 mb-4">
                  <FiX className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-base-content mb-1">No products found</h3>
                <p className="text-base-content/60 mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductList;