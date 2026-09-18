export default function SubHead({ children, width, color, style }) {
  return <h2 className={`${width ? width : "w-full"} ${color ? color : "text-primary-100"} font-head text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold leading-tight ${style}`}>{children}</h2>
}