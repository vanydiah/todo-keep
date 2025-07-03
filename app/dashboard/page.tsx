"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

// 🎨 Warna pastel random tetap (berdasar ID)
function getRandomPastelColor(seed: number): string {
  const colors = [
    "#FDE68A", // yellow
    "#A7F3D0", // green
    "#BFDBFE", // blue
    "#FBCFE8", // pink
    "#DDD6FE", // purple
    "#FCD34D", // amber
    "#FFE4E6", // rose
    "#E0F2FE", // sky
    "#F0FDF4", // emerald
  ];
  return colors[seed % colors.length];
}

type Checklist = {
  id: number;
  name: string;
  description: string;
  created_at: string;
};

export default function DashboardPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChecklists = async () => {
    try {
      const res = await api.get("/checklist");
      setChecklists(res.data.data);
    } catch (err) {
      console.error("Gagal ambil checklist", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus checklist ini?")) return;
    try {
      await api.delete(`/checklist/${id}`);
      setChecklists((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus", err);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Checklist Saya</h1>
          <Link
            href="/checklists/new"
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow transition"
          >
            + Checklist
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : checklists.length === 0 ? (
          <p className="text-gray-600">Belum ada checklist.</p>
        ) : (
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {checklists.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl p-4 shadow hover:shadow-md transition relative"
                style={{
                  backgroundColor: getRandomPastelColor(item.id),
                }}
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  {item.description && (
                    <p className="text-sm text-gray-700">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Link
                    href={`/checklists/${item.id}`}
                    className="p-2 rounded-full hover:bg-white/40 transition"
                    title="Lihat Detail"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-full hover:bg-white/40 transition"
                    title="Hapus Checklist"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}