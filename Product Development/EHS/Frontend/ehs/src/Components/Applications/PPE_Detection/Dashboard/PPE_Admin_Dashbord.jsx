import React, { useState, useEffect } from "react";

import PPE_Weekly_Bar_Chart from "./PPE_Weekly_Bar_Chart";
import PPE_Acquistion_Bie_Chart from "./PPE_Acquistion_Bie_Chart";
import LiveStreamCard from "./LiveStreamCard";
import { getDashboardKPIs } from "../../../../Services/PPE_Services/KPI_API";

const PPE_Admin_Dashbord = () => {
  const [kpiData, setKpiData] = useState({
    ppe_compliance_rate_this_month: 0,
    non_compliance_incidents_this_week: 0,
    compliance_streak: 0,
    compliance_score_by_zone: {},
  });

  useEffect(() => {
    const fetchKPI = async () => {
      const data = await getDashboardKPIs();
      setKpiData(data);
      console.log("dashboard data", data);
    };
    fetchKPI();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
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
                  d="M11.403 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.403a3.01 3.01 0 0 1-1.743-1.612l-3.025 3.025A3 3 0 1 1 9.99 9.768l3.025-3.025A3.01 3.01 0 0 1 11.403 5Z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M13.232 4a1 1 0 0 1 1-1H20a1 1 0 0 1 1 1v5.768a1 1 0 1 1-2 0V6.414l-6.182 6.182a1 1 0 0 1-1.414-1.414L17.586 5h-3.354a1 1 0 0 1-1-1Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {kpiData?.ppe_compliance_rate_this_month}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                PPE Compliance Rate this Month
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
                  d="m21.171 15.398l-5.912-9.854C14.483 4.251 13.296 3.511 12 3.511s-2.483.74-3.259 2.031l-5.912 9.856c-.786 1.309-.872 2.705-.235 3.83C3.23 20.354 4.472 21 6 21h12c1.528 0 2.77-.646 3.406-1.771c.637-1.125.551-2.521-.235-3.831M12 17.549c-.854 0-1.55-.695-1.55-1.549c0-.855.695-1.551 1.55-1.551s1.55.696 1.55 1.551c0 .854-.696 1.549-1.55 1.549m1.633-7.424c-.011.031-1.401 3.468-1.401 3.468c-.038.094-.13.156-.231.156s-.193-.062-.231-.156l-1.391-3.438a1.776 1.776 0 0 1-.129-.655c0-.965.785-1.75 1.75-1.75a1.752 1.752 0 0 1 1.633 2.375"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {kpiData?.non_compliance_incidents_this_week}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Non-compliance incident this week
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
                  fill="none"
                  stroke="#000000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.004 20.692c-.329.117-.664.22-1.004.308A12 12 0 0 1 3.5 6A12 12 0 0 0 12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-.081 7.034M17 17v5m4-5v5"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {kpiData?.compliance_streak}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Compliance streaks (days)
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
                  d="M6.5 8.11c-.89 0-1.61-.72-1.61-1.61A1.61 1.61 0 0 1 6.5 4.89c.89 0 1.61.72 1.61 1.61A1.61 1.61 0 0 1 6.5 8.11M6.5 2C4 2 2 4 2 6.5c0 3.37 4.5 8.36 4.5 8.36S11 9.87 11 6.5C11 4 9 2 6.5 2m11 6.11a1.61 1.61 0 0 1-1.61-1.61a1.609 1.609 0 1 1 3.22 0a1.61 1.61 0 0 1-1.61 1.61m0-6.11C15 2 13 4 13 6.5c0 3.37 4.5 8.36 4.5 8.36S22 9.87 22 6.5C22 4 20 2 17.5 2m0 14c-1.27 0-2.4.8-2.82 2H9.32a3 3 0 0 0-3.82-1.83A3.003 3.003 0 0 0 3.66 20a3.017 3.017 0 0 0 3.84 1.83c.85-.3 1.5-.98 1.82-1.83h5.37c.55 1.56 2.27 2.38 3.81 1.83A3 3 0 0 0 20.35 18c-.43-1.2-1.57-2-2.85-2m0 4.5A1.5 1.5 0 0 1 16 19a1.5 1.5 0 0 1 1.5-1.5A1.5 1.5 0 0 1 19 19a1.5 1.5 0 0 1-1.5 1.5"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {Object.entries(kpiData.compliance_score_by_zone).length > 0 ? (
                  Object.entries(kpiData.compliance_score_by_zone).map(
                    ([zone, score]) => (
                      <div key={zone}>
                        <strong>{zone}</strong>: {score}%
                      </div>
                    )
                  )
                ) : (
                  <span>N/A</span>
                )}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Compliance Score by zones
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
            <PPE_Weekly_Bar_Chart />
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
            <PPE_Acquistion_Bie_Chart />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 bg-white shadow-lg  rounded-lg p-4 shadow-gray-200 h-auto">
        <LiveStreamCard />
      </div>
    </div>
  );
};

export default PPE_Admin_Dashbord;
