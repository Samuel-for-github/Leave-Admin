// components/DashboardOverview.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UsersIcon,
    DocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        // pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,
        facultyCount: 0,
        hodCount: 0,
        principalCount: 0
    });

    useEffect(() => {
        axios.get('http://localhost:8080/admin/stats', { withCredentials: true })
            .then((res) => {
                setStats(res.data);
            })
            .catch(console.error);
    }, []);

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'bg-blue-500' },
        // { title: 'Pending Leaves', value: stats.pendingLeaves, icon: DocumentCheckIcon, color: 'bg-yellow-500' },
        { title: 'Approved Leaves', value: stats.approvedLeaves, icon: CheckCircleIcon, color: 'bg-green-500' },
        { title: 'Rejected Leaves', value: stats.rejectedLeaves, icon: XCircleIcon, color: 'bg-red-500' },
    ];

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">User Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-3xl font-bold text-indigo-600">{stats.facultyCount}</p>
                        <p className="text-gray-600 mt-1">Faculty Members</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-3xl font-bold text-indigo-600">{stats.hodCount}</p>
                        <p className="text-gray-600 mt-1">HODs</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-3xl font-bold text-indigo-600">{stats.principalCount}</p>
                        <p className="text-gray-600 mt-1">Principals</p>
                    </div>
                </div>
            </div>
        </div>
    );
}