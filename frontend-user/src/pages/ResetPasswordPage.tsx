import React, { useState } from 'react';
import { Lock, BookOpen, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth.api';
import { validateField } from '@/utils/validation';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        if (!token) {
            setError('Token không hợp lệ hoặc đã hết hạn.');
            return;
        }

        const passwordError = validateField('password', password);
        const confirmError = validateField('confirmPassword', confirmPassword, { password });

        if (passwordError || confirmError) {
            setFieldErrors({
                password: passwordError,
                confirmPassword: confirmError
            });
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authApi.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4 text-green-500">
                        <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thành công!</h2>
                    <p className="text-gray-600 mb-6">Mật khẩu của bạn đã được thay đổi. Bạn sẽ được chuyển hướng về trang đăng nhập sau vài giây.</p>
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">Đăng nhập ngay</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BookStore</h1>
                    </div>
                    <p className="text-gray-500 font-medium">Đặt lại mật khẩu của bạn</p>
                </div>

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Nhập mật khẩu mới</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full h-12 rounded-xl px-4 pl-11 pr-11 text-base border focus:outline-none focus:ring-2 transition-all ${
                                        fieldErrors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{fieldErrors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full h-12 rounded-xl px-4 pl-11 pr-11 text-base border focus:outline-none focus:ring-2 transition-all ${
                                        fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                                    }`}
                                    required
                                />
                            </div>
                            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{fieldErrors.confirmPassword}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
