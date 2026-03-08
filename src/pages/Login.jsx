import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/apiError";

const Login = () => {
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center bg-theme-bg text-muted">Checking session...</div>;
  }

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const to = location.state?.from?.pathname || "/admin";
      navigate(to, { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-theme bg-theme-surface p-8 space-y-5 shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
      >
        <div className="pb-2 border-b border-theme">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-brand)]">Team Access</p>
          <h1 className="text-2xl font-bold text-theme mt-1">Welcome Back</h1>
          <p className="text-sm text-muted mt-1">Sign in with your Admin or Editor credentials.</p>
        </div>

        <label>
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Email</span>
        <input
          type="email"
          required
          placeholder="name@northluxe.com"
          className="mt-2 w-full p-3 rounded-xl border border-theme bg-white text-sm font-semibold text-theme outline-none focus:ring-4 focus:ring-[var(--c-brand)]/20 focus:border-[var(--c-brand)]"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        </label>

        <label>
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Password</span>
        <input
          type="password"
          required
          placeholder="Password"
          className="mt-2 w-full p-3 rounded-xl border border-theme bg-white text-sm font-semibold text-theme outline-none focus:ring-4 focus:ring-[var(--c-brand)]/20 focus:border-[var(--c-brand)]"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        </label>

        {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.14em] bg-[var(--c-brand)] text-slate-900 hover:brightness-95 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
