import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import {
  Image,
  X,
  Upload,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Zap,
  Video,
  ImageIcon,
  AlertCircle,
  Plus,
  CheckCircle,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ChevronDown,
  Eye,
  Info,
  XCircle,
  Trash2,
} from "lucide-react";

import {
  addGenderCount,
  getResourcesByEventId,
  saveGenderCount,
  updateGenderCountByEventId,
  updateResource,
} from "../../services/Services";

import { useToast } from "../../utils/useToast.js";
import ButtonLoader from "../../utils/ButtonLoader.jsx";
import { decryptSession } from "../../utils/SessionCrypto.jsx";
import ConfirmationModal from "../../utils/ConfirmationModal.jsx";

function UploadedMediaManager({ resources }) {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  if (!resources || resources.length === 0) {
    return (
      <div className="text-gray-400 p-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        No uploaded media found.
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);

  const selectedEventId = Number(
    decryptSession(localStorage.getItem("selectedEventId")),
  );

  const { success, error } = useToast();

  const { isLoading, setIsLoading } = useState(false);

  const noOfImages = resources.flatMap((res) => res.images || []);

  const noOfVideos = resources.flatMap((res) => res.videos || []);

  const [isDragging, setIsDragging] = useState(false);

  const [activeTab, setActiveTab] = useState("images");

  const [modalActiveTab, setModalActiveTab] = useState("images");

  const [analysisData, setAnalysisData] = useState(null);

  const [modalImages, setModalImages] = useState([]);

  const [modalVideos, setModalVideos] = useState([]);

  const [proceedModalOpen, setProceedModalOpen] = useState(false);

  // Pagination states

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6; // Adjusted for horizontal layout

  // Preview states

  const [previewImage, setPreviewImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewVideo, setPreviewVideo] = useState(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [resourceId, setResourceId] = useState(0);

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [removedItems, setRemovedItems] = useState([]);
  const [previewModal, setPreviewModal] = useState({
    visible: false,

    item: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleRemoveExistingImage = (index) => {
    const removed = existingImages[index];
    setRemovedItems((prev) => [...prev, { ...removed, type: "image" }]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (index) => {
    const removed = existingVideos[index];
    setRemovedItems((prev) => [...prev, { ...removed, type: "video" }]);
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmDeleteAll = () => {
    switch (deleteTarget) {
      case "existingImages":
        setRemovedItems((prev) => [
          ...prev,
          ...existingImages.map((img) => ({ ...img, type: "image" })),
        ]);
        setExistingImages([]);
        break;

      case "existingVideos":
        setRemovedItems((prev) => [
          ...prev,
          ...existingVideos.map((vid) => ({ ...vid, type: "video" })),
        ]);
        setExistingVideos([]);
        break;

      case "modalImages":
        setModalImages([]);
        break;

      case "modalVideos":
        setModalVideos([]);
        break;

      default:
        break;
    }

    setShowDeleteAllModal(false);
    setDeleteTarget(null);
  };

  // Progress toast states

  const [progressToast, setProgressToast] = useState({
    show: false,

    progress: 0,

    status: "processing", // 'processing', 'completed', 'error'

    message: "",

    isMinimized: false,
  });

  const fileInputRef = useRef(null);

  const videoRef = useRef(null);

  // Get current media based on active tab

  const getCurrentMedia = () => {
    if (activeTab === "images") {
      return noOfImages;
    } else {
      return noOfVideos;
    }
  };

  const handlePreview = (item) => {
    setPreviewModal({
      visible: true,

      item: item,
    });
  };

  // Pagination logic - adjusted for horizontal scrolling

  const currentMedia = getCurrentMedia();

  const totalPages = Math.ceil(currentMedia.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentItems = currentMedia.slice(startIndex, endIndex);

  // Reset pagination when tab changes

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const openImagePreview = (img) => {
    setPreviewImage(`${BASE_URL}/uploads/images/${img}`);

    setIsModalOpen(true);
  };

  const openVideoPreview = (vid) => {
    setPreviewVideo(`${BASE_URL}/uploads/videos/${vid}`);

    setIsVideoModalOpen(true);
  };

  const closePreviewModal = () => {
    setPreviewModal({ visible: false, item: null });
  };

  const closeModal = () => {
    setIsModalOpen(false);

    setPreviewImage(null);

    setIsVideoModalOpen(false);

    setPreviewVideo(null);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClickYes = async () => {
    try {
      setProceedModalOpen(false);

      setProgressToast({
        show: true,

        progress: 0,

        status: "processing",

        message: "Initializing analysis...",

        isMinimized: false,
      });

      const imageFiles = [];

      const videoFiles = [];

      resources.forEach((res) => {
        if (res.images?.length > 0) {
          imageFiles.push(...res.images);
        }

        if (res.videos?.length > 0) {
          videoFiles.push(...res.videos);
        }
      });

      const totalFiles = imageFiles.length + videoFiles.length;

      let processedFiles = 0;

      const updateProgress = (message, additionalProgress = 0) => {
        processedFiles += additionalProgress;

        const progress = Math.min((processedFiles / totalFiles) * 100, 95);

        setProgressToast((prev) => ({
          ...prev,

          progress,

          message,
        }));
      };

      const imageUploadPromise = async () => {
        if (imageFiles.length === 0) return;

        updateProgress("Processing images...");

        const imageFormData = new FormData();

        for (const img of imageFiles) {
          const imageUrl = `${BASE_URL}/uploads/images/${img}`;

          const response = await fetch(imageUrl);

          const blob = await response.blob();

          const file = new File([blob], img, { type: blob.type });

          imageFormData.append("files", file);

          updateProgress(`Processing image: ${img}`, 0.3);
        }

        updateProgress("Analyzing images with AI...");

        const res = await axios.post(
          import.meta.env.VITE_MULTIPLE_IMAGE_DETECT_URL,

          imageFormData,

          { headers: { "Content-Type": "multipart/form-data" } },
        );

        console.log(res.data);

        const { total_male, total_female, total_unknown, total_people } =
          res.data.summary;

        const imageGenderData = {
          maleCount: total_male,

          femaleCount: total_female,

          totalCount: total_people,

          unknownCount: total_unknown,

          resourceType: "IMAGES",

          eventId: parseInt(selectedEventId),
        };

        updateProgress(
          "Saving image analysis results...",
          imageFiles.length * 0.7,
        );

        // await addGenderCount(imageGenderData);
        await saveGenderCount(selectedEventId, "IMAGES", imageGenderData);
      };

      const videoUploadPromise = async () => {
        if (videoFiles.length === 0) return;

        updateProgress("Processing videos...");

        const videoFormData = new FormData();

        for (const vid of videoFiles) {
          const videoUrl = `${BASE_URL}/uploads/videos/${vid}`;

          const response = await fetch(videoUrl);

          const blob = await response.blob();

          const file = new File([blob], vid, { type: blob.type });

          videoFormData.append("files", file);

          updateProgress(`Processing video: ${vid}`, 0.3);
        }

        updateProgress("Analyzing videos with AI...");

        const res = await axios.post(
          import.meta.env.VITE_MULTIPLE_VIDEO_DETECT_URL,

          videoFormData,

          { headers: { "Content-Type": "multipart/form-data" } },
        );

        const { total_male, total_female, total_unknown, total_people } =
          res.data.summary;

        const videoGenderData = {
          maleCount: total_male,

          femaleCount: total_female,

          unknownCount: total_unknown,

          totalCount: total_people,

          resourceType: "VIDEOS",

          eventId: parseInt(selectedEventId),
        };

        updateProgress(
          "Saving video analysis results...",
          videoFiles.length * 0.7,
        );

        await saveGenderCount(selectedEventId, "VIDEOS", videoGenderData);
      };

      await Promise.all([imageUploadPromise(), videoUploadPromise()]);

      setProgressToast((prev) => ({
        ...prev,

        progress: 100,

        status: "completed",

        message: "Analysis completed successfully!",

        isMinimized: false,
      }));

      setTimeout(() => {
        setProgressToast((prev) => ({ ...prev, show: false }));

        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error analyzing gender data:", err);

      setProgressToast((prev) => ({
        ...prev,

        status: "error",

        message: "Analysis failed. Please try again.",

        progress: 0,
      }));

      setTimeout(() => {
        setProgressToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const handleFileSelect = (files) => {
    if (!files) return;

    const newImages = [];

    const newVideos = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        newImages.push({ file, url, name: file.name });
      } else if (file.type.startsWith("video/")) {
        newVideos.push({ file, url, name: file.name });
      }
    });

    setModalImages((prev) => [...prev, ...newImages]);

    setModalVideos((prev) => [...prev, ...newVideos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeModalImage = (index) => {
    setModalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeModalVideo = (index) => {
    setModalVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedia = async () => {
    try {
      setIsUpdating(true);
      const formData = new FormData();

      formData.append("eventId", selectedEventId);

      modalImages.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      modalVideos.forEach((vid) => {
        if (vid.file) formData.append("videos", vid.file);
      });

      const removedImageUrls = removedItems
        .filter((item) => item.type === "image")
        .map((item) => item.url.split("/").pop());

      const removedVideoUrls = removedItems
        .filter((item) => item.type === "video")
        .map((item) => item.url.split("/").pop());

      // Attach removals
      formData.append("removedImageUrls", JSON.stringify(removedImageUrls));
      formData.append("removedVideoUrls", JSON.stringify(removedVideoUrls));

      const resourceResponse = await getResourcesByEventId(selectedEventId);
      const resourceId = resourceResponse.data?.[0]?.resourceId;

      if (!resourceId) {
        console.warn("No resource found for this event");
        error("Resource not found");
        return;
      }

      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: [File] name=${value.name}, size=${value.size} bytes`,
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await updateResource(resourceId, formData);

      if (response.status === 200) {
        const updatedResource = await getResourcesByEventId(selectedEventId);
        const updatedMedia = updatedResource.data?.[0];
        console.log(updatedMedia);

        if (updatedMedia) {
          setExistingImages(
            updatedMedia.images.map((name) => ({
              url: `${BASE_URL}/uploads/images/${name}`,
              name,
            })),
          );

          setExistingVideos(
            updatedMedia.videos.map((name) => ({
              url: `${BASE_URL}/uploads/videos/${name}`,
              name,
            })),
          );
        }

        success("Media updated!");
        window.location.reload();

        setModalImages([]);
        setModalVideos([]);
        setRemovedItems([]);
        setIsEditing(false);
      } else {
        error("Update failed");
      }
    } catch (err) {
      console.error("Update media failed", err);
      error("Something went wrong during media update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setModalImages([]);

    setModalVideos([]);

    setIsEditing(false);

    setModalActiveTab("images");
  };

  const tabColors = {
    images: { bg: "#274c77", text: "white" },

    videos: { bg: "#274c77", text: "white" },
  };

  return (
    <div className="w-full max-w-9xl mx-auto p-6 min-h-[590px]">
      {progressToast.show && (
        <div
          className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
            progressToast.isMinimized ? "w-16 h-16" : "w-80"
          }`}
        >
          {progressToast.isMinimized ? (
            <div className="p-4 flex items-center justify-center">
              <button
                onClick={() =>
                  setProgressToast((prev) => ({ ...prev, isMinimized: false }))
                }
                className="w-8 h-8 rounded-full bg-[#274c77] hover:cursor-pointer text-white flex items-center justify-center"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Media Analysis</h4>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setProgressToast((prev) => ({
                        ...prev,
                        isMinimized: true,
                      }))
                    }
                    className="p-1 hover:bg-gray-100 rounded hover:cursor-pointer"
                  >
                    <Minimize2 size={14} />
                  </button>

                  <button
                    onClick={() =>
                      setProgressToast((prev) => ({ ...prev, show: false }))
                    }
                    className="p-1 hover:bg-gray-100 rounded hover:cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{progressToast.message}</span>

                  <span>{Math.round(progressToast.progress)}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressToast.status === "completed"
                        ? "bg-green-500"
                        : progressToast.status === "error"
                          ? "bg-red-500"
                          : "bg-[#274c77]"
                    }`}
                    style={{ width: `${progressToast.progress}%` }}
                  />
                </div>
              </div>

              {progressToast.status === "completed" && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle size={16} className="mr-2" />
                  Analysis completed successfully!
                </div>
              )}

              {progressToast.status === "error" && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  Analysis failed. Please try again.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Header */}

      <div className="flex items-center justify-between mb-8 -mt-6 -ml-6 -mr-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uploaded Media's</h1>

          <p className="text-black mt-2">
            {noOfImages.length + noOfVideos.length} media files uploaded
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setResourceId(resourceId);
              setExistingImages(
                noOfImages.map((item) => ({
                  url: `${BASE_URL}/uploads/images/${item}`,
                  name: item,
                })),
              );

              setExistingVideos(
                noOfVideos.map((item) => ({
                  url: `${BASE_URL}/uploads/videos/${item}`,
                  name: item,
                })),
              );

              setIsEditing(true);
            }}
            className="hover:cursor-pointer bg-[#f5d442] text-black px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Edit3 size={16} />

            <span>Edit Media</span>
          </button>
        </div>
      </div>

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

            {/\.(jpg|jpeg|png|gif|webp)$/i.test(previewModal.item.url) ? (
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

      {/* Horizontal Scrolling Media Display */}

      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden -mt-6 -ml-6 -mr-6">
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
                Images ({noOfImages.length})
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
                Videos ({noOfVideos.length})
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}

        <div className="flex-1 p-4 overflow-hidden h-[350px]">
          {currentItems.length > 0 ? (
            <div className="flex gap-3 justify-center h-full">
              {currentItems.map((item, index) => (
                <div
                  key={`${activeTab}-${startIndex + index}`}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 relative group"
                  style={{ height: "100px", width: "100px" }}
                  onClick={() =>
                    handlePreview({
                      url: `${BASE_URL}/uploads/${activeTab}/${item}`,
                      name: item,
                    })
                  }
                >
                  {activeTab === "images" ? (
                    <div className="relative h-full">
                      <img
                        src={`${BASE_URL}/uploads/images/${item}`}
                        alt={`Image ${startIndex + index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="relative h-full bg-gray-900">
                      <video
                        src={`${BASE_URL}/uploads/videos/${item}`}
                        className="w-full h-full object-cover cursor-pointer"
                        muted
                      />
                      <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <Play size={20} className="text-gray-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
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
                <p>No {activeTab} uploaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 hover:cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 hover:cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Proceed to Analysis Button */}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setProceedModalOpen(true)}
          disabled={noOfImages.length === 0 && noOfVideos.length === 0}
          className="hover:cursor-pointer bg-[#f5d442] text-black disabled:bg-gray-400 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Zap size={20} />

          <span>Proceed to Analysis</span>
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 backdrop-blur-[20px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Edit Media</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Upload Media Files
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to select images and videos
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: JPG, PNG, MP4, MOV
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setModalActiveTab("images")}
                    className={`py-3 px-2 border-b-2 font-medium text-sm ${
                      modalActiveTab === "images"
                        ? "border-blue-500 text-blue-600 cursor-pointer"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Images ({existingImages.length + modalImages.length})
                  </button>
                  <button
                    onClick={() => setModalActiveTab("videos")}
                    className={`py-3 px-2 border-b-2 font-medium text-sm ${
                      modalActiveTab === "videos"
                        ? "border-blue-500 text-blue-600 cursor-pointer"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Videos ({existingVideos.length + modalVideos.length})
                  </button>
                </nav>
              </div>

              {/* Media Previews */}
              <div className="min-h-[200px]">
                {modalActiveTab === "images" ? (
                  <>
                    {/* Existing Images */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex justify-between item-center">
                      <span>Existing Images</span>
                      {existingImages.length > 0 && (
                        <button
                          onClick={() => {
                            setDeleteTarget("existingImages");
                            setShowDeleteAllModal(true);
                          }}
                          title="Delete All"
                          className="cursor-pointer text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </h3>
                    {existingImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {existingImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative group bg-gray-50 rounded-lg overflow-hidden"
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-2 right-2 p-1 bg-yellow-500 text-white rounded-full cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                            <div className="p-2 text-xs text-gray-600 truncate">
                              {img.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-300 rounded px-2 py-2 max-w-[240px]">
                        <Info className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                        <p className="text-sm">No existing images available</p>
                      </div>
                    )}

                    {/* New Images */}
                    <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2 flex item-center justify-between">
                      <span>New Images</span>
                      {modalImages.length > 0 && (
                        <button
                          onClick={() => {
                            setDeleteTarget("modalImages");
                            setShowDeleteAllModal(true);
                          }}
                          title="Delete All"
                          className="cursor-pointer text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </h3>
                    {modalImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {modalImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative group bg-white border rounded-lg overflow-hidden"
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              onClick={() => removeModalImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                            <div className="p-2 text-xs text-gray-600 truncate">
                              {img.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-300 rounded px-2 py-2 max-w-[240px]">
                        <Info className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                        <p className="text-sm">No new images selected</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Existing Videos */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                      <span>Existing Videos</span>
                      {existingVideos.length > 0 && (
                        <button
                          onClick={() => {
                            setDeleteTarget("existingVideos");
                            setShowDeleteAllModal(true);
                          }}
                          title="Delete All"
                          className="cursor-pointer text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </h3>
                    {existingVideos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {existingVideos.map((vid, index) => (
                          <div
                            key={index}
                            className="relative group bg-gray-50 rounded-lg overflow-hidden"
                          >
                            <video
                              src={vid.url}
                              className="w-full h-32 object-cover"
                              controls
                            />
                            <button
                              onClick={() => handleRemoveExistingVideo(index)}
                              className="absolute top-2 right-2 p-1 bg-yellow-500 text-white rounded-full cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                            <div className="p-2 text-xs text-gray-600 truncate">
                              {vid.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-300 rounded px-4 py-2 max-w-[240px]">
                        <Info className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                        <p className="text-sm">No existing videos available</p>
                      </div>
                    )}

                    {/* New Videos */}
                    <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2 flex justify-between item-center">
                      <span>New Videos</span>
                      {modalVideos.length > 0 && (
                        <button
                          onClick={() => {
                            setDeleteTarget("modalVideos");
                            setShowDeleteAllModal(true);
                          }}
                          title="Delete All"
                          className="cursor-pointer text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </h3>
                    {modalVideos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {modalVideos.map((vid, index) => (
                          <div
                            key={index}
                            className="relative group bg-white border rounded-lg overflow-hidden"
                          >
                            <video
                              src={vid.url}
                              className="w-full h-32 object-cover"
                              controls
                            />
                            <button
                              onClick={() => removeModalVideo(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                            <div className="p-2 text-xs text-gray-600 truncate">
                              {vid.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-300 rounded px-4 py-2 max-w-[240px]">
                        <Info className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                        <p className="text-sm">No new videos selected</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <ButtonLoader
                onClick={handleUpdateMedia}
                isLoading={isUpdating}
                disabled={
                  !modalImages.length &&
                  !modalVideos.length &&
                  !removedItems.length
                }
                style={{ backgroundColor: "#274c77" }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
              >
                Update Media
              </ButtonLoader>
              <ConfirmationModal
                show={showDeleteAllModal}
                title="Confirm Delete"
                message="Are you sure you want to delete all?"
                onConfirm={handleConfirmDeleteAll}
                onCancel={() => setShowDeleteAllModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Video Preview Modal */}

      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            <video
              ref={videoRef}
              src={previewVideo}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Enhanced Confirmation Modal */}

      {proceedModalOpen && (
        <div className="fixed inset-0 backdrop-blur-[20px] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6 text-center">
              <div
                style={{ backgroundColor: "#274c77" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              >
                <Zap size={32} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Start Media Analysis?
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                This will analyze all your uploaded media files to detect and
                count people by gender. The process may take several minutes
                depending on the number of files.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Images to analyze:</span>

                  <span className="font-semibold text-gray-900">
                    {noOfImages.length}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600">Videos to analyze:</span>

                  <span className="font-semibold text-gray-900">
                    {noOfVideos.length}
                  </span>
                </div>

                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-gray-900">Total files:</span>

                    <span className="text-blue-600">
                      {noOfImages.length + noOfVideos.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 px-6 py-3 hover:cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={() => setProceedModalOpen(false)}
                >
                  <X size={18} />

                  <span>Cancel</span>
                </button>

                <ButtonLoader
                  isLoading={isLoading}
                  onClick={() => handleClickYes()}
                  className="flex-1 px-6 py-3 hover:cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <CheckCircle size={18} />

                  <span>Start Analysis</span>
                </ButtonLoader>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadedMediaManager;
