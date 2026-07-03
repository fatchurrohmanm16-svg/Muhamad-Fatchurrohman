/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  UserRole,
  User as AppUser,
  Ruangan,
  KategoriBarang,
  SumberDana,
  Barang,
  Pengadaan,
  Mutasi,
  Maintenance,
  StockOpname,
  Peminjaman,
  Penghapusan,
  ActivityLog,
  SchoolConfig
} from "./types";

import {
  initialUsers,
  initialRuangan,
  initialKategori,
  initialSumberDana,
  initialBarang,
  initialPengadaan,
  initialMutasi,
  initialMaintenance,
  initialStockOpname,
  initialPeminjaman,
  initialPenghapusan,
  initialLogs,
  initialSchoolConfig
} from "./data";

// Core Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DetailModal from "./components/DetailModal";
import ScannerModal from "./components/ScannerModal";

// Modular Views
import DashboardView from "./components/DashboardView";
import MasterDataView from "./components/MasterDataView";
import InventarisBarangView from "./components/InventarisBarangView";
import InventarisRuanganView from "./components/InventarisRuanganView";
import PengadaanView from "./components/PengadaanView";
import PemeliharaanView from "./components/PemeliharaanView";
import MutasiView from "./components/MutasiView";
import PeminjamanView from "./components/PeminjamanView";
import PenghapusanView from "./components/PenghapusanView";
import StockOpnameView from "./components/StockOpnameView";
import LaporanView from "./components/LaporanView";

// Bundled System Views
import {
  PerpustakaanView,
  MultimediaView,
  UserManagementView,
  PengaturanView,
  ActivityLogView
} from "./components/SistemViews";

import { Info, Sparkles, CheckCircle2, AlertTriangle, X, Check } from "lucide-react";

