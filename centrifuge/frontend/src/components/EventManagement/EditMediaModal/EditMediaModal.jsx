import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Upload, Trash2, Info, Search, Brain } from "lucide-react";
import { decryptSession, encryptSession } from "../../../utils/SessionCrypto";
import {
  getResourcesByEventId,
  updateResource,
  updateGenderCountByEventId,
  saveGenderCount,
} from "../../../services/Services";
import { useToast } from "../../../utils/useToast";
import ButtonLoader from "../../../utils/ButtonLoader";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import { CheckCircle } from "lucide-react";
import { FaRobot } from "react-icons/fa";

const EditMediaModal = ({ isOpen, onClose, eventId }) => {
  const [modalActiveTab, setModalActiveTab] = useState("images");
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [modalVideos, setModalVideos] = useState([]);
  const [removedItems, setRemovedItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [showTick, setShowTick] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const { success, error } = useToast();

  useEffect(() => {
    const target = (progressStep / 5) * 100;
    let current = progressPercent;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        clearInterval(interval);
      }
      setProgressPercent(current);
    }, 50);
    return () => clearInterval(interval);
  }, [progressStep]);

  const handleClose = () => {
    if (isUpdating) return;
    setModalImages([]);
    setModalVideos([]);
    setRemovedItems([]);
    setExistingImages([]);
    setExistingVideos([]);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isUpdating) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isUpdating]);

  useEffect(() => {
    if (isOpen) {
      const loadResources = async () => {
        try {
          if (!eventId) return;

          const res = await getResourcesByEventId(eventId);
          const resource = res.data?.[0];
          if (resource) {
            setExistingImages(
              resource.images.map((name) => ({
                name,
                url: `${BASE_URL}/uploads/images/${name}`,
              })),
            );
            setExistingVideos(
              resource.videos.map((name) => ({
                name,
                url: `${BASE_URL}/uploads/videos/${name}`,
              })),
            );
          }
        } catch (err) {
          console.error("Failed to load resources", err);
        }
      };
      loadResources();
    }
  }, [isOpen]);

  const handleFileSelect = (files) => {
    const arr = Array.from(files).map((f) => ({
      file: f,
      name: f.name,
      url: URL.createObjectURL(f),
    }));

    arr.forEach((item) => {
      if (item.file.type.startsWith("image/")) {
        setModalImages((prev) => [...prev, item]);
      } else if (item.file.type.startsWith("video/")) {
        setModalVideos((prev) => [...prev, item]);
      }
    });

    if (arr.length > 0) {
      success(`${arr.length} file(s) selected`);
    }
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
  const handleDragLeave = () => setIsDragging(false);

  const removeModalImage = (index) => {
    setModalImages((prev) => prev.filter((_, i) => i !== index));
  };
  const removeModalVideo = (index) => {
    setModalVideos((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRemoveExistingImage = (index) => {
    const removed = existingImages[index];
    setRemovedItems((prev) => [...prev, { type: "image", name: removed.name }]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (index) => {
    const removed = existingVideos[index];
    setRemovedItems((prev) => [...prev, { type: "video", name: removed.name }]);
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmDeleteAll = () => {
    if (deleteTarget === "existingImages") setExistingImages([]);
    if (deleteTarget === "existingVideos") setExistingVideos([]);
    if (deleteTarget === "modalImages") setModalImages([]);
    if (deleteTarget === "modalVideos") setModalVideos([]);
    setShowDeleteAllModal(false);
  };

  //below is perfect one updaitn values
  // const handleSaveEdits = async () => {
  //   try {
  //     setIsUpdating(true);
  //     if (!eventId) {
  //       error("Event Id not found");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("eventId", eventId);
  //     modalImages.forEach((img) => {
  //       if (img.file) formData.append("images", img.file);
  //     });
  //     modalVideos.forEach((vid) => {
  //       if (vid.file) formData.append("videos", vid.file);
  //     });

  //     const removedImageUrls = removedItems
  //       .filter((i) => i.type === "image")
  //       .map((i) => i.name);

  //     const removedVideoUrls = removedItems
  //       .filter((i) => i.type === "video")
  //       .map((i) => i.name);

  //     formData.append("removedImageUrls", JSON.stringify(removedImageUrls));
  //     formData.append("removedVideoUrls", JSON.stringify(removedVideoUrls));

  //     const resourceResponse = await getResourcesByEventId(eventId);
  //     const resourceId = resourceResponse.data?.[0]?.resourceId;
  //     await updateResource(resourceId, formData);

  //     const updatedResource = await getResourcesByEventId(eventId);
  //     const updatedMedia = updatedResource.data?.[0];

  //     const imageFiles = updatedMedia.images || [];
  //     const videoFiles = updatedMedia.videos || [];

  //     if (imageFiles.length > 0) {
  //       const imageFormData = new FormData();
  //       for (const img of imageFiles) {
  //         const response = await fetch(`${BASE_URL}/uploads/images/${img}`);
  //         const blob = await response.blob();
  //         const file = new File([blob], img, { type: blob.type });
  //         imageFormData.append("files", file);
  //       }
  //       const res = await axios.post(
  //         import.meta.env.VITE_MULTIPLE_IMAGE_DETECT_URL,
  //         imageFormData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       const { total_male, total_female, total_unknown, total_people } =
  //         res.data.summary;

  //       const imageGenderData = {
  //         maleCount: total_male,
  //         femaleCount: total_female,
  //         totalCount: total_people,
  //         unknownCount: total_unknown,
  //         resourceType: "IMAGES",
  //         eventId: parseInt(eventId),
  //       };

  //       await saveGenderCount(eventId, "IMAGES", imageGenderData);
  //     } else {
  //       const videoGenderData = {
  //         maleCount: 0,
  //         femaleCount: 0,
  //         unknownCount: 0,
  //         totalCount: 0,
  //         resourceType: "IMAGES",
  //         eventId: parseInt(eventId),
  //       };
  //       await saveGenderCount(eventId, "IMAGES", imageGenderData);
  //     }

  //     if (videoFiles.length > 0) {
  //       const videoFormData = new FormData();
  //       for (const vid of videoFiles) {
  //         const response = await fetch(`${BASE_URL}/uploads/videos/${vid}`);
  //         const blob = await response.blob();
  //         const file = new File([blob], vid, { type: blob.type });
  //         videoFormData.append("files", file);
  //       }
  //       const res = await axios.post(
  //         import.meta.env.VITE_MULTIPLE_VIDEO_DETECT_URL,
  //         videoFormData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       const { total_male, total_female, total_unknown, total_people } =
  //         res.data.summary;
  //       const videoGenderData = {
  //         maleCount: total_male,
  //         femaleCount: total_female,
  //         unknownCount: total_unknown,
  //         totalCount: total_people,
  //         resourceType: "VIDEOS",
  //         eventId: parseInt(eventId),
  //       };
  //       await saveGenderCount(eventId, "VIDEOS", videoGenderData);
  //     } else {
  //       const videoGenderData = {
  //         maleCount: 0,
  //         femaleCount: 0,
  //         unknownCount: 0,
  //         totalCount: 0,
  //         resourceType: "VIDEOS",
  //         eventId: parseInt(eventId),
  //       };
  //       await saveGenderCount(eventId, "VIDEOS", videoGenderData);
  //     }

  //     success("Media updated and counts refreshed!");
  //     onClose();
  //     window.location.reload();
  //   } catch (err) {
  //     console.error("Update media failed", err);
  //     error("Something went wrong during media update");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  //not updating values crctly
  // const handleSaveEdits = async () => {
  //   try {
  //     if (!eventId) {
  //       error("Event Id not found");
  //       return;
  //     }

  //     setIsUpdating(true);
  //     setProgressStep(1);
  //     setProgressMessage("Preparing resources for analysis...");

  //     // Build formData
  //     const formData = new FormData();
  //     formData.append("eventId", eventId);
  //     modalImages.forEach(
  //       (img) => img.file && formData.append("images", img.file)
  //     );
  //     modalVideos.forEach(
  //       (vid) => vid.file && formData.append("videos", vid.file)
  //     );
  //     formData.append(
  //       "removedImageUrls",
  //       JSON.stringify(
  //         removedItems.filter((i) => i.type === "image").map((i) => i.name)
  //       )
  //     );
  //     formData.append(
  //       "removedVideoUrls",
  //       JSON.stringify(
  //         removedItems.filter((i) => i.type === "video").map((i) => i.name)
  //       )
  //     );

  //     // Step 1: Update resources
  //     const resourceResponse = await getResourcesByEventId(eventId);
  //     const resourceId = resourceResponse.data?.[0]?.resourceId;
  //     await updateResource(resourceId, formData);

  //     const updatedResource = await getResourcesByEventId(eventId);
  //     const updatedMedia = updatedResource.data?.[0] || {};
  //     const imageFiles = updatedMedia.images || [];
  //     const videoFiles = updatedMedia.videos || [];

  //     // Step 2: Analyze images
  //     setProgressStep(2);
  //     setProgressMessage("Analyzing images...");
  //     if (imageFiles.length > 0) {
  //       const timeout = setTimeout(() => {
  //         setProgressMessage("Image analysis in progress, please wait...");
  //       }, 7000);

  //       const imageFormData = new FormData();
  //       for (const img of imageFiles) {
  //         const response = await fetch(`${BASE_URL}/uploads/images/${img}`);
  //         const blob = await response.blob();
  //         imageFormData.append(
  //           "files",
  //           new File([blob], img, { type: blob.type })
  //         );
  //       }

  //       const imgRes = await axios.post(
  //         import.meta.env.VITE_MULTIPLE_IMAGE_DETECT_URL,
  //         imageFormData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       clearTimeout(timeout);

  //       const { total_male, total_female, total_unknown, total_people } =
  //         imgRes.data.summary || {};
  //       setProgressStep(3);
  //       setProgressMessage("Image analysis completed");

  //       await saveGenderCount(eventId, "IMAGES", {
  //         maleCount: total_male || 0,
  //         femaleCount: total_female || 0,
  //         unknownCount: total_unknown || 0,
  //         totalCount: total_people || 0,
  //         resourceType: "IMAGES",
  //         eventId: parseInt(eventId),
  //       });
  //     } else {
  //       setProgressStep(3);
  //       setProgressMessage("No images found, Skipping image analysis!");
  //     }

  //     setProgressStep(4);
  //     setProgressMessage("Analyzing videos...");
  //     if (videoFiles.length > 0) {
  //       const timeout = setTimeout(() => {
  //         setProgressMessage("Video analysis in progress, please wait...");
  //       }, 5000);

  //       const videoFormData = new FormData();
  //       for (const vid of videoFiles) {
  //         const response = await fetch(`${BASE_URL}/uploads/videos/${vid}`);
  //         const blob = await response.blob();
  //         videoFormData.append(
  //           "files",
  //           new File([blob], vid, { type: blob.type })
  //         );
  //       }

  //       const vidRes = await axios.post(
  //         import.meta.env.VITE_MULTIPLE_VIDEO_DETECT_URL,
  //         videoFormData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       clearTimeout(timeout);

  //       const { total_male, total_female, total_unknown, total_people } =
  //         vidRes.data.summary || {};
  //       setProgressStep(5);
  //       setProgressMessage("Video analysis completed");

  //       await saveGenderCount(eventId, "VIDEOS", {
  //         maleCount: total_male || 0,
  //         femaleCount: total_female || 0,
  //         unknownCount: total_unknown || 0,
  //         totalCount: total_people || 0,
  //         resourceType: "VIDEOS",
  //         eventId: parseInt(eventId),
  //       });
  //     } else {
  //       setProgressStep(5);
  //       setProgressMessage("No videos found, Skipping video analysis!");
  //     }

  //     setProgressStep(5);
  //     setShowTick(true);
  //     setFinalMessage("Redirecting to events page...");
  //     setTimeout(() => {
  //       setShowTick(false);
  //       onClose();
  //       window.location.reload();
  //     }, 500);
  //     success("Media and Gender counts updated successfully!");
  //   } catch (err) {
  //     console.error("Update media failed", err);
  //     error("Something went wrong during media update");
  //   } finally {
  //     setIsUpdating(false);
  //     setProgressStep(0);
  //     setProgressMessage("");
  //     setShowTick(false);
  //   }
  // };

  //Perfect one
  const handleSaveEdits = async () => {
    try {
      setIsUpdating(true);
      if (!eventId) {
        error("Event Id not found");
        return;
      }

      setProgressStep(1);
      setProgressMessage("Preparing resources for analysis...");

      const formData = new FormData();
      formData.append("eventId", eventId);
      modalImages.forEach(
        (img) => img.file && formData.append("images", img.file),
      );
      modalVideos.forEach(
        (vid) => vid.file && formData.append("videos", vid.file),
      );

      const removedImageUrls = removedItems
        .filter((i) => i.type === "image")
        .map((i) => i.name);
      const removedVideoUrls = removedItems
        .filter((i) => i.type === "video")
        .map((i) => i.name);

      formData.append("removedImageUrls", JSON.stringify(removedImageUrls));
      formData.append("removedVideoUrls", JSON.stringify(removedVideoUrls));

      const resourceResponse = await getResourcesByEventId(eventId);
      const resourceId = resourceResponse.data?.[0]?.resourceId;
      await updateResource(resourceId, formData);

      const updatedResource = await getResourcesByEventId(eventId);
      const updatedMedia = updatedResource.data?.[0] || {};
      const imageFiles = updatedMedia.images || [];
      const videoFiles = updatedMedia.videos || [];

      // Step 2: Analyze images
      setProgressStep(2);
      setProgressMessage("Analyzing images...");
      if (imageFiles.length > 0) {
        const imageFormData = new FormData();
        for (const img of imageFiles) {
          const response = await fetch(`${BASE_URL}/uploads/images/${img}`);
          const blob = await response.blob();
          imageFormData.append(
            "files",
            new File([blob], img, { type: blob.type }),
          );
        }
        const res = await axios.post(
          import.meta.env.VITE_MULTIPLE_IMAGE_DETECT_URL,
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        const { total_male, total_female, total_unknown, total_people } =
          res.data.summary;

        const imageGenderData = {
          maleCount: total_male,
          femaleCount: total_female,
          unknownCount: total_unknown,
          totalCount: total_people,
          resourceType: "IMAGES",
          eventId: parseInt(eventId),
        };
        await saveGenderCount(eventId, "IMAGES", imageGenderData);
        setProgressStep(3);
        setProgressMessage("Image analysis completed");
      } else {
        const imageGenderData = {
          maleCount: 0,
          femaleCount: 0,
          unknownCount: 0,
          totalCount: 0,
          resourceType: "IMAGES",
          eventId: parseInt(eventId),
        };
        await saveGenderCount(eventId, "IMAGES", imageGenderData);
        setProgressStep(3);
        setProgressMessage("No images found, skipping image analysis!");
      }

      // Step 3: Analyze videos
      setProgressStep(4);
      setProgressMessage("Analyzing videos...");
      if (videoFiles.length > 0) {
        const videoFormData = new FormData();
        for (const vid of videoFiles) {
          const response = await fetch(`${BASE_URL}/uploads/videos/${vid}`);
          const blob = await response.blob();
          videoFormData.append(
            "files",
            new File([blob], vid, { type: blob.type }),
          );
        }
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
          eventId: parseInt(eventId),
        };
        await saveGenderCount(eventId, "VIDEOS", videoGenderData);
        setProgressStep(5);
        setProgressMessage("Video analysis completed");
      } else {
        const videoGenderData = {
          maleCount: 0,
          femaleCount: 0,
          unknownCount: 0,
          totalCount: 0,
          resourceType: "VIDEOS",
          eventId: parseInt(eventId),
        };
        await saveGenderCount(eventId, "VIDEOS", videoGenderData);
        setProgressStep(5);
        setProgressMessage("No videos found, skipping video analysis!");
      }

      success("Media updated and counts refreshed!");
      onClose();

      localStorage.setItem(
        "selectedEventId",
        encryptSession(String(eventId)).toString(),
      );
      window.location.reload();
    } catch (err) {
      console.error("Update media failed", err);
      error("Something went wrong during media update");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => !isUpdating && handleClose()}
      className="fixed inset-0 backdrop-blur-[20px] bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Media</h2>
          <button
            onClick={() => !isUpdating && handleClose()}
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
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
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
                <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2 flex justify-between items-center">
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
                <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2 flex justify-between items-center">
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
            onClick={handleClose}
            disabled={isUpdating}
            className={`px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg ${
              isUpdating
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Cancel
          </button>

          <ButtonLoader
            onClick={handleSaveEdits}
            isLoading={isUpdating}
            disabled={
              modalImages.length === 0 &&
              modalVideos.length === 0 &&
              existingImages.length === 0 &&
              existingVideos.length === 0
            }
            style={{ backgroundColor: "#274c77" }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
          >
            Update and Analyse
          </ButtonLoader>

          <ConfirmationModal
            show={showDeleteAllModal}
            title="Confirm Delete"
            message="Are you sure you want to delete all?"
            onConfirm={handleConfirmDeleteAll}
            onCancel={() => setShowDeleteAllModal(false)}
          />
        </div>

        {isUpdating && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur">
            <div className="bg-white/90 rounded-3xl  shadow-2xl p-10 max-w-lg w-full mx-4 animate-fadeIn border border-white/50">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {showTick ? (
                    <>
                      <CheckCircle className="w-28 h-28 text-green-500 animate-scaleIn" />
                      <p className="mt-4 text-green-600 font-semibold">
                        {finalMessage}
                      </p>
                    </>
                  ) : (
                    <FaRobot className="w-20 h-20 text-black" />
                  )}
                </div>

                {!showTick && (
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                      Analyzing media with AI
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {progressMessage}
                    </p>
                  </div>
                )}

                {!showTick && (
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="url(#grad)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={
                          2 * Math.PI * 42 * (1 - progressPercent / 100)
                        }
                        className="transition-all duration-700 ease-out"
                      />
                      <defs>
                        <linearGradient
                          id="grad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#065f46" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-xl font-semibold text-green-600 animate-pulse">
                      {progressPercent}%
                    </span>
                  </div>
                )}

                {/* Stepper */}
                {!showTick && (
                  <div className="w-full space-y-4">
                    {[
                      "Preparing resources",
                      "Analyzing images",
                      "Updating image counts",
                      "Analyzing videos",
                      "Updating video counts",
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        {progressStep > idx ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full ${
                              progressStep === idx + 1
                                ? "bg-blue-500 animate-pulse"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                        <span
                          className={`text-sm ${
                            progressStep > idx
                              ? "text-green-600 font-medium"
                              : progressStep === idx + 1
                                ? "text-blue-600 font-medium"
                                : "text-gray-500"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMediaModal;
