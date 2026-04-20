import React from "react";
import { useDispatch } from "react-redux";
import { changeView } from "../../../../Redux/AdminDashboard_Slice/AdminDashboardSlice";
import { useNavigate } from "react-router-dom";
import COUNTING_Admin_Dashbord from "./COUNTING_Admin_Dashbord";

const COUNTING_Admin_Main_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                  </svg>
                </button>
                <a href="#" className="flex ms-2 md:me-24">
                  <img
                    src="/src/assets/visionz_logo.png"
                    className="h-8 me-3"
                    alt="ehs logo"
                  />
                  <span
                    onClick={() => navigate("/")}
                    className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
                  >
                    EHS
                  </span>
                </a>
              </div>

              <div className="flex items-center">
                <div className="flex items-center ms-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                      />
                    </button>
                  </div>
                  <div
                    className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      >
                        Neil Sims
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        neil.sims@flowbite.com
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-64  h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 mt-4 overflow-y-auto  dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li className="bg-linear-to-br from-sky-500 to-indigo-500 p-4 mb-8 rounded-lg inline-flex text-2xl font-bold text-gray-700">
                <a className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white ">
                  <div className="p-2 bg-stone-500 rounded-lg shadow-lg">
                    <svg
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="25px"
                      height="25px"
                    >
                      <path
                        fill="#f6f5f4"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-3.1 3.9s-.7-.3-1-.3c-.6-.1-1 .1-1.2 1.1L12 16.8c-.2.8-.5 1.4-1 1.8c-.4.3-.8.4-1.3.4c-.8 0-2-.5-2-.5l.5-1.4s.8.3 1 .3c.3.1.5 0 .7-.1c.2-.1.3-.4.4-.7l1.6-9.2c.1-.8.5-1.4 1-1.9c.6-.4 1.3-.5 2.1-.4c.7.1 1.5.5 1.5.5z"
                      />
                    </svg>
                  </div>
                  <span className="ms-2 text-gray-900">Product Counting</span>
                </a>
              </li>
              <li>
                <a
                  onClick={() => dispatch(changeView("Dashboard"))}
                  className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="bg-white-200 rounded-md shadow-lg shadow-gray-300 p-2.5">
                    <svg
                      className="shrink-0 w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                  </div>
                  <span className="ms-3">Dashboard</span>
                </a>
              </li>

              {/*  */}
              <li>
                <a
                  className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-all duration-200"
                  aria-controls="dropdown-auth"
                  data-collapse-toggle="dropdown-auth"
                  sidebar-toggle-collapse=""
                  aria-expanded="true"
                >
                  <div className="bg-white-200 rounded-md shadow-lg shadow-gray-300 p-2.5">
                    <svg
                      className="shrink-0 w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                      sidebar-toggle-item=""
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <span
                    sidebar-toggle-item=""
                    className="flex-1 ms-3 whitespace-nowrap"
                  >
                    Authentication
                  </span>
                  <svg
                    sidebar-toggle-item=""
                    className="w-4 h-4 ml-auto text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <ul
                  id="dropdown-auth"
                  className="pb-2 pt-1"
                  sidebar-toggle-list=""
                >
                  {/* <li>
                    <a
                      onClick={() => navigate("/signin")}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Sign In
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigate("/signup")}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Sign Up
                      </span>
                    </a>
                  </li>*/}
                  <li>
                    <a
                      onClick={() => navigate("/forget-password")}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Forget password
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigate("/reset-password")}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Reset password
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigate("/profile-lock")}
                      className="flex items-center  cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 ms-3 font-normal whitespace-nowrap">
                        Profile lock
                      </span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
            <COUNTING_Admin_Dashbord />
          </div>
        </div>
      </>
    </div>
  );
};

export default COUNTING_Admin_Main_Dashboard;
