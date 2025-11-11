import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

const ImageGallery = ({
  images = [],
  altText = "Item image",
  itemType = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Get backend URL for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
    const serverUrl = baseUrl.replace("/api/v1", "");
    return `${serverUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // Handle empty images array
  const imageArray = Array.isArray(images) ? images : images ? [images] : [];
  const validImages = imageArray.filter((img) => img);

  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <svg
            className="h-16 w-16 mx-auto mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const handlePrevious = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
    setZoom(1);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = (e) => {
    e?.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    setZoom(1);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoom(1);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div className="w-full h-96 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={getImageUrl(validImages[selectedIndex])}
              alt={`${altText} ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain cursor-pointer transition-smooth hover:opacity-95"
              onClick={() => openLightbox(selectedIndex)}
            />
            {/* Lost/Found Badge Overlay */}
            {itemType && (
              <div className="absolute top-4 left-4">
                <span
                  className={`badge backdrop-blur-sm border border-white/20 shadow-lg ${
                    itemType === "lost"
                      ? "bg-orange-500/90 text-white"
                      : "bg-green-500/90 text-white"
                  }`}
                >
                  {itemType === "lost" ? "Lost" : "Found"}
                </span>
              </div>
            )}
          </div>
          {validImages.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {validImages.length}
              </div>
            </>
          )}
          {/* Zoom Hint */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-smooth">
            Click to enlarge
          </div>
        </div>

        {/* Thumbnail Strip */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-smooth bg-muted flex items-center justify-center ${
                  index === selectedIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${altText} thumbnail ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-smooth z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-smooth"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-smooth"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <span className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm z-10">
            {selectedIndex + 1} / {validImages.length}
          </div>

          {/* Navigation */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-smooth z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-smooth z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className="max-w-7xl max-h-full p-8 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(validImages[selectedIndex])}
              alt={`${altText} ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain mx-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
