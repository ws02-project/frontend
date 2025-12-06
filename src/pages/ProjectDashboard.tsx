import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, deleteProject, type Project, type Task } from '../services/api';
import MemberControl from '../components/MemberControl';
import TaskList from '../components/TaskList';

const ProjectDashboard = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project & { tasks?: Task[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const fetchProject = useCallback(() => {
        if (!id) return;
        setLoading(true);
        getProjectById(id)
            .then(setProject)
            .catch((err) => {
                console.error(err);
                setError('Failed to load project details');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        setDeleting(true);
        try {
            await deleteProject(id);
            navigate('/projects');
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project. Please try again.');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center text-blue-600 font-medium">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{error || 'Project not found'}</h3>
                <Link to="/projects" className="text-blue-600 hover:text-blue-700 font-medium">
                    ← Back to Projects
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
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                                <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-lg ${project.status === 'active'
                                    ? 'bg-green-400 text-white'
                                    : project.status === 'completed'
                                        ? 'bg-blue-400 text-white'
                                        : 'bg-gray-400 text-white'
                                    }`}>
                                    {project.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-blue-100 text-lg">{project.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                to={`/projects/${id}/edit`}
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
                                className="flex items-center space-x-2 text-white hover:text-red-100 font-medium bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                            </button>
                            <Link
                                to="/projects"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Owner</p>
                                <p className="text-gray-900 font-semibold">{project.ownerId}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Team Members</p>
                                <p className="text-gray-900 font-semibold">{project.members?.length || 0}</p>
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
                                <p className="text-gray-900 font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TaskList tasks={project.tasks || []} />
                </div>
                <div>
                    <MemberControl
                        projectId={project.id}
                        members={project.members || []}
                        onUpdate={fetchProject}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
