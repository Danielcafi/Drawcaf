import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Active Stores" },
  { value: 50, suffix: "M+", label: "Products Sold" },
  { value: 120, suffix: "+", label: "Countries Served" },
  { value: 99, suffix: "%", label: "Uptime Guaranteed" },
];

function Counter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="bg-primary-100">
      <div className="container mx-auto max-w-[1344px]">
        <div className="px-5 py-16 sm:px-10 md:py-24">
          <div className="grid grid-cols-2 gap-10 md:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-head font-bold text-white">
                  <Counter target={stat.value} suffix={stat.suffix} inView={inView} />
                </h2>
                <p className="text-base md:text-lg lg:text-xl font-head text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
