import { useState, type ReactNode } from "react";
import {
  Store,
  Bell,
  CreditCard,
  ShieldCheck,
  Globe,
  Trash2,
  Save,
  Undo2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const Switch = ({ checked, onCheckedChange, className }: { checked?: boolean; onCheckedChange?: (v: boolean) => void; className?: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-input"} ${className}`}
  >
    <span
      className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
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

const SettingsSection = ({ title, desc, children, icon }: { title: string; desc?: string; children: ReactNode; icon?: ReactNode }) => (
  <div className="glass rounded-[3rem] border-white/20 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 md:p-10 border-b border-white/5 bg-white/5 flex items-center gap-6">
      <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
        {icon || <Settings className="size-7" />}
      </div>
      <div>
        <h2 className="text-xl font-black text-foreground uppercase tracking-widest">{title}</h2>
        {desc && <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{desc}</p>}
      </div>
    </div>
    <div className="p-8 md:p-10 space-y-2">{children}</div>
  </div>
);

const FormField = ({ label, desc, children }: { label: string; desc?: string; children: ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between py-8 first:pt-0 last:pb-0 border-b border-white/5 last:border-0 gap-8 group">
    <div className="max-w-md">
      <p className="text-sm font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{label}</p>
      {desc && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 leading-relaxed">{desc}</p>}
    </div>
    <div className="w-full md:w-80 shrink-0">{children}</div>
  </div>
);

export const SettingsPage = () => {
  const [tab, setTab] = useState<SettingsTab>("store");
  const [notifs, setNotifs] = useState<NotifState>({
    newOrder: true, lowStock: true, returns: false, marketing: false, weeklyReport: true,
  });

  const tabs: { id: SettingsTab; label: string; icon: ReactNode }[] = [
    { id: "store", label: "Cửa hàng", icon: <Store className="size-4" /> },
    { id: "notif", label: "Thông báo", icon: <Bell className="size-4" /> },
    { id: "payment", label: "Thanh toán", icon: <CreditCard className="size-4" /> },
    { id: "account", label: "Tài khoản", icon: <ShieldCheck className="size-4" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-primary/20">
            <Settings className="size-3 fill-current" /> Cấu hình hệ thống
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight uppercase leading-none">Thiết lập <span className="text-primary italic">Cửa hàng</span></h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Quản lý cấu hình và bảo mật vận hành</p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === t.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl space-y-10">

        {tab === "store" && (
          <>
            <SettingsSection title="Thông tin Cửa hàng" desc="Cấu hình nhận diện thương hiệu cơ bản" icon={<Store className="size-7" />}>
              <FormField label="Tên cửa hàng" desc="Hiển thị trên hóa đơn và trang chủ">
                <Input defaultValue="Libraria Bookstore" className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 font-bold" />
              </FormField>
              <FormField label="Email liên hệ" desc="Sử dụng cho thông báo đơn hàng và hỗ trợ">
                <Input defaultValue="admin@libraria.vn" type="email" className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 font-bold" />
              </FormField>
              <FormField label="Mô tả cửa hàng" desc="Giới thiệu ngắn gọn về thương hiệu">
                <textarea
                  defaultValue="Curated books for curious minds. Free shipping on orders over $30."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px] transition-all"
                />
              </FormField>
            </SettingsSection>

            <SettingsSection title="Vùng & Tiền tệ" desc="Tùy chỉnh ngôn ngữ và định dạng thanh toán" icon={<Globe className="size-7" />}>
              <FormField label="Tiền tệ mặc định" desc="Đơn vị tiền tệ chính cho mọi giao dịch">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                  <option className="bg-background">VND — Vietnamese Dong</option>
                  <option className="bg-background">USD — US Dollar</option>
                </select>
              </FormField>
              <FormField label="Múi giờ hệ thống" desc="Ảnh hưởng đến báo cáo và thời gian đơn hàng">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                  <option className="bg-background">(UTC+7) Ho Chi Minh</option>
                  <option className="bg-background">(UTC+9) Tokyo</option>
                </select>
              </FormField>
            </SettingsSection>
          </>
        )}

        {tab === "notif" && (
          <SettingsSection title="Cấu hình Thông báo" desc="Quản lý các sự kiện gửi thông báo qua Email" icon={<Bell className="size-7" />}>
            {[
              { key: "newOrder", label: "Đơn hàng mới", desc: "Nhận thông báo mỗi khi có đơn hàng mới từ khách" },
              { key: "lowStock", label: "Cảnh báo hết kho", desc: "Thông báo khi sản phẩm còn dưới 10 đơn vị" },
              { key: "returns", label: "Yêu cầu hoàn hàng", desc: "Thông báo về các yêu cầu trả hàng từ khách" },
              { key: "weeklyReport", label: "Báo cáo tuần", desc: "Tổng hợp dữ liệu kinh doanh tự động mỗi tuần" },
            ].map((n) => (
              <FormField key={n.key} label={n.label} desc={n.desc}>
                <div className="flex justify-end">
                  <Switch
                    checked={notifs[n.key as keyof NotifState]}
                    onCheckedChange={(v) => setNotifs({ ...notifs, [n.key]: v })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </FormField>
            ))}
          </SettingsSection>
        )}

        {tab === "payment" && (
          <SettingsSection title="Cổng Thanh toán" desc="Cấu hình các phương thức thanh toán khả dụng" icon={<CreditCard className="size-7" />}>
            {[
              { name: "VNPay", desc: "Ngân hàng nội địa & QR", status: "Active", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "MoMo", desc: "Ví điện tử MoMo", status: "Active", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "Stripe", desc: "Thanh toán Quốc tế (Credit Card)", status: "Inactive", color: "text-muted-foreground", bg: "bg-muted/10" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">{p.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{p.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-xl ${p.bg} ${p.color} text-[9px] font-black uppercase tracking-widest`}>
                    {p.status}
                  </div>
                  <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                    <Settings className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </SettingsSection>
        )}

        {tab === "account" && (
          <>
            <SettingsSection title="Hồ sơ & Bảo mật" desc="Quản lý tài khoản quản trị viên" icon={<ShieldCheck className="size-7" />}>
              <FormField label="Tên hiển thị">
                <Input defaultValue="Admin" className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 font-bold" />
              </FormField>
              <FormField label="Mật khẩu mới" desc="Để trống nếu không muốn thay đổi">
                <Input type="password" placeholder="••••••••••" className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 font-bold" />
              </FormField>
              <FormField label="Xác thực 2 yếu tố (2FA)" desc="Tăng cường bảo mật bằng thiết bị di động">
                <div className="flex justify-end">
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
              </FormField>
            </SettingsSection>

            <div className="glass p-10 rounded-[3rem] border-rose-500/20 bg-rose-500/5 relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-black text-rose-500 uppercase tracking-widest mb-2">Vùng nguy hiểm</h2>
                <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest mb-8">Các hành động này không thể hoàn tác</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-8 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    Xóa toàn bộ dữ liệu
                  </Button>
                  <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-8 bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all">
                    Xóa tài khoản vĩnh viễn
                  </Button>
                </div>
              </div>
              <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                <Trash2 className="size-32 text-rose-500" />
              </div>
            </div>
          </>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4 pt-10 border-t border-white/5">
          <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 px-10 text-muted-foreground hover:bg-white/5 gap-2">
            <Undo2 className="size-4" /> Hoàn tác
          </Button>
          <Button className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 px-10 gap-2 shadow-2xl shadow-primary/30">
            <Save className="size-4" /> Lưu thiết lập
          </Button>
        </div>

      </div>

    </div>
  );
};
