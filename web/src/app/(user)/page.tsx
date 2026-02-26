import UserCard from "@/components/molecules/UserCard";
import User from "@/models/user";
import { ApiResponse } from "@/dto/apiResponse.dto";
import { fetchApiWithAuth } from "@/utils/api";

export default async function Home() {
  const response: ApiResponse<User[]> = (await fetchApiWithAuth("/user", {
    method: "GET",
    cache: "no-store",
  }));
  const recommendedUsers = response.data;

  return (
    <div className="p-4 h-full bg-white rounded-md shadow-sm">
      <h1 className="text-3xl font-semibold mb-4">Recommend Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {recommendedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
