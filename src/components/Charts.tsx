/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  valueSuffix?: string;
}

export function BarChart({ data, title, valueSuffix = "" }: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex flex-col h-full justify-between" id="chart-bar">
      {title && (
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {title}
        </h4>
      )}
      <div className="flex items-end justify-between gap-2 h-44 pt-4 border-b border-slate-100 dark:border-slate-800">
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              <div
                className={`absolute -top-6 px-2 py-1 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 text-[10px] font-medium rounded shadow-md z-10 whitespace-nowrap transition-all duration-200 ${
                  hoveredIdx === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                }`}
              >
                {item.label}: {item.value.toLocaleString("id-ID")}{valueSuffix}
              </div>

              {/* Bar Column */}
              <div
                className="w-full rounded-t-sm transition-all duration-300 relative overflow-hidden"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: item.color || "#10b981",
                  opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.65,
                }}
              >
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* X Labels */}
      <div className="flex justify-between gap-2 pt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`flex-1 text-[10px] text-center truncate ${
              hoveredIdx === idx ? "text-slate-900 dark:text-white font-medium" : "text-slate-400 dark:text-slate-500"
            }`}
            title={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
}

export function DonutChart({ data, title }: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  // SVG parameters
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4" id="chart-donut">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            className="dark:stroke-slate-800"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            if (item.value === 0) return null;
            const percentage = (item.value / total) * 100;
            const strokeLength = (circumference * percentage) / 100;
            const dashOffset = currentOffset;
            currentOffset += strokeLength;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={-dashOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Central Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800 dark:text-white">
            {total}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
            {hoveredIdx !== null ? data[hoveredIdx].label : "Total Aset"}
          </span>
          {hoveredIdx !== null && (
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {((data[hoveredIdx].value / total) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        {title && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            {title}
          </h4>
        )}
        <div className="grid grid-cols-1 gap-2">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded transition-colors duration-200 cursor-pointer ${
                hoveredIdx === idx ? "bg-slate-100 dark:bg-slate-800" : ""
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
