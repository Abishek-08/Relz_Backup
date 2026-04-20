import React from "react";
import CONVEYOR_LiveStreamCard from "./CONVEYOR_LiveStreamCard";
import COUNTING_Bar_Chart from "../../Product_Counting/Dashboard/COUNTING_Bar_Chart";

const CONVEYOR_Admin_Dashbord = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="M9 18H4v-8h5zm6 0h-5V6h5zm6 0h-5V2h5zm1 4H3v-2h19z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                61259
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Overall Tracked Product
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
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="M12 5V1L7 6l5 5V7a6 6 0 0 1 6 6a6 6 0 0 1-6 6a6 6 0 0 1-6-6H4a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                471
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Re-Tracked Product
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
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="m13 12.6l6-3.4V13c.7 0 1.4.1 2 .4V7.5c0-.4-.2-.7-.5-.9l-7.9-4.4c-.2-.1-.4-.2-.6-.2s-.4.1-.6.2L3.5 6.6c-.3.2-.5.5-.5.9v9c0 .4.2.7.5.9l7.9 4.4c.2.1.4.2.6.2s.4-.1.6-.2l.9-.5c-.3-.6-.4-1.3-.5-2M12 4.2l6 3.3l-2 1.1l-5.9-3.4zm-1 15.1l-6-3.4V9.2l6 3.4zm1-8.5L6 7.5l2-1.2l6 3.5zm4.9 4.7l2.1 2.1l2.1-2.1l1.4 1.4l-2.1 2.1l2.1 2.1l-1.4 1.4l-2.1-2.1l-2.1 2.1l-1.4-1.4l2.1-2.1l-2.1-2.1z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                219
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Damaged Product
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
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="M12 2c-.2 0-.4.1-.6.2L3.5 6.6c-.3.2-.5.5-.5.9v9c0 .4.2.7.5.9l7.9 4.4c.2.1.4.2.6.2s.4-.1.6-.2l.9-.5c-.3-.6-.4-1.3-.5-2v-6.7l6-3.4V13c.7 0 1.4.1 2 .3V7.5c0-.4-.2-.7-.5-.9l-7.9-4.4c-.2-.1-.4-.2-.6-.2m0 2.2l6 3.3l-2 1.1l-5.9-3.4zM8.1 6.3L14 9.8l-2 1.1l-6-3.4zM5 9.2l6 3.4v6.7l-6-3.4zm16.3 6.6l-3.6 3.6l-1.6-1.6L15 19l2.8 3l4.8-4.8z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                2698
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Good Product
              </h3>
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
        <div className="bg-white shadow-lg  rounded-lg p-4 shadow-gray-200">
          <div className="felx-shrink-0">
            <h3 className="text-xl mb-4 font-bold text-gray-900">
              Acquistion Overview
            </h3>
          </div>
          <div>
            <COUNTING_Bar_Chart />
          </div>
        </div>
        <div>
          <CONVEYOR_LiveStreamCard />
        </div>
      </div>
      <div className="grid grid-cols-1 bg-white shadow-lg  rounded-lg p-4 shadow-gray-200 h-auto">
        <div className="bg-white shadow-lg rounded-lg p-4 shadow-gray-200">
          <div className="flex justify-between items-center mb-4 p-3">
            <div className="flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                Product Details
              </h3>
              <span className="text-base font-normal text-gray-500">
                This is the list of Products
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
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product Condition
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Pepsi
                  </th>
                  <td className="px-6 py-4">Juice-Bottle</td>
                  <td className="px-6 py-4">Good</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Coca-cola
                  </th>
                  <td className="px-6 py-4">Juice-Bottle</td>
                  <td className="px-6 py-4">Good</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Bislery
                  </th>
                  <td className="px-6 py-4">Water-Bottle</td>
                  <td className="px-6 py-4">Bad</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Bovonto
                  </th>
                  <td className="px-6 py-4">Water-Bootle</td>
                  <td className="px-6 py-4">Good</td>
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
      </div>
    </div>
  );
};

export default CONVEYOR_Admin_Dashbord;