export default function App() {
  // 1. Core Persistence State Engine
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [ruanganList, setRuanganList] = useState<Ruangan[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriBarang[]>([]);
  const [sumberDanaList, setSumberDanaList] = useState<SumberDana[]>([]);
  const [pengadaanList, setPengadaanList] = useState<Pengadaan[]>([]);
  const [mutasiList, setMutasiList] = useState<Mutasi[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [stockOpnameList, setStockOpnameList] = useState<StockOpname[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [penghapusanList, setPenghapusanList] = useState<Penghapusan[]>([]);
  const [logsList, setLogsList] = useState<ActivityLog[]>([]);
  const [usersList, setUsersList] = useState<AppUser[]>([]);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);

  // Layout & UI controls
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Administrator");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" | "error" } | null>(null);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Current logged in user name simulation based on role
  const currentUserName = useMemo(() => {
    if (userRole === "Administrator") return "Ahmad Saefudin, S.Pd.I.";
    if (userRole === "Kepala Sekolah") return "H. M. Syukron, M.Pd.";
    return "Siti Rahmawati, S.Pd.";
  }, [userRole]);

  // Toast trigger
  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Pre-seed local storage or read existing
  useEffect(() => {
    const loadState = <T,>(key: string, initialData: T, setter: (val: T) => void) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setter(JSON.parse(stored));
        } catch (e) {
          setter(initialData);
        }
      } else {
        setter(initialData);
        localStorage.setItem(key, JSON.stringify(initialData));
      }
    };

    loadState("esarpras_barang", initialBarang, setBarangList);
    loadState("esarpras_ruangan", initialRuangan, setRuanganList);
    loadState("esarpras_kategori", initialKategori, setKategoriList);
    loadState("esarpras_sumber_dana", initialSumberDana, setSumberDanaList);
    loadState("esarpras_pengadaan", initialPengadaan, setPengadaanList);
    loadState("esarpras_mutasi", initialMutasi, setMutasiList);
    loadState("esarpras_maintenance", initialMaintenance, setMaintenanceList);
    loadState("esarpras_stock_opname", initialStockOpname, setStockOpnameList);
    loadState("esarpras_peminjaman", initialPeminjaman, setPeminjamanList);
    loadState("esarpras_penghapusan", initialPenghapusan, setPenghapusanList);
    loadState("esarpras_logs", initialLogs, setLogsList);
    loadState("esarpras_users", initialUsers, setUsersList);
    loadState("esarpras_school_config", initialSchoolConfig, setSchoolConfig);
  }, []);

  // System Audit Logger
  const writeSystemLog = (aktivitas: string, detail: string) => {
    const newLog: ActivityLog = {
      id: "log-" + Math.random().toString(36).substr(2, 5),
      userId: userRole === "Administrator" ? "usr-1" : userRole === "Kepala Sekolah" ? "usr-2" : "usr-3",
      userName: currentUserName,
      userRole,
      aktivitas,
      detail,
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setLogsList((prev) => {
      const updated = [newLog, ...prev];
      localStorage.setItem("esarpras_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // Helper sync tool
  const updateAndSync = <T,>(key: string, data: T, setter: (val: T) => void) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // State Mutators: 
  // ADD ASSET
  const handleAddBarang = (newAsset: Barang) => {
    const updated = [newAsset, ...barangList];
    updateAndSync("esarpras_barang", updated, setBarangList);
    writeSystemLog("TAMBAH_BARANG", `Mendaftarkan aset baru: ${newAsset.nama} (${newAsset.kodeInventaris})`);
    showToast(`Berhasil mendaftarkan aset ${newAsset.nama}!`, "success");
  };

  // DELETE ASSETS
  const handleDeleteBarangs = (ids: string[]) => {
    const updated = barangList.filter((b) => !ids.includes(b.id));
    updateAndSync("esarpras_barang", updated, setBarangList);
    writeSystemLog("HAPUS_BARANG", `Menghapus sebanyak ${ids.length} aset barang dari database.`);
    showToast(`Berhasil menghapus ${ids.length} item barang.`, "warning");
  };

  // ADD ROOM
  const handleAddRuangan = (newRoom: Ruangan) => {
    const updated = [...ruanganList, newRoom];
    updateAndSync("esarpras_ruangan", updated, setRuanganList);
    writeSystemLog("TAMBAH_RUANGAN", `Membuat ruangan baru: ${newRoom.nama}`);
    showToast(`Ruangan ${newRoom.nama} berhasil dibuat!`, "success");
  };

  // ADD CATEGORY
  const handleAddKategori = (newCat: KategoriBarang) => {
    const updated = [...kategoriList, newCat];
    updateAndSync("esarpras_kategori", updated, setKategoriList);
    writeSystemLog("TAMBAH_KATEGORI", `Membuat kategori barang baru: ${newCat.nama}`);
    showToast(`Kategori ${newCat.nama} ditambahkan!`, "success");
  };

  // ADD SOURCE OF FUNDS
  const handleAddSumberDana = (newDana: SumberDana) => {
    const updated = [...sumberDanaList, newDana];
    updateAndSync("esarpras_sumber_dana", updated, setSumberDanaList);
    writeSystemLog("TAMBAH_SUMBER_DANA", `Menambahkan sumber anggaran baru: ${newDana.nama}`);
    showToast(`Sumber dana ${newDana.nama} berhasil ditambahkan!`, "success");
  };

  // PROCUREMENT SYSTEM: ADD REQUEST
  const handleAddProcurementRequest = (newReq: Pengadaan) => {
    const updated = [newReq, ...pengadaanList];
    updateAndSync("esarpras_pengadaan", updated, setPengadaanList);
    writeSystemLog("AJUKAN_PENGADAAN", `Mengajukan belanja modal: ${newReq.namaBarang} (${newReq.jumlah} Unit)`);
    showToast("Pengajuan pengadaan berhasil dikirim!", "info");
  };

  // PROCUREMENT SYSTEM: UPDATE APPROVAL STATUS
  const handleUpdateProcurementStatus = (id: string, status: "Disetujui" | "Ditolak" | "Selesai", feedback?: string) => {
    const updated = pengadaanList.map((req) => {
      if (req.id === id) {
        return { ...req, status };
      }
      return req;
    });
    updateAndSync("esarpras_pengadaan", updated, setPengadaanList);

    const targetReq = pengadaanList.find((r) => r.id === id);
    if (!targetReq) return;

    if (status === "Disetujui") {
      writeSystemLog("APPROVE_PENGADAAN", `Kepala Sekolah menyetujui pengadaan: ${targetReq.namaBarang}`);
      showToast("Pengadaan disetujui Kepala Sekolah!", "success");
    } else if (status === "Ditolak") {
      writeSystemLog("REJECT_PENGADAAN", `Kepala Sekolah menolak pengadaan: ${targetReq.namaBarang}. Alasan: ${feedback}`);
      showToast("Pengajuan belanja ditolak.", "error");
    } else if (status === "Selesai") {
      // Automatic Assets Registration upon Completion! Outstanding lifecycle feature!
      const catShort = targetReq.kategori.substring(0, 3).toUpperCase();
      const uniqueNumber = Math.floor(100 + Math.random() * 900);
      const generatedCode = `INV-${catShort}-${uniqueNumber}`;

      const registeredAsset: Barang = {
        id: "brg-" + Math.random().toString(36).substr(2, 5),
        kodeInventaris: generatedCode,
        qrCode: `${generatedCode}-SDIT-DB`,
        nama: targetReq.namaBarang,
        kategori: targetReq.kategori,
        ruanganId: targetReq.ruanganId,
        sumberDana: targetReq.sumberDana,
        merek: targetReq.merek,
        tahunPerolehan: new Date().getFullYear(),
        harga: targetReq.hargaSatuan,
        kondisi: "Baik",
        foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
        keterangan: "Didaftarkan otomatis melalui sistem belanja pengadaan.",
        isMultimedia: targetReq.kategori === "Elektronik" || targetReq.kategori === "Multimedia",
        isPerpustakaan: targetReq.kategori === "Buku Perpustakaan",
      };

      setBarangList((prev) => {
        const up = [registeredAsset, ...prev];
        localStorage.setItem("esarpras_barang", JSON.stringify(up));
        return up;
      });

      writeSystemLog("REALISASI_BELANJA", `Barang ${targetReq.namaBarang} direalisasikan & terdaftar di legasi inventaris dengan kode ${generatedCode}`);
      showToast(`Belanja sukses! Aset ${targetReq.namaBarang} otomatis terdaftar.`, "success");
    }
  };

  // ASSET MUTATION / RELOCATION
  const handleAddMutasi = (newMut: any) => {
    // 1. Move the item in state
    const targetAsset = barangList.find((b) => b.id === newMut.barangId);
    if (!targetAsset) return;

    const updatedAssetList = barangList.map((b) => {
      if (b.id === newMut.barangId) {
        return { ...b, ruanganId: newMut.ruanganTujuanId };
      }
      return b;
    });
    updateAndSync("esarpras_barang", updatedAssetList, setBarangList);

    // 2. Append mutation ledger
    const realMutObj: Mutasi = {
      id: newMut.id,
      barangId: newMut.barangId,
      barangNama: newMut.barangNama,
      dariRuanganId: newMut.ruanganAsalId,
      dariRuanganNama: newMut.ruanganAsalNama,
      keRuanganId: newMut.ruanganTujuanId,
      keRuanganNama: newMut.ruanganTujuanNama,
      tanggal: newMut.tanggalMutasi,
      keterangan: newMut.alasan,
      diajukanOleh: newMut.pj,
    };

    const updatedMutList = [realMutObj, ...mutasiList];
    updateAndSync("esarpras_mutasi", updatedMutList, setMutasiList);

    writeSystemLog("MUTASI_ASET", `Memutasi ${newMut.barangNama} dari ${newMut.ruanganAsalNama} ke ${newMut.ruanganTujuanNama}`);
    showToast(`Mutasi sukses! ${newMut.barangNama} telah dipindahkan.`, "success");
  };

  // ASSET REPAIR / MAINTENANCE: REQUEST
  const handleAddMaintenance = (newMnt: Maintenance) => {
    const updated = [newMnt, ...maintenanceList];
    updateAndSync("esarpras_maintenance", updated, setMaintenanceList);

    // Downgrade the physical asset state to trigger repairs
    const updatedAssetList = barangList.map((b) => {
      if (b.id === newMnt.barangId) {
        return { ...b, kondisi: "Rusak Ringan" as const };
      }
      return b;
    });
    updateAndSync("esarpras_barang", updatedAssetList, setBarangList);

    writeSystemLog("AJUKAN_PEMELIHARAAN", `Mengajukan perbaikan ${newMnt.barangNama}: ${newMnt.tipeKerusakan}`);
    showToast("Laporan kerusakan terkirim untuk penanganan.", "info");
  };

  // MAINTENANCE: UPDATE STATE & ASSET RE-REPAIR RESTORATION
  const handleUpdateMaintenanceStatus = (id: string, status: "Diproses" | "Selesai", biaya?: number, teknisi?: string) => {
    const updated = maintenanceList.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status,
          biaya: biaya !== undefined ? biaya : m.biaya,
          teknisi: teknisi || m.teknisi,
          tanggalSelesai: status === "Selesai" ? new Date().toISOString().slice(0, 10) : undefined,
        };
      }
      return m;
    });
    updateAndSync("esarpras_maintenance", updated, setMaintenanceList);

    const targetMnt = maintenanceList.find((m) => m.id === id);
    if (!targetMnt) return;

    if (status === "Diproses") {
      writeSystemLog("PROSES_PEMELIHARAAN", `Memproses perbaikan ${targetMnt.barangNama} oleh teknisi.`);
      showToast("Aset mulai dikerjakan teknisi.", "info");
    } else if (status === "Selesai") {
      // RESTORE ASSET CONDITION UPON MAINTENANCE COMPLETION! Pure beauty!
      const updatedAssetList = barangList.map((b) => {
        if (b.id === targetMnt.barangId) {
          return { ...b, kondisi: "Baik" as const }; // Restored back to "Baik"
        }
        return b;
      });
      updateAndSync("esarpras_barang", updatedAssetList, setBarangList);

      writeSystemLog("RESTORASI_PEMELIHARAAN", `Perbaikan ${targetMnt.barangNama} selesai. Kondisi aset dipulihkan menjadi BAIK.`);
      showToast(`Restorasi sukses! Kondisi ${targetMnt.barangNama} kembali Baik.`, "success");
    }
  };

  // LOAN SYSTEM: SUBMIT REQUEST
  const handleAddLoan = (newLoan: any) => {
    const realLoan: Peminjaman = {
      id: newLoan.id,
      barangId: newLoan.barangId,
      barangNama: newLoan.barangNama,
      peminjam: newLoan.peminjamNama,
      tanggalPinjam: newLoan.tanggalPinjam,
      tanggalKembali: "",
      jumlah: 1,
      status: newLoan.status as any,
      keperluan: newLoan.alasan,
    };

    const updated = [realLoan, ...peminjamanList];
    updateAndSync("esarpras_peminjaman", updated, setPeminjamanList);

    writeSystemLog("AJUKAN_PINJAM", `${newLoan.peminjamNama} mengajukan peminjaman ${newLoan.barangNama}`);
    showToast("Permohonan pinjam berhasil diajukan!", "info");
  };

  // LOAN SYSTEM: AUTHORIZE DISBURSEMENT (APPROVE)
  const handleApproveLoan = (id: string) => {
    const updated = peminjamanList.map((l) => {
      if (l.id === id) {
        return { ...l, status: "Dipinjam" as const };
      }
      return l;
    });
    updateAndSync("esarpras_peminjaman", updated, setPeminjamanList);

    const targetLoan = peminjamanList.find((l) => l.id === id);
    if (targetLoan) {
      writeSystemLog("APPROVE_PINJAM", `Menyetujui peminjaman ${targetLoan.barangNama} oleh ${targetLoan.peminjam}`);
      showToast("Peminjaman disetujui, serahkan barang.", "success");
    }
  };

  // LOAN SYSTEM: PROCESS RETURN
  const handleReturnLoan = (id: string, receiver: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = peminjamanList.map((l) => {
      if (l.id === id) {
        return { ...l, status: "Kembali" as const, tanggalKembali: today };
      }
      return l;
    });
    updateAndSync("esarpras_peminjaman", updated, setPeminjamanList);

    const targetLoan = peminjamanList.find((l) => l.id === id);
    if (targetLoan) {
      writeSystemLog("KEMBALI_PINJAM", `${targetLoan.peminjam} mengembalikan ${targetLoan.barangNama} kepada ${receiver}`);
      showToast("Proses pengembalian berhasil dirampungkan.", "success");
    }
  };

  // DISPOSAL / WRITE-OFF: SUBMIT REQUEST
  const handleAddPenghapusan = (newDel: any) => {
    const asset = barangList.find((b) => b.id === newDel.barangId);
    const realDel: Penghapusan = {
      id: newDel.id,
      barangId: newDel.barangId,
      barangNama: newDel.barangNama,
      tanggal: newDel.tanggalPengajuan,
      alasan: newDel.alasan,
      status: "Menunggu Approval",
      nilaiAsetHapus: asset ? asset.harga : 0,
    };

    const updated = [realDel, ...penghapusanList];
    updateAndSync("esarpras_penghapusan", updated, setPenghapusanList);

    writeSystemLog("AJUKAN_PENGHAPUSAN", `Mengajukan write-off/penghapusan barang rusak berat: ${newDel.barangNama}`);
    showToast("Permohonan penghapusan dikirim ke Kepala Sekolah.", "info");
  };

  // DISPOSAL: PRINCIPAL AUTHORIZATION (APPROVE & DESTROY/DELETE FROM ACTIVE DATABASE)
  const handleApprovePenghapusan = (id: string, status: "Disetujui" | "Ditolak") => {
    const updated = penghapusanList.map((del) => {
      if (del.id === id) {
        return {
          ...del,
          status,
          tanggalEksekusi: status === "Disetujui" ? new Date().toISOString().slice(0, 10) : undefined,
          disetujuiOleh: currentUserName,
        };
      }
      return del;
    });
    updateAndSync("esarpras_penghapusan", updated, setPenghapusanList);

    const targetDel = penghapusanList.find((d) => d.id === id);
    if (!targetDel) return;

    if (status === "Disetujui") {
      // HARD-PURGE item from active assets lists so it doesn't skew school valuations! Pure logical consistency!
      const activeAssetsFiltered = barangList.filter((b) => b.id !== targetDel.barangId);
      updateAndSync("esarpras_barang", activeAssetsFiltered, setBarangList);

      writeSystemLog("APPROVE_PENGHAPUSAN", `Kepala Sekolah menyetujui pemusnahan aset ${targetDel.barangNama}. Aset dihapus dari data aktif.`);
      showToast("Aset resmi dihapus permanen dari Legasi.", "warning");
    } else {
      writeSystemLog("REJECT_PENGHAPUSAN", `Kepala Sekolah menolak usulan penghapusan aset ${targetDel.barangNama}.`);
      showToast("Usulan pemusnahan ditolak.", "info");
    }
  };

  // AUDIT OPNAME: START CYCLE
  const handleStartOpname = (petugas: string) => {
    const newSession: StockOpname = {
      id: "so-" + Math.random().toString(36).substr(2, 5),
      tanggal: new Date().toISOString().slice(0, 10),
      petugas,
      totalBarang: barangList.length,
      barangAda: 0,
      barangRusak: 0,
      barangHilang: 0,
      status: "Draft",
      catatan: "Sesi pemeriksaan fisik sarpras aktif.",
    };

    const updated = [...stockOpnameList, newSession];
    updateAndSync("esarpras_stock_opname", updated, setStockOpnameList);
    writeSystemLog("START_STOCK_OPNAME", `Membuka sesi Stock Opname baru dipimpin oleh ${petugas}`);
    showToast("Sesi Stock Opname dibuka!", "success");
  };

  // AUDIT OPNAME: FINALIZE CYCLE & APPLY PHYSICAL UPDATES DYNAMICALLY TO ASSETS
  const handleFinalizeOpname = (sessionId: string, auditedItems: { [id: string]: "Ada" | "Rusak" | "Hilang" }) => {
    let ada = 0;
    let rusak = 0;
    let hilang = 0;

    // Apply physical condition updates dynamically across active assets listing!
    const updatedBarangs = barangList.map((b) => {
      const auditResult = auditedItems[b.id];
      if (auditResult === "Ada") {
        ada++;
        return { ...b, kondisi: "Baik" as const };
      } else if (auditResult === "Rusak") {
        rusak++;
        return { ...b, kondisi: "Rusak Berat" as const };
      } else if (auditResult === "Hilang") {
        hilang++;
        // Keep in DB but flag or add note
        return b;
      }
      return b;
    });

    updateAndSync("esarpras_barang", updatedBarangs, setBarangList);

    // Seal report
    const updatedSessions = stockOpnameList.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: "Selesai" as const,
          barangAda: ada,
          barangRusak: rusak,
          barangHilang: hilang,
          catatan: `Audit fisik rampung: ${ada} Sesuai, ${rusak} Rusak Berat, ${hilang} Hilang.`,
        };
      }
      return s;
    });

    updateAndSync("esarpras_stock_opname", updatedSessions, setStockOpnameList);

    writeSystemLog("FINALIZE_STOCK_OPNAME", `Menyegel Stock Opname. Hasil: ${ada} Sesuai, ${rusak} Rusak, ${hilang} Hilang.`);
    showToast("Audit fisik berhasil disegel & disinkronisasi!", "success");
  };

  // SYSTEM / SETTINGS: SCHOOL METADATA SAVE
  const handleUpdateConfig = (newCfg: SchoolConfig) => {
    updateAndSync("esarpras_school_config", newCfg, setSchoolConfig);
    writeSystemLog("EDIT_PENGATURAN", "Memperbarui metadata identitas profil sekolah.");
    showToast("Profil sekolah berhasil disimpan!", "success");
  };

  // SYSTEM / DATABASE: OVERRIDE RESTORE
  const handlePerformRestore = (restored: any) => {
    updateAndSync("esarpras_barang", restored.barangList, setBarangList);
    updateAndSync("esarpras_ruangan", restored.ruanganList, setRuanganList);
    updateAndSync("esarpras_kategori", restored.kategoriList, setKategoriList);
    updateAndSync("esarpras_sumber_dana", restored.sumberDanaList, setSumberDanaList);
    updateAndSync("esarpras_pengadaan", restored.pengadaanList, setPengadaanList);
    updateAndSync("esarpras_mutasi", restored.mutasiList, setMutasiList);
    updateAndSync("esarpras_maintenance", restored.maintenanceList, setMaintenanceList);
    updateAndSync("esarpras_peminjaman", restored.peminjamanList, setPeminjamanList);
    updateAndSync("esarpras_users", restored.usersList, setUsersList);
    updateAndSync("esarpras_school_config", restored.schoolConfig, setSchoolConfig);

    writeSystemLog("RESTORE_DATABASE", "Restorasi penuh database dari file berkas cadangan selesai.");
    showToast("Sinkronisasi cadangan sukses!", "success");
  };

  // SYSTEM: CLEAR LOGS
  const handleClearLogs = () => {
    updateAndSync("esarpras_logs", [] as ActivityLog[], setLogsList);
    showToast("Log terekam dikosongkan.", "info");
  };

  // SYSTEM: USER MANAGEMENT STATUS TOGGLE
  const handleToggleUserStatus = (id: string) => {
    const updated = usersList.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Aktif" ? ("Nonaktif" as const) : ("Aktif" as const);
        writeSystemLog("TOGGLE_USER_STATUS", `Mengubah status user ${u.name} menjadi ${nextStatus.toUpperCase()}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    updateAndSync("esarpras_users", updated, setUsersList);
    showToast("Status pengguna berhasil diubah.", "info");
  };

  // SYSTEM: REGISTER USER
  const handleAddUser = (newUser: AppUser) => {
    const updated = [...usersList, newUser];
    updateAndSync("esarpras_users", updated, setUsersList);
    writeSystemLog("TAMBAH_USER", `Mendaftarkan staf operator baru: ${newUser.name} (${newUser.role})`);
    showToast(`User ${newUser.name} sukses didaftarkan!`, "success");
  };

  // PRINT QR CODE ACTION SIMULATION
  const handleBulkPrintQR = (items: Barang[]) => {
    showToast(`Menyiapkan lembar cetak QR untuk ${items.length} unit barang...`, "success");
    setTimeout(() => {
      window.print();
    }, 1200);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "dark text-slate-100 bg-slate-950" : "text-slate-900 bg-slate-50"}`}>
      
      {/* Decorative ambient blobs for Frosted Glass refraction */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-sky-400/15 dark:bg-sky-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[-10%] w-[25vw] h-[25vw] rounded-full bg-emerald-300/10 dark:bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole={userRole}
      />

      {/* Main Panel Content Frame */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        
        {/* Topbar Controls */}
        <Topbar
          userRole={userRole}
          onChangeRole={setUserRole}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenScanner={() => {
            setScannerOpen(true);
            setScannedResult(null);
          }}
          barangList={barangList}
          onSelectItem={setSelectedBarang}
        />

        {/* Dynamic Route View rendering with smooth fade class */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          
          {currentView === "dashboard" && (
            <DashboardView
              barangList={barangList}
              ruanganList={ruanganList}
              maintenanceList={maintenanceList}
              logsList={logsList}
              peminjamanList={peminjamanList}
              onNavigate={setCurrentView}
              onSelectItem={setSelectedBarang}
            />
          )}

          {currentView === "master-data" && (
            <MasterDataView
              ruanganList={ruanganList}
              kategoriList={kategoriList}
              sumberDanaList={sumberDanaList}
              barangList={barangList}
              onAddRuangan={handleAddRuangan}
              onAddKategori={handleAddKategori}
              onAddSumberDana={handleAddSumberDana}
            />
          )}

          {currentView === "inventaris-barang" && (
            <InventarisBarangView
              barangList={barangList}
              ruanganList={ruanganList}
              kategoriList={kategoriList}
              sumberDanaList={sumberDanaList}
              onSelectItem={setSelectedBarang}
              onAddBarang={handleAddBarang}
              onDeleteBarang={handleDeleteBarangs}
              onBulkPrintQR={handleBulkPrintQR}
            />
          )}

          {currentView === "inventaris-ruangan" && (
            <InventarisRuanganView
              ruanganList={ruanganList}
              barangList={barangList}
              onSelectItem={setSelectedBarang}
            />
          )}

          {currentView === "pengadaan" && (
            <PengadaanView
              pengadaanList={pengadaanList}
              ruanganList={ruanganList}
              kategoriList={kategoriList}
              sumberDanaList={sumberDanaList}
              userRole={userRole}
              currentUserName={currentUserName}
              onAddRequest={handleAddProcurementRequest}
              onUpdateRequestStatus={handleUpdateProcurementStatus}
            />
          )}

          {currentView === "pemeliharaan" && (
            <PemeliharaanView
              maintenanceList={maintenanceList}
              barangList={barangList}
              userRole={userRole}
              onAddMaintenance={handleAddMaintenance}
              onUpdateStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {currentView === "mutasi" && (
            <MutasiView
              mutasiList={mutasiList}
              barangList={barangList}
              ruanganList={ruanganList}
              onAddMutasi={handleAddMutasi}
            />
          )}

          {currentView === "peminjaman" && (
            <PeminjamanView
              peminjamanList={peminjamanList}
              barangList={barangList}
              userRole={userRole}
              currentUserName={currentUserName}
              onAddLoan={handleAddLoan}
              onApproveLoan={handleApproveLoan}
              onReturnLoan={handleReturnLoan}
            />
          )}

          {currentView === "penghapusan" && (
            <PenghapusanView
              penghapusanList={penghapusanList}
              barangList={barangList}
              userRole={userRole}
              onAddPenghapusan={handleAddPenghapusan}
              onApprovePenghapusan={handleApprovePenghapusan}
            />
          )}

          {currentView === "stock-opname" && (
            <StockOpnameView
              stockOpnameList={stockOpnameList}
              barangList={barangList}
              onStartOpname={handleStartOpname}
              onFinalizeOpname={handleFinalizeOpname}
              onOpenScanner={() => {
                setScannerOpen(true);
                setScannedResult(null);
              }}
              scannedResult={scannedResult}
              onClearScannedResult={() => setScannedResult(null)}
            />
          )}

          {currentView === "laporan" && (
            <LaporanView
              barangList={barangList}
              ruanganList={ruanganList}
              kategoriList={kategoriList}
              sumberDanaList={sumberDanaList}
              mutasiList={mutasiList}
              pengadaanList={pengadaanList}
              maintenanceList={maintenanceList}
              peminjamanList={peminjamanList}
            />
          )}

          {currentView === "perpustakaan" && (
            <PerpustakaanView barangList={barangList} onSelectItem={setSelectedBarang} />
          )}

          {currentView === "multimedia" && (
            <MultimediaView barangList={barangList} onSelectItem={setSelectedBarang} />
          )}

          {currentView === "manajemen-user" && (
            <UserManagementView
              usersList={usersList}
              onToggleUserStatus={handleToggleUserStatus}
              onAddUser={handleAddUser}
            />
          )}

          {currentView === "pengaturan" && schoolConfig && (
            <PengaturanView
              schoolConfig={schoolConfig}
              onUpdateConfig={handleUpdateConfig}
              onPerformRestore={handlePerformRestore}
              allStateData={{
                barangList,
                ruanganList,
                kategoriList,
                sumberDanaList,
                pengadaanList,
                mutasiList,
                maintenanceList,
                peminjamanList,
                usersList,
                schoolConfig
              }}
            />
          )}

          {currentView === "log-aktivitas" && (
            <ActivityLogView logsList={logsList} onClearLogs={handleClearLogs} />
          )}

        </main>
      </div>

      {/* GLOBAL SCANNERS MODAL FOR QR CODE INTEGRATION */}
      {scannerOpen && (
        <ScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScanSuccess={(code) => {
            setScannedResult(code);
            setScannerOpen(false);
            showToast(`QR Code ${code} Berhasil Dipindai!`, "success");
          }}
          barangList={barangList}
        />
      )}

      {/* GLOBAL DETAILED DOSSIER MODAL */}
      {selectedBarang && (
        <DetailModal
          isOpen={!!selectedBarang}
          onClose={() => setSelectedBarang(null)}
          barang={selectedBarang}
          ruanganList={ruanganList}
        />
      )}

      {/* TOAST SYSTEM ACCENT COVER SLIDE-UP */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl flex items-center gap-3 animate-slide-up max-w-sm">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-500/10 text-emerald-600"
                : toast.type === "error"
                ? "bg-red-500/10 text-red-600"
                : toast.type === "warning"
                ? "bg-orange-500/10 text-orange-600"
                : "bg-sky-500/10 text-sky-600"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : toast.type === "error" ? (
              <X className="w-5 h-5" />
            ) : toast.type === "warning" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-4 leading-tight">{toast.message}</p>
        </div>
      )}

    </div>
  );
}
