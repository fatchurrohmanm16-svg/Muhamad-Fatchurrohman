/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowLeftRight, PlusCircle, X, MapPin, User, FileText, Move } from "lucide-react";
import { Mutasi, Barang, Ruangan } from "../types";

interface MutasiViewProps {
  mutasiList: Mutasi[];
  barangList: Barang[];
  ruanganList: Ruangan[];
  onAddMutasi: (mut: Mutasi) => void;
}

export default function MutasiView({
  mutasiList,
  barangList,
  ruanganList,
  onAddMutasi,
}: MutasiViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    barangId: "",
    ruanganTujuanId: "",
    pj: "",
    alasan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { barangId, ruanganTujuanId, pj, alasan } = formData;

    if (!barangId || !ruanganTujuanId || !pj) {
      alert("Mohon isi seluruh field wajib.");
      return;
    }

    const selectedAsset = barangList.find((b) => b.id === barangId);
    const selectedTujuanRoom = ruanganList.find((r) => r.id === ruanganTujuanId);
    if (!selectedAsset || !selectedTujuanRoom) return;

    // Source room
    const srcRoom = ruanganList.find((r) => r.id === selectedAsset.ruanganId);
    const asalRoomName = srcRoom ? srcRoom.nama : "Gudang Utama";

    onAddMutasi({
      id: "mut-" + Math.random().toString(36).substr(2, 5),
      barangId,
      barangNama: selectedAsset.nama,
      dariRuanganId: selectedAsset.ruanganId,
      dariRuanganNama: asalRoomName,
      keRuanganId: ruanganTujuanId,
      keRuanganNama: selectedTujuanRoom.nama,
      tanggal: new Date().toISOString().slice(0, 10),
      diajukanOleh: pj,
      keterangan: alasan || "Keperluan distribusi kelengkapan kelas.",
    });

    setShowAddModal(false);
    setFormData({ barangId: "", ruanganTujuanId: "", pj: "", alasan: "" });
  };

  return (
    <div className="space-y-6" id="view-mutasi">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Mutasi & Pemindahan Barang
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar log penempatan mutasi fisik inventaris sekolah dari satu ruangan ke ruangan yang lain.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
        >
          <Move className="w-4 h-4" />
          <span>Mutasi Barang</span>
        </button>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
              <th className="p-4">Tanggal Mutasi</th>
              <th className="p-4">Barang / Aset</th>
              <th className="p-4 text-center">Perpindahan Ruangan</th>
              <th className="p-4">Penanggung Jawab</th>
              <th className="p-4">Alasan Pemindahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mutasiList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 text-xs">
                  <ArrowLeftRight className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  Belum ada catatan mutasi terdaftar.
                </td>
              </tr>
            ) : (
              mutasiList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all text-xs">
                  <td className="p-4 font-mono font-semibold text-slate-400">{m.tanggal}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                      {m.barangNama}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{m.barangId}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950/40 py-1.5 px-3 rounded-xl border border-slate-100 dark:border-slate-850 w-fit mx-auto font-bold text-[10.5px]">
                      <span className="text-slate-500 font-semibold">{m.dariRuanganNama}</span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-600">{m.keRuanganNama}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {m.diajukanOleh}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium italic">{m.keterangan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Mutasi Fisik Barang Inventaris
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Pilih Barang yang Dipindahkan</label>
                <select
                  required
                  value={formData.barangId}
                  onChange={(e) => setFormData({ ...formData, barangId: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangList.map((b) => {
                    const currentRoomObj = ruanganList.find((r) => r.id === b.ruanganId);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.nama} (Di: {currentRoomObj?.nama || "Gudang"} - {b.kodeInventaris})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Ruangan Tujuan Pemindahan</label>
                <select
                  required
                  value={formData.ruanganTujuanId}
                  onChange={(e) => setFormData({ ...formData, ruanganTujuanId: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">-- Pilih Ruangan Tujuan --</option>
                  {ruanganList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nama} ({r.tipe})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Penanggung Jawab Mutasi (PJ)</label>
                <input
                  type="text"
                  required
                  placeholder="Nama guru / staf penanggung jawab"
                  value={formData.pj}
                  onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Alasan Pemindahan</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Guna meratakan fasilitas belajar mengajar di tahun ajaran baru..."
                  value={formData.alasan}
                  onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
                >
                  Proses Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
