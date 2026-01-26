import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginRequest } from '@/types/Account';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAuth();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.email || !formData.password) {
                setError('Vui lòng nhập email và mật khẩu');
                setLoading(false);
                return;
            }

            const loginRequest: LoginRequest = {
                email: formData.email,
                password: formData.password
            };

            const response = await authApi.login(loginRequest);
            
            // Lưu tokens vào localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            // Cập nhật AuthContext
            await getCurrentUser();

            // Chuyển hướng đến trang chủ
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-600 flex relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600"></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* 3D Book elements */}
                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        top: `${20 + mousePosition.y * 0.02}px`,
                        left: `${10 + mousePosition.x * 0.02}px`,
                    }}
                >
                    <div className="relative">
                        <div className="w-32 h-40 bg-white opacity-5 rounded-lg transform -rotate-12 shadow-2xl"></div>
                        <div className="absolute top-2 left-2 w-32 h-40 bg-white opacity-10 rounded-lg transform -rotate-6 shadow-2xl"></div>
                    </div>
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        bottom: `${15 + mousePosition.y * 0.015}px`,
                        right: `${15 + mousePosition.x * 0.015}px`,
                    }}
                >
                    <div className="relative">
                        <div className="w-40 h-48 bg-white opacity-5 rounded-lg transform rotate-12 shadow-2xl"></div>
                        <div className="absolute top-2 right-2 w-40 h-48 bg-white opacity-10 rounded-lg transform rotate-6 shadow-2xl"></div>
                    </div>
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        top: `${50 + mousePosition.y * 0.01}%`,
                        right: `${10 + mousePosition.x * 0.01}px`,
                    }}
                >
                    <BookOpen className="w-24 h-24 text-white opacity-5" />
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        bottom: `${30 + mousePosition.y * 0.012}%`,
                        left: `${15 + mousePosition.x * 0.012}px`,
                    }}
                >
                    <Book className="w-20 h-20 text-white opacity-5" />
                </div>

                {/* Animated particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>

            {/* Header Logo */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center z-10">
                <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">BookStore</h1>
                </div>
                <p className="text-blue-100 text-lg">Nơi tri thức hội tụ</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-xl mx-auto mt-28 z-50 backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl">
                {/* Card Header */}
                <div className="space-y-1 text-center p-6 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
                    <p className="text-gray-600">Chào mừng bạn quay lại 👋</p>
                    <div className="pt-2">
                        <Link to="/register" className="text-sm text-blue-600 hover:underline">
                            Chưa có tài khoản? Đăng ký
                        </Link>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Card Content */}
                <div className="px-6 pb-6">
                    <div className="flex flex-col gap-5">
                        {/* Email */}
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-xl px-4 pl-10 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button className="text-sm text-gray-600 hover:text-blue-600 underline">
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-xl px-4 pl-10 pr-10 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 flex flex-col gap-3">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>

                    <div className="mt-3">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition"
                            >
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <button className="text-sm text-gray-600 hover:text-blue-600 underline mt-2">
                        <Link to="/">← Quay về trang chủ</Link>
                    </button>
                </div>

                <div className="pb-6 text-center text-sm text-gray-500">
                    © 2026 BookStore. Tất cả quyền được bảo lưu.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;