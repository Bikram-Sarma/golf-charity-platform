"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
  category: string;
};

type Winner = {
  email: string;
  created_at?: string;
};

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // fetch charities
      const { data: charityData } = await supabase
        .from("charities")
        .select("id, name, category")
        .order("created_at", { ascending: false });

      setCharities(charityData || []);

      // fetch latest winner
      const { data: winnerData } = await supabase
        .from("winners")
        .select("email, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (winnerData) {
        setWinner(winnerData);
      }
    };

    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const runDraw = async () => {
    setLoading(true);

    const { data: users } = await supabase
      .from("profiles")
      .select("id, email");

    if (!users || users.length === 0) {
      alert("No users available");
      setLoading(false);
      return;
    }

    const randomUser =
      users[Math.floor(Math.random() * users.length)];

    const { error } = await supabase.from("winners").insert([
      {
        user_id: randomUser.id,
        email: randomUser.email,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Winner selected successfully!");

      // update UI instantly
      setWinner({
        email: randomUser.email,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl rounded-2xl border p-6 shadow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Winner Section */}
        <div className="mb-6 rounded-xl border p-4">
          <h2 className="text-xl font-semibold mb-2">Latest Winner</h2>
          {winner ? (
            <>
              <p><strong>Email:</strong> {winner.email}</p>
              {winner.created_at && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(winner.created_at).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <p>No winner yet.</p>
          )}
        </div>

        <button
          onClick={runDraw}
          className="mb-6 rounded-lg bg-black px-4 py-2 text-white"
        >
          {loading ? "Running Draw..." : "Run Prize Draw"}
        </button>

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