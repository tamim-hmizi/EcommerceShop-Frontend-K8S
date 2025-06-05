import api from "./api";

export const getProducts = async () => {
  try {
    console.log("Fetching products");
    const res = await api.get("/products");

    console.log("Products API response:", res);

    // Handle different response formats
    if (res.data && res.data.products && Array.isArray(res.data.products)) {
      return res.data.products;
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.warn("Unexpected products response format:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error in getProducts:", error.response || error);
    return [];
  }
};

export const getProductById = async (_id) => {
  const res = await api.get(`/products/${_id}`);
  return res.data.product;
};

export const createProduct = async (formData, token) => {
  const res = await api.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProduct = async (_id, formData, token) => {
  const res = await api.put(`/products/${_id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProduct = async (_id, token) => {
  const res = await api.delete(`/products/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
