import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { Layers, Paintbrush, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Layers className="w-8 h-8" />,
    number: "01",
    title: "Create your store",
    description: "Sign up and set up your online store in minutes with our intuitive dashboard.",
  },
  {
    icon: <Paintbrush className="w-8 h-8" />,
    number: "02",
    title: "Customize everything",
    description: "Design your storefront, add products, and personalize your brand identity.",
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    number: "03",
    title: "Start selling",
    description: "Launch your store and start accepting orders from customers worldwide.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-tertiary-300">
      <div className="container mx-auto max-w-[1344px]">
        <div className="px-5 py-20 flex flex-col gap-14 sm:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <Subtitle style="mb-2">HOW IT WORKS</Subtitle>
            <SubHead style="mb-[18px] sm:w-8/12 lg:w-5/12">
              Start selling in three simple steps
            </SubHead>
            <Paragraph fontSize="text-sm" color="text-black-400" style="sm:w-4/5 lg:w-2/5">
              No technical skills required. Get your store up and running quickly.
            </Paragraph>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center gap-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-tertiary-200 flex items-center justify-center text-primary-100 font-head font-bold text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-head font-bold text-black-100">{step.title}</h3>
                  <p className="text-lg font-body text-black-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
