import { useEffect } from "react";
import COUNTING_LiveStreamCard from "./COUNTING_LiveStreamCard";
import COUNTING_Bar_Chart from "./COUNTING_Bar_Chart";

const COUNTING_Admin_Dashbord = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
        <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-linear-to-br from-sky-500 to-indigo-500 rounded-lg shadow-md shadow-gray-300">
              <svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                width="24px"
                height="32px"
              >
                <path
                  fill="#000000"
                  d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32v11c0 42.4 16.9 83.1 46.9 113.1l67.8 67.9l-67.8 67.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32h320c17.7 0 32-14.3 32-32s-14.3-32-32-32v-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zm256 437v11H96v-11c0-25.5 10.1-49.9 28.1-67.9l67.9-67.8l67.9 67.9c18 18 28.1 42.4 28.1 67.9z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                500850
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Overall Product-count
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
                viewBox="0 0 512 512"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="M416 64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4v-12a64 64 0 0 0-64-64m60 112H36a4 4 0 0 0-4 4v236a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V180a4 4 0 0 0-4-4M239.58 401.1c-12.17 9.61-28.75 14.9-46.7 14.9c-27.87 0-48.48-18.16-57.66-33.7a16 16 0 0 1 27.56-16.3c1.08 1.84 11.15 18 30.1 18c16.66 0 36.12-7.29 36.12-27.82c0-6.25-1.22-14.95-7-20.88c-8.54-8.74-22.75-12.67-30.11-12.67a16 16 0 0 1 0-32c4.85 0 17.41-2.6 25.28-10.65a22 22 0 0 0 6.57-16.08c0-23.23-28.63-23.9-31.89-23.9c-17.34 0-23.8 10.61-24.07 11.06a16 16 0 1 1-27.55-16.26c7.64-13 25.22-26.8 51.62-26.8c16.44 0 31.76 4.77 43.13 13.42c13.39 10.2 20.76 25.28 20.76 42.48A54 54 0 0 1 240 302.35c-1.15 1.18-2.36 2.28-3.59 3.35a66.18 66.18 0 0 1 8.42 7.23c10.56 10.8 16.14 25.75 16.14 43.25c.03 18.06-7.58 34.01-21.39 44.92M368 396a16 16 0 0 1-32 0V256.29l-22.51 16.59a16 16 0 1 1-19-25.76l43.42-32a16 16 0 0 1 9.49-3.12h4.6a16 16 0 0 1 16 16Z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                10987
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Product-count in month
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
                viewBox="0 0 256 256"
                width="24px"
                height="24px"
              >
                <path
                  fill="#000000"
                  d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-96 152a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120Zm56-8a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45L152 176ZM48 80V48h24v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32Z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                2148
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Product-count in week
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
                  d="M12.005 13.003a3 3 0 0 1 2.08 5.162l-1.91 1.837h2.83v2h-6l-.001-1.724l3.694-3.555a1 1 0 1 0-1.693-.72h-2a3 3 0 0 1 3-3m6 0v4h2v-4h2v9h-2v-3h-4v-6zm-14-1a7.985 7.985 0 0 0 3 6.246v2.416a9.996 9.996 0 0 1-5-8.662zm8-10c5.185 0 9.449 3.946 9.95 9h-2.012A8.001 8.001 0 0 0 5.87 6.868l2.135 2.135h-6v-6L4.45 5.449a9.977 9.977 0 0 1 7.554-3.446"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                794
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Product-count in a day
              </h3>
            </div>
            <div className="flex flex-1 justify-end items-center ml-5 text-base font-bold text-green-500">
              +6.02%
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
        <div className="grid grid-cols-1 bg-white shadow-lg  rounded-lg p-4 shadow-gray-200 h-auto">
          <COUNTING_LiveStreamCard />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4 shadow-gray-200">
        <div className="flex justify-between items-center mb-4 p-3">
          <div className="flex-shrink-0">
            <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
            <span className="text-base font-normal text-gray-500">
              This is the list of products
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
              view all products
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
  );
};

export default COUNTING_Admin_Dashbord;
