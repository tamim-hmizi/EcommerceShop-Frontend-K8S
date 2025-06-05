import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import Loading from "../Loading";

const CategoryTable = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ _id: null, name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategories(token);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (_id) => {
    await deleteCategory(_id, token);
    setDeleteConfirm(null);
    fetchCategories();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.description) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (form._id) {
        await updateCategory(
          form._id,
          { name: form.name, description: form.description },
          token
        );
      } else {
        await createCategory(
          { name: form.name, description: form.description },
          token
        );
      }
      setIsModalOpen(false);
      setForm({ _id: null, name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      if (error.response?.data?.message) {
        setErrors({ backend: error.response.data.message });
      }
    }
  };

  const handleEdit = (category) => {
    setForm(category);
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="admin-header p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Category Management</h1>
            <p className="text-base-content/70 mt-1">Manage product categories</p>
          </div>
          <button
            onClick={() => {
              setForm({ _id: null, name: "", description: "" });
              setErrors({});
              setIsModalOpen(true);
            }}
            className="btn btn-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Category
          </button>
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
                  <th className="text-left">Name</th>
                  <th className="text-left">Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="hover">
                    <td className="font-medium text-base-content">{category.name}</td>
                    <td className="text-base-content/70 max-w-xs">{category.description}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category._id)}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && !loading && (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">
            {form._id ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter category name"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description}</span>
                </label>
              )}
            </div>
            {errors.backend && (
              <div className="alert alert-error mb-4">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.backend}</span>
                </div>
              </div>
            )}
            <div className="modal-action">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {form._id ? "Update" : "Add"} Category
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteConfirm ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this category? This action cannot be undone.</p>
          <div className="modal-action">
            <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-error">
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CategoryTable;