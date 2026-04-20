import React from "react";
import Acquistion_Bie_Chart from "./Acquistion_Bie_Chart";
import Weekly_Bar_Chart from "./Weekly_Bar_Chart";

const Admin_Dashbord = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                  clip-rule="evenodd"
                />
                <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              </svg>
            </div>
            <div className="flex-shrink-0 ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                $1,200
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Today's Earnings
              </h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-5 text-base font-bold text-green-500">
              +16%
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                className="w-[24px] h-[24px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-shrink-0 ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                2,230
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Today's Users
              </h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-5 text-base font-bold text-green-500">
              +6%
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-shrink-0 ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                $1,200
              </span>
              <h3 className="text-base font-normal text-gray-500">
                New Clients
              </h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-5 text-base font-bold text-red-500">
              -4%
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="current"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19V5m0 14-4-4m4 4 4-4"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-shrink-0 ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                $2,230
              </span>
              <h3 className="text-base font-normal text-gray-500">Sales</h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-5 text-base font-bold text-green-500">
              +56.02%
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full mb-6 xl:grid-cols-2">
        <div className="bg-white shadow-lg shadow-gray-200 relative bg-linear-to-r from-slate-700 to-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white leading-none">
                $53,473
              </span>
              <h3 className="text-base font-normal text-gray-400">
                Sales this week
              </h3>
              <h3></h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-4 text-base font-bold text-green-400">
              10.02%
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <div className="h-[435px] rounded-md">
            <Weekly_Bar_Chart />
          </div>
        </div>

        <div className="bg-white shadow-lg shadow-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4 p-3">
            <div className="flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                Sales by Industries
              </h3>
              <span className="text-base font-normal text-gray-500">
                This is the list of Industries
              </span>
            </div>
            <div className="flex-shrink-0">
              <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">
                <a className="text-base font-normal text-gray-800">View all</a>
              </span>
            </div>
          </div>
          <div className="h-[360px] relative overflow-y-auto mb-4 rounded-2xl">
            <table className="w-full divide-y divide-gray-300 text-sm h-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Industry name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Industry Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Desciption
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Ramco
                  </th>
                  <td className="px-6 py-4">Construction</td>
                  <td className="px-6 py-4">PPE</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Ramco
                  </th>
                  <td className="px-6 py-4">Construction</td>
                  <td className="px-6 py-4">PPE</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Ramco
                  </th>
                  <td className="px-6 py-4">Construction</td>
                  <td className="px-6 py-4">PPE</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Ramco
                  </th>
                  <td className="px-6 py-4">Construction</td>
                  <td className="px-6 py-4">PPE</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4">
            <div className="flex-shrink-0">
              <a className="text-sm cursor-pointer inline-flex font-semibold text-gray-400 hover:text-gray-700">
                Last 7 days
                <svg
                  className="w-2.5 m-2.5 ms-1.5"
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
              </a>
            </div>
            <div className="shrink-0">
              <span className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 cursor-pointer dark:border-gray-700 px-3 py-2 hover:bg-gray-300">
                sales report
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m10 16 4-4-4-4"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 w-full mb-6 xl:grid-cols-2">
        <div className="bg-white shadow-lg rounded-lg p-4 shadow-gray-200">
          <div className="flex justify-between items-center mb-4 p-3">
            <div className="flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                Latest Customer
              </h3>
              <span className="text-base font-normal text-gray-500">
                This is the list of latest Customer
              </span>
            </div>
            <div className="flex-shrink-0">
              <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">
                <a className="text-base font-normal text-gray-800">View all</a>
              </span>
            </div>
          </div>
          <div className="h-[360px] relative overflow-y-auto mb-4 rounded-2xl">
            <table className="w-full divide-y divide-gray-300 text-sm h-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Industry
                  </th>
                  <th scope="col" className="px-6 py-3">
                    status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Rajkumar
                  </th>
                  <td className="px-6 py-4">7891456213</td>
                  <td className="px-6 py-4">Ramco</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Rajkumar
                  </th>
                  <td className="px-6 py-4">7891456213</td>
                  <td className="px-6 py-4">Ramco</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Rajkumar
                  </th>
                  <td className="px-6 py-4">7891456213</td>
                  <td className="px-6 py-4">Ramco</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Rajkumar
                  </th>
                  <td className="px-6 py-4">7891456213</td>
                  <td className="px-6 py-4">Ramco</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4">
            <div className="flex-shrink-0">
              <a className="text-sm cursor-pointer inline-flex font-semibold text-gray-400 hover:text-gray-700">
                Last 7 days
                <svg
                  className="w-2.5 m-2.5 ms-1.5"
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
              </a>
            </div>
            <div className="shrink-0">
              <span className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 cursor-pointer hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700  dark:border-gray-700 px-3 py-2 hover:bg-gray-300">
                view all users
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m10 16 4-4-4-4"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg  rounded-lg p-4 shadow-gray-200">
          <div className="felx-shrink-0">
            <h3 className="text-xl mb-4 font-bold text-gray-900">
              Acquistion Overview
            </h3>
          </div>
          <div>
            <Acquistion_Bie_Chart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashbord;
