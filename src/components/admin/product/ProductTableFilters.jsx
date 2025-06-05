
import { FiSearch } from "react-icons/fi";

const ProductTableFilters = ({
  searchQuery,
  handleSearch,
  categoryFilter,
  handleCategoryFilter,
  stockFilter,
  handleStockFilter,
  categories
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="form-control flex-1">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              className="btn btn-square btn-primary"
              onClick={(e) => {
                e.preventDefault();
                // The search is already handled by the input onChange
              }}
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="form-control md:w-64">
          <select
            className="select select-bordered w-full"
            value={categoryFilter}
            onChange={handleCategoryFilter}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => handleStockFilter("all")}
            className={`btn btn-sm ${stockFilter === "all" ? "btn-primary" : "btn-outline"}`}
          >
            All
          </button>
          <button
            onClick={() => handleStockFilter("inStock")}
            className={`btn btn-sm ${stockFilter === "inStock" ? "btn-success" : "btn-outline"}`}
          >
            In Stock
          </button>
          <button
            onClick={() => handleStockFilter("lowStock")}
            className={`btn btn-sm ${stockFilter === "lowStock" ? "btn-warning" : "btn-outline"}`}
          >
            Low Stock
          </button>
          <button
            onClick={() => handleStockFilter("outOfStock")}
            className={`btn btn-sm ${stockFilter === "outOfStock" ? "btn-error" : "btn-outline"}`}
          >
            Out of Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTableFilters;
