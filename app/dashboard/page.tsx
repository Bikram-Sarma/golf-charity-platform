"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Profile = {
  full_name: string;
  email: string;
  charity_percentage: number;
};

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, charity_percentage")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

        {profile ? (
          <div className="space-y-3">
            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Charity Contribution:</strong> {profile.charity_percentage}%</p>

            <button
              onClick={handleLogout}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}