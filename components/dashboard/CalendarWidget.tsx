'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Mock task highlights for visual aesthetic in calendar
  const highlightDays = [2, 14, 21, 27]; 

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between h-full shadow-sm">
      {/* Header Month / Year & Arrows */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
        <h2 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-indigo-500" />
          Calendar
        </h2>
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold text-slate-600">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <div className="flex items-center space-x-1">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-slate-100 text-slate-500 transition">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-slate-100 text-slate-500 transition">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid calendar */}
      <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5 text-center">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[10px] uppercase font-bold text-slate-400">
            {day}
          </span>
        ))}

        {/* Empty offsets */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`empty-${i}`} className="text-xs py-1.5 text-transparent select-none">
            -
          </span>
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
          const hasTask = highlightDays.includes(day);

          return (
            <span
              key={`day-${day}`}
              className={`text-xs font-bold py-1.5 rounded-xl cursor-pointer relative transition duration-150 flex items-center justify-center ${
                isToday
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {day}
              {hasTask && !isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
