"use client";

import api from "@lib/api";
import Modal from "../../../components/Modal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Helper untuk warna pastel berdasarkan ID
function getPastelColor(seed: number): string {
  const colors = [
    "#FDE68A", "#A7F3D0", "#BFDBFE",
    "#FBCFE8", "#DDD6FE", "#FCD34D",
    "#FFE4E6", "#E0F2FE", "#F0FDF4"
  ];
  return colors[seed % colors.length];
}

type Item = {
  id: number;
  name: string;
  itemCompletionStatus: boolean;
};

type Checklist = {
  id: number;
  name: string;
  description?: string;
};

export default function ChecklistDetailPage() {
  const { id } = useParams();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleAdd,
    reset: resetAdd,
  } = useForm<{ name: string }>();

  const {
    register: registerRename,
    handleSubmit: handleRename,
  } = useForm<{ name: string }>();

  const fetchChecklistData = async () => {
    try {
      const resChecklist = await api.get("/checklist");
      const found = resChecklist.data.data.find(
        (c: Checklist) => c.id === Number(id)
      );
      setChecklist(found || null);

      const resItems = await api.get(`/checklist/${id}/item`);
      setItems(resItems.data.data);
    } catch (err) {
      console.error("Gagal fetch data checklist", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (data: { name: string }) => {
    try {
      await api.post(`/checklist/${id}/item`, data);
      setShowAddModal(false);
      resetAdd();
      fetchChecklistData();
    } catch (err) {
      console.error("Gagal menambahkan item", err);
    }
  };

  const renameItem = async (data: { name: string }) => {
    try {
      await api.put(`/checklist/${id}/item/rename/${selectedItem?.id}`, data);
      setSelectedItem(null);
      fetchChecklistData();
    } catch (err) {
      console.error("Gagal mengganti nama item", err);
    }
  };

  const toggleItemStatus = async (itemId: number) => {
    try {
      await api.put(`/checklist/${id}/item/${itemId}`);
      fetchChecklistData();
    } catch (err) {
      console.error("Gagal ubah status item", err);
    }
  };

  const deleteItem = async (itemId: number) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    try {
      await api.delete(`/checklist/${id}/item/${itemId}`);
      setSelectedItem(null);
      fetchChecklistData();
    } catch (err) {
      console.error("Gagal menghapus item", err);
    }
  };

  useEffect(() => {
    fetchChecklistData();
  }, [id]);

  return (
    <main
      className="min-h-screen p-6 transition-colors"
      style={{
        backgroundColor: checklist ? getPastelColor(checklist.id) : "#f3f4f6",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : checklist ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{checklist.name}</h1>
                {checklist.description && (
                  <p className="text-gray-600 text-sm">{checklist.description}</p>
                )}
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow"
              >
                + Tambah Item
              </button>
            </div>

            {/* Item List */}
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-full px-4 py-3 shadow flex justify-between items-center cursor-pointer hover:bg-white/70"
                >
                  <span
                    className={
                      item.itemCompletionStatus
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }
                  >
                    {item.name}
                  </span>
                  <span className="text-gray-400 text-xs">klik untuk detail</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-600">Checklist tidak ditemukan</p>
        )}
      </div>

      {/* Modal Tambah Item */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd(addItem)} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-500">Tambah Item</h2>
            <input
              {...registerAdd("name", { required: true })}
              placeholder="Nama item"
              className="w-full px-3 py-2 border rounded-md text-gray-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail/Edit Item */}
      {selectedItem && (
        <Modal onClose={() => setSelectedItem(null)}>
          <form onSubmit={handleRename(renameItem)} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-600">Detail Item</h2>
            <input
              {...registerRename("name")}
              defaultValue={selectedItem.name}
              className="w-full px-3 py-2 border rounded-md text-gray-600" 
            />
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button
                type="button"
                onClick={() => toggleItemStatus(selectedItem.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full w-full"
              >
                {selectedItem.itemCompletionStatus
                  ? "Mark Done"
                  : "Undo Mark"}
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-full w-full"
              >
                Ubah Nama
              </button>
              <button
                type="button"
                onClick={() => deleteItem(selectedItem.id)}
                className="bg-red-400 text-white px-4 py-2 rounded-full w-full"
              >
                Hapus
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}