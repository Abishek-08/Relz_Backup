"use client";
import React, { FormEvent, useCallback, useEffect, useMemo, useState, FC } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../../styles/ExampleStyle.css";
import TaskService, { TaskWithId } from "../../services/taskService";
 
ModuleRegistry.registerModules([AllCommunityModule]);
 
type ToastType = "success" | "info" | "error";
type Toast = { id: number; message: string; type: ToastType };
 
type ActionCellProps = ICellRendererParams<TaskWithId> & {
  onEdit: (task: TaskWithId) => void;
  onDelete: (task: TaskWithId) => void;
};
 
const ActionCellRenderer: FC<ActionCellProps> = (props) => {
  const task = props.data as TaskWithId;
  return (
    <div className="action-cell">
      <button
        type="button"
        className="icon-btn icon-btn-edit"
        onClick={() => props.onEdit(task)}
        aria-label="Edit task"
      >
        ✏️
      </button>
      <button
        type="button"
        className="icon-btn icon-btn-delete"
        onClick={() => props.onDelete(task)}
        aria-label="Delete task"
      >
        🗑️
      </button>
    </div>
  );
};
 
const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithId[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<any>(null);
  const [taskName, setTaskName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
 
  const showToast = (message: string, type: ToastType) => {
    const newId = Date.now();
    setToasts((prev) => [...prev, { id: newId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newId));
    }, 2500);
  };
 
  // Load from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await TaskService.getAll();
        setTasks(data);
      } catch {
        showToast("Failed to load tasks", "error");
      }
    };
    load();
  }, []);
 
  const openCreateForm = () => {
    setEditingTaskId(null);
    setTaskName("");
    setEmployeeId("");
    setProjectId("");
    setIsFormOpen(true);
  };
 
  const openEditForm = (task: TaskWithId) => {
    console.log("Opening edit form for task:", task);
    console.log("Task ID:", task.id);
    console.log("Task taskId:", task.taskId);
    const taskId = task.id || task.taskId;
    if (taskId == null) {
      showToast("Invalid task ID", "error");
      return;
    }
    setEditingTaskId(taskId);
    setTaskName(task.taskName);
    setEmployeeId(String(task.employeeId || ""));
    setProjectId(String(task.projectId || ""));
    setIsFormOpen(true);
  };
 
  const closeForm = () => setIsFormOpen(false);
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskName.trim()) return;
 
    try {
      if (editingTaskId) {
        console.log("Updating task with ID:", editingTaskId);
        const payload = {
          taskName: taskName.trim(),
          employeeId: employeeId.trim ? employeeId.trim() : employeeId,
          projectId: projectId.trim ? projectId.trim() : projectId,
        };
        const updated = await TaskService.update(editingTaskId, payload);
        console.log("Updated task:", updated);
        setTasks((prev) =>
          prev.map((t) => ((t.id || t.taskId) === editingTaskId ? updated : t))
        );
        showToast(`Updated task`, "info");
      } else {
        const payload = {
          taskName: taskName.trim(),
          employeeId: employeeId.trim ? employeeId.trim() : employeeId,
          projectId: projectId.trim ? projectId.trim() : projectId,
        };
        const created = await TaskService.create(payload);
        setTasks((prev) => [...prev, created]);
        showToast(`Created task`, "success");
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Operation failed", "error");
    }
  };
 
  const handleDelete = async (task: TaskWithId) => {
    console.log("Deleting task:", task);
    console.log("Task ID:", task.id);
    console.log("Task taskId:", task.taskId);
    const taskId = task.id || task.taskId;
    if (taskId == null) {
      showToast("Invalid task ID", "error");
      return;
    }
    try {
      await TaskService.remove(taskId);
      setTasks((prev) => prev.filter((t) => (t.id || t.taskId) !== taskId));
      showToast(`Deleted task`, "error");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Delete failed", "error");
    }
  };
 
  const columnDefs = useMemo<ColDef<TaskWithId>[]>(
    () => [
      {
        headerName: "Task Name",
        field: "taskName",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Employee ID",
        field: "employeeId",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Project ID",
        field: "projectId",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Action Items",
        width: 140,
        cellRenderer: ActionCellRenderer as any,
        cellRendererParams: {
          onEdit: (task: TaskWithId) => openEditForm(task),
          onDelete: (task: TaskWithId) => handleDelete(task),
        },
        sortable: false,
        filter: false,
        pinned: "right",
      },
    ],
    []
  );
 
  const defaultColDef = useMemo<ColDef<TaskWithId>>(
    () => ({
      flex: 1,
      minWidth: 120,
      resizable: true,
    }),
    []
  );
 
  const onGridReady = useCallback(() => {}, []);
 
  const totalTasksLabel = tasks.length === 1 ? "1 task" : `${tasks.length} tasks`;
 
  return (
    <div className="spa-root">
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
 
      <div className="dashboard-root white-theme">
        <header className="dashboard-header no-scroll">
          <div className="header-left">
            <h1 className="app-title">Task Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="task-count-badge">{totalTasksLabel}</span>
            <button className="btn-primary" onClick={openCreateForm}>
              +
            </button>
          </div>
        </header>
 
        <main className="dashboard-main no-scroll">
          <section className="grid-card white-card">
            <div className="ag-theme-quartz custom-ag-theme grid-wrapper height-fixed">
              <AgGridReact<TaskWithId>
                rowData={tasks}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                onGridReady={onGridReady}
              />
            </div>
          </section>
        </main>
 
        {isFormOpen && (
          <div className="modal-overlay">
            <div className="modal white-card">
              <div className="modal-header">
                <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>
                <button className="modal-close" onClick={closeForm}>
                  ✕
                </button>
              </div>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="taskName">Task Name</label>
                    <input
                      id="taskName"
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Enter task name"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP123"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="projectId">Project ID</label>
                    <input
                      id="projectId"
                      type="text"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="e.g. PROJ45"
                    />
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTaskId ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default TaskPage;
 