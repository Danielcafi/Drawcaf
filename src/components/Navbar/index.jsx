import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useStoreStore, useCartStore } from "../../store";
import { getImageUrl } from "../../utils/image";
import { ShoppingCart, User, Search, ChevronDown, Store, Package, LogOut, Home, BarChart3 } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, profile, signOut } = useAuthStore();
  const { currentStore } = useStoreStore();
  const itemCount = useCartStore(state => state.getItemCount());
  const navigate = useNavigate();

  const hasStore = !!currentStore;

  const handleOpen = () => setIsOpen((prev) => !prev);

  const handleScrollPos = () => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > scrollPos) {
      setIsOpen(false);
    }
    setScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollPos);
    return () => {
      window.removeEventListener("scroll", handleScrollPos);
    };
  }, [scrollPos]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-tertiary-300 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto max-w-[1344px]">
        <div className="h-16 md:h-20 p-5 md:py-6 lg:px-5 flex items-center justify-between z-20 bg-tertiary-300 relative">
          {/* Logo */}
          <Link to="/">
            <img
              className="h-8 md:h-10 w-auto z-20 relative"
              src="/logo-full.svg"
              alt="drawcaf-logo"
            />
          </Link>

          {/* Hamburger */}
          <div
            onClick={handleOpen}
            className={`${isOpen ? "open" : ""} flex flex-col items-center w-fit gap-[7px] cursor-pointer md:hidden z-20`}
          >
            <span className="transition-all duration-500 ease-in-out h-[2px] w-5 bg-black-500 rounded-full"></span>
            <span className="transition-all duration-500 ease-in-out h-[2px] w-4 bg-black-500 rounded-full"></span>
            <span className="transition-all duration-500 ease-in-out h-[2px] w-5 bg-black-500 rounded-full"></span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center md:gap-4 lg:gap-8 text-black-200 text-base lg:text-lg font-head font-medium">
            <Link to="/recherche" className="navlink">
              Produits
            </Link>
            <Link to="/about" className="navlink">
              À propos
            </Link>
            <Link to="/faq" className="navlink">
              FAQ
            </Link>
            <Link to="/contact" className="navlink">
              Contact
            </Link>
            <Link to="/conditions" className="navlink">
              Conditions
            </Link>
            <Link to="/confidentialite" className="navlink">
              Confidentialité
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex md:gap-4 lg:gap-[25px] items-center text-base lg:text-lg font-head font-medium">
            {user ? (
              <>
                <Link to="/commandes" className="text-black-100 hover:text-primary-100">
                  Mes commandes
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-black-100 hover:text-primary-100 transition-colors"
                  >
                    <img
                      src={getImageUrl(profile?.avatar_url, profile?.updated_at) || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=1E3A8B&color=fff`}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-sm text-gray-900">{profile?.full_name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                        {hasStore && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-primary-100/10 text-primary-100 px-2 py-0.5 rounded-full font-medium">
                            <Store className="w-3 h-3" />
                            Vendeur
                          </span>
                        )}
                      </div>

                      <div className="py-2">
                        <Link
                          to="/"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Home className="w-4 h-4" />
                          Accueil
                        </Link>

                        <Link
                          to="/compte"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Mon compte
                        </Link>

                        {hasStore && (
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-100 font-medium hover:bg-primary-100/5 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Dashboard vendeur
                          </Link>
                        )}

                        {hasStore && (
                          <Link
                            to={`/boutique/${currentStore.slug}`}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            Voir ma boutique
                          </Link>
                        )}

                        <Link
                          to="/commandes"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Mes commandes
                        </Link>

                        {!hasStore && (
                          <Link
                            to="/onboarding"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary-100 hover:bg-primary-100/5 transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            Devenir vendeur
                          </Link>
                        )}

                        {profile?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            Dashboard admin
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="border border-primary-100 text-primary-100 md:py-2.5 px-4 py-3.5 hover:bg-primary-100 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link to="/register">
                  <button className="text-white bg-primary-100 md:py-2.5 px-4 py-3.5 hover:bg-primary-300 transition-colors">
                    Commencer
                  </button>
                </Link>
              </>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-black-100" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-100 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div className="py-4 space-y-2">
            <Link to="/recherche" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              Produits
            </Link>
            <Link to="/about" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              À propos
            </Link>
            <Link to="/faq" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              FAQ
            </Link>
            <Link to="/contact" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            <Link to="/conditions" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              Conditions
            </Link>
            <Link to="/confidentialite" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
              Confidentialité
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <Link to="/compte" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
                    Mon compte
                  </Link>
                  <Link to="/commandes" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
                    Mes commandes
                  </Link>
                  {!hasStore && (
                    <Link to="/onboarding" className="block py-2 text-primary-100 font-medium" onClick={() => setIsOpen(false)}>
                      Devenir vendeur
                    </Link>
                  )}
                  {hasStore && (
                    <Link to="/dashboard" className="block py-2 text-primary-100 font-medium" onClick={() => setIsOpen(false)}>
                      Dashboard vendeur
                    </Link>
                  )}
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="block py-2 text-red-600 font-medium" onClick={() => setIsOpen(false)}>
                      Dashboard admin
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="block py-2 text-red-600 hover:text-red-700">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-primary-100 font-medium hover:text-primary-300" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register" className="block py-2 text-black-200 hover:text-primary-100" onClick={() => setIsOpen(false)}>
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
