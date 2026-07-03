/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  X,
  Printer,
  Calendar,
  Layers,
  MapPin,
  Tag,
  DollarSign,
  Package,
  Wrench,
  ArrowLeftRight,
  UserCheck,
  ClipboardCheck,
  Building,
  Info,
} from "lucide-react";
import { Barang, Mutasi, Maintenance, Peminjaman, StockOpname, Ruangan } from "../types";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  barang: Barang | null;
  ruanganList: Ruangan[];
  mutasiList?: Mutasi[];
  maintenanceList?: Maintenance[];
  peminjamanList?: Peminjaman[];
  stockOpnameList?: StockOpname[];
}

type TabType = "mutasi" | "maintenance" | "peminjaman" | "opname";

export default function DetailModal({
  isOpen,
  onClose,
  barang,
  ruanganList,
  mutasiList = [],
  maintenanceList = [],
  peminjamanList = [],
  stockOpnameList = [],
}: DetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("mutasi");
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  if (!isOpen || !barang) return null;

  // Find Room Name
  const room = ruanganList.find((r) => r.id === barang.ruanganId);

  // Filter histories associated with this barang
  const filteredMutasi = mutasiList.filter((m) => m.barangId === barang.id);
  const filteredMaintenance = maintenanceList.filter((m) => m.barangId === barang.id);
  const filteredPeminjaman = peminjamanList.filter((p) => p.barangId === barang.id);
  
  // Find stock opnames containing this barang
  const filteredOpname = stockOpnameList.filter((so) =>
    so.detail?.some((d) => d.barangId === barang.id)
  );

  const getKondisiBadge = (kondisi: string) => {
    switch (kondisi) {
      case "Baik":
        return (
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-100 dark:border-emerald-900/60 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Baik
          </span>
        );
      case "Rusak Ringan":
        return (
          <span className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-100 dark:border-orange-900/60 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            Rusak Ringan
          </span>
        );
      case "Rusak Berat":
        return (
          <span className="px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full border border-red-100 dark:border-red-900/60 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            Rusak Berat
          </span>
        );
      default:
        return null;
    }
  };

  // Safe Print Label
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto"
      id="modal-detail"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Detail Dossier Aset Sekolah
            </span>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mt-0.5">
              [{barang.kodeInventaris}] {barang.nama}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Label Drawer Overlay */}
        {showPrintLabel ? (
          <div className="p-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-500" /> Preview Label Cetak QR
              </span>
              <button
                onClick={() => setShowPrintLabel(false)}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Tutup Preview
              </button>
            </div>

            {/* Printable Area Card */}
            <div className="flex justify-center">
              <div
                id="printable-label"
                className="bg-white text-slate-900 border-2 border-slate-800 p-4 rounded-lg w-[320px] shadow-sm flex flex-col justify-between"
              >
                <div className="text-center pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-black tracking-wide text-slate-900">
                    SDIT DARUSSALAM BAYAN
                  </h4>
                  <p className="text-[9px] font-semibold text-slate-500 tracking-wider">
                    LABEL INVENTARIS SEKOLAH
                  </p>
                </div>
                <div className="flex items-center gap-4 py-3">
                  {/* Visual QR Simulation */}
                  <div className="w-16 h-16 bg-white border border-slate-300 p-1 rounded shrink-0 flex flex-col justify-between">
                    {/* Fake pixel-matrix matrix of QR */}
                    <div className="grid grid-cols-4 gap-0.5 h-full w-full">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            (i + 3) % 3 === 0 || i === 0 || i === 3 || i === 12 || i === 15
                              ? "bg-slate-950"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-[11px] font-extrabold text-slate-900 leading-tight">
                      {barang.nama}
                    </h5>
                    <p className="text-[10px] font-mono font-bold text-slate-600">
                      {barang.kodeInventaris}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Ruang: {room?.nama || barang.ruanganId}
                    </p>
                    <p className="text-[8px] font-mono text-slate-400">
                      TH: {barang.tahunPerolehan} • {barang.sumberDana}
                    </p>
                  </div>
                </div>
                <div className="text-center pt-1.5 border-t border-dashed border-slate-200">
                  <p className="text-[8px] font-mono text-slate-400">
                    SCAN UNTUK CEK STATUS DOSSIER
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Sekarang
              </button>
            </div>
          </div>
        ) : null}

        <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
          {/* Top Panel - Splitting into visual + metadata columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual Aspect */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative shadow-sm group">
                <img
                  src={barang.foto}
                  alt={barang.nama}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  {getKondisiBadge(barang.kondisi)}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                &ldquo;{barang.keterangan || "Tidak ada keterangan tambahan."}&rdquo;
              </p>
            </div>

            {/* Core Metadata */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    Spesifikasi & Identitas
                  </h4>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    Rp {barang.harga.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => setShowPrintLabel(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Label QR
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3 text-emerald-500" /> Kategori
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {barang.kategori}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-500" /> Penempatan
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {room?.nama || barang.ruanganId}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <Package className="w-3 h-3 text-emerald-500" /> Merek / Type
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {barang.merek}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-500" /> Sumber Dana
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {barang.sumberDana}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-500" /> Th Perolehan
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {barang.tahunPerolehan}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-500" /> Klasifikasi
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {barang.isMultimedia
                      ? "Aset Multimedia"
                      : barang.isPerpustakaan
                      ? "Pustaka Referensi"
                      : "Aset Sarpras Umum"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Histori Tabs Area */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              {(["mutasi", "maintenance", "peminjaman", "opname"] as const).map((tab) => {
                const icons = {
                  mutasi: <ArrowLeftRight className="w-3.5 h-3.5" />,
                  maintenance: <Wrench className="w-3.5 h-3.5" />,
                  peminjaman: <UserCheck className="w-3.5 h-3.5" />,
                  opname: <ClipboardCheck className="w-3.5 h-3.5" />,
                };
                const titles = {
                  mutasi: "Riwayat Mutasi",
                  maintenance: "Riwayat Perbaikan",
                  peminjaman: "Riwayat Peminjaman",
                  opname: "Riwayat Opname",
                };

                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    {icons[tab]} {titles[tab]}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[140px] pt-1">
              
              {/* MUTASI */}
              {activeTab === "mutasi" && (
                <div className="space-y-3">
                  {filteredMutasi.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                      <p className="text-xs text-slate-500">Belum ada riwayat mutasi/perpindahan.</p>
                    </div>
                  ) : (
                    filteredMutasi.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950/10 flex items-start gap-3"
                      >
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-600 shrink-0">
                          <ArrowLeftRight className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Mutasi Terdaftar
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{m.tanggal}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Dari <span className="font-semibold text-slate-800 dark:text-white">{m.dariRuanganNama}</span> ke{" "}
                            <span className="font-semibold text-slate-800 dark:text-white">{m.keRuanganNama}</span>.
                          </p>
                          <p className="text-[10px] text-slate-400 italic mt-0.5">
                            Keterangan: &ldquo;{m.keterangan}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* MAINTENANCE */}
              {activeTab === "maintenance" && (
                <div className="space-y-3">
                  {filteredMaintenance.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                      <Wrench className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                      <p className="text-xs text-slate-500 font-medium">Belum ada riwayat perbaikan/servis.</p>
                    </div>
                  ) : (
                    filteredMaintenance.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950/10 flex items-start gap-3"
                      >
                        <div className="p-1.5 bg-sky-100 dark:bg-sky-950/50 rounded-lg text-sky-600 shrink-0">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Kerusakan: {m.tipeKerusakan}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{m.tanggalMulai}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Teknisi: <span className="font-medium text-slate-800 dark:text-white">{m.teknisi}</span> • Biaya:{" "}
                            <span className="font-bold text-emerald-600">Rp {m.biaya.toLocaleString("id-ID")}</span>
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[10px] text-slate-400 italic">
                              Desc: &ldquo;{m.deskripsi}&rdquo;
                            </p>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                m.status === "Selesai"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PEMINJAMAN */}
              {activeTab === "peminjaman" && (
                <div className="space-y-3">
                  {filteredPeminjaman.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                      <UserCheck className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                      <p className="text-xs text-slate-500 font-medium">Belum ada riwayat peminjaman.</p>
                    </div>
                  ) : (
                    filteredPeminjaman.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950/10 flex items-start gap-3"
                      >
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-amber-600 shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Peminjam: {p.peminjam}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{p.tanggalPinjam}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Keperluan: &ldquo;{p.keperluan}&rdquo;
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[10px] text-slate-400">
                              Estimasi Pengembalian: {p.tanggalKembali}
                            </p>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                p.status === "Kembali"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : p.status === "Dipinjam"
                                  ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                                  : p.status === "Ditolak"
                                  ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* OPNAME */}
              {activeTab === "opname" && (
                <div className="space-y-3">
                  {filteredOpname.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                      <p className="text-xs text-slate-500 font-medium">Aset ini belum masuk dalam audit Stock Opname fisik.</p>
                    </div>
                  ) : (
                    filteredOpname.map((so) => {
                      const detail = so.detail?.find((d) => d.barangId === barang.id);
                      return (
                        <div
                          key={so.id}
                          className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950/10 flex items-start gap-3"
                        >
                          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-600 shrink-0">
                            <ClipboardCheck className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Audit Fisik Selesai
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{so.tanggal}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              Petugas Auditor: <span className="font-semibold text-slate-800 dark:text-white">{so.petugas}</span>
                            </p>
                            {detail && (
                              <div className="flex justify-between items-center mt-2 p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 text-[10px]">
                                <span className="text-slate-500">
                                  Kondisi Terkini: <strong className="text-slate-800 dark:text-slate-200">{detail.kondisiSekarang}</strong>
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    detail.statusKeberadaan === "Ada"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : detail.statusKeberadaan === "Rusak"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {detail.statusKeberadaan === "Ada" ? "✓ Ada" : detail.statusKeberadaan === "Rusak" ? "⚠ Rusak" : "✗ Hilang"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Tutup Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
