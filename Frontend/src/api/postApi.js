import axiosInstance from "./axiosInstance";

export const postApi = {
  getPosts: (params) => axiosInstance.get("/posts", { params }),
  getPostBySlug: (slug) => axiosInstance.get(`/posts/${slug}`),
  getRelatedPosts: (id) => axiosInstance.get(`/posts/${id}/related`),
  createPost: (data) =>
    axiosInstance.post("/posts", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  updatePost: (id, data) =>
    axiosInstance.put(`/posts/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  deletePost: (id) => axiosInstance.delete(`/posts/${id}`),
  restorePost: (id) => axiosInstance.put(`/posts/${id}/restore`),
  duplicatePost: (id) => axiosInstance.post(`/posts/${id}/duplicate`),
};
