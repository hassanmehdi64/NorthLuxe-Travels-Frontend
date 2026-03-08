import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const iconByType = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const api = useMemo(
    () => ({
      success: (title, message) => pushToast({ type: "success", title, message }),
      error: (title, message) => pushToast({ type: "error", title, message }),
      info: (title, message) => pushToast({ type: "info", title, message }),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-6 right-6 z-[200] space-y-3 w-full max-w-sm">
        {toasts.map((toast) => {
          const Icon = iconByType[toast.type] || iconByType.info;
          return (
            <div
              key={toast.id}
              className="bg-[#121920] border border-[#2a3641] text-[#f5f1e8] rounded-2xl shadow-2xl px-4 py-3 animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <div className="flex items-start gap-3">
                <Icon size={18} className="text-[#c8a977] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
                  {toast.message ? (
                    <p className="text-xs text-[#d6d2c8] mt-1 leading-relaxed">{toast.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-[#a7a39a] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
