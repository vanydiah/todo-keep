"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const checklistSchema = z.object({
  name: z.string().min(1, "Checklist name is required"),
  description: z.string().optional(),
});

type ChecklistForm = z.infer<typeof checklistSchema>;

export default function CreateChecklistPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChecklistForm>({
    resolver: zodResolver(checklistSchema),
  });

  const onSubmit = async (data: ChecklistForm) => {
    try {
      await api.post("/checklist", data);
      router.push("/dashboard"); // redirect to checklist list
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal membuat checklist");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Buat Checklist Baru</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block mb-1 text-sm font-medium">Nama Checklist</label>
          <input
            {...register("name")}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Deskripsi (opsional)</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </main>
  );
}