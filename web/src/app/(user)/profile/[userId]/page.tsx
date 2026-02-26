import { ApiResponse } from "@/dto/apiResponse.dto";
import User from "@/models/user";
import { fetchApiWithAuth } from "@/utils/api";
import DefaultAvatar from "@/static/icons/default_avatar.png";
import Image from "next/image";
import { auth } from "@/auth";
import { Gender } from "@/types";
import LikeButton from "@/components/molecules/LikeButton";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const session = await auth();
  const isUser = session?.user?.id === userId;
  const response = (await fetchApiWithAuth(`/user/${userId}`, {
    method: "GET",
    cache: "no-store",
  })) as ApiResponse<User>;
  const user = response.data;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="relative h-60 md:h-80 w-full bg-gray-200">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0">
          <div className="relative w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden">
            <Image
              src={DefaultAvatar.src}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-18 px-6 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-2 md:items-start items-center text-center md:text-left">
          <div>
            <h1 className="text-3xl font-bold">{`${user.first_name} ${user.last_name}`}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.age} years old</p>
            <p className="text-gray-500">{user.gender === Gender.MALE ? "Male" : "Female"}</p>
          </div>
          
          {!isUser && <LikeButton user={user} />}
        </div>
      </div>
    </div>
  );
}