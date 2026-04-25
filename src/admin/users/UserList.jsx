import React, { useState } from "react";
import { UserPlus, Search, X } from "lucide-react";
import UserCard from "./UserCard";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const UserList = () => {
  const { user: me } = useAuth();
  const toast = useToast();
  const { data: users = [] } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New State for handling which user is being edited
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Editor",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  // --- HANDLERS ---

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "Editor",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
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
    });
    setIsFormOpen(true);
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
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
        if (formData.password) payload.password = formData.password;

        await updateUser.mutateAsync(payload);
        toast.success("Member updated", "Credentials and permissions saved.");
      } else {
        await createUser.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          password: formData.password,
          avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(/\s+/g, "+")}&background=C6A24B&color=ffffff`,
        });
        toast.success("Member added", "New team account created.");
      }
      setIsFormOpen(false);
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
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="admin-soft-heading text-xl xl:3xl font-black tracking-tighter uppercase">
        
            Team Management
          </h1>
          <p className="admin-soft-muted text-sm font-medium">
            Manage permissions and team access.
          </p>
        </div>
        <button
          onClick={() => {
            if (isFormOpen && !editingUser) {
              setIsFormOpen(false);
              return;
            }
            openCreateForm();
          }}
          className="admin-soft-button w-full sm:w-auto"
        >
          <UserPlus size={18} /> {isFormOpen && !editingUser ? "Close Form" : "Invite Member"}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" size={18} />
        <input
          type="text"
          placeholder="Search team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pl-12 pr-4 text-sm font-medium"
        />
      </div>

      {isFormOpen ? (
        <div className="admin-soft-form w-full p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="admin-soft-heading text-xl font-black">
              {editingUser ? "Edit Member" : "Invite Member"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingUser(null);
              }}
              className="admin-soft-icon-button"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Full Name
              </label>
              <input
                required
                className="w-full p-4 font-bold"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
                Role
              </label>
              <select
                className="w-full p-4 font-bold"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
              />
            </div>
            {editingUser && String(me?.id) === String(editingUser.id) ? (
              <p className="md:col-span-2 text-xs text-slate-500">
                You can update your name, email, and password. Role/status changes for your own account are restricted.
              </p>
            ) : null}
            <div className="md:col-span-2 flex gap-3">
              <button className="admin-soft-button px-6 py-3">
                {editingUser ? "Save Changes" : "Create Team Account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingUser(null);
                }}
                className="admin-soft-button-ghost px-6 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onToggleStatus={toggleStatus}
            onDelete={deleteUser}
            disableDangerActions={String(me?.id) === String(user.id)}
            onEdit={() => openEditForm(user)} // Pass the edit function
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
