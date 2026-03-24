//homepage
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border p-8 shadow text-center space-y-6">
        <h1 className="text-4xl font-bold">Golf Charity Platform</h1>
        <p className="text-gray-600">
          Join monthly prize draws, support charities, and track your golf-based entries.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-black text-white px-6 py-3"
          >
            Sign Up
          </Link>

          <Link
            href="/login"
            className="rounded-lg border px-6 py-3"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}