import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Mail,
  TrendingUp,
  Target,
  Percent,
  BarChart2,
  Users,
  Share2,
  Sparkles,
  Clock,
  Send,
  CheckCircle2,
  Calculator,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Marketing() {
  const [budget, setBudget] = useState(500);

  const estimatedReach = Math.round(budget * 42);
  const estimatedClicks = Math.round(budget * 3.1);
  const estimatedConversions = Math.round(estimatedClicks * 0.038);
  const estimatedRevenue = Math.round(estimatedConversions * 65.54);

  const automations = [
    {
      title: "Abandoned Checkout Recovery",
      icon: Clock,
      stat: "28.4% Recovery Rate",
      desc: "Automatically send personalized email reminders with 1-click cart restoration when a customer leaves items behind.",
      active: true,
    },
    {
      title: "Customer Welcome Series",
      icon: Mail,
      stat: "4.2x Higher Open Rate",
      desc: "Introduce your brand story, highlight bestsellers, and provide an exclusive first-order welcome perk.",
      active: true,
    },
    {
      title: "Smart Discount Engine",
      icon: Percent,
      stat: "+19% Cart Size",
      desc: "Trigger tiered discounts (e.g. 'Spend $100 get $15 off') dynamically at checkout based on basket contents.",
      active: true,
    },
    {
      title: "VIP Loyalty & Retention",
      icon: Sparkles,
      stat: "38% Repeat Purchase",
      desc: "Reward high-LTV customers automatically with early access to seasonal drops and free shipping tokens.",
      active: true,
    },
  ];

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12 md:py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/10 text-primary-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Drawcaf Growth & Marketing Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-head font-bold text-primary-100 leading-tight max-w-4xl">
            Turn first-time visitors into lifelong buyers.
          </h1>

          <p className="text-lg text-black-300 max-w-2xl mt-5 font-body leading-relaxed">
            Built-in email marketing, dynamic segmentations, automated retention workflows,
            and advertising integrations that convert browsers into high-LTV customers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/free-trial"
              className="px-8 py-4 rounded-xl bg-primary-100 text-tertiary-200 font-head font-bold text-sm uppercase hover:bg-primary-300 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Start Marketing Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              className="px-8 py-4 rounded-xl bg-white border border-primary-100/20 text-primary-100 font-head font-bold text-sm uppercase hover:bg-primary-100 hover:text-white transition-all shadow-xs flex items-center justify-center"
            >
              View Analytics Demo
            </Link>
          </div>
        </section>

        {/* Live ROI Campaign Simulator */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-8">
          <div className="bg-white rounded-3xl border border-primary-100/15 p-6 sm:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary-100/10 text-primary-100">
                <Calculator className="w-4 h-4" />
                <span>Interactive Growth Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-head font-bold text-black-100">
                Estimate your marketing returns
              </h2>
              <p className="text-sm text-black-400">
                Slide your anticipated monthly ad budget to project targeted reach and sales based on Drawcaf's high-conversion benchmarks.
              </p>
            </div>

            {/* Slider control */}
            <div className="max-w-xl mx-auto space-y-4 mb-12">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-black-400">Monthly Ad & Campaign Budget:</span>
                <span className="text-2xl font-head text-primary-100">
                  ${budget.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2.5 bg-tertiary-300 rounded-lg appearance-none cursor-pointer accent-primary-100"
              />
              <div className="flex justify-between text-[11px] text-black-400 font-medium">
                <span>$100 Starter</span>
                <span>$2,500 Growing Brand</span>
                <span>$5,000+ Scale</span>
              </div>
            </div>

            {/* Simulated Outcomes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-tertiary-300/50 rounded-2xl border border-primary-100/10 text-center space-y-1">
                <span className="text-xs font-bold text-black-400 uppercase tracking-wider">
                  Targeted Reach
                </span>
                <div className="text-3xl font-head font-bold text-primary-100">
                  {estimatedReach.toLocaleString()}
                </div>
                <p className="text-[11px] text-black-400">qualified shoppers</p>
              </div>

              <div className="p-6 bg-tertiary-300/50 rounded-2xl border border-primary-100/10 text-center space-y-1">
                <span className="text-xs font-bold text-black-400 uppercase tracking-wider">
                  Store Clicks
                </span>
                <div className="text-3xl font-head font-bold text-primary-100">
                  {estimatedClicks.toLocaleString()}
                </div>
                <p className="text-[11px] text-black-400">high-intent visitors</p>
              </div>

              <div className="p-6 bg-tertiary-300/50 rounded-2xl border border-primary-100/10 text-center space-y-1">
                <span className="text-xs font-bold text-black-400 uppercase tracking-wider">
                  Orders Created
                </span>
                <div className="text-3xl font-head font-bold text-emerald-700">
                  {estimatedConversions.toLocaleString()}
                </div>
                <p className="text-[11px] text-black-400">average 3.8% conversion</p>
              </div>

              <div className="p-6 bg-primary-100 rounded-2xl text-white text-center space-y-1 shadow-md">
                <span className="text-xs font-bold text-tertiary-200 uppercase tracking-wider">
                  Projected Revenue
                </span>
                <div className="text-3xl font-head font-bold">
                  ${estimatedRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-white/80">
                  ~{(estimatedRevenue / budget).toFixed(1)}x ROAS Benchmark
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Automated Playbooks */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-head font-bold text-black-100">
                Pre-Built Automated Workflows
              </h2>
              <p className="text-sm text-black-400 mt-1">
                Turn on powerful marketing automations with a single click.
              </p>
            </div>
            <Link
              to="/admin"
              className="text-xs font-bold text-primary-100 hover:text-primary-300 inline-flex items-center gap-1.5"
            >
              <span>Test workflows in Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {automations.map((auto, idx) => {
              const Icon = auto.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-primary-100/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-primary-100/10 text-primary-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        {auto.stat}
                      </span>
                    </div>

                    <h3 className="font-head font-bold text-xl text-black-100">
                      {auto.title}
                    </h3>
                    <p className="text-xs text-black-300 leading-relaxed">
                      {auto.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-primary-100/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready to deploy
                    </span>
                    <button className="text-primary-100 font-bold hover:underline">
                      Configure &rarr;
                    </button>
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
