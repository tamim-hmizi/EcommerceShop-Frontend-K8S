
import {
  FiEdit,
  FiPlus,
  FiPackage,
  FiLayers,
  FiTag,
  FiDollarSign,
  FiBox,
  FiImage
} from "react-icons/fi";

const ProductFormModal = ({
  dialogRef,
  closeModal,
  form,
  errors,
  handleSubmit,
  setForm,
  categories,
  handleImageChange
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-3xl bg-base-100">
        <button
          onClick={closeModal}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-lg">
            {form._id ? (
              <FiEdit className="h-6 w-6 text-primary" />
            ) : (
              <FiPlus className="h-6 w-6 text-primary" />
            )}
          </div>
          <h3 className="font-bold text-xl">
            {form._id ? "Edit Product" : "Add New Product"}
          </h3>
        </div>

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

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="col-span-1">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Product Name
                  </span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name}</span>
                  </label>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiLayers className="w-4 h-4" />
                    Description
                  </span>
                </label>
                <textarea
                  className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={5}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.description}</span>
                  </label>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    Category
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.category}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4" />
                      Price ($)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.price}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiBox className="w-4 h-4" />
                      Stock Quantity
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`input input-bordered w-full ${errors.stock ? 'input-error' : ''}`}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.stock}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiImage className="w-4 h-4" />
                    Product Image
                  </span>
                </label>
                <div className="bg-base-200 p-4 rounded-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-lg bg-base-100 ring-1 ring-base-300">
                        {form.previewImage ? (
                          <img src={form.previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FiImage className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <p className="text-xs text-gray-500">
                      Recommended: Square image (1:1 ratio), at least 500x500px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action mt-8 border-t pt-4 border-base-200">
            <button type="button" onClick={closeModal} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-2">
              {form._id ? (
                <>
                  <FiEdit className="w-4 h-4" />
                  Update Product
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProductFormModal;
