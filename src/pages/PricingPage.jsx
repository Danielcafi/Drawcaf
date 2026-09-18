import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  HelpCircle,
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(0);

  const isAnnual = billingCycle === "annual";

  const plans = [
    {
      name: "Starter",
      tagline: "For ambitious creators & new shops",
      monthlyPrice: 29,
      annualPrice: 23,
      popular: false,
      features: [
        "1 Online Storefront",
        "Unlimited products & digital downloads",
        "Standard 2.9% + 30¢ transaction fee",
        "Basic sales analytics & reports",
        "Standard SSL certificate",
        "24/7 Email & community support",
        "2 staff accounts",
      ],
      ctaText: "Start Starter Plan",
    },
    {
      name: "Professional",
      tagline: "For rapidly growing brands & merchants",
      monthlyPrice: 79,
      annualPrice: 63,
      popular: true,
      features: [
        "Up to 5 online storefronts & domains",
        "Unlimited products & order volume",
        "Discounted 2.5% + 25¢ transaction fee",
        "Advanced retention & abandoned cart automations",
        "Point of Sale (POS) hardware sync",
        "5 staff accounts with custom roles",
        "Priority 24/7 live chat & phone support",
        "Custom checkout domain & CSS styling",
      ],
      ctaText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      tagline: "For high-volume merchants & global retail",
      monthlyPrice: 199,
      annualPrice: 159,
      popular: false,
      features: [
        "Unlimited storefronts & international localization",
        "Lowest 1.9% + 20¢ transaction rate",
        "Dedicated account manager & migration engineer",
        "Custom API limits & headless GraphQL storefronts",
        "99.99% uptime SLA guarantee",
        "Custom ERP, SAP & NetSuite connectors",
        "Unlimited staff accounts & SAML SSO",
      ],
      ctaText: "Contact Enterprise",
    },
  ];

  const faqs = [
    {
      q: "Can I switch or cancel my plan at any time?",
      a: "Yes, you can upgrade, downgrade, or cancel your Drawcaf subscription at any time directly from your Admin Dashboard. If you cancel, you will have access until the end of your billing cycle.",
    },
    {
      q: "Are there any hidden setup or hosting fees?",
      a: "No. All plans include ultra-fast edge cloud hosting, unlimited bandwidth, global SSL certificates, and all core updates without extra charge.",
    },
    {
      q: "How does the 14-day free trial work?",
      a: "You get full, unrestricted access to the Professional plan for 14 days without entering a credit card. You can configure products, customize themes, and launch whenever you are ready.",
    },
    {
      q: "What payment gateways are supported?",
      a: "Drawcaf natively supports Shop Pay, Credit & Debit Cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, Klarna, PayPal, and regional gateways across 175+ countries.",
    },
  ];

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/10 text-primary-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-head font-bold text-primary-100 leading-tight max-w-3xl">
            Choose the right plan for your business.
          </h1>

          <p className="text-lg text-black-300 max-w-xl mt-4 leading-relaxed">
            Every plan includes our award-winning checkout, rock-solid security, and 24/7 human support.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center bg-white p-1.5 rounded-2xl border border-primary-100/15 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-primary-100 text-white shadow-xs"
                  : "text-black-400 hover:text-black-100"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-primary-100 text-white shadow-xs"
                  : "text-black-400 hover:text-black-100"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                SAVE 20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? "bg-primary-100 text-white shadow-2xl ring-2 ring-primary-100 scale-105 z-10"
                      : "bg-white text-black-100 border border-primary-100/15 shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-tertiary-200 text-primary-100 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                      Most Popular Choice
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`text-2xl font-head font-bold ${
                          plan.popular ? "text-white" : "text-black-100"
                        }`}
                      >
                        {plan.name}
                      </h3>
                    </div>

                    <p
                      className={`text-xs mb-6 ${
                        plan.popular ? "text-white/80" : "text-black-400"
                      }`}
                    >
                      {plan.tagline}
                    </p>

                    {/* Price display */}
                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-primary-100/10">
                      <span className="text-2xl font-bold font-head">$</span>
                      <span className="text-5xl font-head font-bold tracking-tight">
                        {price}
                      </span>
                      <span
                        className={`text-xs ${
                          plan.popular ? "text-white/70" : "text-black-400"
                        }`}
                      >
                        / month
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 mb-8">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider block ${
                          plan.popular ? "text-tertiary-200" : "text-primary-100"
                        }`}
                      >
                        Included Features:
                      </span>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs">
                          <div
                            className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${
                              plan.popular
                                ? "bg-tertiary-200 text-primary-100"
                                : "bg-primary-100/10 text-primary-100"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span
                            className={
                              plan.popular ? "text-white/90" : "text-black-200"
                            }
                          >
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/free-trial"
                    className={`w-full py-3.5 rounded-xl font-head font-bold text-xs uppercase text-center transition-all shadow-sm flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-white text-primary-100 hover:bg-tertiary-200"
                        : "bg-primary-100 text-white hover:bg-primary-300"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="container mx-auto max-w-[960px] px-5 sm:px-10 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-head font-bold text-black-100">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-black-400 mt-2">
              Have questions about billing, contracts, or migrations? We're here to help.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-primary-100/10 p-5 shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left font-head font-bold text-sm text-black-100"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary-100 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-primary-100/10 text-xs text-black-300 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
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
