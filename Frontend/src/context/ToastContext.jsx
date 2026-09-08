import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext();

// Global listener for singleton toast calls outside of React component trees
let globalToastHandler = null;

// Error Sanitizer Helper
const formatToastContent = (type, titleOrMsg, optionalMsg) => {
  let title = "";
  let message = "";

  if (optionalMsg !== undefined && optionalMsg !== null) {
    title = String(titleOrMsg);
    message = String(optionalMsg);
  } else if (titleOrMsg instanceof Error) {
    const rawMsg = titleOrMsg.message || "";
    if (rawMsg.includes("E11000") || rawMsg.includes("duplicate key")) {
      title = "Duplicate Entry";
      message = "An account or record with this information already exists.";
    } else if (rawMsg.includes("500") || rawMsg.toLowerCase().includes("internal server error")) {
      title = "Server Error";
      message = "Something went wrong on our end. Please try again in a moment.";
    } else if (rawMsg.toLowerCase().includes("network error") || rawMsg.toLowerCase().includes("failed to fetch")) {
      title = "Connection Failed";
      message = "Unable to connect to the server. Please check your network.";
    } else {
      title = type === "error" ? "Action Failed" : "Notice";
      message = rawMsg || "An error occurred while processing your request.";
    }
  } else if (typeof titleOrMsg === "string") {
    const text = titleOrMsg.trim();
    if (text.includes("E11000") || text.includes("MongoServerError")) {
      title = "Duplicate Entry";
      message = "An item with this information already exists.";
    } else if (text.includes("500") || text.toLowerCase().includes("internal server error")) {
      title = "Server Error";
      message = "Something went wrong. Please try again later.";
    } else {
      // Default titles based on type
      if (type === "success") title = "Success";
      else if (type === "error") title = "Error";
      else if (type === "warning") title = "Warning";
      else title = "Information";
      message = text;
    }
  } else {
    title = type === "success" ? "Success" : "Notification";
    message = "Operation completed.";
  }

  return { title, message };
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, titleOrMsg, optionalMsg, duration) => {
    const { title, message } = formatToastContent(type, titleOrMsg, optionalMsg);
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const toastDuration = duration || (type === "error" || type === "warning" ? 6000 : 4000);

    setToasts((prev) => {
      // Deduplicate if identical toast received within last 1.5 seconds
      const isDuplicate = prev.some(
        (t) => t.title === title && t.message === message && Date.now() - Number(t.id.slice(0, 13)) < 1500
      );
      if (isDuplicate) return prev;
      return [...prev, { id, type, title, message, duration: toastDuration }];
    });
  }, []);

  const success = useCallback((titleOrMsg, message, duration) => addToast("success", titleOrMsg, message, duration), [addToast]);
  const error = useCallback((titleOrMsg, message, duration) => addToast("error", titleOrMsg, message, duration), [addToast]);
  const warning = useCallback((titleOrMsg, message, duration) => addToast("warning", titleOrMsg, message, duration), [addToast]);
  const info = useCallback((titleOrMsg, message, duration) => addToast("info", titleOrMsg, message, duration), [addToast]);

  // Set global handler reference
  globalToastHandler = { success, error, warning, info, addToast };

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Global singleton toast object export for seamless compatibility
export const toast = {
  success: (titleOrMsg, message, duration) => {
    if (globalToastHandler) globalToastHandler.success(titleOrMsg, message, duration);
  },
  error: (titleOrMsg, message, duration) => {
    if (globalToastHandler) globalToastHandler.error(titleOrMsg, message, duration);
  },
  warning: (titleOrMsg, message, duration) => {
    if (globalToastHandler) globalToastHandler.warning(titleOrMsg, message, duration);
  },
  info: (titleOrMsg, message, duration) => {
    if (globalToastHandler) globalToastHandler.info(titleOrMsg, message, duration);
  },
};
