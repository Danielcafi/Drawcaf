import SubHead from "../Atoms/subhead"
import Paragraph from "../Atoms/paragraph"
import { Button } from "../Atoms/button";

export default function Blog() {
  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="px-5 py-20 flex flex-col gap-[50px] sm:px-10">
        {/* Head Content */}
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-end">
          <div className="flex flex-col gap-[18px] md:w-8/12 lg:w-auto">
            <SubHead>Notre blog</SubHead>
            <Paragraph>Conseils pratiques, stratégies et techniques pour développer votre business.</Paragraph>
          </div>
          <Button buttonStyle="bg-primary-100 text-white">
            <div className="flex gap-2.5 items-center">
              Tout voir
              <img src="/anchor-right.svg" alt="anchor" />
            </div>
          </Button>
        </div>

        {/* Blog Items */}
        <div className="grid gap-8 font-head md:grid-cols-2 lg:grid-cols-3">
          <section className="flex flex-col gap-6">
            <div className="overflow-hidden">
              <img className="w-full h-auto object-cover hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer" src="/blog-1.png" alt="thumbnail" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black-100">Améliorez la gestion de votre business ecommerce</h3>
            <a className="underline text-black-100 text-lg" href="#">Lire la suite</a>
          </section>
          <section className="flex flex-col gap-6">
            <div className="overflow-hidden">
              <img className="w-full h-auto object-cover hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer" src="/blog-2.png" alt="thumbnail" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black-100">Hébergement ecommerce : comment choisir ?</h3>
            <a className="underline text-black-100 w-fit text-lg" href="#">Lire la suite</a>
          </section>
          <section className="hidden lg:flex flex-col gap-6">
            <div className="overflow-hidden">
              <img className="w-full h-auto object-cover hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer" src="/blog-1.png" alt="thumbnail" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black-100">Tendances ecommerce à suivre en 2026</h3>
            <a className="underline text-black-100 text-lg" href="#">Lire la suite</a>
          </section>
        </div>
      </div>
    </div>
  );
}
