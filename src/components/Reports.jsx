// components/Reports.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Reports() {
    const [reportData, setReportData] = useState({
        monthlyLeaves: [],
        leaveTypeDistribution: [],
        departmentStats: []
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchReportData();
    }, [selectedYear]);

    const fetchReportData = () => {
        axios.get(`http://localhost:5000/admin/reports?year=${selectedYear}`, { withCredentials: true })
            .then((res) => {
                setReportData(res.data);
            })
            .catch(console.error);
    };

    const monthlyChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Approved Leaves',
                data: reportData.monthlyLeaves.map(m => m.approved),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            },
            {
                label: 'Rejected Leaves',
                data: reportData.monthlyLeaves.map(m => m.rejected),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1
            }
        ]
    };

    const leaveTypePieData = {
        labels: reportData.leaveTypeDistribution.map(lt => lt.type),
        datasets: [
            {
                data: reportData.leaveTypeDistribution.map(lt => lt.count),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(34, 197, 94, 0.5)',
                    'rgba(251, 191, 36, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                    'rgba(139, 92, 246, 0.5)'
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Reports & Analytics</h1>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {[2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Leave Trends */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Leave Trends</h2>
                    <Bar data={monthlyChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false
                            }
                        }
                    }} />
                </div>

                {/* Leave Type Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave Type Distribution</h2>
                    <Pie data={leaveTypePieData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            }
                        }
                    }} />
                </div>

                {/* Department Statistics */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Statistics</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Employees
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Leaves
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Leaves/Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pending Requests
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.departmentStats.map((dept) => (
                                <tr key={dept.department}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {dept.department}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {dept.totalEmployees}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {dept.totalLeaves}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {dept.avgLeavesPerEmployee.toFixed(1)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {dept.pendingRequests}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}