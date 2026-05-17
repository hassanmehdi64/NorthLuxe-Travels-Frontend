import React, { useEffect, useState } from "react";
import { Camera, Search, UserPlus, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import UserCard from "./UserCard";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";
import { validateImageFile } from "../utils/fileValidation";
import { buildDefaultAvatar } from "../utils/userAvatar";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Editor",
  status: "Active",
  password: "",
  confirmPassword: "",
  avatar: "",
};

const UserList = () => {
  const { user: me } = useAuth();
  const toast = useToast();
  const { data: users = [] } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

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

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "Active",
      password: "",
      confirmPassword: "",
      avatar: user.avatar || "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData(EMPTY_FORM);
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
      setFormData((prev) => ({ ...prev, avatar: dataUrl }));
    } catch {
      toast.error("Upload failed", "Avatar could not be loaded.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Missing fields", "Name and email are required.");
      return;
    }

    if (!editingUser && formData.password.length < 8) {
      toast.error("Weak password", "Password must be at least 8 characters.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", "Confirm password must match.");
      return;
    }

    try {
      if (editingUser) {
        const payload = {
          id: editingUser.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
          avatar: formData.avatar || buildDefaultAvatar(formData.name.trim()),
        };

        if (formData.password) payload.password = formData.password;

        await updateUser.mutateAsync(payload);
        toast.success("Member updated", "Credentials and permissions saved.");
      } else {
        await createUser.mutateAsync({
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
          password: formData.password,
          avatar: formData.avatar || buildDefaultAvatar(formData.name.trim()),
        });
        toast.success("Member added", "New team account created.");
      }

      closeForm();
    } catch (error) {
      toast.error("Save failed", getApiErrorMessage(error, "Could not save member."));
    }
  };

  const toggleStatus = (id) => {
    if (String(me?.id) === String(id)) {
      toast.info("Action blocked", "You cannot suspend your own account.");
      return;
    }
    const user = users.find((u) => u.id === id);
    if (!user) return;
    updateUser.mutate(
      {
        id,
        status: user.status === "Active" ? "Suspended" : "Active",
      },
      {
        onError: (error) =>
          toast.error("Status update failed", getApiErrorMessage(error, "Please try again.")),
      },
    );
  };

  const deleteUser = (id) => {
    if (String(me?.id) === String(id)) {
      toast.info("Action blocked", "You cannot delete your own account.");
      return;
    }
    toast.confirm(
      "Remove Member?",
      "This will permanently remove this team account.",
      () =>
        deleteUserMutation.mutate(id, {
          onSuccess: () => toast.success("Deleted", "User has been deleted."),
          onError: (error) =>
            toast.error("Delete failed", getApiErrorMessage(error, "Please try again.")),
        }),
      {
        confirmLabel: "Remove",
        tone: "danger",
      },
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      [u.name, u.email, u.role, u.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="admin-page-title">
            Team Management
          </h1>
          <p className="admin-page-subtitle">
            Manage permissions, profile images, and team access.
          </p>
        </div>
        <button
          onClick={() => {
            if (isFormOpen && !editingUser) {
              closeForm();
              return;
            }
            openCreateForm();
          }}
          className="admin-soft-button w-full sm:w-auto"
        >
          <UserPlus size={18} /> {isFormOpen && !editingUser ? "Close Form" : "Invite Member"}
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search name, email, role, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 text-sm font-medium"
        />
      </div>

      {isFormOpen ? (
        <div className="admin-soft-form w-full p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="admin-section-title text-[1.08rem]">
              {editingUser ? "Edit Member" : "Invite Member"}
            </h2>
            <button type="button" onClick={closeForm} className="admin-soft-icon-button">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Profile Picture
              </label>
              <div className="flex flex-col gap-4 rounded-[1.3rem] border border-white/35 bg-white/55 p-4 sm:flex-row sm:items-center">
                <img
                  src={formData.avatar || buildDefaultAvatar(formData.name || "North Luxe")}
                  alt={formData.name || "Profile Preview"}
                  className="h-18 w-18 rounded-[1.25rem] object-cover shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                />
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <label className="admin-soft-button-ghost inline-flex cursor-pointer items-center gap-2 px-4 py-3">
                    <Camera size={15} />
                    Upload Picture
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                    className="admin-soft-button-ghost px-4 py-3"
                  >
                    Remove Picture
                  </button>
                  <p className="text-xs text-slate-500">
                    Square images work best for admin profiles.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Full Name
              </label>
              <input
                required
                className="w-full p-4 font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full p-4 font-bold"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Role
              </label>
              <select
                className="w-full p-4 font-bold"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Status
              </label>
              <select
                className="w-full p-4 font-bold"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                {editingUser ? "New Password (optional)" : "Password"}
              </label>
              <input
                type="password"
                className="w-full p-4 font-bold"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? "Leave empty to keep current password" : "Min 8 characters"}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-4 font-bold"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
              />
            </div>
            {editingUser && String(me?.id) === String(editingUser.id) ? (
              <p className="md:col-span-2 text-xs text-slate-500">
                You can update your name, email, avatar, and password. Role/status changes for your own account are restricted.
              </p>
            ) : null}
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button className="admin-soft-button px-6 py-3">
                {editingUser ? "Save Changes" : "Create Team Account"}
              </button>
              <button type="button" onClick={closeForm} className="admin-soft-button-ghost px-6 py-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onToggleStatus={toggleStatus}
            onDelete={deleteUser}
            disableDangerActions={String(me?.id) === String(user.id)}
            onEdit={() => openEditForm(user)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
