import React, { useEffect } from "react";

const TableFooter = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <nav aria-label="Page navigation example">
      <ul className="flex items-center inline-flex -space-x-px h-8 text-sm">
        <li aria-disabled="true">
          <button
            data-tooltip-target="tooltip-hover"
            disabled={page === 1 ? true : false}
            onClick={() => setPage(page - 1)}
            className="flex items-center justify-center cursor-pointer px-3 h-8 leading-tight text-gray-500 bg-zinc-300 border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
          {page === 1 ? (
            <div
              id="tooltip-hover"
              role="tooltip"
              className="relative z-20 invisible inline-block text-sm font-medium text-white  rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-red-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          ) : (
            <div
              id="tooltip-hover"
              role="tooltip"
              className="relative z-20 invisible inline-block px-1 py-1 text-sm font-normal text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Previous
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          )}
        </li>

        {range.map((el, index) => (
          <li aria-disabled="true" key={index}>
            <button
              onClick={() => setPage(el)}
              className={
                page === el
                  ? "flex items-center cursor-pointer justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-100 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  : "flex items-center cursor-pointer justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }
            >
              {el}
            </button>
          </li>
        ))}

        <li aria-disabled="true">
          <button
            data-tooltip-target="tooltip-hover-next"
            disabled={page === range.length ? true : false}
            onClick={() => setPage(page + 1)}
            className="flex items-center justify-center cursor-pointer px-3 h-8 leading-tight text-gray-500 bg-zinc-300 border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
          {page === range.length ? (
            <div
              id="tooltip-hover-next"
              role="tooltip"
              className="relative z-20 invisible inline-block text-sm font-medium text-white rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-red-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          ) : (
            <div
              id="tooltip-hover-next"
              role="tooltip"
              className="relative z-20 invisible inline-block px-1 py-1 text-sm font-normal text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Next
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default TableFooter;
