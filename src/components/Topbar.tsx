/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Menu,
  ShieldCheck,
  User,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { UserRole } from "../types";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: "procurement" | "loan" | "maintenance" | "system";
}

interface TopbarProps {
  onMenuToggle?: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onGlobalSearch?: (query: string) => void;
  onOpenScanner: () => void;
  barangList?: any[];
  onSelectItem?: (barang: any) => void;
}

export default function Topbar({
  onMenuToggle = () => {},
  userRole,
  onChangeRole,
  isDarkMode,
  onToggleDarkMode,
  onGlobalSearch = () => {},
  onOpenScanner,
  barangList = [],
  onSelectItem = () => {},
}: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "Pengajuan Peminjaman Baru",
      desc: "Siti Rahmawati, S.Pd. mengajukan peminjaman Sound System Portable.",
      time: "15 menit yang lalu",
      unread: true,
      type: "loan",
    },
    {
      id: "n-2",
      title: "Persetujuan Pengadaan Diperlukan",
      desc: "Pengadaan Laptop ASUS ExpertBook sebanyak 3 unit menunggu tanda tangan digital Anda.",
      time: "2 jam yang lalu",
      unread: true,
      type: "procurement",
    },
    {
      id: "n-3",
      title: "Notifikasi Pemeliharaan",
      desc: "Printer Epson L3210 (INV-ELK-003) dalam proses perbaikan di teknisi.",
      time: "1 hari yang lalu",
      unread: false,
      type: "maintenance",
    },
    {
      id: "n-4",
      title: "Database Backup Sukses",
      desc: "Backup terjadwal sistem E-SARPRAS berhasil disimpan di cloud.",
      time: "2 hari yang lalu",
      unread: false,
      type: "system",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onGlobalSearch(e.target.value);
  };

  // Get current avatar & profile name based on role
  const getProfileData = () => {
    switch (userRole) {
      case "Administrator":
        return {
          name: "Ahmad Saefudin, S.Pd.I.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          email: "ahmad.saefudin@darussalambayan.sch.id",
        };
      case "Kepala Sekolah":
        return {
          name: "H. M. Syukron, M.Pd.",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
          email: "syukron.kepsek@darussalambayan.sch.id",
        };
      case "Guru":
        return {
          name: "Siti Rahmawati, S.Pd.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          email: "siti.rahmawati@darussalambayan.sch.id",
        };
    }
  };

  const profile = getProfileData();

  return (
    <header
      className="sticky top-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/40 h-16 flex items-center justify-between px-4 lg:px-8 z-40 shadow-sm"
      id="top-navigation"
    >
      {/* Mobile Drawer Trigger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-xs md:max-w-sm w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Ketik untuk cari aset [e.g. Laptop, AC, Meja]..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full text-xs bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Dynamic Utilities, Notifications, Dark Mode & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Active Academic Year Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>TA: 2026/2027</span>
        </div>

        {/* Scanner Shortcut */}
        <button
          onClick={onOpenScanner}
          className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-emerald-500/15"
          title="Buka QR Scanner"
        >
          <Sparkles className="w-4.5 h-4.5" />
        </button>

        {/* Light/Dark Mode Switcher */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title={isDarkMode ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative cursor-pointer"
            title="Pusat Notifikasi"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden py-1 animate-slide-up">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    Pusat Notifikasi
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 transition-colors ${
                        notif.unread
                          ? "bg-emerald-500/5 dark:bg-emerald-500/2"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            notif.unread ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {notif.title}
                        </span>
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                      <span className="text-[9px] text-slate-400 font-mono mt-2 block">
                        {notif.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile dropdown & ROLE SWITCHER */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200/80 dark:border-slate-800"
            />
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 hidden sm:block">
              {profile.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden py-1 animate-slide-up">
                {/* Profile header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-black text-slate-800 dark:text-white">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {profile.email}
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[9px] font-black rounded-full uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{userRole}</span>
                  </div>
                </div>

                {/* Role Simulation Switcher Panel (Aesthetic & Practical) */}
                <div className="p-3 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-2">
                    🔄 Ganti Role Simulasi
                  </span>
                  <div className="flex flex-col gap-1">
                    {(["Administrator", "Kepala Sekolah", "Guru"] as const).map((role) => {
                      const isCurrent = userRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            onChangeRole(role);
                            setProfileOpen(false);
                          }}
                          className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                            isCurrent
                              ? "bg-emerald-600 text-white"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Signout mockup */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Tindakan Logout Berhasil. Untuk masuk kembali, pilih role di atas.");
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Log Keluar Sesi</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
