import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/UserService";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import { FiSearch, FiUsers, FiTrash2, FiRefreshCw } from "react-icons/fi";

function AdminUserTable({ token }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getUsers(token);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRefresh = () => {
    fetchUsers(true);
  };

  const handleDelete = async (_id) => {
    try {
      await deleteUser(_id, token);
      setUsers(users.filter((user) => user._id !== _id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users
    .filter((user) => user._id !== currentUser._id)
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="admin-header p-6 rounded-lg mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
              <FiUsers className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage and monitor user accounts
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="form-control">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-bordered w-full md:w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="h-5 w-5 absolute left-3 top-3 text-base-content/40" />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all duration-200"
              disabled={refreshing}
              title="Refresh user list"
            >
              <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-base-300">
          <div className="stat">
            <div className="stat-title text-sm">Total Users</div>
            <div className="stat-value text-2xl text-primary">{users.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title text-sm">Filtered Results</div>
            <div className="stat-value text-2xl text-secondary">{filteredUsers.length}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-card flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-card">
          <div className="text-center py-16">
            <FiUsers className="mx-auto h-16 w-16 text-base-content/40 mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">
              {searchTerm ? "No matching users found" : "No users available"}
            </h3>
            <p className="text-base-content/60 mb-4">
              {searchTerm
                ? "Try adjusting your search query to find users"
                : "All users are currently administrators or no users exist"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-outline btn-primary"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-table">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                            <span className="text-lg font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-base-content">
                            {user.name}
                          </div>
                          <div className="text-sm text-base-content/60">
                            <span className="badge badge-ghost badge-sm">
                              {user.role || "User"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-base-content">{user.email}</div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className="btn btn-sm btn-outline btn-error hover:scale-105 transition-transform"
                        title="Delete user"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteConfirm ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm User Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="btn btn-error"
            >
              Delete User
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AdminUserTable;