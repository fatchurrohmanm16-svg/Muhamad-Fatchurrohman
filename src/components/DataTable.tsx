/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Download,
  Trash2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Search
} from "lucide-react";
import { Barang, Ruangan } from "../types";

interface DataTableProps {
  data: Barang[];
  ruanganList: Ruangan[];
  onSelectItem: (barang: Barang) => void;
  onDeleteItems: (ids: string[]) => void;
  onBulkPrintQR: (items: Barang[]) => void;
}

export default function DataTable({
  data,
  ruanganList,
  onSelectItem,
  onDeleteItems,
  onBulkPrintQR,
}: DataTableProps) {
  // Sorting States
  const [sortField, setSortField] = useState<keyof Barang>("kodeInventaris");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterRuangan, setFilterRuangan] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Rows (Bulk)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    kode: true,
    nama: true,
    kategori: true,
    merek: true,
    ruangan: true,
    sumberDana: true,
    tahun: true,
    harga: true,
    kondisi: true,
  });

  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.kategori)));
  }, [data]);

  // Handle Header Sort Click
  const handleSort = (field: keyof Barang) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter & Sort Logic
  const processedData = useMemo(() => {
    let result = [...data];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.nama.toLowerCase().includes(q) ||
          b.kodeInventaris.toLowerCase().includes(q) ||
          b.merek.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (filterKategori) {
      result = result.filter((b) => b.kategori === filterKategori);
    }

    // Room Filter
    if (filterRuangan) {
      result = result.filter((b) => b.ruanganId === filterRuangan);
    }

    // Condition Filter
    if (filterKondisi) {
      result = result.filter((b) => b.kondisi === filterKondisi);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = (aVal as string).toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchQuery, filterKategori, filterRuangan, filterKondisi, sortField, sortDirection]);

  // Paginated Results
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  const totalPages = Math.max(Math.ceil(processedData.length / itemsPerPage), 1);

  // Row Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentIds = paginatedData.map((b) => b.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = paginatedData.map((b) => b.id);
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllPaginatedSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((b) => selectedIds.includes(b.id));
  }, [paginatedData, selectedIds]);

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} barang terpilih?`)) {
      onDeleteItems(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkPrint = () => {
    const itemsToPrint = data.filter((b) => selectedIds.includes(b.id));
    onBulkPrintQR(itemsToPrint);
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    try {
      const headers = ["Kode Inventaris", "Nama Barang", "Kategori", "Merek", "Sumber Dana", "Tahun Perolehan", "Harga", "Kondisi", "Keterangan"];
      const rows = processedData.map((b) => [
        b.kodeInventaris,
        b.nama,
        b.kategori,
        b.merek,
        b.sumberDana,
        b.tahunPerolehan,
        b.harga,
        b.kondisi,
        b.keterangan || "",
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `E-SARPRAS_Inventaris_SDIT_DB_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPDF = () => {
    alert("Mengekspor Laporan PDF... Cetak laporan ledger siap di jendela browser.");
    window.print();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterKategori("");
    setFilterRuangan("");
    setFilterKondisi("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4" id="section-datatable">
      {/* Search & Dynamic Filter Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        
        {/* Left Filters - Search + Category + Room + Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2 flex-1">
          <div className="relative lg:w-48 xl:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama / kode / merek..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={filterKategori}
            onChange={(e) => {
              setFilterKategori(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterRuangan}
            onChange={(e) => {
              setFilterRuangan(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300"
          >
            <option value="">Semua Ruangan</option>
            {ruanganList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama}
              </option>
            ))}
          </select>

          <select
            value={filterKondisi}
            onChange={(e) => {
              setFilterKondisi(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>

          {(searchQuery || filterKategori || filterRuangan || filterKondisi) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filter
            </button>
          )}
        </div>

        {/* Right Actions - Column Visibility + Export dropdown */}
        <div className="flex items-center gap-2">
          {/* Column Visibility Control */}
          <div className="relative">
            <button
              onClick={() => setColumnMenuOpen(!columnMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Kolom</span>
            </button>

            {columnMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setColumnMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-40 p-2.5 space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">
                    Atur Visibilitas
                  </span>
                  {Object.keys(visibleColumns).map((colKey) => {
                    const typedKey = colKey as keyof typeof visibleColumns;
                    return (
                      <label
                        key={colKey}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[typedKey]}
                          onChange={(e) =>
                            setVisibleColumns({
                              ...visibleColumns,
                              [typedKey]: e.target.checked,
                            })
                          }
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="capitalize">{colKey.replace(/([A-Z])/g, " $1")}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Export CSV / PDF Actions */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
            title="Ekspor CSV Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Ekspor PDF / Cetak"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>

      </div>

      {/* Bulk Action Context-Header (Floating appearance above table) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-4 py-3 rounded-2xl animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {selectedIds.length} Barang Terpilih
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPrint}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cetak Massal QR</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Massal</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                {/* Select All Checkbox */}
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                {visibleColumns.kode && (
                  <th
                    className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    onClick={() => handleSort("kodeInventaris")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Kode Inventaris</span>
                      {sortField === "kodeInventaris" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </th>
                )}
                {visibleColumns.nama && (
                  <th
                    className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Barang</span>
                      {sortField === "nama" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </th>
                )}
                {visibleColumns.kategori && <th className="p-4">Kategori</th>}
                {visibleColumns.merek && <th className="p-4">Merek</th>}
                {visibleColumns.ruangan && <th className="p-4">Ruangan</th>}
                {visibleColumns.sumberDana && <th className="p-4">Sumber Dana</th>}
                {visibleColumns.tahun && (
                  <th
                    className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    onClick={() => handleSort("tahunPerolehan")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Tahun</span>
                      {sortField === "tahunPerolehan" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </th>
                )}
                {visibleColumns.harga && (
                  <th
                    className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    onClick={() => handleSort("harga")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Harga</span>
                      {sortField === "harga" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </th>
                )}
                {visibleColumns.kondisi && <th className="p-4 text-center">Kondisi</th>}
                <th className="p-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-slate-400">
                    <SlidersHorizontal className="w-8 h-8 text-slate-200 dark:text-slate-800 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Tidak ada data inventaris ditemukan</p>
                    <p className="text-[10px] text-slate-500">Coba ubah filter pencarian Anda</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const roomObj = ruanganList.find((r) => r.id === item.ruanganId);
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                        isChecked ? "bg-emerald-500/5 dark:bg-emerald-500/2" : ""
                      }`}
                    >
                      {/* Individual Row Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      {visibleColumns.kode && (
                        <td className="p-4 text-xs font-mono font-bold text-slate-500">
                          {item.kodeInventaris}
                        </td>
                      )}

                      {visibleColumns.nama && (
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.foto}
                              alt={item.nama}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-100"
                            />
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                              {item.nama}
                            </span>
                          </div>
                        </td>
                      )}

                      {visibleColumns.kategori && (
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                          {item.kategori}
                        </td>
                      )}

                      {visibleColumns.merek && (
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                          {item.merek}
                        </td>
                      )}

                      {visibleColumns.ruangan && (
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {roomObj?.nama || item.ruanganId}
                        </td>
                      )}

                      {visibleColumns.sumberDana && (
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                          {item.sumberDana}
                        </td>
                      )}

                      {visibleColumns.tahun && (
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                          {item.tahunPerolehan}
                        </td>
                      )}

                      {visibleColumns.harga && (
                        <td className="p-4 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </td>
                      )}

                      {visibleColumns.kondisi && (
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.kondisi === "Baik"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : item.kondisi === "Rusak Ringan"
                                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                                : "bg-red-500/10 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {item.kondisi}
                          </span>
                        </td>
                      )}

                      {/* Row Action Trigger */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all cursor-pointer"
                          title="Lihat Dossier Aset"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Menampilkan{" "}
            <strong>
              {processedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </strong>{" "}
            sampai{" "}
            <strong>
              {Math.min(currentPage * itemsPerPage, processedData.length)}
            </strong>{" "}
            dari <strong>{processedData.length}</strong> data inventaris
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const p = idx + 1;
              const isCurrent = p === currentPage;

              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 font-bold rounded-lg transition-colors text-xs flex items-center justify-center ${
                    isCurrent
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
