import React, { useState, useEffect } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowLeft, Chrome, Facebook, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/contexts/AuthContext';
import { validateField } from '@/utils/validation';
import type { LoginRequest } from '@/types/Account';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse
            });
        }
    }, []);

    const handleGoogleResponse = async (response: any) => {
        setLoading(true);
        try {
            const res = await authApi.googleLogin(response.credential);
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            await getCurrentUser();
            navigate('/');
        } catch (err: any) {
            setError("Đăng nhập Google thất bại");
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Final validation before submit
            const emailError = validateField('email', formData.email);
            const passwordError = validateField('password', formData.password);

            if (emailError || passwordError) {
                setFieldErrors({
                    email: emailError,
                    password: passwordError
                });
                setLoading(false);
                return;
            }

            const loginRequest: LoginRequest = {
                email: formData.email,
                password: formData.password
            };

            const response = await authApi.login(loginRequest);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            await getCurrentUser();
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B] font-['Plus_Jakarta_Sans']">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 bg-[#0A0A0B]">
                <img 
                    src="/auth-bg.png" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-60 scale-105 animate-in zoom-in duration-[30s] repeat-infinite alternate"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            </div>

            {/* Content Container */}
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center z-10">
                
                {/* Left Side: Branding & Info */}
                <div className="hidden lg:flex flex-col text-white p-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-16 group">
                        <div className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-transform duration-500">
                            <BookOpen className="size-8 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter uppercase italic">Bookly</span>
                    </Link>

                    <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                        Kiến thức là <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">sức mạnh vô tận.</span>
                    </h1>
                    
                    <div className="space-y-6 max-w-md">
                        <p className="text-xl text-white/60 font-medium leading-relaxed">
                            Chào mừng bạn đến với thư viện số hiện đại nhất. Đăng nhập để truy cập hàng ngàn đầu sách độc quyền.
                        </p>
                        
                        <div className="flex flex-col gap-4 pt-4">
                            {[
                                { icon: ShieldCheck, text: "Bảo mật thông tin tuyệt đối" },
                                { icon: BookOpen, text: "Hơn 50,000+ đầu sách đa dạng" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/80 font-bold">
                                    <div className="size-6 rounded-full bg-white/10 flex items-center justify-center">
                                        <item.icon className="size-3.5 text-primary" />
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Card */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="text-center mb-10 lg:hidden">
                            <Link to="/" className="inline-flex items-center gap-2 mb-6">
                                <BookOpen className="size-6 text-primary" />
                                <span className="text-xl font-black uppercase tracking-tighter italic">Bookly</span>
                            </Link>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Đăng nhập</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">Vui lòng nhập thông tin của bạn</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
                                <p className="text-sm text-red-500 font-black text-center">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email của bạn</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="alex@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full h-14 bg-white/50 dark:bg-black/20 border-2 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-black/40 focus:ring-8 transition-all outline-none ${
                                            fieldErrors.email 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/5' 
                                            : 'border-slate-100 dark:border-white/5 focus:border-primary focus:ring-primary/5'
                                        }`}
                                        required
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                                    <Link to="/forgot-password" size="sm" className="text-xs font-black text-primary hover:underline underline-offset-4">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full h-14 bg-white/50 dark:bg-black/20 border-2 rounded-2xl pl-12 pr-12 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-black/40 focus:ring-8 transition-all outline-none ${
                                            fieldErrors.password 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/5' 
                                            : 'border-slate-100 dark:border-white/5 focus:border-primary focus:ring-primary/5'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Đang xác thực...</span>
                                    </div>
                                ) : 'Bắt đầu ngay'}
                            </Button>
                        </form>

                        <div className="my-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-transparent text-xs font-black text-slate-400 uppercase tracking-tighter">Hoặc đăng nhập qua</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => window.google?.accounts.id.prompt()}
                                className="flex items-center justify-center gap-3 h-14 bg-white/50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 rounded-2xl font-black text-slate-700 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Chrome className="size-5 text-blue-500" />
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 h-14 bg-white/50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 rounded-2xl font-black text-slate-700 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Facebook className="size-5 text-blue-600" />
                                <span>Facebook</span>
                            </button>
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 dark:text-slate-400 font-bold">
                                Bạn chưa có tài khoản?{' '}
                                <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">
                                    Đăng ký
                                </Link>
                            </p>
                            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white font-black mt-8 transition-colors text-sm uppercase tracking-widest">
                                <ArrowLeft className="size-4" />
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;