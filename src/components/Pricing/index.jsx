import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import MainButton from "../Atoms/button";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for new businesses",
    features: ["1 Store", "100 Products", "Basic Analytics", "Email Support", "SSL Certificate"],
    primary: false,
  },
  {
    name: "Professional",
    price: "79",
    description: "Most popular for growing businesses",
    features: ["5 Stores", "Unlimited Products", "Advanced Analytics", "Priority Support", "SSL Certificate", "Custom Domain", "Marketing Tools"],
    primary: true,
  },
  {
    name: "Enterprise",
    price: "199",
    description: "For large-scale operations",
    features: ["Unlimited Stores", "Unlimited Products", "Enterprise Analytics", "24/7 Support", "SSL Certificate", "Custom Domain", "Marketing Tools", "API Access", "Dedicated Manager"],
    primary: false,
  },
];

export default function Pricing() {
  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="px-5 py-20 flex flex-col gap-14 sm:px-10 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          <Subtitle style="mb-2">PRICING</Subtitle>
          <SubHead style="mb-[18px] sm:w-8/12 lg:w-5/12">
            Simple, transparent pricing
          </SubHead>
          <Paragraph fontSize="text-sm" color="text-black-400" style="sm:w-4/5 lg:w-2/5">
            No hidden fees. Pay once, use forever. Choose the plan that fits your business.
          </Paragraph>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`flex flex-col p-8 rounded-2xl ${
                plan.primary
                  ? "bg-primary-100 text-white scale-105 shadow-2xl border-2 border-primary-200"
                  : "bg-tertiary-300 border border-primary-200/30"
              }`}
            >
              <div className="flex flex-col gap-2 mb-6">
                <h3 className={`text-2xl font-head font-bold ${plan.primary ? "text-white" : "text-black-100"}`}>
                  {plan.name}
                </h3>
                <p className={`text-lg ${plan.primary ? "text-white/70" : "text-black-400"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-lg ${plan.primary ? "text-white/70" : "text-black-400"}`}>$</span>
                <span className={`text-6xl font-head font-bold ${plan.primary ? "text-white" : "text-black-100"}`}>
                  {plan.price}
                </span>
                <span className={`text-lg ${plan.primary ? "text-white/70" : "text-black-400"}`}>/month</span>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.primary ? "text-tertiary-200" : "text-primary-100"}`} />
                    <span className={`text-base ${plan.primary ? "text-white" : "text-black-200"}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-lg font-head font-bold text-lg transition-all duration-200 ${
                  plan.primary
                    ? "bg-white text-primary-100 hover:bg-tertiary-200"
                    : "bg-primary-100 text-white hover:bg-primary-300"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
