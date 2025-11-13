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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[600px] flex overflow-hidden relative animate-scaleIn">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-6 right-6 z-10 text-white hover:text-gray-200 transition-colors bg-black/30 backdrop-blur-sm rounded-full p-2 hover:bg-black/50"
        >
          <X className="w-6 h-6" />
        </button>

        <div 
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-purple-900/80"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h1 className="text-5xl font-bold mb-4 animate-fadeInUp">
              Welcome
            </h1>
            <p className="text-6xl font-serif italic mb-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              CarRental
            </p>
            <p className="text-lg text-gray-200 leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              Your journey begins here. Discover the perfect car for your next adventure.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <img src={assets.logo} alt="Logo" className="h-16 mx-auto mb-4" />
            </div>

            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              {isSignup ? "Create Account" : "Log In"}
            </h2>
            <p className="text-gray-600 mb-8">
              {isSignup ? "Join us today and start your journey" : "Welcome back! Please enter your details"}
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-lg px-4 py-3 animate-fadeIn">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-6 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded-lg px-4 py-3 animate-fadeIn">
                {message}
              </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              {isSignup && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                    >
                      <option value="renter">Renter</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isSignup ? "Email" : "Username"}
                </label>
                <input
                  type="email"
                  placeholder={isSignup ? "Enter your email" : "Username"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Remember Password</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 underline">
                    Forgot your password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Please wait...
                  </span>
                ) : (
                  isSignup ? "Sign Up" : "Log In"
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6 text-sm">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setMessage("");
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
