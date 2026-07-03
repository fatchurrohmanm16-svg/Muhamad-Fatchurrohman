/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trash2, PlusCircle, X, Check, Clock, User, FileText, AlertTriangle } from "lucide-react";
import { Penghapusan, Barang, UserRole } from "../types";

interface PenghapusanViewProps {
  penghapusanList: Penghapusan[];
  barangList: Barang[];
  userRole: UserRole;
  onAddPenghapusan: (del: Penghapusan) => void;
  onApprovePenghapusan: (id: string, status: "Disetujui" | "Ditolak") => void;
}

export default function PenghapusanView({
  penghapusanList,
  barangList,
  userRole,
  onAddPenghapusan,
  onApprovePenghapusan,
}: PenghapusanViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    barangId: "",
    alasan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { barangId, alasan } = formData;

    if (!barangId || !alasan) {
      alert("Mohon pilih barang dan isi alasan penghapusan.");
      return;
    }

    const selectedAsset = barangList.find((b) => b.id === barangId);
    if (!selectedAsset) return;

    onAddPenghapusan({
      id: "del-" + Math.random().toString(36).substr(2, 5),
      barangId,
      barangNama: selectedAsset.nama,
      tanggal: new Date().toISOString().slice(0, 10),
      alasan,
      status: "Menunggu Approval",
      nilaiAsetHapus: selectedAsset.harga,
    });

    setShowAddModal(false);
    setFormData({ barangId: "", alasan: "" });
  };

  return (
    <div className="space-y-6" id="view-penghapusan">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Penghapusan & Pemusnahan Aset
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar legasi permohonan disposisi/penghapusan sarpras yang sudah rusak total (afkir) atau kedaluwarsa.
          </p>
        </div>

        {userRole === "Administrator" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ajukan Penghapusan</span>
          </button>
        )}
      </div>

      {/* Kepala Sekolah Authority Box */}
      {userRole === "Kepala Sekolah" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-slate-700 dark:text-slate-300">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-red-800 dark:text-red-400">Otoritas Penghapusan Aset</p>
            <p className="text-[11px] leading-relaxed">
              Anda berwenang untuk menyetujui penghapusan aset dari daftar inventaris aktif sekolah. Barang yang disetujui akan <strong>dihapus permanen</strong> dari Legasi Inventarisasi agar tidak membebani estimasi total aset sekolah.
            </p>
          </div>
        </div>
      )}

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
              <th className="p-4">Tanggal Pengajuan</th>
              <th className="p-4">Barang / Aset</th>
              <th className="p-4">Alasan Disposisi</th>
              <th className="p-4">Nilai Buku Aset</th>
              <th className="p-4">Status</th>
              {userRole === "Kepala Sekolah" && <th className="p-4 text-center">Tindakan Kepsek</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {penghapusanList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400 text-xs">
                  <Trash2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  Belum ada usulan penghapusan aset.
                </td>
              </tr>
            ) : (
              penghapusanList.map((del) => (
                <tr key={del.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all text-xs">
                  <td className="p-4 font-mono font-semibold text-slate-400">{del.tanggal}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                      {del.barangNama}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{del.barangId}</span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{del.alasan}</td>
                  <td className="p-4 font-bold text-red-600 font-mono">
                    Rp {del.nilaiAsetHapus.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    {del.status === "Menunggu Approval" && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 text-[10px] font-bold rounded-full">
                        Menunggu Persetujuan
                      </span>
                    )}
                    {del.status === "Disetujui" && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 text-[10px] font-bold rounded-full font-mono">
                        Dihapus / Dimusnahkan
                      </span>
                    )}
                    {del.status === "Ditolak" && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 dark:bg-slate-850 dark:text-slate-300 text-[10px] font-bold rounded-full">
                        Ditolak / Dipertahankan
                      </span>
                    )}
                  </td>

                  {/* Kepala Sekolah controls */}
                  {userRole === "Kepala Sekolah" && (
                    <td className="p-4 text-center">
                      {del.status === "Menunggu Approval" ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onApprovePenghapusan(del.id, "Disetujui")}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Setujui Hapus
                          </button>
                          <button
                            onClick={() => onApprovePenghapusan(del.id, "Ditolak")}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Batalkan
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Arsip Keputusan Selesai</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Ajukan Penghapusan Aset Afkir
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Pilih Barang yang Rusak Berat</label>
                <select
                  required
                  value={formData.barangId}
                  onChange={(e) => setFormData({ ...formData, barangId: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangList
                    .filter((b) => b.kondisi === "Rusak Berat") // Prefer disposing damaged assets
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama} ({b.kodeInventaris} - {b.kondisi})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Justifikasi / Alasan Pemusnahan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Barang hancur akibat konsleting listrik, tidak bisa diperbaiki lagi, biaya reparasi melebihi harga beli baru..."
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-lg text-xs font-bold shadow"
                >
                  Ajukan Penghapusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
