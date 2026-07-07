import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  CreditCard, 
  Layers, 
  Download, 
  Check, 
  Database, 
  Globe, 
  Lock, 
  Users, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { TeamMember, Project, Workspace } from '../types';
import { MOCK_INVOICES } from '../mockData';

interface SettingsTabProps {
  workspace: Workspace;
  onUpdateWorkspace: (updated: Partial<Workspace>) => void;
  tasksCount: number;
}

export default function SettingsTab({
  workspace,
  onUpdateWorkspace,
  tasksCount
}: SettingsTabProps) {
  // Profile settings state
  const [name, setName] = useState<string>('Alex Carter');
  const [role, setRole] = useState<string>('Product Lead');
  const [email, setEmail] = useState<string>('alex@taskflow.io');
  const [timezone, setTimezone] = useState<string>('EST (UTC-5)');
  const [language, setLanguage] = useState<string>('English (US)');

  // Workspace settings state
  const [workspaceName, setWorkspaceName] = useState<string>(workspace.name);
  const [workspaceUrl, setWorkspaceUrl] = useState<string>(workspace.url);

  // Status message
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const triggerSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Profile successfully updated!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const triggerSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({
      name: workspaceName,
      url: workspaceUrl
    });
    setStatusMsg('Workspace configurations saved successfully!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleInvoiceDownload = (id: string) => {
    setStatusMsg(`Invoice PDF (${id}) download simulated successfully.`);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const totalMembersCount = workspace.members.length;
  const projectsCount = workspace.projects.length;

  return (
    <div id="settings-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      
      {/* Dynamic Toast Status Feedbacks */}
      {statusMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 border border-white/10 text-white font-sans text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* LEFT COLUMNS: Forms and Settings - Spans 2 */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* 1. Profile Settings Form */}
        <div className="p-5 sm:p-6 rounded-xl glass-panel shadow-xl">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-2 font-sans">
            <User className="w-4 h-4 text-blue-400" />
            User Profile Settings
          </h3>
          <span className="text-[10px] text-white/40 block mb-6 font-mono">Manage your account identity details and preferences</span>

          <form onSubmit={triggerSaveProfile} className="flex flex-col gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80" 
                alt="Profile avatar" 
                className="w-14 h-14 rounded-full border border-white/10 object-cover shadow-lg"
              />
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-white block">Avatar Synchronized</span>
                <span className="text-[10px] text-white/30 block">Avatar loaded securely from Unsplash</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Job Title</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                >
                  <option className="bg-[#0f0f18]">EST (UTC-5)</option>
                  <option className="bg-[#0f0f18]">PST (UTC-8)</option>
                  <option className="bg-[#0f0f18]">GMT (UTC+0)</option>
                  <option className="bg-[#0f0f18]">CET (UTC+1)</option>
                  <option className="bg-[#0f0f18]">IST (UTC+5.30)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/10"
                >
                  <option className="bg-[#0f0f18]">English (US)</option>
                  <option className="bg-[#0f0f18]">French (FR)</option>
                  <option className="bg-[#0f0f18]">Spanish (ES)</option>
                  <option className="bg-[#0f0f18]">German (DE)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 w-fit rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-bold text-xs px-4 py-2 transition-all self-end shadow-lg shadow-blue-500/15 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* 2. Workspace Customization Form */}
        <div className="p-5 sm:p-6 rounded-xl glass-panel shadow-xl">
          <h3 className="text-xs font-bold text-whie tracking-wider uppercase mb-1 flex items-center gap-2 font-sans">
            <Layers className="w-4 h-4 text-blue-400" />
            Workspace Administration
          </h3>
          <span className="text-[10px] text-white/40 block mb-6 font-mono">Modify details specific to this team and shared hub URL</span>

          <form onSubmit={triggerSaveWorkspace} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Workspace Name</label>
                <input 
                  type="text" 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Hub URL identifier</label>
                <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white/40 font-mono focus-within:border-white/20 transition-all">
                  <span>taskflow.io/</span>
                  <input 
                    type="text" 
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className="bg-transparent border-none text-white outline-none pl-0.5 font-mono w-full"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 w-fit rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-110 text-white font-bold text-xs px-4 py-2 transition-all self-end shadow-lg shadow-blue-500/15 cursor-pointer"
            >
              Save Workspace Settings
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Billing, Limits, Invoices */}
      <div className="flex flex-col gap-6">
        
        {/* Billing details card */}
        <div className="p-5 rounded-xl glass-panel flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-2 font-sans">
              <CreditCard className="w-4 h-4 text-blue-400" />
              Billing & Subscription
            </h3>
            <span className="text-[10px] text-white/40 block mb-6 font-mono">Subscription details and credit card validation</span>

            <div className="p-3.5 rounded-xl glass-card-interactive flex items-center justify-between mb-4">
              <div>
                <span className="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/20 uppercase tracking-wide">Pro subscription</span>
                <span className="text-sm font-extrabold text-white block mt-2 font-mono">$49.00 / month</span>
                <span className="text-[9px] text-white/40 block mt-1">Renews on Aug 01, 2026</span>
              </div>
              <Check className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Credit card card layout */}
            <div className="p-4 rounded-xl bg-gradient-to-tr from-black/50 to-blue-950/20 border border-white/5 flex flex-col justify-between h-28 relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_60%)] animate-pulse" />
              <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-wider">
                <span>TaskFlow Pro Card</span>
                <span className="font-mono text-xs italic text-blue-400">VISA</span>
              </div>
              <div>
                <span className="text-xs font-mono text-white/90 tracking-widest block">•••• •••• •••• 4242</span>
                <span className="text-[9px] text-white/30 font-mono mt-1 block">Exp 12/28 • ALEX CARTER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Limits progress meters */}
        <div className="p-5 rounded-xl glass-panel shadow-xl">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-1 flex items-center gap-2 font-sans">
            <Database className="w-4 h-4 text-blue-400" />
            Workspace Usage Quotas
          </h3>
          <span className="text-[10px] text-white/40 block mb-6 font-mono">Current resource consumption metrics</span>

          <div className="flex flex-col gap-4">
            {/* Team Limit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-white/60">Collaborative Team Members</span>
                <span className="text-white font-mono font-bold">{totalMembersCount} / 15</span>
              </div>
              <div className="w-full bg-black/40 border border-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(totalMembersCount / 15) * 100}%` }} />
              </div>
            </div>

            {/* Project Limit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-white/60">Active Working Projects</span>
                <span className="text-white font-mono font-bold">{projectsCount} / 10</span>
              </div>
              <div className="w-full bg-black/40 border border-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${(projectsCount / 10) * 100}%` }} />
              </div>
            </div>

            {/* Storage Limit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-white/60">Sandbox Storage Used</span>
                <span className="text-white font-mono font-bold">12.4 GB / 50 GB</span>
              </div>
              <div className="w-full bg-black/40 border border-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${(12.4 / 50) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="p-5 rounded-xl glass-panel flex-1 shadow-xl">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-1.5 font-sans">
            <FileText className="w-4 h-4 text-blue-400" />
            Billing History Invoices
          </h3>

          <div className="flex flex-col gap-2.5">
            {MOCK_INVOICES.map((inv) => (
              <div 
                key={inv.id}
                className="p-2.5 rounded-lg glass-card-interactive flex items-center justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{inv.id}</span>
                  <span className="text-[10px] text-white/40 font-mono block mt-0.5">{inv.date} • {inv.amount}</span>
                </div>

                <button 
                  onClick={() => handleInvoiceDownload(inv.id)}
                  className="p-1.5 rounded bg-black/40 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                  title="Simulate PDF Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}






