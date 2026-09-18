import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("owner");
  const [email, setEmail] = useState("danielredoun@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/admin");
    }, 600);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col justify-between">
      {/* Top Simple Header */}
      <header className="px-6 py-4 border-b border-primary-100/10">
        <div className="max-w-[1344px] mx-auto flex items-center justify-between">
          <DrawcafLogo size="sm" />
          <div className="flex items-center gap-3 text-xs">
            <span className="text-black-400 hidden sm:inline">
              New to Drawcaf?
            </span>
            <Link
              to="/free-trial"
              className="font-head font-bold text-primary-100 hover:text-primary-300 underline"
            >
              Start 14-day free trial
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Authentication Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-3xl border border-primary-100/15 shadow-xl max-w-4xl w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-100 bg-primary-100/10 px-2.5 py-1 rounded-full inline-block mb-3">
                Secure Merchant Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-head font-bold text-black-100">
                Log in to your store
              </h1>
              <p className="text-xs text-black-400 mt-1">
                Enter your credentials to manage orders, inventory, and marketing.
              </p>
            </div>

            {/* Role switch */}
            <div className="grid grid-cols-2 p-1 bg-tertiary-300/80 rounded-xl border border-primary-100/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`py-2 rounded-lg transition-all ${
                  role === "owner"
                    ? "bg-primary-100 text-white shadow-xs font-bold"
                    : "text-black-300 hover:text-black-100"
                }`}
              >
                Store Owner
              </button>
              <button
                type="button"
                onClick={() => setRole("staff")}
                className={`py-2 rounded-lg transition-all ${
                  role === "staff"
                    ? "bg-primary-100 text-white shadow-xs font-bold"
                    : "text-black-300 hover:text-black-100"
                }`}
              >
                Staff Member
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-black-100 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@yourstore.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl focus:outline-none focus:border-primary-100 text-black-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-black-100">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-bold text-primary-100 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl focus:outline-none focus:border-primary-100 text-black-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black-400 hover:text-black-100"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-primary-100 w-4 h-4 rounded"
                  />
                  <span className="text-black-300">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary-100 text-white font-head font-bold text-xs uppercase hover:bg-primary-300 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Continue to Admin</span>
                    <ArrowRight className="w-4 h-4 text-tertiary-200" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Badge */}
            <div className="p-3 bg-tertiary-300/60 rounded-xl border border-primary-100/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-primary-100">Live Demo Store:</span>{" "}
                <span className="text-black-300">Deyan Kenarny (Buddies™)</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="text-[11px] font-bold text-primary-100 hover:underline px-2 py-1 bg-white rounded border border-primary-100/15"
              >
                1-Click Demo &rarr;
              </button>
            </div>
          </div>

          {/* Right Promotional Column */}
          <div className="lg:col-span-5 bg-primary-100 text-white p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-tertiary-200 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Bank-grade 256-bit SSL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-head font-bold leading-tight">
                Empowering millions of independent businesses.
              </h2>

              <p className="text-xs text-white/80 leading-relaxed">
                Join creators, artisans, and global enterprise brands generating over $1 Trillion in cumulative sales on Drawcaf.
              </p>
            </div>

            {/* Testimonial preview */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-3">
              <div className="flex gap-1 text-tertiary-200 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-white/90 italic leading-relaxed">
                "Switching our storefront to Drawcaf increased our international conversion rate by 34% within the first month."
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-6 h-6 rounded-full bg-tertiary-200 text-primary-100 font-bold text-[10px] flex items-center justify-center">
                  DK
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    Deyan Kenarny
                  </div>
                  <div className="text-[10px] text-white/70">
                    Founder, Buddies™ Homeware
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-white/60">
              © {new Date().getFullYear()} Drawcaf Inc. All rights reserved.
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-primary-100/15 max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-black-400 hover:text-black-100"
            >
              <X className="w-4 h-4" />
            </button>

            {resetSent ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-head font-bold text-lg text-black-100">
                  Reset Link Sent!
                </h3>
                <p className="text-xs text-black-400">
                  Check your inbox for step-by-step password recovery instructions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-head font-bold text-lg text-black-100">
                    Reset your password
                  </h3>
                  <p className="text-black-400 mt-1">
                    Enter your email and we'll send you a secure verification link.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-black-100 block mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue={email}
                    placeholder="name@store.com"
                    className="w-full px-3 py-2 bg-tertiary-300/50 border border-primary-100/15 rounded-lg focus:outline-none focus:border-primary-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-primary-100 text-white font-bold hover:bg-primary-300 transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="px-6 py-4 text-center text-xs text-black-400 border-t border-primary-100/10">
        Drawcaf Platform • High-performance Commerce • <Link to="/" className="underline hover:text-primary-100">Return to Landing Page</Link>
      </footer>
    </div>
  );
}
