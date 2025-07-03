"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string().min(3),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/register", {
        email: data.email,
        password: data.password,
        fullname: data.fullname,
      });
      router.push("/auth/login");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Pendaftaran gagal");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Daftar Akun</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block mb-1 text-sm font-medium">Fullname</label>
          <input
            type="text"
            {...register("fullname")}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs">{errors.fullname.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {isSubmitting ? "Mendaftarkan..." : "Daftar"}
        </button>

        <p className="text-sm text-center">
          Sudah punya akun?{" "}
          <a href="/auth/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}