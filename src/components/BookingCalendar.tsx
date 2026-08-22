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
  apartment: string;
  locale?: string;
  maxDate?: Date;
};

const CS_MONTHS = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const CS_DAYS   = ["Po","Út","St","Čt","Pá","So","Ne"];

export default function BookingCalendar({ checkIn, checkOut, onRangeChange, apartment, locale, maxDate }: Props) {
  const isCz = locale === "cs";
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [blockedRanges, setBlockedRanges] = useState<{ start: Date; end: Date }[]>([]);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?apartment=${apartment}`)
      .then((r) => r.json())
      .then((data: { start: string; end: string }[]) => {
        setBlockedRanges(data.map((r) => ({ start: new Date(r.start), end: new Date(r.end) })));
      })
      .catch(() => setBlockedRanges([]))
      .finally(() => setLoading(false));
    // Reset selection when apartment changes
    onRangeChange(null, null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartment]);

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
  const isBeyondMax = (date: Date) => {
    if (maxDate && isAfter(startOfDay(date), startOfDay(maxDate))) return true;
    if (apartment !== "whole") {
      const limit = startOfDay(new Date());
      limit.setDate(limit.getDate() + 21);
      if (isAfter(startOfDay(date), limit)) return true;
    }
    return false;
  };

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
    if (isPast(date) || isBlocked(date) || isBeyondMax(date)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onRangeChange(date, null);
    } else {
      if (isBefore(date, checkIn)) {
        onRangeChange(date, null);
      } else {
        const days = eachDayOfInterval({ start: checkIn, end: date });
        const hasBlocked = days.some((d) => isBlocked(d));
        const nights = days.length - 1;
        if (hasBlocked || nights < 2) {
          onRangeChange(date, null);
        } else {
          onRangeChange(checkIn, date);
        }
      }
    }
  };

  const renderMonth = (monthStart: Date) => {
    const days = eachDayOfInterval({ start: startOfMonth(monthStart), end: endOfMonth(monthStart) });
    const startWeekday = (startOfMonth(monthStart).getDay() + 6) % 7;

    return (
      <div className="flex-1">
        <div className="text-center font-serif text-lg text-forest-900 mb-4">
          {isCz ? `${CS_MONTHS[monthStart.getMonth()]} ${format(monthStart, "yyyy")}` : format(monthStart, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 mb-2">
          {(isCz ? CS_DAYS : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map((d) => (
            <div key={d} className="text-center text-xs font-sans text-forest-400 py-1 tracking-wider">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const past     = isPast(day);
            const blocked  = isBlocked(day);
            const beyondMax = isBeyondMax(day);
            const selected = isSelected(day);
            const inRange  = isInRange(day);
            const disabled = past || blocked || beyondMax;

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
                  disabled   ? "text-forest-300 cursor-not-allowed" : "hover:bg-forest-100 cursor-pointer",
                  selected   ? "bg-forest-700 text-stone-warm hover:bg-forest-700 z-10" : "",
                  inRange && !selected ? "bg-forest-100 text-forest-900" : "",
                  blocked    ? "line-through" : "",
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
        {isCz ? "Načítám dostupnost…" : "Loading availability…"}
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
          disabled={(() => {
            const effectiveMax = apartment !== "whole"
              ? (() => { const d = new Date(); d.setDate(d.getDate() + 21); return d; })()
              : maxDate;
            return effectiveMax ? !isBefore(addMonths(currentMonth, 1), startOfMonth(addMonths(effectiveMax, 1))) : false;
          })()}
          className="p-2 text-forest-700 hover:text-forest-900 disabled:text-forest-300 transition-colors"
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
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-forest-700 inline-block" /> {isCz ? "Vybraný den" : "Selected"}</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-forest-100 inline-block" /> {isCz ? "Váš pobyt" : "Your stay"}</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-forest-50 border border-forest-200 inline-block" /><span className="line-through">{isCz ? "Obsazeno" : "Unavailable"}</span></span>
      </div>
    </div>
  );
}
