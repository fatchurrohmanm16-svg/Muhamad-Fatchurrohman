/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Ruangan,
  KategoriBarang,
  SumberDana,
  Barang,
  User,
  Pengadaan,
  Mutasi,
  Maintenance,
  StockOpname,
  Peminjaman,
  Penghapusan,
  ActivityLog,
  SchoolConfig
} from "./types";

export const initialUsers: User[] = [
  {
    id: "usr-1",
    name: "Ahmad Saefudin, S.Pd.I.",
    username: "ahmad_admin",
    role: "Administrator",
    email: "ahmad.saefudin@darussalambayan.sch.id",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "Aktif"
  },
  {
    id: "usr-2",
    name: "H. M. Syukron, M.Pd.",
    username: "syukron_kepsek",
    role: "Kepala Sekolah",
    email: "syukron.kepsek@darussalambayan.sch.id",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    status: "Aktif"
  },
  {
    id: "usr-3",
    name: "Siti Rahmawati, S.Pd.",
    username: "siti_guru",
    role: "Guru",
    email: "siti.rahmawati@darussalambayan.sch.id",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Aktif"
  }
];

export const initialRuangan: Ruangan[] = [
  // Ruang Kelas
  { id: "r-k1a", nama: "Kelas 1A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung A Lantai 1, berkapasitas 28 siswa" },
  { id: "r-k1b", nama: "Kelas 1B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung A Lantai 1, berkapasitas 28 siswa" },
  { id: "r-k2a", nama: "Kelas 2A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung A Lantai 2, berkapasitas 30 siswa" },
  { id: "r-k2b", nama: "Kelas 2B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung A Lantai 2, berkapasitas 30 siswa" },
  { id: "r-k3a", nama: "Kelas 3A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung B Lantai 1, berkapasitas 30 siswa" },
  { id: "r-k3b", nama: "Kelas 3B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung B Lantai 1, berkapasitas 30 siswa" },
  { id: "r-k4a", nama: "Kelas 4A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung B Lantai 2, berkapasitas 32 siswa" },
  { id: "r-k4b", nama: "Kelas 4B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung B Lantai 2, berkapasitas 32 siswa" },
  { id: "r-k5a", nama: "Kelas 5A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung C Lantai 1, berkapasitas 32 siswa" },
  { id: "r-k5b", nama: "Kelas 5B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung C Lantai 1, berkapasitas 32 siswa" },
  { id: "r-k6a", nama: "Kelas 6A", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung C Lantai 2, berkapasitas 32 siswa" },
  { id: "r-k6b", nama: "Kelas 6B", tipe: "Ruang Kelas", foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung C Lantai 2, berkapasitas 32 siswa" },

  // Administrasi
  { id: "r-guru", nama: "Kantor Guru", tipe: "Administrasi", foto: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung Utama Lantai 1, ruang kerja dan istirahat guru" },
  { id: "r-kepsek", nama: "Kantor Kepala Sekolah", tipe: "Administrasi", foto: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung Utama Lantai 1, ruang Kepala Sekolah dan tamu" },
  { id: "r-tu", nama: "Tata Usaha", tipe: "Administrasi", foto: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung Utama Lantai 1, pusat administrasi sekolah" },

  // Pendukung
  { id: "r-perpus", nama: "Perpustakaan", tipe: "Pendukung", foto: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung B Lantai 1, koleksi buku dan ruang baca modern" },
  { id: "r-multimedia", nama: "Ruang Perangkat Multimedia", tipe: "Pendukung", foto: "https://images.unsplash.com/photo-1562774053-401386df7f56?w=600&auto=format&fit=crop&q=80", deskripsi: "Gedung C Lantai 2, laboratorium komputer dan multimedia" },

  // Fasilitas Umum
  { id: "r-musholla", nama: "Musholla", tipe: "Fasilitas Umum", foto: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80", deskripsi: "Lantai 1 dekat Gedung Utama, kapasitas 150 jamaah" },
  { id: "r-toilet_utara", nama: "Toilet Utara", tipe: "Fasilitas Umum", foto: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80", deskripsi: "Fasilitas toilet siswa laki-laki" },
  { id: "r-toilet_selatan", nama: "Toilet Selatan", tipe: "Fasilitas Umum", foto: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80", deskripsi: "Fasilitas toilet siswa perempuan" },
  { id: "r-gudang", nama: "Gudang", tipe: "Fasilitas Umum", foto: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80", deskripsi: "Penyimpanan cadangan dan barang rusak" }
];

export const initialKategori: KategoriBarang[] = [
  { id: "cat-mebel", nama: "Mebel", icon: "Armchair" },
  { id: "cat-elektronik", nama: "Elektronik", icon: "Tv" },
  { id: "cat-multimedia", nama: "Multimedia", icon: "MonitorPlay" },
  { id: "cat-perpus", nama: "Buku Perpustakaan", icon: "BookOpen" },
  { id: "cat-belajar", nama: "Peralatan Pembelajaran", icon: "GraduationCap" },
  { id: "cat-ibadah", nama: "Peralatan Ibadah", icon: "Heart" },
  { id: "cat-kebersihan", nama: "Kebersihan", icon: "Trash2" },
  { id: "cat-olahraga", nama: "Olahraga", icon: "Dribbble" },
  { id: "cat-admin", nama: "Administrasi", icon: "Briefcase" },
  { id: "cat-atk", nama: "ATK", icon: "PenTool" }
];

export const initialSumberDana: SumberDana[] = [
  { id: "dana-bos", nama: "BOS" },
  { id: "dana-bansek", nama: "BANSEK" },
  { id: "dana-yayasan", nama: "Yayasan" },
  { id: "dana-hibah", nama: "Hibah" },
  { id: "dana-donatur", nama: "Donatur Lainnya" }
];

export const initialBarang: Barang[] = [
  // Mebel
  {
    id: "brg-1",
    kodeInventaris: "INV-MEB-001",
    qrCode: "INV-MEB-001-SDIT-DB",
    nama: "Meja Guru Kayu Jati",
    kategori: "Mebel",
    ruanganId: "r-guru",
    sumberDana: "Yayasan",
    merek: "Lokal Kudus",
    tahunPerolehan: 2024,
    harga: 1200000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&auto=format&fit=crop&q=80",
    keterangan: "Meja laci berbahan kayu jati asli, sangat kokoh."
  },
  {
    id: "brg-2",
    kodeInventaris: "INV-MEB-002",
    qrCode: "INV-MEB-002-SDIT-DB",
    nama: "Kursi Belajar Ergonomis Siswa",
    kategori: "Mebel",
    ruanganId: "r-k1a",
    sumberDana: "BOS",
    merek: "Chitose",
    tahunPerolehan: 2025,
    harga: 350000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&auto=format&fit=crop&q=80",
    keterangan: "Kursi belajar siswa kelas 1A, warna hijau emerald senada."
  },
  {
    id: "brg-3",
    kodeInventaris: "INV-MEB-003",
    qrCode: "INV-MEB-003-SDIT-DB",
    nama: "Lemari Buku Perpustakaan Besar",
    kategori: "Mebel",
    ruanganId: "r-perpus",
    sumberDana: "BANSEK",
    merek: "Olimpic",
    tahunPerolehan: 2023,
    harga: 2800000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400&auto=format&fit=crop&q=80",
    keterangan: "Lemari kaca pajangan buku referensi."
  },

  // Elektronik
  {
    id: "brg-4",
    kodeInventaris: "INV-ELK-001",
    qrCode: "INV-ELK-001-SDIT-DB",
    nama: "AC Split Panasonic 1.5 PK",
    kategori: "Elektronik",
    ruanganId: "r-multimedia",
    sumberDana: "BOS",
    merek: "Panasonic",
    tahunPerolehan: 2024,
    harga: 4800000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&auto=format&fit=crop&q=80",
    keterangan: "Pendingin ruangan laboratorium komputer, berfungsi optimal."
  },
  {
    id: "brg-5",
    kodeInventaris: "INV-ELK-002",
    qrCode: "INV-ELK-002-SDIT-DB",
    nama: "Laptop ASUS ExpertBook L1400",
    kategori: "Elektronik",
    ruanganId: "r-tu",
    sumberDana: "BOS",
    merek: "ASUS",
    tahunPerolehan: 2024,
    harga: 8500000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    keterangan: "Operasional Tata Usaha untuk penginputan dapodik.",
    isMultimedia: true
  },
  {
    id: "brg-6",
    kodeInventaris: "INV-ELK-003",
    qrCode: "INV-ELK-003-SDIT-DB",
    nama: "Printer Epson L3210 EcoTank",
    kategori: "Elektronik",
    ruanganId: "r-tu",
    sumberDana: "Yayasan",
    merek: "Epson",
    tahunPerolehan: 2025,
    harga: 2600000,
    kondisi: "Rusak Ringan",
    foto: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80",
    keterangan: "Paper feed sering macet jika kertas terlalu tebal."
  },

  // Multimedia
  {
    id: "brg-7",
    kodeInventaris: "INV-MUL-001",
    qrCode: "INV-MUL-001-SDIT-DB",
    nama: "Proyektor Epson EB-X06 XGA",
    kategori: "Multimedia",
    ruanganId: "r-k4a",
    sumberDana: "BANSEK",
    merek: "Epson",
    tahunPerolehan: 2024,
    harga: 5500000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&auto=format&fit=crop&q=80",
    keterangan: "Proyektor gantung untuk media interaktif kelas.",
    isMultimedia: true
  },
  {
    id: "brg-8",
    kodeInventaris: "INV-MUL-002",
    qrCode: "INV-MUL-002-SDIT-DB",
    nama: "Smart TV LG 55 Inch AI ThinQ",
    kategori: "Multimedia",
    ruanganId: "r-kepsek",
    sumberDana: "BOS",
    merek: "LG",
    tahunPerolehan: 2025,
    harga: 7500000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&auto=format&fit=crop&q=80",
    keterangan: "Digunakan untuk presentasi rapat dan monitoring CCTV.",
    isMultimedia: true
  },

  // Buku Perpustakaan
  {
    id: "brg-9",
    kodeInventaris: "INV-BKP-001",
    qrCode: "INV-BKP-001-SDIT-DB",
    nama: "Buku Paket Agama Islam Kelas 1 Kurikulum Merdeka",
    kategori: "Buku Perpustakaan",
    ruanganId: "r-perpus",
    sumberDana: "BOS",
    merek: "Kemendikbudristek",
    tahunPerolehan: 2023,
    harga: 45000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&auto=format&fit=crop&q=80",
    keterangan: "Sebanyak 35 eksemplar di Perpustakaan.",
    isPerpustakaan: true
  },
  {
    id: "brg-10",
    kodeInventaris: "INV-BKP-002",
    qrCode: "INV-BKP-002-SDIT-DB",
    nama: "Ensiklopedia Sains Anak 10 Jilid",
    kategori: "Buku Perpustakaan",
    ruanganId: "r-perpus",
    sumberDana: "Donatur Lainnya",
    merek: "Kamil Pustaka",
    tahunPerolehan: 2024,
    harga: 1500000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
    keterangan: "Hibah dari wali murid kelas 6, terawat sangat baik.",
    isPerpustakaan: true
  },

  // Peralatan Ibadah
  {
    id: "brg-11",
    kodeInventaris: "INV-PDI-001",
    qrCode: "INV-PDI-001-SDIT-DB",
    nama: "Sajadah Imam Turki Premium",
    kategori: "Peralatan Ibadah",
    ruanganId: "r-musholla",
    sumberDana: "Donatur Lainnya",
    merek: "Al-Miraj",
    tahunPerolehan: 2024,
    harga: 450000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1609137144813-f938f381c15a?w=400&auto=format&fit=crop&q=80",
    keterangan: "Sajadah tebal berbulu halus warna hijau tua."
  },
  {
    id: "brg-12",
    kodeInventaris: "INV-PDI-002",
    qrCode: "INV-PDI-002-SDIT-DB",
    nama: "Sound System Portable Musholla",
    kategori: "Peralatan Ibadah",
    ruanganId: "r-musholla",
    sumberDana: "Yayasan",
    merek: "Baretone",
    tahunPerolehan: 2025,
    harga: 3200000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80",
    keterangan: "Digunakan untuk pengajian dan adzan sholat berjamaah."
  },

  // Olahraga
  {
    id: "brg-13",
    kodeInventaris: "INV-OLR-001",
    qrCode: "INV-OLR-001-SDIT-DB",
    nama: "Meja Tenis Meja Joola Original",
    kategori: "Olahraga",
    ruanganId: "r-gudang",
    sumberDana: "Yayasan",
    merek: "Joola",
    tahunPerolehan: 2022,
    harga: 4500000,
    kondisi: "Rusak Berat",
    foto: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&auto=format&fit=crop&q=80",
    keterangan: "Papan triplek melengkung parah akibat lembab di gudang bawah tangga."
  },
  {
    id: "brg-14",
    kodeInventaris: "INV-OLR-002",
    qrCode: "INV-OLR-002-SDIT-DB",
    nama: "Bola Basket Molten BG4500 FIBA Approved",
    kategori: "Olahraga",
    ruanganId: "r-gudang",
    sumberDana: "BOS",
    merek: "Molten",
    tahunPerolehan: 2025,
    harga: 850000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80",
    keterangan: "Bola basket kulit sintetis premium."
  },

  // Pembelajaran
  {
    id: "brg-15",
    kodeInventaris: "INV-PBL-001",
    qrCode: "INV-PBL-001-SDIT-DB",
    nama: "Globe Dunia Fisik Jumbo",
    kategori: "Peralatan Pembelajaran",
    ruanganId: "r-k5a",
    sumberDana: "BOS",
    merek: "Pudak Scientific",
    tahunPerolehan: 2024,
    harga: 420000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&auto=format&fit=crop&q=80",
    keterangan: "Media pembelajaran geografi, skala akurat."
  },

  // Kebersihan
  {
    id: "brg-16",
    kodeInventaris: "INV-KBS-001",
    qrCode: "INV-KBS-001-SDIT-DB",
    nama: "Vacuum Cleaner Wet & Dry",
    kategori: "Kebersihan",
    ruanganId: "r-gudang",
    sumberDana: "BOS",
    merek: "Karcher",
    tahunPerolehan: 2024,
    harga: 1850000,
    kondisi: "Baik",
    foto: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&auto=format&fit=crop&q=80",
    keterangan: "Penyedot debu untuk karpet musholla dan perpustakaan."
  }
];

export const initialPengadaan: Pengadaan[] = [
  {
    id: "req-1",
    namaBarang: "Laptop ASUS ExpertBook B1400",
    kategori: "Elektronik",
    ruanganId: "r-guru",
    sumberDana: "BOS",
    merek: "ASUS",
    jumlah: 3,
    hargaSatuan: 8500000,
    totalHarga: 25500000,
    diajukanOleh: "Siti Rahmawati, S.Pd.",
    tanggalPengajuan: "2026-06-28",
    status: "Menunggu Persetujuan",
    catatan: "Kebutuhan mendesak untuk menunjang pengerjaan RPP dan e-Rapor guru."
  },
  {
    id: "req-2",
    namaBarang: "Al-Quran Hafalan Tikrar A5",
    kategori: "Peralatan Ibadah",
    ruanganId: "r-musholla",
    sumberDana: "Donatur Lainnya",
    merek: "Syaamil Quran",
    jumlah: 50,
    hargaSatuan: 75000,
    totalHarga: 3750000,
    diajukanOleh: "Ahmad Saefudin, S.Pd.I.",
    tanggalPengajuan: "2026-06-25",
    status: "Disetujui",
    catatan: "Untuk program tahfidz pagi siswa SDIT Darussalam Bayan."
  },
  {
    id: "req-3",
    namaBarang: "Proyektor BenQ MX506",
    kategori: "Multimedia",
    ruanganId: "r-k3a",
    sumberDana: "BANSEK",
    merek: "BenQ",
    jumlah: 1,
    hargaSatuan: 5100000,
    totalHarga: 5100000,
    diajukanOleh: "Siti Rahmawati, S.Pd.",
    tanggalPengajuan: "2026-06-10",
    status: "Selesai",
    catatan: "Telah diterima, dalam kondisi baik, dan sudah dipasang di kelas 3A."
  }
];

export const initialMutasi: Mutasi[] = [
  {
    id: "mut-1",
    barangId: "brg-15",
    barangNama: "Globe Dunia Fisik Jumbo",
    dariRuanganId: "r-gudang",
    dariRuanganNama: "Gudang",
    keRuanganId: "r-k5a",
    keRuanganNama: "Kelas 5A",
    tanggal: "2026-06-15",
    keterangan: "Dipindahkan dari gudang penyimpanan untuk praktek geografi Kelas 5A.",
    diajukanOleh: "Ahmad Saefudin, S.Pd.I."
  }
];

export const initialMaintenance: Maintenance[] = [
  {
    id: "maint-1",
    barangId: "brg-6",
    barangNama: "Printer Epson L3210 EcoTank",
    tipeKerusakan: "Paper feed macet & tinta putus-putus",
    tanggalMulai: "2026-07-01",
    biaya: 250000,
    status: "Diproses",
    teknisi: "Cahaya Komputer Service",
    deskripsi: "Penggantian roller penarik kertas dan cleaning printhead.",
    disetujuiOleh: "H. M. Syukron, M.Pd."
  },
  {
    id: "maint-2",
    barangId: "brg-4",
    barangNama: "AC Split Panasonic 1.5 PK",
    tipeKerusakan: "AC kurang dingin & berisik",
    tanggalMulai: "2026-05-20",
    tanggalSelesai: "2026-05-20",
    biaya: 150000,
    status: "Selesai",
    teknisi: "Maju Jaya Teknik AC",
    deskripsi: "Cuci rutin, tambah freon, dan perbaikan penutup casing luar yang longgar.",
    disetujuiOleh: "H. M. Syukron, M.Pd."
  }
];

export const initialStockOpname: StockOpname[] = [
  {
    id: "so-1",
    tanggal: "2026-06-30",
    petugas: "Ahmad Saefudin, S.Pd.I.",
    totalBarang: 16,
    barangAda: 15,
    barangRusak: 2,
    barangHilang: 0,
    status: "Selesai",
    catatan: "Satu meja olahraga rusak berat di gudang (papan melengkung). Satu printer Epson perlu diservis. Semua barang lainnya lengkap.",
    detail: [
      {
        barangId: "brg-1",
        barangNama: "Meja Guru Kayu Jati",
        ruanganNama: "Kantor Guru",
        kondisiSebelumnya: "Baik",
        kondisiSekarang: "Baik",
        statusKeberadaan: "Ada",
        keterangan: "Sangat baik, laci terkunci."
      },
      {
        barangId: "brg-13",
        barangNama: "Meja Tenis Meja Joola Original",
        ruanganNama: "Gudang",
        kondisiSebelumnya: "Rusak Ringan",
        kondisiSekarang: "Rusak Berat",
        statusKeberadaan: "Rusak",
        keterangan: "Triplek melengkung karena tumpukan barang lain."
      }
    ]
  }
];

export const initialPeminjaman: Peminjaman[] = [
  {
    id: "loan-1",
    barangId: "brg-12",
    barangNama: "Sound System Portable Musholla",
    peminjam: "Siti Rahmawati, S.Pd.",
    tanggalPinjam: "2026-07-04",
    tanggalKembali: "2026-07-04",
    jumlah: 1,
    status: "Menunggu Approval",
    keperluan: "Peminjaman untuk acara parenting dan pelepasan siswa di aula sekolah."
  },
  {
    id: "loan-2",
    barangId: "brg-14",
    barangNama: "Bola Basket Molten BG4500",
    peminjam: "Siti Rahmawati, S.Pd.",
    tanggalPinjam: "2026-06-20",
    tanggalKembali: "2026-06-20",
    jumlah: 1,
    status: "Kembali",
    keperluan: "Praktek olahraga basket siswa kelas 5A."
  }
];

export const initialPenghapusan: Penghapusan[] = [
  {
    id: "disp-1",
    barangId: "brg-13",
    barangNama: "Meja Tenis Meja Joola Original",
    tanggal: "2026-07-02",
    alasan: "Rusak berat total, triplek melapuk, tidak dapat diperbaiki lagi secara ekonomis.",
    status: "Menunggu Approval",
    nilaiAsetHapus: 4500000
  }
];

export const initialLogs: ActivityLog[] = [
  {
    id: "log-1",
    userId: "usr-1",
    userName: "Ahmad Saefudin, S.Pd.I.",
    userRole: "Administrator",
    aktivitas: "Mengubah Status Barang",
    detail: "Mengubah kondisi Printer Epson L3210 (INV-ELK-003) menjadi Rusak Ringan",
    tanggal: "2026-07-03 08:30:12"
  },
  {
    id: "log-2",
    userId: "usr-3",
    userName: "Siti Rahmawati, S.Pd.",
    userRole: "Guru",
    aktivitas: "Mengajukan Peminjaman Barang",
    detail: "Mengajukan peminjaman Sound System Portable Musholla untuk Parenting",
    tanggal: "2026-07-03 09:15:40"
  },
  {
    id: "log-3",
    userId: "usr-1",
    userName: "Ahmad Saefudin, S.Pd.I.",
    userRole: "Administrator",
    aktivitas: "Melakukan Backup Database",
    detail: "Backup database harian berhasil disimpan ke sistem cloud",
    tanggal: "2026-07-03 10:00:00"
  }
];

export const initialSchoolConfig: SchoolConfig = {
  namaSekolah: "SDIT Darussalam Bayan",
  npsn: "20239011",
  alamat: "Jl. Bayan Raya No. 12, Bayan, Kec. Bayan, Lombok Utara, Nusa Tenggara Barat",
  telepon: "0812-3456-7890",
  email: "sdit.darussalam.bayan@gmail.com",
  akreditasi: "A (Sangat Baik)",
  kepalaSekolah: "H. M. Syukron, M.Pd.",
  bendahara: "Ahmad Saefudin, S.Pd.I.",
  tahunAjaranAktif: "2026/2027"
};
