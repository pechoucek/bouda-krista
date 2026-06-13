"use client";

import { useEffect, useState, useCallback } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  isWithinInterval,
  startOfDay,
} from "date-fns";

type Props = {
  checkIn: Date | null;
  checkOut: Date | null;
  onRangeChange: (checkIn: Date | null, checkOut: Date | null) => void;
};

export default function BookingCalendar({ checkIn, checkOut, onRangeChange }: Props) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [blockedRanges, setBlockedRanges] = useState<{ start: Date; end: Date }[]>([]);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data: { start: string; end: string }[]) => {
        setBlockedRanges(data.map((r) => ({ start: new Date(r.start), end: new Date(r.end) })));
      })
      .catch(() => setBlockedRanges([]))
      .finally(() => setLoading(false));
  }, []);

  const isBlocked = useCallback(
    (date: Date) => {
      const d = startOfDay(date);
      return blockedRanges.some((r) =>
        isWithinInterval(d, { start: startOfDay(r.start), end: startOfDay(r.end) })
      );
    },
    [blockedRanges]
  );

  const isPast = (date: Date) => isBefore(startOfDay(date), startOfDay(new Date()));

  const isSelected = (date: Date) => {
    if (checkIn && isSameDay(date, checkIn)) return true;
    if (checkOut && isSameDay(date, checkOut)) return true;
    return false;
  };

  const isInRange = (date: Date) => {
    const end = checkOut ?? hoverDate;
    if (!checkIn || !end) return false;
    const d = startOfDay(date);
    const s = startOfDay(checkIn);
    const e = startOfDay(end);
    if (isBefore(e, s)) return false;
    return isWithinInterval(d, { start: s, end: e });
  };

  const handleClick = (date: Date) => {
    if (isPast(date) || isBlocked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onRangeChange(date, null);
    } else {
      if (isBefore(date, checkIn)) {
        onRangeChange(date, null);
      } else {
        // check no blocked days in range
        const days = eachDayOfInterval({ start: checkIn, end: date });
        const hasBlocked = days.some((d) => isBlocked(d));
        if (hasBlocked) {
          onRangeChange(date, null);
        } else {
          onRangeChange(checkIn, date);
        }
      }
    }
  };

  const renderMonth = (monthStart: Date) => {
    const days = eachDayOfInterval({ start: startOfMonth(monthStart), end: endOfMonth(monthStart) });
    const startWeekday = (startOfMonth(monthStart).getDay() + 6) % 7; // Mon=0

    return (
      <div className="flex-1">
        <div className="text-center font-serif text-lg text-forest-900 mb-4">
          {format(monthStart, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 mb-2">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="text-center text-xs font-sans text-forest-400 py-1 tracking-wider">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const past = isPast(day);
            const blocked = isBlocked(day);
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const isStart = checkIn && isSameDay(day, checkIn);
            const isEnd = checkOut && isSameDay(day, checkOut);
            const disabled = past || blocked;

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => handleClick(day)}
                onMouseEnter={() => checkIn && !checkOut && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
                className={[
                  "relative h-10 text-sm font-sans transition-colors",
                  disabled ? "text-forest-300 cursor-not-allowed" : "hover:bg-forest-100 cursor-pointer",
                  selected ? "bg-forest-700 text-stone-warm hover:bg-forest-700 z-10" : "",
                  inRange && !selected ? "bg-forest-100 text-forest-900" : "",
                  isStart ? "rounded-l-none" : "",
                  isEnd ? "rounded-r-none" : "",
                  blocked ? "line-through" : "",
                ].join(" ")}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-forest-400 font-sans text-sm">
        Loading availability…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
          disabled={!isAfter(currentMonth, startOfMonth(new Date()))}
          className="p-2 text-forest-700 hover:text-forest-900 disabled:text-forest-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-2 text-forest-700 hover:text-forest-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-8">
        {renderMonth(currentMonth)}
        <div className="hidden md:block w-px bg-forest-200" />
        {renderMonth(addMonths(currentMonth, 1))}
      </div>

      <div className="flex gap-6 mt-4 text-xs font-sans text-forest-500">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-forest-700 inline-block" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-forest-100 inline-block" /> Your stay
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-forest-50 border border-forest-200 inline-block" />
          <span className="line-through">Unavailable</span>
        </span>
      </div>
    </div>
  );
}
