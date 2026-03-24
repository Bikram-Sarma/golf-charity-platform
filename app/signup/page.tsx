"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
};

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [charityPercentage, setCharityPercentage] = useState(10);

  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase.from("charities").select("id, name");
      setCharities(data || []);
    };
    fetchCharities();
  }, [supabase]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email,
        selected_charity_id: selectedCharity || null,
        charity_percentage: charityPercentage,
        role: "user",
      });

      if (profileError) {
        alert(profileError.message);
        return;
      }
    }

    alert("Signup successful");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Create account</h1>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full rounded-lg border p-3"
          value={selectedCharity}
          onChange={(e) => setSelectedCharity(e.target.value)}
        >
          <option value="">Select charity</option>
          {charities.map((charity) => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded-lg border p-3"
          type="number"
          min={10}
          value={charityPercentage}
          onChange={(e) => setCharityPercentage(Number(e.target.value))}
          required
        />

        <button className="w-full rounded-lg bg-black text-white p-3">
          Sign up
        </button>
      </form>
    </div>
  );
}