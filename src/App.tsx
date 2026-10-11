import { useState, useEffect } from "react";
import {
  Layers,
  CheckCircle,
  Calendar as CalendarIcon,
  BarChart2,
  Settings as SettingsIcon,
  Search,
  Bell,
  Mail,
  LogOut,
  EyeOff,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import type {
  Workspace,
  Task,
  Activity,
  CalendarEvent,
  AppTabType,
  ViewType,
  Priority,
} from "./types";

import {
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_EVENTS,
  getDateOffset,
} from "./mockData";

import LandingPage from "./components/LandingPage";
import SetupWizard from "./components/SetupWizard";
import CommandMenu from "./components/CommandMenu";
import DashboardTab from "./components/DashboardTab";
import TasksTab from "./components/TasksTab";
import CalendarTab from "./components/CalendarTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsTab from "./components/SettingsTab";

export default function App() {
  const [view, setView] = useState<ViewType>("landing");
  const [activeTab, setActiveTab] =
    useState<AppTabType>("dashboard");

  const [isCommandMenuOpen, setIsCommandMenuOpen] =
    useState(false);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const [workspace, setWorkspace] = useState<Workspace>({
    name: "Acme Corp HQ",
    url: "acme-corp-hq",
    logo: null,
    projects: INITIAL_PROJECTS,
    members: INITIAL_MEMBERS,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] =
    useState<Activity[]>(INITIAL_ACTIVITIES);
  const [events, setEvents] =
    useState<CalendarEvent[]>(INITIAL_EVENTS);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);

  const notifications = [
    {
      id: 1,
      title: "Sarah Jenkins completed a milestone",
      detail: "Update Billing Infrastructure and Pricing",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Marcus Chen assigned you a task",
      detail: "Set up Google Analytics and GTM",
      time: "5 hours ago",
    },
  ];

  useEffect(() => {
    const cachedTasks = localStorage.getItem("tf_tasks");
    const cachedWorkspace = localStorage.getItem("tf_workspace");
    const cachedView = localStorage.getItem("tf_view");
    const cachedTab = localStorage.getItem("tf_tab");

    if (cachedTasks) {
      try {
        setTasks(JSON.parse(cachedTasks) as Task[]);
      } catch {
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }

    if (cachedWorkspace) {
      try {
        setWorkspace(JSON.parse(cachedWorkspace) as Workspace);
      } catch {
        setWorkspace({
          name: "Acme Corp HQ",
          url: "acme-corp-hq",
          logo: null,
          projects: INITIAL_PROJECTS,
          members: INITIAL_MEMBERS,
        });
      }
    }

    if (
      cachedView === "landing" ||
      cachedView === "setup" ||
      cachedView === "app"
    ) {
      setView(cachedView);
    }

    if (
      cachedTab === "dashboard" ||
      cachedTab === "tasks" ||
      cachedTab === "calendar" ||
      cachedTab === "analytics" ||
      cachedTab === "settings"
    ) {
      setActiveTab(cachedTab);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("tf_tasks", JSON.stringify(newTasks));
  };

  const saveWorkspaceState = (newWorkspace: Workspace) => {
    setWorkspace(newWorkspace);
    localStorage.setItem(
      "tf_workspace",
      JSON.stringify(newWorkspace)
    );
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setIsCommandMenuOpen((previous) => !previous);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () =>
      window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleAddTask = (taskInput: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskInput,
      id: `task_${Date.now()}`,
    };

    saveTasks([newTask, ...tasks]);

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      userId: "m1",
      userName: "Alex Carter",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80",
      action: "created task",
      target: taskInput.title,
      time: "Just now",
    };

    setActivities((previous) => [
      newActivity,
      ...previous,
    ]);
  };

  const handleQuickAddTask = (
    title: string,
    projectId: string,
    priority: Priority
  ) => {
    handleAddTask({
      title,
      projectId,
      priority,
      status: "Todo",
      dueDate: getDateOffset(0),
      assigneeId: "m1",
      tags: ["Quick-dispatch"],
    });
  };

  const handleCalendarAddTask = (
    title: string,
    projectId: string,
    date: string
  ) => {
    handleAddTask({
      title,
      projectId,
      priority: "Medium",
      status: "Todo",
      dueDate: date,
      assigneeId: "m1",
      tags: ["Scheduled"],
    });
  };

  const handleEditTask = (
    id: string,
    updatedFields: Partial<Task>
  ) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? { ...task, ...updatedFields }
        : task
    );

    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const targetTask = tasks.find(
      (task) => task.id === id
    );

    saveTasks(tasks.filter((task) => task.id !== id));

    if (targetTask) {
      const newActivity: Activity = {
        id: `act_${Date.now()}`,
        userId: "m1",
        userName: "Alex Carter",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80",
        action: "deleted task",
        target: targetTask.title,
        time: "Just now",
      };

      setActivities((previous) => [
        newActivity,
        ...previous,
      ]);
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (!task) return;

    const nextStatus =
      task.status === "Done" ? "Todo" : "Done";

    handleEditTask(taskId, {
      status: nextStatus,
    });

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      userId: "m1",
      userName: "Alex Carter",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80",
      action:
        nextStatus === "Done"
          ? "completed task"
          : "reopened task",
      target: task.title,
      time: "Just now",
    };

    setActivities((previous) => [
      newActivity,
      ...previous,
    ]);
  };

  const handleSetupComplete = (
    newWorkspace: Workspace
  ) => {
    saveWorkspaceState(newWorkspace);

    if (newWorkspace.projects[0]) {
      const projectId = newWorkspace.projects[0].id;

      const initializedTasks = INITIAL_TASKS.map(
        (task) => ({
          ...task,
          projectId,
        })
      );

      saveTasks(initializedTasks);
    }

    setView("app");
    localStorage.setItem("tf_view", "app");

    setActiveTab("dashboard");
    localStorage.setItem("tf_tab", "dashboard");
  };

  const handleUpdateWorkspace = (
    fields: Partial<Workspace>
  ) => {
    saveWorkspaceState({
      ...workspace,
      ...fields,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("tf_tasks");
    localStorage.removeItem("tf_workspace");
    localStorage.removeItem("tf_view");
    localStorage.removeItem("tf_tab");

    setTasks(INITIAL_TASKS);

    setWorkspace({
      name: "Acme Corp HQ",
      url: "acme-corp-hq",
      logo: null,
      projects: INITIAL_PROJECTS,
      members: INITIAL_MEMBERS,
    });

    setView("landing");
    setActiveTab("dashboard");
    setIsFocusMode(false);
    setIsMobileSidebarOpen(false);
    setIsCommandMenuOpen(false);
  };

  return (
    <div
      id="app-root"
      className="relative min-h-screen overflow-hidden bg-[#07070d] font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-white"
    >
      <div className="pointer-events-none absolute left-[-100px] top-[-100px] z-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-50px] z-0 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[150px]" />

      <div className="pointer-events-none absolute right-[100px] top-[200px] z-0 h-[300px] w-[300px] rounded-full bg-emerald-500/8 blur-[100px]" />

      {view === "landing" && (
        <LandingPage
          onStartSetup={() => {
            setView("setup");
            localStorage.setItem("tf_view", "setup");
          }}
          onSkipToApp={() => {
            saveTasks(INITIAL_TASKS);
            setView("app");
            localStorage.setItem("tf_view", "app");
            setActiveTab("dashboard");
            localStorage.setItem("tf_tab", "dashboard");
          }}
        />
      )}

      {view === "setup" && (
        <SetupWizard
          onComplete={handleSetupComplete}
          onBackToLanding={() => {
            setView("landing");
            localStorage.setItem("tf_view", "landing");
          }}
        />
      )}

      {view === "app" && (
        <div className="flex h-screen overflow-hidden">
          <AnimatePresence>
            {!isFocusMode && (
              <motion.aside
                id="app-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.2,
                }}
                className="glass-panel hidden h-full shrink-0 flex-col !border-r !border-white/10 lg:flex"
              >
                <div className="flex items-center justify-between border-b border-white/5 p-5">
                  <div className="flex items-center gap-3">
                    {workspace.logo ? (
                      <img
                        src={workspace.logo}
                        alt="Workspace logo"
                        className="h-9 w-9 rounded-xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20">
                        <Layers className="h-5 w-5 text-white" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-extrabold text-white">
                        {workspace.name}
                      </span>
                      <span className="block font-mono text-[10px] font-semibold text-blue-400">
                        Pro Active Suite
                      </span>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                  <span className="mb-2 block px-3 font-mono text-[9px] font-bold uppercase tracking-widest text-white/40">
                    Workspace Views
                  </span>

                  {[
                    { key: "dashboard", label: "Dashboard Hub", icon: Layers },
                    { key: "tasks", label: "My Roadmap Tasks", icon: CheckCircle },
                    { key: "calendar", label: "Calendar Planner", icon: CalendarIcon },
                    { key: "analytics", label: "System Analytics", icon: BarChart2 },
                    { key: "settings", label: "System Settings", icon: SettingsIcon },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.key;

                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setActiveTab(item.key as AppTabType);
                          localStorage.setItem("tf_tab", item.key);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                          isActive
                            ? "border-white/10 bg-white/10 text-white shadow-lg shadow-indigo-500/5"
                            : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <IconComp
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? "text-blue-400"
                              : "text-white/40"
                          }`}
                        />
                        <span>{item.label}</span>

                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                        )}
                      </button>
                    );
                  })}

                  <div className="mt-6 border-t border-white/5 pt-6">
                    <button
                      onClick={() => setIsFocusMode(true)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-white/40 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <EyeOff className="h-4 w-4 shrink-0 text-white/30" />
                      <span>Enter Focus State</span>
                    </button>
                  </div>
                </nav>

                <div className="flex items-center justify-between gap-2 border-t border-white/5 bg-black/20 p-4 text-xs">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80"
                      alt="Alex profile"
                      className="h-8 w-8 shrink-0 rounded-full border border-white/10 object-cover"
                    />

                    <div className="min-w-0">
                      <span className="block truncate font-bold text-white">
                        Alex Carter
                      </span>
                      <span className="block truncate text-[10px] text-white/50">
                        Product Lead
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="shrink-0 rounded p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-rose-400"
                    title="Logout / Reset Cache"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="relative flex h-full flex-1 flex-col overflow-hidden">
            <header
              id="app-topbar"
              className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.03] px-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                {isFocusMode && (
                  <button
                    onClick={() => setIsFocusMode(false)}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5 animate-pulse" />
                    Exit Focus Mode
                  </button>
                )}

                <button
                  onClick={() => setIsCommandMenuOpen(true)}
                  className="hidden w-64 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-left text-xs text-white/40 transition-all hover:border-white/15 hover:bg-white/10 sm:flex md:w-80"
                >
                  <Search className="h-4 w-4 text-white/40" />
                  <span className="flex-1 text-[11px] font-medium text-white/40">
                    Search commands... (Cmd+K)
                  </span>
                  <span className="select-none rounded border border-white/5 bg-black/30 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-white/40">
                    ⌘K
                  </span>
                </button>
              </div>

              <div className="relative flex items-center gap-4">
                <button
                  aria-label="Open inbox"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifOpen((previous) => !previous);
                      setUnreadNotifCount(0);
                    }}
                    aria-label="Toggle notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Bell className="h-4 w-4" />

                    {unreadNotifCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white shadow">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="glass-panel absolute right-0 top-11 z-40 flex w-72 flex-col gap-3 rounded-xl p-4 shadow-2xl"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
                            Inbox Notifications
                          </span>

                          <button
                            onClick={() => setIsNotifOpen(false)}
                            aria-label="Close notifications"
                            className="text-white/40 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="text-xs"
                            >
                              <span className="block font-bold text-white/90">
                                {notification.title}
                              </span>
                              <span className="mt-0.5 block text-[10px] leading-normal text-white/50">
                                {notification.detail}
                              </span>
                              <span className="mt-1 block font-mono text-[8px] text-white/30">
                                {notification.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  aria-label="Open mobile menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80"
                  alt="Alex avatar"
                  className="h-8 w-8 shrink-0 rounded-full border border-white/10 object-cover"
                />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-transparent p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {activeTab === "dashboard" && (
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
                        localStorage.setItem("tf_tab", tab);
                      }}
                    />
                  )}

                  {activeTab === "tasks" && (
                    <TasksTab
                      tasks={tasks}
                      projects={workspace.projects}
                      members={workspace.members}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  )}

                  {activeTab === "calendar" && (
                    <CalendarTab
                      tasks={tasks}
                      projects={workspace.projects}
                      events={events}
                      onAddTask={handleCalendarAddTask}
                    />
                  )}

                  {activeTab === "analytics" && (
                    <AnalyticsTab
                      tasks={tasks}
                      projects={workspace.projects}
                      members={workspace.members}
                    />
                  )}

                  {activeTab === "settings" && (
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

          <AnimatePresence>
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="glass-panel relative flex h-full w-72 flex-col justify-between !border-r !border-white/10 p-5"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-400" />
                        <span className="text-sm font-extrabold text-white">
                          {workspace.name}
                        </span>
                      </div>

                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        aria-label="Close mobile menu"
                        className="rounded p-1 text-white/40 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                      {[
                        { key: "dashboard", label: "Dashboard Hub", icon: Layers },
                        { key: "tasks", label: "My Roadmap Tasks", icon: CheckCircle },
                        { key: "calendar", label: "Calendar Planner", icon: CalendarIcon },
                        { key: "analytics", label: "System Analytics", icon: BarChart2 },
                        { key: "settings", label: "System Settings", icon: SettingsIcon },
                      ].map((item) => {
                        const IconComp = item.icon;
                        const isActive = activeTab === item.key;

                        return (
                          <button
                            key={item.key}
                            onClick={() => {
                              setActiveTab(item.key as AppTabType);
                              localStorage.setItem("tf_tab", item.key);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                              isActive
                                ? "border-white/10 bg-white/10 text-white"
                                : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <IconComp className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[11px]