import api from "./api";

export const getUsers = async (token) => {
  try {
    console.log("Fetching users with token:", token ? "Token provided" : "No token");
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Users API response:", res);

    // Handle different response formats
    if (res.data && Array.isArray(res.data)) {
      return { data: res.data };
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return { data: res.data.data };
    } else if (res.data && res.data.success) {
      // If success but no data array, return empty array
      return { data: [] };
    } else {
      console.warn("Unexpected users response format:", res.data);
      return { data: [] };
    }
  } catch (error) {
    console.error("Error in getUsers:", error.response || error);
    return { data: [] };
  }
};

export const getUser = async (_id, token) => {
  const res = await api.get(`/users/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (_id, data, token) => {
  const res = await api.put(`/users/${_id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (_id, token) => {
  const res = await api.delete(`/users/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
