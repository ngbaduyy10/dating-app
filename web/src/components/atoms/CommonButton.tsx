"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; 

interface CommonButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CommonButton({
  children,
  href,
  type = "button",
  disabled = false,
  onClick,
  className,
}: CommonButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "bg-primary text-white cursor-pointer w-fit transition-colors duration-300 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}