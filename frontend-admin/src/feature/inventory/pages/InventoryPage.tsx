import React, { useState, useEffect } from "react";
import { inventoryApi } from "@/api/inventory.api";
import { bookApi } from "@/api/book.api";
import { exportApi } from "@/api/export.api";
import type { InventoryLogResponse } from "@/types/inventory.type";
import {
    Plus,
    Minus,
    History,
    Package,
    AlertTriangle,
    Search,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const InventoryPage = () => {
    const [logs, setLogs] = useState<InventoryLogResponse[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Form state
    const [selectedBookId, setSelectedBookId] = useState<number | "">("");
    const [updateAmount, setUpdateAmount] = useState<number>(0);
    const [updateReason, setUpdateReason] = useState("RESTOCK");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsData, booksData] = await Promise.all([
                inventoryApi.getLogs(0, 50),
                bookApi.getAdminBooks({ size: 100 })
            ]);
            setLogs(logsData.content);
            setBooks(booksData.content);
        } catch (error) {
            console.error("Failed to fetch inventory data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBookId) return;

        try {
            await inventoryApi.updateStock(Number(selectedBookId), updateAmount, updateReason);
            setShowUpdateModal(false);
            setSelectedBookId("");
            setUpdateAmount(0);
            fetchData();
        } catch (error) {
            alert("Cập nhật thất bại: " + error);
        }
    };

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'SALE': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'RESTOCK': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'CANCELLED_ORDER': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="size-8 text-primary" />
                        Quản lý kho hàng
                    </h1>
                    <p className="text-muted-foreground mt-1">Theo dõi biến động tồn kho và điều chỉnh số lượng.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={async () => {
                            try { await exportApi.exportInventory(); } catch (e) { alert("Xuất báo cáo thất bại"); }
                        }}
                        className="flex items-center gap-2 border border-border bg-background text-foreground px-6 py-3 rounded-xl font-bold hover:bg-accent transition-all"
                    >
                        Xuất báo cáo
                    </button>
                    <button
                        onClick={() => setShowUpdateModal(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus className="size-5" /> Cập nhật tồn kho
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-muted-foreground font-medium">Tổng đầu sách</p>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Package className="size-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-2">{books.length}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-muted-foreground font-medium">Sắp hết hàng</p>
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                            <AlertTriangle className="size-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-2 text-yellow-600">
                        {books.filter(b => b.stock < 10).length}
                    </p>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-muted-foreground font-medium">Biến động gần đây (24h)</p>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                            <History className="size-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mt-2 text-blue-600">{logs.length}</p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-accent/20">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <History className="size-5" /> Nhật ký kho
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-accent/10 text-muted-foreground text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold">Thời gian</th>
                                <th className="px-6 py-4 font-bold">Sách</th>
                                <th className="px-6 py-4 font-bold">Thay đổi</th>
                                <th className="px-6 py-4 font-bold">Tồn sau cùng</th>
                                <th className="px-6 py-4 font-bold">Lý do</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-12 bg-muted/20"></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                                        Chưa có nhật ký biến động kho.
                                    </td>
                                </tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="hover:bg-accent/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{format(new Date(log.createdAt), 'HH:mm', { locale: vi })}</span>
                                            <span className="text-xs text-muted-foreground">{format(new Date(log.createdAt), 'dd/MM/yyyy', { locale: vi })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-foreground line-clamp-1">{log.bookTitle}</p>
                                        <p className="text-xs text-muted-foreground">ID: #{log.bookId}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-1 font-bold ${log.changeAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {log.changeAmount > 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                            {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lg">
                                        {log.stockAfter}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getReasonColor(log.reason)}`}>
                                            {log.reason}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Stock Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpdateModal(false)}></div>
                    <div className="relative bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="size-6 text-primary" /> Cập nhật tồn kho
                        </h2>
                        <form onSubmit={handleUpdateStock} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Chọn sách</label>
                                <select
                                    value={selectedBookId}
                                    onChange={(e) => setSelectedBookId(Number(e.target.value))}
                                    className="w-full h-12 rounded-xl bg-accent/20 border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                >
                                    <option value="">-- Chọn sách --</option>
                                    {books.map(b => (
                                        <option key={b.id} value={b.id}>{b.title} (Hiện có: {b.stock})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Số lượng thay đổi</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUpdateAmount(prev => prev - 1)}
                                        className="size-12 rounded-xl bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="size-5" />
                                    </button>
                                    <input
                                        type="number"
                                        value={updateAmount}
                                        onChange={(e) => setUpdateAmount(Number(e.target.value))}
                                        className="flex-1 h-12 text-center text-xl font-bold bg-accent/20 border border-border rounded-xl focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setUpdateAmount(prev => prev + 1)}
                                        className="size-12 rounded-xl bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="size-5" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground mt-1">Số âm để trừ kho, số dương để cộng kho.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Lý do</label>
                                <select
                                    value={updateReason}
                                    onChange={(e) => setUpdateReason(e.target.value)}
                                    className="w-full h-12 rounded-xl bg-accent/20 border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                >
                                    <option value="RESTOCK">Nhập hàng (Restock)</option>
                                    <option value="DAMAGE">Hỏng hóc (Damage)</option>
                                    <option value="LOSS">Mất mát (Loss)</option>
                                    <option value="OTHER">Lý do khác</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 h-12 rounded-xl font-bold text-muted-foreground hover:bg-accent transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
