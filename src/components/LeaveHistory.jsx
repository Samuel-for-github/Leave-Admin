// components/LeaveHistory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function LeaveHistory() {
    const [history, setHistory] = useState([]);
    const [filters, setFilters] = useState({
        userId: '',
        startDate: '',
        endDate: '',
        status: '',
        department: ''
    });
    const [users, setUsers] = useState([]);



    const fetchHistory = () => {
        console.log("filters", filters);
        const params = new URLSearchParams(filters).toString();

        axios.get(`http://localhost:5000/leaves/leave-history?${params}`, { withCredentials: true })

            .then((res) => {
                console.log("history", res.data.data);
                // setHistory(res.data);
            })
            .catch(console.error);
    };

    const fetchUsers = () => {

      axios.get('http://localhost:5000/admin/users/all', { withCredentials: true })

            .then((res) => {
                console.log(res.data.data);
                 setUsers(res.data.data);
            })
            .catch(console.error);

    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        fetchHistory();
    };

    const exportToCSV = () => {

        axios.get('http://localhost:5000/admin/leave-history/export', {

            withCredentials: true,
            responseType: 'blob'
        })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `leave-history-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
            })
            .catch(console.error);
    };
    useEffect(() => {

        fetchHistory();
        fetchUsers();
    }, []);
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
                            <option value="">All Employees</option>
                            {users.filter((user)=> user.role === "FACULTY").map((user) => (
                                <option key={user.id} value={user.email}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
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
                    <div className="flex w-full items-center">
                        <button
                            onClick={applyFilters}
                            className="w-full px-2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Apply Filters
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
                            Employee
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Approved/Rejected By
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((leave) => (
                        <tr key={leave.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {leave.employeeName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {leave.department}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {leave.leaveType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {new Date(leave.startDate).toLocaleDateString()} -
                                    {new Date(leave.endDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {leave.totalDays} days
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(leave.appliedOn).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {leave.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {leave.approvedBy || '-'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}