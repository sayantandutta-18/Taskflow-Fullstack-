export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done' | 'Archived';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon: string; // rocket, board, megaphone, code, wrench, chart, shop, three-dots
  themeColor: string; // blue, green, orange, red, purple, pink
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
  tags: string[];
  projectId: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export interface Workspace {
  name: string;
  url: string;
  logo: string | null;
  projects: Project[];
  members: TeamMember[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'meeting' | 'milestone';
  color?: string;
}

export type ViewType = 'landing' | 'setup' | 'app';
export type AppTabType = 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings';
