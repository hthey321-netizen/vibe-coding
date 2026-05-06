"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AddResponseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddResponseModal({ onClose, onSuccess }: AddResponseModalProps) {
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [participants, setParticipants] = useState<{ id: string; name: string; departments: { name: string } | null }[]>([]);
  const [form, setForm] = useState({
    event_id: "",
    participant_id: "",
    response_status: "pending",
    responded_at: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("events").select("id, title").order("event_date").then(({ data }) => {
      setEvents(data ?? []);
    });
    supabase.from("participants").select("id, name, departments(name)").order("name").then(({ data }) => {
      setParticipants((data as unknown as typeof participants) ?? []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.event_id || !form.participant_id || !form.response_status) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    const payload: Record<string, string> = {
      event_id: form.event_id,
      participant_id: form.participant_id,
      response_status: form.response_status,
    };
    if (form.responded_at) payload.responded_at = form.responded_at;

    const { error: err } = await supabase.from("responses").insert(payload);
    setSubmitting(false);
    if (err) {
      setError("등록 중 오류가 발생했습니다: " + err.message);
      return;
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">새 응답 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">이벤트 *</label>
            <select
              value={form.event_id}
              onChange={(e) => setForm({ ...form, event_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">이벤트 선택</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">참석자 *</label>
            <select
              value={form.participant_id}
              onChange={(e) => setForm({ ...form, participant_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">참석자 선택</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.departments ? `(${p.departments.name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">응답 상태 *</label>
              <select
                value={form.response_status}
                onChange={(e) => setForm({ ...form, response_status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="attending">참석</option>
                <option value="not_attending">불참</option>
                <option value="pending">미응답</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">응답 일시</label>
              <input
                type="datetime-local"
                value={form.responded_at}
                onChange={(e) => setForm({ ...form, responded_at: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
