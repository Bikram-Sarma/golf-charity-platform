"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
  category: string;
};

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase
        .from("charities")
        .select("id, name, category")
        .order("created_at", { ascending: false });

      setCharities(data || []);
    };

    fetchCharities();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl rounded-2xl border p-6 shadow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <h2 className="text-xl font-semibold mb-3">Charities</h2>

        <div className="space-y-3">
          {charities.map((charity) => (
            <div key={charity.id} className="rounded-xl border p-4">
              <p><strong>Name:</strong> {charity.name}</p>
              <p><strong>Category:</strong> {charity.category}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}