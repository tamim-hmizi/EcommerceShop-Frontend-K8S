import api from "./api";

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const updateProfile = async (userData, token) => {
  const res = await api.put("/users/profile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const uploadProfilePicture = async (file, token) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const res = await api.post("/users/profile/picture", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProfilePicture = async (token) => {
  const res = await api.delete("/users/profile/picture", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
