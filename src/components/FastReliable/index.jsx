import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description: "Pages load in under 2 seconds for optimal conversion rates. Your customers will never wait.",
    color: "bg-primary-200",
    stat: "< 2s",
    statLabel: "Load Time",
    offset: "ml-0",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure by Default",
    description: "SSL certificates, PCI compliance, and fraud protection included out of the box.",
    color: "bg-secondary-200",
    stat: "100%",
    statLabel: "Protected",
    offset: "ml-8 sm:ml-16 md:ml-24",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "99.9% Uptime",
    description: "Reliable infrastructure that keeps your store running 24/7 without interruptions.",
    color: "bg-tertiary-200",
    stat: "24/7",
    statLabel: "Available",
    offset: "ml-16 sm:ml-32 md:ml-48",
  },
];

export default function FastReliable() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="relative container mx-auto max-w-[1344px]">
        <div className="px-5 py-20 flex flex-col gap-12 sm:px-10 md:py-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <Subtitle style="mb-2 text-primary-100">PERFORMANCE</Subtitle>
            <SubHead color="text-primary-100" style="mb-[18px] sm:w-8/12 lg:w-6/12">
              Very fast and truly reliable
            </SubHead>
            <Paragraph fontSize="text-sm" color="text-primary-300" style="sm:w-4/5 lg:w-2/5">
              Built on modern infrastructure to deliver blazing-fast performance your customers deserve.
            </Paragraph>
          </motion.div>

          {/* Main Video Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-black -mr-10 sm:-mr-20 lg:-mr-40"
          >
            <div className="relative aspect-[4/3] sm:aspect-video md:aspect-[21/9] lg:aspect-[2.5/1]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="/perso-drawcaf.webm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-sm font-body">Watch Demo</p>
                  <h3 className="text-white text-xl font-head font-bold">See Drawcaf in Action</h3>
                </div>
                <span className="hidden sm:block text-white/40 text-sm font-body">2:34</span>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards - offset to the right */}
          <div className="flex flex-col gap-4">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className={`flex items-center gap-6 p-5 sm:p-6 bg-tertiary-300 rounded-xl border border-black/10 hover:bg-tertiary-200 transition-colors duration-300 ${item.offset}`}
              >
                <div className={`shrink-0 w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-primary-100`}>
                  {item.icon}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-head font-bold text-primary-100">{item.title}</h3>
                    <p className="text-base font-body text-primary-300">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end shrink-0">
                    <span className="text-3xl font-head font-bold text-primary-100">{item.stat}</span>
                    <span className="text-sm font-body text-primary-300">{item.statLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
