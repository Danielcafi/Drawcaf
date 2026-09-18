import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Package,
  Store,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Solutions() {
  const industries = [
    {
      title: "Direct to Consumer (D2C)",
      icon: TrendingUp,
      tagline: "Build a cult brand with maximum margin control.",
      description:
        "Own your customer relationships from first click to repeat order. Customizable themes, subscription billing, and personalized loyalty programs built to scale.",
      benefits: [
        "Unbranded, ultra-fast 1-click Shop Pay checkout",
        "Automated cross-sell and post-purchase upsell offers",
        "Full access to first-party customer analytics and pixel tracking",
      ],
      stat: "43% higher conversion rate than legacy platforms",
    },
    {
      title: "Omnichannel & Brick-and-Mortar Retail",
      icon: Store,
      tagline: "Unify online store and physical counters in one place.",
      description:
        "Whether you run a single flagship boutique or a multi-location chain, Drawcaf POS keeps your catalogs, customer gift cards, and warehouse stocks in constant sync.",
      benefits: [
        "Plug-and-play card readers with zero hardware setup lock-in",
        "Buy online, pick up in-store (BOPIS) & curbside fulfillment",
        "Real-time low-stock alerts and smart replenishment purchase orders",
      ],
      stat: "Unified multi-location inventory across all registers",
    },
    {
      title: "Wholesale & B2B Commerce",
      icon: Briefcase,
      tagline: "Sell wholesale and direct on a single back-office.",
      description:
        "Say goodbye to messy spreadsheets and manual invoices. Give B2B buyers self-serve wholesale portals with custom tier pricing and net payment terms.",
      benefits: [
        "Custom price lists and volume quantity price breaks per client",
        "Net 15/30/60 automated payment terms & invoicing",
        "Password-protected wholesale catalogs and quick-order sheets",
      ],
      stat: "+35% larger average order values with tiered pricing",
    },
    {
      title: "Creators & Digital Artisans",
      icon: Sparkles,
      tagline: "Monetize your audience on your own terms.",
      description:
        "Sell limited drops, handmade ceramic collections, or digital files directly from your bio link or stream. Automated fulfillment and lightning delivery.",
      benefits: [
        "Direct integration with TikTok Shop, Instagram & YouTube",
        "Automated digital file delivery with instant download security",
        "Pre-order countdowns and flash sale traffic protection",
      ],
      stat: "Instant payout availability for verified creators",
    },
  ];

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12 md:py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/10 text-primary-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Commerce Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-head font-bold text-primary-100 leading-tight max-w-4xl">
            Tailored solutions for every stage of business.
          </h1>

          <p className="text-lg text-black-300 max-w-2xl mt-5 font-body leading-relaxed">
            From first-time makers launching their first collection to global enterprise brands processing millions in GMV.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/free-trial"
              className="px-8 py-4 rounded-xl bg-primary-100 text-tertiary-200 font-head font-bold text-sm uppercase hover:bg-primary-300 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Industry Cards Grid */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-primary-100/10 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-primary-100/10 text-primary-100 rounded-2xl">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-primary-100 bg-tertiary-300 px-3 py-1 rounded-full border border-primary-100/10">
                        {ind.stat}
                      </span>
                    </div>

                    <h2 className="font-head font-bold text-2xl text-black-100">
                      {ind.title}
                    </h2>
                    <p className="font-head font-medium text-sm text-primary-100">
                      {ind.tagline}
                    </p>
                    <p className="text-xs text-black-300 leading-relaxed">
                      {ind.description}
                    </p>

                    <div className="pt-2 space-y-2.5">
                      {ind.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-black-200">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary-100/10 flex items-center justify-between">
                    <Link
                      to="/free-trial"
                      className="text-xs font-head font-bold uppercase tracking-wider text-primary-100 hover:text-primary-300 inline-flex items-center gap-1.5"
                    >
                      <span>Get started with this model</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
