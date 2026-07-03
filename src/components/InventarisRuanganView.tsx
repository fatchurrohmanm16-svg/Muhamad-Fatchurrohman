/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Home, Eye, MapPin, X, Archive, DollarSign, BarChart3, ArrowLeftRight } from "lucide-react";
import { Ruangan, Barang } from "../types";
import { DonutChart } from "./Charts";

interface InventarisRuanganViewProps {
  ruanganList: Ruangan[];
  barangList: Barang[];
  onSelectItem: (barang: Barang) => void;
}

export default function InventarisRuanganView({
  ruanganList,
  barangList,
  onSelectItem,
}: InventarisRuanganViewProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Filter Rooms based on types
  const roomsByType = useMemo(() => {
    const classes = ruanganList.filter((r) => r.tipe === "Ruang Kelas");
    const admin = ruanganList.filter((r) => r.tipe === "Administrasi");
    const support = ruanganList.filter((r) => r.tipe === "Pendukung");
    const general = ruanganList.filter((r) => r.tipe === "Fasilitas Umum");

    return [
      { title: "Ruang Kelas", items: classes },
      { title: "Administrasi", items: admin },
      { title: "Pendukung", items: support },
      { title: "Fasilitas Umum", items: general },
    ];
  }, [ruanganList]);

  // Calculations for selected room
  const selectedRoomDetails = useMemo(() => {
    if (!selectedRoomId) return null;
    const room = ruanganList.find((r) => r.id === selectedRoomId);
    if (!room) return null;

    const items = barangList.filter((b) => b.ruanganId === selectedRoomId);
    const totalValue = items.reduce((sum, b) => sum + b.harga, 0);

    const baik = items.filter((b) => b.kondisi === "Baik").length;
    const ringan = items.filter((b) => b.kondisi === "Rusak Ringan").length;
    const berat = items.filter((b) => b.kondisi === "Rusak Berat").length;

    const conditionData = [
      { label: "Baik", value: baik, color: "#10b981" },
      { label: "Rusak Ringan", value: ringan, color: "#f97316" },
      { label: "Rusak Berat", value: berat, color: "#ef4444" },
    ];

    return {
      room,
      items,
      totalValue,
      conditionData,
      counts: { baik, ringan, berat },
    };
  }, [selectedRoomId, ruanganList, barangList]);

  // Dynamic values helper for grid
  const getRoomSummary = (roomId: string) => {
    const items = barangList.filter((b) => b.ruanganId === roomId);
    const totalValue = items.reduce((sum, b) => sum + b.harga, 0);
    return { count: items.length, value: totalValue };
  };

  return (
    <div className="space-y-8" id="view-inventaris-ruangan">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
          Inventarisasi Penempatan Ruangan
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Pantau sebaran aset dan nilai sarpras sekolah yang ditempatkan pada setiap unit ruang kelas, kantor, dan fasilitas umum.
        </p>
      </div>

      {/* Grid classified by group */}
      <div className="space-y-8">
        {roomsByType.map((group, idx) => (
          <div key={idx} className="space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-600 px-1 border-l-2 border-emerald-500 pl-2">
              {group.title} ({group.items.length} Ruang)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
              {group.items.map((room) => {
                const summary = getRoomSummary(room.id);
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-500/25 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                      <img
                        src={room.foto}
                        alt={room.nama}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-extrabold text-sm leading-tight">{room.nama}</h4>
                        <p className="text-[9px] text-slate-200 truncate mt-0.5">{room.deskripsi}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 grid grid-cols-2 gap-3 text-xs border-t border-slate-50 dark:border-slate-800">
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Aset Terdata</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                          <Archive className="w-3.5 h-3.5 text-emerald-600" /> {summary.count} Unit
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Estimasi Nilai</span>
                        <span className="font-extrabold text-emerald-600 block mt-0.5 font-mono truncate">
                          Rp {summary.value.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Room Details Drawer/Modal Overlay */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col my-8 animate-fade-in">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Daftar Inventarisasi Ruang
                  </span>
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-tight">
                    {selectedRoomDetails.room.nama} ({selectedRoomDetails.room.tipe})
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Drawer body */}
            <div className="p-6 overflow-y-auto space-y-6 max-h-[65vh] grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Room Profile & Donut Chart (col-span-5) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-100 relative">
                  <img
                    src={selectedRoomDetails.room.foto}
                    alt={selectedRoomDetails.room.nama}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Catatan Lokasi</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 shadow-inner">
                    {selectedRoomDetails.room.deskripsi}
                  </p>
                </div>

                {/* Condition Chart of this specific room */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3.5 bg-slate-50/40 dark:bg-slate-950/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Grafik Kondisi Aset Ruang</span>
                  {selectedRoomDetails.items.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">Tidak ada grafik untuk ruangan kosong.</p>
                  ) : (
                    <DonutChart data={selectedRoomDetails.conditionData} title="Kondisi Fisik" />
                  )}
                </div>
              </div>

              {/* Right Column: Items Table List (col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Jumlah Aset Terkait</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                      {selectedRoomDetails.items.length}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Unit Barang Terdata</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Kapitalisasi</span>
                    <span className="text-lg font-black text-emerald-600 mt-1.5 block font-mono truncate">
                      Rp {selectedRoomDetails.totalValue.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Beban Investasi Ruang</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daftar Barang Penempatan</span>
                  
                  <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedRoomDetails.items.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <Archive className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                          <p className="text-xs">Ruangan ini masih kosong dari barang inventaris.</p>
                        </div>
                      ) : (
                        selectedRoomDetails.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.foto}
                                alt={item.nama}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-lg object-cover border bg-slate-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate block">
                                  {item.nama}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                                  {item.kodeInventaris} • {item.kategori}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  item.kondisi === "Baik"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : item.kondisi === "Rusak Ringan"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.kondisi}
                              </span>
                              <button
                                onClick={() => {
                                  onSelectItem(item);
                                  setSelectedRoomId(null);
                                }}
                                className="p-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer"
                                title="Buka Detail Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-end">
              <button
                onClick={() => setSelectedRoomId(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-700 text-white rounded-lg cursor-pointer"
              >
                Tutup Peta Ruang
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
