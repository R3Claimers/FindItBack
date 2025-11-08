import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase.js";

class UploadService {
  /**
   * Upload a single image to Firebase Storage
   * @param {File} file - The image file to upload
   * @param {string} folder - The folder path in storage (e.g., 'items', 'profiles')
   * @param {Function} onProgress - Optional callback for upload progress (0-100)
   * @returns {Promise<string>} - The download URL of the uploaded image
   */
  async uploadImage(file, folder = "items", onProgress = null) {
    try {
      // Validate file
      if (!file) {
        throw new Error("No file provided");
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Create unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const storagePath = `${folder}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Return promise that resolves with download URL
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Track upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(Math.round(progress));
            }
          },
          (error) => {
            // Handle upload errors
            console.error("Upload error:", error);
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            // Upload completed successfully, get download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error.message}`));
            }
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload multiple images to Firebase Storage
   * @param {File[]} files - Array of image files to upload
   * @param {string} folder - The folder path in storage
   * @param {Function} onProgress - Optional callback for overall progress (0-100)
   * @returns {Promise<string[]>} - Array of download URLs
   */
  async uploadMultipleImages(files, folder = "items", onProgress = null) {
    try {
      if (!files || files.length === 0) {
        return [];
      }

      // Validate number of files
      if (files.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }

      const uploadPromises = [];
      let completedUploads = 0;

      // Upload all files
      for (let i = 0; i < files.length; i++) {
        const uploadPromise = this.uploadImage(files[i], folder, (progress) => {
          // Track individual file progress
          if (onProgress && progress === 100) {
            completedUploads++;
            const overallProgress = (completedUploads / files.length) * 100;
            onProgress(Math.round(overallProgress));
          }
        });
        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to complete
      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param {string} imageUrl - The download URL of the image to delete
   * @returns {Promise<void>}
   */
  async deleteImage(imageUrl) {
    try {
      if (!imageUrl) return;

      // Extract storage path from URL
      // Firebase Storage URLs look like: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
      const path = this.getPathFromUrl(imageUrl);
      if (!path) {
        throw new Error("Invalid image URL");
      }

      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  /**
   * Delete multiple images from Firebase Storage
   * @param {string[]} imageUrls - Array of image URLs to delete
   * @returns {Promise<void>}
   */
  async deleteMultipleImages(imageUrls) {
    try {
      if (!imageUrls || imageUrls.length === 0) return;

      const deletePromises = imageUrls.map((url) => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting images:", error);
      throw error;
    }
  }

  /**
   * Extract storage path from Firebase Storage URL
   * @param {string} url - The Firebase Storage download URL
   * @returns {string|null} - The storage path or null if invalid
   */
  getPathFromUrl(url) {
    try {
      if (!url || !url.includes("firebasestorage.googleapis.com")) {
        return null;
      }

      // Extract path from URL
      const match = url.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        // Decode URI component to get actual path
        return decodeURIComponent(match[1]);
      }
      return null;
    } catch (error) {
      console.error("Error extracting path from URL:", error);
      return null;
    }
  }

  /**
   * Get image metadata from Firebase Storage
   * @param {string} imageUrl - The download URL of the image
   * @returns {Promise<object>} - The metadata object
   */
  async getImageMetadata(imageUrl) {
    try {
      const path = this.getPathFromUrl(imageUrl);
      if (!path) {
        throw new Error("Invalid image URL");
      }

      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      return metadata;
    } catch (error) {
      console.error("Error getting metadata:", error);
      throw error;
    }
  }
}

export const uploadService = new UploadService();
