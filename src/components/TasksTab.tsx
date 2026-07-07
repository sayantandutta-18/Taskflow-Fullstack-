import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Calendar, 
  Trash2, 
  Edit3, 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  X, 
  Tag, 
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';
import { Task, TeamMember, Project, Priority, TaskStatus } from '../types';

interface TasksTabProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onEditTask: (id: string, updated: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksTab({
  tasks,
  projects,
  members,
  onAddTask,
  onEditTask,
  onDeleteTask
}: TasksTabProps) {
  // Navigation tabs: 'all' | 'in-progress' | 'completed' | 'archived'
  const [filterStatusTab, setFilterStatusTab] = useState<'all' | 'Todo' | 'In Progress' | 'Done' | 'Archived'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

  // Modal / Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('Todo');
  const [formDueDate, setFormDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formAssignee, setFormAssignee] = useState<string>(members[0]?.id || 'm1');
  const [formProject, setFormProject] = useState<string>(projects[0]?.id || 'p1');
  const [formTagsString, setFormTagsString] = useState<string>('');

  // Open modal helper for Edit
  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDesc(task.description || '');
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormDueDate(task.dueDate);
    setFormAssignee(task.assigneeId);
    setFormProject(task.projectId);
    setFormTagsString(task.tags.join(', '));
    setIsEditModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddTask({
      title: formTitle.trim(),
      description: formDesc.trim() || undefined,
      priority: formPriority,
      status: formStatus,
      dueDate: formDueDate,
      assigneeId: formAssignee,
      tags: parsedTags,
      projectId: formProject
    });

    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormTagsString('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !formTitle.trim()) return;

    const parsedTags = formTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onEditTask(editingTaskId, {
      title: formTitle.trim(),
      description: formDesc.trim() || undefined,
      priority: formPriority,
      status: formStatus,
      dueDate: formDueDate,
      assigneeId: formAssignee,
      tags: parsedTags,
      projectId: formProject
    });

    setIsEditModalOpen(false);
    setEditingTaskId(null);
  };

  // Drag simulation / button click status advancement
  const cycleTaskStatus = (task: Task) => {
    const statusMap: Record<TaskStatus, TaskStatus> = {
      'Todo': 'In Progress',
      'In Progress': 'Done',
      'Done': 'Archived',
      'Archived': 'Todo'
    };
    onEditTask(task.id, { status: statusMap[task.status] });
  };

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    // Status tab filter
    if (filterStatusTab !== 'all') {
      if (task.status !== filterStatusTab) return false;
    } else {
      // "all" tab excludes archived by default to stay clean
      if (task.status === 'Archived') return false;
    }

    // Keyword Search
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description?.toLowerCase().includes(query) || false;
      const matchTags = task.tags.some(t => t.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    // Project filter
    if (filterProject !== 'all' && task.projectId !== filterProject) return false;

    return true;
  });

  // Sorting Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return 0;
  });

  // Project utilities
  const getProjectDetails = (projId: string) => {
    return projects.find(p => p.id === projId) || { name: 'General', themeColor: 'blue' };
  };

  const getProjectTagColorClass = (color: string) => {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    };
    return colorClasses[color] || 'bg-slate-800 text-slate-300';
  };

  const getMemberDetails = (memId: string) => {
    return members.find(m => m.id === memId) || { name: 'Alex Carter', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80' };
  };

  return (
    <div id="tasks-tab" className="flex flex-col gap-5">
      
      {/* Search and Filters Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl shadow-lg">
        
        {/* Search Input Box */}
        <div className="flex-1 flex items-center bg-black/40 border border-white/5 focus-within:border-blue-500 rounded-xl px-3 py-2.5 transition-all">
          <Search className="w-4 h-4 text-white/30 mr-2 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or #tags..." 
            className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-white/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters dropdowns and Switch layout */}
        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
          
          {/* Priority dropdown */}
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white/60 outline-none cursor-pointer hover:border-white/10 transition-all font-medium"
          >
            <option value="all" className="bg-[#0f0f18] text-white">Priority: All</option>
            <option value="High" className="bg-[#0f0f18] text-rose-400">Priority: High</option>
            <option value="Medium" className="bg-[#0f0f18] text-amber-400">Priority: Medium</option>
            <option value="Low" className="bg-[#0f0f18] text-emerald-400">Priority: Low</option>
          </select>

          {/* Project dropdown */}
          <select 
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white/60 outline-none cursor-pointer hover:border-white/10 transition-all font-medium"
          >
            <option value="all" className="bg-[#0f0f18] text-white">Project: All</option>
            {projects.map(p => (
              <option key={p.id} value={p.id} className="bg-[#0f0f18] text-white">Proj: {p.name}</option>
            ))}
          </select>

          {/* Sort dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
            className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white/60 outline-none cursor-pointer hover:border-white/10 transition-all font-medium"
          >
            <option value="dueDate" className="bg-[#0f0f18] text-white">Sort: Due Date</option>
            <option value="priority" className="bg-[#0f0f18] text-white">Sort: Priority</option>
          </select>

          {/* List/Board layout Switch buttons */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'list' ? 'bg-blue-500/15 text-blue-300' : 'text-white/40 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'board' ? 'bg-blue-500/15 text-blue-300' : 'text-white/40 hover:text-white'}`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1 shrink-0 shadow-lg shadow-blue-500/15 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Grouping Status tab switcher bar */}
      <div className="flex items-center border-b border-white/5 text-xs font-semibold gap-1 overflow-x-auto whitespace-nowrap">
        {[
          { key: 'all', label: 'All Open Tasks' },
          { key: 'Todo', label: 'Todo Queue' },
          { key: 'In Progress', label: 'In Progress' },
          { key: 'Done', label: 'Completed' },
          { key: 'Archived', label: 'Archived' }
        ].map(tb => (
          <button 
            key={tb.key}
            onClick={() => setFilterStatusTab(tb.key as any)}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${filterStatusTab === tb.key ? 'border-blue-500 text-white font-extrabold' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* MAIN VIEW CONTENT CONTAINER */}
      {viewMode === 'list' ? (
        /* LIST VIEW GRID */
        <div className="flex flex-col gap-2">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => {
              const proj = getProjectDetails(task.projectId);
              const assignee = getMemberDetails(task.assigneeId);
              return (
                <div 
                  key={task.id}
                  className="p-4 rounded-xl glass-card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Task Left Checkbox and info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button 
                      onClick={() => onEditTask(task.id, { status: task.status === 'Done' ? 'Todo' : 'Done' })}
                      className="text-white/30 hover:text-blue-400 transition-colors shrink-0 mt-0.5 cursor-pointer"
                    >
                      {task.status === 'Done' ? (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold block truncate ${task.status === 'Done' ? 'line-through text-white/40' : 'text-white/90'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[9px] font-mono border px-1.5 rounded ${
                          task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.2 rounded border ${getProjectTagColorClass(proj.themeColor)}`}>
                          {proj.name}
                        </span>
                        <span className="text-[10px] bg-black/40 text-white/50 px-2 py-0.2 rounded border border-white/5 capitalize font-medium">
                          {task.status}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-white/60 leading-relaxed mb-2 max-w-2xl">{task.description}</p>
                      )}

                      {/* Tags row */}
                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {task.tags.map(tg => (
                            <span key={tg} className="text-[9px] text-white/40 font-medium bg-black/30 px-2 py-0.5 rounded border border-white/5 flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5 text-white/30" />
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Right Actions / Metadata */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 shrink-0">
                    <div className="flex items-center gap-3 text-xs">
                      {/* Due date */}
                      <span className="text-white/40 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-white/30" />
                        {task.dueDate}
                      </span>

                      {/* Assignee */}
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg pl-1.5 pr-2.5 py-1">
                        <img src={assignee.avatar} alt={assignee.name} className="w-4.5 h-4.5 rounded-full object-cover border border-white/10" />
                        <span className="text-[10px] text-white/60 font-medium">{assignee.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Modification buttons */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center glass-panel border border-dashed border-white/10 rounded-xl text-white/40 text-xs flex flex-col items-center justify-center gap-2">
              <Search className="w-6 h-6 text-white/20" />
              <span>No tasks found matching your filters.</span>
            </div>
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Todo', 'In Progress', 'Done'] as TaskStatus[]).map((colStatus) => {
            const colTasks = sortedTasks.filter(t => t.status === colStatus);
            return (
              <div key={colStatus} className="flex flex-col gap-3 glass-panel rounded-xl p-4 min-h-[400px]">
                {/* Column header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      colStatus === 'Todo' ? 'bg-blue-400 animate-pulse' :
                      colStatus === 'In Progress' ? 'bg-amber-400' :
                      'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{colStatus}</span>
                  </div>
                  <span className="text-[10px] bg-black/30 border border-white/5 text-white/50 px-1.5 py-0.2 rounded font-mono font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Tasks */}
                <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
                  {colTasks.length > 0 ? (
                    colTasks.map((task) => {
                      const proj = getProjectDetails(task.projectId);
                      const assignee = getMemberDetails(task.assigneeId);
                      return (
                        <div 
                          key={task.id}
                          className="glass-card-interactive p-4 rounded-xl flex flex-col gap-3 group relative cursor-pointer"
                        >
                          {/* Title & Priority */}
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`text-[10px] font-mono border px-1.5 py-0.2 rounded ${
                                task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}>
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(task)} className="p-1 hover:text-white text-white/40 cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                                <button onClick={() => onDeleteTask(task.id)} className="p-1 hover:text-rose-400 text-white/40 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-white/90 block truncate leading-normal">{task.title}</span>
                          </div>

                          {/* Description snippet */}
                          {task.description && (
                            <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed">{task.description}</p>
                          )}

                          {/* Metadata row */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                            <span className="text-white/40 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-white/30" />
                              {task.dueDate}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-5 h-5 rounded-full border border-white/10 object-cover" />
                              {/* Quick Move Action button */}
                              <button 
                                onClick={() => cycleTaskStatus(task)}
                                className="w-5 h-5 bg-black/40 hover:bg-blue-500/20 hover:text-blue-300 rounded flex items-center justify-center text-white/40 border border-white/5 cursor-pointer"
                                title="Move status forward"
                              >
                                <ArrowRightLeft className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-6 text-center text-white/20 text-[11px] gap-1.5">
                      <span>No Tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL LIGHTBOXES FOR ADD / EDIT */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080810]/70 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md glass-panel rounded-2xl shadow-2xl p-6 relative flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase font-sans">
                  {isEditModalOpen ? 'Update Roadmap Task' : 'Dispatch New Task'}
                </h3>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={isEditModalOpen ? handleSaveEdit : handleCreateTask} className="flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Secure authentication protocols" 
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Description</label>
                  <textarea 
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide additional details or checklists..." 
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none font-sans resize-none placeholder:text-white/20"
                  />
                </div>

                {/* Select layout grid details */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Select Priority */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Priority</label>
                    <select 
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as Priority)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                    >
                      <option value="High" className="bg-[#0f0f18] text-rose-400">High</option>
                      <option value="Medium" className="bg-[#0f0f18] text-amber-400">Medium</option>
                      <option value="Low" className="bg-[#0f0f18] text-emerald-400">Low</option>
                    </select>
                  </div>

                  {/* Select Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Status</label>
                    <select 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                    >
                      <option value="Todo" className="bg-[#0f0f18]">Todo</option>
                      <option value="In Progress" className="bg-[#0f0f18]">In Progress</option>
                      <option value="Done" className="bg-[#0f0f18]">Done</option>
                      <option value="Archived" className="bg-[#0f0f18]">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Select Project */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Project</label>
                    <select 
                      value={formProject}
                      onChange={(e) => setFormProject(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#0f0f18]">{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Due Date</label>
                    <input 
                      type="date" 
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Select Assignee */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Assign To</label>
                  <select 
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id} className="bg-[#0f0f18]">{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                {/* Tags string */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Tags (comma-separated)</label>
                    <span className="text-[9px] text-white/30 font-mono">Optional</span>
                  </div>
                  <input 
                    type="text" 
                    value={formTagsString}
                    onChange={(e) => setFormTagsString(e.target.value)}
                    placeholder="Security, Backend, Sprint-2" 
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white/40 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/15 cursor-pointer"
                  >
                    {isEditModalOpen ? 'Save Changes' : 'Dispatch Task'}
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
