import { useEffect, useState, useCallback } from "react";
import { getAllOrders, updateOrderStatusAndPayment } from "../../services/OrderService";
import Loading from "../Loading";
import {
  FiEdit,
  FiDollarSign,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiShoppingCart,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

function AdminOrderTable({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    _id: null,
    isPaid: false,
    status: "Pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchOrders = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getAllOrders(token);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }

    setLoading(false);
    setRefreshing(false);
  }, [token]);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort orders based on sort field and direction
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;

    // Handle different field types
    switch(sortField) {
      case 'totalPrice':
        aValue = a.totalPrice || 0;
        bValue = b.totalPrice || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'customer':
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
        break;
      default:
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
    }

    // Compare based on direction
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next or previous page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (order) => {
    setForm({
      _id: order._id,
      isPaid: order.isPaid,
      status: order.status,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatusAndPayment(
        form._id,
        { isPaid: form.isPaid, status: form.status },
        token
      );
      setIsModalOpen(false);
      setForm({ _id: null, isPaid: false, status: "Pending" });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      setErrors({ backend: error.response?.data?.message || "Update failed" });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return <span className="badge badge-warning gap-1"><FiClock className="w-3 h-3" /> Processing</span>;
      case 'Shipped':
        return <span className="badge badge-info gap-1"><FiTruck className="w-3 h-3" /> Shipped</span>;
      case 'Delivered':
        return <span className="badge badge-success gap-1"><FiCheckCircle className="w-3 h-3" /> Delivered</span>;
      default:
        return <span className="badge badge-error gap-1"><FiAlertCircle className="w-3 h-3" /> Pending</span>;
    }
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid ? (
      <span className="badge badge-success gap-1"><FiDollarSign className="w-3 h-3" /> Paid</span>
    ) : (
      <span className="badge badge-error gap-1"><FiDollarSign className="w-3 h-3" /> Unpaid</span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="admin-header p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg mr-4">
              <FiShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">Order Management</h1>
              <p className="text-base-content/70">View and manage customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`btn btn-circle btn-ghost ${refreshing ? 'animate-spin' : ''}`}
              disabled={refreshing || loading}
              title="Refresh orders"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>

            <div className="form-control w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-base-content/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="admin-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/70">Total Orders</div>
                <div className="text-2xl font-bold text-primary">{orders.length}</div>
              </div>
              <div className="text-primary">
                <FiShoppingCart className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="admin-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/70">Delivered</div>
                <div className="text-2xl font-bold text-success">
                  {orders.filter(order => order.status === 'Delivered').length}
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
                <div className="text-sm text-base-content/70">Pending</div>
                <div className="text-2xl font-bold text-warning">
                  {orders.filter(order => order.status === 'Pending').length}
                </div>
              </div>
              <div className="text-warning">
                <FiClock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="admin-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/70">Total Revenue</div>
                <div className="text-2xl font-bold text-info">
                  ${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="text-info">
                <FiDollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 admin-card p-6">
          <Loading />
        </div>
      ) : (
        <div className="admin-table">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('_id')}
                  >
                    <div className="flex items-center gap-1">
                      Order ID
                      {sortField === '_id' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {sortField === 'customer' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('isPaid')}
                  >
                    <div className="flex items-center gap-1">
                      Payment
                      {sortField === 'isPaid' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('totalPrice')}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      {sortField === 'totalPrice' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover">
                      <td>
                        <div className="font-medium text-base-content">
                          <span className="font-mono">#{order._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium text-base-content">{order.user?.name || "Guest"}</div>
                          <div className="text-base-content/70 text-sm">{order.user?.email || "No email"}</div>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(order.status || "Pending")}
                      </td>
                      <td>
                        {getPaymentBadge(order.isPaid)}
                      </td>
                      <td>
                        <div className="font-medium text-primary">${order.totalPrice?.toFixed(2) || "0.00"}</div>
                      </td>
                      <td>
                        <div className="text-base-content/70">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleEdit(order)}
                          className="btn btn-sm btn-outline btn-primary gap-1"
                        >
                          <FiEdit className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-base-200 p-4 rounded-full mb-4">
                          <FiAlertCircle className="h-12 w-12 text-base-content/40" />
                        </div>
                        <h3 className="text-lg font-medium text-base-content">No orders found</h3>
                        <p className="text-base-content/70 mt-1">
                          {searchQuery ? "Try adjusting your search query" : "There are no orders to display"}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="btn btn-sm btn-outline mt-4"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedOrders.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-base-300">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-base-content/70">
                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastOrder, sortedOrders.length)}
                    </span>{" "}
                    of <span className="font-medium">{sortedOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-ghost"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`btn btn-sm ${
                          currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-ghost"
                    >
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Order Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-md bg-base-100">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FiEdit className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl">Update Order Status</h3>
          </div>

          {form._id && (
            <div className="bg-base-200 p-3 rounded-lg mb-6">
              <div className="text-sm text-base-content/70">Order ID</div>
              <div className="font-mono font-medium text-base-content">#{form._id.slice(-6)}</div>
            </div>
          )}

          {errors.backend && (
            <div className="alert alert-error mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2">{errors.backend}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Payment Status</span>
                </label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${form.isPaid ? 'bg-success/10 border-success' : 'bg-base-100 hover:bg-base-200'}`}>
                    <input
                      type="radio"
                      name="isPaid"
                      className="radio radio-success"
                      checked={form.isPaid === true}
                      onChange={() => setForm({ ...form, isPaid: true })}
                    />
                    <div>
                      <FiDollarSign className="w-5 h-5 text-success" />
                      <div className="font-medium mt-1">Paid</div>
                    </div>
                  </label>

                  <label className={`flex-1 flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${!form.isPaid ? 'bg-error/10 border-error' : 'bg-base-100 hover:bg-base-200'}`}>
                    <input
                      type="radio"
                      name="isPaid"
                      className="radio radio-error"
                      checked={form.isPaid === false}
                      onChange={() => setForm({ ...form, isPaid: false })}
                    />
                    <div>
                      <FiDollarSign className="w-5 h-5 text-error" />
                      <div className="font-medium mt-1">Unpaid</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Order Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {/* Status indicators */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className={`text-center p-2 rounded-lg text-xs ${form.status === 'Pending' ? 'bg-error/10 text-error font-medium' : 'bg-base-200'}`}>
                    <FiAlertCircle className="w-4 h-4 mx-auto mb-1" />
                    Pending
                  </div>
                  <div className={`text-center p-2 rounded-lg text-xs ${form.status === 'Processing' ? 'bg-warning/10 text-warning font-medium' : 'bg-base-200'}`}>
                    <FiClock className="w-4 h-4 mx-auto mb-1" />
                    Processing
                  </div>
                  <div className={`text-center p-2 rounded-lg text-xs ${form.status === 'Shipped' ? 'bg-info/10 text-info font-medium' : 'bg-base-200'}`}>
                    <FiTruck className="w-4 h-4 mx-auto mb-1" />
                    Shipped
                  </div>
                  <div className={`text-center p-2 rounded-lg text-xs ${form.status === 'Delivered' ? 'bg-success/10 text-success font-medium' : 'bg-base-200'}`}>
                    <FiCheckCircle className="w-4 h-4 mx-auto mb-1" />
                    Delivered
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action mt-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Update Order
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default AdminOrderTable;