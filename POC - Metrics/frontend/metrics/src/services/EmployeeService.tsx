import axios from "axios";
 
const API_URL = "http://localhost:8081/api/employees";
 
export const getEmployees = () => axios.get(API_URL);
 
export const addEmployee = (employeeData: any) =>
  axios.post(API_URL, employeeData);
 
export const updateEmployee = (id: number, employeeData: any) =>
  axios.put(`${API_URL}/${id}`, employeeData);
 
export const deleteEmployee = (id: number) =>
  axios.delete(`${API_URL}/${id}`);