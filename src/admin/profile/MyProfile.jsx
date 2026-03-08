import React from "react";
import { Camera, User, Mail, MapPin } from "lucide-react";

const MyProfile = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
            <img
              src="https://i.pravatar.cc/150?u=hassan"
              alt="profile"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-slate-900 transition-all">
            <Camera size={18} />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  defaultValue="Hassan Mehdi"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  defaultValue="hassan@travelpak.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
