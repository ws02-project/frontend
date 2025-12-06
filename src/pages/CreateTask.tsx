import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createTask, getProjects, type Project } from '../services/api';

const CreateTask = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        projectId: searchParams.get('projectId') || '',
        assigneeId: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                ...formData,
                projectId: formData.projectId || undefined,
                assigneeId: formData.assigneeId || undefined
            };
            await createTask(taskData as any);
            navigate('/tasks');
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Create New Task
                </h1>
                <p className="mt-2 text-gray-600">Fill in the details to create a new task</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <h2 className="text-xl font-semibold text-white">Task Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title */}
                    <div className="group">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="group">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none group-hover:border-gray-300"
                            placeholder="Describe the task..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white group-hover:border-gray-300 cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="todo">📝 To Do</option>
                                <option value="in_progress">⚡ In Progress</option>
                                <option value="done">✅ Done</option>
                                <option value="cancelled">❌ Cancelled</option>
                            </select>
                        </div>

                        <div className="group">
                            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                id="priority"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white group-hover:border-gray-300 cursor-pointer"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🟠 High</option>
                                <option value="urgent">🔴 Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Project and Assignee */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label htmlFor="projectId" className="block text-sm font-semibold text-gray-700 mb-2">
                                Project (Optional)
                            </label>
                            <select
                                id="projectId"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white group-hover:border-gray-300 cursor-pointer"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            >
                                <option value="">No Project</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="group">
                            <label htmlFor="assigneeId" className="block text-sm font-semibold text-gray-700 mb-2">
                                Assignee ID (Optional)
                            </label>
                            <input
                                type="text"
                                id="assigneeId"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                                placeholder="user-123"
                                value={formData.assigneeId}
                                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/tasks')}
                            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Create Task</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
