/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserCheck, PlusCircle, X, User, Calendar, Check, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Peminjaman, Barang, UserRole } from "../types";

interface PeminjamanViewProps {
  peminjamanList: Peminjaman[];
  barangList: Barang[];
  userRole: UserRole;
  currentUserName: string;
  onAddLoan: (loan: Peminjaman) => void;
  onReturnLoan: (id: string, receiver: string) => void;
  onApproveLoan: (id: string) => void;
}

export default function PeminjamanView({
  peminjamanList,
  barangList,
  userRole,
  currentUserName,
  onAddLoan,
  onReturnLoan,
  onApproveLoan,
}: PeminjamanViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    barangId: "",
    peminjamNama: "",
    alasan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { barangId, peminjamNama, alasan } = formData;

    if (!barangId || !peminjamNama) {
      alert("Mohon pilih barang dan isi nama peminjam.");
      return;
    }

    const selectedAsset = barangList.find((b) => b.id === barangId);
    if (!selectedAsset) return;

    onAddLoan({
      id: "loan-" + Math.random().toString(36).substr(2, 5),
      barangId,
      barangNama: selectedAsset.nama,
      peminjam: peminjamNama,
      tanggalPinjam: new Date().toISOString().slice(0, 10),
      tanggalKembali: "",
      jumlah: 1,
      status: userRole === "Administrator" ? "Dipinjam" : "Menunggu Approval", // Auto approve if admin
      keperluan: alasan || "Kebutuhan kegiatan belajar mengajar (KBM).",
    });

    setShowAddModal(false);
    setFormData({ barangId: "", peminjamNama: "", alasan: "" });
  };

  return (
    <div className="space-y-6" id="view-peminjaman">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Peminjaman Sarana Sekolah
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Kendali pinjam-pakai barang sarpras yang bersifat mobile / portabel oleh guru atau staf untuk kegiatan sekolah.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Peminjaman</span>
        </button>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
              <th className="p-4">Tanggal Pinjam</th>
              <th className="p-4">Barang / Aset</th>
              <th className="p-4">Nama Peminjam</th>
              <th className="p-4">Tujuan / Keperluan</th>
              <th className="p-4">Tanggal Pengembalian</th>
              <th className="p-4">Status</th>
              {userRole === "Administrator" && <th className="p-4 text-center">Tindakan Admin</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {peminjamanList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                  <UserCheck className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  Belum ada log peminjaman sarpras.
                </td>
              </tr>
            ) : (
              peminjamanList.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all text-xs">
                  <td className="p-4 font-mono font-semibold text-slate-400">{loan.tanggalPinjam}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                      {loan.barangNama}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{loan.barangId}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {loan.peminjam}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{loan.keperluan}</td>
                  <td className="p-4 font-semibold">
                    {loan.tanggalKembali ? (
                      <span className="text-emerald-600 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {loan.tanggalKembali}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium italic">Sedang Dipakai</span>
                    )}
                  </td>
                  <td className="p-4">
                    {loan.status === "Menunggu Approval" && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 text-[10px] font-bold rounded-full">
                        Menunggu Persetujuan
                      </span>
                    )}
                    {loan.status === "Dipinjam" && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400 text-[10px] font-bold rounded-full animate-pulse">
                        Sedang Dipinjam
                      </span>
                    )}
                    {loan.status === "Kembali" && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                        Selesai Dikembalikan
                      </span>
                    )}
                    {loan.status === "Ditolak" && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 text-[10px] font-bold rounded-full">
                        Ditolak
                      </span>
                    )}
                  </td>

                  {/* Admin controls */}
                  {userRole === "Administrator" && (
                    <td className="p-4 text-center">
                      {loan.status === "Menunggu Approval" && (
                        <button
                          onClick={() => onApproveLoan(loan.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Setujui
                        </button>
                      )}

                      {loan.status === "Dipinjam" && (
                        <button
                          onClick={() => {
                            const receiver = prompt("Nama Staf/Admin Penerima Pengembalian:", currentUserName) || currentUserName;
                            onReturnLoan(loan.id, receiver);
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-[10px] shadow flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Proses Kembali
                        </button>
                      )}

                      {loan.status === "Kembali" && (
                        <span className="text-[10px] text-slate-400 italic">Arsip Kembali Selesai</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Ajukan Pinjam-Pakai Barang
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Pilih Barang Mobiler</label>
                <select
                  required
                  value={formData.barangId}
                  onChange={(e) => setFormData({ ...formData, barangId: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">-- Pilih Barang Mobiler --</option>
                  {barangList
                    .filter((b) => b.kondisi === "Baik") // Only borrow good condition items
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama} ({b.kodeInventaris})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap Peminjam</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz Ahmad, S.Pd."
                  value={formData.peminjamNama}
                  onChange={(e) => setFormData({ ...formData, peminjamNama: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Tujuan / Keperluan Pinjam</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Menampilkan video presentasi praktikum IPA di kelas 5B..."
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow animate-fade-in"
                >
                  Ajukan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
