import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { User, Building2, Factory } from "lucide-react";

const audiences = [
  {
    icon: <User className="w-8 h-8" />,
    title: "Entrepreneurs",
    description: "Start your online business with minimal investment and no technical skills.",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Small Businesses",
    description: "Scale your existing business with powerful ecommerce tools and analytics.",
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Enterprise",
    description: "Custom solutions for large companies with advanced needs and high volume.",
  },
];

export default function ForEveryone() {
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
          <Subtitle style="mb-2">FOR EVERYONE</Subtitle>
          <SubHead style="mb-[18px] sm:w-8/12 lg:w-6/12">
            From entrepreneurs to large enterprises
          </SubHead>
          <Paragraph fontSize="text-sm" color="text-black-400" style="sm:w-4/5 lg:w-2/5">
            Drawcaf adapts to your needs, whether you are just starting out or managing a large-scale operation.
          </Paragraph>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center gap-6 p-8 bg-tertiary-300 rounded-xl border border-primary-200/20 shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-white">
                {item.icon}
              </div>
              <h3 className="text-2xl font-head font-bold text-primary-100">{item.title}</h3>
              <p className="text-lg font-body text-primary-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
