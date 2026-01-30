import React, { useState } from "react";
import { X } from "lucide-react";
import { assets } from "../assets/assets";

const Login = ({ showLogin, setShowLogin, onAuth }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("renter");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  if (!showLogin) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const API_BASE = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
        ? "http://localhost:5000"
        : "";
      const endpoint = `${API_BASE}${isSignup ? "/api/auth/signup" : "/api/auth/login"}`;
      const body = isSignup ? { name, email, password, role } : { email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseSafe = async () => {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          try { return await res.json(); } catch { }
        }
        const text = await res.text();
        try { return text ? JSON.parse(text) : {}; } catch { return { message: text || res.statusText }; }
      };
      const data = await parseSafe();
      if (!res.ok) {
        const msg = (data && data.message) || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      if (data?.token) {
        if (typeof onAuth === "function") onAuth(data.token);
        setMessage(isSignup ? "Account created! You are logged in." : "Login successful!");
        setTimeout(() => setShowLogin(false), 800);
      } else {
        setMessage("Success");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex overflow-hidden relative animate-scaleIn">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-gray-900/90 hover:bg-gray-900 text-white transition-all hover:scale-110 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div 
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/90 to-pink-600/95"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-6">
              <div className="inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                <img src={assets.logo} alt="Logo" className="h-10 brightness-0 invert" />
              </div>
            </div>
            <h1 className="text-5xl font-black mb-4 animate-fadeInUp leading-tight">
              Welcome Back
            </h1>
            <p className="text-xl font-medium mb-8 animate-fadeInUp text-white/90" style={{ animationDelay: "0.1s" }}>
              Your perfect ride is just a login away
            </p>
            <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">✓</div>
                <span className="text-white/90">Browse thousands of vehicles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">✓</div>
                <span className="text-white/90">Secure & instant booking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">✓</div>
                <span className="text-white/90">24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto max-h-[95vh]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-100/40 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 py-8">
            <div className="text-center mb-6 lg:hidden">
              <img src={assets.logo} alt="Logo" className="h-14 mx-auto mb-4" />
            </div>

            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-8 p-1.5 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition-all ${
                  !isSignup 
                    ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition-all ${
                  isSignup 
                    ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-black mb-2 text-gray-900">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              {isSignup ? "Join our community and start your journey" : "Log in to access your account"}
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-xl px-4 py-3.5 animate-fadeIn font-medium">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded-xl px-4 py-3.5 animate-fadeIn font-medium">
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              {isSignup && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">I want to</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input"
                    >
                      <option value="renter">Rent Vehicles</option>
                      <option value="owner">List My Vehicles</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner w-5 h-5"></div>
                    Please wait...
                  </span>
                ) : (
                  isSignup ? "Sign Up" : "Log In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
