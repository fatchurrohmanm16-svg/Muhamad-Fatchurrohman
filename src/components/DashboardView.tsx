/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import {
  Archive,
  Home,
  CheckCircle,
  AlertTriangle,
  Flame,
  UserCheck,
  Wrench,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { Barang, Ruangan, Maintenance, ActivityLog, Peminjaman } from "../types";
import { BarChart, DonutChart } from "./Charts";

interface DashboardViewProps {
  barangList: Barang[];
  ruanganList: Ruangan[];
  maintenanceList: Maintenance[];
  logsList: ActivityLog[];
  peminjamanList: Peminjaman[];
  onNavigate: (view: string) => void;
  onSelectItem: (barang: Barang) => void;
}

export default function DashboardView({
  barangList,
  ruanganList,
  maintenanceList,
  logsList,
  peminjamanList,
  onNavigate,
  onSelectItem,
}: DashboardViewProps) {
  // 1. Core metric calculations
  const totalBarang = barangList.length;
  const totalRuangan = ruanganList.length;
  const barangBaik = barangList.filter((b) => b.kondisi === "Baik").length;
  const rusakRingan = barangList.filter((b) => b.kondisi === "Rusak Ringan").length;
  const rusakBerat = barangList.filter((b) => b.kondisi === "Rusak Berat").length;
  const barangDipinjam = peminjamanList.filter((p) => p.status === "Dipinjam").length;

  // Calculate total asset valuation
  const totalAssetValuation = useMemo(() => {
    return barangList.reduce((acc, curr) => acc + curr.harga, 0);
  }, [barangList]);

  // 2. Data processing for Condition Donut Chart
  const kondisiChartData = useMemo(() => {
    return [
      { label: "Kondisi Baik", value: barangBaik, color: "#10b981" }, // Emerald Green
      { label: "Rusak Ringan", value: rusakRingan, color: "#f97316" }, // Orange
      { label: "Rusak Berat", value: rusakBerat, color: "#ef4444" }, // Red
    ];
  }, [barangBaik, rusakRingan, rusakBerat]);

  // 3. Data processing for Funding Source Bar Chart
  const sumberDanaChartData = useMemo(() => {
    const counts: { [key: string]: number } = {
      BOS: 0,
      BANSEK: 0,
      Yayasan: 0,
      Hibah: 0,
      "Donatur Lainnya": 0,
    };

    barangList.forEach((b) => {
      const sDana = b.sumberDana;
      if (counts[sDana] !== undefined) {
        counts[sDana]++;
      } else {
        counts["Donatur Lainnya"]++;
      }
    });

    return [
      { label: "BOS", value: counts["BOS"], color: "#059669" },
      { label: "BANSEK", value: counts["BANSEK"], color: "#0d9488" },
      { label: "Yayasan", value: counts["Yayasan"], color: "#0284c7" },
      { label: "Hibah", value: counts["Hibah"], color: "#4f46e5" },
      { label: "Donatur", value: counts["Donatur Lainnya"], color: "#8b5cf6" },
    ];
  }, [barangList]);

  // 4. Data processing for Category Allocation
  const kategoriChartData = useMemo(() => {
    const catCounts: { [key: string]: number } = {};
    barangList.forEach((b) => {
      catCounts[b.kategori] = (catCounts[b.kategori] || 0) + 1;
    });

    return Object.entries(catCounts)
      .map(([kategori, qty]) => ({
        label: kategori,
        value: qty,
        color: "#10b981",
      }))
      .slice(0, 5); // Pick top 5 categories
  }, [barangList]);

  // 5. Most damaged items list
  const damagedItemsList = useMemo(() => {
    return barangList
      .filter((b) => b.kondisi !== "Baik")
      .slice(0, 4);
  }, [barangList]);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Visual Welcome Banner */}
      <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-tr from-emerald-500/10 via-sky-400/5 to-transparent relative overflow-hidden border border-emerald-500/10 shadow-sm">
        <div className="space-y-1 z-10">
          <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
            Selamat Datang di Portal E-SARPRAS
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">
            SDIT Darussalam Bayan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Sistem Informasi Sarana & Prasarana Sekolah real-time. Kelola, audit, lacak
            mutasi, dan pantau kondisi kelayakan seluruh aset sekolah dalam satu dasbor terpadu.
          </p>
        </div>
        <div className="text-left md:text-right shrink-0 z-10 bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl border border-white dark:border-slate-800/80">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Total Nilai Valuasi Aset
          </p>
          <p className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {totalAssetValuation.toLocaleString("id-ID")}
          </p>
          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
            Mencakup {barangList.length} Unit Aset Terdaftar
          </p>
        </div>
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 md:gap-4">
        {/* Total Barang */}
        <div
          onClick={() => onNavigate("inventaris-barang")}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total Barang
            </span>
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {totalBarang}
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
              Unit Aktif <TrendingUp className="w-3 h-3 text-emerald-500" />
            </p>
          </div>
        </div>

        {/* Total Ruangan */}
        <div
          onClick={() => onNavigate("inventaris-ruangan")}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total Ruangan
            </span>
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {totalRuangan}
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Fasilitas Terdata
            </p>
          </div>
        </div>

        {/* Barang Baik */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Kondisi Baik
            </span>
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {barangBaik}
            </p>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 uppercase tracking-wide">
              {((barangBaik / Math.max(totalBarang, 1)) * 100).toFixed(0)}% Optimal
            </p>
          </div>
        </div>

        {/* Rusak Ringan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Rusak Ringan
            </span>
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/5 text-orange-600 dark:text-orange-400 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {rusakRingan}
            </p>
            <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold mt-1 uppercase tracking-wide">
              Butuh Maintenance
            </p>
          </div>
        </div>

        {/* Rusak Berat */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Rusak Berat
            </span>
            <div className="p-2 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {rusakBerat}
            </p>
            <p className="text-[9px] text-red-600 dark:text-red-400 font-bold mt-1 uppercase tracking-wide animate-pulse">
              Kritis / Afkir
            </p>
          </div>
        </div>

        {/* Barang Dipinjam */}
        <div
          onClick={() => onNavigate("peminjaman")}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Dipinjam
            </span>
            <div className="p-2 bg-sky-500/10 dark:bg-sky-500/5 text-sky-600 dark:text-sky-400 rounded-xl group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              {barangDipinjam}
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Penggunaan Guru
            </p>
          </div>
        </div>
      </div>

      {/* Charts Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Ratio Donut & Funding Source Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condition Ratio Donut */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Grafik Kondisi Kelayakan Aset
              </h3>
              <div className="h-48 flex items-center justify-center">
                <DonutChart data={kondisiChartData} title="Fisik Barang" />
              </div>
            </div>

            {/* Funding Allocation Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Grafik Sumber Anggaran / Dana
              </h3>
              <div className="h-48 flex flex-col justify-end">
                <BarChart
                  data={sumberDanaChartData}
                  title="Proporsi Aset per Sumber Dana"
                  valueSuffix=" unit"
                />
              </div>
            </div>
          </div>

          {/* Asset Categories Allocation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Distribusi Kategori Barang Terbanyak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {kategoriChartData.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">unit</span>
                  </div>
                  {/* Miniature progress indicator */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(item.value / Math.max(totalBarang, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Operations / Timelines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Maintenance Terdekat */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Pemeliharaan Terdekat</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                Aktif
              </span>
            </div>

            <div className="space-y-3">
              {maintenanceList.filter((m) => m.status !== "Selesai").length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-xs">Tidak ada jadwal pemeliharaan terdekat.</p>
                </div>
              ) : (
                maintenanceList
                  .filter((m) => m.status !== "Selesai")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all cursor-pointer"
                      onClick={() => {
                        const itemObj = barangList.find((b) => b.nama === m.barangNama || b.id === m.barangId);
                        if (itemObj) onSelectItem(itemObj);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block max-w-[160px]">
                          {m.barangNama}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">{m.tanggalMulai}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Masalah: {m.tipeKerusakan}
                      </p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[9px] text-emerald-600 font-bold">
                          Rp {m.biaya.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[9px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400 px-2 py-0.2 rounded">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Urgent Damages: Barang Rusak Kritis */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Daftar Kerusakan Aset Kritis</span>
            </h3>

            <div className="space-y-3">
              {damagedItemsList.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-xs">Semua barang dalam kondisi prima!</p>
                </div>
              ) : (
                damagedItemsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.foto}
                      alt={item.nama}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {item.nama}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        {item.kodeInventaris}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        item.kondisi === "Rusak Berat"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.kondisi}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Aktivitas Terbaru (Logs Timeline) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Log Aktivitas Terbaru</span>
              </h3>
              <button
                onClick={() => onNavigate("log-aktivitas")}
                className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
              >
                Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="relative pl-4 border-l border-slate-100 dark:border-slate-800 space-y-5 py-1">
              {logsList.slice(0, 3).map((log, i) => (
                <div key={log.id} className="relative space-y-0.5">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white dark:border-slate-900 ring-4 ring-emerald-500/10" />
                  <div className="flex justify-between items-baseline gap-1.5">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {log.userName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {log.tanggal.split(" ")[1]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {log.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
