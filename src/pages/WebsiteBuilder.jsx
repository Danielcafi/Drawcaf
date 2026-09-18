import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Layout,
  Palette,
  Smartphone,
  Monitor,
  Sparkles,
  Save,
  CheckCircle2,
  Eye,
  ArrowRight,
  ShoppingBag,
  Plus,
  MoveVertical,
  Check,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";

export default function WebsiteBuilder() {
  const [deviceView, setDeviceView] = useState("desktop");
  const [accentColor, setAccentColor] = useState("#1E3A8B");
  const [storeName, setStoreName] = useState("Buddies Studio");
  const [savedToast, setSavedToast] = useState(false);

  const [sections, setSections] = useState({
    announcement: true,
    hero: true,
    bestsellers: true,
    reviews: true,
    newsletter: true,
  });

  const colorPalettes = [
    { name: "Drawcaf Navy", value: "#1E3A8B" },
    { name: "Emerald Forest", value: "#008060" },
    { name: "Nordic Terracotta", value: "#C25E3B" },
    { name: "Midnight Charcoal", value: "#1F2937" },
  ];

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-tertiary-300/95 backdrop-blur-md border-b border-primary-100/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/">
              <DrawcafLogo size="sm" />
            </Link>
            <div className="h-4 w-px bg-primary-100/20 hidden sm:block"></div>
            <span className="font-head font-bold text-sm text-primary-100 hidden sm:inline">
              Storefront Theme Studio
            </span>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-primary-100/15">
            <button
              onClick={() => setDeviceView("desktop")}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deviceView === "desktop"
                  ? "bg-primary-100 text-white shadow-xs"
                  : "text-black-400 hover:text-black-100"
              }`}
              aria-label="Desktop view"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deviceView === "mobile"
                  ? "bg-primary-100 text-white shadow-xs"
                  : "text-black-400 hover:text-black-100"
              }`}
              aria-label="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-xs font-bold text-primary-100 bg-white border border-primary-100/20 px-3.5 py-2 rounded-lg hover:bg-primary-100 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Preview</span>
            </Link>
            <button
              onClick={handleSave}
              className="text-xs font-bold bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-300 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-tertiary-200" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Save Notification Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Theme customizations saved & deployed to edge CDN!</span>
        </div>
      )}

      {/* Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1500px] w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar Controls */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-5">
          {/* Brand & Palette */}
          <div className="bg-white rounded-2xl border border-primary-100/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-100">
              <Palette className="w-4 h-4" />
              <span>Brand Styling</span>
            </div>

            <div>
              <label className="text-xs font-bold text-black-100 block mb-1.5">
                Store Title
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-tertiary-300/40 border border-primary-100/15 rounded-lg focus:outline-none focus:border-primary-100"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-black-100 block mb-2">
                Primary Brand Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorPalettes.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setAccentColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                      accentColor === c.value
                        ? "ring-2 ring-offset-2 ring-primary-100 scale-105"
                        : "opacity-85 hover:opacity-100"
                    }`}
                    title={c.name}
                  >
                    {accentColor === c.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Manager */}
          <div className="bg-white rounded-2xl border border-primary-100/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-100">
                <Layers className="w-4 h-4" />
                <span>Store Sections</span>
              </div>
              <span className="text-[11px] text-black-400 font-medium">
                Drag to sort
              </span>
            </div>

            <div className="space-y-2 text-xs font-medium">
              {[
                { key: "announcement", label: "Top Announcement Bar" },
                { key: "hero", label: "Hero Showcase & CTA" },
                { key: "bestsellers", label: "Best Sellers Collection" },
                { key: "reviews", label: "Verified Reviews Reel" },
                { key: "newsletter", label: "VIP Newsletter Capture" },
              ].map((sec) => (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary-300/40 border border-primary-100/10 hover:border-primary-100/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-black-100">
                    <MoveVertical className="w-3.5 h-3.5 text-black-400 cursor-grab" />
                    <span>{sec.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sections[sec.key]}
                    onChange={() => toggleSection(sec.key)}
                    className="accent-primary-100 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button className="w-full py-2 border border-dashed border-primary-100/30 rounded-lg text-xs font-bold text-primary-100 hover:bg-primary-100/5 transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Section</span>
            </button>
          </div>

          {/* Features Highlights */}
          <div className="p-4 bg-primary-100 text-white rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-tertiary-200">
              <Sparkles className="w-4 h-4" />
              <span>Drawcaf Editions Summer '26</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Every theme built on Drawcaf includes 99+ Google Lighthouse score,
              instant Shop Pay checkout, and zero liquid complexity.
            </p>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="flex-1 bg-black-100/5 rounded-2xl border border-primary-100/15 p-4 sm:p-6 flex items-center justify-center overflow-x-auto min-h-[600px]">
          <div
            className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-primary-100/15 ${
              deviceView === "mobile"
                ? "w-[375px] rounded-[36px] min-h-[680px] ring-8 ring-black-500"
                : "w-full max-w-[960px] rounded-xl min-h-[650px]"
            }`}
          >
            {/* Announcement bar */}
            {sections.announcement && (
              <div
                style={{ backgroundColor: accentColor }}
                className="text-white text-[11px] py-2 px-4 text-center font-medium"
              >
                🎉 Free worldwide delivery on all pottery orders above $120.
              </div>
            )}

            {/* Storefront Mini Header */}
            <div className="px-6 py-4 border-b border-primary-100/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-head font-bold text-base text-black-100">
                <span
                  style={{ color: accentColor }}
                  className="w-2.5 h-2.5 rounded-full"
                >
                  ●
                </span>
                <span>{storeName}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-black-300">
                <span className="hidden sm:inline">Ceramics</span>
                <span className="hidden sm:inline">Lamps</span>
                <div className="flex items-center gap-1 font-bold text-black-100">
                  <ShoppingBag className="w-4 h-4" />
                  <span>2</span>
                </div>
              </div>
            </div>

            {/* Hero Showcase Section */}
            {sections.hero && (
              <div className="p-8 bg-tertiary-300/60 border-b border-primary-100/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-md space-y-3 text-center md:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black-400">
                    Handmade Stoneware
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-head font-bold text-black-100 leading-tight">
                    Timeless objects for contemporary living.
                  </h2>
                  <p className="text-xs text-black-300">
                    Crafted in small batches using local porcelain and tactile matte glazes.
                  </p>
                  <div>
                    <button
                      style={{ backgroundColor: accentColor }}
                      className="px-5 py-2.5 rounded-lg text-white font-head font-bold text-xs shadow-sm hover:opacity-95"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>
                <div className="w-44 h-44 bg-white rounded-2xl border border-primary-100/10 p-3 flex items-center justify-center shadow-md">
                  <img
                    src="/chair.png"
                    alt="Cloud Vase"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Best Sellers Section */}
            {sections.bestsellers && (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-head font-bold text-sm text-black-100">
                    Curated Bestsellers
                  </h3>
                  <span className="text-[11px] font-bold" style={{ color: accentColor }}>
                    Explore all &rarr;
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border border-primary-100/10 bg-tertiary-300/20 text-center">
                    <img
                      src="/chair.png"
                      alt="Product"
                      className="h-24 mx-auto object-contain mb-2"
                    />
                    <h4 className="font-head font-bold text-xs text-black-100">
                      Cloud Vase
                    </h4>
                    <span className="text-xs font-bold" style={{ color: accentColor }}>
                      $64.00
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-primary-100/10 bg-tertiary-300/20 text-center">
                    <img
                      src="/card-1.png"
                      alt="Product"
                      className="h-24 mx-auto object-contain mb-2"
                    />
                    <h4 className="font-head font-bold text-xs text-black-100">
                      Textured Cup
                    </h4>
                    <span className="text-xs font-bold" style={{ color: accentColor }}>
                      $56.00
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {sections.reviews && (
              <div className="p-6 bg-tertiary-300/40 border-t border-primary-100/10 text-center">
                <div className="flex justify-center gap-1 text-amber-400 text-xs mb-1">
                  ★★★★★
                </div>
                <p className="text-xs italic text-black-300 max-w-md mx-auto">
                  "The most beautiful ceramic finish I've ever owned. Packed perfectly and arrived in 2 days."
                </p>
                <span className="text-[10px] font-bold text-black-100 mt-1 block">
                  — Sarah M., Verified Collector
                </span>
              </div>
            )}

            {/* Newsletter Section */}
            {sections.newsletter && (
              <div className="mt-auto p-6 bg-white border-t border-primary-100/10 text-center space-y-2">
                <h4 className="font-head font-bold text-xs text-black-100">
                  Join our Studio Circle
                </h4>
                <div className="flex max-w-xs mx-auto gap-2">
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="flex-1 text-xs px-3 py-1.5 border border-primary-100/20 rounded-lg"
                  />
                  <button
                    style={{ backgroundColor: accentColor }}
                    className="px-3 py-1.5 text-xs font-bold text-white rounded-lg"
                  >
                    Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
