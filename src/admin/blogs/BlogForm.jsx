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
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="admin-soft-panel sticky top-4 z-30 flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <Link
          to="/admin/blogs"
          className="admin-soft-button-ghost px-4 py-2"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="admin-soft-button-ghost flex-1 sm:flex-none"
          >
            {previewMode ? <FileText size={18} /> : <Eye size={18} />}
            {previewMode ? "Edit Mode" : "Preview"}
          </button>
          <button
            onClick={(e) => handleSubmit(e, "published")}
            className="admin-soft-button flex-1 sm:flex-none"
          >
            <Send size={18} /> {id ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <form className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8" onSubmit={(e) => handleSubmit(e, "draft")}>
          <div className="lg:col-span-2 space-y-6">
            <div className="admin-soft-form space-y-6 p-5 sm:p-8">
              <label className="space-y-2 block">
                <span className="admin-soft-label px-1">Blog Title *</span>
                <input
                  type="text"
                  placeholder="Enter catchy blog title..."
                  className="admin-unstyled-input w-full p-0 text-2xl font-black outline-none ring-0 placeholder:text-slate-300 md:text-3xl"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>
              <label className="space-y-2 block">
                <span className="admin-soft-label px-1">Excerpt</span>
                <textarea
                  placeholder="Write a short excerpt..."
                  className="admin-unstyled-textarea min-h-[120px] w-full resize-none p-0 text-base text-slate-600 outline-none ring-0 dark:text-slate-200"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </label>
              <label className="space-y-2 block">
                <span className="admin-soft-label px-1">Main Content *</span>
                <textarea
                  placeholder="Start writing your story here..."
                  className="admin-unstyled-textarea min-h-[280px] w-full resize-none p-0 text-base leading-relaxed text-slate-600 outline-none ring-0 md:text-lg dark:text-slate-200"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="admin-soft-form space-y-6 p-5 sm:p-6">
              <div>
                <label className="admin-soft-label mb-3 block px-1">
                  Category
                </label>
                <select
                  className="w-full p-3 font-bold text-slate-700 dark:text-slate-100"
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
                <label className="admin-soft-label mb-3 block px-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  className="w-full p-3 text-sm font-bold dark:text-slate-100"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <button className="admin-soft-button w-full">
                Save Draft
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="admin-soft-panel min-h-screen p-6 sm:p-10 lg:p-12">
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
