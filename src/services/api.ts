import axios from 'axios';

const PROJECT_API_URL = 'http://localhost:3001/api/v1';
const TASK_API_URL = 'http://localhost:3000/api/v1';

// Add a mock token for development
const MOCK_TOKEN = 'mock-jwt-token';

export const projectApi = axios.create({
    baseURL: PROJECT_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOCK_TOKEN}`
    },
});

export const taskApi = axios.create({
    baseURL: TASK_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOCK_TOKEN}`
    },
});

// For backward compatibility
export const api = projectApi;

export interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    ownerId: string;
    members?: string[];
    createdAt: string;
    updatedAt: string;
    memberCount?: number;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigneeId?: string;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskFilters {
    status?: string;
    priority?: string;
    projectId?: string;
    limit?: number;
    offset?: number;
}

// Project API Methods
export const getProjects = async (): Promise<Project[]> => {
    const response = await projectApi.get('/projects');
    return response.data.data;
};

export const getProjectById = async (id: string): Promise<Project & { tasks?: Task[] }> => {
    const response = await projectApi.get(`/projects/${id}`);
    return response.data.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
    const response = await projectApi.post('/projects', data);
    return response.data.data;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await projectApi.patch(`/projects/${id}`, data);
    return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await projectApi.delete(`/projects/${id}`);
};

export const addMember = async (projectId: string, memberId: string): Promise<Project> => {
    const response = await projectApi.post(`/projects/${projectId}/members`, { memberId });
    return response.data.data;
};

export const removeMember = async (projectId: string, memberId: string): Promise<Project> => {
    const response = await projectApi.delete(`/projects/${projectId}/members`, { data: { memberId } });
    return response.data.data;
};

export const getStatistics = async (): Promise<any> => {
    const response = await projectApi.get('/projects/statistics');
    return response.data.data;
};

// Task API Methods
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
    const response = await taskApi.get('/tasks', { params: filters });
    return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
    const response = await taskApi.get(`/tasks/${id}`);
    return response.data.data;
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
    const response = await taskApi.post('/tasks', data);
    return response.data.data;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await taskApi.patch(`/tasks/${id}`, data);
    return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await taskApi.delete(`/tasks/${id}`);
};

export const getTaskStatistics = async (projectId?: string): Promise<any> => {
    const response = await taskApi.get('/tasks/statistics', { params: { projectId } });
    return response.data.data;
};
