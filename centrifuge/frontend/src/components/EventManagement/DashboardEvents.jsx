import { useEffect, useState } from "react";
import {
  BarChart3,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AreaChart as AreaChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getGenderAnalytics } from "../../services/Services";

function DashboardEvents({ events }) {
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedChartType, setSelectedChartType] = useState("vertical-bar");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedPieEvent, setSelectedPieEvent] = useState(0);
  const GRADIENT_COLORS = {
    male: { from: "#79baec", to: "#4b4bff" },
    female: { from: "#fd3db5", to: "#ff85d0" },
    unknown: { from: "#9e9e9e", to: "#b39ddb" },
  };

  const completedEvents = events
    ? events.filter(
        (event) =>
          event.eventStatus && event.eventStatus.toLowerCase() === "completed"
      )
    : [];

  const genderLegendPayload = () => {
    const items = [{
      label: "Male",
      color: GRADIENT_COLORS.male
    },
    {
      label: "Female",
      color: GRADIENT_COLORS.female
    },
    {
      label: "Unknown",
      color: GRADIENT_COLORS.unknown
    },
  ];

   return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
{items.map(item => (
        <div
          key={item.label}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: item.color,
              borderRadius: 2
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchGenderAnalytics = async () => {
      if (!completedEvents || completedEvents.length === 0) {
        setGenderData([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const genderPromises = completedEvents.map(async (event) => {
          try {
            const analytics = await getGenderAnalytics(event.eventId);
            const data = analytics.data;
            const item = Array.isArray(data) && data.length > 0 ? data[0] : {};
            return {
              eventId: event.eventId,
              eventName: event.eventName || `Event ${event.eventId}`,
              eventDate: event.eventDate, // make sure backend sends this, e.g. "2025-09-20"
              maleCount: item.maleCount || 0,
              femaleCount: item.femaleCount || 0,
              unknownCount: item.unknownCount || 0,
              totalCount:
                (item.maleCount || 0) +
                (item.femaleCount || 0) +
                (item.unknownCount || 0),
            };
          } catch (err) {
            console.error(
              `Error fetching analytics for event ${event.eventId}:`,
              err
            );
            return {
              eventId: event.eventId,
              eventName: event.eventName || `Event ${event.eventId}`,
              maleCount: 0,
              femaleCount: 0,
              unknownCount: 0,
              totalCount: 0,
            };
          }
        });

        const results = await Promise.all(genderPromises);
        setGenderData(results);
        setAnimationKey((prev) => prev + 1);
      } catch (err) {
        console.error("Error fetching gender analytics:", err);
        setError("Failed to load gender analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchGenderAnalytics();
  }, [events]);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
    setCurrentPage(1);
    setSelectedPieEvent(0);
  }, [selectedChartType]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredGenderData = genderData.filter((item) => {
    if (!item.eventDate) return false; // ignore if no date
    const d = new Date(item.eventDate); // parse ISO string
    const monthMatch = filterMonth
      ? d.getMonth() + 1 === parseInt(filterMonth)
      : true;
    const yearMatch = filterYear
      ? d.getFullYear() === parseInt(filterYear)
      : true;
    return monthMatch && yearMatch;
  });

  const currentData =
    selectedChartType === "pie-chart"
      ? filteredGenderData
      : filteredGenderData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredGenderData.length / itemsPerPage);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const labelMap = {
        maleCount: "Male",
        femaleCount: "Female",
        unknownCount: "Unknown",
      };
      const colorMap = {
        maleCount: "#4b4bff",
        femaleCount: "#fd3db5",
        unknownCount: "#9e9e9e",
      };
      return (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
            backdropFilter: "blur(20px)",
            padding: "12px",
            borderRadius: "12px",
            boxShadow:
              "0 15px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)",
            animation: "tooltipFadeIn 0.3s ease-out",
            transform: "translateY(-8px)",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              marginBottom: "6px",
              color: "#2d3748",
              fontSize: "12px",
            }}
          >
            {label}
          </div>
          {payload.map((entry, index) => {
            const displayLabel = labelMap[entry.dataKey] || entry.dataKey;
            const color = colorMap[entry.dataKey] || entry.color;
            return (
              <div
                key={index}
                style={{
                  margin: "4px 0",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    marginRight: "6px",
                    boxShadow: `0 2px 6px ${color}40`,
                  }}
                ></div>
                <span style={{ color, fontWeight: "600" }}>
                  {displayLabel}: {entry.value}
                </span>
              </div>
            );
          })}
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: "6px",
              marginTop: "6px",
            }}
          >
            <span
              style={{ fontWeight: "600", color: "#2d3748", fontSize: "11px" }}
            >
              Total: {payload.reduce((sum, entry) => sum + entry.value, 0)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartOptions = [
    { value: "vertical-bar", label: "Vertical Bar Chart", icon: BarChart3 },
    { value: "horizontal-bar", label: "Horizontal Bar Chart", icon: BarChart2 },
    // { value: "pie-chart", label: "Pie Chart", icon: PieChartIcon },
    { value: "line-chart", label: "Line Chart", icon: TrendingUp },
    { value: "area-chart", label: "Area Chart", icon: AreaChartIcon },
  ];

  const ChartDropdown = ({ selectedChartType, setSelectedChartType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = chartOptions.find(
      (opt) => opt.value === selectedChartType
    );
    const IconComponent = selectedOption?.icon || BarChart3;
    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer shadow-sm min-w-48"
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
          <IconComponent className="w-4 h-4 text-gray-400" />
          {selectedOption?.label}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ml-auto ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 50,
              marginTop: "4px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            {chartOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = selectedChartType === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedChartType(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 ${
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
                    <div className="ml-auto w-2 h-2 bg-[#274c77] rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const Pagination = () => {
    if (selectedChartType === "pie-chart" && genderData.length > 1) {
      return (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() =>
              setSelectedPieEvent(Math.max(0, selectedPieEvent - 1))
            }
            disabled={selectedPieEvent === 0}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-3 h-3" />
            Previous
          </button>
          <span className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg font-medium">
            {genderData[selectedPieEvent]?.eventName} ({selectedPieEvent + 1} of{" "}
            {genderData.length})
          </span>
          <button
            onClick={() =>
              setSelectedPieEvent(
                Math.min(genderData.length - 1, selectedPieEvent + 1)
              )
            }
            disabled={selectedPieEvent === genderData.length - 1}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            Next
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      );
    }
    if (totalPages > 1 && selectedChartType !== "pie-chart") {
      return (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-3 h-3" />
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? "bg-[#274c77] text-white shadow-md"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            Next
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      );
    }
    return null;
  };

  if (!events || events.length === 0) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
            📊
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "500", color: "#718096" }}
          >
            No events available for analytics
          </div>
          <div style={{ fontSize: "14px", color: "#a0aec0", marginTop: "8px" }}>
            Charts will display once events are added
          </div>
        </div>
      </div>
    );
  }

  if (completedEvents.length === 0) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
            📊
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "500", color: "#718096" }}
          >
            No completed events yet
          </div>
          <div style={{ fontSize: "14px", color: "#a0aec0", marginTop: "8px" }}>
            Charts will display as soon as at least one event completes
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        padding: "1.5rem",
        maxHeight: "800px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        animation: "fadeInScale 0.8s ease-out",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="maleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GRADIENT_COLORS.male.from} />
            <stop offset="100%" stopColor={GRADIENT_COLORS.male.to} />
          </linearGradient>
          <linearGradient id="femaleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GRADIENT_COLORS.female.from} />
            <stop offset="100%" stopColor={GRADIENT_COLORS.female.to} />
          </linearGradient>
          <linearGradient
            id="unknownGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={GRADIENT_COLORS.unknown.from} />
            <stop offset="100%" stopColor={GRADIENT_COLORS.unknown.to} />
          </linearGradient>
        </defs>
      </svg>
      {error && (
        <div
          style={{
            padding: "16px",
            background: "linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)",
            border: "1px solid #fc8181",
            borderRadius: "12px",
            marginBottom: "1rem",
            color: "#c53030",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "14px",
            animation: "slideInUp 0.5s ease-out",
          }}
        >
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex gap-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="">All Years</option>
            {Array.from(
              new Set(
                genderData.map((item) => {
                  if (!item.eventDate) return null;
                  return new Date(item.eventDate).getFullYear();
                })
              )
            )
              .filter(Boolean)
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
        {/* <h2 className="text-xl font-bold text-gray-800">
          Gender Analytics - Completed Events ({completedEvents.length})
        </h2> */}
        {/* <ChartDropdown selectedChartType={selectedChartType} setSelectedChartType={setSelectedChartType} />   */}

        <h2 className="text-xl font-bold text-gray-800">
          Gender Analytics - Completed Events ({completedEvents.length})
        </h2>
        <ChartDropdown
          selectedChartType={selectedChartType}
          setSelectedChartType={setSelectedChartType}
        />
      </div>
      {loading && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            animation: "fadeInScale 0.5s ease-out",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #667eea",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <div
            style={{
              fontSize: "16px",
              color: "#4a5568",
              fontWeight: "500",
            }}
          >
            Loading analytics...
          </div>
        </div>
      )}
      {!loading && genderData.length > 0 && (
        <div
          className="h-[492px]"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
            animation: `fadeInScale 0.8s ease-out ${animationKey * 0.1}s both`,
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            {currentData.length === 0 ? (
              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  height: "100%",

                  fontSize: "14px",

                  color: "#718096",

                  fontWeight: "500",

                  background: "rgba(255,255,255,0.6)",

                  borderRadius: "8px",
                }}
              >
                No events found for the selected filter
              </div>
            ) : selectedChartType === "vertical-bar" ? (
              <BarChart data={currentData} key={`vertical-bar-${animationKey}`}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="eventName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11, fill: "#4a5568" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#4a5568" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                  iconType="circle"
                  payload = {genderLegendPayload}
                />
                
                <Bar
                  dataKey="femaleCount"
                  fill="url(#femaleGradient)"
                  name="Female"
                  radius={[4, 4, 0, 0]}
                  animationBegin={200}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="maleCount"
                  fill="url(#maleGradient)"
                  name="Male"
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="unknownCount"
                  fill="url(#unknownGradient)"
                  name="Unknown"
                  radius={[4, 4, 0, 0]}
                  animationBegin={400}
                  animationDuration={1200}
                />
              </BarChart>
            ) : selectedChartType === "line-chart" ? (
              <LineChart data={currentData} key={`line-chart-${animationKey}`}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="eventName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11, fill: "#4a5568" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#4a5568" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="femaleCount"
                  stroke="#fd3db5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="maleCount"
                  stroke="#4b4bff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="unknownCount"
                  stroke="#9e9e9e"
                  strokeWidth={2}
                />
              </LineChart>
            ) : selectedChartType === "horizontal-bar" ? (
              <BarChart
                layout="vertical"
                data={currentData}
                key={`horizontal-bar-${animationKey}`}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#4a5568" }} />
                <YAxis
                  type="category"
                  dataKey="eventName"
                  tick={{ fontSize: 11, fill: "#4a5568" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                />
                <Bar
                  dataKey="femaleCount"
                  fill="url(#femaleGradient)"
                  name="Female"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="maleCount"
                  fill="url(#maleGradient)"
                  name="Male"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="unknownCount"
                  fill="url(#unknownGradient)"
                  name="Unknown"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : selectedChartType === "area-chart" ? (
              <AreaChart data={currentData} key={`area-chart-${animationKey}`}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="eventName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11, fill: "#4a5568" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#4a5568" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="femaleCount"
                  stroke="#fd3db5"
                  fill="url(#femaleGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="maleCount"
                  stroke="#4b4bff"
                  fill="url(#maleGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="unknownCount"
                  stroke="#9e9e9e"
                  fill="url(#unknownGradient)"
                />
              </AreaChart>
            ) : null}
          </ResponsiveContainer>

          <Pagination />
        </div>
      )}

      {!loading && genderData.length === 0 && completedEvents.length > 0 && (
        <div
          style={{
            padding: "60px 30px",
            textAlign: "center",
            color: "#718096",
            animation: "fadeInScale 0.5s ease-out",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              opacity: 0.5,
            }}
          >
            📊
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            No gender analytics data available
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#a0aec0",
              marginTop: "8px",
            }}
          >
            Data will appear once analytics are processed
          </div>
        </div>
      )}
    </div>
  );
}
export default DashboardEvents;
