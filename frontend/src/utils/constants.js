export const CATEGORIES = [
  "Electronics",
  "Documents",
  "Keys",
  "Bags",
  "Wallets",
  "Jewelry",
  "Clothing",
  "Pets",
  "Other",
];

export const ITEM_STATUS = {
  OPEN: "open",
  RESOLVED: "resolved",
};

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
