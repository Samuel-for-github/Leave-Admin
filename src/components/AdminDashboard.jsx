// AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    DocumentCheckIcon,
    ClockIcon,
    ChartBarIcon,
    BellIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

        axios.get('http://localhost:5000/admin/dashboard', { withCredentials: true })

            .then((res) => {
                setAdminInfo(res.data);
            })
            .catch(() => {
                setError('Unauthorized. Please login again.');
                navigate('/login');
            });

        // Fetch pending leaves count

        axios.get('http://localhost:5000/admin/leaves/pending-count', { withCredentials: true })


            .then((res) => {
                setPendingCount(res.data.count);
            })
            .catch(console.error);
    }, [navigate]);

    const handleLogout = () => {

        axios.post('http://localhost:5000/admin/logout', {}, { withCredentials: true })


            .then(() => {
                navigate('/login');
            });
    };

    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/admin' },
        // { name: 'Leave Requests', icon: DocumentCheckIcon, path: '/admin/leaves', badge: pendingCount },
        { name: 'Users Management', icon: UsersIcon, path: '/admin/users' },
        { name: 'Leave History', icon: ClockIcon, path: '/admin/leave-history' },
        { name: 'Reports', icon: ChartBarIcon, path: '/admin/reports' },
    ];

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
                    <h2 className="text-xl font-semibold text-white">Leave Management</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-300 hover:text-white"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-center justify-between px-6 py-3 text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </div>
                            {item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4">
                    <div className="mb-4 px-6 py-3 bg-indigo-800 rounded">
                        <p className="text-xs text-gray-400">Logged in as:</p>
                        <p className="text-sm text-white font-medium">{adminInfo?.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{adminInfo?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3 text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors duration-200 rounded"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700 lg:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <BellIcon className="h-6 w-6" />
                                {pendingCount > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}