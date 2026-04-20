import PARKING_Acquistion_Bie_Chart from "./PARKING_Acquistion_Bie_Chart";
import PARKING_Weekly_Bar_Chart from "./PARKING_Weekly_Bar_Chart";
import PARKING_LiveStreamCard from "./PARKING_LiveStreamCard";
import { useEffect, useState } from "react";
import { vehicleDash } from "../../../../Services/vehicle_Services/vehicle_Service";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus } from "../../../../Redux/Application/VehicleSlice";

const PARKING_Admin_Dashbord = () => {
  const dispatch = useDispatch();
  const vehicleData = useSelector((state) => state.vehicleSlice.parkingStatus);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await vehicleDash();
      dispatch(changeStatus(data));
    }, 3000); // Call the function every 1000 milliseconds (1 second)

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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
                  d="M13.5 3H5v18h4v-5h4.5c3.584 0 6.5-2.916 6.5-6.5S17.084 3 13.5 3m0 9H9V7h4.5C14.879 7 16 8.121 16 9.5S14.879 12 13.5 12"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {vehicleData?.totalParkingSlot}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Parking Capacity"
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
                  d="m20.772 10.155l-1.368-4.104A2.995 2.995 0 0 0 16.559 4H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2 2 0 0 0 2 12v5c0 .738.404 1.376 1 1.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h12v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.277A1.99 1.99 0 0 0 22 17v-5a2 2 0 0 0-1.228-1.845M7.441 6h9.117c.431 0 .813.274.949.684L18.613 10H5.387l1.105-3.316A1 1 0 0 1 7.441 6M5.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 16m13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 16"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {vehicleData?.occupiedSlot}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Vehicle Occupancy
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
                  d="M3 19.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.277A1.99 1.99 0 0 0 22 18v-3c0-.831-.507-1.542-1.228-1.845l-1.368-4.104A2.995 2.995 0 0 0 16.559 7H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2.001 2.001 0 0 0 2 15v3c0 .738.404 1.376 1 1.723M5.5 18a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 18m13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 18M7.441 9h9.117a1 1 0 0 1 .949.684L18.613 13H5.387l1.105-3.316c.137-.409.519-.684.949-.684"
                />
                <path
                  fill="#000000"
                  d="M22 7.388V5.279l-9.684-3.228a.996.996 0 0 0-.658.009L2 5.572V7.7l10.015-3.642z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                {vehicleData?.unOccupiedSlot}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Unused Vehicle Bay"
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
                  d="M2.634 17.918a1.765 1.765 0 0 0 1.201 1.291l.18.791H4v2h16v-2H6.683a.84.84 0 0 0-.007-.278l-.196-.863l10.357-2.356l.196.863a.886.886 0 0 0 1.06.667l.863-.197a.885.885 0 0 0 .667-1.06l-.251-1.103c.446-.416.67-1.046.525-1.683l-.59-2.59a1.76 1.76 0 0 0-1.262-1.307l-2.049-3.378a2.774 2.774 0 0 0-2.982-1.263l-7.868 1.79a2.769 2.769 0 0 0-2.144 2.43l-.387 3.932a1.76 1.76 0 0 0-.57 1.724zm3.02-.688a1.327 1.327 0 1 1-.59-2.589a1.327 1.327 0 0 1 .59 2.589m11.222-2.552a1.328 1.328 0 1 1-.59-2.587a1.328 1.328 0 0 1 .59 2.587M5.589 9.192l7.869-1.791a.773.773 0 0 1 .83.351l1.585 2.613l-.566.129l-10.046 2.287l-.568.129l.299-3.042a.772.772 0 0 1 .597-.676M18.405 4L17 2l-.5 3L19 9l3 1l-2-2.539l2-.933l-2-.933L22 2z"
                />
              </svg>
            </div>
            <div className="flex-shrink ml-3">
              <span className="text-2xl font-bold leading-none text-gray-900">
                0
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Improperly Parked
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
                    VEHICLE_NAME
                  </th>
                  <th scope="col" className="px-6 py-3">
                    VEHICLE_NUM
                  </th>
                  <th scope="col" className="px-6 py-3">
                    VEHICLE_TYPE
                  </th>
                  <th scope="col" className="px-6 py-3">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Thar
                  </th>
                  <td className="px-6 py-4">TN-03 B-1111</td>
                  <td className="px-6 py-4">TWO-WHEELER</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Baleno
                  </th>
                  <td className="px-6 py-4">TN-04 B-2222</td>
                  <td className="px-6 py-4">TWO-WHEELER</td>
                  <td className="px-6 py-4">Active</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Pickup Eicher
                  </th>
                  <td className="px-6 py-4">TN-03 C-3333</td>
                  <td className="px-6 py-4">FOUR-WHEELER</td>
                  <td className="px-6 py-4">InActive</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Swift
                  </th>
                  <td className="px-6 py-4">TN-04 D-5555</td>
                  <td className="px-6 py-4">TWO-WHEELER</td>
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
            <PARKING_Acquistion_Bie_Chart />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 bg-white shadow-lg  rounded-lg p-4 shadow-gray-200 h-auto">
        <PARKING_LiveStreamCard />
      </div>
    </div>
  );
};

export default PARKING_Admin_Dashbord;
