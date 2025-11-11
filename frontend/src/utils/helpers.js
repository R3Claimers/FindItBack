import { format, formatDistanceToNow, isValid } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, "MMM dd, yyyy") : "Invalid date";
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj)
    ? format(dateObj, "MMM dd, yyyy HH:mm")
    : "Invalid date";
};

export const formatRelativeTime = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj)
    ? formatDistanceToNow(dateObj, { addSuffix: true })
    : "Invalid date";
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (name) => {
  if (!name) return "U";
  const trimmedName = name.trim();
  if (!trimmedName) return "U";
  return trimmedName.charAt(0).toUpperCase();
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
