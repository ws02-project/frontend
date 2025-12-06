import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            {/* Navigation with gradient */}
            <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight group-hover:text-blue-100 transition-colors">
                                    Project Hub
                                </span>
                            </Link>

                            <div className="ml-10 flex items-baseline space-x-2">
                                <Link
                                    to="/"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/') && !isActive('/projects')
                                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/projects"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/projects')
                                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    Projects
                                </Link>
                                <Link
                                    to="/tasks"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/tasks')
                                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    Tasks
                                </Link>
                                <Link
                                    to="/statistics"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/statistics')
                                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    Statistics
                                </Link>
                            </div>
                        </div>

                        {/* <div>
                            <Link
                                to="/projects/create"
                                className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>New Project</span>
                            </Link>
                        </div> */}
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
