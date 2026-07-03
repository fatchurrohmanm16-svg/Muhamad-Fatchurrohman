/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Home, Tag, DollarSign, Trash2, Building2, MapPin, Eye, X } from "lucide-react";
import { Ruangan, KategoriBarang, SumberDana, Barang } from "../types";

interface MasterDataViewProps {
  ruanganList: Ruangan[];
  kategoriList: KategoriBarang[];
  sumberDanaList: SumberDana[];
  barangList: Barang[];
  onAddRuangan: (r: Ruangan) => void;
  onAddKategori: (k: KategoriBarang) => void;
  onAddSumberDana: (s: SumberDana) => void;
}

export default function MasterDataView({
  ruanganList,
  kategoriList,
  sumberDanaList,
  barangList,
  onAddRuangan,
  onAddKategori,
  onAddSumberDana,
}: MasterDataViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"ruangan" | "kategori" | "dana">("ruangan");

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ nama: "", tipe: "Ruang Kelas" as any, deskripsi: "", foto: "" });
  const [newCat, setNewCat] = useState({ nama: "", icon: "Archive" });
  const [newDana, setNewDana] = useState({ nama: "" });

  const getAssetStatsForRoom = (roomId: string) => {
    const items = barangList.filter((b) => b.ruanganId === roomId);
    const totalValue = items.reduce((sum, item) => sum + item.harga, 0);
    return { count: items.length, value: totalValue };
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.nama) return;
    const defaultPhotos = [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
    ];
    const randomPhoto = defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];
    
    onAddRuangan({
      id: "r-" + Math.random().toString(36).substr(2, 5),
      nama: newRoom.nama,
      tipe: newRoom.tipe,
      deskripsi: newRoom.deskripsi || "Deskripsi ruangan belum dikonfigurasi.",
      foto: newRoom.foto || randomPhoto,
    });
    setNewRoom({ nama: "", tipe: "Ruang Kelas", deskripsi: "", foto: "" });
    setShowAddModal(false);
  };

  const handleAddCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.nama) return;
    onAddKategori({
      id: "cat-" + Math.random().toString(36).substr(2, 5),
      nama: newCat.nama,
      icon: newCat.icon,
    });
    setNewCat({ nama: "", icon: "Archive" });
    setShowAddModal(false);
  };

  const handleAddDanaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDana.nama) return;
    onAddSumberDana({
      id: "dana-" + Math.random().toString(36).substr(2, 5),
      nama: newDana.nama,
    });
    setNewDana({ nama: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="view-master-data">
      {/* Title Header with custom spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Manajemen Master Data
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Konfigurasi dasar sistem: Unit Ruangan, Kategori Pengarsipan, dan Rekonsiliasi Sumber Dana.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeSubTab === "ruangan"
              ? "Tambah Ruangan"
              : activeSubTab === "kategori"
              ? "Tambah Kategori"
              : "Tambah Sumber Dana"}
          </span>
        </button>
      </div>

      {/* Sub-tabs header matching Vercel Dashboard layout */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveSubTab("ruangan")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "ruangan"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Home className="w-4 h-4" /> Data Ruangan ({ruanganList.length})
        </button>
        <button
          onClick={() => setActiveSubTab("kategori")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "kategori"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Tag className="w-4 h-4" /> Kategori Barang ({kategoriList.length})
        </button>
        <button
          onClick={() => setActiveSubTab("dana")}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "dana"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <DollarSign className="w-4 h-4" /> Sumber Dana ({sumberDanaList.length})
        </button>
      </div>

      {/* Sub-tab Contents */}
      <div className="min-h-96">
        {/* RUANGAN GRID */}
        {activeSubTab === "ruangan" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {ruanganList.map((room) => {
              const stats = getAssetStatsForRoom(room.id);
              return (
                <div
                  key={room.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-500/15 transition-all group"
                >
                  <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                    <img
                      src={room.foto}
                      alt={room.nama}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                      {room.tipe}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">
                        {room.nama}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                        {room.deskripsi}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-800/80 text-xs">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Jumlah Aset
                        </span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">
                          {stats.count} Unit
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Total Valuasi
                        </span>
                        <span className="font-extrabold text-emerald-600">
                          Rp {stats.value.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* KATEGORI LIST */}
        {activeSubTab === "kategori" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">ID Kategori</th>
                  <th className="p-4">Nama Kategori</th>
                  <th className="p-4">Jumlah Aset Terkait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {kategoriList.map((cat, idx) => {
                  const associatedCount = barangList.filter((b) => b.kategori === cat.nama).length;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors text-xs">
                      <td className="p-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-4 font-mono text-slate-500 font-bold">{cat.id}</td>
                      <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">{cat.nama}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">{associatedCount} Unit</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* SUMBER DANA LIST */}
        {activeSubTab === "dana" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">ID Anggaran</th>
                  <th className="p-4">Nama Sumber Dana</th>
                  <th className="p-4">Jumlah Aset Terkait</th>
                  <th className="p-4">Total Investasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sumberDanaList.map((dana, idx) => {
                  const items = barangList.filter((b) => b.sumberDana === dana.nama);
                  const investmentSum = items.reduce((sum, b) => sum + b.harga, 0);
                  return (
                    <tr key={dana.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors text-xs">
                      <td className="p-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-4 font-mono text-slate-500 font-bold">{dana.id}</td>
                      <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">{dana.nama}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">{items.length} Unit</td>
                      <td className="p-4 text-emerald-600 font-bold font-mono">Rp {investmentSum.toLocaleString("id-ID")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Add Data Modal Sheet */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                {activeSubTab === "ruangan"
                  ? "Tambah Ruangan Baru"
                  : activeSubTab === "kategori"
                  ? "Tambah Kategori Baru"
                  : "Tambah Sumber Dana Baru"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {/* ROOM FORM */}
              {activeSubTab === "ruangan" && (
                <form onSubmit={handleAddRoomSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Ruangan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ruang Musik, Kelas 1C"
                      value={newRoom.nama}
                      onChange={(e) => setNewRoom({ ...newRoom, nama: e.target.value })}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Klasifikasi Tipe</label>
                    <select
                      value={newRoom.tipe}
                      onChange={(e) => setNewRoom({ ...newRoom, tipe: e.target.value as any })}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="Ruang Kelas">Ruang Kelas</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Pendukung">Pendukung</option>
                      <option value="Fasilitas Umum">Fasilitas Umum</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Deskripsi / Lokasi</label>
                    <textarea
                      rows={3}
                      placeholder="Gedung Utama, lantai 1, dekat musholla..."
                      value={newRoom.deskripsi}
                      onChange={(e) => setNewRoom({ ...newRoom, deskripsi: e.target.value })}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Simpan Ruangan
                    </button>
                  </div>
                </form>
              )}

              {/* CATEGORY FORM */}
              {activeSubTab === "kategori" && (
                <form onSubmit={handleAddCatSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Kategori</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Media Praktikum, Buku Pelajaran"
                      value={newCat.nama}
                      onChange={(e) => setNewCat({ ...newCat, nama: e.target.value })}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Simpan Kategori
                    </button>
                  </div>
                </form>
              )}

              {/* SOURCE FUNDS FORM */}
              {activeSubTab === "dana" && (
                <form onSubmit={handleAddDanaSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Sumber Dana</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Komite Wali Murid, APBD"
                      value={newDana.nama}
                      onChange={(e) => setNewDana({ ...newDana, nama: e.target.value })}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Simpan Sumber Dana
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
