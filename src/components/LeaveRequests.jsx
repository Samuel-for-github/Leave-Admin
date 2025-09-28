// components/LeaveRequests.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, [filter]);

    const fetchLeaves = () => {
        axios.get(`http://localhost:5000/admin/leaves?status=${filter}`, { withCredentials: true })
            .then((res) => {
                setLeaves(res.data);
            })
            .catch(console.error);
    };

    const handleApprove = (leaveId) => {
        axios.put(`http://localhost:5000/admin/leaves/${leaveId}/approve`, {}, { withCredentials: true })
            .then(() => {
                fetchLeaves();
                setShowModal(false);
            })
            .catch(console.error);
    };

    const handleReject = (leaveId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            axios.put(`http://localhost:5000/admin/leaves/${leaveId}/reject`, { reason }, { withCredentials: true })
                .then(() => {
                    fetchLeaves();
                    setShowModal(false);
                })
                .catch(console.error);
        }
    };

    const viewDetails = (leave) => {
        setSelectedLeave(leave);
        setShowModal(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Leave Requests</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6">
                {['pending', 'approved', 'rejected', 'all'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                            filter === status
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Leave Requests Table */}
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
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {leaves.map((leave) => (
                        <tr key={leave.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {leave.employeeName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {leave.employeeRole}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{leave.leaveType}</span>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                        {leave.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => viewDetails(leave)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    {leave.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(leave.id)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <CheckIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(leave.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Leave Details Modal */}
            {showModal && selectedLeave && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Request Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Employee</p>
                                <p className="font-medium">{selectedLeave.employeeName} ({selectedLeave.employeeRole})</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Leave Type</p>
                                <p className="font-medium">{selectedLeave.leaveType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium">
                                    {new Date(selectedLeave.startDate).toLocaleDateString()} -
                                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                                    ({selectedLeave.totalDays} days)
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Reason</p>
                                <p className="font-medium">{selectedLeave.reason}</p>
                            </div>
                            {selectedLeave.status !== 'pending' && (
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium capitalize">{selectedLeave.status}</p>
                                    {selectedLeave.rejectionReason && (
                                        <p className="text-sm text-red-600 mt-1">
                                            Reason: {selectedLeave.rejectionReason}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            {selectedLeave.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedLeave.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedLeave.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}