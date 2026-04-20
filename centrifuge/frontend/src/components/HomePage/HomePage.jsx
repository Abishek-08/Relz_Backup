import React, { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { getAllEventCategories } from "../../services/Services";

import { ArrowRight } from "lucide-react";

import logo from "/assets/logo.jpg";
import { encryptSession, decryptSession } from "../../utils/SessionCrypto";

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const eventCategoryImageURL = `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/images`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllEventCategories();
        const allCategories = response.data || [];

        const updateCategories = () => {
          const width = window.innerWidth;
          const isTabletPortrait = width >= 768 && width < 1024;

          const categoriesToShow = isTabletPortrait
            ? allCategories.slice(-4).reverse()
            : allCategories.slice(-3).reverse();

          setCategories(categoriesToShow);
        };

        updateCategories();
        window.addEventListener("resize", updateCategories);
        return () => window.removeEventListener("resize", updateCategories);
      } catch (err) {
        console.error("Error fetching event categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleViewEvents = (eventId) => {
    localStorage.setItem(
      "eventCategoryId",
      encryptSession(String(eventId)).toString(),
    );
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 overflow-x-hidden overflow-y-auto">
      <Navbar />

      {/* Main Content Container */}

      <div
        className="flex flex-col mt-12"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* Header Section - Fixed Height */}

        <div className="flex-shrink-0 text-center py-4 md:py-6 px-4">
          <div className="space-y-3 md:space-y-4">
            {/* Logo and Title */}

            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Circular Logo */}

                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow-xl overflow-hidden">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Heading */}

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                  <span>LivEAA</span>

                  <span className="ml-2 animate-pulse text-[#97247E]">
                    Z360
                  </span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}

            <div className="-mt-2 text-base md:text-lg lg:text-xl font-semibold">
              <span className="text-black bg-clip-text bg-gradient-to-r from-black-600 via-black-500 to-black-400 animate-pulse">
                Live Event Analytics Application
              </span>
            </div>

            {/* Divider Line */}

            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mx-auto -mt-2" />

            {/* Description in Colorful Div */}

            <div className="max-w-4xl -mt-2 mx-auto">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-gray-300 rounded-2xl px-4 py-3 md:px-6 md:py-4">
                <p className="text-gray-800 text-sm md:text-base lg:text-lg font-medium text-center leading-relaxed">
                  Discover events, participate actively and celebrate your
                  progress to create meaningful experiences.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section - Flexible Height */}

        <div className="flex-1 px-4 pb-4">
          {/* Categories Grid */}

          <div className="flex-1 overflow-y-auto md:overflow-visible -mt-2">
            <div className="max-w-7xl mx-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full md:h-auto">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-white shadow-md border border-gray-200 rounded-3xl p-4 md:p-6 flex flex-col justify-between transition duration-300 hover:shadow-xl min-h-[280px] md:min-h-[320px]"
                  >
                    {/* Logo */}

                    {cat.eventCategoryLogo && (
                      <div className="w-full h-32 md:h-40 mb-3 md:mb-4 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                        <img
                          src={`${eventCategoryImageURL}/${cat.eventCategoryLogo}`}
                          alt={cat.eventCategoryName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}

                    <div className="flex-1 flex flex-col justify-between">
                      {/* Name */}

                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {cat.eventCategoryName}
                      </h3>

                      {/* Description */}

                      <p className="text-gray-600 text-xs md:text-sm line-clamp-3 mb-3">
                        {cat.eventCategoryDescription}
                      </p>

                      {/* View Details Button */}

                      <button
                        onClick={() => handleViewEvents(cat.eventCategoryId)}
                        style={{ backgroundColor: "#274c77" }}
                        className="w-full hover:cursor-pointer text-white font-bold py-2 px-4 rounded-xl border border-gray-300 hover:border-gray-500 transition text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View More Button - Fixed at Bottom */}

          <div className="flex-shrink-0 pt-4 md:pt-6 flex justify-center">
            <button
              onClick={() => navigate("/viewAllEvents")}
              style={{ backgroundColor: "#274c77" }}
              className="flex items-center gap-2 rounded-full font-bold text-sm hover:cursor-pointer text-white hover:bg-gray-900 py-3 px-6 transition-all duration-200 hover:gap-3"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
