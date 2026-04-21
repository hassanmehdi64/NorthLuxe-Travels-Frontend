import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const iconByType = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

const toastStyleByType = {
  success: {
    iconWrap: "bg-[rgba(45,90,63,0.12)] text-[var(--c-green)] ring-[rgba(45,90,63,0.22)]",
    bar: "bg-[var(--c-brand)]",
  },
  error: {
    iconWrap: "bg-rose-50 text-rose-600 ring-rose-100",
    bar: "bg-rose-500",
  },
  info: {
    iconWrap: "bg-sky-50 text-sky-600 ring-sky-100",
    bar: "bg-sky-500",
  },
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
      <div className="fixed inset-x-3 top-4 z-[200] space-y-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-[22rem]">
        {toasts.map((toast) => {
          const Icon = iconByType[toast.type] || iconByType.info;
          const style = toastStyleByType[toast.type] || toastStyleByType.info;
          return (
            <div
              key={toast.id}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/95 px-4 py-3.5 text-theme shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-5 duration-300"
            >
              <div className={`absolute inset-x-0 bottom-0 h-1 origin-left animate-[toast-progress_3.5s_linear_forwards] ${style.bar}`} />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(198,162,75,0.08),rgba(255,255,255,0)_55%)]" />
              <div className="relative flex items-start gap-3">
                <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${style.iconWrap}`}>
                  <Icon size={18} strokeWidth={2.4} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black tracking-tight text-theme">{toast.title}</p>
                  {toast.message ? (
                    <p className="mt-1 text-[12.5px] leading-5 text-muted">{toast.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-theme-bg hover:text-theme"
                  aria-label="Dismiss notification"
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
