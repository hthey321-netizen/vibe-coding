interface KpiCardsProps {
  total: number;
  attending: number;
  pending: number;
  eventCount: number;
}

export default function KpiCards({ total, attending, pending, eventCount }: KpiCardsProps) {
  const rate = total > 0 ? Math.round((attending / total) * 100 * 10) / 10 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">전체 응답률</p>
        <p className="mt-2 text-3xl font-bold text-blue-600">{rate}%</p>
        <p className="mt-1 text-sm text-gray-400">{attending} / {total}명 응답</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">미응답자 수</p>
        <p className="mt-2 text-3xl font-bold text-red-500">{pending}명</p>
        <p className="mt-1 text-sm text-gray-400">현재 필터 기준</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">이벤트 수</p>
        <p className="mt-2 text-3xl font-bold text-gray-800">{eventCount}건</p>
        <p className="mt-1 text-sm text-gray-400">현재 필터 기준</p>
      </div>
    </div>
  );
}
