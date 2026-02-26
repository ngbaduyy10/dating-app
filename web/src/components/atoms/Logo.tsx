import LightningIcon from "./LightningIcon";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <LightningIcon size={"xl"} />
      <span className="text-2xl md:text-3xl font-extrabold">Bright</span>
    </div>
  )
}