
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductTablePagination = ({
  currentPage,
  totalPages,
  indexOfFirstProduct,
  indexOfLastProduct,
  sortedProducts,
  paginate,
  nextPage,
  prevPage
}) => {
  if (!sortedProducts || sortedProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastProduct, sortedProducts.length)}
            </span>{" "}
            of <span className="font-medium">{sortedProducts.length}</span> results
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
  );
};

export default ProductTablePagination;
