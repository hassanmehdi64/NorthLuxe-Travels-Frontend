import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Eye, FileText, CheckCircle2, Circle, Filter } from "lucide-react";
import { useAdminBlogs, useDeleteBlog, useUpdateBlog } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const BlogList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: blogs = [] } = useAdminBlogs();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("All Posts");

  useEffect(() => {
    const next = searchParams.get("search") || "";
    setSearchQuery((current) => (current === next ? current : next));
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    else params.delete("search");
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, searchParams, setSearchParams]);

  const toggleStatus = (id) => {
    const blog = blogs.find((item) => item.id === id);
    if (!blog) return;
    updateBlog.mutate({ id, status: blog.status === "published" ? "draft" : "published" });
  };

  const handleDelete = (id) => {
    toast.confirm(
      "Delete Post?",
      "This will permanently remove this blog post.",
      () =>
        deleteBlog.mutate(id, {
          onSuccess: () => toast.success("Deleted", "Blog post removed successfully."),
          onError: (error) =>
            toast.error("Delete failed", getApiErrorMessage(error, "Could not delete this post.")),
        }),
      {
        confirmLabel: "Delete",
        tone: "danger",
      },
    );
  };

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          [blog.title, blog.slug, blog.author, blog.excerpt, blog.status]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);
        const matchesStatus =
          statusFilter === "All Posts" || blog.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      }),
    [blogs, searchQuery, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="admin-page-title">
            Blog Management
          </h1>
          <p className="admin-page-subtitle">Create and manage your travel stories.</p>
        </div>
        <Link to="/admin/blogs/new" className="admin-soft-button w-full sm:w-auto">
          <Plus size={18} /> Write New Post
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search title, author, slug, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/35 bg-white/50 px-4 py-1 shadow-[0_16px_34px_rgba(148,163,184,0.08)] backdrop-blur-xl">
          <Filter size={16} className="text-[var(--admin-muted)]" />
          <select
            className="cursor-pointer bg-transparent py-2 text-sm font-bold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Posts</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      <div className="admin-soft-table overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/35">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Post Title
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/25">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="group">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-xl bg-white/75 p-2 text-[var(--admin-muted)] transition-all group-hover:bg-[var(--admin-accent)] group-hover:text-white">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="admin-soft-heading font-bold leading-tight">
                            {blog.title}
                            {blog.featured && (
                              <span className="admin-soft-badge admin-soft-badge-primary ml-2 italic">
                                Featured
                              </span>
                            )}
                          </p>
                          <p className="admin-soft-muted mt-1 text-xs">
                            by {blog.author} • {blog.views} views
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleStatus(blog.id)}
                        className={`admin-soft-badge ${
                          blog.status === "published"
                            ? "admin-soft-badge-success"
                            : "admin-soft-badge-muted"
                        }`}
                      >
                        {blog.status === "published" ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        {blog.status}
                      </button>
                    </td>
                    <td className="admin-soft-muted px-6 py-5 text-sm font-bold">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                          className="admin-soft-icon-button"
                          data-tone="view"
                        >
                          <Eye size={18} />
                        </button>
                        <Link to={`/admin/blogs/edit/${blog.id}`} className="admin-soft-icon-button" data-tone="edit">
                          <Edit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(blog.id)} className="admin-soft-icon-button" data-tone="danger">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="admin-soft-muted px-6 py-10 text-center text-sm font-bold">
                    No posts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
