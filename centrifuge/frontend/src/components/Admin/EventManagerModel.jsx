

import { useState, useEffect, useRef } from "react"; 

import { X } from "lucide-react"; 

import { toast } from "sonner";

import { 

  checkEventManagerByEmail,
  createEventManager, 

  searchEmployeesByEmail, 

  updateEventManager, 

} from "../../services/Services"; 
import { useToast } from "../../utils/useToast";


const EventManagerModal = ({ onClose, onSuccess }) => {
  const [userInfo, setUserInfo] = useState({ email: "", fullName: "" });
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const mouseDownRef = useRef(false);
  const highlightedRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const handleEmailInputChange = (value) => {
    setUserInfo({ email: value, fullName: "" });
    setShowEmailDropdown(value.length > 0);

    const orgRegex = /^[a-zA-Z0-9._%+-]+@relevantz\.com$/i;
    const isCompleteEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!value.trim()) {
      setEmailError("");
      return;
    }

    if (isCompleteEmail && !orgRegex.test(value)) {
      setEmailError("Please enter a valid organization email");
    } else {
      setEmailError("");
    }

    const filtered = emailSuggestions.filter((emp) =>
      emp.email.toLowerCase().includes(value.toLowerCase())
    );
    setEmailSuggestions(filtered);
    setHighlightedIndex(-1);
  };

  
  const handleEmailSuggestionKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < emailSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && emailSuggestions[highlightedIndex]) {
        e.preventDefault();
        const selected = emailSuggestions[highlightedIndex];
        setUserInfo({ email: selected.email, fullName: selected.fullName });
        setShowEmailDropdown(false);
        setHighlightedIndex(-1);
      }
    }
  };

 
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userInfo.email.trim()) {
        setEmailSuggestions([]);
        return;
      }
      try {
        const response = await searchEmployeesByEmail(userInfo.email);
        const data = response.data;
        const validEmails = data
          .filter((emp) => emp.email)
          .map((emp) => ({ fullName: emp.fullName, email: emp.email }));
        setEmailSuggestions(validEmails);
      } catch (err) {
        console.error("Error fetching email suggestions:", err);
        setEmailSuggestions([]);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [userInfo.email]);

 
  const handleSubmit = async () => {
    if (!userInfo.email || !userInfo.fullName) {
      error("Please enter valid organization email");
      return;
    }
    setLoading(true);
    try {
      const existsRes = await checkEventManagerByEmail(userInfo.email);
      if (existsRes.data.exists) {
        error("This email already exists!");
        setLoading(false);
        return;
      }

      await createEventManager({
        email: userInfo.email,
        fullName: userInfo.fullName,
      });
      success("Event Manager created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      error("Failed to create Event Manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Add Event Manager</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Email Search */}
        <div className="relative mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Organization Email
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => handleEmailInputChange(e.target.value)}
            onKeyDown={handleEmailSuggestionKeyDown}
            onFocus={() => setShowEmailDropdown(true)}
            placeholder="Enter your organization email"
            className={`w-full px-4 py-3 border rounded-lg ${
              emailError ? "border-red-400" : "border-gray-300"
            }`}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

          {/* Dropdown */}
          {showEmailDropdown && emailSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border mt-1 max-h-40 overflow-y-auto z-20">
              {emailSuggestions.map((emp, index) => (
                <div
                  key={index}
                  ref={highlightedIndex === index ? highlightedRef : null}
                  className={`px-4 py-2 cursor-pointer ${
                    highlightedIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onMouseDown={() => {
                    mouseDownRef.current = true;
                    setUserInfo({ email: emp.email, fullName: emp.fullName });
                    setShowEmailDropdown(false);
                  }}
                >
                  <div className="text-sm font-medium">{emp.fullName}</div>
                  <div className="text-xs text-gray-500">{emp.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Card */}
        {userInfo.email && userInfo.fullName && (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
            <div>
              <p className="text-sm font-medium">{userInfo.fullName}</p>
              <p className="text-xs text-gray-600">{userInfo.email}</p>
            </div>
            <button
              onClick={() => setUserInfo({ email: "", fullName: "" })}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#274c77] text-white rounded-lg cursor-pointer"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventManagerModal;

