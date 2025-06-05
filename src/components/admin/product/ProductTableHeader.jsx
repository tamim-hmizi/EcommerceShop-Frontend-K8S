
import {
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiBox,
  FiShoppingBag,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";

const ProductTableHeader = ({
  products,
  refreshing,
  loading,
  handleRefresh,
  handleAddProduct
}) => {
  return (
    <div className="admin-header p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <FiPackage className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">Product Management</h1>
            <p className="text-base-content/70">Manage your store's product inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`btn btn-circle btn-ghost ${refreshing ? 'animate-spin' : ''}`}
            disabled={refreshing || loading}
            title="Refresh products"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>

          <button
            onClick={handleAddProduct}
            className="btn btn-primary gap-2"
          >
            <FiPlus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="admin-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Total Products</div>
              <div className="text-2xl font-bold text-primary">{products ? products.length : 0}</div>
            </div>
            <div className="text-primary">
              <FiBox className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">In Stock</div>
              <div className="text-2xl font-bold text-success">
                {products ? products.filter(product => product.stock > 0).length : 0}
              </div>
            </div>
            <div className="text-success">
              <FiCheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Low Stock</div>
              <div className="text-2xl font-bold text-warning">
                {products ? products.filter(product => product.stock > 0 && product.stock <= 10).length : 0}
              </div>
            </div>
            <div className="text-warning">
              <FiAlertCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Out of Stock</div>
              <div className="text-2xl font-bold text-error">
                {products ? products.filter(product => product.stock === 0).length : 0}
              </div>
            </div>
            <div className="text-error">
              <FiShoppingBag className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTableHeader;
