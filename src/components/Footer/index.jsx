import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const footerContent = {
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
    hidden: { opacity: 0, y: 100 },
  };

  const footerImage = {
    visible: { y: 0, transition: { duration: 1 } },
    hidden: { y: -100 },
  };

  return (
    <div className="bg-primary-300">
      {/* Contact CTA */}
      <div className="border-b border-white/15 relative overflow-hidden">
        <div className="container mx-auto max-w-[1344px]">
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={footerContent}
            className="px-5 py-10 flex flex-col items-center text-center sm:px-10"
          >
            <h2 className="font-head font-bold text-3xl sm:text-4xl text-white mb-[18px] sm:w-9/12 md:w-9/12 lg:w-6/12">
              Vous avez un projet en tête ?
            </h2>
            <p className="text-white/70 text-sm mb-[30px] sm:w-7/12 lg:w-5/12">
              Rejoignez Drawcaf et commencez à vendre vos créations aujourd'hui.
            </p>
            <Link
              to="/register"
              className="w-full sm:w-9/12 sm:w-fit lg:w-fit bg-white text-primary-300 font-bold py-3 px-8 hover:bg-primary-300 hover:border-white hover:text-white border-2 border-white transition-all duration-200"
            >
              COMMENCER MAINTENANT
            </Link>
          </motion.section>
        </div>

        <motion.img
          initial="hidden"
          whileInView="visible"
          animate={{
            rotate: 360,
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          }}
          variants={footerImage}
          className="hidden lg:block absolute top-1/4 -left-28"
          src="/eclipse-1.svg"
          alt="eclipse"
        />
        <motion.img
          initial="hidden"
          whileInView="visible"
          animate={{
            rotate: 360,
            transition: { duration: 30, repeat: Infinity, ease: "easeInOut" },
          }}
          variants={footerImage}
          className="hidden lg:block absolute top-[20%] -right-24"
          src="/eclipse-2.svg"
          alt="eclipse"
        />
      </div>

      {/* Footer */}
      <footer className="container mx-auto max-w-[1344px]">
        <div className="px-5 py-10 flex flex-col sm:px-10 lg:grid grid-cols-3 lg:gap-y-32">
          <div className="lg:col-span-1">
            <Link to="/" className="block">
              <img
                className="h-10 w-auto mb-10 lg:mb-0"
                src="/logo-full-white.svg"
                alt="drawcaf-logo"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-9 font-head mb-[52px] md:grid-cols-4 lg:col-span-2 lg:mb-0">
            <div>
              <h6 className="mb-5 font-bold text-xl text-white">Plateforme</h6>
              <div className="flex flex-col gap-4 text-white/70 text-base">
                <Link to="/recherche" className="footer-link hover:text-white transition-colors">
                  Rechercher
                </Link>
                <Link to="/register" className="footer-link hover:text-white transition-colors">
                  Ouvrir une boutique
                </Link>
                <Link to="/about" className="footer-link hover:text-white transition-colors">
                  À propos
                </Link>
                <Link to="/pricing" className="footer-link hover:text-white transition-colors">
                  Tarifs
                </Link>
              </div>
            </div>
            <div>
              <h6 className="mb-5 font-bold text-xl text-white">Acheteur</h6>
              <div className="flex flex-col gap-4 text-white/70 text-base">
                <Link to="/recherche" className="footer-link hover:text-white transition-colors">
                  Explorer
                </Link>
                <Link to="/cart" className="footer-link hover:text-white transition-colors">
                  Panier
                </Link>
                <Link to="/commandes" className="footer-link hover:text-white transition-colors">
                  Mes commandes
                </Link>
                <Link to="/wishlist" className="footer-link hover:text-white transition-colors">
                  Liste de souhaits
                </Link>
              </div>
            </div>
            <div>
              <h6 className="mb-5 font-bold text-xl text-white">Vendeur</h6>
              <div className="flex flex-col gap-4 text-white/70 text-base">
                <Link to="/register" className="footer-link hover:text-white transition-colors">
                  Commencer
                </Link>
                <Link to="/dashboard" className="footer-link hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard/products" className="footer-link hover:text-white transition-colors">
                  Mes produits
                </Link>
              </div>
            </div>
            <div>
              <h6 className="mb-5 font-bold text-xl text-white">Support</h6>
              <div className="flex flex-col gap-4 text-white/70 text-base">
                <Link to="/faq" className="footer-link hover:text-white transition-colors">
                  FAQ
                </Link>
                <Link to="/contact" className="footer-link hover:text-white transition-colors">
                  Contact
                </Link>
                <Link to="/conditions" className="footer-link hover:text-white transition-colors">
                  Conditions
                </Link>
                <Link to="/confidentialite" className="footer-link hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center lg:col-span-3 md:flex justify-between items-center">
            <p className="font-head text-white font-medium text-base order-1">
              © 2026 Drawcaf. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
