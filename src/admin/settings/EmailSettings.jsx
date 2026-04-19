import { useState } from "react";
import { AlertTriangle, CheckCircle2, Mail, RefreshCw, Send, ServerCog } from "lucide-react";
import {
  useEmailStatus,
  useSendTestEmail,
  useVerifyEmailTransport,
} from "../../hooks/useCms";
import { useToast } from "../../context/ToastContext";

const StatusPill = ({ active, label }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
      active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}
  >
    {active ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
    {label}
  </span>
);

const FieldRow = ({ label, value, ok }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-1 py-3 last:border-b-0">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <span className={`text-right text-sm font-black ${ok ? "text-slate-900" : "text-rose-600"}`}>
      {value}
    </span>
  </div>
);

const EmailSettings = () => {
  const toast = useToast();
  const [recipient, setRecipient] = useState("");
  const { data: status, isLoading, refetch, isFetching } = useEmailStatus();
  const verifyEmail = useVerifyEmailTransport();
  const sendTestEmail = useSendTestEmail();

  const handleVerify = () => {
    verifyEmail.mutate(undefined, {
      onSuccess: () => toast.success("SMTP verified", "Production can connect to the configured mail server."),
      onError: (error) =>
        toast.error("SMTP failed", error?.response?.data?.message || error?.message || "Could not verify SMTP."),
    });
  };

  const handleSendTest = () => {
    sendTestEmail.mutate(
      { to: recipient.trim() || undefined },
      {
        onSuccess: (result) => toast.success("Test email sent", result?.message || "Check the inbox."),
        onError: (error) =>
          toast.error("Test failed", error?.response?.data?.message || error?.message || "Could not send test email."),
      },
    );
  };

  if (isLoading) {
    return <div className="text-slate-500">Loading email setup...</div>;
  }

  const configured = Boolean(status?.configured);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div
        className={`flex flex-col gap-4 rounded-[1.75rem] border px-5 py-5 sm:flex-row sm:items-start sm:justify-between ${
          configured ? "border-emerald-100 bg-emerald-50/70" : "border-amber-100 bg-amber-50/70"
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              configured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            <Mail size={22} />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">SMTP Delivery</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
              {configured ? "Email variables are present" : "Email variables are incomplete"}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Status is read from the running backend environment, so this reflects production after redeploy.
            </p>
          </div>
        </div>
        <StatusPill active={configured} label={configured ? "Configured" : "Missing"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-900">Environment Check</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Secrets stay hidden; only presence is shown.</p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              title="Refresh SMTP status"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>

          <FieldRow label="SMTP_HOST" value={status?.hostSet ? "Set" : "Missing"} ok={status?.hostSet} />
          <FieldRow label="SMTP_PORT" value={status?.port || "Missing"} ok={Boolean(status?.port)} />
          <FieldRow label="SMTP_SECURE" value={String(Boolean(status?.secure))} ok />
          <FieldRow label="SMTP_USER" value={status?.user || "Missing"} ok={status?.userSet} />
          <FieldRow label="SMTP_PASS" value={status?.passSet ? "Set" : "Missing"} ok={status?.passSet} />
          <FieldRow label="EMAIL_FROM" value={status?.from || "Missing"} ok={status?.fromSet} />
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ServerCog size={18} />
            </span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-900">Live Test</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Verify auth, then send a real message.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={verifyEmail.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            <CheckCircle2 size={16} /> {verifyEmail.isPending ? "Verifying..." : "Verify SMTP"}
          </button>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1">Test Recipient</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Leave blank to use admin email"
            />
          </div>

          <button
            type="button"
            onClick={handleSendTest}
            disabled={sendTestEmail.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Send size={16} /> {sendTestEmail.isPending ? "Sending..." : "Send Test Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
