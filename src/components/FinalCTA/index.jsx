import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAudience } from "../../context/AudienceContext";
import { Store, ShoppingBag } from "lucide-react";

export default function FinalCTA() {
  const { audience } = useAudience();

  return (
    <div className="bg-primary-100 overflow-hidden">
      <div className="container mx-auto max-w-[1344px]">
        <div className="px-5 py-20 flex flex-col items-center gap-10 sm:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center gap-8"
          >
            <h2 className="font-head font-bold text-3xl sm:text-4xl lg:text-5xl text-white sm:w-8/12 lg:w-6/12">
              {audience === 'seller'
                ? 'Prêt à vendre en ligne ?'
                : 'Envie de découvrir ?'}
            </h2>
            <p className="text-lg text-white/80 sm:w-4/5 lg:w-3/5">
              {audience === 'seller'
                ? 'Rejoignez des milliers d\'artisans et créateurs africains qui utilisent Drawcaf pour développer leur business.'
                : 'Explorez des centaines de boutiques créatives africaines et trouvez des pièces uniques qui vous ressemblent.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-video md:aspect-[21/9] lg:aspect-[2.5/1]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="/sell-international.webm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-100/90 via-primary-100/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {audience === 'seller' ? (
                    <>
                      <Link
                        to="/register"
                        className="bg-white text-primary-100 px-8 py-4 font-head font-bold text-lg hover:bg-tertiary-200 transition-all duration-200 text-center flex items-center justify-center gap-2"
                      >
                        <Store className="w-5 h-5" />
                        COMMENCER GRATUITEMENT
                      </Link>
                      <Link
                        to="/login"
                        className="border-2 border-white text-white px-8 py-4 font-head font-bold text-lg hover:bg-white hover:text-primary-100 transition-all duration-200 text-center"
                      >
                        SE CONNECTER
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/recherche"
                        className="bg-white text-primary-100 px-8 py-4 font-head font-bold text-lg hover:bg-tertiary-200 transition-all duration-200 text-center flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        EXPLORER LES BOUTIQUES
                      </Link>
                      <Link
                        to="/login"
                        className="border-2 border-white text-white px-8 py-4 font-head font-bold text-lg hover:bg-white hover:text-primary-100 transition-all duration-200 text-center"
                      >
                        SE CONNECTER
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
