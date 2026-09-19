import SubHead from "../Atoms/subhead";
import Subtitle from "../Atoms/subtitle";
import Paragraph from "../Atoms/paragraph";
import FeatureItem from "./featureItem";
import { motion } from "framer-motion";
import { useAudience } from "../../context/AudienceContext";
import { Shield, Truck, RotateCcw, Headphones, CreditCard, BadgeCheck } from "lucide-react";

const sellerFeatures = [
  {
    id: 1,
    title: "Paiement unique",
    logo: "/feature-1.svg",
    content: "Pas d'abonnement mensuel. Payez une fois, utilisez votre boutique à vie.",
  },
  {
    id: 2,
    title: "Vos données, votre contrôle",
    logo: "/feature-2.svg",
    content: "Vous possédez vos données, le design de votre boutique et votre plan commercial.",
  },
  {
    id: 3,
    title: "Mises à jour gratuites",
    logo: "/feature-3.svg",
    content: "Recevez des mises à jour gratuites à vie sans frais supplémentaires.",
  },
  {
    id: 4,
    title: "Design mobile-first",
    logo: "/feature-4.svg",
    content: "Offrez à vos clients une expérience mobile fluide et intuitive.",
  },
  {
    id: 5,
    title: "100% personnalisable",
    logo: "/feature-5.svg",
    content: "Personnalisez chaque aspect de votre boutique selon votre vision créative.",
  },
  {
    id: 6,
    title: "Gestion simplifiée",
    logo: "/feature-6.svg",
    content: "Gérez vos produits, commandes et clients depuis un tableau de bord centralisé.",
  },
];

const buyerFeatures = [
  {
    id: 1,
    title: "Paiement sécurisé",
    icon: <CreditCard className="w-6 h-6" />,
    content: "Transactions protégées via MTN Mobile Money, Moov et cartes bancaires.",
  },
  {
    id: 2,
    title: "Données protégées",
    icon: <Shield className="w-6 h-6" />,
    content: "Vos informations personnelles sont cryptées et sécurisées en permanence.",
  },
  {
    id: 3,
    title: "Nouvelles trouvailles",
    icon: <BadgeCheck className="w-6 h-6" />,
    content: "Découvrez régulièrement de nouvelles boutiques et créations artisanales.",
  },
  {
    id: 4,
    title: "Shopping mobile",
    icon: <Truck className="w-6 h-6" />,
    content: "Achetez facilement depuis votre smartphone, où que vous soyez en Afrique.",
  },
  {
    id: 5,
    title: "Retours faciles",
    icon: <RotateCcw className="w-6 h-6" />,
    content: "Politique de retour simple et transparente pour chaque achat.",
  },
  {
    id: 6,
    title: "Support réactif",
    icon: <Headphones className="w-6 h-6" />,
    content: "Notre équipe est disponible pour répondre à toutes vos questions.",
  },
];

export default function Features() {
  const { audience } = useAudience();
  const features = audience === 'seller' ? sellerFeatures : buyerFeatures;

  const content = {
    visible: { y: 0, opacity: 1, transition: { duration: 1 } },
    hidden: { y: -100, opacity: 0 },
  };

  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="px-5 py-16 flex flex-col gap-10 sm:pb-28 sm:px-10 md:pb-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={content}
          className="text-center flex flex-col items-center"
        >
          <Subtitle style="mb-2">
            {audience === 'seller' ? 'AVANTAGES VENDEUR' : 'POURQUOI DRAWCAF'}
          </Subtitle>
          <SubHead style="mb-[18px] sm:w-8/12 md:w-9/12 lg:w-7/12">
            {audience === 'seller'
              ? 'Contrôlez votre boutique en ligne'
              : 'Shopping créatif en toute confiance'}
          </SubHead>
          <Paragraph
            fontSize="text-sm"
            color="text-black-400"
            style="sm:w-3/5 md:w-7/12 lg:w-1/3"
          >
            {audience === 'seller'
              ? 'Prenez le contrôle total de votre eCommerce en possédant le code source et les données qui le font tourner.'
              : 'Découvrez une sélection de produits créatifs africains, achetez en toute sécurité et soutenez les artisans locaux.'}
          </Paragraph>
        </motion.div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
          {features?.map((feature, index) => (
            <FeatureItem key={feature.id} feature={feature} i={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
