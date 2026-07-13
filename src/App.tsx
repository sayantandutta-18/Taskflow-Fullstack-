import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Settings as SettingsIcon, 
  Search, 
  Bell, 
  Mail, 
  Plus, 
  User, 
  LogOut, 
  EyeOff, 
  Menu, 
  X,
  Sparkles,
  Check,
  ChevronDown
} from 'lucide-react';

import { Workspace, Task, TeamMember, Activity, CalendarEvent, AppTabType, ViewType, Priority } from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_ACTIVITIES, 
  INITIAL_EVENTS, 
  getDateOffset 
} from './mockData';

// Component imports
import LandingPage from './components/LandingPage';
import SetupWizard from './components/SetupWizard';
import CommandMenu from './components/CommandMenu';
import DashboardTab from './components/DashboardTab';
import TasksTab from './components/TasksTab';
import CalendarTab from './components/CalendarTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  // 1. Core Navigation Routing State
  const [view, setView] = useState<ViewType>('landing');
  const [activeTab, setActiveTab] = useState<AppTabType>('dashboard');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // 2. Active Workspace State
  const [workspace, setWorkspace] = useState<Workspace>({
    name: 'Acme Corp HQ',
    url: 'acme-corp-hq',
    logo: null,
    projects: INITIAL_PROJECTS,
    members: INITIAL_MEMBERS
  });

  // 3. Dynamic Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Load and save state using localStorage
  useEffect(() => {
    const cachedTasks = localStorage.getItem('tf_tasks');
    const cachedWorkspace = localStorage.getItem('tf_workspace');
    const cachedView = localStorage.getItem('tf_view');
    const cachedTab = localStorage.getItem('tf_tab');

    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
    } else {
      setTasks(INITIAL_TASKS);
    }

    if (cachedWorkspace) {
      setWorkspace(JSON.parse(cachedWorkspace));
    }

    if (cachedView) {
      setView(cachedView as ViewType);
    }

    if (cachedTab) {
      setActiveTab(cachedTab as AppTabType);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('tf_tasks', JSON.stringify(newTasks));
  };

  const saveWorkspaceState = (newWorkspace: Workspace) => {
    setWorkspace(newWorkspace);
    localStorage.setItem('tf_workspace', JSON.stringify(newWorkspace));
  };

  // Keyboard shortcut listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // 4. Tasks manipulation handlers
  const handleAddTask = (taskInput: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task_${Date.now()}`
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);

    // Append activity
    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      userId: 'm1',
      userName: 'Alex Carter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
      action: 'created task',
      target: taskInput.title,
      time: 'Just now'
    };
    setActivities([newActivity, ...activities]);
  };

  // Simple quick add dashboard helper
  const handleQuickAddTask = (title: string, projectId: string, priority: Priority) => {
    handleAddTask({
      title,
      projectId,
      priority,
      status: 'Todo',
      dueDate: getDateOffset(0),
      assigneeId: 'm1',
      tags: ['Quick-dispatch']
    });
  };

  // Quick add on specific date calendar helper
  const handleCalendarAddTask = (title: string, projectId: string, date: string) => {
    handleAddTask({
      title,
      projectId,
      priority: 'Medium',
      status: 'Todo',
      dueDate: date,
      assigneeId: 'm1',
      tags: ['Scheduled']
    });
  };

  const handleEditTask = (id: string, updatedFields: Partial<Task>) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        const fullTask = { ...task, ...updatedFields };
        return fullTask;
      }
      return task;
    });
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const targetTask = tasks.find(t => t.id === id);
    const updated = tasks.filter(task => task.id !== id);
    saveTasks(updated);

    if (targetTask) {
      const newActivity: Activity = {
        id: `act_${Date.now()}`,
        userId: 'm1',
        userName: 'Alex Carter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
        action: 'deleted task',
        target: targetTask.title,
        time: 'Just now'
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === 'Done' ? 'Todo' : 'Done';
    handleEditTask(taskId, { status: nextStatus });

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      userId: 'm1',
      userName: 'Alex Carter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
      action: nextStatus === 'Done' ? 'completed task' : 'reopened task',
      target: task.title,
      time: 'Just now'
    };
    setActivities([newActivity, ...activities]);
  };

  // 5. Workspace wizards & configurations
  const handleSetupComplete = (newWorkspace: Workspace) => {
    saveWorkspaceState(newWorkspace);
    // Overwrite tasks with default values styled under the new first project if applicable
    if (newWorkspace.projects[0]) {
      const pId = newWorkspace.projects[0].id;
      const initializedTasks = INITIAL_TASKS.map(t => ({
        ...t,
        projectId: pId
      }));
      saveTasks(initializedTasks);
    }
    setView('app');
    localStorage.setItem('tf_view', 'app');
    setActiveTab('dashboard');
    localStorage.setItem('tf_tab', 'dashboard');
  };

  const handleUpdateWorkspace = (fields: Partial<Workspace>) => {
    const updated = { ...workspace, ...fields };
    saveWorkspaceState(updated);
  };

  const handleLogout = () => {
    localStorage.clear();
    setTasks(INITIAL_TASKS);
    setWorkspace({
      name: 'Acme Corp HQ',
      url: 'acme-corp-hq',
      logo: null,
      projects: INITIAL_PROJECTS,
      members: INITIAL_MEMBERS
    });
    setView('landing');
    setActiveTab('dashboard');
    setIsFocusMode(false);
  };

  // Notification dropdown states
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(2);

  const notifications = [
    { id: 1, title: 'Sarah Jenkins completed a milestone', detail: 'Update Billing Infrastructure and Pricing', time: '2 hours ago' },
    { id: 2, title: 'Marcus Chen assigned you a task', detail: 'Set up Google Analytics and GTM', time: '5 hours ago' }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-[#07070d] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Ambient background glow spots for Frosted Glass theme */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] right-[-50px] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[200px] right-[100px] w-[300px] h-[300px] rounded-full bg-emerald-500/8 blur-[100px] pointer-events-none z-0" />
      
      {/* 1. VIEW ROUTER: LANDING SCREEN */}
      {view === 'landing' && (
        <LandingPage 
          onStartSetup={() => {
            setView('setup');
            localStorage.setItem('tf_view', 'setup');
          }} 
          onSkipToApp={() => {
            saveTasks(INITIAL_TASKS);
            setView('app');
            localStorage.setItem('tf_view', 'app');
            setActiveTab('dashboard');
            localStorage.setItem('tf_tab', 'dashboard');
          }} 
        />
      )}

      {/* 2. VIEW ROUTER: SETUP WIZARD */}
      {view === 'setup' && (
        <SetupWizard 
          onComplete={handleSetupComplete} 
          onBackToLanding={() => {
            setView('landing');
            localStorage.setItem('tf_view', 'landing');
          }} 
        />
      )}

      {/* 3. VIEW ROUTER: FULL APPLICATION HUB */}
      {view === 'app' && (
        <div className="flex h-screen overflow-hidden">
          
          {/* SIDEBAR NAVIGATION - Hides if isFocusMode is True */}
          <AnimatePresence>
            {!isFocusMode && (
              <motion.aside 
                id="app-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="hidden lg:flex flex-col glass-panel shrink-0 h-full !border-r !border-white/10"
              >
                {/* Sidebar Header with Workspace Details */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {workspace.logo ? (
                      <img src={workspace.logo} alt="Workspace Logo" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-extrabold text-white block truncate">{workspace.name}</span>
                      <span className="text-[10px] text-blue-400 font-semibold block font-mono">Pro Active Suite</span>
                    </div>
                  </div>
                </div>

                {/* Main Navigation Items */}
                <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2 block font-mono">Workspace Views</span>
                  {[
                    { key: 'dashboard', label: 'Dashboard Hub', icon: Layers },
                    { key: 'tasks', label: 'My Roadmap Tasks', icon: CheckCircle },
                    { key: 'calendar', label: 'Calendar Planner', icon: CalendarIcon },
                    { key: 'analytics', label: 'System Analytics', icon: BarChart2 },
                    { key: 'settings', label: 'System Settings', icon: SettingsIcon }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button 
                        key={item.key}
                        onClick={() => {
                          setActiveTab(item.key as AppTabType);
                          localStorage.setItem('tf_tab', item.key);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${isActive ? 'bg-white/10 border border-white/10 text-white shadow-lg shadow-indigo-500/5' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-white/40'}`} />
                        <span>{item.label}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto" />}
                      </button>
                    );
                  })}

                  {/* Focus Mode Fast Activator */}
                  <div className="pt-6 mt-6 border-t border-white/5">
                    <button 
                      onClick={() => setIsFocusMode(true)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                    >
                      <EyeOff className="w-4 h-4 text-white/30 shrink-0" />
                      <span>Enter Focus State</span>
                    </button>
                  </div>
                </nav>

                {/* Profile Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80" 
                      alt="Alex Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">Alex Carter</span>
                      <span className="text-[10px] text-white/50 block truncate">Product Lead</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                    title="Logout / Reset Cache"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* MAIN APP WORKSPACE STAGE CONTAINER */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* TOP BAR APP CONTROLS */}
            <header id="app-topbar" className="h-20 bg-white/3 backdrop-blur-md border-b border-white/10 shrink-0 flex items-center justify-between px-6">
              
              {/* Left Search input (triggers command palette) */}
              <div className="flex items-center gap-4">
                {/* Focus Exit Button (only visible when in focus mode) */}
                {isFocusMode && (
                  <button 
                    onClick={() => setIsFocusMode(false)}
                    className="flex items-center gap-1.5 text-xs bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider"
                  >
                    <Eye className="w-3.5 h-3.5 animate-pulse" />
                    Exit Focus Mode
                  </button>
                )}

                {/* Search / Command palette launcher bar */}
                <button 
                  onClick={() => setIsCommandMenuOpen(true)}
                  className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 px-3.5 py-2.5 rounded-xl text-left text-xs text-white/40 w-64 md:w-80 cursor-pointer transition-all"
                >
                  <Search className="w-4 h-4 text-white/40" />
                  <span className="flex-1 text-[11px] font-medium text-white/40">Search commands... (Cmd+K)</span>
                  <span className="text-[9px] bg-black/30 border border-white/5 px-1.5 py-0.5 rounded font-mono text-white/40 font-bold select-none uppercase">⌘K</span>
                </button>
              </div>

              {/* Right User widgets, notifications, mail, quick add */}
              <div className="flex items-center gap-4 relative">
                
                {/* Mail inbox button */}
                <button className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </button>

                {/* Notification Bell with unread counter */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setUnreadNotifCount(0);
                    }}
                    className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[8px] font-black text-white flex items-center justify-center shadow">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  <AnimatePresence>
                    {isNotifOpen && (
                      <div className="absolute right-0 top-11 z-40 w-72 glass-panel rounded-xl shadow-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Inbox Notifications</span>
                          <button onClick={() => setIsNotifOpen(false)} className="text-white/40 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          {notifications.map(notif => (
                            <div key={notif.id} className="text-xs">
                              <span className="font-bold text-white/90 block">{notif.title}</span>
                              <span className="text-[10px] text-white/50 block leading-normal mt-0.5">{notif.detail}</span>
                              <span className="text-[8px] text-white/30 font-mono mt-1 block">{notif.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Hamburger Hamburger Sidebar toggle */}
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Menu className="w-4 h-4" />
                </button>

                {/* Profile Avatar dropdown */}
                <div className="flex items-center gap-1">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80" 
                    alt="Alex avatar" 
                    className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                  />
                </div>
              </div>
            </header>

            {/* SCREEN TAB PANELS CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-6 bg-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {activeTab === 'dashboard' && (
                    <DashboardTab 
                      workspaceName={workspace.name}
                      tasks={tasks}
                      projects={workspace.projects}
                      members={workspace.members}
                      activities={activities}
                      onAddTask={handleQuickAddTask}
                      onToggleTaskStatus={handleToggleTaskStatus}
                      onSelectTab={(tab) => {
                        setActiveTab(tab);
                        localStorage.setItem('tf_tab', tab);
                      }}
                    />
                  )}

                  {activeTab === 'tasks' && (
                    <TasksTab 
                      tasks={tasks}
                      projects={workspace.projects}
                      members={workspace.members}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  )}

                  {activeTab === 'calendar' && (
                    <CalendarTab 
                      tasks={tasks}
                      projects={workspace.projects}
                      events={events}
                      onAddTask={handleCalendarAddTask}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <AnalyticsTab 
                      tasks={tasks}
                      projects={workspace.projects}
                      members={workspace.members}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsTab 
                      workspace={workspace}
                      onUpdateWorkspace={handleUpdateWorkspace}
                      tasksCount={tasks.length}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* MOBILE SIDEBAR PANEL DRAWER LIGHTBOX */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                {/* Backdrop overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Sidebar Drawer slide */}
                <motion.aside 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.2 }}
                  className="relative w-72 glass-panel h-full p-5 !border-r !border-white/10 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-400" />
                        <span className="font-extrabold text-white text-sm">{workspace.name}</span>
                      </div>
                      <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 rounded text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    <nav className="flex flex-col gap-2">
                      {[
                        { key: 'dashboard', label: 'Dashboard Hub', icon: Layers },
                        { key: 'tasks', label: 'My Roadmap Tasks', icon: CheckCircle },
                        { key: 'calendar', label: 'Calendar Planner', icon: CalendarIcon },
                        { key: 'analytics', label: 'System Analytics', icon: BarChart2 },
                        { key: 'settings', label: 'System Settings', icon: SettingsIcon }
                      ].map((item) => {
                        const IconComp = item.icon;
                        const isActive = activeTab === item.key;
                        return (
                          <button 
                            key={item.key}
                            onClick={() => {
                              setActiveTab(item.key as AppTabType);
                              localStorage.setItem('tf_tab', item.key);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${isActive ? 'bg-white/10 border border-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                          >
                            <IconComp className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/50">Alex Carter</span>
                    <button onClick={handleLogout} className="text-xs text-white/40 hover:text-rose-400 font-bold flex items-center gap-1">
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* GLOBAL CMD+K COMMAND MENU LIGHTBOX */}
          <CommandMenu 
            isOpen={isCommandMenuOpen}
            onClose={() => setIsCommandMenuOpen(false)}
            tasks={tasks}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              localStorage.setItem('tf_tab', tab);
            }}
            onAddTaskShortcut={(title) => {
              handleQuickAddTask(title, workspace.projects[0]?.id || 'p1', 'Medium');
            }}
            isFocusMode={isFocusMode}
            onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
          />

        </div>
      )}
    </div>
  );
}
