import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Flame, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Task, TeamMember, Activity, Project, Priority } from '../types';

interface DashboardTabProps {
  workspaceName: string;
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  activities: Activity[];
  onAddTask: (title: string, projectId: string, priority: Priority) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onSelectTab: (tab: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings') => void;
}

export default function DashboardTab({
  workspaceName,
  tasks,
  projects,
  members,
  activities,
  onAddTask,
  onToggleTaskStatus,
  onSelectTab
}: DashboardTabProps) {
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickProject, setQuickProject] = useState<string>(projects[0]?.id || 'p1');
  const [quickPriority, setQuickPriority] = useState<Priority>('Medium');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      onAddTask(quickTitle.trim(), quickProject, quickPriority);
      setQuickTitle('');
    }
  };

  // Helper stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
  const highPriorityDue = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Render priority styling
  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  // Render project styling
  const getProjectTag = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return null;
    
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    };
    
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${colorClasses[proj.themeColor] || 'bg-slate-800 text-slate-300'}`}>
        {proj.name}
      </span>
    );
  };

  const getMemberAvatar = (assigneeId: string) => {
    const mem = members.find(m => m.id === assigneeId);
    return mem ? mem.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80';
  };

  const getMemberName = (assigneeId: string) => {
    const mem = members.find(m => m.id === assigneeId);
    return mem ? mem.name : 'Unassigned';
  };

  // Mock Weekly Productivity SVG Chart Values (Mon-Sun completion count)
  const weeklyProductivity = [
    { day: 'Mon', count: 4, label: '4 Resolved' },
    { day: 'Tue', count: 7, label: '7 Resolved' },
    { day: 'Wed', count: 5, label: '5 Resolved' },
    { day: 'Thu', count: 9, label: '9 Resolved' },
    { day: 'Fri', count: 6, label: '6 Resolved' },
    { day: 'Sat', count: 2, label: '2 Resolved' },
    { day: 'Sun', count: 3, label: '3 Resolved' },
  ];

  const maxCount = 10;

  return (
    <div id="dashboard-tab" className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_right,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider w-fit">
              <Sparkles className="w-3 h-3 text-blue-400" />
              WORKSPACE ACTIVE
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Good morning, Alex.</h1>
            <p className="text-xs text-white/60 leading-relaxed max-w-xl">
              You have <span className="text-blue-400 font-extrabold">{highPriorityDue} high priority tasks</span> due today. Let's sync up, clear blockers, and enter the flow state.
            </p>
          </div>
          <button 
            onClick={() => onSelectTab('tasks')}
            className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-500/15 transition-all cursor-pointer"
          >
            Manage Roadmap
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total tasks */}
        <div className="p-4 rounded-xl glass-card-interactive flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Tasks</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono font-bold">+12%</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white block leading-none">{totalTasks}</span>
            <span className="text-[10px] text-white/45 mt-1 block">active across workspace</span>
          </div>
        </div>

        {/* Completion rate */}
        <div className="p-4 rounded-xl glass-card-interactive flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 leading-none mb-1">
              <span className="text-2xl font-extrabold text-white">{completionRate}%</span>
              <span className="text-[10px] text-blue-400 font-bold">Peak (84%)</span>
            </div>
            <div className="w-full bg-black/40 border border-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>

        {/* High priority */}
        <div className="p-4 rounded-xl glass-card-interactive flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Pending High Priority</span>
            <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-rose-400 block leading-none">{highPriorityDue}</span>
            <span className="text-[10px] text-white/45 mt-1 block">requires immediate focus</span>
          </div>
        </div>

        {/* Focus Hours */}
        <div className="p-4 rounded-xl glass-card-interactive flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Focus Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-2xl font-extrabold text-white">124</span>
              <span className="text-xs text-white/50 font-medium ml-1">hours</span>
            </div>
            <span className="text-[10px] text-white/45 mt-1 block">this month active tracking</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Quick Add & Tasks Feed) - Spans 2 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Task input block */}
          <div className="p-5 rounded-xl glass-panel shadow-lg">
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-sans">
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              Quick Dispatch Task
            </h3>
            
            <form onSubmit={handleQuickAdd} className="flex flex-col gap-3">
              <input 
                type="text" 
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Type a new task description and press Enter..." 
                className="w-full glass-input rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-white/30"
              />

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Select project */}
                  <select 
                    value={quickProject}
                    onChange={(e) => setQuickProject(e.target.value)}
                    className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-white/60 outline-none cursor-pointer hover:border-white/10 transition-all font-medium"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0f0f18] text-white">{p.name}</option>
                    ))}
                  </select>

                  {/* Select priority */}
                  <select 
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value as Priority)}
                    className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-white/60 outline-none cursor-pointer hover:border-white/10 transition-all font-medium"
                  >
                    <option value="High" className="bg-[#0f0f18] text-rose-400">High Priority</option>
                    <option value="Medium" className="bg-[#0f0f18] text-amber-400">Medium Priority</option>
                    <option value="Low" className="bg-[#0f0f18] text-emerald-400">Low Priority</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={!quickTitle.trim()}
                  className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[11px] font-bold px-4 py-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>

          {/* Recent Tasks List */}
          <div className="p-5 rounded-xl glass-panel shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">Recent Active Tasks</h3>
              <button 
                onClick={() => onSelectTab('tasks')}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
              >
                All Tasks Board <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {tasks.filter(t => t.status !== 'Archived').slice(0, 5).map((task) => (
                <div 
                  key={task.id}
                  className="p-3.5 rounded-lg glass-card-interactive flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button 
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="text-white/30 hover:text-blue-400 transition-colors shrink-0 cursor-pointer"
                    >
                      {task.status === 'Done' ? (
                        <CheckCircle className="w-4.5 h-4.5 text-blue-500" />
                      ) : (
                        <Circle className="w-4.5 h-4.5" />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold block truncate ${task.status === 'Done' ? 'line-through text-white/30' : 'text-white/90'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {getProjectTag(task.projectId)}
                        <span className={`text-[9px] font-mono border px-1.5 py-0.2 rounded ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-white/40 flex items-center gap-0.5">
                          <Calendar className="w-3 h-3 text-white/30" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assignee Avatar */}
                  <div className="flex items-center shrink-0">
                    <img 
                      src={getMemberAvatar(task.assigneeId)} 
                      alt={getMemberName(task.assigneeId)} 
                      title={getMemberName(task.assigneeId)}
                      className="w-6 h-6 rounded-full border border-white/10 object-cover" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Productivity Chart & Activities Feed) */}
        <div className="flex flex-col gap-6">
          
          {/* SVG Weekly Productivity Graph */}
          <div className="p-5 rounded-xl glass-panel flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Weekly Productivity</h3>
              <span className="text-[10px] text-white/40 block mb-6">Task completion history (7 days)</span>
            </div>

            {/* Custom SVG Bar Graph */}
            <div className="w-full h-36 flex items-end justify-between gap-2.5 px-2 relative">
              {weeklyProductivity.map((pt, idx) => {
                const heightPercentage = (pt.count / maxCount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                      {pt.label}
                    </div>

                    {/* Bar background */}
                    <div className="w-full bg-black/40 border border-white/5 rounded-t h-28 flex items-end overflow-hidden">
                      {/* Bar fill */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="w-full bg-gradient-to-t from-blue-600 to-purple-500 group-hover:from-blue-500 group-hover:to-purple-400 rounded-t transition-colors"
                      />
                    </div>

                    <span className="text-[10px] font-medium text-white/40 mt-2 font-mono">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed timeline */}
          <div className="p-5 rounded-xl glass-panel flex-1">
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Workspace Activity Feed</h3>
            
            <div className="relative flex flex-col gap-4 pl-4 border-l border-white/10">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="relative flex items-start gap-3">
                  {/* Timeline dot */}
                  <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-black/40" />
                  
                  <img src={act.avatar} alt={act.userName} className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0" />
                  
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/75 leading-normal">
                      <span className="font-bold text-white">{act.userName}</span> {act.action} <span className="font-medium text-blue-400">{act.target}</span>
                    </p>
                    <span className="text-[9px] text-white/30 font-mono mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
