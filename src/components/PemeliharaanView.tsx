/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PlusCircle, Wrench, CheckCircle, Clock, PlayCircle, X, Settings2, ShieldAlert } from "lucide-react";
import { Maintenance, Barang, UserRole } from "../types";

interface PemeliharaanViewProps {
  maintenanceList: Maintenance[];
  barangList: Barang[];
  userRole: UserRole;
  onAddMaintenance: (m: Maintenance) => void;
  onUpdateStatus: (id: string, status: "Diproses" | "Selesai", biaya?: number, teknisi?: string) => void;
}

export default function PemeliharaanView({
  maintenanceList,
  barangList,
  userRole,
  onAddMaintenance,
  onUpdateStatus,
}: PemeliharaanViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    barangId: "",
    tipeKerusakan: "",
    biaya: "",
    teknisi: "",
    catatan: "",
  });

  // Action states for Admin to modify a record
  const [editingRecord, setEditingRecord] = useState<Maintenance | null>(null);
  const [editFields, setEditFields] = useState({ biaya: "", teknisi: "" });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const { barangId, tipeKerusakan, biaya, teknisi, catatan } = formData;

    if (!barangId || !tipeKerusakan) {
      alert("Mohon pilih barang dan jabarkan tipe kerusakan.");
      return;
    }

    const selectedAsset = barangList.find((b) => b.id === barangId);
    if (!selectedAsset) return;

    onAddMaintenance({
      id: "mnt-" + Math.random().toString(36).substr(2, 5),
      barangId,
      barangNama: selectedAsset.nama,
      tipeKerusakan,
      tanggalMulai: new Date().toISOString().slice(0, 10),
      biaya: parseInt(biaya) || 0,
      teknisi: teknisi || "Vendor Rekanan Sekolah",
      status: "Menunggu Approval",
      deskripsi: catatan || "Pengajuan perbaikan sarpras rutin.",
    });

    setShowAddModal(false);
    setFormData({ barangId: "", tipeKerusakan: "", biaya: "", teknisi: "", catatan: "" });
  };

  const handleApplyAdminUpdate = (status: "Diproses" | "Selesai") => {
    if (!editingRecord) return;
    const resolvedBiaya = parseInt(editFields.biaya) || editingRecord.biaya;
    const resolvedTeknisi = editFields.teknisi || editingRecord.teknisi;

    onUpdateStatus(editingRecord.id, status, resolvedBiaya, resolvedTeknisi);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6" id="view-pemeliharaan">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Pemeliharaan & Pemulihan Aset
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar penanganan perbaikan dan restorasi kelayakan sarana prasarana sekolah yang rusak atau aus.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Perbaikan</span>
        </button>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
              <th className="p-4">Tanggal Mulai</th>
              <th className="p-4">Barang / Aset</th>
              <th className="p-4">Kerusakan / Masalah</th>
              <th className="p-4">Teknisi Servis</th>
              <th className="p-4">Estimasi Biaya</th>
              <th className="p-4">Status</th>
              {userRole === "Administrator" && <th className="p-4 text-center">Kontrol Admin</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {maintenanceList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                  <Wrench className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  Belum ada log perbaikan tercatat.
                </td>
              </tr>
            ) : (
              maintenanceList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all text-xs">
                  <td className="p-4 font-mono font-semibold text-slate-400">{m.tanggalMulai}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                      {m.barangNama}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{m.barangId}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600 dark:text-slate-400 font-medium block">
                      {m.tipeKerusakan}
                    </span>
                    <span className="text-[9px] text-slate-400">{m.deskripsi}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{m.teknisi}</td>
                  <td className="p-4 font-bold font-mono text-emerald-600">
                    Rp {m.biaya.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    {m.status === "Menunggu Approval" && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Awaiting
                      </span>
                    )}
                    {m.status === "Diproses" && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                        <PlayCircle className="w-3.5 h-3.5" /> Sedang Diperbaiki
                      </span>
                    )}
                    {m.status === "Selesai" && (
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3.5 h-3.5" /> Selesai / Baik
                        </span>
                        {m.tanggalSelesai && <span className="text-[8px] font-mono text-slate-400 block">Tutup: {m.tanggalSelesai}</span>}
                      </div>
                    )}
                  </td>

                  {/* Admin controls */}
                  {userRole === "Administrator" && (
                    <td className="p-4 text-center">
                      {m.status !== "Selesai" ? (
                        <button
                          onClick={() => {
                            setEditingRecord(m);
                            setEditFields({ biaya: m.biaya.toString(), teknisi: m.teknisi });
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 dark:text-slate-200 text-slate-700 rounded-lg font-bold text-[10px] shadow-xs flex items-center gap-1 mx-auto cursor-pointer transition-all"
                        >
                          <Settings2 className="w-3.5 h-3.5" /> Tindak Lanjut
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Arsip Tutup</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Action Control Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Kelola Maintenance: {editingRecord.barangNama}
              </h3>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Teknisi Servis</label>
                <input
                  type="text"
                  value={editFields.teknisi}
                  onChange={(e) => setEditFields({ ...editFields, teknisi: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Biaya Perbaikan (Rp)</label>
                <input
                  type="number"
                  value={editFields.biaya}
                  onChange={(e) => setEditFields({ ...editFields, biaya: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                {editingRecord.status === "Menunggu Approval" && (
                  <button
                    onClick={() => handleApplyAdminUpdate("Diproses")}
                    className="py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Proses Servis
                  </button>
                )}
                <button
                  onClick={() => handleApplyAdminUpdate("Selesai")}
                  className={`py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow ${
                    editingRecord.status === "Menunggu Approval" ? "" : "col-span-2"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Selesaikan & Restorasi Aset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Ajukan Pemeliharaan / Perbaikan Aset
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Pilih Barang yang Rusak</label>
                <select
                  required
                  value={formData.barangId}
                  onChange={(e) => setFormData({ ...formData, barangId: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">-- Pilih Aset --</option>
                  {barangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama} ({b.kodeInventaris} - {b.kondisi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Deskripsi Tipe Kerusakan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Layar bergaris, Kipas mati, Engsel patah"
                  value={formData.tipeKerusakan}
                  onChange={(e) => setFormData({ ...formData, tipeKerusakan: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Vendor Servis / Teknisi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Asus Service Center"
                    value={formData.teknisi}
                    onChange={(e) => setFormData({ ...formData, teknisi: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Estimasi Biaya (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 350000"
                    value={formData.biaya}
                    onChange={(e) => setFormData({ ...formData, biaya: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Catatan Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="AC berbunyi berisik di dalam kelas 3A..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
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
                  Ajukan Servis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
