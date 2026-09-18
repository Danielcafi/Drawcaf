import { useEffect, useState } from "react";
import NavbarDropdown from "./navbarDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const handleOpen = () => setIsOpen((prev) => !prev);

  const handleScrollPos = () => {
    const currentScrollPos = window.scrollY

    if (currentScrollPos > scrollPos) {
      setIsOpen(false)
    }

    setScrollPos(currentScrollPos)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollPos)

    return () => {
      window.removeEventListener("scroll", handleScrollPos)
    }
  }, [scrollPos]);

  return (
    <nav className="bg-tertiary-300 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto max-w-[1344px]">
        <div className="h-16 md:h-20 p-5 md:py-6 lg:px-5 flex items-center justify-between z-20 bg-tertiary-300 relative">
          {/* Icon */}
          <a href="#">
            <img
              className="h-8 md:h-10 w-auto z-20 relative"
              src="/logo-full.svg"
              alt="drawcaf-logo"
            />
          </a>

          {/* Hamburger */}
          <div
            onClick={handleOpen}
            className={`${isOpen ? "open" : ""
              } flex flex-col items-center w-fit gap-[7px] cursor-pointer md:hidden z-20`}
          >
            <span className="transition-all duration-500 ease-in-out h-[2px] w-5 bg-black-500 rounded-full"></span>
            <span className="transition-all duration-500 ease-in-out h-[2px] w-4 bg-black-500 rounded-full"></span>
            <span className="transition-all duration-500 ease-in-out h-[2px] w-5 bg-black-500 rounded-full"></span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center md:gap-4 lg:gap-8 text-black-200 text-base lg:text-lg font-head font-medium">
            <a href="#" className="navlink active-navlink">
              Product
            </a>
            <a href="#" className="navlink">
              Solutions
            </a>
            <a href="#" className="navlink">
              Pricing
            </a>
            <a href="#" className="navlink">
              Resources
            </a>
            <a href="#" className="navlink">
              Customers
            </a>
          </div>

          {/* Button */}
          <div className="hidden md:flex md:gap-4 lg:gap-[25px] items-center text-base lg:text-lg font-head font-medium">
            <a href="#">
              <p className="text-black-100 underline cursor-pointer">Login</p>
            </a>
            <a href="#">
              <button className="text-white bg-primary-100 md:py-2.5 px-4 py-3.5 px-[25px]">
                Start free
              </button>
            </a>
          </div>
        </div>

        {/* Navbar Menu (Mobile) */}
        <NavbarDropdown isOpen={isOpen} />
      </div>
    </nav>
  );
}