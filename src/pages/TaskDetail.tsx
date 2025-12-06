import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTaskById, deleteTask, updateTask, getProjects, type Task, type Project } from '../services/api';

const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const fetchTask = () => {
        if (!id) return;
        setLoading(true);
        getTaskById(id)
            .then(async (taskData) => {
                setTask(taskData);
                if (taskData.projectId) {
                    const projects = await getProjects();
                    const proj = projects.find(p => p.id === taskData.projectId);
                    setProject(proj || null);
                }
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load task details');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this task?')) return;

        setDeleting(true);
        try {
            await deleteTask(id);
            navigate('/tasks');
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task');
            setDeleting(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!id || !task) return;
        try {
            await updateTask(id, { status: newStatus as any });
            fetchTask();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'from-green-400 to-green-500';
            case 'in_progress': return 'from-yellow-400 to-yellow-500';
            case 'cancelled': return 'from-red-400 to-red-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-100';
            case 'high': return 'text-orange-600 bg-orange-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-blue-600 font-medium">Loading task...</div>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{error || 'Task not found'}</h3>
                <Link to="/tasks" className="text-blue-600 hover:text-blue-700 font-medium">
                    ← Back to Tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-3xl font-bold text-white">{task.title}</h1>
                                <span className={`px-4 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r ${getStatusColor(task.status)} text-white shadow-lg`}>
                                    {task.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                            </div>
                            {task.description && (
                                <p className="text-blue-100 text-lg">{task.description}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                to={`/tasks/${id}/edit`}
                                className="flex items-center space-x-2 text-white hover:text-blue-100 font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center space-x-2 text-white hover:text-red-100 font-medium bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                            </button>
                            <Link
                                to="/tasks"
                                className="flex items-center space-x-2 text-white hover:text-blue-100 font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-white/50 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Project</p>
                                {project ? (
                                    <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                                        {project.name}
                                    </Link>
                                ) : (
                                    <p className="text-gray-900 font-semibold">No Project</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Assignee</p>
                                <p className="text-gray-900 font-semibold">{task.assigneeId || 'Unassigned'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Created</p>
                                <p className="text-gray-900 font-semibold">{new Date(task.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Status Change</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => handleStatusChange('todo')}
                        disabled={task.status === 'todo'}
                        className="px-4 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-semibold hover:from-gray-500 hover:to-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📝 To Do
                    </button>
                    <button
                        onClick={() => handleStatusChange('in_progress')}
                        disabled={task.status === 'in_progress'}
                        className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ⚡ In Progress
                    </button>
                    <button
                        onClick={() => handleStatusChange('done')}
                        disabled={task.status === 'done'}
                        className="px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ✅ Done
                    </button>
                    <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={task.status === 'cancelled'}
                        className="px-4 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ❌ Cancelled
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
