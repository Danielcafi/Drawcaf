import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { CreditCard, Truck, Mail, BarChart3, Users, Bell } from "lucide-react";

const integrations = [
  { icon: <CreditCard className="w-8 h-8" />, name: "Stripe", category: "Paiement" },
  { icon: <CreditCard className="w-8 h-8" />, name: "PayPal", category: "Paiement" },
  { icon: <Truck className="w-8 h-8" />, name: "ShipStation", category: "Livraison" },
  { icon: <Mail className="w-8 h-8" />, name: "Mailchimp", category: "Marketing" },
  { icon: <BarChart3 className="w-8 h-8" />, name: "Google Analytics", category: "Analyse" },
  { icon: <Users className="w-8 h-8" />, name: "Zapier", category: "Automatisation" },
  { icon: <Bell className="w-8 h-8" />, name: "Slack", category: "Notifications" },
  { icon: <CreditCard className="w-8 h-8" />, name: "Square", category: "Paiement" },
];

export default function Integrations() {
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
            <Subtitle style="mb-2">INTÉGRATIONS</Subtitle>
            <SubHead style="mb-[18px] sm:w-8/12 lg:w-6/12">
              Connectez vos outils préférés
            </SubHead>
            <Paragraph fontSize="text-sm" color="text-black-400" style="sm:w-4/5 lg:w-2/5">
              Intégrez facilement les outils que vous utilisez déjà pour gérer votre business.
            </Paragraph>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {integrations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-md border border-primary-200/20 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100/10 flex items-center justify-center text-primary-100">
                  {item.icon}
                </div>
                <p className="font-head font-bold text-lg text-black-100">{item.name}</p>
                <span className="text-sm font-head text-black-400 bg-tertiary-300 px-3 py-1 rounded-full">{item.category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
