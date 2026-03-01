"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { authApi } from "@/api/auth.api"

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 380,
          background: "rgba(30,41,59,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: "0 auto 16px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
            }}
          >
            📚
          </div>

          <h1 style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700 }}>
            Admin Login
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
            Sign in to manage Libraria
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage