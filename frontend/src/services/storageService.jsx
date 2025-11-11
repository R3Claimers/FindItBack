import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";

export const uploadImage = async (file, folder = "items") => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;

    // Create a storage reference
    const storageRef = ref(storage, filename);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const validateImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed");
  }

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
};
