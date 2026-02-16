// components/LeaveHistory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function LeaveHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        userId: '',
        startDate: '',
        endDate: '',
        date: '',
        leaveType: '',
        status: '',
        department: ''
    });
    const [users, setUsers] = useState([]);

    const calculateDays = (startDate, endDate)=> {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    };

    const formatLeaveType = (leaveType) => {
        return leaveType.replace(/_/g, ' ');
    };

    const fetchHistory = () => {
        setLoading(true);

        // Only include non-empty filters
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value && value.trim() !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const params = new URLSearchParams(activeFilters).toString();
        console.log(params)
        const url = `https://leave-backend-acb9.onrender.com/leaves/leave-history${params ? `?${params}` : ''}`;

        axios.get(url, { withCredentials: true })
            .then((res) => {
                console.log("history", res.data.data);
                setHistory(res.data.data || []); // Fixed: Actually set the history
            })
            .catch((error) => {
                console.error("Error fetching history:", error);
                setHistory([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchUsers = () => {
        axios.get('https://leave-backend-acb9.onrender.com/admin/users/all', { withCredentials: true })
            .then((res) => {
                console.log(res.data.data);
                setUsers(res.data.data || []);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setUsers([]);
            });
    };

    const handleFilterChange = (e) => {
        console.log(e.target.name, e.target.value)
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            userId: '',
            startDate: '',
            date: "",
            leaveType: "",
            endDate: '',
            status: '',
            department: ''
        });
    };

    const applyFilters = () => {
        fetchHistory();
    };

    const exportToCSV = () => {
        // Include current filters in export
        console.log("press")

        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value && value.trim() !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const params = new URLSearchParams(activeFilters).toString();
        console.log(params)
        const url = `http://localhost:5000/leaves/history/export${params ? `?${params}` : ''}`;

        axios.get(url, {
            withCredentials: true,
            responseType: 'blob'
        })
            .then((res) => {
                console.log(res.data)
                const url = window.URL.createObjectURL(new Blob([res.data]));
                console.log(url)
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `leave-history-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove(); // Clean up
                window.URL.revokeObjectURL(url); // Free up memory
            })
            .catch((error) => {
                console.error("Error exporting CSV:", error);
                alert("Failed to export CSV. Please try again.");
            });
    };

    useEffect(() => {
        fetchHistory();
        fetchUsers();
    }, []);

    // Helper function to get status badge styles
    const getStatusBadgeClass = (status) => {
        const statusUpper = status?.toUpperCase();
        switch (statusUpper) {
            case 'ACCEPTED':
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function to format date safely
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return '-';
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Leave History</h1>
                <button
                    onClick={exportToCSV}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                        <select
                            name="userId"
                            value={filters.userId}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Faculty</option>
                            {users
                                .filter((user) => user.role === "FACULTY")
                                .map((user) => (
                                    <option key={user.id} value={user.email}>
                                        {user.username}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select
                            name="leaveType"
                            value={filters.leaveType}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Leaves Types</option>
                            <option value="Earned_Leave">Earned Leave</option>
                            <option value="Reserved_Leave">Reserved Leave</option>
                            <option value="Casual_Leave">Casual Leave</option>
                            <option value="Sick_Leave">Sick Leave</option>
                            <option value="Paid_Leave">Paid Leave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECOMP">ECOMP</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="ACCEPTED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            onClick={applyFilters}
                            disabled={loading}
                            className="flex-1 px-2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {loading ? 'Loading...' : 'Apply Filters'}
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-2 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Faculty Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Leave Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied On
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>

                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                Loading...
                            </td>
                        </tr>
                    ) : history.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                No leave history found.
                            </td>
                        </tr>
                    ) : (
                        history.map((leave) => (
                            <tr key={leave.id}>
                                <td className="px-6 py-4 whitespace-nowrap">

                                        <div className="text-sm font-medium text-gray-900">
                                            {leave.username || leave.user?.username || '-'}
                                        </div>

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">

                                        <div className="text-sm text-gray-500">
                                            {leave.department || leave.user?.department || '-'}
                                        </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatLeaveType(leave.leaveType) || leave.type || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {calculateDays(leave.startDate, leave.endDate)} days
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(leave.appliedOn || leave.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(leave.status)}`}>
                                            {formatLeaveType(leave.status) || '-'}
                                        </span>
                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}