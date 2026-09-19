import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { ShoppingCart, Globe, Smartphone, Store } from "lucide-react";

const channels = [
  { icon: <ShoppingCart className="w-6 h-6" />, name: "Boutique en ligne" },
  { icon: <Smartphone className="w-6 h-6" />, name: "Application mobile" },
  { icon: <Globe className="w-6 h-6" />, name: "Réseaux sociaux" },
  { icon: <Store className="w-6 h-6" />, name: "Marketplaces" },
];

export default function MultiChannel() {
  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="px-5 py-20 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20 sm:px-10 md:py-28">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 lg:w-1/2"
        >
          <Subtitle>VENTE MULTI-CANAUX</Subtitle>
          <SubHead>
            Vendez plus, sur plus de canaux
          </SubHead>
          <Paragraph fontSize="text-sm" color="text-black-400">
            Atteignez vos clients là où ils se trouvent. Gérez tous vos canaux de vente depuis un seul tableau de bord et maximisez vos revenus.
          </Paragraph>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-4 lg:w-1/2"
        >
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-4 p-6 bg-tertiary-300 rounded-lg border border-primary-200/30"
            >
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-white">
                {channel.icon}
              </div>
              <p className="font-head font-bold text-lg text-black-100">{channel.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
