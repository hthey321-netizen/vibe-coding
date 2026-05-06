"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterBarProps {
  departments: { id: string; name: string }[];
}

const STATUS_OPTIONS = [
  { value: "attending", label: "참석" },
  { value: "not_attending", label: "불참" },
  { value: "pending", label: "미응답" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "전체" },
  { value: "high", label: "높음" },
  { value: "normal", label: "일반" },
  { value: "low", label: "낮음" },
];

export default function FilterBar({ departments }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDepts = searchParams.getAll("dept");
  const selectedStatuses = searchParams.getAll("status");
  const priority = searchParams.get("priority") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | string[]>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else if (value) {
          params.set(key, value);
        }
      });
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleDept = (id: string) => {
    const next = selectedDepts.includes(id)
      ? selectedDepts.filter((d) => d !== id)
      : [...selectedDepts, id];
    updateParams({ dept: next });
  };

  const toggleStatus = (value: string) => {
    const next = selectedStatuses.includes(value)
      ? selectedStatuses.filter((s) => s !== value)
      : [...selectedStatuses, value];
    updateParams({ status: next });
  };

  const resetAll = () => router.push("/");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap gap-6">
        {/* 부서 필터 */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">부서</p>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => toggleDept(d.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedDepts.includes(d.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* 응답 상태 필터 */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">응답 상태</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => toggleStatus(s.value)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedStatuses.includes(s.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 우선순위 필터 */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">우선순위</p>
          <select
            value={priority}
            onChange={(e) => updateParams({ priority: e.target.value })}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 날짜 범위 필터 */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">이벤트 날짜</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => updateParams({ dateFrom: e.target.value })}
              className="px-2 py-1.5 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-400 text-sm">~</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => updateParams({ dateTo: e.target.value })}
              className="px-2 py-1.5 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={resetAll}
          className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}
