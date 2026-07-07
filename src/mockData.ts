import { Workspace, Task, TeamMember, Activity, CalendarEvent, Project } from './types';

export const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alex Carter', role: 'Product Lead', email: 'alex@taskflow.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80' },
  { id: 'm2', name: 'Sarah Jenkins', role: 'Senior Developer', email: 'sarah.j@taskflow.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80' },
  { id: 'm3', name: 'Marcus Chen', role: 'UI/UX Designer', email: 'marcus.c@taskflow.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80' },
  { id: 'm4', name: 'Elena Rostova', role: 'QA Engineer', email: 'elena.r@taskflow.io', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&q=80' }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Q4 Launch', description: 'Coordinate final push for Q4 product release.', icon: 'rocket', themeColor: 'blue' },
  { id: 'p2', name: 'Design System', description: 'Standardize components and Figma variables.', icon: 'board', themeColor: 'purple' },
  { id: 'p3', name: 'Growth Campaign', description: 'Acquisition strategy and landing page upgrades.', icon: 'megaphone', themeColor: 'green' }
];

// Helper to get formatted date string offset from today
export const getDateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Finalize API Authentication Protocol',
    description: 'Implement JWT refresh token mechanism and verify security rules for cross-origin domains.',
    priority: 'High',
    status: 'In Progress',
    dueDate: getDateOffset(0), // Today
    assigneeId: 'm2',
    tags: ['Security', 'Backend'],
    projectId: 'p1'
  },
  {
    id: 't2',
    title: 'Audit Figma Components and Variables',
    description: 'Check component consistency against the new spacing guidelines and export color tokens.',
    priority: 'Medium',
    status: 'Todo',
    dueDate: getDateOffset(2),
    assigneeId: 'm3',
    tags: ['Figma', 'Design-System'],
    projectId: 'p2'
  },
  {
    id: 't3',
    title: 'Set up Google Analytics and GTM',
    description: 'Verify custom conversion events for the signup funnel and deploy container code.',
    priority: 'Low',
    status: 'Todo',
    dueDate: getDateOffset(5),
    assigneeId: 'm1',
    tags: ['Analytics', 'Marketing'],
    projectId: 'p3'
  },
  {
    id: 't4',
    title: 'Create App Store Assets and Metadata',
    description: 'Draft the description copy, update release notes, and assemble high-res screenshots.',
    priority: 'High',
    status: 'Todo',
    dueDate: getDateOffset(1),
    assigneeId: 'm1',
    tags: ['App-Store', 'Release'],
    projectId: 'p1'
  },
  {
    id: 't5',
    title: 'Run Integration Tests on Core Engine',
    description: 'Execute smoke test suite in staging environment and resolve intermittent network failures.',
    priority: 'High',
    status: 'Done',
    dueDate: getDateOffset(-2),
    assigneeId: 'm4',
    tags: ['Testing', 'QA'],
    projectId: 'p1'
  },
  {
    id: 't6',
    title: 'Draft Interactive Onboarding Prototype',
    description: 'Create low-fidelity user flow wireframes to review workspace configuration transitions.',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: getDateOffset(0), // Today
    assigneeId: 'm3',
    tags: ['UX-Research', 'Onboarding'],
    projectId: 'p2'
  },
  {
    id: 't7',
    title: 'Update Billing Infrastructure and Pricing',
    description: 'Connect payment gateways with Stripe webhooks and handle coupon validation logic.',
    priority: 'High',
    status: 'Done',
    dueDate: getDateOffset(-1),
    assigneeId: 'm2',
    tags: ['Billing', 'Stripe'],
    projectId: 'p1'
  },
  {
    id: 't8',
    title: 'Configure CI/CD Pipelines with Docker',
    description: 'Streamline container caching and minimize deployment build logs on deployment pipelines.',
    priority: 'Medium',
    status: 'Todo',
    dueDate: getDateOffset(4),
    assigneeId: 'm2',
    tags: ['DevOps', 'CI-CD'],
    projectId: 'p1'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    userId: 'm2',
    userName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80',
    action: 'completed',
    target: 'Update Billing Infrastructure and Pricing',
    time: '2 hours ago'
  },
  {
    id: 'a2',
    userId: 'm3',
    userName: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
    action: 'moved to In Progress',
    target: 'Draft Interactive Onboarding Prototype',
    time: '3 hours ago'
  },
  {
    id: 'a3',
    userId: 'm4',
    userName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&q=80',
    action: 'commented on',
    target: 'Finalize API Authentication Protocol',
    time: '4 hours ago'
  },
  {
    id: 'a4',
    userId: 'm1',
    userName: 'Alex Carter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
    action: 'assigned task to Marcus Chen',
    target: 'Audit Figma Components and Variables',
    time: 'Yesterday'
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Q4 Release Sync', date: getDateOffset(0), type: 'meeting', color: 'blue' },
  { id: 'e2', title: 'Design Review: Token Updates', date: getDateOffset(2), type: 'meeting', color: 'purple' },
  { id: 'e3', title: 'Marketing Sprint kickoff', date: getDateOffset(1), type: 'meeting', color: 'green' },
  { id: 'e4', title: 'Staging Deployment Milestone', date: getDateOffset(4), type: 'milestone', color: 'red' },
  { id: 'e5', title: 'Sprint Retrospective', date: getDateOffset(-2), type: 'meeting', color: 'blue' }
];

export const MOCK_INVOICES = [
  { id: 'INV-2026-004', date: 'Jul 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-003', date: 'Jun 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'May 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-001', date: 'Apr 01, 2026', amount: '$49.00', status: 'Paid' }
];
