"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookHeart, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, InputFrame } from "@/components/ui/field";
import { Surface } from "@/components/ui/surface";

export default function AdminLoginPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setError("Code salah. Coba cek lagi.");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F1E8] px-6 text-[#3D2F2A]">
      <Surface padding="lg" className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3D6D0]">
            <BookHeart className="h-7 w-7 text-[#C98276]" />
          </div>

          <h1 className="text-3xl font-bold">Dearly Admin</h1>
          <p className="mt-2 text-sm text-[#7C6A62]">
            Masukkan shared code untuk mengelola binder.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Admin Code">
            <InputFrame className="bg-[#FFFDF9] shadow-none">
              <LockKeyhole className="h-5 w-5 text-[#9B8B83]" />
              <input
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter code"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#9B8B83]"
              />
            </InputFrame>
          </Field>

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoading || !code}
            className="w-full"
          >
            {isLoading ? "Checking..." : "Enter Admin"}
          </Button>
        </form>
      </Surface>
    </main>
  );
}
