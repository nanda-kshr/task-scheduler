'use client';

import React from 'react';
import { ISuggestion } from '@/models/Suggestion';
import { Sparkles, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';

interface RescheduleSuggestionsProps {
  suggestions: ISuggestion[];
  onApply: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onApplyAll: () => Promise<void>;
  loading: boolean;
}

export default function RescheduleSuggestions({
  suggestions,
  onApply,
  onReject,
  onApplyAll,
  loading,
}: RescheduleSuggestionsProps) {
  const getFormattedTime = (dateStr: Date) => {
    const d = new Date(dateStr);
    const day = d.getDate() === new Date().getDate() ? 'Today' : 'Tomorrow';
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${time}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col h-full shadow-sm relative overflow-hidden">
      {/* Sparkle Glow Backdrop */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
            AI Reschedule Suggestions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Based on your recent behavior, we recommend rescheduling:
          </p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 space-y-4 my-2">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
            <div className="bg-indigo-50/50 p-3 rounded-full mb-2">
              <Sparkles className="h-6 w-6 text-indigo-400/70" />
            </div>
            <p className="font-semibold text-xs text-slate-500">Your schedule is optimal!</p>
            <p className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] leading-relaxed">
              No anomalies or overload clusters detected by GhostTask AI.
            </p>
          </div>
        ) : (
          suggestions.map((s) => {
            const task = s.taskId as any; // Populated
            const title = task?.title || 'Unknown Task';

            return (
              <div
                key={s._id as any}
                className="group border border-indigo-50 bg-indigo-50/20 hover:bg-indigo-50/40 p-4 rounded-2xl transition-all duration-200 flex flex-col space-y-3 relative"
              >
                {/* Apply/Dismiss floats on hover */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onReject(s._id as any)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onApply(s._id as any)}
                    className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    title="Apply"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 pr-12">{title}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{task?.category} priority task</p>
                </div>

                {/* Reschedule timings */}
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 bg-white/70 py-1.5 px-2.5 rounded-lg border border-slate-100 shadow-sm self-start">
                  <span className="text-slate-400">Original: {getFormattedTime(s.originalDate)}</span>
                  <ArrowRight className="h-3 w-3 text-indigo-500 stroke-[2.5]" />
                  <span className="text-indigo-600">Suggested: {getFormattedTime(s.suggestedDate)}</span>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  "{s.reason}"
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Primary Batch Action */}
      {suggestions.length > 0 && (
        <button
          onClick={onApplyAll}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 rounded-2xl transition shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-2 cursor-pointer mt-4"
        >
          <Sparkles className="h-4 w-4" />
          <span>Apply All Suggestions</span>
        </button>
      )}
    </div>
  );
}
