import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import DashboardOverview from './components/DashboardOverview';
import LeaveRequests from './components/LeaveRequests';
import UserManagement from './components/UserManagement';
import LeaveHistory from './components/LeaveHistory';
import Reports from './components/Reports';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AdminLoginForm />} />
                <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="leaves" element={<LeaveRequests />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="leave-history" element={<LeaveHistory />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
                <Route path="/" element={<Navigate to="/admin" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
