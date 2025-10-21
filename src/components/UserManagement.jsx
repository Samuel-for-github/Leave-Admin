// components/UserManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Dropdown from "@/components/UI/Dropdown.jsx";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null); // 'accept' or 'reject'
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'faculty',
        department: '',
        password: ''
    });

    // Filter states
    const [filters, setFilters] = useState({
        role: 'all',
        department: 'all',
        status: 'all'
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Available departments (you can fetch this from API if needed)
    const departments = ['IT', 'CSE', 'ECE'];

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, filters]);

    useEffect(() => {
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [filters, rowsPerPage]);

    const fetchUsers = () => {

        axios.get('http://localhost:5000/admin/users/all', { withCredentials: true })

            .then((res) => {
                console.log(res.data.data);
                setUsers(res.data.data);
            })
            .catch(console.error);
    };

    const applyFilters = () => {
        let filtered = [...users];

        // Filter by role
        if (filters.role !== 'all') {
            filtered = filtered.filter(user => user.role.toLowerCase() === filters.role.toLowerCase());
        }

        // Filter by department
        if (filters.department !== 'all') {
            filtered = filtered.filter(user => user.department === filters.department);
        }

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(user => user.status === filters.status);
        }

        setFilteredUsers(filtered);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(Number(value));
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            role: 'all',
            department: 'all',
            status: 'all'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
axios.put(`http://localhost:5000/admin/users/${editingUser.id}`, formData, { withCredentials: true })

                .then(() => {
                    fetchUsers();
                    resetForm();
                })
                .catch(console.error);
        } else {

            axios.post('http://localhost:5000/admin/users', formData, { withCredentials: true })

                .then(() => {
                    fetchUsers();
                    resetForm();
                })
                .catch(console.error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.username,
            email: user.email,
            role: user.role,
            department: user.department,
            password: ''
        });
        setShowModal(true);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {

            axios.delete(`http://localhost:5000/admin/users/${userId}`, { withCredentials: true })

                .then(() => fetchUsers())
                .catch(console.error);
        }
    };

    const handleAccept = async (userId) => {
        setLoadingUserId(userId);
        setLoadingAction('accept');
        try {

            await axios.put(`http://localhost:5000/admin/users/${userId}/accept`, {}, { withCredentials: true });

            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingUserId(null);
            setLoadingAction(null);
        }
    };


    const handleReject = async (userId) => {
        setLoadingUserId(userId);
        setLoadingAction('reject');
        try {
            await axios.put(`http://localhost:5000/admin/users/${userId}/reject`, {}, { withCredentials: true });

            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingUserId(null);
            setLoadingAction(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'faculty',
            department: '',
            password: ''
        });
        setEditingUser(null);
        setShowModal(false);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
            </div>

            {/* Filters Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-medium text-gray-700">Filters</h2>
                    </div>
                    <button
                        onClick={resetFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        Reset Filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Role Filter */}
                    <div>
                        <Dropdown
                            label="Role"
                            options={[
                                { value: 'all', label: 'All Roles' },
                                { value: 'faculty', label: 'Faculty' },
                                { value: 'hod', label: 'HOD' },
                                { value: 'principal', label: 'Principal' }
                            ]}
                            value={filters.role}
                            onChange={(value) => handleFilterChange('role', value)}
                            placeholder="Select role"
                        />
                    </div>

                    {/* Department Filter */}
                    <div>
                        <Dropdown
                            label="Department"
                            options={[
                                { value: 'all', label: 'All Departments' },
                                ...departments.map(dept => ({ value: dept, label: dept }))
                            ]}
                            value={filters.department}
                            onChange={(value) => handleFilterChange('department', value)}
                            placeholder="Select department"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <Dropdown
                            label="Status"
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'ACCEPTED', label: 'Active' },
                                { value: 'REJECTED', label: 'Rejected' }
                            ]}
                            value={filters.status}
                            onChange={(value) => handleFilterChange('status', value)}
                            placeholder="Select status"
                        />
                    </div>

                    {/* Rows per page */}
                    <div>
                        <Dropdown
                            label="Rows per page"
                            options={[
                                { value: '5', label: '5' },
                                { value: '10', label: '10' },
                                { value: '25', label: '25' },
                                { value: '50', label: '50' },
                                { value: '100', label: '100' }
                            ]}
                            value={String(rowsPerPage)}
                            onChange={handleRowsPerPageChange}
                            placeholder="Select rows"
                        />
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users</span>
                    <span className="text-xs text-gray-500">Total users: {users.length}</span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'principal' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'hod' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                }`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.leave_balance} days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.status === 'PENDING' && <span className="text-yellow-600">Pending</span>}
                                {user.status === 'ACCEPTED' && <span className="text-green-600">Active</span>}
                                {user.status === 'REJECTED' && <span className="text-red-600">Rejected</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">

                                    {user.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleAccept(user.id)}
                                                className={`text-green-600 hover:text-green-900 flex items-center space-x-1 ${
                                                    loadingUserId === user.id &&
                                                    loadingAction === "accept"
                                                        ? "opacity-60 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                {loadingUserId === user.id &&
                                                loadingAction === "accept" ? (
                                                    <span className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"></span>
                                                ) : (
                                                    "Accept"
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleReject(user.id)}
                                                className={`text-red-600 hover:text-red-900 flex items-center space-x-1 ${
                                                    loadingUserId === user.id &&
                                                    loadingAction === "reject"
                                                        ? "opacity-60 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                {loadingUserId === user.id &&
                                                loadingAction === "reject" ? (
                                                    <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></span>
                                                ) : (
                                                    "Reject"
                                                )}
                                            </button>
                                        </>
                                    ) : user.status === 'ACCEPTED' ? (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">Rejected</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {currentUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found matching the selected filters.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                                <span className="font-medium">{filteredUsers.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                {/* Previous button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>

                                {/* Page numbers */}
                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === page
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}

                                {/* Next button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <Dropdown
                                    label="Role"
                                    options={[
                                        { value: 'faculty', label: 'Faculty' },
                                        { value: 'hod', label: 'HOD' },
                                        { value: 'principal', label: 'Principal' }
                                    ]}
                                    value={formData.role}
                                    onChange={(value) => setFormData({ ...formData, role: value })}
                                    placeholder="Select role"
                                />
                            </div>
                            <div>
                                <Dropdown
                                    label="Department"
                                    options={departments.map(dept => ({ value: dept, label: dept }))}
                                    value={formData.department}
                                    onChange={(value) => setFormData({ ...formData, department: value })}
                                    placeholder="Select department"
                                />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required={!editingUser}
                                    />
                                </div>
                            )}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}