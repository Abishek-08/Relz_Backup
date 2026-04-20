import React, { useEffect, useRef, useState } from "react";

import {
  Play,
  Image,
  Upload,
  Video,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";

import { useToast } from "../../utils/useToast.js";

import { addResource } from "../../services/Services";

function MediaUploader({ eventId, onUploadSucess }) {
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const [activeTab, setActiveTab] = useState("images");

  const [images, setImages] = useState([]);

  const [videos, setVideos] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 11;

  const { success, error, info } = useToast();

  // Preview Modal States

  const [previewModal, setPreviewModal] = useState({
    visible: false,

    item: null,
  });

  // Color scheme for tabs

  const tabColors = {
    images: { bg: "#274c77", text: "white" },

    videos: { bg: "#274c77", text: "white" },
  };

  useEffect(() => { console.log("File input mounted"); }, []);

  const handleFileSelect = (files) => {
    const newImages = [];

    const newVideos = [];

    Array.from(files).forEach((file) => {
      const mediaItem = {
        id: Date.now() + Math.random(),

        file,

        name: file.name,

        type: file.type.startsWith("image/") ? "image" : "video",

        url: URL.createObjectURL(file),

        size: file.size,
      };

      if (mediaItem.type === "image") {
        newImages.push(mediaItem);
      } else {
        newVideos.push(mediaItem);
      }
    });

    setImages((prev) => [...prev, ...newImages]);

    setVideos((prev) => [...prev, ...newVideos]);

    // Reset to first page when new items are added

    setCurrentPage(1);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const files = e.dataTransfer.files;

    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();

    setIsDragging(false);
  };

  const removeMedia = (id, type) => {
    if (type === "image") {
      setImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      setVideos((prev) => prev.filter((vid) => vid.id !== id));
    }
  };

  const handleUploadAll = async () => {
    const payload = new FormData();

    const validImageFormats = [
      "dng",
      "tif",
      "jpeg",
      "pfm",
      "heic",
      "mpo",
      "jpg",
      "tiff",
      "png",
      "bmp",
      "jfif",
      "webp",
    ];
    const validVideoFormats = [
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "flv",
      "wmv",
    ];

    let hasInvalidImage = false;
    let hasInvalidVideo = false;

    images.forEach((img) => {
      const ext = img.file.name.split(".").pop().toLowerCase();
      if (validImageFormats.includes(ext)) {
        payload.append("images", img.file);
      } else {
        hasInvalidImage = true;
      }
    });

    videos.forEach((vid) => {
      const ext = vid.file.name.split(".").pop().toLowerCase();
      if (validVideoFormats.includes(ext)) {
        payload.append("videos", vid.file);
      } else {
        hasInvalidVideo = true;
      }
    });

    if (hasInvalidImage || hasInvalidVideo) {
      let errorMessage = "";
      if (hasInvalidImage) {
        errorMessage += `Sorry! Accepted formats are: ${validImageFormats.join(
          ", "
        )}.\n`;
      }
      if (hasInvalidVideo) {
        errorMessage += `Sorry! Accepted formats are: ${validVideoFormats.join(
          ", "
        )}.`;
      }
      error(errorMessage.trim());
      return;
    }

    payload.append("eventId", eventId);
    setIsUploading(true);

    try {
      const response = await addResource(payload);
      if (response.status === 200 || response.status === 201) {
        if (onUploadSucess) {
          onUploadSucess();
          console.log("uploaded media details: ",payload)
        }
      } else {
        throw new Error(response.data?.message || "Unexpected API response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      error(err.message || "Media upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = (item) => {
    setPreviewModal({
      visible: true,

      item: item,
    });
  };

  // Close preview modal

  const closePreviewModal = () => {
    setPreviewModal({ visible: false, item: null });
  };

  const totalMedia = images.length + videos.length;

  const hasMedia = totalMedia > 0;

  // Get current tab media

  const getCurrentMedia = () => {
    return activeTab === "images" ? images : videos;
  };

  const currentMedia = getCurrentMedia();

  const totalPages = Math.ceil(currentMedia.length / itemsPerPage);

  const currentItems = currentMedia.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage
  );

  return (
    <div
      style={{ height: "calc(90vh - 70px)" }}
      className="flex flex-col overflow-hidden"
    >
      {/* Enhanced Loading Animation */}

      {isUploading && (
        <div className="fixed inset-0 backdrop-blur-[20px] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Circle with Pulse */}

              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>

                <div
                  className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full border-t-pink-600 animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>

                <div className="absolute inset-3 w-14 h-14 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>

              {/* Text Content */}

              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">
                  Uploading Media
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  Processing your files...
                  <br />
                  <span className="text-gray-500">
                    Please wait while we upload your media
                  </span>
                </p>
              </div>

              {/* Progress Bar */}

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-pink-500 h-3 rounded-full animate-pulse"
                  style={{
                    width: "75%",
                    animation: "pulse 2s ease-in-out infinite alternate",
                  }}
                ></div>
              </div>

              {/* Animated Dots */}

              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}

      {previewModal.visible && previewModal.item && (
  <div
    className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={closePreviewModal}
  >
    <div className="relative w-[600px] h-[400px] flex items-center justify-center p-4 bg-gray-300 rounded-xl shadow-xl">
      <button
        onClick={closePreviewModal}
        className="cursor-pointer absolute top-3 right-4 text-gray-700 hover:text-gray-900 z-10"
      >
        <XCircle className="w-6 h-6" />
      </button>

      {previewModal.item.type === "image" ? (
        <img
          src={previewModal.item.url}
          alt={previewModal.item.name}
          className="w-full h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <video
          controls
          src={previewModal.item.url}
          className="w-full h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          autoPlay
        />
      )}
    </div>
  </div>
)}


      <div className="flex-1 flex flex-col p-6 overflow-hidden -mt-6 -ml-6 -mr-6">
        {/* Upload Area */}

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-6 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-white hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ cursor: "pointer" }}
        >
          <Upload className="mx-auto h-8 w-8 text-white mb-3" />

          <p className="text-md font-medium text-white mb-2">
            Drop your images and videos here
          </p>

          <p className="text-sm text-white mb-3">
            or click to select files from your computer
          </p>

          <button
            onClick={() => {
              // e.stopPropagation();
              fileInputRef.current?.click()
            }}
            style={{ backgroundColor: "#274c77", zIndex: 20 }}
            className="relative text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors"
          >
            Select Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              console.log("Files selected");
              handleFileSelect(e.target.files);
              requestAnimationFrame(() => { if (fileInputRef.current) fileInputRef.current.value = null; });
            }
          }
            className="hidden"
          />
        </div>

        {/* Content Area */}

        {hasMedia ? (
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
            {/* Header with tabs */}

            <div
              className="p-2  rounded-t-2xl"
              style={{ backgroundColor: "#274c77" }}
            >
              <div className="flex justify-center">
                <div className="flex bg-gray-200 rounded-2xl p-2 space-x-1">
                  <button
                    onClick={() => {
                      setActiveTab("images");

                      setCurrentPage(1);
                    }}
                    className={`relative px-6 py-3 font-medium transition-all hover:cursor-pointer duration-300 rounded-xl ${
                      activeTab === "images"
                        ? "text-white shadow-lg transform scale-105"
                        : "text-black hover:bg-black/10"
                    }`}
                    style={{
                      background:
                        activeTab === "images"
                          ? tabColors.images.bg
                          : "transparent",
                    }}
                  >
                    Images ({images.length})
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("videos");

                      setCurrentPage(1);
                    }}
                    className={`relative px-6 py-3 font-medium transition-all hover:cursor-pointer duration-300 rounded-xl ${
                      activeTab === "videos"
                        ? "text-white shadow-lg transform scale-105"
                        : "text-black hover:bg-black/10"
                    }`}
                    style={{
                      background:
                        activeTab === "videos"
                          ? tabColors.videos.bg
                          : "transparent",
                    }}
                  >
                    Videos ({videos.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Media Grid */}

            <div className="flex-1 p-4 overflow-hidden h-[350px]">
              {currentMedia.length > 0 ? (
                <div className="flex gap-3 justify-center h-full">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 relative group"
                      style={{ height: "100px", width: "100px" }}
                      onClick={() => handlePreview(item)}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                          <Play className="h-6 w-6 text-white z-10" />

                          <video
                            src={item.url}
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            muted
                          />
                        </div>
                      )}

                      {/* Remove button */}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(item.id, item.type);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto hover:cursor-pointer"
                      >
                        <X size={12} />
                      </button>

                      {/* Hover overlay */}

                      <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />

                    <p>No {activeTab} selected</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center -mt-20">
            <div className="text-center text-white">
              <Image className="h-16 w-16 text-white mx-auto mb-4" />

              <p className="text-lg font-medium">No media selected yet</p>

              <p className="text-sm">
                Upload some images or videos to get started
              </p>
            </div>
          </div>
        )}

        {/* Upload Button */}

        {hasMedia && (
          <div className="text-center mt-4">
            <button
              onClick={handleUploadAll}
              disabled={isUploading}
              className="bg-blue-600 text-white px-6 py-3 hover:cursor-pointer rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {isUploading
                ? "Uploading..."
                : `Upload All (${totalMedia} files)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaUploader;