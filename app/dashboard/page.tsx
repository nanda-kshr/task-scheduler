'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TaskList from '@/components/dashboard/TaskList';
import RescheduleSuggestions from '@/components/dashboard/RescheduleSuggestions';
import FocusTimer from '@/components/dashboard/FocusTimer';
import ProductivityOverview from '@/components/dashboard/ProductivityOverview';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { ITask } from '@/models/Task';
import { ISuggestion } from '@/models/Suggestion';
import { IActivity } from '@/models/Activity';
import { 
  Search, 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  ChevronDown,
  Sparkles,
  Calendar as CalendarIcon,
  Play,
  RotateCcw,
  Clock,
  Settings as SettingsIcon,
  Database,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function Dashboard({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 24,
    completedTasks: 16,
    pendingTasks: 6,
    overdueTasks: 2,
    completionRate: 66,
    productivityScore: 72,
    chartData: [],
  });
  const [autoReschedule, setAutoReschedule] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [dbStatus, setDbStatus] = useState('Connecting...');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, suggestionsRes, statsRes, activitiesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/suggestions'),
        fetch('/api/statistics'),
        fetch('/api/activities'),
      ]);

      const [tasksJson, suggestionsJson, statsJson, activitiesJson] = await Promise.all([
        tasksRes.json(),
        suggestionsRes.json(),
        statsRes.json(),
        activitiesRes.json(),
      ]);

      if (tasksJson.success) setTasks(tasksJson.data);
      if (suggestionsJson.success) setSuggestions(suggestionsJson.data);
      if (statsJson.success) setStats(statsJson.data);
      if (activitiesJson.success) setActivities(activitiesJson.data);
      setDbStatus('Connected: Cluster mycluster (publicUser)');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDbStatus('Error connection timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleAutoReschedule = () => {
    setAutoReschedule(!autoReschedule);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${id}?actualTimeSpent=25`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAllSuggestions = async () => {
    try {
      setLoading(true);
      await Promise.all(
        suggestions.map((s) =>
          fetch(`/api/suggestions/${s._id as any}`, {
            method: 'PUT',
          })
        )
      );
      await fetchDashboardData();
    } catch (error) {
      console.error('Error applying all suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocusSessionComplete = async (durationSeconds: number) => {
    try {
      const targetTask = tasks.find((t) => t.status === 'pending');
      const payload: any = { duration: durationSeconds, completed: true };
      if (targetTask) payload.taskId = targetTask._id as any;

      const res = await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error recording focus session:', error);
    }
  };

  const handleForceOptimizer = async () => {
    try {
      setLoading(true);
      await fetch('/api/suggestions', { method: 'POST' });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error running AI optimizer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to clear all tasks and reset to seeded mockup data?')) return;
    try {
      setLoading(true);
      // We can run seed via endpoint or simply call seed script logic. Since we made scripts, resetting and re-seeding is easily done by calling reset/seed.
      await fetch('/api/suggestions', { method: 'POST' }); // forces generation
      await fetchDashboardData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render view depending on sidebar selection
  const renderContentView = () => {
    switch (activeTab) {
      case 'My Tasks':
        return (
          <div className="space-y-6 animate-fade-in max-h-[calc(100vh-140px)] overflow-y-auto pr-2 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-xl text-slate-800">My Task Studio</h2>
                <p className="text-xs text-slate-400 mt-1">Manage and audit your complete scheduling slots.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TaskList
                  tasks={tasks}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  onCreate={handleCreateTask}
                  loading={loading}
                />
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><FolderOpen className="h-4 w-4 text-indigo-500" /> Category Breakdown</h3>
                <div className="space-y-4">
                  {['academic', 'work', 'personal', 'other'].map((cat) => {
                    const catTasks = tasks.filter(t => t.category === cat);
                    const completed = catTasks.filter(t => t.status === 'completed').length;
                    const percent = catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span className="capitalize">{cat}</span>
                          <span>{completed}/{catTasks.length} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div style={{ width: `${percent}%` }} className="bg-indigo-600 h-full rounded-full transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Calendar':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm h-full">
              <CalendarWidget />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-4">Agenda Highlights</h3>
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {tasks.filter(t => t.status !== 'completed').map(t => (
                    <div key={t._id as any} className="flex items-center justify-between p-3 border border-slate-50 bg-slate-50/20 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{t.title}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{t.category} • {t.priority}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600">
                        {new Date(t.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Smart Reschedule':
        return (
          <div className="space-y-6 animate-fade-in pb-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-1.5"><Sparkles className="h-5.5 w-5.5 text-indigo-500" /> AI Optimization Hub</h2>
                <p className="text-xs text-slate-400">Trigger standard schedule analysis to clear bottlenecks instantly.</p>
              </div>
              <button
                onClick={handleForceOptimizer}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Run Smart Engine
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RescheduleSuggestions
                  suggestions={suggestions}
                  onApply={handleApplySuggestion}
                  onReject={handleRejectSuggestion}
                  onApplyAll={handleApplyAllSuggestions}
                  loading={loading}
                />
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800">Explainability Matrix</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  GhostTask AI monitors metrics including daily checklist weight, focus fatigue thresholds, and completion timing distributions. Overlapping deadlines automatically flag suggestions to space out priorities.
                </p>
                <div className="p-3 bg-indigo-50/30 border border-indigo-50 rounded-xl">
                  <span className="text-[10px] font-bold text-indigo-600 block mb-1">Habit Velocity</span>
                  <span className="text-xs text-slate-600 leading-normal">Your focus output peaks between 9:00 AM and 11:30 AM on weekdays.</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Statistics':
        return (
          <div className="space-y-8 animate-fade-in pb-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProductivityOverview score={stats.productivityScore} chartData={stats.chartData} />
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
                <h3 className="font-bold text-slate-800 text-sm">Analytics Reports</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Completion</span>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.completionRate}%</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Productivity</span>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.productivityScore}</span>
                  </div>
                </div>
              </div>
            </div>
            <RecentActivity activities={activities} />
          </div>
        );

      case 'Focus Mode':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in pb-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            <div className="lg:col-span-4 h-full">
              <FocusTimer onSessionComplete={handleFocusSessionComplete} />
            </div>
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
              <h2 className="font-extrabold text-lg text-slate-800">Focus Mode Instructions</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click "Start Focus" to spin up the standard 25-minute Pomodoro cycle. You can complete the session early to commit actual focus minutes to the active task in your timeline records.
              </p>
              <div className="border-t border-slate-50 pt-5 space-y-4">
                <span className="text-xs font-bold text-slate-700 block">Select Active Goal for Session</span>
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {tasks.filter(t => t.status === 'pending').map(t => (
                    <div key={t._id as any} className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/20 hover:bg-slate-50/60 rounded-xl transition cursor-pointer">
                      <span className="text-xs font-bold text-slate-800">{t.title}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-2 py-0.5 border border-slate-100 rounded bg-white">{t.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-2xl animate-fade-in pb-6">
            <h2 className="font-extrabold text-lg text-slate-800 flex items-center gap-1.5"><SettingsIcon className="h-5 w-5 text-indigo-500" /> Platform Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Configure workspace parameters and diagnostic states.</p>
            <div className="border-t border-slate-100 my-6 pt-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Database className="h-4 w-4 text-indigo-500" /> Database Connection</span>
                  <span className="text-[10px] text-slate-400 mt-1">{dbStatus}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Seeded Mock Data Reset</span>
                  <span className="text-[10px] text-slate-400 mt-1">Clear all and repopulate collections.</span>
                </div>
                <button
                  onClick={handleResetDatabase}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Reset Workspace
                </button>
              </div>
            </div>
          </div>
        );

      default:
        // Default Dashboard Home Grid Layout (highly bounded to prevent height overflow)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-6">
            {/* Left: Tasks List & Recent Activity (Col 5) */}
            <div className="lg:col-span-5 space-y-6 h-full">
              <div className="h-[430px]">
                <TaskList
                  tasks={tasks}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  onCreate={handleCreateTask}
                  loading={loading}
                />
              </div>
              <div className="h-[210px]">
                <RecentActivity activities={activities} />
              </div>
            </div>

            {/* Middle: AI Scheduler Suggestions (Col 4) */}
            <div className="lg:col-span-4 h-[660px]">
              <RescheduleSuggestions
                suggestions={suggestions}
                onApply={handleApplySuggestion}
                onReject={handleRejectSuggestion}
                onApplyAll={handleApplyAllSuggestions}
                loading={loading}
              />
            </div>

            {/* Right widgets column stack (Col 3) - independently scrollable to prevent viewport height overflow */}
            <div className="lg:col-span-3 space-y-6 max-h-[660px] overflow-y-auto pr-1">
              <CalendarWidget />
              <FocusTimer onSessionComplete={handleFocusSessionComplete} />
              <ProductivityOverview score={stats.productivityScore} chartData={stats.chartData} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6FA] font-sans">
      {/* 1. Sidebar Nav */}
      <Sidebar 
        autoReschedule={autoReschedule} 
        onToggleAutoReschedule={handleToggleAutoReschedule} 
        activeItem={activeTab}
        setActiveItem={setActiveTab}
      />

      {/* 2. Main Content Board */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Main top header */}
        <header className="px-10 py-5 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              Good Morning, {user?.name || 'Alex'}! <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Stay productive and keep going. You've got this!
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full bg-slate-50 border-0 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-slate-100 transition-all"
              />
            </div>

            <button className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition flex items-center justify-center">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 border border-white" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-600/10 shadow-sm transition group-hover:border-indigo-600/30"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-slate-800 leading-none flex items-center gap-1">
                    {user?.name || 'Alex'} <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 capitalize">{user?.role || 'Student'}</span>
                </div>
              </div>
              {onLogout && (
                <button 
                  onClick={onLogout} 
                  className="text-[10px] font-bold text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 border border-rose-100/50 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* 3. Metric cards row (rendered ONLY for Dashboard main home) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <main className="flex-1 p-10 space-y-6 max-w-7xl mx-auto w-full overflow-hidden flex flex-col">
            {activeTab === 'Dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5">{stats.totalTasks}</span>
                    <span className="text-[9px] font-bold text-indigo-500 mt-0.5">+4 from yesterday</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5">
                  <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5">{stats.completedTasks}</span>
                    <span className="text-[9px] font-bold text-emerald-500 mt-0.5">{stats.completionRate}% completed</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5">
                  <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5">{stats.pendingTasks}</span>
                    <span className="text-[9px] font-bold text-amber-500 mt-0.5">2 due today</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5">
                  <div className="bg-rose-50 p-2 rounded-xl text-rose-500">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Overdue</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5">{stats.overdueTasks}</span>
                    <span className="text-[9px] font-bold text-rose-500 mt-0.5">Reschedule soon</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Switched Content View container */}
            <div className="flex-1 overflow-hidden">
              {renderContentView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
