
import { useEffect, useMemo, useState } from "react"; 

import { Plus, Pencil, Search, X, ChevronLeft, ChevronRight } from "lucide-react"; 


import { 

  getAllEventManagers, 

  updateAccountStatus, 

} from "../../services/Services"; 
import EventManagerModal from "./EventManagerModel";
import { useToast } from "../../utils/useToast";


const PAGE_SIZE_OPTIONS = [4, 10, 20, 50];

const ManageEventManager = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  //rows per page
  const [pageSize, setPageSize] = useState(4);

  /* ---------- Load Event Managers ---------- */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllEventManagers();
      console.log("Event Managers:", res.data);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Load error:", error);
      error("Failed to load event managers");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ---------- Filters + Search ---------- */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const nameMatch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const statusMatch = statusFilter === "ALL" || u.accountStatus === statusFilter;

      return nameMatch && statusMatch;
    });
  }, [users, search, statusFilter]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  // Keep current page in range when totalPages changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page <= 3) {
        pages.push(2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push("...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  /* ---------- Status Toggle ---------- */
  const toggleStatus = async (user) => {
    try {
      const newStatus = user.accountStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateAccountStatus(user.eventManagerId, newStatus);
      success(`Event Manager ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`);
      loadUsers();
    } catch (error) {
      console.error("Status update error:", error);
      error("Failed to update status");
    }
  };

  /* ---------- Handle Modal ---------- */
  const handleOpenAddModal = () => {
    setEditUser(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUser(null);
  };

  const handleSuccess = () => {
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-3 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Event Managers
              </h1>
              <p className="text-gray-500 text-sm">
                Manage and organize your event managers
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-medium cursor-pointer"
              style={{ backgroundColor: "#274c77" }}
            >
              <Plus size={20} />
              <span>Add Manager</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // reset page on search
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1); // reset page on filter change
                }}
                className="w-full px-2 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {search && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              {filteredUsers.length > 0 ? (
                <>
                  <span>Found {filteredUsers.length} result(s)</span>
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-800 hover:text-gray-900 underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <span>No results found</span>
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-800 hover:text-gray-900 underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
              <p className="mt-4 text-gray-500">Loading event managers...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white" style={{ backgroundColor: "#274c77" }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Status
                      </th>
                      {/* <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedUsers.map((u) => (
                      <tr
                        key={u.eventManagerId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold mr-3">
                              {u.fullName?.charAt(0).toUpperCase() || "E"}
                            </div>
                            <span className="font-medium text-gray-900">
                              {u.fullName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={u.accountStatus === "ACTIVE"}
                              onChange={() => toggleStatus(u)}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              {u.accountStatus === "ACTIVE" ? "Active" : "Inactive"}
                            </span>
                          </label>
                        </td>
                        {/* <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                          >
                            <Pencil size={16} />
                            <span>Edit</span>
                          </button>
                        </td> */}
                      </tr>
                    ))}

                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg
                              className="w-16 h-16 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              No event managers found
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left: Results + Rows per page */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Page {page} of {totalPages}</span>
                      <span className="mx-2">•</span>
                      <span>
                        Showing {paginatedUsers.length} {paginatedUsers.length === 1 ? "record" : "records"}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{filteredUsers.length} total</span>
                    </div>

                    {/* Rows per page selector */}
                    <div className="flex items-center gap-2">
                      <label htmlFor="rowsPerPage" className="text-gray-700">Rows per page:</label>
                      <select
                        id="rowsPerPage"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1); // reset to first page when page size changes
                        }}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
                      >
                        {PAGE_SIZE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right: Pagination controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                      title="Previous page"
                    >
                      <ChevronLeft size={18} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {getPageNumbers().map((pageNum, idx) =>
                        pageNum === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-3 py-2 text-gray-400 font-medium"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                              page === pageNum
                                ? "bg-gray-800 text-white shadow-md scale-105"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                      title="Next page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <EventManagerModal
          editUser={editUser}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ManageEventManager;
``
