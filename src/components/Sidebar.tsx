/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutDashboard,
  Database,
  Archive,
  Home,
  PlusCircle,
  ArrowLeftRight,
  Wrench,
  ClipboardCheck,
  UserCheck,
  Trash2,
  BookOpen,
  MonitorPlay,
  FileBarChart2,
  Users,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { UserRole } from "../types";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  userRole,
  mobileOpen = false,
  setMobileOpen = () => {},
}: SidebarProps) {
  // Define menu items with roles that can access them
  const menuGroups = [
    {
      group: "Core",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Administrator", "Kepala Sekolah", "Guru"] },
        { id: "master-data", label: "Master Data", icon: Database, roles: ["Administrator"] },
      ],
    },
    {
      group: "Inventarisasi",
      items: [
        { id: "inventaris-barang", label: "Inventaris Barang", icon: Archive, roles: ["Administrator"] },
        { id: "inventaris-ruangan", label: "Inventaris Ruangan", icon: Home, roles: ["Administrator", "Kepala Sekolah", "Guru"] },
      ],
    },
    {
      group: "Operasional",
      items: [
        { id: "pengadaan", label: "Pengadaan Barang", icon: PlusCircle, roles: ["Administrator", "Kepala Sekolah"] },
        { id: "mutasi", label: "Mutasi Barang", icon: ArrowLeftRight, roles: ["Administrator"] },
        { id: "pemeliharaan", label: "Pemeliharaan / Servis", icon: Wrench, roles: ["Administrator", "Kepala Sekolah", "Guru"] },
        { id: "stock-opname", label: "Stock Opname", icon: ClipboardCheck, roles: ["Administrator", "Kepala Sekolah"] },
        { id: "peminjaman", label: "Peminjaman Barang", icon: UserCheck, roles: ["Administrator", "Guru"] },
        { id: "penghapusan", label: "Penghapusan Barang", icon: Trash2, roles: ["Administrator", "Kepala Sekolah"] },
      ],
    },
    {
      group: "Katalog Khusus",
      items: [
        { id: "perpustakaan", label: "Perpustakaan", icon: BookOpen, roles: ["Administrator", "Guru"] },
        { id: "multimedia", label: "Perangkat Multimedia", icon: MonitorPlay, roles: ["Administrator", "Guru"] },
      ],
    },
    {
      group: "Laporan & Sistem",
      items: [
        { id: "laporan", label: "Laporan Evaluasi", icon: FileBarChart2, roles: ["Administrator", "Kepala Sekolah"] },
        { id: "manajemen-user", label: "Manajemen User", icon: Users, roles: ["Administrator"] },
        { id: "pengaturan", label: "Pengaturan Sistem", icon: Settings, roles: ["Administrator"] },
        { id: "log-aktivitas", label: "Log Aktivitas", icon: Activity, roles: ["Administrator"] },
      ],
    },
  ];

  const handleMenuClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false); // Close mobile drawer on click
  };

  const renderSchoolLogo = () => (
    <div className="flex items-center gap-3 py-1">
      {/* Academy Crest Badge in Emerald Green */}
      <div className="relative w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20 border border-emerald-500 overflow-hidden">
        <GraduationCap className="w-5 h-5 text-white z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-700 to-emerald-400 opacity-50" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-400/20 rounded-full blur-sm" />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col min-w-0 transition-opacity duration-300">
          <span className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight tracking-tight uppercase flex items-center gap-1">
            E-SARPRAS <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-1.5 py-0.2 rounded font-black">v1.2</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate">
            SDIT Darussalam Bayan
          </span>
        </div>
      )}
    </div>
  );

  const sidebarContent = () => (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-white/20 dark:border-slate-800/40 transition-all duration-300">
      {/* Crest Logo Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {renderSchoolLogo()}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Sembunyikan Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menuGroups.map((group, gIdx) => {
          // Check if any item in group is authorized for current user role
          const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1.5">
              {!isCollapsed && (
                <h5 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                  {group.group}
                </h5>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15 font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="text-xs tracking-tight transition-all duration-300 truncate">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsed Mode Toggler Footer (Desktop) */}
      {isCollapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Tampilkan Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Small Badge showing current user Role */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-center">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">
            Role: {userRole}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg: and up) */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Drawer Sheet */}
          <div className="relative w-64 max-w-xs h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-white/20 dark:border-slate-800/40 z-50 flex flex-col animate-slide-right shadow-2xl">
            {sidebarContent()}
          </div>
        </div>
      )}
    </>
  );
}
