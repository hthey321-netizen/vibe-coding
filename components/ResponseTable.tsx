export interface ResponseRow {
  id: string;
  response_status: string;
  responded_at: string | null;
  participants: {
    name: string;
    priority: string;
    email: string;
    departments: { name: string } | null;
  } | null;
  events: {
    title: string;
    event_type: string;
    event_date: string;
  } | null;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  attending: { label: "참석", className: "bg-green-100 text-green-700 border-green-200" },
  not_attending: { label: "불참", className: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "미응답", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

const PRIORITY_MAP: Record<string, { label: string; className: string }> = {
  high: { label: "높음", className: "text-red-600 font-semibold" },
  normal: { label: "일반", className: "text-gray-600" },
  low: { label: "낮음", className: "text-gray-400" },
};

interface ResponseTableProps {
  rows: ResponseRow[];
}

export default function ResponseTable({ rows }: ResponseTableProps) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
        조회된 응답 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">이벤트명</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">이벤트 유형</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">직원명</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">부서</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">응답 상태</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">우선순위</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">이벤트 날짜</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = STATUS_MAP[row.response_status] ?? { label: row.response_status, className: "bg-gray-100 text-gray-600" };
              const priority = PRIORITY_MAP[row.participants?.priority ?? ""] ?? { label: "-", className: "text-gray-400" };
              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    row.response_status === "pending" ? "bg-red-50/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {row.events?.title ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.events?.event_type ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {row.participants?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.participants?.departments?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${priority.className}`}>
                    {priority.label}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.events?.event_date ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
        총 {rows.length}개 결과
      </div>
    </div>
  );
}
