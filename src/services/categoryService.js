import api from "./api";

export const getCategories = async () => {
  try {
    console.log("Fetching categories");
    const res = await api.get("/category");

    console.log("Categories API response:", res);

    // Handle different response formats
    if (res.data && Array.isArray(res.data)) {
      return { data: res.data };
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return { data: res.data.data };
    } else if (res.data && res.data.success) {
      // If success but no data array, return empty array
      return { data: [] };
    } else {
      console.warn("Unexpected categories response format:", res.data);
      return { data: [] };
    }
  } catch (error) {
    console.error("Error in getCategories:", error.response || error);
    return { data: [] };
  }
};

export const getCategory = async (_id) => {
  const res = await api.get(`/category/${_id}`);
  return res.data;
};

export const createCategory = async (data, token) => {
  const res = await api.post("/category", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCategory = async (_id, data, token) => {
  const res = await api.put(`/category/${_id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCategory = async (_id, token) => {
  const res = await api.delete(`/category/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
