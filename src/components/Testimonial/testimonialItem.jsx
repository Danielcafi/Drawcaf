import SubHead from "../Atoms/subhead"
import Paragraph from "../Atoms/paragraph"

export default function TestimonialItem({ testimonial }) {
  const t = testimonial || {
    name: "John Carter",
    role: "Fashion Shoes Co.",
    quote: "Drawcaf a transformé mon business. La plateforme est intuitive et le support client est réactif.",
    img: "/testimonial.png",
  };

  return (
    <div className="flex flex-col gap-[50px] items-center md:flex-row md:items-end lg:gap-44 lg:items-center">
      <img
        className="w-[300px] md:w-8/12 lg:w-2/5 rounded-2xl"
        src={t.img}
        alt={t.name}
      />
      <div className="flex flex-col sm:w-10/12">
        <SubHead style="mb-[18px] w-9/12 md:w-full">
          Ce que disent nos clients
        </SubHead>
        <Paragraph style="mb-9">
          "{t.quote}"
        </Paragraph>
        <div className="flex flex-col font-head">
          <h5 className="text-primary-100 mb-2.5 font-bold text-xl">{t.name}</h5>
          <p className="text-black-300 text-lg">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
