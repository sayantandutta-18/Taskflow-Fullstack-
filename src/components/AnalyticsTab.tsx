import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Zap, 
  HelpCircle, 
  ArrowUpRight, 
  Info,
  Calendar
} from 'lucide-react';
import { Task, TeamMember, Project } from '../types';

interface AnalyticsTabProps {
  tasks: Task[];
  projects: Project[];
  members: TeamMember[];
}

export default function AnalyticsTab({
  tasks,
  projects,
  members
}: AnalyticsTabProps) {
  const [throughputRange, setThroughputRange] = useState<'week' | 'month'>('month');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Compute stats from live tasks list
  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const progressCount = tasks.filter(t => t.status === 'In Progress').length;
  const todoCount = tasks.filter(t => t.status === 'Todo').length;

  const rate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Priority Breakdown computations
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const medCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  const highPct = totalCount > 0 ? Math.round((highCount / totalCount) * 100) : 0;
  const medPct = totalCount > 0 ? Math.round((medCount / totalCount) * 100) : 0;
  const lowPct = totalCount > 0 ? Math.round((lowCount / totalCount) * 100) : 0;

  // Team performance computations (tasks completed per member)
  const teamPerformance = members.map(m => {
    const totalAssigned = tasks.filter(t => t.assigneeId === m.id).length;
    const completedAssigned = tasks.filter(t => t.assigneeId === m.id && t.status === 'Done').length;
    const ratio = totalAssigned > 0 ? Math.round((completedAssigned / totalAssigned) * 100) : 0;
    return {
      id: m.id,
      name: m.name,
      role: m.role,
      avatar: m.avatar,
      total: totalAssigned,
      completed: completedAssigned,
      ratio
    };
  });

  // Mock Throughput coordinates for Month (30 days) and Week (7 days)
  const monthlyThroughputPoints = [
    { day: 1, val: 12 }, { day: 3, val: 18 }, { day: 5, val: 15 }, { day: 8, val: 24 },
    { day: 11, val: 21 }, { day: 14, val: 32 }, { day: 17, val: 28 }, { day: 20, val: 48 }, // Peak point
    { day: 23, val: 38 }, { day: 26, val: 42 }, { day: 28, val: 35 }, { day: 30, val: 40 }
  ];

  const weeklyThroughputPoints = [
    { day: 1, val: 24 }, { day: 2, val: 28 }, { day: 3, val: 35 }, 
    { day: 4, val: 48 }, // Peak
    { day: 5, val: 40 }, { day: 6, val: 32 }, { day: 7, val: 42 }
  ];

  const chartData = throughputRange === 'month' ? monthlyThroughputPoints : weeklyThroughputPoints;

  // SVG Chart sizing helpers
  const svgWidth = 600;
  const svgHeight = 150;
  const paddingX = 40;
  const paddingY = 20;

  const maxX = chartData.length - 1;
  const maxY = 60; // Max throughput tasks for scaling

  // Calculate points coordinate string for SVG path polyline
  const pointsString = chartData.map((pt, index) => {
    const x = paddingX + (index / maxX) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (pt.val / maxY) * (svgHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div id="analytics-tab" className="flex flex-col gap-6 max-w-6xl mx-auto">
      
      {/* 1. Header and metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Completion rate metrics card */}
        <div className="p-5 rounded-xl glass-card-interactive shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Completion Success</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">{rate}%</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +5.4%
            </span>
          </div>
          <span className="text-[10px] text-white/30 block mt-1.5 font-mono">Completed: {doneCount} of {totalCount} total</span>
        </div>

        {/* Avg cycle speed metrics card */}
        <div className="p-5 rounded-xl glass-card-interactive shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Average Cycle Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">3.2</span>
            <span className="text-xs text-white/60 font-medium">days</span>
          </div>
          <span className="text-[10px] text-white/30 block mt-1.5 font-mono">From queue creation to launch</span>
        </div>

        {/* Focus timer metrics card */}
        <div className="p-5 rounded-xl glass-card-interactive shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Productive Focus Timer</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white">124.5</span>
            <span className="text-xs text-white/60 font-medium">hours</span>
          </div>
          <span className="text-[10px] text-white/30 block mt-1.5 font-mono">Average 4.2h per member / day</span>
        </div>
      </div>

      {/* 2. Dynamic Throughput Chart block */}
      <div className="p-5 rounded-xl glass-panel shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Workspace Throughput (Resolved)</h3>
            <span className="text-[10px] text-white/40 block mt-0.5 font-mono">Aggregated finished actions over cycles</span>
          </div>

          {/* Month / Week range selector toggle */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 font-mono">
            <button 
              onClick={() => setThroughputRange('week')}
              className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${throughputRange === 'week' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'text-white/40 hover:text-white'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setThroughputRange('month')}
              className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${throughputRange === 'month' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'text-white/40 hover:text-white'}`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* CUSTOM INTERACTIVE SVG PATH LINE CHART */}
        <div className="w-full relative select-none">
          {/* Tooltip Hover Overlay */}
          {hoveredPoint !== null && (
            <div 
              className="absolute bg-gradient-to-r from-blue-600 to-purple-600 border border-white/10 text-white font-mono text-[10px] font-bold px-2 py-1 rounded shadow-xl pointer-events-none transition-all duration-150 z-10"
              style={{
                left: `${paddingX + (hoveredPoint / maxX) * (svgWidth - paddingX * 2) - 45}px`,
                top: `${svgHeight - paddingY - (chartData[hoveredPoint].val / maxY) * (svgHeight - paddingY * 2) - 38}px`
              }}
            >
              {chartData[hoveredPoint].val === 48 ? 'Peak: 48 Tasks' : `${chartData[hoveredPoint].val} Tasks`}
            </div>
          )}

          {/* SVG canvas */}
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full overflow-visible"
          >
            {/* Horizontal Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
            <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
            <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="rgba(255,255,255,0.1)" />

            {/* Gradient fill under the curve */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Polygon fill string */}
            <path 
              d={`M${paddingX},${svgHeight - paddingY} L${pointsString} L${paddingX + (chartData.length - 1) / maxX * (svgWidth - paddingX * 2)},${svgHeight - paddingY} Z`}
              fill="url(#chartGrad)"
            />

            {/* Spline Polyline curve path */}
            <polyline 
              fill="none" 
              stroke="#60a5fa" 
              strokeWidth="2.5" 
              points={pointsString} 
            />

            {/* Render hover interactive circles and grid dots */}
            {chartData.map((pt, idx) => {
              const cx = paddingX + (idx / maxX) * (svgWidth - paddingX * 2);
              const cy = svgHeight - paddingY - (pt.val / maxY) * (svgHeight - paddingY * 2);
              const isHovered = idx === hoveredPoint;
              const isPeak = pt.val === 48;

              return (
                <g key={idx}>
                  {/* Point circles */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isHovered ? 5.5 : isPeak ? 4.5 : 3} 
                    className={`cursor-pointer transition-all ${
                      isHovered ? 'fill-white stroke-blue-500 stroke-2' :
                      isPeak ? 'fill-blue-400 stroke-[#0d0d15] stroke-2' :
                      'fill-blue-500 hover:fill-blue-400'
                    }`}
                    onMouseOver={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Highlight pulse for Peak */}
                  {isPeak && !isHovered && (
                    <circle cx={cx} cy={cy} r="8" className="fill-none stroke-blue-500/30 animate-pulse stroke-1" />
                  )}
                </g>
              );
            })}

            {/* Chart X axis text */}
            {chartData.map((pt, idx) => {
              if (idx % (throughputRange === 'month' ? 3 : 1) !== 0) return null;
              const cx = paddingX + (idx / maxX) * (svgWidth - paddingX * 2);
              return (
                <text 
                  key={idx}
                  x={cx} 
                  y={svgHeight - 4} 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.4)" 
                  fontSize="8" 
                  className="font-mono font-medium"
                >
                  {throughputRange === 'month' ? `Day ${pt.day}` : `Day ${pt.day}`}
                </text>
              );
            })}

            {/* Chart Y axis text */}
            <text x="5" y={paddingY + 4} fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">{maxY}t</text>
            <text x="5" y={svgHeight / 2 + 4} fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">{maxY / 2}t</text>
            <text x="5" y={svgHeight - paddingY + 4} fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">0</text>
          </svg>
        </div>

        {/* Legend notes */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-[9px] text-white/40 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Completed Items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20" />
            <span>Interactive Node Hover Tooltips Enabled</span>
          </div>
        </div>
      </div>

      {/* 3. Priority ratio and team progress grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Ratio Breakdown horizontal bar */}
        <div className="p-5 rounded-xl glass-panel flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1">Priority Ratio Breakdown</h3>
            <span className="text-[10px] text-white/40 block mb-6 font-mono">Weighted allocation ratios of tasks</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Visual ratio color split bar */}
            <div className="w-full h-4 rounded-lg overflow-hidden flex bg-black/40 border border-white/5 shadow-inner">
              <div className="h-full bg-rose-500" style={{ width: `${highPct}%` }} title={`High: ${highPct}%`} />
              <div className="h-full bg-amber-500" style={{ width: `${medPct}%` }} title={`Medium: ${medPct}%`} />
              <div className="h-full bg-emerald-500" style={{ width: `${lowPct}%` }} title={`Low: ${lowPct}%`} />
            </div>

            {/* List labels */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span className="text-white/80">High Priority</span>
                </div>
                <span className="text-white/95 font-mono font-bold">{highCount} tasks ({highPct}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                  <span className="text-white/80">Medium Priority</span>
                </div>
                <span className="text-white/95 font-mono font-bold">{medCount} tasks ({medPct}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span className="text-white/80">Low Priority</span>
                </div>
                <span className="text-white/95 font-mono font-bold">{lowCount} tasks ({lowPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Comparative performance - spans 2 columns */}
        <div className="lg:col-span-2 p-5 rounded-xl glass-panel shadow-xl">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1">Squad Velocity & Performance</h3>
          <span className="text-[10px] text-white/40 block mb-6 font-mono">Completed task ratios per assigned workspace collaborator</span>

          <div className="flex flex-col gap-4">
            {teamPerformance.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg glass-card-interactive">
                {/* Member Identity */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  <div>
                    <span className="text-xs font-bold text-white/90 block">{member.name}</span>
                    <span className="text-[10px] text-white/40 block">{member.role}</span>
                  </div>
                </div>

                {/* Performance progress line */}
                <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 bg-black/40 border border-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${member.ratio}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                    />
                  </div>
                  <span className="text-xs font-bold text-white/90 font-mono w-10 text-right">{member.ratio}%</span>
                </div>

                {/* Score details */}
                <div className="text-[11px] text-white/45 font-mono shrink-0 text-right">
                  <span className="text-white/80 font-bold">{member.completed}</span> / {member.total} solved
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
