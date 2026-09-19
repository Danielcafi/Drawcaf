import { motion } from "framer-motion";
import { useAudience } from "../../context/AudienceContext";

export default function GlobalReach() {
  const { audience } = useAudience();

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
                {audience === 'seller' ? 'PORTÉE MONDIALE' : 'BOUTIQUES DU MONDE'}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {audience === 'seller' ? (
                  <>
                    <span className="block">Vendez</span>
                    <span className="block">partout</span>
                    <span className="block">en Afrique</span>
                  </>
                ) : (
                  <>
                    <span className="block">Découvrez</span>
                    <span className="block">des boutiques</span>
                    <span className="block">du monde entier</span>
                  </>
                )}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/80 text-sm md:text-base lg:text-lg mt-6 max-w-md"
              >
                {audience === 'seller'
                  ? 'Vendez aux clients dans toute l\'Afrique avec un support multi-devises et des méthodes de paiement localisées.'
                  : 'Explorez des boutiques de tout le continent africain, du Bénin au Nigéria, du Sénégal à la Côte d\'Ivoire.'}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
