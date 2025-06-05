
import {
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiTag,
  FiImage,
  FiBox,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiPackage
} from "react-icons/fi";
import Loading from "../../../components/Loading";

const ProductTable = ({
  loading,
  currentProducts,
  sortedProducts,
  imageURLs,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  setDeleteConfirm,
  searchQuery,
  categoryFilter,
  stockFilter,
  setSearchQuery,
  setCategoryFilter,
  setStockFilter
}) => {
  return (
    <div className="admin-table">
      {loading ? (
        <div className="flex justify-center items-center h-64 admin-card p-6">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th
                  className="cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ?
                        <FiArrowUp className="w-4 h-4 text-primary" /> :
                        <FiArrowDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ?
                        <FiArrowUp className="w-4 h-4 text-primary" /> :
                        <FiArrowDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-2">
                    Stock
                    {sortField === 'stock' && (
                      sortDirection === 'asc' ?
                        <FiArrowUp className="w-4 h-4 text-primary" /> :
                        <FiArrowDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-2">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ?
                        <FiArrowUp className="w-4 h-4 text-primary" /> :
                        <FiArrowDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length > 0 && currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-base-200 transition-colors">
                    <td>
                      {imageURLs[product._id] ? (
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-lg ring-2 ring-base-300 overflow-hidden">
                            <img
                              src={imageURLs[product._id]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center">
                          <FiImage className="h-8 w-8 text-base-content/40" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="font-semibold text-base-content">{product.name}</div>
                      <div className="text-sm text-base-content/60 line-clamp-2 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FiDollarSign className="text-success mr-1 w-4 h-4" />
                        <span className="font-semibold text-success">
                          {parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-lg gap-2 ${
                        product.stock > 10 ? 'badge-success' :
                        product.stock > 0 ? 'badge-warning' : 'badge-error'
                      }`}>
                        {product.stock > 0 ? <FiBox className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
                        {product.stock} in stock
                      </span>
                    </td>
                    <td>
                      {product.category ? (
                        <span className="badge badge-primary badge-lg gap-2">
                          <FiTag className="w-4 h-4" />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="badge badge-ghost">Uncategorized</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-sm btn-outline btn-primary hover:scale-105 transition-transform"
                          title="Edit product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="btn btn-sm btn-outline btn-error hover:scale-105 transition-transform"
                          title="Delete product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-base-200 p-6 rounded-full mb-6">
                        <FiPackage className="h-16 w-16 text-base-content/40" />
                      </div>
                      <h3 className="text-xl font-semibold text-base-content mb-2">
                        No products found
                      </h3>
                      <p className="text-base-content/60 mb-4 max-w-md">
                        {searchQuery || categoryFilter || stockFilter !== "all"
                          ? "Try adjusting your search or filters to find what you're looking for"
                          : "Get started by creating your first product to begin managing your inventory"}
                      </p>
                      {(searchQuery || categoryFilter || stockFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('');
                            setStockFilter('all');
                          }}
                          className="btn btn-outline btn-primary"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
