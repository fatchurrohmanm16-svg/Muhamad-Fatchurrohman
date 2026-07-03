/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PlusCircle, Check, X, AlertCircle, Clock, CheckCircle2, User, HelpCircle, FileText } from "lucide-react";
import { Pengadaan, Ruangan, KategoriBarang, SumberDana, UserRole } from "../types";

interface PengadaanViewProps {
  pengadaanList: Pengadaan[];
  ruanganList: Ruangan[];
  kategoriList: KategoriBarang[];
  sumberDanaList: SumberDana[];
  userRole: UserRole;
  currentUserName: string;
  onAddRequest: (req: Pengadaan) => void;
  onUpdateRequestStatus: (id: string, status: "Disetujui" | "Ditolak" | "Selesai", feedback?: string) => void;
}

export default function PengadaanView({
  pengadaanList,
  ruanganList,
  kategoriList,
  sumberDanaList,
  userRole,
  currentUserName,
  onAddRequest,
  onUpdateRequestStatus,
}: PengadaanViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Request states
  const [formData, setFormData] = useState({
    namaBarang: "",
    kategori: "",
    ruanganId: "",
    sumberDana: "",
    merek: "",
    jumlah: 1,
    hargaSatuan: "",
    catatan: "",
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const { namaBarang, kategori, ruanganId, sumberDana, merek, jumlah, hargaSatuan, catatan } = formData;

    if (!namaBarang || !kategori || !ruanganId || !sumberDana || !hargaSatuan) {
      alert("Mohon lengkapi seluruh kolom wajib.");
      return;
    }

    const price = parseInt(hargaSatuan.toString().replace(/[^0-9]/g, "")) || 0;

    onAddRequest({
      id: "req-" + Math.random().toString(36).substr(2, 5),
      namaBarang,
      kategori,
      ruanganId,
      sumberDana,
      merek: merek || "Tanpa Merek",
      jumlah: parseInt(jumlah.toString()) || 1,
      hargaSatuan: price,
      totalHarga: price * (parseInt(jumlah.toString()) || 1),
      diajukanOleh: currentUserName,
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      status: "Menunggu Persetujuan",
      catatan,
    });

    setShowAddModal(false);
    setFormData({
      namaBarang: "",
      kategori: "",
      ruanganId: "",
      sumberDana: "",
      merek: "",
      jumlah: 1,
      hargaSatuan: "",
      catatan: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Persetujuan":
        return (
          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 shrink-0" /> Menunggu Persetujuan
          </span>
        );
      case "Disetujui":
        return (
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> Disetujui Kepala Sekolah
          </span>
        );
      case "Ditolak":
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <X className="w-3.5 h-3.5 shrink-0" /> Ditolak
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
            <Check className="w-3.5 h-3.5 shrink-0" /> Selesai Masuk Inventaris
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" id="view-pengadaan">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Pengadaan Sarana & Prasarana Baru
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Alur pengajuan belanja modal aset baru sekolah. Memerlukan peninjauan dan persetujuan Kepala Sekolah.
          </p>
        </div>

        {/* Teachers and Admins can request procurement */}
        {userRole !== "Kepala Sekolah" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Pengadaan</span>
          </button>
        )}
      </div>

      {/* Kepala Sekolah Approval Panel Greeting */}
      {userRole === "Kepala Sekolah" && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-slate-700 dark:text-slate-300">
          <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-white">Panel Otoritas Kepala Sekolah</p>
            <p className="text-[11px] leading-relaxed">
              Anda login sebagai <strong>Kepala Sekolah</strong>. Anda berwenang menyetujui (Approve) atau menolak pengajuan belanja aset sarpras dari para guru dan administrator sekolah di bawah ini.
            </p>
          </div>
        </div>
      )}

      {/* Procurement requests table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Tanggal / Pemohon</th>
                <th className="p-4">Nama Barang / Merek</th>
                <th className="p-4">Kategori / Ruang</th>
                <th className="p-4">Jumlah / Anggaran</th>
                <th className="p-4">Estimasi Biaya</th>
                <th className="p-4">Status</th>
                {userRole !== "Guru" && <th className="p-4 text-center w-48">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pengadaanList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs font-medium">Belum ada pengajuan pengadaan terdaftar.</p>
                  </td>
                </tr>
              ) : (
                pengadaanList.map((req) => {
                  const room = ruanganList.find((r) => r.id === req.ruanganId);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-xs">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] text-slate-400">{req.tanggalPengajuan}</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {req.diajukanOleh}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                            {req.namaBarang}
                          </span>
                          <span className="text-[10px] text-slate-400">{req.merek}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-slate-600 dark:text-slate-400 font-medium block">
                            {req.kategori}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{room?.nama || req.ruanganId}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{req.jumlah} Unit</span>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded px-1.5 py-0.2 uppercase block w-fit">
                            Dana: {req.sumberDana}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold font-mono text-slate-800 dark:text-slate-100">
                        <div className="space-y-0.5">
                          <span>Rp {req.totalHarga.toLocaleString("id-ID")}</span>
                          <span className="text-[9px] text-slate-400 font-normal block">
                            Rp {req.hargaSatuan.toLocaleString("id-ID")}/satuan
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(req.status)}</td>

                      {/* Approval Actions or Selesaikan actions */}
                      {userRole !== "Guru" && (
                        <td className="p-4 text-center">
                          {req.status === "Menunggu Persetujuan" && userRole === "Kepala Sekolah" && (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => onUpdateRequestStatus(req.id, "Disetujui")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt("Sebutkan alasan penolakan:") || "";
                                  onUpdateRequestStatus(req.id, "Ditolak", reason);
                                }}
                                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3 h-3" /> Tolak
                              </button>
                            </div>
                          )}

                          {req.status === "Disetujui" && userRole === "Administrator" && (
                            <button
                              onClick={() => onUpdateRequestStatus(req.id, "Selesai")}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow flex items-center justify-center gap-1 cursor-pointer"
                              title="Barang sudah dibeli, daftarkan otomatis ke Inventaris"
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> Registrasi Aset (Selesai)
                            </button>
                          )}

                          {req.status === "Selesai" && (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Arsip Masuk</span>
                          )}

                          {req.status === "Ditolak" && (
                            <span className="text-[10px] text-red-400 font-semibold italic">Ditolak</span>
                          )}

                          {req.status === "Menunggu Persetujuan" && userRole === "Administrator" && (
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-orange-500" /> Menunggu Kepsek
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ajukan Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                Ajukan Pengadaan Barang Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Barang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meja Gambar, Proyektor"
                  value={formData.namaBarang}
                  onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
                  <select
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Pilih --</option>
                    {kategoriList.map((c) => (
                      <option key={c.id} value={c.nama}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Ruang Penempatan</label>
                  <select
                    required
                    value={formData.ruanganId}
                    onChange={(e) => setFormData({ ...formData, ruanganId: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Pilih --</option>
                    {ruanganList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Jumlah (Qty)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.jumlah}
                    onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Sumber Dana</label>
                  <select
                    required
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="">-- Pilih --</option>
                    {sumberDanaList.map((d) => (
                      <option key={d.id} value={d.nama}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 150000"
                    value={formData.hargaSatuan}
                    onChange={(e) => setFormData({ ...formData, hargaSatuan: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Merek</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sony"
                    value={formData.merek}
                    onChange={(e) => setFormData({ ...formData, merek: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Catatan Keperluan</label>
                <textarea
                  rows={2}
                  placeholder="Kebutuhan mendesak untuk praktek kelas IPA..."
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
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
