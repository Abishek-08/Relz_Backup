"use client"; 
import { useState, useMemo, useEffect } from "react"; 
import { Pencil, Trash2, Plus, X, Search, Filter, ChevronLeft, ChevronRight, Users, Star } from "lucide-react"; 
import toast, { Toaster } from "react-hot-toast"; 
import {
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee, 
} from "@/services/EmployeeService"; 
interface Employee { 
  id:number;
  employeeId: number; 
  employeeName: string; 
  role: string; 
  employeeEmail: string; 
} 
export default function EmployeePage() { 
  const [employees, setEmployees] = useState<Employee[]>([]); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(5); 
  const [formData, setFormData] = useState({ 
    employeeId:0,
    employeeName: "", 
    role: "", 
    employeeEmail: "", 
  }); 
  useEffect(() => { 
    fetchAllEmployees(); 
  }, []); 
  const fetchAllEmployees = () => { 
    getEmployees() 
      .then((res) => setEmployees(res.data)) 
      .catch(() => toast.error("Failed to fetch employees")); 
  }; 
  const handleSubmit = async () => { 
    if (!formData.employeeName.trim() || !formData.employeeEmail.trim()) { 
      toast.error("Name & Email required"); 
      return; 
    } 
    try { 
      if (editingEmployee) { 
        await updateEmployee(editingEmployee.id, formData); 
        toast.success("Employee updated"); 
      } else { 
        const response = await addEmployee(formData); 
        toast.success("Employee added"); 
        setEmployees((prev) => [...prev, response.data]); 
      } 
      setModalOpen(false); 
      fetchAllEmployees(); 
    } catch (error) { 
      console.error("Submit error:", error); 
      toast.error("Operation failed"); 
    } 
  }; 
const handleDelete = async (id: number) => { 
    if (!window.confirm("Delete this employee?")) return; 
    try { 
      await deleteEmployee(id); 
      toast.success("Employee deleted"); 
      fetchAllEmployees(); 
    } catch (error) { 
      console.error("Delete error:", error); 
      toast.error("Delete failed"); 
    } 
  }; 
  const openModalToAdd = () => { 
    setEditingEmployee(null); 
    setFormData({ employeeId: 0, employeeName: "", role: "", employeeEmail: "" }); 
    setModalOpen(true); 
  }; 
  const openModalToEdit = (emp: Employee) => { 
    setEditingEmployee(emp); 
    setFormData({ 
      employeeId: emp.employeeId, 
      employeeName: emp.employeeName, 
      role: emp.role, 
      employeeEmail: emp.employeeEmail, 
    }); 
    setModalOpen(true); 
  }; 
  const uniqueRoles = useMemo(() => { 
    const roles = employees.map((emp) => emp.role).filter((r) => r.trim() !== ""); 
    return ["all", ...Array.from(new Set(roles))]; 
  }, [employees]); 
  const filteredEmployees = useMemo(() => { 
    return employees.filter((emp) => { 
      const s = searchTerm.toLowerCase(); 
      const matchesSearch = 
        emp.employeeName.toLowerCase().includes(s) || 
        emp.employeeEmail.toLowerCase().includes(s) || 
        emp.role.toLowerCase().includes(s); 
      const matchesRole = roleFilter === "all" || emp.role === roleFilter; 
      return matchesSearch && matchesRole; 
    }); 
  }, [employees, searchTerm, roleFilter]); 
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage); 
  const startIndex = (currentPage - 1) * itemsPerPage; 
  const endIndex = startIndex + itemsPerPage; 
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex); 
  useEffect(() => { 
    if (currentPage > totalPages && totalPages > 0) { 
      setCurrentPage(totalPages); 
    } 
  }, [totalPages, currentPage]); 
  const goToPage = (page: number) => { 
    setCurrentPage(Math.max(1, Math.min(page, totalPages))); 
  };
  
  return ( 
    <div className="w-full bg-gray-50 flex flex-col"> 
      <Toaster position="top-right" /> 
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 flex-shrink-0"> 
        <div> 
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1> 
          <p className="text-gray-600 text-sm mt-1">Manage your employees efficiently</p> 
        </div> 
        <button 
          onClick={openModalToAdd} 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm" 
        > 
          <Plus className="w-4 h-4" /> Add Employee 
        </button> 
      </div> 
       
      <div className=" flex-1 px-8 py-6"> 
     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> 
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-4 shadow-md flex justify-between items-center"> 
            <div>                
              <p className="text-xs uppercase opacity-90">Total Employees</p> 
               <p className="text-2xl font-bold">{employees.length}</p> 
             </div> 
              <Users className="w-10 h-10 opacity-90" /> 
           </div> 
             <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-4 shadow-md flex justify-between items-center"> 

             <div> 

               <p className="text-xs uppercase opacity-90">Unique Roles</p> 

               <p className="text-2xl font-bold">{uniqueRoles.length - 1}</p> 

             </div> 
             <Star className="w-10 h-10 opacity-90" /> 
          </div> 
 
           <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg p-4 shadow-md flex justify-between items-center"> 
            <div> 
               <p className="text-xs uppercase opacity-90">Filtered Results</p> 
               <p className="text-2xl font-bold">{filteredEmployees.length}</p> 
             </div> 
             <Search className="w-10 h-10 opacity-90" /> 
           </div> 
        </div>  
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"> 
           <div className="flex flex-col md:flex-row gap-3"> 
             <div className="flex-1 relative"> 
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> 
               <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" 
                value={searchTerm} 
                onChange={(e) => { 
                  setSearchTerm(e.target.value); 
                  setCurrentPage(1); 
                }} 
              /> 
            </div> 
            <div className="relative md:w-56"> 
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> 
              <select 
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" 
                value={roleFilter} 
                onChange={(e) => { 
                  setRoleFilter(e.target.value); 
                  setCurrentPage(1); 
                }} 
              > 
                <option value="all">All Roles</option> 
                {uniqueRoles.slice(1).map((r) => ( 
                  <option key={r} value={r}>{r}</option> 
                ))} 
              </select> 
            </div> 
          </div> 
        </div> 
        <div className="bg-white border rounded-lg shadow-sm mb-4 "> 
          <table className="w-full"> 
            <thead> 
              <tr className="bg-black text-white"> 
                <th className="px-6 py-3 text-left text-xs uppercase">Employee Name</th> 
                <th className="px-6 py-3 text-left text-xs uppercase">Role</th> 
                <th className="px-6 py-3 text-left text-xs uppercase">Email</th> 
                <th className="px-6 py-3 text-center text-xs uppercase">Actions</th> 
              </tr> 
            </thead> 
            <tbody className="divide-y divide-gray-200"> 
              {currentEmployees.map((emp) => ( 
                <tr key={emp.id} className="hover:bg-gray-50"> 
                  <td className="px-6 py-4">{emp.employeeName}</td> 
                  <td className="px-6 py-4">{emp.role || "No Role"}</td> 
                  <td className="px-6 py-4">{emp.employeeEmail}</td> 
                  <td className="px-6 py-4 text-center"> 
                    <button 
                      onClick={() => openModalToEdit(emp)} 
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-2 hover:bg-blue-200" 
                    > 
                      <Pencil className="w-4 h-4" /> 
                    </button> 
                    <button 
                      onClick={() => handleDelete(emp.id)} 
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" 
                    > 
                      <Trash2 className="w-4 h-4" /> 
                    </button> 
                  </td> 
                </tr> 
              ))} 
              {currentEmployees.length === 0 && ( 
                <tr> 
                  <td colSpan={4} className="text-center py-10 text-gray-500"> 
                    No records found 
                  </td> 
                </tr> 
              )} 
            </tbody> 

          </table> 
        </div>
        
      </div>
      {/* Modal */} 
      {isModalOpen && ( 
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50"> 
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl"> 
            <div className="bg-blue-600 p-5 rounded-t-xl flex justify-between items-center"> 
              <h3 className="text-white font-bold text-lg"> 
                {editingEmployee ? "Edit Employee" : "Add Employee"} 
              </h3> 
              <button onClick={() => setModalOpen(false)} className="text-white hover:bg-blue-700 p-1 rounded"> 
                <X className="w-5 h-5" /> 
              </button> 
            </div> 
            <div className="p-6 space-y-4"> 
              <input 
                type="number" 
                placeholder="Employee ID" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.employeeId || ""} 
                onChange={(e) => 
                  setFormData({ ...formData, employeeId: Number(e.target.value) }) 
                } 
              /> 
              <input 
                placeholder="Employee Name" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.employeeName} 
                onChange={(e) => 
                  setFormData({ ...formData, employeeName: e.target.value }) 
                } 
              /> 
              <input 
                placeholder="Role" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.role} 
                onChange={(e) => 
                  setFormData({ ...formData, role: e.target.value }) 
                } 
              /> 
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.employeeEmail} 
                onChange={(e) => 
                  setFormData({ ...formData, employeeEmail: e.target.value }) 
                } 
              /> 
            </div> 
 
            <div className="flex gap-3 p-6 pt-0"> 
              <button 
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50" 
                onClick={() => setModalOpen(false)} 
              > 
                Cancel 
              </button> 
 
              <button 
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                onClick={handleSubmit} 
              > 
                {editingEmployee ? "Update" : "Add"} 
              </button> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
} 
