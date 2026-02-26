"use client";

import Image from "next/image";
import DefaultAvatar from "@/static/icons/default_avatar.png";
import { signOut, useSession } from "next-auth/react";
import { User as UserIcon, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import User from "@/models/user";

export default function AvatarDropDown() {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    router.push("/login");
    setLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild> 
        <Button className="w-10 h-10 p-0 rounded-full bg-white hover:bg-white overflow-hidden focus-visible:ring-0">
          <Image 
            src={DefaultAvatar} 
            alt={`${user.first_name} ${user.last_name}`} 
            className="object-cover w-full h-full" 
            width={40}
            height={40}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-gray-200">
        <div className="flex items-center justify-start gap-2 px-2 py-1">
          <div className="flex flex-col">
            <p className="font-sm truncate">{`${user.first_name} ${user.last_name}`}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${user.id}`)}
        >
          <UserIcon className="mr-1" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut className="mr-1" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}