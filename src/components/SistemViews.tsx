/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { BookOpen, MonitorPlay, Users, Settings, Activity, ShieldCheck, DownloadCloud, UploadCloud, Save, Trash2, Search, Plus, UserPlus, X, Key, Info, HelpCircle } from "lucide-react";
import { Barang, User as AppUser, SchoolConfig, ActivityLog, UserRole, Ruangan, KategoriBarang, SumberDana, Pengadaan, Mutasi, Maintenance, Peminjaman } from "../types";

// ==========================================
// 1. LIBRARY SUB-CATALOG COMPONENT
// ==========================================
interface PerpustakaanViewProps {
  barangList: Barang[];
  onSelectItem: (barang: Barang) => void;
}
export function PerpustakaanView({ barangList, onSelectItem }: PerpustakaanViewProps) {
  const [search, setSearch] = useState("");
  const books = useMemo(() => {
    return barangList
      .filter((b) => b.isPerpustakaan || b.kategori === "Buku Perpustakaan")
      .filter((b) => b.nama.toLowerCase().includes(search.toLowerCase()) || b.merek.toLowerCase().includes(search.toLowerCase()));
  }, [barangList, search]);

  return (
    <div className="space-y-6" id="view-perpustakaan">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5.5 h-5.5 text-emerald-600" /> Katalog Khusus Perpustakaan
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Katalogisasi khusus buku paket, literatur, referensi, dan modul pembelajaran milik perpustakaan sekolah.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul buku / pustaka..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <div className="col-span-full text-center py-24 text-slate-400 text-xs">
            Tidak ada item perpustakaan ditemukan.
          </div>
        ) : (
          books.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectItem(b)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl shadow-xs flex gap-4 hover:border-emerald-500/20 cursor-pointer group"
            >
              <img
                src={b.foto}
                alt={b.nama}
                referrerPolicy="no-referrer"
                className="w-16 h-20 rounded-lg object-cover border shrink-0 bg-slate-50"
              />
              <div className="flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">{b.kodeInventaris}</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs truncate group-hover:text-emerald-600 transition-colors">
                    {b.nama}
                  </h4>
                  <p className="text-[10px] text-slate-400">Pengarang/Merek: {b.merek}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold w-fit mt-1">
                  Kondisi: {b.kondisi}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. MULTIMEDIA SUB-CATALOG COMPONENT
// ==========================================
interface MultimediaViewProps {
  barangList: Barang[];
  onSelectItem: (barang: Barang) => void;
}
export function MultimediaView({ barangList, onSelectItem }: MultimediaViewProps) {
  const [search, setSearch] = useState("");
  const electronics = useMemo(() => {
    return barangList
      .filter((b) => b.isMultimedia || b.kategori === "Elektronik" || b.kategori === "Multimedia")
      .filter((b) => b.nama.toLowerCase().includes(search.toLowerCase()) || b.merek.toLowerCase().includes(search.toLowerCase()));
  }, [barangList, search]);

  return (
    <div className="space-y-6" id="view-multimedia">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <MonitorPlay className="w-5.5 h-5.5 text-emerald-600" /> Katalog Khusus Multimedia & IT
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar legasi inventaris perangkat teknologi pembelajaran, laboratorium komputer, TV cerdas, proyektor, dan sound system.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari perangkat multimedia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {electronics.length === 0 ? (
          <div className="col-span-full text-center py-24 text-slate-400 text-xs">
            Tidak ada perangkat multimedia ditemukan.
          </div>
        ) : (
          electronics.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectItem(b)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-500/20 cursor-pointer group flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative border-b border-slate-50 dark:border-slate-800">
                <img
                  src={b.foto}
                  alt={b.nama}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase">{b.kodeInventaris}</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs leading-snug line-clamp-2">
                    {b.nama}
                  </h4>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold">{b.merek}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.2 rounded-md ${
                      b.kondisi === "Baik" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850"
                    }`}
                  >
                    {b.kondisi}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. USER MANAGEMENT COMPONENT
// ==========================================
interface UserManagementViewProps {
  usersList: AppUser[];
  onToggleUserStatus: (id: string) => void;
  onAddUser: (u: AppUser) => void;
}
export function UserManagementView({ usersList, onToggleUserStatus, onAddUser }: UserManagementViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Guru" as UserRole, password: "" });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onAddUser({
      id: "usr-" + Math.random().toString(36).substr(2, 5),
      name: formData.name,
      username: formData.email.split("@")[0],
      email: formData.email,
      role: formData.role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      status: "Aktif",
    });

    setShowAdd(false);
    setFormData({ name: "", email: "", role: "Guru", password: "" });
  };

  return (
    <div className="space-y-6" id="view-users">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-emerald-600" /> Manajemen Pengguna & Hak Akses
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Daftar legasi operator sistem, hak akses berdasar jabatan (Administrator, Kepala Sekolah, Guru).
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 p-4">
              <th className="p-4">Nama Lengkap</th>
              <th className="p-4">Surel / Email</th>
              <th className="p-4">Level Akses</th>
              <th className="p-4">Status Akun</th>
              <th className="p-4 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {usersList.map((usr) => (
              <tr key={usr.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">{usr.name}</td>
                <td className="p-4 font-mono font-medium text-slate-500">{usr.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      usr.role === "Administrator"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400"
                        : usr.role === "Kepala Sekolah"
                        ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                    }`}
                  >
                    {usr.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      usr.status === "Aktif" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usr.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onToggleUserStatus(usr.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition-colors border ${
                      usr.status === "Aktif"
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {usr.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Registrasi Pengguna Baru</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadzah Fatimah, S.Pd."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Surel / Email</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: fatimah@darussalam.sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Hak Akses Sistem</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Kepala Sekolah">Kepala Sekolah (Supervisor)</option>
                  <option value="Administrator">Administrator (Sarpras Koordinator)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">
                  Daftarkan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. SETTINGS & BACKUP/RESTORE DATABASE COMPONENT
// ==========================================
interface PengaturanViewProps {
  schoolConfig: SchoolConfig;
  onUpdateConfig: (cfg: SchoolConfig) => void;
  onPerformRestore: (restoredData: any) => void;
  allStateData: {
    barangList: Barang[];
    ruanganList: Ruangan[];
    kategoriList: KategoriBarang[];
    sumberDanaList: SumberDana[];
    pengadaanList: Pengadaan[];
    mutasiList: Mutasi[];
    maintenanceList: Maintenance[];
    peminjamanList: Peminjaman[];
    usersList: AppUser[];
    schoolConfig: SchoolConfig;
  };
}
export function PengaturanView({ schoolConfig, onUpdateConfig, onPerformRestore, allStateData }: PengaturanViewProps) {
  const [formData, setFormData] = useState({ ...schoolConfig });
  const [restoreProgress, setRestoreProgress] = useState<number | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
  };

  // BACKUP FUNCTION: Serializes full app state to a JSON file and downloads it instantly!
  const handleBackupClick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allStateData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ESARPRAS_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // RESTORE FUNCTION: Reads a JSON backup file and replaces all localStates in real-time!
  const handleFileRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          
          // Verify basic compliance
          if (!parsed.barangList || !parsed.ruanganList || !parsed.usersList) {
            alert("Format cadangan tidak valid atau rusak.");
            return;
          }

          // Simulate restore progress bar
          setRestoreProgress(20);
          const interval = setInterval(() => {
            setRestoreProgress((p) => {
              if (p === null) return null;
              if (p >= 100) {
                clearInterval(interval);
                onPerformRestore(parsed);
                setTimeout(() => setRestoreProgress(null), 1000);
                return 100;
              }
              return p + 40;
            });
          }, 200);

        } catch (err) {
          alert("Gagal membaca file cadangan. Pastikan file berformat .json");
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6" id="view-settings">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-emerald-600" /> Pengaturan Sistem & Basis Data
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Ubah konfigurasi profil instansi sekolah, tahun ajaran aktif, dan amankan database melalui modul cadangan instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metadata config fields */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-5">
            Identitas Sekolah
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">NPSN Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Kepala Sekolah Aktif</label>
                <input
                  type="text"
                  required
                  value={formData.headmaster}
                  onChange={(e) => setFormData({ ...formData, headmaster: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  required
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Alamat Lengkap Instansi</label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all w-fit"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        </div>

        {/* Right Column: Backup Restore */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Cadangan & Pulihkan Database
            </h3>
            
            <div className="p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Seluruh data inventarisasi berjalan tersimpan lokal di peramban browser Anda. Amankan data secara berkala ke komputer pribadi agar terhindar dari pembersihan cache.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* BACKUP BUTTON */}
              <button
                onClick={handleBackupClick}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-emerald-500/20 text-slate-800 dark:text-slate-200 rounded-2xl flex items-center justify-between text-xs cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                    <DownloadCloud className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold block">Unduh Cadangan (.json)</span>
                    <span className="text-[10px] text-slate-400">Arsipkan seluruh database</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 group-hover:translate-x-0.5 transition-transform">UNDUH</span>
              </button>

              {/* RESTORE UPLOADER */}
              <label className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-emerald-500/20 text-slate-800 dark:text-slate-200 rounded-2xl flex items-center justify-between text-xs cursor-pointer group transition-all">
                <input type="file" accept=".json" onChange={handleFileRestoreChange} className="hidden" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-950/40 text-purple-600 rounded-xl">
                    <UploadCloud className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold block">Pulihkan Database</span>
                    <span className="text-[10px] text-slate-400">Unggah file cadangan sebelumnya</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-purple-600 group-hover:translate-x-0.5 transition-transform">UNGGAH</span>
              </label>

              {/* Progress Indicator */}
              {restoreProgress !== null && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full transition-all duration-200" style={{ width: `${restoreProgress}%` }} />
                  </div>
                  <p className="text-[9.5px] text-purple-700 font-bold text-center">Menyusun ulang relasi database... {restoreProgress}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 text-center text-[10px] text-slate-400 font-mono border-t border-slate-50 dark:border-slate-800/80 mt-6">
            E-SARPRAS SDIT Darussalam Bayan • v1.2.0-Lombok-Utara
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. ACTIVITY LOG COMPONENT
// ==========================================
interface ActivityLogViewProps {
  logsList: ActivityLog[];
  onClearLogs: () => void;
}
export function ActivityLogView({ logsList, onClearLogs }: ActivityLogViewProps) {
  const [search, setSearch] = useState("");
  const filteredLogs = useMemo(() => {
    return logsList.filter(
      (log) =>
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.detail.toLowerCase().includes(search.toLowerCase()) ||
        log.aktivitas.toLowerCase().includes(search.toLowerCase())
    );
  }, [logsList, search]);

  return (
    <div className="space-y-6" id="view-logs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5.5 h-5.5 text-emerald-600" /> Log Histori & Audit Jejak Sistem
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Audit trail sekuriti: Pencatatan otomatis setiap aksi pendaftaran, pemindahan, audit, peminjaman, dan pengubahan aset.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari log / petugas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mengosongkan log histori aktivitas? Tindakan ini tidak dapat dibatalkan.")) {
                onClearLogs();
              }
            }}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl cursor-pointer"
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4 w-44">Waktu Kejadian</th>
              <th className="p-4 w-36">Aksi Sistem</th>
              <th className="p-4 w-44">Petugas / Operator</th>
              <th className="p-4">Deskripsi / Detail Aktivitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-400">
                  Tidak ada log histori aktivitas terekam.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/15 transition-all">
                  <td className="p-4 font-mono font-semibold text-slate-400">{log.tanggal}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                        log.action.includes("CREATE") || log.action.includes("TAMBAH")
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action.includes("DELETE") || log.action.includes("HAPUS")
                          ? "bg-red-100 text-red-800"
                          : "bg-sky-100 text-sky-850"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-slate-700 dark:text-slate-300">{log.userName}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{log.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
