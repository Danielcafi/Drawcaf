import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  Filter,
  Download,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = [
    {
      label: "TOTAL SALES",
      value: "$1,268.60",
      change: "+18.4%",
      isPositive: true,
      timeframe: "vs previous 7 days",
    },
    {
      label: "TOTAL ORDERS",
      value: "142",
      change: "+12.2%",
      isPositive: true,
      timeframe: "6 pending fulfillment",
    },
    {
      label: "AVERAGE ORDER VALUE",
      value: "$65.54",
      change: "+4.1%",
      isPositive: true,
      timeframe: "from $62.80",
    },
    {
      label: "STORE CONVERSION RATE",
      value: "3.42%",
      change: "+0.8%",
      isPositive: true,
      timeframe: "1,840 sessions",
    },
  ];

  const bestSellers = [
    {
      id: 1,
      name: "Cloud Vase",
      price: 64.0,
      image: "/chair.png",
      sales: 48,
      revenue: "$3,072.00",
      stock: "24 in stock",
      status: "Active",
    },
    {
      id: 2,
      name: "Textured Cup",
      price: 56.0,
      image: "/card-1.png",
      sales: 34,
      revenue: "$1,904.00",
      stock: "12 in stock",
      status: "Active",
    },
    {
      id: 3,
      name: "Modern Sofa",
      price: 124.6,
      image: "/chair.png",
      sales: 19,
      revenue: "$2,367.40",
      stock: "8 in stock",
      status: "Active",
    },
    {
      id: 4,
      name: "Minimalist Ceramic Lamp",
      price: 88.0,
      image: "/card-2.png",
      sales: 27,
      revenue: "$2,376.00",
      stock: "15 in stock",
      status: "Active",
    },
  ];

  const recentOrders = [
    {
      id: "#DC-4821",
      customer: "Daniel Redoun",
      email: "danielredoun@gmail.com",
      date: "6 days ago",
      items: "Cloud Vase (x1), Textured Cup (x1)",
      total: "$156.22",
      payment: "Paid",
      fulfillment: "Fulfilled",
    },
    {
      id: "#DC-4820",
      customer: "Sarah Jenkins",
      email: "sarah.j@outlook.com",
      date: "1 day ago",
      items: "Modern Sofa (x1)",
      total: "$134.60",
      payment: "Paid",
      fulfillment: "Fulfilled",
    },
    {
      id: "#DC-4819",
      customer: "Marc Dupont",
      email: "marc.dupont@orange.fr",
      date: "3 hours ago",
      items: "Cloud Vase (x1)",
      total: "$74.00",
      payment: "Paid",
      fulfillment: "Unfulfilled",
    },
    {
      id: "#DC-4818",
      customer: "Elena Rostova",
      email: "elena@designhub.io",
      date: "35 mins ago",
      items: "Textured Cup (x2)",
      total: "$122.00",
      payment: "Paid",
      fulfillment: "Unfulfilled",
    },
  ];

  const navItems = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: ShoppingBag, badge: "4" },
    { id: "orders", label: "Orders", icon: PackageCheck, badge: "12" },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-tertiary-300/90 backdrop-blur-md border-b border-primary-100/10 px-4 sm:px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <DrawcafLogo size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100/10 text-primary-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Live Demo
            </span>
          </div>

          {/* Search bar matching reference */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-black-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, customers..."
                className="w-full pl-10 pr-12 py-2 text-sm bg-white border border-primary-100/15 rounded-lg focus:outline-none focus:border-primary-100 text-black-100 transition-all placeholder:text-black-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-black-400 bg-tertiary-300 px-1.5 py-0.5 rounded border border-primary-100/10">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Action Icons & Seller Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary-100/20 bg-white hover:bg-primary-100 hover:text-white transition-all text-primary-100"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Buddies™ Store</span>
            </Link>

            <button
              className="relative p-2 rounded-lg bg-white border border-primary-100/15 text-black-200 hover:text-primary-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E3A8B] text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Avatar: Deyan Kenarny */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-primary-100/15">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-white font-head font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm overflow-hidden">
                <img
                  src="/profile-1.png"
                  alt="Deyan Kenarny"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span>DK</span>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold font-head text-black-100 leading-tight">
                    Deyan Kenarny
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-[#1E3A8B] fill-primary-200" />
                </div>
                <span className="text-[10px] text-black-400">Verified seller</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="bg-white rounded-xl border border-primary-100/10 p-3 shadow-sm sticky top-20">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap ${
                      isActive
                        ? "bg-primary-100 text-white shadow-sm font-bold"
                        : "text-black-300 hover:bg-tertiary-300/80 hover:text-primary-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-tertiary-200" : "text-black-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary-100/10 text-primary-100"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick store status card in sidebar */}
            <div className="hidden lg:block mt-6 pt-5 border-t border-primary-100/10">
              <div className="p-3 bg-tertiary-300 rounded-lg border border-primary-100/10">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-100 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Shop Pay Active</span>
                </div>
                <p className="text-[11px] text-black-400 leading-relaxed">
                  SSL secured, payouts processing daily to Chase Account •••• 4912.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl border border-primary-100/10 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-100 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary-100" />
                Store Performance Overview
              </div>
              <h1 className="text-2xl sm:text-3xl font-head font-bold text-black-100">
                Welcome back, Deyan
              </h1>
              <p className="text-sm text-black-400 mt-1">
                Your store traffic is up by <span className="text-emerald-600 font-bold">+24%</span> today following your email blast.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-tertiary-300 border border-primary-100/15 text-primary-100 hover:bg-primary-100 hover:text-white transition-all">
                <Download className="w-3.5 h-3.5" />
                Export Data
              </button>
              <Link
                to="/website-builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-primary-100 text-white hover:bg-primary-300 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Customize Theme
              </Link>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-primary-100/10 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wider text-black-400">
                    {stat.label}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                      stat.isPositive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {stat.change}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-2xl sm:text-3xl font-head font-bold text-primary-100">
                    {stat.value}
                  </div>
                  {/* Decorative sparkline */}
                  <div className="w-16 h-7 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 60 25" className="w-full h-full overflow-visible">
                      <path
                        d={
                          idx === 0
                            ? "M0,20 Q15,22 25,12 T50,5 T60,2"
                            : idx === 1
                            ? "M0,18 Q15,10 30,14 T55,8 T60,4"
                            : idx === 2
                            ? "M0,15 Q20,20 35,10 T60,6"
                            : "M0,22 Q20,15 40,8 T60,3"
                        }
                        fill="none"
                        stroke="#1E3A8B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-[11px] text-black-400 mt-2 font-medium">
                  {stat.timeframe}
                </p>
              </div>
            ))}
          </div>

          {/* Best Sellers Section */}
          <div className="bg-white rounded-2xl border border-primary-100/10 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-100/10">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-head font-bold text-black-100">
                  Best Sellers
                </h2>
                <span className="text-xs text-primary-100 font-semibold bg-primary-100/10 px-2 py-0.5 rounded-full">
                  Buddies™ Collection
                </span>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-primary-100 hover:text-primary-300 inline-flex items-center gap-1 group"
              >
                View all in shop
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {bestSellers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-primary-100/10 p-3.5 bg-tertiary-300/40 hover:bg-tertiary-300 transition-colors flex flex-col justify-between group"
                >
                  <div className="aspect-square bg-white rounded-lg border border-primary-100/10 mb-3 overflow-hidden flex items-center justify-center p-3 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      ● {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-head font-bold text-sm text-black-100 mb-0.5 group-hover:text-primary-100 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-black-400 mb-2">
                      <span className="font-bold text-primary-100">${item.price.toFixed(2)}</span>
                      <span>{item.stock}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-primary-100/10 flex items-center justify-between text-[11px] text-black-300">
                    <span>{item.sales} orders</span>
                    <span className="font-bold text-black-100">{item.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl border border-primary-100/10 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-primary-100/10">
              <div>
                <h2 className="text-lg font-head font-bold text-black-100">
                  Recent Customer Orders
                </h2>
                <p className="text-xs text-black-400 mt-0.5">
                  Synchronized across Web Store, Shop App and POS.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedFilter === "all"
                      ? "bg-primary-100 text-white font-bold"
                      : "bg-tertiary-300 text-black-300 hover:text-black-100"
                  }`}
                >
                  All (4)
                </button>
                <button
                  onClick={() => setSelectedFilter("unfulfilled")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedFilter === "unfulfilled"
                      ? "bg-primary-100 text-white font-bold"
                      : "bg-tertiary-300 text-black-300 hover:text-black-100"
                  }`}
                >
                  Unfulfilled (2)
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-primary-100/10 text-black-400 font-head uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold hidden md:table-cell">Products</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Fulfillment</th>
                    <th className="pb-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100/5 font-medium">
                  {recentOrders
                    .filter((o) =>
                      selectedFilter === "unfulfilled"
                        ? o.fulfillment === "Unfulfilled"
                        : true
                    )
                    .map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-tertiary-300/40 transition-colors"
                      >
                        <td className="py-3.5 font-bold text-primary-100">
                          {order.id}
                          <div className="text-[10px] text-black-400 font-normal">
                            {order.date}
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="font-bold text-black-100">
                            {order.customer}
                          </div>
                          <div className="text-[10px] text-black-400">
                            {order.email}
                          </div>
                        </td>
                        <td className="py-3.5 text-black-300 hidden md:table-cell max-w-[200px] truncate">
                          {order.items}
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            {order.payment}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              order.fulfillment === "Fulfilled"
                                ? "bg-primary-100/10 text-primary-100"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {order.fulfillment}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-head font-bold text-black-100">
                          {order.total}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
