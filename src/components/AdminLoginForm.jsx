import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Correct import
import { loginAdmin } from '../services/authService';

export default function AdminLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Correct hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginAdmin(email, password);

            console.log('Login successful:', response.data);

            // Redirect to admin dashboard
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-12 rounded-lg shadow-lg w-full max-w-xl"
            >
                <h2 className="text-5xl font-bold text-center mb-8">Admin Login</h2>

                <label className="block mb-6">
                    <span className="text-gray-800 text-lg font-medium">Email</span>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-3 block w-full px-5 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-800 text-lg font-medium">Password</span>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-3 block w-full px-5 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                {error && (
                    <p className="text-red-600 text-base mb-6 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-3 rounded-lg transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
