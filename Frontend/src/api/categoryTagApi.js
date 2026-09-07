import axiosInstance from "./axiosInstance";

export const categoryApi = {
  getCategories: () => axiosInstance.get("/categories"),
  getCategoryBySlug: (slug, params) => axiosInstance.get(`/categories/${slug}`, { params }),
  createCategory: (data) => axiosInstance.post("/categories", data),
  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};

export const tagApi = {
  getTags: () => axiosInstance.get("/tags"),
  getPopularTags: () => axiosInstance.get("/tags/popular"),
  getTagBySlug: (slug, params) => axiosInstance.get(`/tags/${slug}`, { params }),
  createTag: (data) => axiosInstance.post("/tags", data),
  deleteTag: (id) => axiosInstance.delete(`/tags/${id}`),
};
