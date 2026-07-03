/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, Sparkles, X, CheckCircle, RefreshCw } from "lucide-react";
import { Barang } from "../types";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  barangList: Barang[];
  onScanSuccess: (barang: Barang, status?: "Ada" | "Rusak" | "Hilang") => void;
  mode?: "detail" | "opname";
}

export default function ScannerModal({
  isOpen,
  onClose,
  barangList,
  onScanSuccess,
  mode = "detail",
}: ScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [selectedSimItem, setSelectedSimItem] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [scannedFile, setScannedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [detectedBarang, setDetectedBarang] = useState<Barang | null>(null);
  const [opnameStatus, setOpnameStatus] = useState<"Ada" | "Rusak" | "Hilang">("Ada");

  useEffect(() => {
    if (isOpen) {
      setScanStatus("idle");
      setDetectedBarang(null);
      setSelectedSimItem("");
      setScannedFile(null);
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Synthesis of a realistic high-tech scanner "beep"
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1400, audioCtx.currentTime); // High pitched beep
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio context not allowed by browser autoplay policy yet.", e);
    }
  };

  const handleSimulateScan = (id: string) => {
    if (!id) return;
    const item = barangList.find((b) => b.id === id);
    if (!item) return;

    setScanStatus("scanning");
    setTimeout(() => {
      playBeep();
      setDetectedBarang(item);
      setScanStatus("success");
    }, 1200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setScannedFile(file.name);
    setScanStatus("scanning");

    // Randomly pick a barcode to simulate scanning from image
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * barangList.length);
      const item = barangList[randomIndex];
      playBeep();
      setDetectedBarang(item);
      setScanStatus("success");
    }, 1500);
  };

  const handleFinalize = () => {
    if (detectedBarang) {
      onScanSuccess(detectedBarang, mode === "opname" ? opnameStatus : undefined);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
      id="modal-scanner"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">
                {mode === "opname" ? "Stock Opname QR Scanner" : "QR Code Scanner"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindai QR Code barang untuk {mode === "opname" ? "audit fisik" : "melihat detail"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1 m-3 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("camera");
              setScanStatus("idle");
              setDetectedBarang(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "camera"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Kamera Aktif
          </button>
          <button
            onClick={() => {
              setActiveTab("upload");
              setScanStatus("idle");
              setDetectedBarang(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "upload"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File QR
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === "camera" ? (
            <div className="space-y-4">
              {/* Fake Live Camera View */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 flex items-center justify-center group shadow-inner">
                {scanStatus === "scanning" && (
                  <div className="absolute inset-0 bg-emerald-950/20 z-10 flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                    <span className="text-xs text-emerald-300 font-mono tracking-wider">
                      MEMPROSES DEKODING QR...
                    </span>
                  </div>
                )}

                {scanStatus === "success" && detectedBarang && (
                  <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center p-4 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-2 animate-bounce" />
                    <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                      QR BERHASIL DIPINDAI
                    </span>
                    <h4 className="text-white font-bold text-sm mt-1">
                      {detectedBarang.nama}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {detectedBarang.kodeInventaris}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ruangan: {detectedBarang.ruanganId} • Kondisi: {detectedBarang.kondisi}
                    </p>
                  </div>
                )}

                {/* Grid Scan Animation Overlay */}
                {scanStatus !== "success" && scanStatus !== "scanning" && (
                  <>
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_12px_#10b981] top-1/2 -translate-y-1/2 z-10 animate-[bounce_3s_infinite_ease-in-out]" />
                    <div className="absolute inset-8 border border-dashed border-emerald-500/50 rounded-lg pointer-events-none flex items-center justify-center">
                      <div className="w-24 h-24 border-2 border-emerald-400/80 rounded-md relative opacity-60">
                        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                      </div>
                    </div>
                  </>
                )}

                {/* Static Background Pattern representing Lens/Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                <div className="text-center text-slate-400 z-0">
                  <Camera className="w-12 h-12 mx-auto text-slate-700 dark:text-slate-600 mb-2 animate-pulse" />
                  <p className="text-xs font-semibold">Simulasi Sensor Kamera Aktif</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Gunakan panel simulasi di bawah untuk memilih aset
                  </p>
                </div>
              </div>

              {/* Simulation Selector */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  🧪 Panel Simulasi Scan
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedSimItem}
                    onChange={(e) => {
                      setSelectedSimItem(e.target.value);
                      handleSimulateScan(e.target.value);
                    }}
                    className="flex-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">-- Pilih Barang untuk Di-Scan --</option>
                    {barangList.map((b) => (
                      <option key={b.id} value={b.id}>
                        [{b.kodeInventaris}] {b.nama}
                      </option>
                    ))}
                  </select>
                  {detectedBarang && (
                    <button
                      onClick={() => {
                        setScanStatus("idle");
                        setDetectedBarang(null);
                        setSelectedSimItem("");
                      }}
                      className="text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg flex items-center gap-1 bg-white dark:bg-slate-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag and Drop */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all duration-300 min-h-48 relative ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-slate-200 dark:border-slate-800 hover:border-emerald-400/80 bg-slate-50/50 dark:bg-slate-950/20"
                }`}
              >
                {scanStatus === "scanning" ? (
                  <div className="space-y-3">
                    <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Memindai berkas {scannedFile}
                      </p>
                      <p className="text-[10px] text-slate-500">Membaca QR data matriks...</p>
                    </div>
                  </div>
                ) : scanStatus === "success" && detectedBarang ? (
                  <div className="space-y-3 p-2">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                    <div>
                      <span className="inline-flex px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full mb-1">
                        Berhasil Terbaca
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {detectedBarang.nama}
                      </h4>
                      <p className="text-xs font-mono text-slate-500">
                        {detectedBarang.kodeInventaris}
                      </p>
                    </div>
                    <button
                      onClick={() => setScanStatus("idle")}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
                    >
                      Unggah File Lain
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-3" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tarik & Letakkan gambar QR Code di sini
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 mb-4">
                      Mendukung format PNG, JPG, atau SVG label inventaris
                    </p>
                    <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950 px-3.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900 cursor-pointer transition-colors shadow-sm">
                      Pilih Berkas QR
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Audit Status selection in OPNAME mode */}
          {detectedBarang && mode === "opname" && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl space-y-3 mt-4 animate-fade-in">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-white text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Pilih Status Hasil Audit Fisik</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["Ada", "Rusak", "Hilang"] as const).map((status) => {
                  const colors = {
                    Ada: "border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
                    Rusak: "border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50",
                    Hilang: "border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50",
                  };
                  const activeColors = {
                    Ada: "bg-emerald-500 border-emerald-600 text-white dark:text-white",
                    Rusak: "bg-orange-500 border-orange-600 text-white dark:text-white",
                    Hilang: "bg-red-500 border-red-600 text-white dark:text-white",
                  };
                  const isActive = opnameStatus === status;

                  return (
                    <button
                      key={status}
                      onClick={() => setOpnameStatus(status)}
                      className={`text-xs py-2 px-3 border rounded-lg font-semibold transition-all ${
                        isActive ? activeColors[status] : colors[status] + " bg-white dark:bg-slate-800"
                      }`}
                    >
                      {status === "Ada" ? "✓ Ada / Cocok" : status === "Rusak" ? "⚠ Rusak" : "✗ Hilang"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleFinalize}
            disabled={!detectedBarang}
            className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              detectedBarang
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            {mode === "opname" ? "Simpan Hasil Audit" : "Tampilkan Detail"}
          </button>
        </div>
      </div>
    </div>
  );
}
