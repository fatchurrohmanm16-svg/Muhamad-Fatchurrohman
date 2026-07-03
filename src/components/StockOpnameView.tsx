/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ClipboardCheck, Plus, Play, CheckCircle2, ShieldCheck, QrCode, X, Search, Check, AlertTriangle, User } from "lucide-react";
import { StockOpname, Barang } from "../types";

interface StockOpnameViewProps {
  stockOpnameList: StockOpname[];
  barangList: Barang[];
  onStartOpname: (petugas: string) => void;
  onFinalizeOpname: (id: string, auditedItems: { [id: string]: "Ada" | "Rusak" | "Hilang" }) => void;
  onOpenScanner: () => void;
  scannedResult: string | null;
  onClearScannedResult: () => void;
}

export default function StockOpnameView({
  stockOpnameList,
  barangList,
  onStartOpname,
  onFinalizeOpname,
  onOpenScanner,
  scannedResult,
  onClearScannedResult,
}: StockOpnameViewProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [auditedItems, setAuditedItems] = useState<{ [id: string]: "Ada" | "Rusak" | "Hilang" }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const activeSession = stockOpnameList.find((s) => s.id === activeSessionId);

  const handleStartNewSession = () => {
    const petugas = prompt("Nama Lengkap Petugas Pemeriksa:", "Staf Sarpras") || "Staf Sarpras";
    onStartOpname(petugas);
    // Find the newly added draft ID or just automatically select the last draft
    setTimeout(() => {
      const drafts = stockOpnameList.filter((s) => s.status === "Draft");
      if (drafts.length > 0) {
        setActiveSessionId(drafts[drafts.length - 1].id);
        setAuditedItems({});
      }
    }, 100);
  };

  const handleAuditItem = (barangId: string, status: "Ada" | "Rusak" | "Hilang") => {
    setAuditedItems((prev) => ({
      ...prev,
      [barangId]: status,
    }));
    onClearScannedResult();
  };

  const handleFinalize = () => {
    if (!activeSessionId) return;
    if (Object.keys(auditedItems).length === 0) {
      alert("Mohon audit minimal 1 barang sebelum melakukan finalisasi.");
      return;
    }
    onFinalizeOpname(activeSessionId, auditedItems);
    setActiveSessionId(null);
    setAuditedItems({});
  };

  // If scanner produced a result, try matching it to an item
  const matchedScannedItem = React.useMemo(() => {
    if (!scannedResult) return null;
    return barangList.find(
      (b) => b.kodeInventaris === scannedResult || b.qrCode === scannedResult
    );
  }, [scannedResult, barangList]);

  // Filter items in active session
  const filteredBarangList = React.useMemo(() => {
    return barangList.filter((b) =>
      b.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.kodeInventaris.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [barangList, searchQuery]);

  return (
    <div className="space-y-6" id="view-stock-opname">
      {/* Active Session Mode */}
      {activeSession ? (
        <div className="space-y-6 animate-fade-in">
          {/* Active Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Sesi Audit Aktif (Running)
              </span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                Stock Opname - {activeSession.tanggal}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Petugas: <strong>{activeSession.petugas}</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onOpenScanner}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <QrCode className="w-4 h-4" /> Buka Kamera QR Scanner
              </button>
              <button
                onClick={handleFinalize}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/15"
              >
                <ShieldCheck className="w-4 h-4" /> Finalisasi Audit ({Object.keys(auditedItems).length})
              </button>
              <button
                onClick={() => {
                  setActiveSessionId(null);
                  setAuditedItems({});
                }}
                className="px-3 py-2.5 border border-slate-200 text-slate-400 hover:bg-slate-50 rounded-xl cursor-pointer"
                title="Keluar Sesi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scanner result overlay trigger */}
          {scannedResult && (
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-scale-up">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-200">
                  Hasil Pemindaian QR Kamera Berhasil
                </span>
                {matchedScannedItem ? (
                  <h4 className="text-sm font-black">
                    Aset Ditemukan: {matchedScannedItem.nama} ({matchedScannedItem.kodeInventaris})
                  </h4>
                ) : (
                  <h4 className="text-sm font-bold">
                    Aset tidak terdaftar dalam basis data: <span className="font-mono">{scannedResult}</span>
                  </h4>
                )}
              </div>

              {matchedScannedItem ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAuditItem(matchedScannedItem.id, "Ada")}
                    className="px-3.5 py-2 bg-white text-emerald-700 hover:bg-emerald-50 font-extrabold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Kondisi Baik
                  </button>
                  <button
                    onClick={() => handleAuditItem(matchedScannedItem.id, "Rusak")}
                    className="px-3.5 py-2 bg-orange-500 text-white hover:bg-orange-600 font-extrabold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Kondisi Rusak
                  </button>
                  <button
                    onClick={() => handleAuditItem(matchedScannedItem.id, "Hilang")}
                    className="px-3.5 py-2 bg-red-600 text-white hover:bg-red-700 font-extrabold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Status Hilang
                  </button>
                </div>
              ) : (
                <button
                  onClick={onClearScannedResult}
                  className="px-3 py-1.5 border border-white/30 hover:bg-white/10 rounded text-xs font-semibold"
                >
                  Tutup
                </button>
              )}
            </div>
          )}

          {/* Table List of items to Audits manually */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Daftar Seluruh Barang Tersimpan ({filteredBarangList.length} Unit)
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama barang / kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="p-4 w-32">Kode Inventaris</th>
                      <th className="p-4">Nama Barang</th>
                      <th className="p-4">Kondisi Saat Ini</th>
                      <th className="p-4 text-center w-64">Audit Fisik</th>
                      <th className="p-4 text-right">Hasil Catat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredBarangList.map((item) => {
                      const auditedStatus = auditedItems[item.id];
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 text-xs">
                          <td className="p-4 font-mono font-bold text-slate-500">{item.kodeInventaris}</td>
                          <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">{item.nama}</td>
                          <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{item.kondisi}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleAuditItem(item.id, "Ada")}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                                  auditedStatus === "Ada"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 hover:bg-emerald-50 text-slate-600 dark:bg-slate-800"
                                }`}
                              >
                                Ada / Baik
                              </button>
                              <button
                                onClick={() => handleAuditItem(item.id, "Rusak")}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                                  auditedStatus === "Rusak"
                                    ? "bg-orange-600 text-white"
                                    : "bg-slate-100 hover:bg-orange-50 text-slate-600 dark:bg-slate-800"
                                }`}
                              >
                                Rusak
                              </button>
                              <button
                                onClick={() => handleAuditItem(item.id, "Hilang")}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                                  auditedStatus === "Hilang"
                                    ? "bg-red-600 text-white"
                                    : "bg-slate-100 hover:bg-red-50 text-slate-600 dark:bg-slate-800"
                                }`}
                              >
                                Hilang
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right font-bold">
                            {auditedStatus ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  auditedStatus === "Ada"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : auditedStatus === "Rusak"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-850"
                                }`}
                              >
                                ✓ {auditedStatus}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic font-normal text-[10px]">Belum Diperiksa</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SESSIONS ARCHIVE LIST */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Stock Opname / Audit Fisik Sarpras
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Laporan pemeriksaan berkala dan verifikasi kondisi lapangan barang-barang inventaris sekolah secara menyeluruh.
              </p>
            </div>

            <button
              onClick={handleStartNewSession}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Mulai Audit Baru</span>
            </button>
          </div>

          {/* Sessions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stockOpnameList.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5.5 shadow-sm hover:border-emerald-500/20 transition-all flex flex-col justify-between h-56 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono font-bold text-[10px]">{session.tanggal}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        session.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-orange-100 text-orange-850 dark:bg-orange-950 dark:text-orange-400 animate-pulse"
                      }`}
                    >
                      {session.status === "Selesai" ? "Sealed / Final" : "Draft / Running"}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                    Audit {session.petugas}
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-50 dark:border-slate-800/80 text-[10.5px]">
                    <div className="text-center bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase">Cocok</span>
                      <span className="font-black text-emerald-600 text-xs">{session.barangAda}</span>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase">Rusak</span>
                      <span className="font-black text-orange-600 text-xs">{session.barangRusak}</span>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase">Hilang</span>
                      <span className="font-black text-red-600 text-xs">{session.barangHilang}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase">Aset Diperiksa: {session.totalBarang}</span>
                  {session.status === "Draft" ? (
                    <button
                      onClick={() => {
                        setActiveSessionId(session.id);
                        setAuditedItems({});
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Play className="w-3 h-3" /> Lanjutkan Audit
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Terkunci
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
