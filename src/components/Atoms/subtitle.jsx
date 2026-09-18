export default function Subtitle({ children, style }) {
  return <p className={`text-primary-100 font-head font-semibold text-sm md:text-base tracking-wider ${style}`}>{children}</p>
}