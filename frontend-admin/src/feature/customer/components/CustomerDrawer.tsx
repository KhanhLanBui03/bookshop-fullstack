
import React from "react"
import { glass, mono, fmt, fmtDate, PROVIDER_CFG } from "../customer.config"
import { Avatar, SectionTitle } from "./CustomerAtoms"
import { RoleBadge } from "./CustomerAtoms"
import type { UserAdminResponse } from "../customer.type"

interface Props {
    user: UserAdminResponse
    onClose: () => void
}

export const CustomerDrawer = ({ user, onClose }: Props) => {
    const provider = PROVIDER_CFG[user.authProvider] ?? PROVIDER_CFG.LOCAL

    return (
        <div
            className="cm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                zIndex: 50, display: "flex", justifyContent: "flex-end",
            }}
        >
            <div
                className="cm-drawer"
                style={{
                    width: "min(480px,100vw)", height: "100vh", overflowY: "auto",
                    background: "var(--bg2,#111117)",
                    borderLeft: "1px solid var(--border)",
                    display: "flex", flexDirection: "column",
                }}
            >
                {/* ── Header ── */}
                <div style={{ padding: "22px 24px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <Avatar name={user.fullName} id={user.id} size={52} />
                            <div>
                                <h2 style={{
                                    fontFamily: "var(--font-display,'Fraunces',serif)",
                                    fontSize: 18, fontWeight: 700, marginBottom: 4,
                                }}>
                                    {user.fullName}
                                </h2>
                                <p style={{ ...mono, fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                                    {user.email}
                                </p>
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                    {user.roles.map(r => <RoleBadge key={r} role={r} />)}
                                    <span style={{
                                        ...mono, fontSize: 9, padding: "2px 7px", borderRadius: 99,
                                        background: "rgba(255,255,255,0.06)", color: "var(--muted2)",
                                    }}>
                                        {provider.icon} {provider.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="cm-icon-btn"
                            onClick={onClose}
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid var(--border)",
                                borderRadius: 8, width: 32, height: 32,
                                fontSize: 14, color: "var(--muted2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >✕</button>
                    </div>

                    {/* Mini stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 18 }}>
                        {[
                            { label: "Total Spent", value: fmt(user.totalSpent), color: "var(--accent,#ff6b35)" },
                            { label: "Orders", value: String(user.totalOrder), color: "var(--text)" },
                            { label: "Member Since", value: fmtDate(user.dateJoin), color: "var(--muted2)" },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid var(--border)",
                                borderRadius: 10, padding: "12px 14px",
                            }}>
                                <p style={{
                                    ...mono, fontSize: 9, color: "var(--muted)",
                                    textTransform: "uppercase", letterSpacing: 1, marginBottom: 5,
                                }}>
                                    {s.label}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-display,'Fraunces',serif)",
                                    fontSize: 16, fontWeight: 700, color: s.color,
                                }}>
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

                    {/* Profile info */}
                    <SectionTitle>Profile</SectionTitle>
                    <div style={{ ...glass(), padding: "16px 18px", marginBottom: 20 }}>
                        {[
                            { label: "Customer ID", value: `#${String(user.id).padStart(5, "0")}` },
                            { label: "Full Name", value: user.fullName },
                            { label: "Email", value: user.email },
                            { label: "Phone", value: user.phoneNumber || "—" },
                            { label: "Auth Provider", value: `${provider.icon} ${provider.label}` },
                            { label: "Member Since", value: fmtDate(user.dateJoin) },
                        ].map((row, i, arr) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "10px 0",
                                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <span style={{ fontSize: 12, color: "var(--muted2)" }}>{row.label}</span>
                                <span style={{ ...mono, fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Roles */}
                    <SectionTitle>Roles</SectionTitle>
                    <div style={{ ...glass(), padding: "16px 18px", marginBottom: 20 }}>
                        {user.roles.length === 0 ? (
                            <p style={{ ...mono, fontSize: 12, color: "var(--muted)" }}>No roles assigned</p>
                        ) : (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {user.roles.map(r => <RoleBadge key={r} role={r} />)}
                            </div>
                        )}
                    </div>

                    {/* Order summary */}
                    <SectionTitle>Order Summary</SectionTitle>
                    <div style={{ ...glass(), padding: "16px 18px" }}>
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 0", borderBottom: "1px solid var(--border)",
                        }}>
                            <span style={{ fontSize: 12, color: "var(--muted2)" }}>Total Orders</span>
                            <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                                {user.totalOrder}
                            </span>
                        </div>
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 0 0",
                        }}>
                            <span style={{ fontSize: 12, color: "var(--muted2)" }}>Total Spent</span>
                            <span style={{
                                fontFamily: "var(--font-display,'Fraunces',serif)",
                                fontSize: 20, fontWeight: 700, color: "var(--accent,#ff6b35)",
                            }}>
                                {fmt(user.totalSpent)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}