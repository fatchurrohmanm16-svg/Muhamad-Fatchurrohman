/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, X, Upload, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { Barang, Ruangan, KategoriBarang, SumberDana } from "../types";
import DataTable from "./DataTable";

interface InventarisBarangViewProps {
  barangList: Barang[];
  ruanganList: Ruangan[];
  kategoriList: KategoriBarang[];
  sumberDanaList: SumberDana[];
  onSelectItem: (barang: Barang) => void;
  onAddBarang: (barang: Barang) => void;
  onDeleteBarang: (ids: string[]) => void;
  onBulkPrintQR: (items: Barang[]) => void;
}

export default function InventarisBarangView({
  barangList,
  ruanganList,
  kategoriList,
  sumberDanaList,
  onSelectItem,
  onAddBarang,
  onDeleteBarang,
  onBulkPrintQR,
}: InventarisBarangViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    ruanganId: "",
    sumberDana: "",
    merek: "",
    tahunPerolehan: new Date().getFullYear(),
    harga: "",
    kondisi: "Baik" as any,
    fotoUrl: "",
    keterangan: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Realistic Preset Unsplash Images for UI/UX excellence
  const presetPhotos = [
    { label: "Laptop / IT", url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80" },
    { label: "AC / Elektronik", url: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&auto=format&fit=crop&q=80" },
    { label: "Meja Kayu / Mebel", url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&auto=format&fit=crop&q=80" },
    { label: "Kursi / Chitose", url: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&auto=format&fit=crop&q=80" },
    { label: "Proyektor / Media", url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&auto=format&fit=crop&q=80" },
    { label: "Buku Paket / Pustaka", url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&auto=format&fit=crop&q=80" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const simulateUpload = (fileName: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(interval);
          // Set a matching preset based on random choice
          const randomPreset = presetPhotos[Math.floor(Math.random() * presetPhotos.length)].url;
          setFormData((f) => ({ ...f, fotoUrl: randomPreset }));
          setTimeout(() => setUploadProgress(null), 800);
          return 100;
        }
        return p + 30;
      });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nama, kategori, ruanganId, sumberDana, merek, tahunPerolehan, harga, kondisi, fotoUrl, keterangan } = formData;

    if (!nama || !kategori || !ruanganId || !sumberDana) {
      alert("Mohon isi semua field yang diwajibkan.");
      return;
    }

    const priceNum = parseInt(harga.toString().replace(/[^0-9]/g, "")) || 0;

    // Auto-generate code
    const catShort = kategori.substring(0, 3).toUpperCase();
    const uniqueNumber = Math.floor(100 + Math.random() * 900);
    const generatedCode = `INV-${catShort}-${uniqueNumber}`;

    const newBarangObj: Barang = {
      id: "brg-" + Math.random().toString(36).substr(2, 5),
      kodeInventaris: generatedCode,
      qrCode: `${generatedCode}-SDIT-DB`,
      nama,
      kategori,
      ruanganId,
      sumberDana,
      merek: merek || "Tanpa Merek",
      tahunPerolehan: parseInt(tahunPerolehan.toString()) || new Date().getFullYear(),
      harga: priceNum,
      kondisi,
      foto: fotoUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
      keterangan,
      isMultimedia: kategori === "Elektronik" || kategori === "Multimedia",
      isPerpustakaan: kategori === "Buku Perpustakaan",
    };

    onAddBarang(newBarangObj);
    setShowAddModal(false);
    
    // Reset Form
    setFormData({
      nama: "",
      kategori: "",
      ruanganId: "",
      sumberDana: "",
      merek: "",
      tahunPerolehan: new Date().getFullYear(),
      harga: "",
      kondisi: "Baik",
      fotoUrl: "",
      keterangan: "",
    });
  };

  return (
    <div className="space-y-6" id="view-inventaris-barang">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Inventaris Sarana & Prasarana
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar legasi terpadu barang inventaris sekolah dengan manajemen penempatan & QR Labeling.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Main DataTable Wrapper */}
      <DataTable
        data={barangList}
        ruanganList={ruanganList}
        onSelectItem={onSelectItem}
        onDeleteItems={onDeleteBarang}
        onBulkPrintQR={onBulkPrintQR}
      />

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 my-8">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
              <div>
                <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Inventarisasi Aset Baru
                </span>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base mt-0.5">
                  Registrasi Barang Sekolah
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Row 1: Nama & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Nama Barang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AC Split Panasonic 1.5 PK"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Kategori Barang <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategoriList.map((cat) => (
                      <option key={cat.id} value={cat.nama}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Ruangan & Sumber Dana */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Penempatan Ruangan <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.ruanganId}
                    onChange={(e) => setFormData({ ...formData, ruanganId: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Pilih Ruangan --</option>
                    {ruanganList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Sumber Dana <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Pilih Anggaran --</option>
                    {sumberDanaList.map((dana) => (
                      <option key={dana.id} value={dana.nama}>
                        {dana.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Merek, Tahun, Harga */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Merek / Produsen
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Panasonic, Chitose"
                    value={formData.merek}
                    onChange={(e) => setFormData({ ...formData, merek: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Tahun Perolehan
                  </label>
                  <input
                    type="number"
                    value={formData.tahunPerolehan}
                    onChange={(e) => setFormData({ ...formData, tahunPerolehan: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Harga Perolehan (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 1200000"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Kondisi */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Kondisi Awal Barang
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Baik", "Rusak Ringan", "Rusak Berat"] as const).map((knd) => {
                    const isActive = formData.kondisi === knd;
                    const colors = {
                      Baik: "border-emerald-200 hover:bg-emerald-50 text-emerald-700 bg-emerald-500/5",
                      "Rusak Ringan": "border-orange-200 hover:bg-orange-50 text-orange-700 bg-orange-500/5",
                      "Rusak Berat": "border-red-200 hover:bg-red-50 text-red-700 bg-red-500/5",
                    };
                    const activeColors = {
                      Baik: "bg-emerald-600 border-emerald-600 text-white",
                      "Rusak Ringan": "bg-orange-600 border-orange-600 text-white",
                      "Rusak Berat": "bg-red-600 border-red-600 text-white",
                    };

                    return (
                      <button
                        key={knd}
                        type="button"
                        onClick={() => setFormData({ ...formData, kondisi: knd })}
                        className={`text-xs py-2 px-3 border rounded-xl font-bold transition-all ${
                          isActive ? activeColors[knd] : colors[knd] + " bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {knd}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Foto Drag & Drop & Presets */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Foto Aset (Unggah / Pilih Preset)
                </label>

                {/* Simulated Drag & Drop */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 dark:border-slate-800 hover:border-emerald-400/80 bg-slate-50 dark:bg-slate-950/20"
                  }`}
                >
                  {uploadProgress !== null ? (
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">Mengunggah gambar... {uploadProgress}%</p>
                    </div>
                  ) : formData.fotoUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={formData.fotoUrl}
                        alt="Uploaded"
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 rounded-lg object-cover border"
                      />
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">✓ File Berhasil Dipasangkan</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, fotoUrl: "" })}
                          className="text-[10px] text-red-500 hover:underline font-semibold"
                        >
                          Ubah Gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Tarik gambar ke sini, atau{" "}
                        <label className="text-emerald-600 hover:underline cursor-pointer">
                          cari berkas
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </p>
                    </>
                  )}
                </div>

                {/* Presets Grid */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Pilihan Preset Cepat (Unsplash)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetPhotos.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, fotoUrl: preset.url })}
                        className={`text-[10px] px-2.5 py-1.5 border rounded-lg font-semibold transition-all flex items-center gap-1 ${
                          formData.fotoUrl === preset.url
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 shrink-0" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 6: Keterangan */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Catatan Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan spesifikasi laptop, kondisi lemari kayu..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
                >
                  Simpan Pendaftaran
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
