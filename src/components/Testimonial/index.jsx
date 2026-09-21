import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import TestimonialItem from "./testimonialItem";

const sellerTestimonials = [
  {
    name: "Amina Bello",
    role: "Créatrice de bijoux, Porto-Novo",
    quote: "Drawcaf a transformé mon petit atelier en une boutique en ligne pro. En 3 mois, j'ai doublé mes ventes !",
    img: "/testimonial.png",
  },
  {
    name: "Kofi Mensah",
    role: "Artisan textile, Lomé",
    quote: "La plateforme est simple et les paiements Mobile Money fonctionnent parfaitement. Je recommande à tous les artisans.",
    img: "/testimonial.png",
  },
];

export default function Testimonial() {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const testimonials = sellerTestimonials;

  return (
    <div className="bg-tertiary-300">
      <div className="container mx-auto max-w-[1344px]">
        <div className="px-5 pt-10 pb-[52px] sm:px-10">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            className="relative"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <TestimonialItem testimonial={t} />
              </SwiperSlide>
            ))}
            <div className="absolute bottom-0 right-0 sm:right-10 z-10 flex items-center gap-6">
              <button
                className="testimonial-button prev"
                ref={navigationPrevRef}
              >
                <img
                  className="w-2 h-4.5 object-cover"
                  src="/arrow-left.svg"
                  alt="arrow"
                />
              </button>
              <button
                className="testimonial-button next"
                ref={navigationNextRef}
              >
                <img
                  className="w-2 h-4.5 object-cover"
                  src="/arrow-right.svg"
                  alt="arrow"
                />
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
