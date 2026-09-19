import Subtitle from "../Atoms/subtitle";
import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";
import { useAudience } from "../../context/AudienceContext";
import { User, Building2, Factory, Heart, Sparkles, Gem } from "lucide-react";

const sellerAudiences = [
  {
    icon: <User className="w-8 h-8" />,
    title: "Entrepreneurs",
    description: "Lancez votre business en ligne avec un investissement minimal.",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "PME",
    description: "Développez votre activité avec des outils ecommerce puissants.",
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Grandes entreprises",
    description: "Solutions sur mesure pour les besoins avancés et gros volumes.",
  },
];

const buyerAudiences = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Amoureux de l'artisanat",
    description: "Trouvez des pièces uniques faites par des artisans talentueux africains.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Passionnés de nouveautés",
    description: "Soyez les premiers à découvrir les dernières tendances créatives.",
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Collectionneurs",
    description: "Constituez une collection de créations rares et authentiques.",
  },
];

export default function ForEveryone() {
  const { audience } = useAudience();
  const audiences = audience === 'seller' ? sellerAudiences : buyerAudiences;

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
          <Subtitle style="mb-2">
            {audience === 'seller' ? 'POUR TOUS LES VENDEURS' : 'POUR TOUS LES ACHETEURS'}
          </Subtitle>
          <SubHead style="mb-[18px] sm:w-8/12 lg:w-6/12">
            {audience === 'seller'
              ? 'Des entrepreneurs aux grandes entreprises'
              : 'Des passionnés aux collectionneurs'}
          </SubHead>
          <Paragraph fontSize="text-sm" color="text-black-400" style="sm:w-4/5 lg:w-2/5">
            {audience === 'seller'
              ? 'Drawcaf s\'adapte à vos besoins, que vous démarciez ou que vous gériez une grande activité.'
              : 'Que vous cherchiez un cadeau ou une pièce de collection, Drawcaf a ce qu\'il vous faut.'}
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
