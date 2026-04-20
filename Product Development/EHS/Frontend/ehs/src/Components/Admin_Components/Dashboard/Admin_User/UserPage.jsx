import { Modal } from "flowbite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useTable from "../../../../Utils/TableUtils/hooks/useTable";
import TableFooter from "../../../../Utils/TableUtils/table/TableFooter/TableFooter";
import {
  createSolutionService,
  deleteSolutionService,
} from "../../../../Services/Solution_Services/SolutionService";
import { deleteMultipleIndustryService } from "../../../../Services/Industry_Services/IndustryService";
import { getAllUserService } from "../../../../Services/User_Services/UserService";

const UserPage = () => {
  const [addSolutionModal, setAddSolutionModal] = useState(null);
  const [userList, setUserList] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedSolution, setSelectedSolution] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  const industryId = useSelector(
    (state) => state.adminDashSlice.industry.industryId
  );

  useEffect(() => {
    const $modalEl = document.getElementById("add-industry-modal");
    setAddSolutionModal(new Modal($modalEl));
    getAllUser(industryId);
  }, []);

  // useForm() - Declaration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Industry Creation to Backend Method
  const createSolution = (data) => {
    data.industry_Id = industryId;
    console.log(data);
    createSolutionService(data)
      .then((res) => {
        if (res.status === 200) {
          reset();
          addSolutionModal.hide();
          getAllUser();
        }
      })
      .catch((err) => {
        if (err.response.status === 500) {
          reset();
          addSolutionModal.hide();
          console.log("Industry object is not inserted");
        }
      });
  };

  // Industry Deletion from Backend Method
  const deleteSolution = (solutionId) => {
    deleteSolutionService(solutionId)
      .then((res) => {
        if (res.status === 200) {
          getAllUser();
        }
      })
      .catch((err) => {
        if (err.response.code === 500) {
          console.log("Failure in server");
        }
      });
  };

  // Get All Solution from Backend
  const getAllUser = () => {
    getAllUserService()
      .then((res) => {
        if (res.status === 200) {
          setUserList(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        if (err.response.status === 500) {
          console.log("server error");
        }
      });
  };

  // Industry Search Filter
  const searchFilterList = useMemo(() => {
    return userList.filter((user) =>
      user.userName.toLowerCase().includes(searchInputValue.toLowerCase())
    );
  }, [userList, searchInputValue]);

  const [page, setPage] = useState(1);

  const { slice, range } = useTable(searchFilterList, page, rowsPerPage);

  const handleSetPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Multiple Select Function
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempIndustry = userList.map((user) => {
        selectedSolution.length === 0
          ? setSelectedSolution((prev) => [...prev, user])
          : setSelectedSolution([]);
        return { ...user, isChecked: checked };
      });
      setUserList(tempIndustry);
    } else {
      let tempIndustry = userList.map((user) =>
        user.userName === name ? { ...user, isChecked: checked } : user
      );
      setUserList(tempIndustry);

      setSelectedSolution(
        tempIndustry.filter((user) => user.isChecked === true)
      );
    }
  };

  const multipleSelectDelete = () => {
    let solutionList = [];
    selectedSolution.forEach((name) => solutionList.push(name.solutionType));
    deleteMultipleIndustryService(solutionList)
      .then(() => {
        getAllUser();
      })
      .catch(() => {
        console.log("deletion-error");
      });
  };
  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
      <div className="block justify-between items-center mx-4 mt-4 mb-6 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <nav className="flex mb-5">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <a className="text-base cursor-pointer font-normal inline-flex items-center text-gray-700 hover:text-gray-900">
                    <svg
                      className="w-5 h-5 mr-2.5 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Home
                  </a>
                </li>

                <li className="inline-flex items-center">
                  <div className="mr-2.5">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                  </div>
                  <a className="text-sm cursor-pointer font-base text-gray-400">
                    User
                  </a>
                </li>
              </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All User
            </h1>
          </div>
          <div className="block items-center sm:flex md:divide-x md:divide-white">
            <form className="mb-4 sm:mb-0 sm:pr-3">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative sm:w-full lg:w-96">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  id="table-search"
                  className="p-2 ps-10 text-sm  text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focs:border-blue-500"
                  placeholder="Search for user"
                />
              </div>
            </form>
            <div className="pl-2 space-x-1 md:flex hidden">
              <a
                onClick={multipleSelectDelete}
                className="inline-flex justify-center p-1 text-gray-500 hover:text-gray-900 cursor-pointer hover:bg-gray-100 rounded"
              >
                <svg
                  className="w-6 h-6 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a className="inline-flex justify-center p-1 text-gray-500 hover:text-gray-900 cursor-pointer hover:bg-gray-100 rounded">
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                    d="M12 6h.01M12 12h.01M12 18h.01"
                  />
                </svg>
              </a>
            </div>
            <div className="flex items-center w-full sm:justify-end">
              <button
                type="button"
                onClick={() => addSolutionModal.show()}
                data-modal-target="add-industry-modal"
                data-modal-toggle="add-industry-modal"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-[1.02] transition-transform"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                  />
                </svg>
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 flex flex-col rounded-2xl shadow-xl shadow-gray-200">
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
                          checked={
                            !userList.some((user) => user?.isChecked !== true)
                          }
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 border-4 rounded-sm focus:bg-gray-900 focus:ring-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <a>Name</a>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Profile
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            name={user.userName}
                            checked={user?.isChecked || false}
                            onChange={handleCheckboxChange}
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
                      <td className="px-6 py-4">{user.userName}</td>

                      <td className="px-6 py-4">
                        <img
                          src={`data:image/jpeg;base64,${user.userProfile}`}
                          className="w-10 h-10 rounded-full"
                          alt="Rounded avatar"
                        ></img>
                      </td>
                      <td className="px-6 py-4">{user.userEmail}</td>
                      <td className="px-6 py-4">{user.userRole}</td>
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
                          onClick={() => deleteSolution(user.userId)}
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
      </div>

      <div className="mb-4 p-4 flex justify-between rounded-2xl shadow-xl shadow-gray-200">
        <div className="items-center inline-flex space-x-2">
          <label htmlFor="underline_select" className="text-sm font-normal">
            Rows Per Page:
          </label>
          <form className="max-w-sm mx-auto items-center">
            <select
              onChange={(e) =>
                e.target.value === "All"
                  ? setRowsPerPage(userList.length)
                  : setRowsPerPage(e.target.value)
              }
              id="underline_select"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option defaultValue="Row Per Page" disabled>
                Row Per Page
              </option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="All">All</option>
            </select>
          </form>
        </div>
        <div className="flex items-center">
          <TableFooter
            range={range}
            setPage={handleSetPage}
            page={page}
            slice={slice}
          />
        </div>
      </div>

      {/* Modal open for Industry Insertion */}
      <>
        {/* Main modal */}
        <div
          id="add-industry-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bg-gray-900/50 dark:bg-gray-900/80 z-50 justify-center items-center w-full  md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add User
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="add-industry-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form
                onSubmit={handleSubmit(createSolution)}
                className="p-4 md:p-5"
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className={
                        errors.userName
                          ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                          : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      }
                      placeholder="name"
                      {...register("userName", {
                        required: "please fill the field",
                      })}
                    />
                    {errors.userName && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.userName.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add new user
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default UserPage;
