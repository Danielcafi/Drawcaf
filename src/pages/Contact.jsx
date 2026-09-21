import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeUrl: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="container mx-auto max-w-[1344px] px-5 sm:px-10 py-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/10 text-primary-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Global Support</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-head font-bold text-primary-100 leading-tight max-w-3xl">
            We're here to help your store succeed.
          </h1>

          <p className="text-lg text-black-300 max-w-xl mt-4 leading-relaxed">
            Get in touch with our merchant success experts, support engineers, or partnerships team.
          </p>
        </section>

        {/* Contact Form & Info Grid */}
        <section className="container mx-auto max-w-[1200px] px-5 sm:px-10 py-8">
          <div className="bg-white rounded-3xl border border-primary-100/15 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Form */}
            <div className="lg:col-span-7 p-6 sm:p-12">
              {submitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-head font-bold text-black-100">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-black-400 max-w-sm mx-auto">
                    Thanks, {formData.name}. Ticket #SUP-9104 has been created.
                    A merchant specialist will respond to{" "}
                    <strong>{formData.email}</strong> within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary-100 text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h2 className="text-2xl font-head font-bold text-black-100">
                      Send us an inquiry
                    </h2>
                    <p className="text-black-400 mt-1">
                      Fill out the details below and we will route your request directly to the appropriate team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-black-100 block mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-black-100 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-black-100 block mb-1">
                        Store URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.storeUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, storeUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-black-100 block mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100 text-black-100"
                      >
                        <option>Technical & Integration</option>
                        <option>Billing & Plan Upgrade</option>
                        <option>Enterprise Volume Custom SLA</option>
                        <option>Partner & Agency Program</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-black-100 block mb-1">
                      How can we help?
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-tertiary-300/40 border border-primary-100/15 rounded-xl font-medium focus:outline-none focus:border-primary-100"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-primary-100 text-white font-head font-bold text-xs uppercase hover:bg-primary-300 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-tertiary-200" />
                    <span>Submit Support Ticket</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-5 bg-primary-100 text-white p-6 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <span className="text-tertiary-200 text-xs font-bold uppercase tracking-wider block mb-2">
                    Direct Assistance
                  </span>
                  <h3 className="font-head font-bold text-2xl">
                    Instant Channels
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-tertiary-200 flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        24/7 Live Chat
                      </h4>
                      <p className="text-white/70 mt-0.5">
                        Average response time: 2 minutes inside your Admin Dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-tertiary-200 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        Priority Phone Support
                      </h4>
                      <p className="text-white/70 mt-0.5">
                        +1 (800) 492-3829 (Enterprise & Pro merchants)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-tertiary-200 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        Headquarters & Hubs
                      </h4>
                      <p className="text-white/70 mt-0.5">
                        Montreal • San Francisco • London • Paris
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <span className="text-[11px] font-bold text-tertiary-200 uppercase">
                  Service Status: 100% Operational
                </span>
                <p className="text-[11px] text-white/80">
                  All systems including checkout, payments, and admin APIs are operating with 0 latency incidents today.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
