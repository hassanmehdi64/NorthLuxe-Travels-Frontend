import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const InviteModal = ({ onClose, onInvite }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Editor",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Missing fields", "Please fill all fields.");
      return;
    }
    onInvite(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">
            Invite Team Member
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
              placeholder="e.g. John Doe"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
              placeholder="john@company.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">
              Access Role
            </label>
            <select
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mt-4">
            Send Invitation
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
