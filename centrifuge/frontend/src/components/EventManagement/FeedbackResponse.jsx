import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  ChevronDown,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Mountain,
  Target,
  Info,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import Navbar from "../Navbar/Navbar";
import {
  getEventById,
  getFeedbackResponsesByEventId,
} from "../../services/Services";
import { generateFeedbackPDF } from "../../components/EventManagement/PdfExportService";
import ButtonLoader from "../../utils/ButtonLoader";
import { ExcelExportService } from "./ExcelExportService";
import { decryptSession } from "../../utils/SessionCrypto";

function FeedbackResponse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = location.state || {};
  const [feedbackData, setFeedbackData] = useState([]);
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    const fetchEventById = async () => {
      if (!eventId) return;
      try {
        const response = await getEventById(eventId);
        setEventData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEventById();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      try {
        const response = await getFeedbackResponsesByEventId(eventId);
        setFeedbackData(response.data);
        console.log("FEEDBACK RESPONSE", response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchData();
  }, [eventId]);

  const [selectedView, setSelectedView] = useState("overview");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [chartType, setChartType] = useState("vertical-bar");
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);
  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponseLabel, setSelectedResponseLabel] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);

  const allQuestions = feedbackData.map((item, index) => ({
    id: item.feedbackQuestion.feedbackQuestionId || index,
    question: item.feedbackQuestion.feedbackQuestion,
    displayText: `Question ${index + 1}: ${item.feedbackQuestion.feedbackQuestion}`,
  }));

  const uniqueQuestionsForDropdown = allQuestions.reduce((acc, current) => {
    const existingIndex = acc.findIndex(
      (item) => item.question === current.question,
    );
    if (existingIndex === -1) {
      acc.push(current);
    }
    return acc;
  }, []);

  const filteredQuestions = uniqueQuestionsForDropdown.filter((questionObj) =>
    questionObj.question
      .toLowerCase()
      .includes(questionSearchTerm.toLowerCase()),
  );

  const handleViewChange = (view) => {
    setSelectedView(view);
    if (view !== "individual") {
      setSelectedQuestion("");
      setQuestionSearchTerm("");
    }
  };

  const emojiLabels = {
    5: {
      label: "Excellent",
      emoji: "🤩",
      color: "#0f766e",
      gradient: "linear-gradient(135deg, #0f766e, #2dd4bf)",
    },
    4: {
      label: "Good",
      emoji: "😊",
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #15803d, #86efac)",
    },
    3: {
      label: "Average",
      emoji: "😐",
      color: "#fbbf24",
      gradient: "linear-gradient(135deg, #f59e0b, #fde68a)",
    },
    2: {
      label: "Poor",
      emoji: "😕",
      color: "#f97316",
      gradient: "linear-gradient(135deg, #ea580c, #fdba74)",
    },
    1: {
      label: "Very Poor",
      emoji: "😢",
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #991b1b, #fca5a5)",
    },
  };

  const chartOptions = [
    { value: "vertical-bar", label: "Vertical Bar Chart", icon: BarChart3 },
    { value: "pie", label: "Pie Chart", icon: PieChartIcon },
    { value: "line", label: "Line Chart", icon: Activity },
    { value: "area", label: "Area Chart", icon: Mountain },
    { value: "radar", label: "Radar Chart", icon: Target },
  ];

  const ChartTypeDropdown = ({ selectedChart, setSelectedChart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = chartOptions.find(
      (opt) => opt.value === selectedChart,
    );
    const IconComponent = selectedOption?.icon || BarChart3;
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer shadow-sm min-w-48"
          style={{ borderColor: "#d1d5db" }}
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
          <IconComponent className="w-4 h-4 text-[#274c77]" />
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
              const isSelected = selectedChart === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedChart(option.value);
                    setIsOpen(false);
                  }}
                  className={`hover:cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    isSelected
                      ? "text-[#274c77] border-l-4"
                      : "text-gray-700 hover:text-[#274c77]"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "#dbe7f3" : "",
                    borderColor: isSelected ? "#274c77" : "",
                  }}
                >
                  <OptionIcon
                    className={`w-4 h-4 ${
                      isSelected ? "text-[#274c77]" : "text-gray-400"
                    }`}
                  />
                  {option.label}
                  {isSelected && (
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

  const processOverviewData = () => {
    const chartData = [];
    for (let rating = 5; rating >= 1; rating--) {
      const totalCount = feedbackData.filter(
        (item) => item.feedbackResponse === rating,
      ).length;
      chartData.push({
        rating,
        label: emojiLabels[rating].label,
        emoji: emojiLabels[rating].emoji,
        count: totalCount,
        color: emojiLabels[rating].color,
        fullLabel: `${emojiLabels[rating].emoji} ${emojiLabels[rating].label}`,
      });
    }
    return chartData;
  };

  const processQuestionData = (questionText) => {
    if (!questionText) return [];
    const questionData = feedbackData.filter(
      (item) => item.feedbackQuestion.feedbackQuestion === questionText,
    );
    const chartData = [];
    for (let rating = 5; rating >= 1; rating--) {
      const count = questionData.filter(
        (item) => item.feedbackResponse === rating,
      ).length;
      chartData.push({
        rating,
        label: emojiLabels[rating].label,
        emoji: emojiLabels[rating].emoji,
        count,
        color: emojiLabels[rating].color,
        fullLabel: `${emojiLabels[rating].emoji} ${emojiLabels[rating].label}`,
      });
    }
    return chartData;
  };

  const totalUsers = [
    ...new Set(feedbackData.map((item) => item.feedbackUser.feedbackUserId)),
  ].length;
  console.log("totalUser", totalUsers);
  const allUsers = [
    ...new Set(feedbackData.map((item) => item.feedbackUser.feedbackUserId)),
  ].map((userId) => {
    const userResponse = feedbackData.find(
      (item) => item.feedbackUser.feedbackUserId === userId,
    );
    return {
      id: userId,
      name: userResponse.feedbackUser.feedbackUserName,
      email: userResponse.feedbackUser.feedbackUserEmail,
      isVerified: userResponse.feedbackUser.isVerified,
    };
  });
  const overviewData = processOverviewData();

  const filteredUsers = allUsers.filter((user) => {
    const nameLower = user.name?.toLowerCase() || "";
    const emailLower = user.email?.toLowerCase() || "";
    const matchesSearch =
      nameLower.includes(searchTerm) || emailLower.includes(searchTerm);
    const matchesResponse =
      !selectedResponseLabel ||
      feedbackData.some((item) => {
        const label = emojiLabels[item.feedbackResponse]?.label || "";

        return (
          item.feedbackUser.feedbackUserId === user.id &&
          label.toLowerCase() === selectedResponseLabel.toLowerCase()
        );
      });
    const matchesType =
      selectedUserType === ""
        ? true
        : selectedUserType === "anonymous"
          ? nameLower === "anonymous" || emailLower === "anonymous"
          : nameLower !== "anonymous" && emailLower !== "anonymous";
    return matchesSearch && matchesResponse && matchesType;
  });
  const totalUsersCount = filteredUsers.length;
  const totalPages = Math.ceil(totalUsersCount / itemsPerPage);

  const QuestionDropdown = ({ selectedQuestion, setSelectedQuestion }) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      if (!selectedQuestion && uniqueQuestionsForDropdown.length > 0) {
        setSelectedQuestion(uniqueQuestionsForDropdown[0].question);
      }
    }, [selectedQuestion, setSelectedQuestion]);
    if (uniqueQuestionsForDropdown.length === 0) {
      return (
        <div className="w-full mt-6 flex flex-col items-center justify-center text-center bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center bg-[#e0ecf5] rounded-full mb-4">
            <Info size={32} className="text-[#274c77]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            No questions available to analyze
          </h3>
        </div>
      );
    }
    const selectedIndex = uniqueQuestionsForDropdown.findIndex(
      (q) => q.question === selectedQuestion,
    );
    const selectedLabel = selectedQuestion
      ? `Question ${selectedIndex + 1}: ${selectedQuestion}`
      : "Select a question to analyze";
    return (
      <div className="relative w-full mt-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-[#274c77] rounded-lg bg-white text-gray-800 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#274c77]"
        >
          <span
            className={`${
              !selectedQuestion ? "text-gray-500" : ""
            } hover:cursor-pointer`}
          >
            {selectedLabel}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#274c77] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-[#274c77] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {uniqueQuestionsForDropdown.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-500 italic text-center">
                No questions available to analyze.
              </li>
            ) : (
              uniqueQuestionsForDropdown.map((questionObj, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedQuestion(questionObj.question);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-800 hover:bg-[#dbe7f3] cursor-pointer transition-colors"
                >
                  Question {index + 1}: {questionObj.question}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data.emoji}</span>
            <span className="text-lg font-semibold">{data.label}</span>
          </div>
          <p className="font-semibold" style={{ color: data.color }}>
            Count: {data.count}
          </p>
          <p className="text-gray-600">
            Percentage:{" "}
            {(
              (data.count /
                (selectedView === "overview"
                  ? totalUsers * uniqueQuestionsForDropdown.length
                  : totalUsers)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    emoji,
    label,
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {emoji}
      </text>
    );
  };

  const renderChart = (data) => {
    const currentData =
      selectedView === "individual" && selectedQuestion
        ? processQuestionData(selectedQuestion)
        : data;
    const filteredData = currentData.filter((item) => item.count > 0);
    switch (chartType) {
      case "pie":
        if (filteredData.length === 0) {
          return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-center bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center bg-[#e0ecf5] rounded-full mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No data available
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                There are no responses to display in the pie chart.
              </p>
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry) => entry.payload.fullLabel}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="fullLabel"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{
                  value: "Responses",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 6 }}
                activeDot={{ r: 8, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="fullLabel"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{
                  value: "Responses",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                fill="url(#areaGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={currentData}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, Math.max(...currentData.map((d) => d.count))]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Responses"
                dataKey="count"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="fullLabel"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{
                  value: "Responses",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const filteredUsers1 = allUsers.filter((user) => {
    const userResponses = feedbackData.filter(
      (item) => item.feedbackUser.feedbackUserId === user.id,
    );
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesQuestion = selectedQuestion
      ? userResponses.some(
          (r) => r.feedbackQuestion.feedbackQuestion === selectedQuestion,
        )
      : true;
    const matchesResponse = selectedResponseLabel
      ? userResponses.some(
          (r) =>
            emojiLabels[r.feedbackResponse]?.label === selectedResponseLabel,
        )
      : true;
    return matchesSearch && matchesQuestion && matchesResponse;
  });

  const handleBackClick = () => {
    const eventId = Number(
      decryptSession(localStorage.getItem("selectedEventId")),
    );
    if (eventId) {
      navigate(`/events/${eventId}`);
    } else {
      console.warn("No event ID found in session");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Navbar />
      <div className="pt-20 h-full w-full flex flex-col overflow-hidden">
        <button
          onClick={handleBackClick}
          style={{ backgroundColor: "#274c77" }}
          className="fixed hover:cursor-pointer top-19.5 left-4 z-50 group flex items-center space-x-3 backdrop-blur-lg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:from-gray-700/95 hover:to-gray-600/95 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <ArrowLeft className="hover:cursor-pointer w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back</span>
        </button>

        <div className="text-center mb-4 flex-shrink-0">
          <div className="flex justify-center items-center gap-8">
            <div className="bg-[#274c77] px-4 py-2 rounded-lg">
              <span className="text-white">Total No. of User Responses: </span>
              <span className="inline-flex items-center justify-center font-bold text-gray-900 bg-white rounded-full w-6 h-6 text-xs">
                {" "}
                {totalUsers}{" "}
              </span>
            </div>
            <div className="bg-[#274c77] px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="text-white">Total No. of Questions: </span>
              <span className="inline-flex items-center justify-center font-bold text-gray-900 bg-white rounded-full w-6 h-6 text-xs">
                {uniqueQuestionsForDropdown.length}
              </span>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end mt-4 sm:-mt-10 sm:mr-4 gap-3">
            {/* Export PDF */}
            <button
              onClick={async () => {
                try {
                  setIsPdfLoading(true);
                  await generateFeedbackPDF(
                    feedbackData,
                    overviewData,
                    allUsers,
                    uniqueQuestionsForDropdown,
                    eventData,
                  );
                } finally {
                  setIsPdfLoading(false);
                }
              }}
              disabled={isPdfLoading || totalUsers === 0}
              className={`bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-gray-800 font-medium shadow-md border border-gray-300 transition-all
                ${isPdfLoading || totalUsers === 0 ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              title={
                totalUsers === 0
                  ? "No Feedback responses found for exporting"
                  : ""
              }
            >
              {isPdfLoading ? (
                <div className="flex items-center gap-2">
                  <FaFilePdf className="text-red-600" size={20} />
                  <span>Exporting...</span>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <FaFilePdf className="text-red-600" size={20} />
                  <span>Export PDF</span>
                </>
              )}
            </button>

            {/* Export Excel */}
            <button
              onClick={async () => {
                try {
                  setIsExcelLoading(true);
                  await ExcelExportService(
                    feedbackData,
                    overviewData,
                    allUsers,
                    uniqueQuestionsForDropdown,
                    eventData,
                  );
                } finally {
                  setIsExcelLoading(false);
                }
              }}
              disabled={isExcelLoading || totalUsers === 0}
              className={`bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-gray-800 font-medium shadow-md border border-gray-300 transition-all
                ${isExcelLoading || totalUsers === 0 ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              title={
                totalUsers === 0
                  ? "No Feedback responses found for exporting"
                  : ""
              }
            >
              {isExcelLoading ? (
                <div className="flex items-center gap-2">
                  <FaFileExcel className="text-green-600" size={20} />
                  <span>Exporting...</span>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <FaFileExcel className="text-green-600" size={20} />
                  <span>Export Excel</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex p-4 items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex justify-start flex-grow">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => handleViewChange("overview")}
                className={`px-4 py-2 rounded-md hover:cursor-pointer font-medium transition-all duration-200 ${
                  selectedView === "overview"
                    ? "bg-[#274c77] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleViewChange("individual")}
                className={`px-4 py-2 rounded-md hover:cursor-pointer font-medium transition-all duration-200 ${
                  selectedView === "individual"
                    ? "bg-[#274c77] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Individual Questions
              </button>
              <button
                onClick={() => handleViewChange("users")}
                className={`px-4 py-2 rounded-md hover:cursor-pointer font-medium transition-all duration-200 ${
                  selectedView === "users"
                    ? "bg-[#274c77] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                User Responses
              </button>
            </div>
          </div>

          {(selectedView === "overview" ||
            (selectedView === "individual" && selectedQuestion)) && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Select Chart Type:
              </label>
              <ChartTypeDropdown
                selectedChart={chartType}
                setSelectedChart={setChartType}
              />
            </div>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden "
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          {selectedView === "overview" && (
            <div className="px-2">
              <div className="h-64 w-full mb-4">
                {renderChart(overviewData)}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {overviewData.map((item) => (
                  <div
                    key={item.rating}
                    className="text-center p-3 rounded-lg text-white shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: item.color }}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-medium opacity-90">
                      {item.label}
                    </div>
                    <div className="text-lg font-bold">{item.count}</div>
                    <div className="text-xs opacity-75">
                      {(
                        (item.count /
                          (totalUsers * uniqueQuestionsForDropdown.length)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === "individual" && (
            <div className="px-2">
              <div className="mb-4">
                <QuestionDropdown
                  selectedQuestion={selectedQuestion}
                  setSelectedQuestion={setSelectedQuestion}
                />
              </div>

              {selectedQuestion && (
                <>
                  <div className="h-64 w-full mb-4">
                    {renderChart(processQuestionData(selectedQuestion))}
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {processQuestionData(selectedQuestion).map((item) => (
                      <div
                        key={item.rating}
                        className="text-center p-3 rounded-lg text-white shadow-sm hover:shadow-md transition-shadow"
                        style={{ background: item.color }}
                      >
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-xs font-medium opacity-90">
                          {item.label}
                        </div>
                        <div className="text-lg font-bold">{item.count}</div>
                        <div className="text-xs opacity-75">
                          {((item.count / totalUsers) * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {selectedView === "users" && (
            <div className="px-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-2">
                <div className="overflow-x-auto">
                  <div className="flex flex-wrap gap-4 justify-between items-center mb-4 px-2 mt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Rows per page:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77]"
                      >
                        {[5, 10, 15, 20].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Search name / email:
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value.toLowerCase());
                          setCurrentPage(1);
                        }}
                        placeholder="e.g. gokul anand"
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        User type:
                      </label>
                      <select
                        value={selectedUserType}
                        onChange={(e) => {
                          setSelectedUserType(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77]"
                      >
                        <option value="">All</option>
                        <option value="anonymous">Anonymous</option>
                        <option value="unanonymous">Non-anonymous</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Filter response By Status:
                      </label>
                      <select
                        value={selectedResponseLabel}
                        onChange={(e) => {
                          setSelectedResponseLabel(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77]"
                      >
                        <option value="">All</option>
                        {Object.entries(emojiLabels).map(([key, val]) => (
                          <option key={key} value={val.label}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-200 min-w-32">
                          Username
                        </th>
                        <th className="sticky left-32 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-200 min-w-48">
                          Email
                        </th>
                        <th className="sticky left-32 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-200 min-w-48">
                          Verification Status
                        </th>
                        {uniqueQuestionsForDropdown.map(
                          (questionObj, index) => (
                            <th
                              key={index}
                              className="sticky px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-200 min-w-24"
                            >
                              <div className="text-xs">Q{index + 1}</div>
                              <div
                                className="text-xs text-gray-500 mt-1 truncate max-w-20"
                                title={questionObj.question}
                              >
                                {questionObj.question.substring(0, 15)}...
                              </div>
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedUsers.map((user, userIndex) => {
                        const userResponses = feedbackData.filter(
                          (item) =>
                            item.feedbackUser.feedbackUserId === user.id,
                        );
                        return (
                          <tr
                            key={user.id}
                            className={`hover:bg-gray-50 ${
                              userIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                          >
                            <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
                              {user.name?.toLowerCase() === "anonymous" ||
                              user.email?.toLowerCase() === "anonymous"
                                ? "Anonymous"
                                : user.name &&
                                    user.name.toLowerCase() !== "null"
                                  ? user.name
                                  : "Unknown"}
                            </td>
                            <td className="sticky left-32 bg-inherit px-4 py-3 text-gray-600 border-r border-gray-200">
                              {user.email?.toLowerCase() === "anonymous"
                                ? "Anonymous"
                                : user.email || "-"}
                            </td>
                            <td className="sticky bg-white left-32 bg-inherit px-4 py-3 border-r border-gray-200">
                              {user.isVerified ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Verified
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Not Verified
                                </span>
                              )}
                            </td>
                            {uniqueQuestionsForDropdown.map(
                              (questionObj, qIndex) => {
                                const response = userResponses.find(
                                  (r) =>
                                    r.feedbackQuestion.feedbackQuestion ===
                                    questionObj.question,
                                );
                                const rating = response
                                  ? response.feedbackResponse
                                  : null;
                                return (
                                  <td
                                    key={qIndex}
                                    className="sticky px-4 py-3 bg-white text-center border-r border-gray-200"
                                  >
                                    {rating ? (
                                      <div className="group relative inline-block">
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-110 transition-transform shadow-sm"
                                          style={{
                                            backgroundColor:
                                              emojiLabels[rating]?.color,
                                          }}
                                        >
                                          {rating}
                                        </div>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                          <div className="text-lg">
                                            {emojiLabels[rating]?.emoji}
                                          </div>
                                          <div className="text-xs">
                                            {emojiLabels[rating]?.label}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                );
                              },
                            )}
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td
                            colSpan={uniqueQuestionsForDropdown.length + 3}
                            className="text-center py-6 text-gray-500"
                          >
                            Record not found!.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredUsers1.length > itemsPerPage && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    {(() => {
                      const pages = [];
                      const showEllipsisBefore = currentPage > 3;
                      const showEllipsisAfter = currentPage < totalPages - 2;
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className={`px-3 py-1 rounded-md border text-sm font-medium ${
                            currentPage === 1
                              ? "bg-[#274c77] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          1
                        </button>,
                      );
                      if (showEllipsisBefore) {
                        pages.push(
                          <span
                            key="ellipsis-before"
                            className="px-2 text-gray-500 font-medium"
                          >
                            ...
                          </span>,
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
                            onClick={() => setCurrentPage(i)}
                            className={`px-3 py-1 rounded-md border text-sm font-medium ${
                              currentPage === i
                                ? "bg-[#274c77] text-white"
                                : "text-gray-700 hover:bg-gray-100"
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
                            className="px-2 text-gray-500 font-medium"
                          >
                            ...
                          </span>,
                        );
                      }
                      if (totalPages > 1) {
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-3 py-1 rounded-md border text-sm font-medium ${
                              currentPage === totalPages
                                ? "bg-[#274c77] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {totalPages}
                          </button>,
                        );
                      }
                      return pages;
                    })()}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default FeedbackResponse;
