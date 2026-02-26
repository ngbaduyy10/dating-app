 "use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import CommonButton from "../atoms/CommonButton";
import User from "@/models/user";
import { likeUser } from "@/lib/actions/user.action";

interface LikeButtonProps {
  user: User;
}

export default function LikeButton({ user }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(Boolean(user.is_liked));
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLiked || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await likeUser(user.id);
      if (!response.success) {
        toast.error("Like failed. Please try again.");
        return;
      }

      setIsLiked(true);
      const fullName = `${user.first_name} ${user.last_name}`;
      if (response.data.isMatch) {
        toast.success("It's a match!");
      } else {
        toast.success(`You liked ${fullName}`);
      }
    } catch {
      toast.error("Like failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonButton
      className="gap-2 px-6 text-lg"
      disabled={isLiked || isLoading}
      onClick={handleLike}
    >
      <Heart className={`w-4 h-4 ${isLiked && "fill-white"}`} />
      {isLiked ? "Liked" : "Like"}
    </CommonButton>
  );
}