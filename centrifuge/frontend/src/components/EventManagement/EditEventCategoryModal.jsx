import React, { useState, useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";
import { useToast } from "../../utils/useToast.js";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { submitEventCategory } from "../../services/Services";
import ButtonLoader from "../../utils/ButtonLoader.jsx";

const EventCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = {},
  isEditing = false,
}) => {
  const { success, error } = useToast();
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    eventCategoryName: "",
    eventCategoryDescription: "",
    eventCategoryLogo: null,
  });
  const [existingLogo, setExistingLogo] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        eventCategoryName: initialData.eventCategoryName || "",
        eventCategoryDescription: initialData.eventCategoryDescription || "",
        eventCategoryLogo: null,
      });
      setExistingLogo(initialData.eventCategoryLogo || "");
    }
  }, [initialData, isEditing]);

  useEffect(() => {
    if (isOpen && !isEditing) {
      setFormData({
        eventCategoryName: "",
        eventCategoryDescription: "",
        eventCategoryLogo: null,
      });
      setExistingLogo("");
    }
  }, [isOpen, isEditing]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, eventCategoryLogo: file }));
    }
  };

  const handleSubmit = async () => {
    const { eventCategoryName, eventCategoryDescription, eventCategoryLogo } =
      formData;

    // 🔍 Validations
    if (!eventCategoryName.trim()) {
      toast.error("Event Category name is required", {
        duration: 3000,
        style: { zIndex: 9999 },
      });
      return;
    }

    if (!eventCategoryDescription.trim()) {
      toast.error("Event Category description is required", {
        duration: 3000,
        style: { zIndex: 9999 },
      });
      return;
    }

    // 🖼️ Logo required only for creation
    if (!isEditing && !eventCategoryLogo) {
      toast.error("Event Category logo is required", {
        duration: 3000,
        style: { zIndex: 9999 },
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formPayload = new FormData();
      formPayload.append("eventCategoryName", eventCategoryName);
      formPayload.append("eventCategoryDescription", eventCategoryDescription);
      if (eventCategoryLogo) {
        formPayload.append("eventCategoryLogo", eventCategoryLogo);
      }

      // 🎯 Call the service with PUT for both create/update
      const { ok, data } = await submitEventCategory(
        formPayload,
        initialData.eventCategoryId,
        isEditing
      );

      if (ok) {
        success("Category updated");
        onSuccess(); // Refresh the list
        onClose();
        setIsSubmitting(false);
      } else {
        error(data.message || "Something went wrong");
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;
      console.error("API Error:", apiMessage);
      error(apiMessage || "Failed to create new Event", { duration: 3000 });
    }
    finally{
      setIsSubmitting(false);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, eventCategoryLogo: null }));
    setExistingLogo("");
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };
  if (!isOpen) return null;
  const imageBaseURL = `${
    import.meta.env.VITE_BACKEND_BASE_URL
  }/uploads/images`;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { zIndex: 9999 },
        }}
      />
      <div
        ref={modalRef}
        className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 space-y-6 overflow-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Event Category" : "Add New Event Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:cursor-pointer hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* <div>
              <label className="font-semibold text-sm">Category Name *</label>
              <input
                type="text"
                required
                name="eventCategoryName"
                value={formData.eventCategoryName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-sm">Description *</label>
              <textarea
                name="eventCategoryDescription"
                required
                value={formData.eventCategoryDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg resize-none h-28"
              ></textarea>
            </div> */}

<div>
  <label className="font-semibold text-sm">Category Name *</label>
  <input
    type="text"
    required
    name="eventCategoryName"
    value={formData.eventCategoryName}
    onChange={handleInputChange}
    spellCheck={true}
    className="w-full px-4 py-2 border rounded-lg"
  />
</div>

<div>
  <label className="font-semibold text-sm">Description *</label>
  <textarea
    name="eventCategoryDescription"
    required
    value={formData.eventCategoryDescription}
    onChange={handleInputChange}
    spellCheck={true}
    className="w-full px-4 py-2 border rounded-lg resize-none h-28"
  ></textarea>
</div>

          </div>
          {/* Logo Upload */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-sm">Category Logo</label>
            {!formData.eventCategoryLogo && !existingLogo ? (
              <div
                className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer relative ${
                  dragActive ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
                }`}
                required
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="mx-auto text-gray-500 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop or click to upload image
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && handleLogoUpload(e.target.files[0])
                  }
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={
                    formData.eventCategoryLogo
                      ? URL.createObjectURL(formData.eventCategoryLogo)
                      : `${imageBaseURL}/${existingLogo}`
                  }
                  alt="Uploaded"
                  className="w-full rounded-lg max-h-56 object-contain"
                />
                <button
                  onClick={removeLogo}
                  className="absolute top-2 hover:cursor-pointer right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border hover:cursor-pointer rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <ButtonLoader
          isLoading={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-white font-medium hover:from-gray-700 hover:to-indigo-700"
            style={{ backgroundColor: "#274c77" }}
          >
            {isEditing ? "Update" : "Create"}
          </ButtonLoader>
        </div>
      </div>
    </div>
  );
};
export default EventCategoryModal;
