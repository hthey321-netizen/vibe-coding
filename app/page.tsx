"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FilterBar from "@/components/FilterBar";
import KpiCards from "@/components/KpiCards";
import ResponseTable, { ResponseRow } from "@/components/ResponseTable";
import AddResponseModal from "@/components/AddResponseModal";

function Dashboard() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.from("departments").select("id, name").order("name").then(({ data }) => {
      setDepartments(data ?? []);
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const depts = searchParams.getAll("dept");
    const statuses = searchParams.getAll("status");
    const priority = searchParams.get("priority");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let query = supabase
      .from("responses")
      .select(`
        id,
        response_status,
        responded_at,
        participants (
          name,
          priority,
          email,
          department_id,
          departments ( name )
        ),
        events (
          title,
          event_type,
          event_date
        )
      `);

    if (statuses.length > 0) {
      query = query.in("response_status", statuses);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching responses:", error);
      setLoading(false);
      return;
    }

    let filtered = (data as unknown as ResponseRow[]) ?? [];

    // 부서 필터 (클라이언트 필터)
    if (depts.length > 0) {
      filtered = filtered.filter((r) => {
        const p = r.participants as unknown as { department_id: string };
        return depts.includes(p?.department_id ?? "");
      });
    }

    // 우선순위 필터
    if (priority) {
      filtered = filtered.filter((r) => r.participants?.priority === priority);
    }

    // 날짜 범위 필터
    if (dateFrom) {
      filtered = filtered.filter((r) => (r.events?.event_date ?? "") >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((r) => (r.events?.event_date ?? "") <= dateTo);
    }

    setRows(filtered);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const attending = rows.filter((r) => r.response_status === "attending").length;
  const pending = rows.filter((r) => r.response_status === "pending").length;
  const eventIds = new Set(rows.map((r) => r.events?.title).filter(Boolean));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">HERD</span>
            <span className="text-xs text-gray-400 hidden sm:block">HR Event Response Dashboard</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>응답 등록</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <FilterBar departments={departments} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <KpiCards
            total={rows.length}
            attending={attending}
            pending={pending}
            eventCount={eventIds.size}
          />
        )}

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="inline-block h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-gray-400">데이터 로딩 중...</p>
          </div>
        ) : (
          <ResponseTable rows={rows} />
        )}
      </main>

      {showModal && (
        <AddResponseModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
