import axiosInstance from "./axiosInstance";

export const authApi = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  adminLogin: (data) => axiosInstance.post("/auth/admin/login", data),
  superAdminLogin: (data) => axiosInstance.post("/auth/super-admin/login", data),
  googleAuth: (data) => axiosInstance.post("/auth/google", data),
  logout: () => axiosInstance.post("/auth/logout"),
  getMe: () => axiosInstance.get("/auth/me"),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
  adminForgotPassword: (data) => axiosInstance.post("/auth/admin/forgot-password", data),
  superAdminForgotPassword: (data) => axiosInstance.post("/auth/super-admin/forgot-password", data),
  resetPassword: (token, data) => axiosInstance.put(`/auth/reset-password/${token}`, data),
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
  updateProfile: (data) => axiosInstance.put("/users/profile", data),
  changeAvatar: (formData) =>
    axiosInstance.put("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changeEmail: (data) => axiosInstance.put("/users/change-email", data),
  changeUsername: (data) => axiosInstance.put("/users/change-username", data),
  deleteAccount: () => axiosInstance.delete("/users/delete-account"),
  getPublicAuthor: (username) => axiosInstance.get(`/users/author/${username}`),
};
