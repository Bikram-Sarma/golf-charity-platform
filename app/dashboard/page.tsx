"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Profile = {
  full_name: string;
  email: string;
  charity_percentage: number;
};

type Score = {
  id: string;
  score: number;
  created_at: string;
};

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, charity_percentage")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: scoresData } = await supabase
        .from("scores")
        .select("id, score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setScores(scoresData || []);
    };

    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleAddScore = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      return;
    }

    if (!newScore) {
      alert("Please enter a score");
      return;
    }

    const scoreValue = Number(newScore);

    if (isNaN(scoreValue)) {
      alert("Score must be a number");
      return;
    }

    const { error } = await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: scoreValue,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    const { data: scoresData } = await supabase
      .from("scores")
      .select("id, score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setScores(scoresData || []);
    setNewScore("");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border p-6 shadow">
        <h1 className="mb-4 text-3xl font-bold">User Dashboard</h1>

        {profile ? (
          <div className="space-y-3">
            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Charity Contribution:</strong> {profile.charity_percentage}%</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Add Golf Score</h2>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter score"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              className="rounded-lg border px-4 py-2"
            />
            <button
              onClick={handleAddScore}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Save Score
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">My Scores</h2>
          {scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <p><strong>Score:</strong> {item.score}</p>
                  <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No scores added yet.</p>
          )}
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