import CardItem from "./cardItem";
import { useAudience } from "../../context/AudienceContext";

export default function Card() {
  const { audience } = useAudience();

  const sellerCards = [
    {
      subtitle: "BOUTIQUE PWA",
      subhead: "Possédez tout à vie avec un seul paiement.",
      paragraph: "Construisez votre business de rêve. Plus jamais de frais mensuels ou de paiements récurrents.",
      img: "/card-1.png",
      primary: true,
    },
    {
      subtitle: "PAIEMENT UNIQUE",
      subhead: "Vendez vos produits facilement.",
      paragraph: "Vendez vos créations en ligne et transformez vos réseaux sociaux en canaux de vente.",
      img: "/card-2.png",
      primary: false,
    },
  ];

  const buyerCards = [
    {
      subtitle: "ACHAT SÉCURISÉ",
      subhead: "Payez en toute sécurité avec Mobile Money.",
      paragraph: "MTN, Moov, carte bancaire — choisissez votre moyen de paiement préféré, protégé à chaque transaction.",
      img: "/card-1.png",
      primary: true,
    },
    {
      subtitle: "LIVRAISON FIABLE",
      subhead: "Recevez vos commandes chez vous.",
      paragraph: "Suivez vos commandes en temps réel et recevez vos produits partout au Bénin et en Afrique.",
      img: "/card-2.png",
      primary: false,
    },
  ];

  const cards = audience === 'seller' ? sellerCards : buyerCards;

  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="flex flex-col px-5 py-20 gap-20 sm:px-10 overflow-hidden lg:gap-40">
        {cards.map((card, index) => (
          <CardItem key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
