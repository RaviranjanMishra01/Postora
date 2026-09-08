import axiosInstance from "./axiosInstance";

export const commentApi = {
  getPostComments: (postId) => axiosInstance.get(`/comments/post/${postId}`),
  createComment: (data) => axiosInstance.post("/comments", data),
  updateComment: (id, data) => axiosInstance.put(`/comments/${id}`, data),
  deleteComment: (id) => axiosInstance.delete(`/comments/${id}`),
  likeComment: (id) => axiosInstance.post(`/comments/${id}/like`),
};

export const interactionApi = {
  toggleLike: (postId) => axiosInstance.post(`/interactions/like/${postId}`),
  toggleBookmark: (postId) => axiosInstance.post(`/interactions/bookmark/${postId}`),
  getStatus: (postId) => axiosInstance.get(`/interactions/status/${postId}`),
  getBookmarks: () => axiosInstance.get("/interactions/bookmarks"),
  getLikedPosts: () => axiosInstance.get("/interactions/liked"),
};

export const followApi = {
  toggleFollow: (authorId) => axiosInstance.post(`/follows/${authorId}`),
  getAuthorFeed: () => axiosInstance.get("/follows/feed"),
  getFollowers: (userId) => axiosInstance.get(`/follows/followers${userId ? "/" + userId : ""}`),
  getFollowing: (userId) => axiosInstance.get(`/follows/following${userId ? "/" + userId : ""}`),
};

export const notificationApi = {
  getNotifications: () => axiosInstance.get("/notifications"),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put("/notifications/read-all"),
  deleteNotification: (id) => axiosInstance.delete(`/notifications/${id}`),
};

export const searchApi = {
  searchAll: (params) => axiosInstance.get("/search", { params }),
  getSuggestions: (params) => axiosInstance.get("/search/suggestions", { params }),
};

export const adminApi = {
  getStats: () => axiosInstance.get("/admin/stats"),
  getUsers: (params) => axiosInstance.get("/admin/users", { params }),
  updateUserRole: (id, data) => axiosInstance.put(`/admin/users/${id}/role`, data),
  toggleUserStatus: (id) => axiosInstance.put(`/admin/users/${id}/status`),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getAdminPosts: (params) => axiosInstance.get("/admin/posts", { params }),
  toggleFeaturedPost: (id) => axiosInstance.put(`/admin/posts/${id}/feature`),
  deletePost: (id) => axiosInstance.delete(`/admin/posts/${id}`),
  getAuditLogs: () => axiosInstance.get("/admin/audit-logs"),
  getSettings: () => axiosInstance.get("/admin/settings"),
  updateSettings: (data) => axiosInstance.put("/admin/settings", data),
};

export const reportApi = {
  submitReport: (data) => axiosInstance.post("/reports", data),
  getReports: (params) => axiosInstance.get("/reports", { params }),
  resolveReport: (id, data) => axiosInstance.put(`/reports/${id}/resolve`, data),
};

export const analyticsApi = {
  recordView: (data) => axiosInstance.post("/analytics/view", data),
  getAnalytics: () => axiosInstance.get("/analytics"),
};

export const newsletterApi = {
  subscribe: (data) => axiosInstance.post("/newsletter/subscribe", data),
  unsubscribe: (data) => axiosInstance.post("/newsletter/unsubscribe", data),
  getSubscribers: () => axiosInstance.get("/newsletter"),
};

export const contactApi = {
  sendMessage: (data) => axiosInstance.post("/contact", data),
  getMessages: () => axiosInstance.get("/contact"),
  markResolved: (id) => axiosInstance.put(`/contact/${id}/resolve`),
  deleteMessage: (id) => axiosInstance.delete(`/contact/${id}`),
};
