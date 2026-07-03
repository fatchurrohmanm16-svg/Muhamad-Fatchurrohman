/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Administrator" | "Kepala Sekolah" | "Guru";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  email: string;
  avatar: string;
  status: "Aktif" | "Nonaktif";
}

export interface Ruangan {
  id: string;
  nama: string;
  tipe: "Ruang Kelas" | "Administrasi" | "Pendukung" | "Fasilitas Umum";
  foto: string;
  deskripsi: string;
  nilaiAset?: number; // Calculated dynamically or static
}

export interface KategoriBarang {
  id: string;
  nama: string;
  icon: string;
}

export interface SumberDana {
  id: string;
  nama: string;
}

export interface Barang {
  id: string;
  kodeInventaris: string;
  qrCode: string; // URL or content
  nama: string;
  kategori: string;
  ruanganId: string;
  sumberDana: string;
  merek: string;
  tahunPerolehan: number;
  harga: number;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";
  foto: string;
  keterangan: string;
  isMultimedia?: boolean;
  isPerpustakaan?: boolean;
}

export interface Pengadaan {
  id: string;
  namaBarang: string;
  kategori: string;
  ruanganId: string;
  sumberDana: string;
  merek: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  diajukanOleh: string;
  tanggalPengajuan: string;
  status: "Menunggu Persetujuan" | "Disetujui" | "Ditolak" | "Selesai";
  catatan?: string;
}

export interface Mutasi {
  id: string;
  barangId: string;
  barangNama: string;
  dariRuanganId: string;
  dariRuanganNama: string;
  keRuanganId: string;
  keRuanganNama: string;
  tanggal: string;
  keterangan: string;
  diajukanOleh: string;
}

export interface Maintenance {
  id: string;
  barangId: string;
  barangNama: string;
  tipeKerusakan: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  biaya: number;
  status: "Menunggu Approval" | "Diproses" | "Selesai";
  teknisi: string;
  deskripsi: string;
  disetujuiOleh?: string;
}

export interface StockOpnameDetail {
  barangId: string;
  barangNama: string;
  ruanganNama: string;
  kondisiSebelumnya: string;
  kondisiSekarang: "Baik" | "Rusak Ringan" | "Rusak Berat";
  statusKeberadaan: "Ada" | "Rusak" | "Hilang";
  keterangan: string;
}

export interface StockOpname {
  id: string;
  tanggal: string;
  petugas: string;
  totalBarang: number;
  barangAda: number;
  barangRusak: number;
  barangHilang: number;
  status: "Draft" | "Selesai";
  catatan: string;
  detail?: StockOpnameDetail[];
}

export interface Peminjaman {
  id: string;
  barangId: string;
  barangNama: string;
  peminjam: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  jumlah: number;
  status: "Menunggu Approval" | "Dipinjam" | "Kembali" | "Ditolak";
  keperluan: string;
}

export interface Penghapusan {
  id: string;
  barangId: string;
  barangNama: string;
  tanggal: string;
  alasan: string;
  disetujuiOleh?: string;
  status: "Menunggu Approval" | "Disetujui" | "Ditolak";
  nilaiAsetHapus: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  aktivitas: string;
  detail: string;
  tanggal: string;
}

export interface SchoolConfig {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  akreditasi: string;
  kepalaSekolah: string;
  bendahara: string;
  tahunAjaranAktif: string;
}
