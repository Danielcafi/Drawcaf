import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DrawcafLogo from "../components/DrawcafLogo";

export default function ShopDemo() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Cloud Vase",
      price: 64.0,
      image: "/chair.png",
      qty: 1,
      variant: "Chalk White",
    },
    {
      id: 2,
      name: "Textured Cup",
      price: 56.0,
      image: "/card-1.png",
      qty: 1,
      variant: "Ribbed Sand",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  const products = [
    {
      id: 1,
      name: "Cloud Vase",
      price: 64.0,
      rating: 4.9,
      reviews: 38,
      image: "/chair.png",
      badge: "Bestseller",
      desc: "Hand-thrown sculptural stoneware with raw unglazed chalk texture.",
    },
    {
      id: 2,
      name: "Textured Cup",
      price: 56.0,
      rating: 4.8,
      reviews: 24,
      image: "/card-1.png",
      badge: "Staff Pick",
      desc: "Architectural cylindrical mug designed for daily espresso & pour-over.",
    },
    {
      id: 3,
      name: "Modern Sofa",
      price: 124.6,
      rating: 5.0,
      reviews: 19,
      image: "/chair.png",
      badge: "Signature",
      desc: "Ergonomic wool bouclé lounge chair built with sustainable solid pine frame.",
    },
    {
      id: 4,
      name: "Minimalist Ceramic Lamp",
      price: 88.0,
      rating: 4.9,
      reviews: 42,
      image: "/card-2.png",
      badge: "Limited Edition",
      desc: "Warm ambient light with touch-dimmable brass fixtures and linen shade.",
    },
  ];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1, variant: "Standard" }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal > 0 ? 10.0 : 0;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen bg-tertiary-300 font-body text-black-100 flex flex-col">
      {/* Storefront Header */}
      <header className="sticky top-0 z-40 bg-tertiary-300/95 backdrop-blur-md border-b border-primary-100/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1344px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <DrawcafLogo size="sm" />
            </Link>
            <div className="h-4 w-px bg-primary-100/20 hidden sm:block"></div>
            <span className="font-head font-bold text-lg text-primary-100 tracking-tight">
              Buddies™ Store
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/admin"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary-100/20 bg-white hover:bg-primary-100 hover:text-white transition-all text-primary-100 hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Back to Admin Demo</span>
            </Link>

            {/* Cart trigger button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-white font-head font-bold text-xs hover:bg-primary-300 transition-all shadow-sm"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-tertiary-200" />
              <span>Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-primary-100 text-[11px] font-bold flex items-center justify-center">
                {cart.reduce((count, item) => count + item.qty, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-white border-b border-primary-100/10 py-12 px-4 sm:px-8">
        <div className="max-w-[1344px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-100 bg-primary-100/10 px-3 py-1 rounded-full inline-block mb-3">
              Official Demo Storefront
            </span>
            <h1 className="text-3xl sm:text-5xl font-head font-bold text-black-100 tracking-tight leading-tight">
              Buddies™ Curated Homeware Collection
            </h1>
            <p className="text-black-300 text-base mt-3 leading-relaxed">
              Experience the fast, frictionless Drawcaf storefront with instant
              add-to-cart, responsive drawers, and high-conversion Shop Pay checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="p-4 bg-tertiary-300 rounded-xl border border-primary-100/10 text-center">
              <span className="text-2xl font-head font-bold text-primary-100">
                0.8s
              </span>
              <p className="text-xs text-black-400 mt-0.5">Average Load Time</p>
            </div>
            <div className="p-4 bg-tertiary-300 rounded-xl border border-primary-100/10 text-center">
              <span className="text-2xl font-head font-bold text-primary-100">
                +43%
              </span>
              <p className="text-xs text-black-400 mt-0.5">Shop Pay Conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <main className="max-w-[1344px] mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-head font-bold text-black-100">
              Featured Pieces
            </h2>
            <p className="text-sm text-black-400 mt-1">
              Select any piece to experience the checkout flow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-primary-100/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-square bg-tertiary-300/40 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-primary-100 shadow-xs border border-primary-100/10">
                  {product.badge}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-head font-bold text-base text-black-100">
                      {product.name}
                    </h3>
                    <span className="font-head font-bold text-primary-100 text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-black-400 leading-relaxed line-clamp-2 mb-4">
                    {product.desc}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary-100 text-white font-head font-bold text-xs hover:bg-primary-300 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-tertiary-200" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-primary-100/10 p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-primary-100/10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-100" />
                    <h2 className="text-lg font-head font-bold text-black-100">
                      Your Shopping Cart
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-md text-black-400 hover:text-black-100"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-black-400/40 mx-auto mb-3" />
                      <p className="text-sm font-medium text-black-400">
                        Your cart is empty.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-tertiary-300/40 rounded-xl border border-primary-100/10 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-white rounded-lg p-1.5 border border-primary-100/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-head font-bold text-sm text-black-100 truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs text-primary-100 font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="p-1 bg-white border border-primary-100/15 rounded text-black-300 hover:text-black-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-2">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="p-1 bg-white border border-primary-100/15 rounded text-black-300 hover:text-black-100"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-black-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-primary-100/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black-400">Subtotal</span>
                  <span className="font-head font-bold text-black-100">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-black-400">
                  <span>Shipping calculated at checkout</span>
                  <span>Free over $150</span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary-100 text-white font-head font-bold text-sm hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-tertiary-200" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Drawer matching reference card exactly */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-primary-100/15 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setOrderPlaced(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-black-400 hover:text-black-100 bg-tertiary-300"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>

            {orderPlaced ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-head font-bold text-black-100">
                  Order Confirmed!
                </h3>
                <p className="text-sm text-black-400 max-w-xs mx-auto">
                  Confirmation sent to{" "}
                  <strong className="text-black-100">danielredoun@gmail.com</strong>.
                  Order #DC-4821 is being prepared.
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Link
                    to="/admin"
                    className="px-4 py-2.5 rounded-lg bg-primary-100 text-white font-bold text-xs hover:bg-primary-300 transition-colors"
                  >
                    View in Admin Orders
                  </Link>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderPlaced(false);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-tertiary-300 text-black-100 font-bold text-xs"
                  >
                    Back to Store
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Store Header */}
                <div className="flex items-center justify-between pb-4 border-b border-primary-100/10">
                  <div>
                    <h3 className="font-head font-bold text-xl text-black-100">
                      Buddies™
                    </h3>
                    <p className="text-[11px] text-black-400">
                      Secure Checkout with Shop Pay
                    </p>
                  </div>
                </div>

                {/* Show order summary accordion matching mockup */}
                <div className="my-3 bg-tertiary-300/50 rounded-lg p-3 border border-primary-100/10">
                  <button
                    type="button"
                    onClick={() => setIsSummaryExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-primary-100"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Show order summary
                      {isSummaryExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="font-head font-bold text-sm text-black-100">
                      ${total.toFixed(2)}
                    </span>
                  </button>

                  {isSummaryExpanded && (
                    <div className="mt-3 pt-3 border-t border-primary-100/10 space-y-2 text-xs">
                      {cart.map((c) => (
                        <div key={c.id} className="flex justify-between text-black-300">
                          <span>
                            {c.name} x {c.qty}
                          </span>
                          <span className="font-medium text-black-100">
                            ${(c.price * c.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-black-400 pt-1">
                        <span>Standard shipping (3-5 business days)</span>
                        <span>$10.00</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Breadcrumbs matching image */}
                <div className="text-[11px] text-black-400 flex items-center gap-1.5 mb-4 font-medium">
                  <span className="text-primary-100 font-bold">Information</span>
                  <span>&gt;</span>
                  <span className="text-primary-100 font-bold">Shipping</span>
                  <span>&gt;</span>
                  <span className="text-black-100 font-bold">Payment</span>
                  <span>&gt;</span>
                  <span>Review</span>
                </div>

                {/* Contact and Ship to block */}
                <div className="space-y-3 mb-4 text-xs">
                  <div className="p-3 rounded-lg border border-primary-100/10 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-black-400 text-[10px] uppercase font-bold tracking-wider">
                          Contact
                        </span>
                        <p className="font-medium text-black-100 mt-0.5">
                          danielredoun@gmail.com
                        </p>
                      </div>
                      <span className="text-primary-100 font-bold text-[11px] cursor-pointer hover:underline">
                        Change
                      </span>
                    </div>
                    <div className="my-2 border-t border-primary-100/5"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-black-400 text-[10px] uppercase font-bold tracking-wider">
                          Ship to
                        </span>
                        <p className="font-medium text-black-100 mt-0.5">
                          1234 Oakwood Avenue, Montreal QC H3A2F7, Canada
                        </p>
                      </div>
                      <span className="text-primary-100 font-bold text-[11px] cursor-pointer hover:underline">
                        Change
                      </span>
                    </div>
                    <div className="my-2 border-t border-primary-100/5"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-black-400 text-[10px] uppercase font-bold tracking-wider">
                          Method
                        </span>
                        <p className="font-medium text-black-100 mt-0.5">
                          Standard Pack (3-5 business days) • $10.00
                        </p>
                      </div>
                      <span className="text-primary-100 font-bold text-[11px] cursor-pointer hover:underline">
                        Change
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Selection matching mockup */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-head text-black-100 block">
                      Payment
                    </label>

                    {/* Credit card option */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === "card"
                          ? "border-primary-100 bg-primary-100/5 ring-1 ring-primary-100"
                          : "border-primary-100/15 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="accent-primary-100"
                        />
                        <span className="text-xs font-bold text-black-100">
                          Credit card
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#1A1F71] text-white rounded">
                          VISA
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#EB001B] text-white rounded">
                          MC
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#006FCF] text-white rounded">
                          AMEX
                        </span>
                      </div>
                    </div>

                    {/* Shop Pay option */}
                    <div
                      onClick={() => setPaymentMethod("shoppay")}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === "shoppay"
                          ? "border-primary-100 bg-primary-100/5 ring-1 ring-primary-100"
                          : "border-primary-100/15 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "shoppay"}
                          onChange={() => setPaymentMethod("shoppay")}
                          className="accent-primary-100"
                        />
                        <span className="text-xs font-bold text-black-100">
                          shop <span className="text-primary-100 font-extrabold">pay</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        1-Click Checkout
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-primary-100 text-white font-head font-bold text-sm hover:bg-primary-300 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-tertiary-200" />
                    <span>Pay now • ${total.toFixed(2)}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
