import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Search, 
  Compass, 
  Plus, 
  EyeOff, 
  Layers, 
  Calendar, 
  BarChart2, 
  Settings, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { Task, AppTabType } from '../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTab: (tab: AppTabType) => void;
  onAddTaskShortcut: (title: string) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export default function CommandMenu({ 
  isOpen, 
  onClose, 
  tasks, 
  onSelectTab, 
  onAddTaskShortcut,
  isFocusMode,
  onToggleFocusMode
}: CommandMenuProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle clicking outside to close
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Reset search
      setSearch('');
      setSelectedIndex(0);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter actions and tasks
  const navigationItems = [
    { type: 'nav', label: 'Go to Dashboard', detail: 'Jump to dashboard home', icon: Layers, action: () => { onSelectTab('dashboard'); onClose(); } },
    { type: 'nav', label: 'Go to Tasks Board', detail: 'Manage and filter active tasks', icon: CheckCircle, action: () => { onSelectTab('tasks'); onClose(); } },
    { type: 'nav', label: 'Go to Calendar', detail: 'View tasks scheduling grids', icon: Calendar, action: () => { onSelectTab('calendar'); onClose(); } },
    { type: 'nav', label: 'Go to Analytics & Metrics', detail: 'View high-fidelity performance graphs', icon: BarChart2, action: () => { onSelectTab('analytics'); onClose(); } },
    { type: 'nav', label: 'Go to Workspace Settings', detail: 'Manage workspace profile & billing', icon: Settings, action: () => { onSelectTab('settings'); onClose(); } },
  ];

  const utilityItems = [
    { type: 'util', label: isFocusMode ? 'Deactivate Focus Mode' : 'Activate Focus Mode', detail: 'Toggle visual sidebar and center task layout', icon: isFocusMode ? Eye : EyeOff, action: () => { onToggleFocusMode(); onClose(); } },
  ];

  // If user typed "add ...", suggest task creation
  const isCreateCommand = search.toLowerCase().startsWith('add ');
  const taskCreateTitle = isCreateCommand ? search.substring(4) : '';

  // Filter tasks based on search
  const filteredTasks = search.trim().length > 0 && !isCreateCommand
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  const combinedItems: any[] = [];
  
  if (isCreateCommand) {
    combinedItems.push({
      type: 'create',
      label: `Create Task: "${taskCreateTitle || '...'}"`,
      detail: 'Press Enter to immediately spawn this task',
      icon: Plus,
      action: () => {
        if (taskCreateTitle.trim()) {
          onAddTaskShortcut(taskCreateTitle.trim());
          onClose();
        }
      }
    });
  }

  // Add nav actions if search matches or is empty
  navigationItems.forEach(item => {
    if (!search || item.label.toLowerCase().includes(search.toLowerCase()) || item.detail.toLowerCase().includes(search.toLowerCase())) {
      combinedItems.push(item);
    }
  });

  // Add utilities
  utilityItems.forEach(item => {
    if (!search || item.label.toLowerCase().includes(search.toLowerCase())) {
      combinedItems.push(item);
    }
  });

  // Add searched tasks
  filteredTasks.forEach(task => {
    combinedItems.push({
      type: 'task',
      label: task.title,
      detail: `Task in Project (${task.priority} Priority)`,
      icon: CheckCircle,
      action: () => {
        onSelectTab('tasks');
        onClose();
      }
    });
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedItems[selectedIndex]) {
        combinedItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.15 }}
        ref={modalRef}
        className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[450px]"
      >
        {/* Search header bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-black/30">
          <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
          <input 
            type="text"
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type 'add [task name]' or search commands..."
            className="w-full bg-transparent border-none text-xs text-white outline-none placeholder:text-white/40 font-mono"
          />
          <span className="text-[9px] bg-black/30 border border-white/5 px-1.5 py-0.5 rounded text-white/40 font-mono uppercase select-none">ESC</span>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 max-h-[300px]">
          {combinedItems.length > 0 ? (
            combinedItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between transition-all ${isSelected ? 'bg-white/10 border border-white/10' : 'bg-transparent border border-transparent'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/5 text-blue-400' : 'bg-black/20 text-white/30'}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>{item.label}</span>
                      <span className="text-[10px] text-white/40 block truncate">{item.detail}</span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono font-bold">ENTER</span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-white/30 flex flex-col items-center justify-center gap-2">
              <Search className="w-5 h-5 text-white/20" />
              <span>No results found for "{search}"</span>
            </div>
          )}
        </div>

        {/* Dynamic keyboard usage legend footer */}
        <div className="px-4 py-2.5 border-t border-white/5 bg-black/30 flex items-center justify-between text-[9px] text-white/40 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-black/30 px-1 py-0.2 rounded border border-white/5">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-black/30 px-1 py-0.2 rounded border border-white/5">Enter</kbd> Select
            </span>
          </div>
          <span>Press <kbd className="bg-black/30 px-1 py-0.2 rounded border border-white/5">add taskname</kbd> to quick-add</span>
        </div>
      </motion.div>
    </div>
  );
}
