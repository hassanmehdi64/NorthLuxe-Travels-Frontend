import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useUpdateUser } from "../../hooks/useCms";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

const AccountSettings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const updateUser = useUpdateUser();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) return;
    if (!passwords.newPassword || passwords.newPassword.length < 8) {
      toast.error("Weak password", "New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Password mismatch", "Confirm password must match the new password.");
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: user.id,
        password: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated", "Your account password has been changed.");
    } catch (error) {
      toast.error("Update failed", getApiErrorMessage(error, "Could not update password."));
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-500">
      <form onSubmit={handleSubmit} className="admin-soft-panel space-y-6 p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-[rgba(var(--c-brand-rgb),0.1)] text-[var(--c-brand)]">
            <Lock size={18} />
          </div>
          <div>
            <h3 className="admin-section-title text-[1.02rem]">Security Credentials</h3>
            <p className="admin-soft-muted mt-1 text-sm">
              Keep your admin account protected with a strong password.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full p-4 font-bold"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
            className="w-full p-4 font-bold"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full p-4 font-bold"
          />
        </div>

        <div className="rounded-2xl border border-white/35 bg-white/45 p-4">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <ShieldCheck size={18} className="mt-0.5 text-[var(--c-brand)]" />
            <p>
              The current password field is shown for clarity, but this admin flow currently updates the password directly through the secure account session.
            </p>
          </div>
        </div>

        <button className="admin-soft-button w-full py-3">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
