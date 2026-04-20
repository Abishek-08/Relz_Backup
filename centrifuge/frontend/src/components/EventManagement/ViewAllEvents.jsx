import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  X,
  Camera,
  Plus,
  Upload,
  Image,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import { allEvents } from "../../data/allEvents";
import {
  addEventCategory,
  deleteEventCategoryById,
  getAllEventCategories,
} from "../../services/Services";
import { useToast } from "../../utils/useToast.js";
import { useEffect } from "react";
import EventCategoryModal from "../../components/EventManagement/EditEventCategoryModal";
import { Pencil } from "lucide-react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import ButtonLoader from "../../utils/ButtonLoader.jsx";
import { encryptSession, decryptSession } from "../../utils/SessionCrypto.jsx";

const ViewAllEvents = () => {
  const modalRef = useRef(null);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(4);
  const { success, error, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [overflowMap, setOverflowMap] = useState({});
  const [modalContent, setModalContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditEvent = (categoryId) => {
    const found = eventCategories.find(
      (cat) => cat.eventCategoryId === categoryId,
    );
    if (found) {
      setSelectedCategory(found);
      setIsEditing(true);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    setModalContent(null);
  }, []);

  const handleViewEvents = (eventId) => {
    localStorage.setItem(
      "eventCategoryId",
      encryptSession(String(eventId)).toString(),
    );
    navigate(`/events/${eventId}`);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const [eventCategories, setEventCategories] = useState([]);
  const [formData, setFormData] = useState({
    eventCategoryName: "",

    eventCategoryLogo: null,

    eventCategoryDescription: "",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setIsModalOpen]);

  useEffect(() => {
    const updateEventsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      if (width >= 768 && width < 1024 && isPortrait) {
        setEventsPerPage(6);
      } else {
        setEventsPerPage(4);
      }
    };
    updateEventsPerPage();
    window.addEventListener("resize", updateEventsPerPage);
    return () => window.removeEventListener("resize", updateEventsPerPage);
  }, []);

  useEffect(() => {
    const fetchEventCategories = async () => {
      try {
        const response = await getAllEventCategories();
        setEventCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch event categories:", error);
      }
    };

    fetchEventCategories();
  }, []);

  const totalPages = Math.ceil(eventCategories.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = eventCategories.slice(
    startIndex,
    startIndex + eventsPerPage,
  );

  const eventCategoryImageURL = `${
    import.meta.env.VITE_BACKEND_BASE_URL
  }/uploads/images`;

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,

      eventCategoryLogo: null,
    }));
  };

  const handleDeleteEventCategory = (categoryId) => {
    toast((t) => (
      <div className="space-y-2">
        <p className="text-sm">
          Are you sure you want to delete this category?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 bg-gray-200 hover:cursor-pointer text-black rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await deleteEventCategoryById(categoryId);
                if (response.status === 200) {
                  toast.success("Category deleted successfully");
                  fetchAllCategories();
                } else {
                  toast.error(response.data?.message || "Failed to delete");
                }
              } catch (err) {
                toast.error("Something went wrong while deleting");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,

        eventCategoryLogo: file,
      }));
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await getAllEventCategories();
      setEventCategories(res.data); // or whatever state you're using
    } catch (err) {
      console.error("Error fetching event categories:", err);
    }
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

  useEffect(() => {
    const newMap = {};
    currentEvents.forEach((category) => {
      const el = document.getElementById(`desc-${category.eventCategoryId}`);
      if (el) {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        const maxHeight = lineHeight * 2;
        newMap[category.eventCategoryId] = el.scrollHeight > maxHeight;
      }
    });
    if (JSON.stringify(newMap) !== JSON.stringify(overflowMap)) {
      setOverflowMap(newMap);
    }
  }, [currentEvents]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  const handleDrop = (e) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.eventCategoryName.trim()) {
        error("Event Category Name is required", {
          duration: 3000,
          style: { zIndex: 9999 },
        });
        return;
      }

      if (!formData.eventCategoryDescription.trim()) {
        error("Event Category description is required", {
          duration: 3000,
          style: { zIndex: 9999 },
        });
        return;
      }

      if (!formData.eventCategoryLogo) {
        error("Event Category logo is required", {
          duration: 3000,
          style: { zIndex: 9999 },
        });
        return;
      }

      const formPayload = new FormData();
      formPayload.append("eventCategoryName", formData.eventCategoryName);
      formPayload.append(
        "eventCategoryDescription",
        formData.eventCategoryDescription,
      );
      formPayload.append("eventCategoryLogo", formData.eventCategoryLogo);

      const response = await addEventCategory(formPayload);
      console.log("After hitting API", response);

      if (response.status === 201) {
        localStorage.setItem("eventCategoryCreated", "true");
        window.location.reload();
        setIsModalOpen(false);
        setFormData({
          eventCategoryName: "",
          eventCategoryLogo: null,
          eventCategoryDescription: "",
        });
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;

      console.error("API Error:", apiMessage);
      error(apiMessage || "Failed to create new Event", { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const categoryCreated = localStorage.getItem("eventCategoryCreated");
    if (categoryCreated === "true") {
      success("New Event Category created successfully", { duration: 3000 });
      localStorage.removeItem("eventCategoryCreated");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 flex flex-col overflow-hidden pt-20">
      <Navbar />

      <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
        {/* Compact Header */}
        <div className="pt-16">
          {/* Top Row: Back Button on Left, Heading Centered */}
          <div className="flex justify-between items-center mb-3 -mt-16 px-4">
            {/* Back Button on Left */}
            <button
              onClick={() => navigate("/homepage")}
              style={{ backgroundColor: "#274c77" }}
              className="fixed top-20 hover:cursor-pointer left-6 z-50 group flex items-center space-x-3 backdrop-blur-lg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:from-gray-700/95 hover:to-gray-600/95 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            {/* Centered Heading with Icon */}
            <div className="flex items-center space-x-3 mx-auto">
              <div
                style={{ backgroundColor: "#274c77" }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-black">
                Event Categories
              </h1>
            </div>

            {/* Spacer to balance layout */}
            <div className="w-24"></div>
          </div>

          {/* Description */}
          <p className="text-black/80 text-base lg:text-lg max-w-2xl mx-auto text-center">
            Explore live and corporate events with detailed tracking insights.
          </p>
        </div>

        <div className="w-full flex justify-end mb-2">
          <button
            className=" text-white font-semibold hover:cursor-pointer px-6 py-2 rounded-lg shadow-lg z-10 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm lg:text-base"
            style={{ backgroundColor: "#274c77" }}
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Category
          </button>
        </div>

        <div className="mb-4 portrait:mb-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 h-full">
            {currentEvents.map((category) => (
              <div
                key={category.eventCategoryId}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                {/* Card Image with Edit Button */}
                <div className="relative h-32 lg:h-40">
                  <img
                    src={`${eventCategoryImageURL}/${category.eventCategoryLogo}`}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditEvent(category.eventCategoryId)}
                      className="cursor-pointer bg-white p-1 rounded-full shadow hover:bg-gray-100"
                    >
                      <Pencil
                        size={18}
                        className="text-[#274c77] group-hover:text-[#1f3a5c]"
                      />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteEventCategory(category.eventCategoryId)
                      }
                      className="cursor-pointer bg-white p-1 rounded-full shadow hover:bg-gray-100"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-2 line-clamp-1">
                    {category.eventCategoryName}
                  </h3>

                  <div className="mb-3 min-h-[56px] lg:min-h-[76px] flex flex-col justify-between">
                    <p
                      id={`desc-${category.eventCategoryId}`}
                      className="text-black/80 text-sm lg:text-base leading-relaxed line-clamp-2"
                    >
                      {category.eventCategoryDescription}
                    </p>

                    {overflowMap[category.eventCategoryId] && (
                      <button
                        onClick={() => setModalContent(category)}
                        className="text-[#274c20] hover:text-[#274c77] hover:cursor-pointer text-sm underline mt-1 self-start"
                      >
                        View More
                      </button>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewEvents(category.eventCategoryId)}
                    style={{ backgroundColor: "#274c77" }}
                    className="w-full text-white hover:cursor-pointer px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm lg:text-base"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View All Events</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {modalContent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h3 className="text-lg font-bold mb-2">
                  {modalContent.eventCategoryName}
                </h3>
                <p className="text-black/80 mb-4">
                  {modalContent.eventCategoryDescription}
                </p>
                <button
                  onClick={() => setModalContent(null)}
                  className="bg-[#274c77] text-white px-4 py-2 rounded hover:cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* {totalPages > 1 && (
          <div className="flex-shrink-0">
            <div className="flex justify-center items-center space-x-3 mb-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-100 text-black hover:from-slate-500 hover:to-slate-600 border border-white/20 p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-2">
                {(() => {
                  const pages = [];
                  const showEllipsisBefore = currentPage > 3;
                  const showEllipsisAfter = currentPage < totalPages - 2;
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                        currentPage === 1
                          ? "text-white scale-110"
                          : "bg-gray-100 text-black hover:from-slate-500 hover:to-slate-600 border border-white/20 hover:scale-105"
                      }`}
                      style={
                        currentPage === 1 ? { backgroundColor: "#274c77" } : {}
                      }
                    >
                      1
                    </button>
                  );
                  if (showEllipsisBefore) {
                    pages.push(
                      <span
                        key="ellipsis-before"
                        className="px-2 text-gray-500 font-semibold select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  for (
                    let i = Math.max(2, currentPage - 1);
                    i <= Math.min(totalPages - 1, currentPage + 1);
                    i++
                  ) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                          currentPage === i
                            ? "text-white scale-110"
                            : "bg-gray-100 text-black hover:from-slate-500 hover:to-slate-600 border border-white/20 hover:scale-105"
                        }`}
                        style={
                          currentPage === i
                            ? { backgroundColor: "#274c77" }
                            : {}
                        }
                      >
                        {i}
                      </button>
                    );
                  }
                  if (showEllipsisAfter) {
                    pages.push(
                      <span
                        key="ellipsis-after"
                        className="px-2 text-gray-500 font-semibold select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                          currentPage === totalPages
                            ? "text-white scale-110"
                            : "bg-gray-100 text-black hover:from-slate-500 hover:to-slate-600 border border-white/20 hover:scale-105"
                        }`}
                        style={
                          currentPage === totalPages
                            ? { backgroundColor: "#274c77" }
                            : {}
                        }
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-100 hover:from-slate-500 hover:to-slate-600 border border-white/20 text-black p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-black text-sm">
                Showing {startIndex + 1}-
                {Math.min(startIndex + eventsPerPage, eventCategories.length)}{" "}
                of {eventCategories.length} events
              </p>
            </div>
          </div>
        )} */}

        {totalPages > 1 && (
          <div className="flex-shrink-0">
            <div className="flex justify-center items-center space-x-4 mb-4 portrait:mb-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-full 
                   bg-gray-100 text-gray-700 border border-gray-300 
                   transition-all duration-300 shadow-sm cursor-pointer
                   hover:bg-[#274c77] hover:text-white hover:shadow-md hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-2">
                {(() => {
                  const pages = [];
                  const showEllipsisBefore = currentPage > 3;
                  const showEllipsisAfter = currentPage < totalPages - 2;

                  // First Page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 cursor-pointer
                          ${
                            currentPage === 1
                              ? "bg-[#274c77] text-white shadow-md scale-110"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-[#274c77] hover:text-white hover:shadow-md hover:scale-105"
                          }`}
                    >
                      1
                    </button>,
                  );

                  if (showEllipsisBefore) {
                    pages.push(
                      <span
                        key="ellipsis-before"
                        className="px-2 text-gray-400 font-semibold select-none"
                      >
                        ...
                      </span>,
                    );
                  }

                  // Middle Pages
                  for (
                    let i = Math.max(2, currentPage - 1);
                    i <= Math.min(totalPages - 1, currentPage + 1);
                    i++
                  ) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 cursor-pointer
                            ${
                              currentPage === i
                                ? "bg-[#274c77] text-white shadow-md scale-110"
                                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-[#274c77] hover:text-white hover:shadow-md hover:scale-105"
                            }`}
                      >
                        {i}
                      </button>,
                    );
                  }

                  if (showEllipsisAfter) {
                    pages.push(
                      <span
                        key="ellipsis-after"
                        className="px-2 text-gray-900 font-semibold select-none"
                      >
                        ...
                      </span>,
                    );
                  }

                  // Last Page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 cursor-pointer
                            ${
                              currentPage === totalPages
                                ? "bg-[#274c77] text-white shadow-md scale-110"
                                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-[#274c77] hover:text-white hover:shadow-md hover:scale-105"
                            }`}
                      >
                        {totalPages}
                      </button>,
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-full 
                   bg-gray-100 text-gray-700 border border-gray-300 
                   transition-all duration-300 shadow-sm cursor-pointer
                   hover:bg-[#274c77] hover:text-white hover:shadow-md hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                –
                <span className="font-semibold">
                  {""}{" "}
                  {Math.min(startIndex + eventsPerPage, eventCategories.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{eventCategories.length}</span>{" "}
                events categories
              </p>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Toaster richColors position="top-center" />
            <div
              ref={modalRef}
              className="bg-white rounded-xl w-full max-w-4xl h-[75vh] shadow-xl"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Add New Event Category" : "Edit Event Category"}
                </h2>
                <X
                  className="h-6 w-6 hover:cursor-pointer text-gray-500"
                  onClick={closeModal}
                />
              </div>
              <div className="flex-1 p-6 min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Category Name *
                      </label>
                      <input
                        type="text"
                        name="eventCategoryName"
                        value={formData.eventCategoryName}
                        onChange={handleInputChange}
                        spellCheck={true}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter event category name"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Category Description *
                      </label>
                      <textarea
                        name="eventCategoryDescription"
                        value={formData.eventCategoryDescription}
                        onChange={handleInputChange}
                        spellCheck={true}
                        className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                        placeholder="Describe your event category here..."
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Category Logo
                      </label>
                      {/* DESKTOP VIEW – Fancy Drag & Drop Upload UI */}
                      <div className="hidden lg:block">
                        {!formData.eventCategoryLogo ? (
                          <div
                            className={`flex-1 border-3 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group relative overflow-hidden ${
                              dragActive
                                ? "border-blue-500 bg-blue-50 scale-105"
                                : "border-gray-300 hover:border-purple-900 hover:bg-blue-50"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {/* Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                            {/* Upload Content */}
                            <div className="relative py-9 z-10 flex flex-col items-center justify-center h-full space-y-4">
                              <div className="relative">
                                <div
                                  style={{ backgroundColor: "#274c77" }}
                                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    dragActive
                                      ? "scale-110 rotate-12"
                                      : "group-hover:scale-110"
                                  }`}
                                >
                                  <Camera className="text-white" size={32} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                                  <Plus className="text-white" size={16} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p
                                  className="text-lg font-semibold text-gray-700 transition-colors"
                                  style={{ color: "#274c77" }}
                                >
                                  {dragActive
                                    ? "Drop your image here!"
                                    : "Upload Logo"}
                                </p>
                                <p className="text-sm text-gray-900">
                                  Drag & drop or click to select
                                </p>
                                <p className="text-xs text-gray-900">
                                  PNG, JPG up to 2MB
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-80 relative rounded-xl overflow-hidden bg-gray-100 group border-2 border-gray-200">
                            {/* Logo Preview – visible on desktop only */}
                            <div className="hidden lg:block w-full h-full">
                              <img
                                src={URL.createObjectURL(
                                  formData.eventCategoryLogo,
                                )}
                                alt="Logo preview"
                                className="w-full h-full object-contain bg-white p-2"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-3">
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all transform hover:scale-110 shadow-lg"
                                >
                                  <Camera size={20} />
                                </button>
                                <button
                                  onClick={removeLogo}
                                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all transform hover:scale-110 shadow-lg"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* MOBILE VIEW – Minimal Upload Field */}
                      <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-gray-100 rounded-xl mt-4">
                        {!formData.eventCategoryLogo && (
                          <label
                            className="text-sm text-blue-700 cursor-pointer hover:underline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Upload Logo
                          </label>
                        )}
                        {formData.eventCategoryLogo ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm text-gray-800 truncate max-w-[180px]">
                              {formData.eventCategoryLogo.name}
                            </span>
                            <button
                              onClick={removeLogo}
                              className="text-red-500 hover:text-red-700 text-lg font-bold ml-2"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No file selected
                          </span>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handleLogoUpload(e.target.files[0])
                          }
                        />
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files[0] && handleLogoUpload(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 shrink-0">
                <button
                  onClick={closeModal}
                  className="px-5 border-2 hover:cursor-pointer border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105"
                >
                  Close
                </button>
                <ButtonLoader
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#274c77" }}
                  className="px-8 py-3 text-white hover:cursor-pointer rounded-xl hover:from-gray-700 hover:to-gray-700 shadow-lg"
                >
                  Create Event Category
                </ButtonLoader>
              </div>
            </div>
          </div>
        )}
      </div>
      <EventCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAllCategories} // or window.location.reload()
        isEditing={isEditing}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default ViewAllEvents;
