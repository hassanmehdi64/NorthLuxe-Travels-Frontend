import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Eye, FileText, CheckCircle2, Circle, Filter } from "lucide-react";
import { useAdminBlogs, useDeleteBlog, useUpdateBlog } from "../../hooks/useCms";

const BlogList = () => {
  const navigate = useNavigate();
  const { data: blogs = [] } = useAdminBlogs();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Posts");

  const toggleStatus = (id) => {
    const blog = blogs.find((item) => item.id === id);
    if (!blog) return;
    updateBlog.mutate({ id, status: blog.status === "published" ? "draft" : "published" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog.mutate(id);
    }
  };

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "All Posts" || blog.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      }),
    [blogs, searchQuery, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className=" text-xl xl:3xl font-black text-slate-900 tracking-tighter uppercase">
            Blog Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">Create and manage your travel stories.</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all w-full sm:w-auto"
        >
          <Plus size={18} /> Write New Post
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-slate-50 transition-all font-medium text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-1">
          <Filter size={16} className="text-slate-400" />
          <select
            className="py-2 bg-transparent font-bold text-slate-600 text-sm outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Posts</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {blog.title}
                            {blog.featured && (
                              <span className="ml-2 text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full uppercase tracking-tighter italic">
                                Featured
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            by {blog.author} • {blog.views} views
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleStatus(blog.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          blog.status === "published"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {blog.status === "published" ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={`/admin/blogs/edit/${blog.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-bold text-sm">
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
