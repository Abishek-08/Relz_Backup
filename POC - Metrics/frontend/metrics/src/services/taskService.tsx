import axios from "axios";
 
const API_URL = "http://localhost:8083/api/tasks";
 
export interface Task {
  taskId?: any; // Backend uses taskId
  taskName: string;
  employeeId: string;
  projectId: string;
}
 
// Internal interface for frontend usage
export interface TaskWithId extends Omit<Task, 'taskId'> {
  id: any;
  taskId?: any;
}
 
const TaskService = {
  getAll: async (): Promise<TaskWithId[]> => {
    const response = await axios.get(API_URL);
    console.log("GET ALL response:", response.data);
    // Map taskId to id for frontend compatibility
    return response.data.map((task: any) => ({
      ...task,
      id: task.taskId || task._id || task.id,
    }));
  },
 
  create: async (task: Omit<Task, 'taskId'>): Promise<TaskWithId> => {
    const response = await axios.post(API_URL, task);
    console.log("CREATE response:", response.data);
    // Map taskId to id for frontend compatibility
    return {
      ...response.data,
      id: response.data.taskId || response.data._id || response.data.id,
    };
  },
 
  update: async (taskId: any, task: Omit<Task, 'taskId'>): Promise<TaskWithId> => {
    console.log("UPDATE taskId:", taskId, "payload:", task);
    const response = await axios.put(`${API_URL}/${taskId}`, task);
    console.log("UPDATE response:", response.data);
    // Map taskId to id for frontend compatibility
    return {
      ...response.data,
      id: response.data.taskId || response.data._id || response.data.id,
    };
  },
 
  remove: async (taskId: any): Promise<void> => {
    console.log("DELETE taskId:", taskId);
    await axios.delete(`${API_URL}/${taskId}`);
  },
};
 
export default TaskService;
 