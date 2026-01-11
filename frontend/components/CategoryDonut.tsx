"use client";

import { useMemo } from "react";
import { CATEGORIES } from "../lib/categories";
import type { CategoryTotal } from "../types/dashboard";

type CategoryDonutProps = {
  categoryTotals: CategoryTotal[];
  unassignedHours: number;
};

/**
 * Category Distribution Donut Chart - V3
 * 
 * Displays a donut/pie chart showing category distribution for the week.
 * Includes unassigned hours in grey. Fully responsive for mobile + desktop.
 * Uses SVG for clean rendering.
 */
export default function CategoryDonut({ 
  categoryTotals, 
  unassignedHours 
}: CategoryDonutProps) {
  const chartData = useMemo(() => {
    const data: Array<{
      categoryId: number;
      name: string;
      hours: number;
      color: string;
      icon: string;
    }> = [];

    // Add tracked categories
    categoryTotals.forEach((ct) => {
      const cat = CATEGORIES[ct.category_id];
      if (cat && ct.hours > 0) {
        data.push({
          categoryId: ct.category_id,
          name: cat.name,
          hours: ct.hours,
          color: getComputedStyle(document.documentElement)
            .getPropertyValue(`--cat-${ct.category_id}`)
            .trim(),
          icon: cat.icon,
        });
      }
    });

    // Add unassigned
    if (unassignedHours > 0) {
      data.push({
        categoryId: -1,
        name: "Unassigned",
        hours: unassignedHours,
        color: getComputedStyle(document.documentElement)
          .getPropertyValue("--cat-unassigned")
          .trim(),
        icon: "⚪",
      });
    }

    return data;
  }, [categoryTotals, unassignedHours]);

  const totalHours = useMemo(
    () => chartData.reduce((sum, d) => sum + d.hours, 0),
    [chartData]
  );

  // Generate SVG donut chart paths
  const donutSegments = useMemo(() => {
    if (totalHours === 0) return [];

    const radius = 80;
    const innerRadius = 50;
    const centerX = 100;
    const centerY = 100;

    let currentAngle = -90; // Start at top

    return chartData.map((d) => {
      const percentage = d.hours / totalHours;
      const angleSize = percentage * 360;
      const endAngle = currentAngle + angleSize;

      // Convert to radians
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate outer arc points
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // Calculate inner arc points
      const x3 = centerX + innerRadius * Math.cos(endRad);
      const y3 = centerY + innerRadius * Math.sin(endRad);
      const x4 = centerX + innerRadius * Math.cos(startRad);
      const y4 = centerY + innerRadius * Math.sin(startRad);

      const largeArcFlag = angleSize > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      currentAngle = endAngle;

      return {
        path: pathData,
        color: d.color,
        name: d.name,
        hours: d.hours,
        percentage: (percentage * 100).toFixed(1),
      };
    });
  }, [chartData, totalHours]);

  if (totalHours === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
        <h2 className="text-sm font-medium text-zinc-300 mb-3">Category Distribution</h2>
        <div className="text-sm text-zinc-500 text-center py-8">No data to display</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-6">
      <h2 className="text-sm font-medium text-zinc-300 mb-4">Category Distribution</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="drop-shadow-lg"
          >
            {donutSegments.map((segment, idx) => (
              <g key={idx}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                  className="transition-opacity hover:opacity-80"
                >
                  <title>
                    {segment.name}: {segment.hours}h ({segment.percentage}%)
                  </title>
                </path>
              </g>
            ))}
            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-xs fill-zinc-400"
              style={{ fontSize: "12px" }}
            >
              Total
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-xl fill-zinc-200 font-semibold"
              style={{ fontSize: "20px" }}
            >
              {totalHours}h
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {chartData.map((d, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-base flex-shrink-0">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-300 truncate">{d.name}</div>
                  <div className="text-zinc-600">
                    {d.hours}h ({((d.hours / totalHours) * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

