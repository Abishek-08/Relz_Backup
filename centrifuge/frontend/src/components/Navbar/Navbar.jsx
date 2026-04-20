import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Plus, LogOut } from "lucide-react";
import RelevantZLogo from "/assets/RelevantZLogo.svg";
import { useToast } from "../../utils/useToast.js";
import { Toaster } from "sonner";
import ApplicationLogo from "/assets/logo.jpg";
// import socket from "../../../socket.js";
import { decryptSession } from "../../utils/SessionCrypto.jsx";
// import { disconnectCentrifuge } from "../../centrifuge/services/centrifugeClient.js";

const Navbar = ({
  navigationItems = [],
  isMobile,
  eventTitle = [],
  events,
  onAddEvent,
  onSelectEvent,
  selectedSubEventId,
  onSearch,
}) => {
  const { success, info } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const rawUserType = decryptSession(localStorage.getItem("userType"));
  const userType = rawUserType ? rawUserType.toLowerCase() : "";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
    success("Logged out Successfully!");
    // disconnectCentrifuge();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = () => {
    if (location.pathname === "/viewAllEvents") {
      info("You're already on the Event Categories page");
    } else {
      navigate("/viewAllEvents");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md border-b border-white/10 shadow-sm" : ""
      }`}
      style={{ backgroundColor: "#274c77" }}
    >
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo */}
        <div
          onClick={() => navigate("/homepage")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            onClick={() => navigate("/homepage")}
            className="flex items-center gap-3 cursor-pointer flex-row-reverse"
          >
            <div className="relative flex items-center gap-3 group">
              <img
                src={ApplicationLogo}
                alt="Previous Logo"
                className="h-10 w-10 rounded-full object-cover cursor-pointer transition-all duration-200 group-hover:scale-105"
              />
              <img
                src={RelevantZLogo}
                alt="RelevantZ Logo"
                className="w-35 cursor-pointer transition-all duration-200 group-hover:scale-101"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* Categories only if NOT admin */}
          {userType !== "admin" && (
            <button
              onClick={handleNavigation}
              className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-white hover:ring-offset-1 transition cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              Event Categories
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-white hover:ring-offset-1 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md px-4 py-6 border-t border-white/10">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-purple-500 hover:ring-offset-1 transition"
              >
                {item.name}
              </a>
            ))}

            {userType !== "admin" && (
              <button
                onClick={() => navigate("/viewAllEvents")}
                className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-purple-500 hover:ring-offset-1 transition cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Event Categories
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sub Events & Add Event — only if NOT admin */}
      {isMenuOpen && isMobile && userType !== "admin" && (
        <div className="space-y-3 -mt-7 md:hidden bg-slate-900/95 backdrop-blur-md px-4 py-6">
          <h2 className="text-white font-semibold text-lg">
            {eventTitle}{" "}
            <span className="text-sm text-white/50"> - Events</span>
          </h2>

          {/* Sub Events List */}
          <div className="flex flex-col gap-2 mt-3">
            {events.map((sub) => (
              <div
                key={sub.id}
                onClick={() => {
                  onSelectEvent(sub.eventId);
                  setIsMenuOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm transition-all duration-150 ${
                  selectedSubEventId === sub.id
                    ? "bg-emerald-600 text-white font-semibold"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {sub.eventName}
              </div>
            ))}
          </div>

          {/* Add Sub Event Button */}
          <button
            onClick={() => {
              onAddEvent();
              setIsMenuOpen(false);
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 text-white text-sm px-4 py-2 rounded-md border border-dashed border-white/30 hover:border-white/50 hover:bg-white/10 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Event
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
