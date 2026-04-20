import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleLogout } from "../../Redux/User_Slice/UserSlice";

const Top_Navbar = () => {
  const loggedIn = useSelector((state) => state.login.isLoggedIn);
  const userProfile = useSelector((state) => state.login.userProfile);
  const userName = useSelector((state) => state.login.userName);
  const userEmail = useSelector((state) => state.login.userEmail);

  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isResourceDropdownOpen, setIsResourceDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const dropdownRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPlatformDropdownOpen(false);
        setIsSolutionsDropdownOpen(false);
        setIsResourceDropdownOpen(false);
        setIsCompanyDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/src/assets/visionz_logo.png"
              className="h-8"
              alt="EHS Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              EHS
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-4">
            {loggedIn ? (
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
                className="flex text-sm cursor-pointer bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={`data:image/jpeg;base64,${userProfile}`}
                  alt="user"
                />
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Dropdown user-menu */}
          {isUserDropdownOpen && (
            <div
              className="absolute shrink-0 z-50 right-2 mt-60 border-t border-gray-200 shadow-md text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {userName}
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  {userEmail}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    to="/admindash"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                    Settings
                  </Link>
                </li>

                <li>
                  <Link
                    onClick={() => {
                      dispatch(handleLogout());
                      setIsUserDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button
                  type="button"
                  onClick={() => setIsPlatformDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Platform
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsSolutionsDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Solutions
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsResourceDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Resources
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Company
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Customers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {/** Platform-Mega-Menu-Dropdown */}
        {isPlatformDropdownOpen && (
          <div
            id="platform-modal-dropdown"
            className="absolute z-20 left-0 rounded-2xl w-full mt-0 border-t border-gray-200 shadow-md bg-gray-50 md:bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Online Stores</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Connect with third-party tools that you're already using.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Segmentation</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Understand your audience and personalize communication.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Marketing CRM</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Manage customer relationships and marketing.
                    </span>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Analytics</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor performance and gain insights.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Integrations</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Seamlessly connect your favorite apps.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Support</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      24/7 support for your business.
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/** Solution-Mega-Menu-Dropdown */}
        {isSolutionsDropdownOpen && (
          <div
            id="solutions-modal-dropdown"
            className="absolute z-20 left-0 rounded-2xl w-full mt-0 border-t border-gray-200 shadow-md bg-gray-50 md:bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Online Stores</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Connect with third-party tools that you're already using.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Segmentation</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Understand your audience and personalize communication.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Marketing CRM</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Manage customer relationships and marketing.
                    </span>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Analytics</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor performance and gain insights.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Integrations</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Seamlessly connect your favorite apps.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Support</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      24/7 support for your business.
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/** Resources-Mega-Menu-Dropdown */}
        {isResourceDropdownOpen && (
          <div
            id="resource-modal-dropdown"
            className="absolute z-20 left-0 rounded-2xl w-full mt-0 border-t border-gray-200 shadow-md bg-gray-50 md:bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Online Stores</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Connect with third-party tools that you're already using.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Segmentation</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Understand your audience and personalize communication.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Marketing CRM</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Manage customer relationships and marketing.
                    </span>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Analytics</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor performance and gain insights.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Integrations</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Seamlessly connect your favorite apps.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Support</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      24/7 support for your business.
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/** Company-Mega-Menu-Dropdown */}
        {isCompanyDropdownOpen && (
          <div
            id="solutions-modal-dropdown"
            className="absolute z-20 left-0 rounded-2xl w-full mt-0 border-t border-gray-200 shadow-md bg-gray-50 md:bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Online Stores</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Connect with third-party tools that you're already using.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Segmentation</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Understand your audience and personalize communication.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Marketing CRM</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Manage customer relationships and marketing.
                    </span>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Analytics</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor performance and gain insights.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Integrations</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Seamlessly connect your favorite apps.
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="font-semibold">Support</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      24/7 support for your business.
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Top_Navbar;
