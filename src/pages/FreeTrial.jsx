import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  Globe,
  Smartphone,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
  Building,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";

export default function FreeTrial() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState(["online"]);
  const [businessType, setBusinessType] = useState("starting");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const toggleChannel = (id) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = (e) => {
    e.preventDefault();
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      navigate("/admin");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 border-b border-primary-100/10">
        <div className="max-w-[1344px] mx-auto flex items-center justify-between">
          <DrawcafLogo size="sm" />
          <div className="text-xs text-black-400">
            Already have a store?{" "}
            <Link
              to="/login"
              className="font-bold text-primary-100 underline hover:text-primary-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Multi-Step Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-3xl border border-primary-100/15 shadow-xl max-w-2xl w-full p-6 sm:p-10 space-y-6">
          {/* Progress Indicator */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-black-400 mb-2">
              <span className="text-primary-100 uppercase tracking-wider">
                Step {step} of 3
              </span>
              <span>14-day free trial • No credit card required</span>
            </div>
            <div className="w-full h-1.5 bg-tertiary-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-100 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Channels */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-head font-bold text-black-100">
                  Where would you like to sell?
                </h1>
                <p className="text-xs text-black-400 mt-1">
                  Pick as many as you like. You can add more channels anytime later.
                </p>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                {[
                  {
                    id: "online",
                    icon: Globe,
                    title: "An online store",
                    desc: "Create a fully-branded website with shopping cart & blog",
                  },
                  {
                    id: "pos",
                    icon: Store,
                    title: "In person (Retail POS)",
                    desc: "Sell at physical stores, pop-ups, and trade markets",
                  },
                  {
                    id: "social",
                    icon: Smartphone,
                    title: "Social media feeds",
                    desc: "Tag and sell products on TikTok, Instagram, and Facebook",
                  },
                  {
                    id: "existing",
                    icon: Building,
                    title: "Existing website or blog",
                    desc: "Embed Buy Buttons and checkout widgets on WordPress or Webflow",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isChecked = selectedChannels.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChannel(item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "border-primary-100 bg-primary-100/5 ring-1 ring-primary-100"
                          : "border-primary-100/15 bg-white hover:border-primary-100/30"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-lg ${
                            isChecked
                              ? "bg-primary-100 text-white"
                              : "bg-tertiary-300 text-primary-100"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-head font-bold text-sm text-black-100">
                            {item.title}
                          </h4>
                          <p className="text-black-400 text-xs font-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? "bg-primary-100 border-primary-100 text-white"
                            : "border-black-400/40 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-primary-100 text-white font-head font-bold text-xs uppercase hover:bg-primary-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Next: Store Profile</span>
                  <ArrowRight className="w-4 h-4 text-tertiary-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Store Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-head font-bold text-black-100">
                  What should we call your store?
                </h1>
                <p className="text-xs text-black-400 mt-1">
                  You can change your store name and add a custom domain at any time.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black-100 block mb-1.5">
                    Store or Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Buddies Studio"
                    className="w-full px-4 py-3 bg-tertiary-300/40 border border-primary-100/15 rounded-xl text-sm font-medium text-black-100 focus:outline-none focus:border-primary-100"
                  />
                  <span className="text-[11px] text-black-400 mt-1 block">
                    Your free temporary URL:{" "}
                    <strong className="text-primary-100 font-semibold">
                      {storeName.toLowerCase().replace(/\s+/g, "")}.drawcaf.shop
                    </strong>
                  </span>
                </div>

                <div>
                  <label className="font-bold text-black-100 block mb-2">
                    Current stage of your business
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "starting", label: "Just getting started" },
                      { id: "selling", label: "Already selling elsewhere" },
                      { id: "migrating", label: "Moving from WooCommerce" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setBusinessType(st.id)}
                        className={`p-3 rounded-xl border text-center font-medium transition-all ${
                          businessType === st.id
                            ? "border-primary-100 bg-primary-100/10 text-primary-100 font-bold"
                            : "border-primary-100/15 bg-white text-black-300"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-primary-100/20 text-black-300 hover:text-black-100 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-primary-100 text-white font-head font-bold text-xs uppercase hover:bg-primary-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Next: Create Account</span>
                  <ArrowRight className="w-4 h-4 text-tertiary-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Create Account & Launch */}
          {step === 3 && (
            <form onSubmit={handleFinish} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-head font-bold text-black-100">
                  Create your Drawcaf ID
                </h1>
                <p className="text-xs text-black-400 mt-1">
                  You'll use this email to log in to your store's admin dashboard.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black-100 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-black-100 block mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                  />
                </div>

                <div className="p-4 bg-tertiary-300 rounded-xl border border-primary-100/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your 14-day free trial includes:</span>
                  </div>
                  <ul className="text-[11px] text-black-400 space-y-1 list-disc list-inside">
                    <li>Full access to store themes and page builder</li>
                    <li>Unlimited product uploads and Shop Pay integration</li>
                    <li>No credit card required upfront</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-primary-100/20 text-black-300 hover:text-black-100 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isLaunching}
                  className="px-8 py-3.5 rounded-xl bg-primary-100 text-tertiary-200 font-head font-bold text-xs uppercase hover:bg-primary-300 transition-all flex items-center gap-2 shadow-md"
                >
                  {isLaunching ? (
                    <span>Provisioning Storefront...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Launch Free Store</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-black-400 border-t border-primary-100/10">
        By continuing, you agree to Drawcaf's Terms of Service and Privacy Policy.
      </footer>
    </div>
  );
}
