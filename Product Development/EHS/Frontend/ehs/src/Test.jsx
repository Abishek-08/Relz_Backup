import React, { useCallback, useMemo, useState } from "react";
import useTable from "./Utils/TableUtils/hooks/useTable";
import TableFooter from "./Utils/TableUtils/table/TableFooter/TableFooter";

const Test = () => {
  const rawData = useMemo(
    () => [
      { id: 1, name: "Poland", language: "Polish", capital: "Warsaw" },
      { id: 2, name: "Bulgaria", language: "Bulgarian", capital: "Sofia" },
      { id: 3, name: "Hungary", language: "Hungarian", capital: "Budapest" },
      { id: 4, name: "Moldova", language: "Moldovan", capital: "Chișinău" },
      { id: 5, name: "Austria", language: "German", capital: "Vienna" },
      { id: 6, name: "Lithuania", language: "Lithuanian", capital: "Vilnius" },
    ],
    []
  ); // stable unless the dataset truly changes

  const rowsPerPage = 4;
  const [page, setPage] = useState(1);

  const { slice, range } = useTable(rawData, page, rowsPerPage);

  const handleSetPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  console.log("slice: ", slice);
  console.log("range: ", range);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        name="allSelect"
                        // checked={
                        //   !industryList.some(
                        //     (industry) => industry?.isChecked !== true
                        //   )
                        // }
                        // onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 border-4 rounded-sm focus:bg-gray-900 focus:ring-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Industry Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Industry Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Industry Creation Date
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {slice.map((industry, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          name={industry.industryType}
                          // checked={industry?.isChecked || false}
                          // onChange={handleCheckboxChange}
                          className="w-4 h-4 focus:ring-gray-500 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {industry.name}
                    </th>
                    <td className="px-6 py-4">{industry.language}</td>
                    <td className="px-6 py-4">{industry.capital}</td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button className="inline-flex items-center py-2 px-3 bg-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 hover:scale-[1.02] transition-all">
                        <svg
                          className="mr-2 w-5 h-5 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        // onClick={() => deleteIndustry(industry.industryType)}
                        className="inline-flex items-center py-2 px-3 bg-red-200 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-red-500 to-red-700 hover:scale-[1.02] transition-transform"
                      >
                        <svg
                          className="mr-2 w-5 h-5 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TableFooter
        range={range}
        setPage={handleSetPage}
        page={page}
        slice={slice}
      />
    </div>
  );
};

export default Test;
