import { useState, type ReactNode } from "react";


/* ── Primitives ── */
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
const Toggle = ({ checked, onChange }: ToggleProps) => (
  <div onClick={() => onChange(!checked)} style={{
    width: 40, height: 22, borderRadius: 99, cursor: "pointer",
    background: checked ? "var(--accent)" : "var(--bg3)",
    border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
    position: "relative", transition: "all .2s",
  }}>
    <div style={{
      position: "absolute", top: 2, left: checked ? 18 : 2,
      width: 16, height: 16, borderRadius: "50%", background: "#fff",
      transition: "left .2s cubic-bezier(.22,1,.36,1)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
    }} />
  </div>
);

interface SettingsInputProps { placeholder?: string; defaultValue?: string; type?: string; }
const SettingsInput = ({ placeholder, defaultValue, type = "text" }: SettingsInputProps) => (
  <input type={type} placeholder={placeholder} defaultValue={defaultValue}
    style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "var(--text)" }}
    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
  />
);

interface FormFieldProps { label: string; desc?: string; children: ReactNode; }
const FormField = ({ label, desc, children }: FormFieldProps) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid var(--border)", gap: 24 }}>
    <div style={{ minWidth: 200 }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{label}</p>
      {desc && <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{desc}</p>}
    </div>
    <div style={{ flex: 1, maxWidth: 340 }}>{children}</div>
  </div>
);

interface SettingsSectionProps { title: string; desc?: string; children: ReactNode; }
const SettingsSection = ({ title, desc, children }: SettingsSectionProps) => (
  <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
    <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{title}</h2>
      {desc && <p style={{ fontSize: 12, color: "var(--muted)" }}>{desc}</p>}
    </div>
    <div style={{ padding: "0 24px 6px" }}>{children}</div>
  </div>
);

/* ── Tab IDs ── */
type SettingsTab = "store" | "notif" | "payment" | "account";

interface NotifState {
  newOrder: boolean;
  lowStock: boolean;
  returns: boolean;
  marketing: boolean;
  weeklyReport: boolean;
}

