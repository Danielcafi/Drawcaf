import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  ShoppingBag,
  Store,
  Share2,
  Smartphone,
  Truck,
  CreditCard,
  ShieldCheck,
  Check,
  ArrowRight,
  Coins,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SellOnline() {
  const [activeChannel, setActiveChannel] = useState("online");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const channels = [
    {
      id: "online",
      title: "Custom Online Store",
      icon: ShoppingBag,
      tagline: "Build a brand that commands attention.",
      description:
        "Drag-and-drop storefront builder with world-class responsive themes, ultra-fast hosting on cloud edge, and high-conversion checkout built in.",
      stats: "2.8x higher mobile conversion than open-source alternatives",
      highlights: [
        "Zero coding required with visual theme editor",
        "High-performance CDN with 99.99% uptime",
        "Shop Pay 1-click accelerated checkout",
        "Full SEO metadata and structured microdata schema",
      ],
      image: "/banner.png",
    },
    {
      id: "pos",
      title: "Point of Sale (POS)",
      icon: Store,
      tagline: "Unify online and in-person retail effortlessly.",
      description:
        "Seamlessly connect your physical pop-up or retail storefront with Drawcaf POS. Unified customer data, synchronized multi-location inventory, and contactless payments.",
      stats: "Real-time stock synchronization across all physical warehouses",
      highlights: [
        "Card reader hardware with zero hidden leasing fees",
        "Unified customer profiles across online and physical store",
        "Click-and-collect and local delivery workflows",
        "Custom staff permissions and shift sales tracking",
      ],
      image: "/chair.png",
    },
    {
      id: "social",
      title: "Social & Creator Channels",
      icon: Share2,
      tagline: "Turn followers into lifelong buyers on any feed.",
      description:
        "Sell directly within TikTok Shop, Instagram Shopping, Facebook, and YouTube. Instant catalog synchronization and live streaming shopping experiences.",
      stats: "+45% GMV uplift from automated social sync",
      highlights: [
        "1-click product sync with Meta Commerce Manager & TikTok",
        "Live shopping tags on videos and Instagram Reels",
        "Influencer affiliate tracking and automatic attribution",
        "Unified orders routed directly to your Drawcaf Admin",
      ],
      image: "/card-1.png",
    },
    {
      id: "international",
      title: "International Markets",
      icon: Globe,
      tagline: "Sell across 175 countries with localized perfection.",
      description:
        "Automatic currency conversion, local payment methods (iDEAL, Klarna, Bancontact), calculated import duties, and localized domain routing.",
      stats: "Automatic tax calculation in 130+ regional tax jurisdictions",
      highlights: [
        "Multi-currency pricing rounded cleanly to local conventions",
        "Automated customs duties & landed cost at checkout",
        "Multi-language translation with automated fallback",
        "Regional shipping rates and localized carrier labels",
      ],
      image: "/card-2.png",
    },
  ];

  const currentChannel =
    channels.find((c) => c.id === activeChannel) || channels[0];

  const currencyRates = {
    USD: { symbol: "$", rate: 1, label: "United States Dollar" },
    EUR: { symbol: "€", rate: 0.92, label: "Eurozone" },
    GBP: { symbol: "£", rate: 0.79, label: "British Pound" },
    JPY: { symbol: "¥", rate: 154, label: "Japanese Yen" },
  };

  const samplePriceUSD = 64.0;
  const currentRate = currencyRates[selectedCurrency];
  const convertedPrice = (samplePriceUSD * currentRate.rate).toFixed(
    selectedCurrency === "JPY" ? 0 : 2
  );

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12 md:py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/10 text-primary-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Omnichannel Commerce Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-head font-bold text-primary-100 leading-tight max-w-4xl">
            Sell everywhere your customers buy.
          </h1>

          <p className="text-lg text-black-300 max-w-2xl mt-5 font-body leading-relaxed">
            One powerful centralized admin to manage your online store, physical
            POS counters, social media channels, and international cross-border sales.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/free-trial"
              className="px-8 py-4 rounded-xl bg-primary-100 text-tertiary-200 font-head font-bold text-sm uppercase hover:bg-primary-300 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              className="px-8 py-4 rounded-xl bg-white border border-primary-100/20 text-primary-100 font-head font-bold text-sm uppercase hover:bg-primary-100 hover:text-white transition-all shadow-xs flex items-center justify-center"
            >
              Explore Live Admin
            </Link>
          </div>
        </section>

        {/* Channel Explorer Tabs */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const isSelected = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-primary-100 text-white border-primary-100 shadow-md scale-102"
                      : "bg-white border-primary-100/10 hover:border-primary-100/30 text-black-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? "bg-white/15 text-tertiary-200"
                          : "bg-primary-100/10 text-primary-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-head font-bold text-sm">{ch.title}</h3>
                    <p
                      className={`text-[11px] mt-1 line-clamp-1 ${
                        isSelected ? "text-white/80" : "text-black-400"
                      }`}
                    >
                      {ch.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Channel Showcase Card */}
          <div className="bg-white rounded-3xl border border-primary-100/15 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary-100/10 text-primary-100">
                <currentChannel.icon className="w-4 h-4" />
                <span>{currentChannel.title}</span>
              </div>

              <h2 className="text-3xl font-head font-bold text-black-100 leading-snug">
                {currentChannel.tagline}
              </h2>

              <p className="text-black-300 text-sm leading-relaxed">
                {currentChannel.description}
              </p>

              <div className="p-4 bg-tertiary-300 rounded-xl border border-primary-100/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-white font-bold text-xs">
                  ROI
                </div>
                <p className="text-xs font-bold text-primary-100">
                  {currentChannel.stats}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {currentChannel.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-medium text-black-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/free-trial"
                  className="inline-flex items-center gap-2 text-xs font-head font-bold uppercase tracking-wider text-primary-100 hover:text-primary-300 transition-colors"
                >
                  <span>Launch this channel with Drawcaf</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Interactive Visual / Preview */}
            <div className="bg-tertiary-300 rounded-2xl border border-primary-100/10 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden shadow-inner">
              {activeChannel === "international" ? (
                <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-primary-100/15 shadow-md space-y-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-primary-100/10 text-primary-100 rounded-2xl">
                      <Coins className="w-8 h-8" />
                    </div>
                  </div>
                  <h4 className="font-head font-bold text-base text-black-100">
                    Dynamic Currency Engine
                  </h4>
                  <p className="text-xs text-black-400">
                    Switch destination currency to simulate automated localized pricing:
                  </p>

                  <div className="flex justify-center gap-2">
                    {Object.keys(currencyRates).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setSelectedCurrency(curr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedCurrency === curr
                            ? "bg-primary-100 text-white shadow-xs"
                            : "bg-tertiary-300 text-black-300 hover:text-black-100"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-tertiary-300/60 rounded-xl border border-primary-100/10">
                    <span className="text-[10px] text-black-400 font-bold uppercase block">
                      Cloud Vase in {currentRate.label}
                    </span>
                    <span className="text-3xl font-head font-bold text-primary-100 mt-1 block">
                      {currentRate.symbol}
                      {convertedPrice}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      ✓ Customs duty & local taxes included
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-sm flex items-center justify-center">
                  <img
                    src={currentChannel.image}
                    alt={currentChannel.title}
                    className="max-h-72 object-contain rounded-xl shadow-lg border border-primary-100/15"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-primary-100/15 shadow-md flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-100" />
                    <span className="text-xs font-bold text-black-100">
                      Sync latency &lt; 200ms
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
