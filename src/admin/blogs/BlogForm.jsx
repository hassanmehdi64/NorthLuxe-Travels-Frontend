import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, FileText, Send } from "lucide-react";
import { useAdminBlog, useCreateBlog, useUpdateBlog } from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const { data: blog } = useAdminBlog(id);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [formData, setFormData] = useState({
    title: "",
    category: "Travel Guide",
    excerpt: "",
    content: "",
    image: "",
    status: "draft",
  });

  useEffect(() => {
    if (!blog) return;
    setFormData({
      title: blog.title || "",
      category: blog.category || "Travel Guide",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image: blog.image || "",
      status: blog.status || "draft",
    });
  }, [blog]);

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    const payload = { ...formData, status };
    try {
      if (id) {
        await updateBlog.mutateAsync({ id, ...payload });
        toast.success(
          "Blog updated",
          status === "published"
            ? "The post is published on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      } else {
        await createBlog.mutateAsync(payload);
        toast.success(
          "Blog created",
          status === "published"
            ? "The post is published on the public site."
            : "Saved as draft. It will not appear publicly until published.",
        );
      }
      navigate("/admin/blogs");
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not save blog."));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 sticky top-4 z-30 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <Link
          to="/admin/blogs"
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors px-2 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm dark:bg-slate-800 dark:text-slate-200"
          >
            {previewMode ? <FileText size={18} /> : <Eye size={18} />}
            {previewMode ? "Edit Mode" : "Preview"}
          </button>
          <button
            onClick={(e) => handleSubmit(e, "published")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-2xl font-bold text-sm"
          >
            <Send size={18} /> {id ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={(e) => handleSubmit(e, "draft")}>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-700">
              <label className="space-y-2 block">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 px-1">Blog Title *</span>
                <input
                  type="text"
                  placeholder="Enter catchy blog title..."
                  className="w-full text-2xl md:text-3xl font-black placeholder:text-slate-300 outline-none border-none focus:ring-0 p-0 dark:bg-transparent dark:text-slate-100"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 px-1">Excerpt</span>
                <textarea
                  placeholder="Write a short excerpt..."
                  className="w-full min-h-[120px] text-base text-slate-600 outline-none border-none focus:ring-0 p-0 resize-none dark:bg-transparent dark:text-slate-200"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 px-1">Main Content *</span>
                <textarea
                  placeholder="Start writing your story here..."
                  className="w-full min-h-[280px] text-lg text-slate-600 leading-relaxed outline-none border-none focus:ring-0 p-0 resize-none dark:bg-transparent dark:text-slate-200"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-700">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block px-1">
                  Category
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none dark:bg-slate-800 dark:text-slate-100"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Travel Guide</option>
                  <option>Photography</option>
                  <option>Luxury Stay</option>
                  <option>Adventure</option>
                  <option>Culture</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block px-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none dark:bg-slate-800 dark:text-slate-100"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <button className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm">
                Save Draft
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm min-h-screen dark:bg-slate-900 dark:border-slate-700">
          <span className="text-secondary font-black uppercase tracking-widest text-xs">
            {formData.category || "Category"}
          </span>
          <h1 className="text-5xl font-black text-slate-900 mt-4 mb-8 leading-tight dark:text-slate-100">
            {formData.title || "Your Title Here"}
          </h1>
          {formData.image && (
            <img src={formData.image} className="w-full h-[450px] object-cover rounded-[2rem] mb-8" alt="Blog" />
          )}
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 whitespace-pre-line mb-8 dark:text-slate-200">
              {formData.excerpt || "No excerpt yet..."}
            </p>
            <p className="text-lg text-slate-600 whitespace-pre-line dark:text-slate-200">
              {formData.content || "No content written yet..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogForm;
