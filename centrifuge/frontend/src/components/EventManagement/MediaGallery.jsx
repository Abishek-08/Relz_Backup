import React, { useState, useRef, useEffect } from "react";

import {
  Play,
  Image,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PieChartIcon,
  BarChart3,
  ChevronDown,
  BarChart2,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  Search,
  X,
  RotateCcw,
  RotateCw,
  Edit,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  PieChart,
  LineChart,
  Line,
} from "recharts";

import axios from "axios";
import { useToast } from "../../utils/useToast";
import EditMediaModal from "./EditMediaModal/EditMediaModal";

function MediaGallery({ media, resources, selectedEventId }) {
  const [activeTab, setActiveTab] = useState("overall");
  const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [selectedMedia, setSelectedMedia] = useState(null);

  const [selectedChart, setSelectedChart] = useState("vertical-bar");

  const [isOpen, setIsOpen] = useState(false);

  const [selectedMediaChartData, setSelectedMediaChartData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const [individualAnalysisData, setIndividualAnalysisData] = useState(null);

  const [isIndividualAnalysis, setIsIndividualAnalysis] = useState(false);

  const [analyzedMediaInfo, setAnalyzedMediaInfo] = useState(null);
  const { success, error } = useToast();

  const [contextMenu, setContextMenu] = useState({
    visible: false,

    x: 0,

    y: 0,

    item: null,
  });

  // Preview Modal States

  const [previewModal, setPreviewModal] = useState({
    visible: false,

    item: null,
  });

  // Confirmation Modal States

  const [confirmModal, setConfirmModal] = useState({
    visible: false,

    item: null,

    position: { x: 0, y: 0 },
  });

  const contextMenuRef = useRef(null);

  // Color scheme for tabs

  const tabColors = {
    overall: { bg: "#274c77", text: "white" },

    images: { bg: "#274c77", text: "white" },

    videos: { bg: "#274c77", text: "white" },

    unknown: { bg: "#274c77", text: "white" },
  };

  // Close context menu when clicking outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ visible: false, x: 0, y: 0, item: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu.visible]);

  // Handle right-click on media item

  const handleMediaClick = (event, item) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();

    setContextMenu({
      visible: true,

      x: event.clientX,

      y: event.clientY,

      item: item,
    });
  };

  // Handle preview option

  const handlePreview = () => {
    setPreviewModal({
      visible: true,

      item: contextMenu.item,
    });

    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  // Handle analyze option

  const handleAnalyzeClick = () => {
    const rect = document
      .querySelector(`[data-media-key="${contextMenu.item.key}"]`)
      ?.getBoundingClientRect();

    setConfirmModal({
      visible: true,

      item: contextMenu.item,

      position: {
        x: rect ? rect.left + rect.width / 2 : contextMenu.x,

        y: rect ? rect.top + rect.height / 2 : contextMenu.y,
      },
    });

    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleIndividualAnalysis = async (item) => {
    try {
      setConfirmModal({ visible: false, item: null, position: { x: 0, y: 0 } });
      setLoading(true);

      const fileUrl = item.src;
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const fileName =
        fileUrl.split("/").pop() ||
        (item.type === "image" ? "image.jpg" : "video.mp4");
      const file = new File([blob], fileName, { type: blob.type });

      const formData = new FormData();
      formData.append("files", file); // key is "files" for both image and video

      const endpoint =
        item.type === "image"
          ? import.meta.env.VITE_MULTIPLE_IMAGE_DETECT_URL
          : import.meta.env.VITE_MULTIPLE_VIDEO_DETECT_URL;

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Full Response:", res.data);

      let genderData;

      if (item.type === "image") {
        const resultArray = res.data.results;
        if (!resultArray || resultArray.length === 0) {
          throw new Error("No analysis results returned for image.");
        }

        const result = resultArray[0];
        const {
          filename,
          male_count,
          female_count,
          unknown_count,
          total_count,
        } = result;

        genderData = {
          filename,
          maleCount: male_count,
          femaleCount: female_count,
          unknownCount: unknown_count,
          totalCount: total_count,
        };
      } else {
        const {
          filename,
          summary: { total_male, total_female, total_unknown, total_people },
        } = res.data;

        genderData = {
          filename,
          maleCount: total_male,
          femaleCount: total_female,
          unknownCount: total_unknown,
          totalCount: total_people,
        };
      }

      console.log(`${item.type} Gender Data`, genderData);

      setIndividualAnalysisData(genderData);
      setIsIndividualAnalysis(true);
      setAnalyzedMediaInfo(item);
    } catch (err) {
      console.error("Error analyzing individual media:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle reload functionality

  const handleReload = () => {
    setIndividualAnalysisData(null);

    setIsIndividualAnalysis(false);

    setAnalyzedMediaInfo(null);
  };

  // Close preview modal

  const closePreviewModal = () => {
    setPreviewModal({ visible: false, item: null });
  };

  // Close confirmation modal

  const closeConfirmModal = () => {
    setConfirmModal({ visible: false, item: null, position: { x: 0, y: 0 } });
  };

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />

        <p className="text-gray-500">No media uploaded yet</p>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="text-gray-400 p-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        No uploaded media found.
      </div>
    );
  }

  const noOfImages = resources.flatMap((res) => res.images || []);

  const noOfVideos = resources.flatMap((res) => res.videos || []);

  const totalMedia = noOfImages.length + noOfVideos.length;

  // Get filtered media based on active tab

  const getFilteredMedia = () => {
    if (activeTab === "images") {
      return resources.flatMap((res, i) =>
        (res.images || []).map((img, j) => ({
          type: "image",

          src: `${BASE_URL}/uploads/images/${img}`,

          key: `img-${i}-${j}`,

          name: `Image ${j + 1}`,

          fileName: img,
        }))
      );
    } else if (activeTab === "videos") {
      return resources.flatMap((res, i) =>
        (res.videos || []).map((vid, j) => ({
          type: "video",

          src: `${BASE_URL}/uploads/videos/${vid}`,

          key: `vid-${i}-${j}`,

          name: `Video ${j + 1}`,

          fileName: vid,
        }))
      );
    } else {
      // Overall - combine both images and videos

      const images = resources.flatMap((res, i) =>
        (res.images || []).map((img, j) => ({
          type: "image",

          src: `${BASE_URL}/uploads/images/${img}`,

          key: `img-${i}-${j}`,

          name: `Image ${j + 1}`,

          fileName: img,
        }))
      );

      const videos = resources.flatMap((res, i) =>
        (res.videos || []).map((vid, j) => ({
          type: "video",

          src: `${BASE_URL}/uploads/videos/${vid}`,

          key: `vid-${i}-${j}`,

          name: `Video ${j + 1}`,

          fileName: vid,
        }))
      );

      return [...images, ...videos];
    }
  };

  const filteredMedia = getFilteredMedia();

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);

  const currentItems = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage
  );

  const chartOptions = [
    { value: "vertical-bar", label: "Vertical Bar Chart", icon: BarChart3 },

    { value: "horizontal-bar", label: "Horizontal Bar Chart", icon: BarChart2 },

    { value: "pie-chart", label: "Pie Chart", icon: PieChartIcon },

    { value: "line-chart", label: "Line Chart", icon: TrendingUp },
  ];

  const getTabBasedChartData = () => {
    // If individual analysis is active, use that data

    if (isIndividualAnalysis && individualAnalysisData) {
      const { maleCount, femaleCount, unknownCount, totalCount } =
        individualAnalysisData;

      return {
        totalMale: maleCount || 0,

        totalFemale: femaleCount || 0,

        totalUnknown: unknownCount || 0,

        total: totalCount || 0,

        chartData: [
          { category: "Male", value: maleCount || 0 },

          { category: "Female", value: femaleCount || 0 },

          { category: "Unknown", value: unknownCount || 0 },
        ],
      };
    }

    // Otherwise use the original media data

    if (!Array.isArray(media))
      return {
        totalMale: 0,
        totalFemale: 0,
        totalUnknown: 0,
        total: 0,
        chartData: [],
      };

    let filtered = [];

    if (activeTab === "images") {
      filtered = media.filter((item) => item.resourceType === "IMAGES");
    } else if (activeTab === "videos") {
      filtered = media.filter((item) => item.resourceType === "VIDEOS");
    } else {
      filtered = media;
    }

    const totalMale = filtered.reduce(
      (sum, item) => sum + (parseInt(item.maleCount) || 0),

      0
    );

    const totalFemale = filtered.reduce(
      (sum, item) => sum + (parseInt(item.femaleCount) || 0),

      0
    );

    const totalUnknown = filtered.reduce(
      (sum, item) => sum + (parseInt(item.unknownCount) || 0),
      0
    );

    const total = totalMale + totalFemale + totalUnknown;

    return {
      totalMale,

      totalFemale,

      totalUnknown,

      total,

      chartData: [
        { category: "Male", value: totalMale },

        { category: "Female", value: totalFemale },

        { category: "Unknown", value: totalUnknown },
      ],
    };
  };

  const { totalMale, totalFemale, totalUnknown, total, chartData } =
    getTabBasedChartData();

  const COLORS = ["#000081", "#fd3db5", "#6a0dad"];

  // Custom tooltip component

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>

          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === "Male"
                ? "Male"
                : entry.dataKey === "Female"
                ? "Female"
                : entry.name}
              : {entry.value}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderChart = () => {
    const gradientDefs = (
      <defs>
        <linearGradient id="maleGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#79baec" />

          <stop offset="100%" stopColor="#4b4bff" />
        </linearGradient>

        <linearGradient id="femaleGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fd3db5" />

          <stop offset="100%" stopColor="#ff85d0" />
        </linearGradient>

        <linearGradient id="unknownGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9e9e9e" /> {/* Neutral gray */}
          <stop offset="100%" stopColor="#b39ddb" /> {/* Soft lavender */}
        </linearGradient>
      </defs>
    );

    switch (selectedChart) {
      case "horizontal-bar":
        return (
          <BarChart
            data={[
              { name: "Male", value: totalMale },
              { name: "Female", value: totalFemale },
              { name: "Unknown", value: totalUnknown },
            ]}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
          >
            {gradientDefs}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {[
                { name: "Male", value: totalMale },
                { name: "Female", value: totalFemale },
                { name: "Unknown", value: totalUnknown },
              ].map((entry, index) => {
                const gradientId =
                  entry.name === "Male"
                    ? "maleGradient"
                    : entry.name === "Female"
                    ? "femaleGradient"
                    : "unknownGradient";
                return (
                  <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
                );
              })}
            </Bar>
          </BarChart>
        );

      case "pie-chart":
        const pieValid = chartData.some((d) => d.value > 0);
        return pieValid ? (
          <PieChart>
            {gradientDefs}
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ category, value }) => `${category}: ${value}`}
            >
              {chartData.map((entry, index) => {
                const gradientId =
                  entry.category.toLowerCase() === "male"
                    ? "maleGradient"
                    : entry.category.toLowerCase() === "female"
                    ? "femaleGradient"
                    : "unknownGradient";
                return (
                  <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        ) : (
          <p>No data available</p>
        );

      case "line-chart":
        const lineData = [
          { name: "Start", Male: 0, Female: 0, Unknown: 0 },
          {
            name: "Current",
            Male: totalMale,
            Female: totalFemale,
            Unknown: totalUnknown,
          },
        ];
        return (
          <LineChart
            data={lineData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            {gradientDefs}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Male"
              stroke="#4b4bff"
              strokeWidth={3}
              dot={{ fill: "#4b4bff", strokeWidth: 2, r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Female"
              stroke="#fd3db5"
              strokeWidth={3}
              dot={{ fill: "#fd3db5", strokeWidth: 2, r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Unknown"
              stroke="#9e9e9e"
              strokeWidth={3}
              dot={{ fill: "#b39ddb", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        );

      default:
        return (
          <BarChart
            data={[
              { name: "Male", value: totalMale },
              { name: "Female", value: totalFemale },
              { name: "Unknown", value: totalUnknown },
            ]}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            {gradientDefs}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={150}>
              {[
                { name: "Male", value: totalMale },
                { name: "Female", value: totalFemale },
                { name: "Unknown", value: totalUnknown },
              ].map((entry, index) => {
                const gradientId =
                  entry.name === "Male"
                    ? "maleGradient"
                    : entry.name === "Female"
                    ? "femaleGradient"
                    : "unknownGradient";
                return (
                  <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
                );
              })}
            </Bar>
          </BarChart>
        );
    }
  };

  const CustomDropdown = () => {
    const selectedOption = chartOptions.find(
      (opt) => opt.value === selectedChart
    );

    const IconComponent = selectedOption?.icon || BarChart3;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer shadow-sm min-w-48"
          style={{
            borderColor: "#d1d5db",

            "--hover-border": "#dbe7f3",

            "--focus-border": "#274c77",

            "--focus-ring": "#dbe7f3",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#dbe7f3")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#274c77";

            e.currentTarget.style.boxShadow = "0 0 0 2px #dbe7f3";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#d1d5db";

            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <IconComponent className="w-4 h-4 text-blue-500" />

          <span className="flex-1 text-left">{selectedOption?.label}</span>

          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
            {chartOptions.map((option) => {
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedChart(option.value);

                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    selectedChart === option.value
                      ? "text-[#274c77] border-l-4"
                      : "text-gray-700 hover:text-[#274c77]"
                  }`}
                  style={{
                    backgroundColor:
                      selectedChart === option.value ? "#dbe7f3" : "",

                    borderColor:
                      selectedChart === option.value ? "#274c77" : "",
                  }}
                >
                  <OptionIcon
                    className={`w-4 h-4 ${
                      selectedChart === option.value
                        ? "text-[#274c77]"
                        : "text-gray-400"
                    }`}
                  />

                  {option.label}

                  {selectedChart === option.value && (
                    <div
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#274c77" }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: "calc(90vh - 70px)" }}>
      {/* Enhanced Loading Animation */}

      {loading && (
        <div
          style={{ height: "calc(90vh - 160px)" }}
          className="fixed ml-[1113px] mt-38 inset-0 flex items-center justify-center z-50 w-96 rounded-2xl flex flex-col overflow-hidden"
        >
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
                  Analyzing Media
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  Processing your media...
                  <br />
                  <span className="text-gray-500">
                    This may take a few moments
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

      {/* Context Menu */}

      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border rounded-lg shadow-xl z-50 py-2 min-w-48"
          style={{
            left: `${contextMenu.x}px`,

            top: `${contextMenu.y}px`,

            backgroundColor: "#f4f8fc",

            borderColor: "#274c77",
          }}
        >
          <button
            onClick={handlePreview}
            className="w-full flex items-center hover:cursor-pointer gap-3 px-4 py-2 text-sm text-gray-700 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#274c77";

              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";

              e.currentTarget.style.color = "";
            }}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={handleAnalyzeClick}
            className="w-full flex items-center hover:cursor-pointer gap-3 px-4 py-2 text-sm text-gray-700 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#274c77";

              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";

              e.currentTarget.style.color = "";
            }}
          >
            <Search className="w-4 h-4" />
            Analyze this {contextMenu.item?.type}
          </button>
        </div>
      )}

      {/* Preview Modal */}

      {previewModal.visible && previewModal.item && (
        <div
          className="fixed inset-0 backdrop-blur-[20px] bg-opacity-90 flex items-center justify-center z-50"
          onClick={closePreviewModal}
        >
          <div className="relative max-w-screen-lg max-h-screen-lg w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closePreviewModal}
              className="absolute top-4 right-4 text-black hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {previewModal.item.type === "image" ? (
              <img
                src={previewModal.item.src}
                alt={previewModal.item.name}
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                controls
                src={previewModal.item.src}
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
                autoPlay
              />
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}

      {confirmModal.visible && confirmModal.item && (
        <div className="fixed inset-0 backdrop-blur-[20px] bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all"
            style={{
              position: "relative",
            }}
          >
            <div className="text-center space-y-4">
              <div
                style={{ backgroundColor: "#274c77" }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              >
                <Search className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                Analyze {confirmModal.item.type === "image" ? "Image" : "Video"}
                ?
              </h3>

              <p className="text-gray-600">
                Are you sure you want to analyze this {confirmModal.item.type}?
                This will process the media and generate gender analytics.
              </p>

              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={closeConfirmModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleIndividualAnalysis(confirmModal.item)}
                  style={{ backgroundColor: "#274c77" }}
                  className="px-6 py-2 text-white rounded-lg hover:from-blue-600 hover:to-pink-600 hover:cursor-pointer transition-colors"
                >
                  Yes, Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left side - Charts */}

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 flex flex-col h-[600px]">
            {/* Analytics header with total count and dropdown */}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {isIndividualAnalysis
                    ? "Individual Analysis"
                    : "Analytics Overview"}
                </h3>

                {isIndividualAnalysis && (
                  <button
                    onClick={handleReload}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                    title="Reload"
                  >
                    <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />

                    <span className="hidden group-hover:inline">Reload</span>
                  </button>
                )}
              </div>

              <CustomDropdown />
            </div>

            {/* Individual Analysis Info */}

            {isIndividualAnalysis && analyzedMediaInfo && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Analyzed Media:</span>{" "}
                  {analyzedMediaInfo.fileName}
                </p>
              </div>
            )}

            {/* Total count display */}

            <div className="flex items-center justify-center gap-8 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />

                <span className="text-sm font-bold text-purple-700">
                  Total: {total}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>

                <span className="text-sm font-medium text-gray-700">
                  Male: {totalMale}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-600"></div>

                <span className="text-sm font-medium text-gray-700">
                  Female: {totalFemale}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[linear-gradient(to_right,_#9e9e9e,_#b39ddb)]"></div>
                <span className="text-sm font-medium text-gray-700">
                  Unknown: {totalUnknown}
                </span>
              </div>
            </div>

            {/* Chart area */}

            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100 p-1">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right side - Media Gallery */}

        <div className="w-96 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* Header with tabs inside */}

          <div
            className="p-4 pb-1 rounded-t-2xl"
            style={{ backgroundColor: "#274c77" }}
          >
            <div className="flex justify-center mb-4">
              <div className="flex bg-gray-200 rounded-2xl p-2 space-x-1">
                <button
                  onClick={() => {
                    setActiveTab("overall");

                    setSelectedMedia(null);

                    setCurrentPage(1);
                  }}
                  className={`relative px-6 py-3 font-medium transition-all hover:cursor-pointer duration-300 rounded-xl ${
                    activeTab === "overall"
                      ? "text-white shadow-lg transform scale-105"
                      : "text-black hover:bg-black/10"
                  }`}
                  style={{
                    background:
                      activeTab === "overall"
                        ? tabColors.overall.bg
                        : "transparent",
                  }}
                >
                  Overall ({totalMedia})
                </button>

                <button
                  onClick={() => {
                    setActiveTab("images");

                    setSelectedMedia(null);

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

                    setSelectedMedia(null);

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

          {/* Media Section */}
          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            {/* Edit button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setIsEditMediaModalOpen(true)}
                title="Edit Event"
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#274c77] hover:bg-[#3c6ea5] rounded-lg shadow-md transition"
              >
                <Edit size={18} />
                <span>Edit Media</span>
              </button>

              <EditMediaModal
                isOpen={isEditMediaModalOpen}
                onClose={() => setIsEditMediaModalOpen(false)}
                eventId = {selectedEventId}
              />
            </div>

            {/* Scrollable grid */}
            <div className="flex-1 overflow-y-auto">
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {currentItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={(e) => handleMediaClick(e, item)}
                      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition hover:scale-105 relative group h-24"
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.src}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        {item.type === "video" ? (
                          <Play className="w-8 h-8 text-white" />
                        ) : (
                          <Eye className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p>
                      No {activeTab === "overall" ? "media" : activeTab}{" "}
                      uploaded
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination bar stays visible */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span className="text-sm text-gray-600">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MediaGallery);
