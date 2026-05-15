import React, { useState, useEffect } from "react";
import { blogApi } from "@/api/blog.api";
import type { BlogResponse } from "@/types/blog.type";
import { 
    PenTool, 
    Plus, 
    Trash2, 
    Edit3, 
    X,
    Image as ImageIcon,
    FileText,
    ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BlogManagementPage = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        thumbnail: "",
        published: true
    });

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await blogApi.getAll(0, 100);
            setBlogs(data.content);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleEdit = (blog: BlogResponse) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            thumbnail: blog.thumbnail,
            published: blog.published
        });
        setShowEditModal(true);
    };

    const handleCreate = () => {
        setEditingBlog(null);
        setFormData({
            title: "",
            summary: "",
            content: "",
            thumbnail: "",
            published: true
        });
        setShowEditModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBlog) {
                await blogApi.update(editingBlog.id, formData);
            } else {
                await blogApi.create(formData);
            }
            setShowEditModal(false);
            fetchBlogs();
        } catch (error) {
            alert("Lưu thất bại: " + error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
            try {
                await blogApi.delete(id);
                fetchBlogs();
            } catch (error) {
                alert("Xóa thất bại");
            }
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <PenTool className="size-8 text-primary" />
                        Quản lý Bài viết
                    </h1>
                    <p className="text-muted-foreground mt-1">Sáng tạo và quản lý nội dung cho blog của bạn.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="size-5" /> Viết bài mới
                </button>
            </div>

            {/* Blogs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-80 bg-muted animate-pulse rounded-3xl"></div>
                    ))
                ) : blogs.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground bg-card border border-dashed border-border rounded-3xl">
                        <FileText className="size-16 mx-auto mb-4 opacity-10" />
                        <p className="font-medium text-lg">Chưa có bài viết nào.</p>
                        <button onClick={handleCreate} className="text-primary font-bold hover:underline mt-2">Bắt đầu viết ngay</button>
                    </div>
                ) : blogs.map(blog => (
                    <div key={blog.id} className="group bg-card border border-border rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative h-48 bg-accent/20">
                            <img 
                                src={blog.thumbnail || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop"} 
                                alt={blog.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${blog.published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {blog.published ? 'Công khai' : 'Nháp'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                            <p className="text-xs text-muted-foreground mb-4">{format(new Date(blog.createdAt), 'dd MMMM, yyyy', { locale: vi })}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{blog.summary}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit3 className="size-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                                <a 
                                    href={`http://localhost:5173/blog/${blog.slug}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Xem trên web <ExternalLink className="size-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative bg-card border border-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-accent/20">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {editingBlog ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
                                {editingBlog ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                            </h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground">Tiêu đề</label>
                                        <input 
                                            type="text" 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Nhập tiêu đề hấp dẫn..."
                                            className="w-full h-12 rounded-xl bg-accent/20 border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground">Tóm tắt</label>
                                        <textarea 
                                            value={formData.summary}
                                            onChange={(e) => setFormData({...formData, summary: e.target.value})}
                                            placeholder="Mô tả ngắn gọn về bài viết..."
                                            className="w-full h-24 rounded-xl bg-accent/20 border border-border p-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground">Nội dung (HTML)</label>
                                        <textarea 
                                            value={formData.content}
                                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                                            placeholder="Nhập nội dung bài viết..."
                                            className="w-full h-96 rounded-xl bg-accent/20 border border-border p-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground">Ảnh đại diện (URL)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.thumbnail}
                                                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                                className="w-full h-12 rounded-xl bg-accent/20 border border-border px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        </div>
                                        {formData.thumbnail && (
                                            <div className="mt-4 rounded-xl overflow-hidden border border-border aspect-video">
                                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-accent/20 rounded-2xl border border-border space-y-4">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="font-bold">Công khai bài viết</span>
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.published}
                                                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </div>
                                        </label>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Trạng thái hiện tại: {formData.published ? 'Published' : 'Draft'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 sticky bottom-0 bg-card py-4 border-t border-border/50">
                                <button 
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 h-12 rounded-xl font-bold text-muted-foreground hover:bg-accent transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                >
                                    {editingBlog ? 'Lưu thay đổi' : 'Đăng bài viết'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagementPage;
