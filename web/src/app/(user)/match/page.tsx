import UserCard from "@/components/molecules/UserCard";
import { ApiResponse } from "@/dto/apiResponse.dto";
import User from "@/models/user";
import { fetchApiWithAuth } from "@/utils/api";

export default async function MatchPage() {
  const response = (await fetchApiWithAuth("/match", {
    method: "GET",
    cache: "no-store",
  })) as ApiResponse<User[]>;
  const matchedUsers = response.data ?? [];

  return (
    <div className="p-4 h-full bg-white rounded-md shadow-sm">
      <h1 className="text-3xl font-semibold mb-4">Matched Users</h1>
      {matchedUsers.length === 0 ? (
        <p className="text-muted-foreground">No matched users yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {matchedUsers.map((user) => (
            <UserCard key={user.id} user={user} isMatch />
          ))}
        </div>
      )}
    </div>
  );
}