import React, { useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import { useUpdateUser } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";
import { validateImageFile } from "../utils/fileValidation";
import { buildDefaultAvatar, getUserAvatar } from "../utils/userAvatar";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const MyProfile = () => {
  const { user, setUserData } = useAuth();
  const toast = useToast();
  const updateUser = useUpdateUser();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
  }, [user?.name, user?.email, user?.avatar]);

  const formatDate = (value) => {
    if (!value) return "Not available";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Not available";
    return parsed.toLocaleString();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      toast.error("Upload failed", validationMessage);
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, avatar: dataUrl }));
    } catch {
      toast.error("Upload failed", "Profile picture could not be loaded.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = user?.id || user?._id;
    if (!userId) return;

    try {
      const updatedUser = await updateUser.mutateAsync({
        id: userId,
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar || buildDefaultAvatar(form.name.trim() || user.name || "North Luxe"),
      });
      setUserData({ ...user, ...updatedUser, id: updatedUser?.id || userId });
      setForm({
        name: updatedUser?.name || form.name.trim(),
        email: updatedUser?.email || form.email.trim(),
        avatar: updatedUser?.avatar || form.avatar || "",
      });
      toast.success("Profile updated", "Your admin profile has been saved.");
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not update your profile."));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="admin-soft-panel p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start gap-4">
            <img
              src={form.avatar || getUserAvatar({ name: form.name || user?.name, avatar: form.avatar })}
              alt={form.name || user?.name || "Profile"}
              className="h-28 w-28 rounded-[1.8rem] object-cover shadow-[0_18px_34px_rgba(15,23,42,0.12)]"
            />
            <div className="flex flex-wrap gap-3">
              <label className="admin-soft-button-ghost inline-flex cursor-pointer items-center gap-2 px-4 py-3">
                <Camera size={15} />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, avatar: "" }))}
                className="admin-soft-button-ghost px-4 py-3"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-white/35 bg-white/45 px-4 py-3">
                <p className="admin-soft-label">Role</p>
                <p className="mt-1 text-sm font-black text-[var(--admin-text)]">{user?.role || "Admin"}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/35 bg-white/45 px-4 py-3">
                <p className="admin-soft-label">Status</p>
                <p className="mt-1 text-sm font-black text-[var(--admin-text)]">{user?.status || "Active"}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/35 bg-white/45 px-4 py-3">
                <p className="admin-soft-label">Last Login</p>
                <p className="mt-1 text-sm font-black text-[var(--admin-text)]">{formatDate(user?.lastLoginAt)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="admin-soft-label px-1">Full Name</label>
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-4 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="admin-soft-label px-1">Email Address</label>
              <div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-4 font-bold"
                />
              </div>
            </div>
            <div className="md:col-span-2 rounded-[1.2rem] border border-white/35 bg-white/45 px-4 py-3">
              <p className="admin-soft-label">Member Since</p>
              <p className="mt-1 text-sm font-black text-[var(--admin-text)]">{formatDate(user?.joined || user?.createdAt)}</p>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button type="submit" className="admin-soft-button px-6 py-3">
                <Save size={16} />
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MyProfile;
