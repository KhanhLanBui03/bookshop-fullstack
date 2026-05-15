import React, { useState } from 'react';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Chrome, Facebook, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/contexts/AuthContext';
import { validateField } from '@/utils/validation';
import type { RegisterRequest } from '@/types/Account';
import { Button } from '@/components/ui/button';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation
        const error = validateField(name, value);
        setErrors((prev: any) => ({ ...prev, [name]: error }));
        setServerError('');
    };

    const validateForm = () => {
        const newErrors: any = {};

        newErrors.name = validateField('name', formData.name);
        newErrors.email = validateField('email', formData.email);
        newErrors.password = validateField('password', formData.password);

        if (!agreeTerms) {
            newErrors.terms = 'Bạn phải đồng ý với điều khoản';
        }

        // Clean up empty error strings
        const finalErrors: any = {};
        Object.keys(newErrors).forEach(key => {
            if (newErrors[key]) finalErrors[key] = newErrors[key];
        });

        setErrors(finalErrors);
        return Object.keys(finalErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const registerRequest: RegisterRequest = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await authApi.register(registerRequest);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            await getCurrentUser();
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setServerError(errorMessage);
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
                        Bắt đầu hành trình <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">tri thức của bạn.</span>
                    </h1>
                    
                    <div className="space-y-6 max-w-md">
                        <p className="text-xl text-white/60 font-medium leading-relaxed">
                            Tham gia cộng đồng yêu sách lớn nhất. Tạo tài khoản để lưu lại những cuốn sách yêu thích và nhận ưu đãi đặc biệt.
                        </p>
                        
                        <div className="flex flex-col gap-4 pt-4">
                            {[
                                { icon: Sparkles, text: "Nhận đề xuất sách cá nhân hóa" },
                                { icon: BookOpen, text: "Truy cập không giới hạn kho tàng tri thức" },
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
                        <div className="text-center mb-8 lg:hidden">
                            <Link to="/" className="inline-flex items-center gap-2 mb-4">
                                <BookOpen className="size-6 text-primary" />
                                <span className="text-xl font-black uppercase tracking-tighter italic">Bookly</span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Đăng ký</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">Tạo tài khoản mới trong vài giây</p>
                        </div>

                        {serverError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
                                <p className="text-sm text-red-500 font-black text-center">{serverError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full h-13 bg-white/50 dark:bg-black/20 border-2 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-black/40 focus:ring-8 transition-all outline-none ${
                                            errors.name ? 'border-red-500 focus:ring-red-500/5' : 'border-slate-100 dark:border-white/5 focus:border-primary focus:ring-primary/5'
                                        }`}
                                    />
                                </div>
                                {errors.name && <p className="text-[10px] text-red-500 font-black ml-1 uppercase tracking-tighter">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full h-13 bg-white/50 dark:bg-black/20 border-2 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-black/40 focus:ring-8 transition-all outline-none ${
                                            errors.email ? 'border-red-500 focus:ring-red-500/5' : 'border-slate-100 dark:border-white/5 focus:border-primary focus:ring-primary/5'
                                        }`}
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 font-black ml-1 uppercase tracking-tighter">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full h-13 bg-white/50 dark:bg-black/20 border-2 rounded-2xl pl-12 pr-12 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-black/40 focus:ring-8 transition-all outline-none ${
                                            errors.password ? 'border-red-500 focus:ring-red-500/5' : 'border-slate-100 dark:border-white/5 focus:border-primary focus:ring-primary/5'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-black ml-1 uppercase tracking-tighter">{errors.password}</p>}
                            </div>

                            {/* Terms */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 ml-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeTerms}
                                        onChange={(e) => {
                                            setAgreeTerms(e.target.checked);
                                            if (errors.terms) {
                                                setErrors((prev: any) => ({ ...prev, terms: '' }));
                                            }
                                        }}
                                        className="size-5 mt-0.5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                    />
                                    <label htmlFor="terms" className="text-[11px] text-slate-500 font-bold leading-relaxed cursor-pointer">
                                        Tôi đồng ý với{' '}
                                        <button type="button" className="text-primary font-black hover:underline">Điều khoản</button>
                                        {' '}và{' '}
                                        <button type="button" className="text-primary font-black hover:underline">Chính sách</button>
                                    </label>
                                </div>
                                {errors.terms && <p className="text-[10px] text-red-500 font-black ml-1 uppercase tracking-tighter">{errors.terms}</p>}
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Đang khởi tạo...</span>
                                    </div>
                                ) : 'Tạo tài khoản ngay'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 dark:text-slate-400 font-bold">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">
                                    Đăng nhập
                                </Link>
                            </p>
                            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white font-black mt-6 transition-colors text-xs uppercase tracking-widest">
                                <ArrowLeft className="size-3.5" />
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;