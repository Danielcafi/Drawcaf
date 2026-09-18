import React from "react";
import { Link } from "react-router-dom";

export default function DrawcafLogo({
  variant = "dark",
  className = "",
  iconOnly = false,
  size = "md",
}) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "h-7",
    md: "h-9 md:h-10",
    lg: "h-11 md:h-12",
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 ${className}`}
      aria-label="Drawcaf Home"
    >
      {/* Precision Vector Icon matching Drawcaf Cart Icon */}
      <svg
        className={`${sizeClasses[size] || "h-9"} w-auto flex-shrink-0`}
        viewBox="0 0 46 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="drawcaf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8B" />
          </linearGradient>
        </defs>
        
        {/* Speed lines on the left */}
        <rect x="0" y="14" width="9" height="3" rx="1.5" fill="#38BDF8" />
        <rect x="2" y="20" width="7" height="3" rx="1.5" fill="#2563EB" />
        <rect x="5" y="26" width="6" height="3" rx="1.5" fill="#1E3A8B" />

        {/* Outer D curve */}
        <path
          d="M8 6C8 3.79086 9.79086 2 12 2H24C34.4934 2 43 10.5066 43 21C43 31.4934 34.4934 40 24 40H12C9.79086 40 8 38.2091 8 36V6Z"
          fill="url(#drawcaf-gradient)"
        />

        {/* Inner cutout / cart silhouette */}
        <g fill="#FFFFFF">
          {/* Cart handle and basket */}
          <path
            d="M16 14C15.45 14 15 14.45 15 15C15 15.55 15.45 16 16 16H18L20.4 25.1C20.6 25.8 21.2 26.3 22 26.3H30C30.8 26.3 31.4 25.8 31.6 25.1L33.3 18.2C33.5 17.4 32.9 16.6 32.1 16.6H20.2L19.4 14.4C19.2 13.9 18.7 13.5 18.1 13.5H16V14Z"
          />
          {/* Cart wheels */}
          <circle cx="22.5" cy="30" r="2.2" />
          <circle cx="29.5" cy="30" r="2.2" />
        </g>
      </svg>

      {!iconOnly && (
        <span
          className={`font-head font-bold text-2xl tracking-tight ${
            isLight ? "text-white" : "text-primary-100"
          }`}
        >
          Drawcaf
        </span>
      )}
    </Link>
  );
}