/* ── Page ── */
export const SettingsPage = () => {
  const [tab, setTab]         = useState<SettingsTab>("store");
  const [twoFA, setTwoFA]     = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
  const [notifs, setNotifs]   = useState<NotifState>({
    newOrder: true, lowStock: true, returns: false, marketing: false, weeklyReport: true,
  });

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "store",   label: "Store Info" },
    { id: "notif",   label: "Notifications" },
    { id: "payment", label: "Payment" },
    { id: "account", label: "Account & Security" },
  ];

  return (
    <div className="page-enter">
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 22, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
            background: tab === t.id ? "var(--bg3)" : "transparent",
            color: tab === t.id ? "var(--text)" : "var(--muted2)",
            fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
            transition: "all .15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Store Info ── */}
      {tab === "store" && (
        <>
          <SettingsSection title="Store Details" desc="Basic information about your bookstore.">
            <FormField label="Store Name" desc="Displayed across the storefront and receipts.">
              <SettingsInput defaultValue="Libraria Bookstore" />
            </FormField>
            <FormField label="Store URL" desc="Your public-facing store URL.">
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "9px 12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "9px 0 0 9px", fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>
                  https://
                </span>
                <input defaultValue="libraria.vn" style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderLeft: "none", borderRadius: "0 9px 9px 0", padding: "9px 13px", fontSize: 13, color: "var(--text)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </FormField>
            <FormField label="Contact Email" desc="Used for order notifications and support.">
              <SettingsInput defaultValue="admin@libraria.vn" type="email" />
            </FormField>
            <FormField label="Description">
              <textarea defaultValue="Curated books for curious minds. Free shipping on orders over $30." rows={3}
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "var(--text)", resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </FormField>
          </SettingsSection>

          <SettingsSection title="Regional Settings" desc="Localisation preferences for your store.">
            <FormField label="Currency" desc="Primary currency for all transactions.">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
                {[["USD","USD — US Dollar"], ["VND","VND — Vietnamese Dong"], ["EUR","EUR — Euro"], ["GBP","GBP — British Pound"]].map(([v, l]) => (
                  <option key={v} value={v} style={{ background: "var(--bg2)" }}>{l}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Timezone" desc="Affects order timestamps and reports.">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
                {[["Asia/Ho_Chi_Minh","(UTC+7) Ho Chi Minh"], ["America/New_York","(UTC-5) New York"], ["Europe/London","(UTC+0) London"], ["Asia/Tokyo","(UTC+9) Tokyo"]].map(([v, l]) => (
                  <option key={v} value={v} style={{ background: "var(--bg2)" }}>{l}</option>
                ))}
              </select>
            </FormField>
          </SettingsSection>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--muted2)", fontSize: 13, cursor: "pointer" }}>Discard</button>
            <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 9, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
          </div>
        </>
      )}

      {/* ── Notifications ── */}
      {tab === "notif" && (
        <SettingsSection title="Email Notifications" desc="Choose which events trigger an email to your admin inbox.">
          {([
            { key: "newOrder"     as const, label: "New order placed",       desc: "Get notified whenever a customer places a new order." },
            { key: "lowStock"     as const, label: "Low stock alert",         desc: "Alert when a book's stock drops below 8 units." },
            { key: "returns"      as const, label: "Return requests",         desc: "Notify on customer return or refund requests." },
            { key: "marketing"    as const, label: "Marketing & promotions",  desc: "Updates about new features and promotional tools." },
            { key: "weeklyReport" as const, label: "Weekly summary report",   desc: "Automated weekly digest of sales and analytics." },
          ]).map((n) => (
            <FormField key={n.key} label={n.label} desc={n.desc}>
              <Toggle checked={notifs[n.key]} onChange={(v) => setNotifs((prev) => ({ ...prev, [n.key]: v }))} />
            </FormField>
          ))}
        </SettingsSection>
      )}

      {/* ── Payment ── */}
      {tab === "payment" && (
        <>
          <SettingsSection title="Payment Gateways" desc="Configure how customers pay in your store.">
            {([
              { name: "Stripe", desc: "Cards, Apple Pay, Google Pay", active: true,  logo: "💳" },
              { name: "PayPal", desc: "PayPal balance & bank account", active: true,  logo: "🅿️" },
              { name: "MoMo",   desc: "Vietnam e-wallet",              active: false, logo: "💜" },
              { name: "VNPay",  desc: "Vietnam bank transfer",         active: false, logo: "🏦" },
            ]).map((gw, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid var(--border)" }}>
                    {gw.logo}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{gw.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{gw.desc}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {gw.active && (
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: 99 }}>
                      ● Active
                    </span>
                  )}
                  <button className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg3)", color: "var(--muted2)", fontSize: 12, cursor: "pointer" }}>
                    {gw.active ? "Configure" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </SettingsSection>

          <SettingsSection title="Payout Settings" desc="Where your earnings get transferred.">
            <FormField label="Bank Account" desc="IBAN or local account number for payouts.">
              <SettingsInput placeholder="VN xx xxxx xxxx xxxx xxxx xx" />
            </FormField>
            <FormField label="Payout Schedule" desc="How often funds are transferred to your account.">
              <select style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
                {["Daily", "Weekly", "Monthly"].map((o) => <option key={o} style={{ background: "var(--bg2)" }}>{o}</option>)}
              </select>
            </FormField>
          </SettingsSection>
        </>
      )}

      {/* ── Account & Security ── */}
      {tab === "account" && (
        <>
          <SettingsSection title="Profile" desc="Your personal admin account details.">
            <FormField label="Display Name"><SettingsInput defaultValue="Admin" /></FormField>
            <FormField label="Email Address"><SettingsInput defaultValue="admin@libraria.vn" type="email" /></FormField>
            <FormField label="New Password" desc="Leave blank to keep current password.">
              <SettingsInput placeholder="••••••••••" type="password" />
            </FormField>
          </SettingsSection>

          <SettingsSection title="Security" desc="Keep your admin account safe.">
            <FormField label="Two-Factor Authentication" desc="Require a second device to log in. Strongly recommended.">
              <Toggle checked={twoFA} onChange={setTwoFA} />
            </FormField>
            <FormField label="Active Sessions" desc="Devices currently logged in to your account.">
              <div>
                {[
                  { device: "Chrome · macOS",    location: "Ho Chi Minh City, VN", current: true  },
                  { device: "Safari · iPhone 15", location: "Ho Chi Minh City, VN", current: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg3)", borderRadius: 9, marginBottom: i === 0 ? 8 : 0 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{s.device}</p>
                      <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{s.location}</p>
                    </div>
                    {s.current
                      ? <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: 99 }}>● Current</span>
                      : <button className="btn-ghost" style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--red)", fontSize: 11, cursor: "pointer" }}>Revoke</button>
                    }
                  </div>
                ))}
              </div>
            </FormField>
          </SettingsSection>

          {/* Danger zone */}
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "20px 24px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#fca5a5", marginBottom: 6 }}>Danger Zone</h2>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>These actions are permanent and cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#fca5a5", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                Export All Data
              </button>
              <button style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.12)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Delete Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
