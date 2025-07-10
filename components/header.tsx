"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CoachResponse } from "@/types/profiledatatype";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession()
  const users = session?.user;

  const { data } = useQuery<CoachResponse>({
    queryKey: ["user", users?.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${users?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${users?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!users?.id,
  });

  const user = data?.data;

  return (
    <header className="bg-[#2F3E34] px-6 py-8 flex justify-end">
      <div className="flex items-center gap-2 flex-col">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profileImage} alt="Mr. Raja" />
          <AvatarFallback className="bg-white text-[#4A5D23] text-xs font-medium">{user?.firstName.charAt(1)}</AvatarFallback>
        </Avatar>
      </div>
        {/* <span className="text-white text-sm font-medium">{user?.email} </span> */}
      </div>
    </header>
  )
}
