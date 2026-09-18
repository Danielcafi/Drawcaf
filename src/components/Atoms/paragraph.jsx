export default function Paragraph({ children, fontSize, color, style}) {
  return <p className={`font-body ${color ? color : "text-black-300"} text-base md:text-lg lg:text-xl ${fontSize} ${style}`}>{children}</p>
}