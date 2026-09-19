import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import { FiUser, FiShield, FiLock, FiMail } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  // Mode: "user" or "admin"
  const [loginMode, setLoginMode] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
        loginType: loginMode,
      });

      const user = res.data.user;

      if (!user) {
        alert("Login failed. No user profile returned.");
        setLoading(false);
        return;
      }

      // Store authenticated user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Strict role-based redirect
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">HackMate</h1>
        <p className="text-slate-500 text-base mt-2 font-medium">
          AI-Powered Hackathon Team Formation Platform
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl w-full max-w-md">
        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => {
              setLoginMode("user");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition ${
              loginMode === "user"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiUser size={16} />
            User Login
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode("admin");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition ${
              loginMode === "admin"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FiShield size={16} />
            Admin Login
          </button>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {loginMode === "admin" ? "Administrator Login" : "User Login"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {loginMode === "admin"
              ? "Sign in to access the HackMate administrator portal."
              : "Sign in to access your hackathon teams and workspace."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {loginMode === "admin" ? "Admin Email" : "Email Address"}
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder={loginMode === "admin" ? "admin@hackmate.com" : "user@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {loginMode === "admin" ? "Admin Password" : "Password"}
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition shadow-sm ${
              loading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
            }`}
          >
            {loading
              ? loginMode === "admin"
                ? "Admin Logging in..."
                : "Logging in..."
              : loginMode === "admin"
              ? "Admin Login"
              : "Login"}
          </button>
        </form>

        {/* Footer Registration Link (Shown ONLY for User Login mode) */}
        {loginMode === "user" && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                Register
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;