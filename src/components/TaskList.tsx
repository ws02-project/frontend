import { Link } from 'react-router-dom';
import { type Task } from '../services/api';

interface TaskListProps {
    tasks: Task[];
}

const TaskList = ({ tasks = [] }: TaskListProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'from-green-400 to-green-500';
            case 'in_progress': return 'from-yellow-400 to-yellow-500';
            case 'cancelled': return 'from-red-400 to-red-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Project Tasks
                    </h3>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                        {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tasks.map((task) => (
                        <Link
                            key={task.id}
                            to={`/tasks/${task.id}`}
                            className="block group border-2 border-gray-100 hover:border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/30 hover:from-blue-50/30 hover:to-blue-100/30"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors flex-1">
                                    {task.title}
                                </h4>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ml-2 bg-gradient-to-r ${getStatusColor(task.status)} text-white`}>
                                    {task.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.description || 'No description'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="font-mono">{task.id.substring(0, 8)}</span>
                                </div>
                                <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                    View →
                                </span>
                            </div>
                        </Link>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h4 className="text-gray-700 font-semibold mb-1">No tasks yet</h4>
                            <p className="text-gray-500 text-sm">Tasks will appear here when created</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
