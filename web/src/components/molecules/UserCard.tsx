'use client';

import UserAvatar from "@/components/atoms/UserAvatar";
import CommonButton from "@/components/atoms/CommonButton";
import User from "@/models/user";
import { useRouter } from "next/navigation";
import DefaultAvatar from "@/static/icons/default_avatar.png";
import { CalendarPlus } from "lucide-react";

interface UserCardProps {
  user: User;
  isMatch?: boolean;
}

export default function UserCard({ user, isMatch = false }: UserCardProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 w-full border border-primary cursor-pointer" onClick={() => router.push(`/profile/${user.id}`)}>
      <div className="flex-between gap-2">
        <div className="flex items-center gap-3">
          <UserAvatar 
            image={DefaultAvatar.src}
            className="w-15 h-15 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex-between gap-2">
              <p className="font-bold text-md truncate">
                {`${user.first_name} ${user.last_name}`}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {user.email}
            </p>
          </div>
        </div>

        {isMatch && (
          <div onClick={(event) => event.stopPropagation()}>
            <CommonButton
              href={`/schedule/${user.match_id}`}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <CalendarPlus className="w-4 h-4" />
            </CommonButton>
          </div>
        )}
      </div>
    </div>
  );
}
