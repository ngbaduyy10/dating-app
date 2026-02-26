'use client';

import Image from "next/image";
import DefaultAvatar from "@/static/icons/default_avatar.png";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserAvatarProps {
  image?: string;
  className?: string;
  href?: string;
}

export default function UserAvatar({ image, className, href }: UserAvatarProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  }
  return (
    <div className={cn("w-10 h-10 p-0 rounded-full bg-white hover:bg-white overflow-hidden relative cursor-pointer", className)} onClick={handleClick}>
      <Image 
        src={image || DefaultAvatar} 
        alt={"User Avatar"} 
        fill
        className="object-cover" 
      />
    </div>
  )
}