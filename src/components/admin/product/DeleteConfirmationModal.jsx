
import { FiTrash2 } from "react-icons/fi";

const DeleteConfirmationModal = ({
  deleteDialogRef,
  deleteConfirm,
  setDeleteConfirm,
  handleDelete
}) => {
  return (
    <dialog ref={deleteDialogRef} className={`modal ${deleteConfirm ? 'modal-open' : ''}`}>
      <div className="modal-box bg-base-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-error/10 p-3 rounded-lg">
            <FiTrash2 className="h-6 w-6 text-error" />
          </div>
          <h3 className="font-bold text-xl">Confirm Deletion</h3>
        </div>

        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <p className="text-gray-700">
            Are you sure you want to delete this product? This action <span className="font-bold">cannot be undone</span>.
          </p>
        </div>

        <div className="modal-action">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm)}
            className="btn btn-error gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Product
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmationModal;
