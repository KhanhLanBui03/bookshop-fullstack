"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { authApi } from "@/api/auth.api"
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const LoginPage = () => {
  const navigate = useNavigate()
  const {getCurrentUser} = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authApi.login({ email, password })

      localStorage.setItem("accessToken", res.accessToken)
      localStorage.setItem("refreshToken", res.refreshToken)

      await getCurrentUser()

      navigate("/")
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse duration-1000" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Card */}
        <div className="glass rounded-[3.5rem] border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Sparkle */}
          <Sparkles className="absolute top-10 right-10 size-6 text-primary/20 animate-bounce" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="size-16 bg-gradient-to-br from-primary to-primary-foreground/20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 group hover:scale-110 transition-transform cursor-pointer">
              <BookOpen className="size-8 text-white fill-current" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none mb-3">
              Libraria <span className="text-primary italic">Admin</span>
            </h1>
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <ShieldCheck className="size-3 text-primary" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cổng quản trị bảo mật</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-4">Địa chỉ Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email"
                  required
                  placeholder="admin@libraria.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus-visible:ring-primary/20 font-bold placeholder:text-muted-foreground/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-4">Mật khẩu truy cập</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus-visible:ring-primary/20 font-bold placeholder:text-muted-foreground/30 transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/40 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                      <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                      <>Đăng nhập hệ thống <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/20 to-primary opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-12 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  © 2026 Libraria Management System
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="size-1 rounded-full bg-white/10" />
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-tighter">v4.2.0-stable</p>
                  <div className="size-1 rounded-full bg-white/10" />
              </div>
          </div>

        </div>

        {/* Outer Decor */}
        <div className="mt-8 flex items-center justify-center gap-2">
            <Zap className="size-3 text-primary animate-pulse" />
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Hệ thống đang hoạt động tối ưu</p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage