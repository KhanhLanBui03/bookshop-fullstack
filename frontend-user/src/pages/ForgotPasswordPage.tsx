import React, { useState } from 'react';
import { Mail, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth.api';
import { validateField } from '@/utils/validation';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const emailError = validateField('email', email);
        if (emailError) {
            setFieldError(emailError);
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setMessage('Link đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

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
                    <p className="text-gray-500 font-medium">Khôi phục quyền truy cập</p>
                </div>

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
                    <p className="text-gray-600 mb-8">Nhập email của bạn để nhận link đặt lại mật khẩu.</p>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email của bạn</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className={`w-full h-12 rounded-xl px-4 pl-11 text-base border focus:outline-none focus:ring-2 transition-all ${
                                        fieldError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-600'
                                    }`}
                                    required
                                />
                            </div>
                            {fieldError && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{fieldError}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
