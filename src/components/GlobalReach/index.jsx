import { motion } from "framer-motion";

export default function GlobalReach() {
  return (
    <div className="px-5 py-10 sm:px-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/8]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="/inter-drawcaf.webm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20">
            <div
              className="text-white leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-medium tracking-widest text-sm md:text-base mb-6"
              >
                GLOBAL REACH
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="block">Grow</span>
                <span className="block">your</span>
                <span className="block">business</span>
                <span className="block">across</span>
                <span className="block">the</span>
                <span className="block">world</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/80 text-sm md:text-base lg:text-lg mt-6 max-w-md"
              >
                Sell to customers in over 120 countries with built-in multi-currency support and localized payment methods.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
