import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  Clock, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { Task, Project, CalendarEvent } from '../types';

interface CalendarTabProps {
  tasks: Task[];
  projects: Project[];
  events: CalendarEvent[];
  onAddTask: (title: string, projectId: string, date: string) => void;
}

export default function CalendarTab({
  tasks,
  projects,
  events,
  onAddTask
}: CalendarTabProps) {
  // Current active month navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal to add task on date
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventProject, setEventProject] = useState<string>(projects[0]?.id || 'p1');

  // Month details calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First day of month index (0: Sunday, 1: Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Number of days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create grid cells
  const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // 1. Previous Month padding cells
  // We'll pad so that Sunday is index 0. If first day is Tuesday (index 2), we need 2 cells of padding.
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    // previous month date object
    const prevMonthDate = new Date(year, month - 1, prevDayNum);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: prevDayNum, isCurrentMonth: false });
  }

  // 2. Current Month cells
  for (let d = 1; d <= daysInMonth; d++) {
    // Current month date object (handling UTC offset nicely)
    const curDate = new Date(year, month, d);
    // Pad date string manually to avoid timezone shifting
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  // 3. Next Month padding cells to reach standard 42 cell grid
  const remainingCells = 42 - cells.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthDate = new Date(year, month + 1, n);
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    const dateStr = `${nextMonthDate.getFullYear()}-${pad(nextMonthDate.getMonth() + 1)}-${pad(n)}`;
    cells.push({ dateStr, dayNum: n, isCurrentMonth: false });
  }

  // Go to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Go to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Go to today
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Aggregate items for a specific date string
  const getItemsForDate = (dateStr: string) => {
    const dayTasks = tasks.filter(t => t.dueDate === dateStr && t.status !== 'Archived');
    const dayEvents = events.filter(e => e.date === dateStr);
    
    return [
      ...dayTasks.map(t => ({ id: t.id, title: t.title, type: 'task', priority: t.priority, color: 'blue', status: t.status })),
      ...dayEvents.map(e => ({ id: e.id, title: e.title, type: e.type, priority: 'Medium', color: e.color || 'purple', status: 'Todo' }))
    ];
  };

  // Selected day items
  const selectedDayItems = getItemsForDate(selectedDateStr);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    onAddTask(eventTitle.trim(), eventProject, selectedDateStr);
    setEventTitle('');
    setIsAddEventOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'bg-rose-500';
    if (priority === 'Medium') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div id="calendar-tab" className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      
      {/* LEFT COLUMN: Main 35-42 Grid Month Calendar - Spans 3 columns */}
      <div className="lg:col-span-3 flex flex-col glass-panel rounded-xl p-5 shadow-2xl">
        {/* Calendar Nav Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide">{monthNames[month]} {year}</h2>
              <span className="text-[10px] text-white/40 block font-mono">Precision monthly dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleToday}
              className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-white/60 hover:text-white hover:border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              Today
            </button>
            <div className="flex items-center bg-black/40 rounded-lg border border-white/5 p-0.5">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Month grid cells */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {cells.map((cell, idx) => {
            const dayItems = getItemsForDate(cell.dateStr);
            const isSelected = cell.dateStr === selectedDateStr;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            return (
              <div 
                key={idx}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-16 border rounded-lg p-1.5 flex flex-col justify-between transition-all cursor-pointer relative ${
                  isSelected ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/5' :
                  cell.isCurrentMonth ? 'bg-black/40 border-white/5 hover:border-white/10' :
                  'bg-black/10 border-transparent text-white/20'
                }`}
              >
                {/* Day indicator */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold font-mono px-1 rounded ${
                    isToday ? 'bg-blue-500 text-white font-extrabold shadow-md' : 
                    cell.isCurrentMonth ? 'text-white/80' : 'text-white/20'
                  }`}>
                    {cell.dayNum}
                  </span>
                  
                  {/* Plus icon on hover */}
                  <span className="opacity-0 hover:opacity-100 text-blue-400 text-[10px] pr-0.5" title="Add on this day">+</span>
                </div>

                {/* Day Items Badges list */}
                <div className="flex flex-col gap-0.5 overflow-hidden max-h-10 mt-1">
                  {dayItems.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className={`h-2.5 rounded-sm flex items-center px-1 text-[8px] font-bold truncate ${
                        item.type === 'task' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/10' :
                        item.type === 'meeting' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/10' :
                        'bg-rose-500/20 text-rose-200 border border-rose-500/10'
                      }`}
                      title={`${item.type.toUpperCase()}: ${item.title}`}
                    >
                      <span className={`w-1 h-1 rounded-full mr-1 shrink-0 ${getPriorityColor(item.priority)}`} />
                      <span className={item.status === 'Done' ? 'line-through text-white/40' : ''}>{item.title}</span>
                    </div>
                  ))}
                  {dayItems.length > 3 && (
                    <span className="text-[7px] text-white/30 font-bold block text-right font-mono">+{dayItems.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Day Agenda & Quick Add */}
      <div className="flex flex-col gap-5">
        
        {/* Day agenda Card */}
        <div className="glass-panel rounded-xl p-5 flex-1 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div>
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">Day Agenda</h3>
                <span className="text-[10px] text-white/40 font-mono block mt-0.5">{selectedDateStr}</span>
              </div>
              
              <button 
                onClick={() => setIsAddEventOpen(true)}
                className="w-7 h-7 rounded bg-black/40 hover:bg-white/10 border border-white/5 text-blue-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Schedule Task on this day"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Selected day items list */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
              {selectedDayItems.length > 0 ? (
                selectedDayItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-2.5 rounded-lg glass-card-interactive flex items-start gap-2.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${getPriorityColor(item.priority)}`} />
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block leading-normal ${item.status === 'Done' ? 'line-through text-white/30' : 'text-white/90'}`}>
                        {item.title}
                      </span>
                      <span className="text-[9px] text-white/40 uppercase tracking-wide font-mono mt-0.5 block">
                        {item.type} • {item.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-white/30 font-medium flex flex-col items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-white/20" />
                  <span>No activities scheduled.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <span className="text-[10px] text-white/30 leading-relaxed block font-mono">
              Click any calendar square to view, filter, or schedule items.
            </span>
          </div>
        </div>

      </div>

      {/* MODAL TO QUICK ADD EVENT ON DATE */}
      <AnimatePresence>
        {isAddEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080810]/70 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-sm glass-panel rounded-2xl shadow-2xl p-5 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-xs font-bold text-white tracking-wider uppercase font-sans">Schedule Task on {selectedDateStr}</h3>
                <button 
                  onClick={() => setIsAddEventOpen(false)}
                  className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g., Code Review meeting notes" 
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Associated Project</label>
                  <select 
                    value={eventProject}
                    onChange={(e) => setEventProject(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0f0f18]">{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsAddEventOpen(false)}
                    className="px-3 py-1.5 text-xs text-white/40 hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 rounded bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/15 cursor-pointer"
                  >
                    Schedule Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
