"use client";
import { useState, useEffect } from "react";
import { Plus, X, Calendar, Trash2, Pencil } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "../services/ProjectService";

// Define the Project type
export interface Project {
  id: number;
  projectName: string;
  createdAt: string;
  closedAt: string | null;
  active: boolean;
}

// Define the FormData type
interface ProjectFormData {
  name: string;
  createdAt: string;
  closedAt: string;
  isActive: boolean;
}

// Define the Errors type
interface FormErrors {
  name: string;
  createdAt: string;
  closedAt: string;
}

export default function ProjectManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    createdAt: new Date().toISOString().split("T")[0],
    closedAt: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    createdAt: "",
    closedAt: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      createdAt: "",
      closedAt: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
      isValid = false;
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Project name must not exceed 100 characters";
      isValid = false;
    }

    const isDuplicate = projects.some(
      (project) =>
        project.projectName && project.projectName.toLowerCase() === formData.name.trim().toLowerCase() &&
        project.id !== editingProject?.id
    );
    if (isDuplicate) {
      newErrors.name = "A project with this name already exists";
      isValid = false;
    }

    if (!formData.createdAt) {
      newErrors.createdAt = "Created date is required";
      isValid = false;
    }

    if (formData.closedAt) {
      const closedDate = new Date(formData.closedAt);
      const createdDate = new Date(formData.createdAt);

      if (!formData.createdAt) {
      newErrors.createdAt = "Created date is required";
      isValid = false;
    }
      else if  (closedDate < createdDate) {
        newErrors.closedAt = "Closed date cannot be before created date";
        isValid = false;
      }

   
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddProject = async () => {
    if (validateForm()) {
      try {
        if (editingProject) {
          const updatedProject = await updateProject(editingProject.id, {
            projectName: formData.name.trim(),
            createdAt: formData.createdAt,
            closedAt: formData.closedAt || null,
            active: formData.isActive,
          });
          setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
          setEditingProject(null);
        } else {
          const newProject = await createProject({
            projectName: formData.name.trim(),
            createdAt: formData.createdAt,
            closedAt: formData.closedAt || null,
            active: formData.isActive,
          });
          setProjects([...projects, newProject]);
        }
        setFormData({
          name: "",
          createdAt: new Date().toISOString().split("T")[0],
          closedAt: "",
          isActive: true,
        });
        setErrors({
          name: "",
          createdAt: "",
          closedAt: "",
        });
        setShowAddModal(false);
      } catch (err) {
        setError('Failed to save project');
      }
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.projectName,
      createdAt: project.createdAt,
      closedAt: project.closedAt || "",
      isActive: project.active,
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProject(null);
    setFormData({
      name: "",
      createdAt: new Date().toISOString().split("T")[0],
      closedAt: "",
      isActive: true,
    });
    setErrors({
      name: "",
      createdAt: "",
      closedAt: "",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-600 mt-1">Manage your projects efficiently</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!loading && !error && (
        <div className="space-y-4">
          {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:border-blue-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {project.projectName}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {project.active ? "Active" : "Closed"}
                </span>
                <button
                  onClick={() => handleEditClick(project)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Edit project"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(project)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created: {project.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Closed: {project.closedAt || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created At
                </label>
                <input
                  type="date"
                  value={formData.createdAt}
                  onChange={(e) => {
                    setFormData({ ...formData, createdAt: e.target.value });
                    if (errors.createdAt)
                      setErrors({ ...errors, createdAt: "" });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.createdAt ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.createdAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.createdAt}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closed At 
                </label>
                <input
                  type="date"
                  value={formData.closedAt}
                  onChange={(e) => {
                    setFormData({ ...formData, closedAt: e.target.value });
                    if (errors.closedAt)
                      setErrors({ ...errors, closedAt: "" });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.closedAt ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.closedAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.closedAt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Project
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
              >
                {editingProject ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Delete Project
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{projectToDelete.projectName}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg transition-all hover:from-red-600 hover:to-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}