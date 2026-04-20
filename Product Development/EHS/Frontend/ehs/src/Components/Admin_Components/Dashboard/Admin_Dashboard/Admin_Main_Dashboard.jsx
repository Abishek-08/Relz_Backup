import React from "react";
import Admin_Dashbord from "./Admin_Dashbord";
import { useDispatch, useSelector } from "react-redux";
import { changeView } from "../../../../Redux/AdminDashboard_Slice/AdminDashboardSlice";
import Industry_Creation from "../Admin_Industry/Industry_Creation";
import SolutionsPage from "../Admin_Solutions/SolutionsPage";
import UserPage from "../Admin_User/UserPage";
import Individual_Plan from "../Admin_Plan/Individual_Plan";
import Bundle_Plan from "../Admin_Plan/Bundle_Plan";
import { Link, useNavigate } from "react-router-dom";

const Admin_Main_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfile = useSelector((state) => state.login.userProfile);
  const userName = useSelector((state) => state.login.userName);
  const userEmail = useSelector((state) => state.login.userEmail);
  const currentView = useSelector((state) => state.adminDashSlice.currentView);

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
                <Link to="/" className="flex ms-2 md:me-24">
                  <img
                    src="/src/assets/visionz_logo.png"
                    className="h-8 me-3"
                    alt="ehs logo"
                  />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    EHS
                  </span>
                </Link>
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
                        src={`data:image/jpeg;base64,${userProfile}`}
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
                        {userName}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {userEmail}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
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
          <div className="h-full px-3 pb-4 overflow-y-auto  dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
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
              <li>
                <a
                  onClick={() => dispatch(changeView("Industry"))}
                  className="flex items-center p-2 cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="bg-white-200 rounded-md shadow-lg shadow-gray-300 p-2.5">
                    <svg
                      className="shrink-0 w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Industry
                  </span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    Pro
                  </span>
                </a>
              </li>
              {/* <li>
                <a className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <div className="bg-white-200 shadow-lg rounded-md shadow-gray-300 p-2.5">
                    <svg
                      className="shrink-0 w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                    </svg>
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    3
                  </span>
                </a>
              </li> */}
              <li>
                <a
                  onClick={() => dispatch(changeView("User"))}
                  className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <div className="bg-white-200 shadow-lg rounded-md shadow-gray-300 p-2.5">
                    <svg
                      className="shrink-0 w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                    </svg>
                  </div>

                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-all duration-200"
                  aria-controls="dropdown-plan"
                  data-collapse-toggle="dropdown-plan"
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
                        d="M20.337 3.664c.213.212.354.486.404.782.294 1.711.657 5.195-.906 6.76-1.77 1.768-8.485 5.517-10.611 6.683a.987.987 0 0 1-1.176-.173l-.882-.88-.877-.884a.988.988 0 0 1-.173-1.177c1.165-2.126 4.913-8.841 6.682-10.611 1.562-1.563 5.046-1.198 6.757-.904.296.05.57.191.782.404ZM5.407 7.576l4-.341-2.69 4.48-2.857-.334a.996.996 0 0 1-.565-1.694l2.112-2.111Zm11.357 7.02-.34 4-2.111 2.113a.996.996 0 0 1-1.69-.565l-.422-2.807 4.563-2.74Zm.84-6.21a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <span
                    sidebar-toggle-item=""
                    className="flex-1 ms-3 whitespace-nowrap"
                  >
                    Plan
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
                  id="dropdown-plan"
                  className="pb-2 pt-1"
                  sidebar-toggle-list=""
                >
                  <li>
                    <a
                      onClick={() => dispatch(changeView("IndividualPlan"))}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Individual plan
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => dispatch(changeView("BundlePlan"))}
                      className="flex items-center cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <span className="flex-1 font-normal ms-3 whitespace-nowrap">
                        Bundle plan
                      </span>
                    </a>
                  </li>
                </ul>
              </li>
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
            {currentView === "Dashboard" && <Admin_Dashbord />}
            {currentView === "Industry" && <Industry_Creation />}
            {currentView === "Solution" && <SolutionsPage />}
            {currentView === "User" && <UserPage />}
            {currentView === "IndividualPlan" && <Individual_Plan />}
            {currentView === "BundlePlan" && <Bundle_Plan />}
          </div>
        </div>
      </>
    </div>
  );
};

export default Admin_Main_Dashboard;
