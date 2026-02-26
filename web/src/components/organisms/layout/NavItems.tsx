"use client";

import CommonButton from "@/components/atoms/CommonButton";
import { navigationItems } from "@/utils/constant";
import { usePathname, useRouter } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <CommonButton
            key={item.id}
            onClick={() => router.push(item.href)}
            className={`w-full flex items-center justify-start space-x-3 px-4 py-6 text-md  ${
              isActive
                ? "bg-secondary text-primary"
                : "bg-white text-black hover:bg-secondary"
            }`}
          >
            <IconComponent 
              className={isActive ? "text-primary" : "text-black"} 
            />
            <span className="font-medium">{item.label}</span>
          </CommonButton>
        );
      })}
    </nav>
  )
}