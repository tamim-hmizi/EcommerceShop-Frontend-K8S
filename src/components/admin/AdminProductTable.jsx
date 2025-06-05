import { useEffect, useState, useCallback, useRef } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/ProductService";
import { getCategories } from "../../services/categoryService";
import api from "../../services/api";
import { constructImageUrl, createSmallPlaceholder } from "../../utils/imageUtils";

// Import sub-components
import ProductTableHeader from "./product/ProductTableHeader";
import ProductTableFilters from "./product/ProductTableFilters";
import ProductTable from "./product/ProductTable";
import ProductTablePagination from "./product/ProductTablePagination";
import ProductFormModal from "./product/ProductFormModal";
import DeleteConfirmationModal from "./product/DeleteConfirmationModal";

const AdminProductTable = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageURLs, setImageURLs] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

  // Search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, inStock, lowStock, outOfStock

  // Sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const [form, setForm] = useState({
    _id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    previewImage: null
  });

  const dialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => {
    dialogRef.current?.close();
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.description || form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }
    if (!form.category) {
      newErrors.category = "Category is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories(token);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  const fetchImage = async (imagePath, productId) => {
    try {
      if (imagePath.startsWith('http')) {
        setImageURLs((prev) => ({ ...prev, [productId]: imagePath }));
        return;
      }

      // Use the utility function to construct the correct image URL
      const imageUrl = constructImageUrl(imagePath);

      if (imageUrl) {
        // Try to load the image directly first (for static files)
        try {
          const img = new Image();
          const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(imageUrl);
            img.onerror = reject;
            img.src = imageUrl;
          });

          await imageLoadPromise;
          setImageURLs((prev) => ({ ...prev, [productId]: imageUrl }));
        } catch {
          // If direct loading fails, try API endpoint
          const response = await api.get(imageUrl, { responseType: "blob" });
          const blobUrl = URL.createObjectURL(response.data);
          setImageURLs((prev) => ({ ...prev, [productId]: blobUrl }));
        }
      } else {
        throw new Error('Invalid image path');
      }
    } catch (error) {
      console.error(`Error fetching image for product ${productId}:`, error);
      // Set a placeholder image if loading fails
      setImageURLs((prev) => ({ ...prev, [productId]: createSmallPlaceholder('Product') }));
    }
  };

  const fetchProducts = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getProducts();
      setProducts(data);
      data.forEach((product) => {
        if (product.image) {
          fetchImage(product.image, product._id);
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  const handleRefresh = () => {
    fetchProducts(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleStockFilter = (value) => {
    setStockFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
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
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === "" || product.category?._id === categoryFilter;

    // Stock filter
    let matchesStock = true;
    if (stockFilter === "inStock") {
      matchesStock = product.stock > 0;
    } else if (stockFilter === "lowStock") {
      matchesStock = product.stock > 0 && product.stock <= 10;
    } else if (stockFilter === "outOfStock") {
      matchesStock = product.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;

    // Handle different field types
    switch(sortField) {
      case 'price':
        aValue = parseFloat(a.price) || 0;
        bValue = parseFloat(b.price) || 0;
        break;
      case 'stock':
        aValue = parseInt(a.stock) || 0;
        bValue = parseInt(b.stock) || 0;
        break;
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'category':
        aValue = a.category?.name || '';
        bValue = b.category?.name || '';
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

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

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

  const handleDelete = async (_id) => {
    await deleteProduct(_id, token);
    setDeleteConfirm(null);
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (form._id) {
        await updateProduct(form._id, formData, token);
      } else {
        await createProduct(formData, token);
      }

      closeModal();
      setForm({
        _id: null,
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
        previewImage: null
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.response?.data?.message) {
        setErrors({ backend: error.response.data.message });
      }
    }
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      category: product.category?._id || "",
      image: null,
      previewImage: imageURLs[product._id] || null
    });
    openModal();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({
        ...form,
        image: file,
        previewImage: previewUrl
      });
    }
  };

  const handleAddProduct = () => {
    setForm({
      _id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: null,
      previewImage: null
    });
    openModal();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with stats */}
      <ProductTableHeader
        products={products}
        refreshing={refreshing}
        loading={loading}
        handleRefresh={handleRefresh}
        handleAddProduct={handleAddProduct}
      />

      {/* Search and filters */}
      <ProductTableFilters
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        categoryFilter={categoryFilter}
        handleCategoryFilter={handleCategoryFilter}
        stockFilter={stockFilter}
        handleStockFilter={handleStockFilter}
        categories={categories}
      />

      {/* Product table */}
      <ProductTable
        loading={loading}
        currentProducts={currentProducts}
        sortedProducts={sortedProducts}
        imageURLs={imageURLs}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleEdit={handleEdit}
        setDeleteConfirm={setDeleteConfirm}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        stockFilter={stockFilter}
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setStockFilter={setStockFilter}
      />

      {/* Pagination */}
      <div className="mt-4">
        <ProductTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          sortedProducts={sortedProducts}
          paginate={paginate}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        dialogRef={dialogRef}
        closeModal={closeModal}
        form={form}
        errors={errors}
        handleSubmit={handleSubmit}
        setForm={setForm}
        categories={categories}
        handleImageChange={handleImageChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        deleteDialogRef={deleteDialogRef}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AdminProductTable;