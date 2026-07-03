/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { FileBarChart2, FileText, FileSpreadsheet, Printer, ArrowLeft, Building2, Layers, AlertCircle, RefreshCw, CheckSquare, Sparkles } from "lucide-react";
import { Barang, Ruangan, KategoriBarang, SumberDana, Mutasi, Pengadaan, Maintenance, Peminjaman } from "../types";

interface LaporanViewProps {
  barangList: Barang[];
  ruanganList: Ruangan[];
  kategoriList: KategoriBarang[];
  sumberDanaList: SumberDana[];
  mutasiList: Mutasi[];
  pengadaanList: Pengadaan[];
  maintenanceList: Maintenance[];
  peminjamanList: Peminjaman[];
}

type ReportType =
  | null
  | "ruangan"
  | "kategori"
  | "rusak"
  | "mutasi"
  | "pengadaan"
  | "maintenance"
  | "peminjaman";

export default function LaporanView({
  barangList,
  ruanganList,
  kategoriList,
  sumberDanaList,
  mutasiList,
  pengadaanList,
  maintenanceList,
  peminjamanList,
}: LaporanViewProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);

  // Dynamic calculations for stat blocks
  const totalAssetsValue = useMemo(() => {
    return barangList.reduce((acc, b) => acc + b.harga, 0);
  }, [barangList]);

  const damagedAssetsValue = useMemo(() => {
    return barangList
      .filter((b) => b.kondisi !== "Baik")
      .reduce((acc, b) => acc + b.harga, 0);
  }, [barangList]);

  const completedMaintenanceCost = useMemo(() => {
    return maintenanceList
      .filter((m) => m.status === "Selesai")
      .reduce((acc, m) => acc + m.biaya, 0);
  }, [maintenanceList]);

  // Report configurations & templates
  const reportTemplates = [
    {
      id: "ruangan" as const,
      title: "Laporan Inventaris per Ruangan",
      desc: "Menampilkan sebaran aset, kuantitas item, serta aggregate total nilai buku sarpras di tiap ruangan sekolah.",
      icon: Building2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      id: "kategori" as const,
      title: "Laporan Distribusi per Kategori",
      desc: "Menampilkan rekapitulasi jumlah logistik sarpras yang terklasifikasi menurut kelompok rumpun barang.",
      icon: Layers,
      color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
    },
    {
      id: "rusak" as const,
      title: "Laporan Kondisi Aset Rusak (Kritis)",
      desc: "Audit khusus yang mengisolasi daftar barang berkondisi Rusak Ringan atau Rusak Berat guna pengajuan perbaikan.",
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
    },
    {
      id: "mutasi" as const,
      title: "Laporan Aliran Mutasi Barang",
      desc: "Arsip kronologi perpindahan lokasi penempatan inventaris antarkelas dan unit sekolah sepanjang semester.",
      icon: RefreshCw,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      id: "pengadaan" as const,
      title: "Laporan Buku Belanja & Pengadaan",
      desc: "Ringkasan pengajuan realisasi pengadaan barang baru baik yang disetujui maupun yang sudah masuk inventaris.",
      icon: CheckSquare,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      id: "maintenance" as const,
      title: "Laporan Pemeliharaan & Perbaikan",
      desc: "Legasi pengeluaran dana operasional pemeliharaan sarana prasarana sekolah dan histori kerja vendor teknisi.",
      icon: FileBarChart2,
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40",
    },
  ];

  // Action: Print report simulation
  const handlePrint = () => {
    window.print();
  };

  // Action: Export Excel Simulation
  const handleExportExcel = () => {
    alert("Menyiapkan berkas Spreadsheet (.xlsx)... Laporan siap diunduh!");
  };

  return (
    <div className="space-y-6" id="view-laporan">
      {/* HEADER */}
      {!selectedReport ? (
        <>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Pusat Pelaporan & Laporan Ekspor
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Generate buku laporan fisik sarpras sekolah format standardisasi kedinasan, dukung cetak langsung maupun ekspor digital.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Akumulasi Kapitalisasi Sarpras
              </span>
              <span className="text-xl font-black text-slate-800 dark:text-white mt-1.5 block">
                Rp {totalAssetsValue.toLocaleString("id-ID")}
              </span>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Nilai buku perolehan aset terdaftar</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Nilai Buku Aset Rusak (Kritis)
              </span>
              <span className="text-xl font-black text-orange-600 mt-1.5 block">
                Rp {damagedAssetsValue.toLocaleString("id-ID")}
              </span>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Nilai aset berstatus rusak ringan/berat</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Alokasi Perbaikan Terpakai
              </span>
              <span className="text-xl font-black text-emerald-600 mt-1.5 block">
                Rp {completedMaintenanceCost.toLocaleString("id-ID")}
              </span>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Biaya penanganan servis selesai</p>
            </div>
          </div>

          {/* Templates Grid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((tpl) => {
              const IconComp = tpl.icon;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedReport(tpl.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-emerald-500/20 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group h-56"
                >
                  <div className="space-y-3">
                    <div className={`p-3 rounded-2xl w-fit ${tpl.color} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-3">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mt-3">
                    Buka Preview Laporan →
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* REPORT PREVIEW AND PRINT SHEET */
        <div className="space-y-6 animate-fade-in">
          {/* CONTROL BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => setSelectedReport(null)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <FileSpreadsheet className="w-4 h-4" /> Unduh Excel
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" /> Cetak Laporan (PDF)
              </button>
            </div>
          </div>

          {/* THE PRINT SHEET (White A4 Style Mock) */}
          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 max-w-4xl mx-auto shadow-lg space-y-8" id="print-sheet-preview">
            
            {/* Kop Surat Sekolah SDIT Darussalam Bayan */}
            <div className="border-b-4 border-double border-slate-900 pb-5 text-center space-y-1 relative">
              <span className="text-[10px] tracking-widest font-extrabold text-emerald-600 block uppercase">
                Yayasan Darussalam Lombok Utara
              </span>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 uppercase">
                SDIT Darussalam Bayan
              </h1>
              <p className="text-[10px] text-slate-500 italic max-w-xl mx-auto leading-relaxed">
                Alamat: Jalan Labuan Carik, Bayan, Lombok Utara, Nusa Tenggara Barat • NPSN: 50220311
              </p>
              <div className="absolute top-2 left-2 text-emerald-600 hidden md:block">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            {/* Document Title Header */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider underline text-slate-800">
                {selectedReport === "ruangan" && "Laporan Buku Inventaris per Unit Ruangan"}
                {selectedReport === "kategori" && "Laporan Rekapitulasi Sarpras per Rumpun Kategori"}
                {selectedReport === "rusak" && "Laporan Berita Acara Kerusakan Barang Kritis"}
                {selectedReport === "mutasi" && "Laporan Mutasi & Perpindahan Sarana Prasarana"}
                {selectedReport === "pengadaan" && "Laporan Buku Belanja & Pengadaan Barang"}
                {selectedReport === "maintenance" && "Laporan Realisasi Alokasi Biaya Pemeliharaan"}
              </h2>
              <p className="text-[9px] text-slate-400 font-semibold font-mono">
                No Dokumen: KBM/SARPRAS/SDIT-DB/{new Date().getFullYear()}/0012
              </p>
            </div>

            {/* Preview Tables */}
            <div className="overflow-x-auto">
              
              {/* 1. REPORT: RUANGAN */}
              {selectedReport === "ruangan" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">ID Ruang</th>
                      <th className="p-3 border-r border-slate-200">Nama Ruangan</th>
                      <th className="p-3 border-r border-slate-200">Klasifikasi</th>
                      <th className="p-3 text-center border-r border-slate-200">Jumlah Aset</th>
                      <th className="p-3 text-right">Total Nilai Perolehan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {ruanganList.map((room, idx) => {
                      const items = barangList.filter((b) => b.ruanganId === room.id);
                      const totalVal = items.reduce((sum, b) => sum + b.harga, 0);
                      return (
                        <tr key={room.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="p-3 border-r border-slate-200 font-mono font-bold text-slate-500">{room.id}</td>
                          <td className="p-3 border-r border-slate-200 font-extrabold text-slate-800">{room.nama}</td>
                          <td className="p-3 border-r border-slate-200">{room.tipe}</td>
                          <td className="p-3 text-center border-r border-slate-200 font-bold">{items.length} Unit</td>
                          <td className="p-3 text-right font-bold font-mono">Rp {totalVal.toLocaleString("id-ID")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* 2. REPORT: KATEGORI */}
              {selectedReport === "kategori" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">Rumpun Kategori</th>
                      <th className="p-3 text-center border-r border-slate-200">Jumlah Terdaftar</th>
                      <th className="p-3 text-right">Proporsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {kategoriList.map((cat, idx) => {
                      const associatedCount = barangList.filter((b) => b.kategori === cat.nama).length;
                      return (
                        <tr key={cat.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="p-3 border-r border-slate-200 font-extrabold text-slate-800">{cat.nama}</td>
                          <td className="p-3 text-center border-r border-slate-200 font-bold">{associatedCount} Unit</td>
                          <td className="p-3 text-right font-mono font-bold">
                            {((associatedCount / Math.max(barangList.length, 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* 3. REPORT: RUSAK */}
              {selectedReport === "rusak" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">Kode Inventaris</th>
                      <th className="p-3 border-r border-slate-200">Nama Barang</th>
                      <th className="p-3 border-r border-slate-200">Tingkat Kondisi</th>
                      <th className="p-3 text-right">Nilai Buku Perolehan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {barangList
                      .filter((b) => b.kondisi !== "Baik")
                      .map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="p-3 border-r border-slate-200 font-mono font-bold text-slate-500">{item.kodeInventaris}</td>
                          <td className="p-3 border-r border-slate-200 font-extrabold text-slate-800">{item.nama}</td>
                          <td className="p-3 border-r border-slate-200 text-red-600 font-bold uppercase text-[10px]">
                            {item.kondisi}
                          </td>
                          <td className="p-3 text-right font-bold font-mono">Rp {item.harga.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* 4. REPORT: MUTASI */}
              {selectedReport === "mutasi" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">Tanggal</th>
                      <th className="p-3 border-r border-slate-200">Nama Barang</th>
                      <th className="p-3 text-center border-r border-slate-200">Alur Perpindahan</th>
                      <th className="p-3 border-r border-slate-200">PJ Lapangan</th>
                      <th className="p-3">Justifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {mutasiList.map((m, idx) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3 border-r border-slate-200 font-mono font-semibold">{m.tanggal}</td>
                        <td className="p-3 border-r border-slate-200 font-extrabold text-slate-850">{m.barangNama}</td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold">
                          {m.dariRuanganNama} → {m.keRuanganNama}
                        </td>
                        <td className="p-3 border-r border-slate-200 font-bold">{m.diajukanOleh}</td>
                        <td className="p-3 italic text-slate-500 font-medium">{m.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 5. REPORT: PENGADAAN */}
              {selectedReport === "pengadaan" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">Tgl Ajukan</th>
                      <th className="p-3 border-r border-slate-200">Pemohon</th>
                      <th className="p-3 border-r border-slate-200">Nama Barang / Merek</th>
                      <th className="p-3 text-center border-r border-slate-200">Jumlah</th>
                      <th className="p-3 text-right">Rencana Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {pengadaanList.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3 border-r border-slate-200 font-mono font-semibold">{req.tanggalPengajuan}</td>
                        <td className="p-3 border-r border-slate-200 font-bold text-slate-800">{req.diajukanOleh}</td>
                        <td className="p-3 border-r border-slate-200 font-extrabold">
                          {req.namaBarang} <span className="text-[10px] text-slate-400 font-medium">({req.merek})</span>
                        </td>
                        <td className="p-3 text-center border-r border-slate-200 font-bold">{req.jumlah} Unit</td>
                        <td className="p-3 text-right font-bold font-mono">Rp {req.totalHarga.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 6. REPORT: MAINTENANCE */}
              {selectedReport === "maintenance" && (
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-extrabold uppercase text-[9px] text-slate-700">
                      <th className="p-3 w-12 text-center border-r border-slate-200">No</th>
                      <th className="p-3 border-r border-slate-200">Tanggal</th>
                      <th className="p-3 border-r border-slate-200">Nama Aset</th>
                      <th className="p-3 border-r border-slate-200">Tipe Kerusakan</th>
                      <th className="p-3 border-r border-slate-200">Teknisi Servis</th>
                      <th className="p-3 text-right">Biaya Perbaikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {maintenanceList.map((m, idx) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-center border-r border-slate-200 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3 border-r border-slate-200 font-mono font-semibold">{m.tanggalMulai}</td>
                        <td className="p-3 border-r border-slate-200 font-extrabold text-slate-850">{m.barangNama}</td>
                        <td className="p-3 border-r border-slate-200">{m.tipeKerusakan}</td>
                        <td className="p-3 border-r border-slate-200 font-bold text-slate-700">{m.teknisi}</td>
                        <td className="p-3 text-right font-bold font-mono text-emerald-600">Rp {m.biaya.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>

            {/* Document Signature Sign Block (Kedinasan Standard) */}
            <div className="pt-8 flex justify-between text-xs font-bold text-slate-800">
              <div>
                <p className="font-semibold text-slate-500">Mengesahkan,</p>
                <p className="mt-14 uppercase underline">Ustadz Baihaqi, S.Pd.I</p>
                <p className="text-[9px] text-slate-400">Kepala Sekolah SDIT Darussalam Bayan</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-500">Bayan, Lombok Utara, NTB</p>
                <p className="mt-14 uppercase underline">M. Ridwan, A.Ma</p>
                <p className="text-[9px] text-slate-400">Staf Koordinator Sarana Prasarana</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
