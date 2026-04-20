import { Project } from '../views/ProjectManagement';

const API_BASE_URL = 'http://localhost:8082/api/projects';

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const payload = {
    projectName: project.projectName,
    createdAt: project.createdAt,
    closedAt: project.closedAt,
    active: project.active,
  };
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
};

export const updateProject = async (id: number, project: Omit<Project, 'id'>): Promise<Project> => {
  const payload = {
    projectName: project.projectName,
    createdAt: project.createdAt,
    closedAt: project.closedAt,
    active: project.active,
  };
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
};
