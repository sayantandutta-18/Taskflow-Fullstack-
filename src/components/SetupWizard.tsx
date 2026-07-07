import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Layers, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Globe, 
  Mail, 
  User, 
  Megaphone, 
  Code, 
  Wrench, 
  BarChart2, 
  ShoppingBag, 
  MoreHorizontal,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { Workspace, Project, TeamMember } from '../types';

interface SetupWizardProps {
  onComplete: (workspace: Workspace) => void;
  onBackToLanding: () => void;
}

export default function SetupWizard({ onComplete, onBackToLanding }: SetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Step 1: Create Workspace
  const [workspaceName, setWorkspaceName] = useState<string>('Acme Corp');
  const [workspaceUrl, setWorkspaceUrl] = useState<string>('acme-corp');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step 2: Set Up First Project
  const [projectName, setProjectName] = useState<string>('Q4 Launch');
  const [projectDesc, setProjectDesc] = useState<string>('Coordinate final push for Q4 product release.');
  const [selectedIcon, setSelectedIcon] = useState<string>('rocket');
  const [selectedColor, setSelectedColor] = useState<string>('blue');

  // Step 3: Invite Team
  const [teamEmails, setTeamEmails] = useState<string>(
    'sarah.j@taskflow.io\nmarcus.c@taskflow.io\nelena.r@taskflow.io'
  );
  const [defaultRole, setDefaultRole] = useState<string>('Member');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyInviteLink = () => {
    const link = `https://taskflow.io/join/${workspaceUrl || 'workspace'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const prefillDemoData = () => {
    setWorkspaceName('Apex Laboratories');
    setWorkspaceUrl('apex-labs');
    setProjectName('Project Aurora');
    setProjectDesc('Design and test high-fidelity bio-reactors.');
    setSelectedIcon('code');
    setSelectedColor('purple');
    setTeamEmails('sarah.j@taskflow.io\nmarcus.c@taskflow.io\nelena.r@taskflow.io\nkatherine@taskflow.io');
    setStep(1);
  };

  // Submit and launch!
  const handleLaunch = () => {
    // Generate team members from list of emails
    const lines = teamEmails.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.includes('@'));
    const members: TeamMember[] = [
      {
        id: 'm1',
        name: 'Alex Carter',
        role: 'Product Lead',
        email: 'alex@taskflow.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80'
      }
    ];

    const randomAvatars = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&q=80'
    ];

    lines.forEach((email, index) => {
      const parts = email.split('@');
      const rawName = parts[0];
      const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).replace('.', ' ');
      members.push({
        id: `m_user_${index + 2}`,
        name: capitalizedName,
        role: defaultRole,
        email: email,
        avatar: randomAvatars[index % randomAvatars.length]
      });
    });

    const firstProject: Project = {
      id: 'p1',
      name: projectName || 'General Tasks',
      description: projectDesc || 'Default project workspace.',
      icon: selectedIcon,
      themeColor: selectedColor
    };

    const finalWorkspace: Workspace = {
      name: workspaceName || 'My Workspace',
      url: workspaceUrl || 'my-workspace',
      logo: logoPreview,
      projects: [firstProject],
      members: members
    };

    onComplete(finalWorkspace);
  };

  // Project Icons definition
  const projectIcons = [
    { name: 'rocket', icon: Rocket },
    { name: 'board', icon: Layers },
    { name: 'megaphone', icon: Megaphone },
    { name: 'code', icon: Code },
    { name: 'wrench', icon: Wrench },
    { name: 'chart', icon: BarChart2 },
    { name: 'shop', icon: ShoppingBag },
    { name: 'three-dots', icon: MoreHorizontal }
  ];

  // Theme colors definition
  const themeColors = [
    { name: 'blue', class: 'bg-blue-500 ring-blue-500/35 text-blue-400' },
    { name: 'green', class: 'bg-emerald-500 ring-emerald-500/35 text-emerald-400' },
    { name: 'orange', class: 'bg-orange-500 ring-orange-500/35 text-orange-400' },
    { name: 'red', class: 'bg-rose-500 ring-rose-500/35 text-rose-400' },
    { name: 'purple', class: 'bg-purple-500 ring-purple-500/35 text-purple-400' },
    { name: 'pink', class: 'bg-pink-500 ring-pink-500/35 text-pink-400' }
  ];

  return (
    <div id="setup-wizard" className="min-h-screen bg-[#0d0d15] bg-[radial-gradient(ellipse_at_top,rgba(30,27,75,0.4),rgba(13,13,21,0.95))] text-white/90 flex flex-col justify-between py-12 px-6 font-sans">
      {/* Top wizard header */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Layers className="w-5.5 h-5.5 text-blue-400" />
          <span className="font-bold text-sm text-white tracking-wide uppercase">TaskFlow Setup</span>
        </div>
        <button 
          onClick={prefillDemoData}
          className="text-xs text-blue-300 hover:text-blue-200 font-medium px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 transition-all cursor-pointer"
        >
          Prefill Demo Values
        </button>
      </div>

      {/* Main wizard Card */}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Step Progress Line */}
        <div className="flex items-center gap-2 mb-8 justify-between w-full text-[10px] tracking-widest text-white/30 font-mono">
          <span className={step >= 1 ? 'text-blue-400 font-extrabold' : ''}>1. WORKSPACE</span>
          <div className="h-0.5 flex-1 bg-white/5 rounded mx-2 relative">
            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <span className={step >= 2 ? 'text-blue-400 font-extrabold' : ''}>2. PROJECT</span>
          <div className="h-0.5 flex-1 bg-white/5 rounded mx-2 relative">
            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`} />
          </div>
          <span className={step >= 3 ? 'text-blue-400 font-extrabold' : ''}>3. INVITE</span>
          <div className="h-0.5 flex-1 bg-white/5 rounded mx-2 relative">
            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded transition-all duration-300 ${step >= 4 ? 'w-full' : 'w-0'}`} />
          </div>
          <span className={step >= 4 ? 'text-blue-400 font-extrabold' : ''}>4. LAUNCH</span>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: Create Workspace */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">Create Your Workspace</h2>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  This is where your team will collaborate. You can always rename or change these parameters down the road.
                </p>
              </div>

              {/* Workspace Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Workspace Name</label>
                <input 
                  type="text" 
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    setWorkspaceUrl(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="e.g., Acme Corp" 
                  className="w-full bg-black/40 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Workspace URL input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Workspace URL</label>
                <div className="flex items-center bg-black/40 border border-white/5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 rounded-xl px-4 py-3 transition-all">
                  <Globe className="w-4 h-4 text-white/30 mr-2 shrink-0" />
                  <span className="text-xs text-white/40 font-mono select-none">taskflow.io/</span>
                  <input 
                    type="text" 
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                    placeholder="acme" 
                    className="bg-transparent border-none text-xs text-white outline-none w-full font-mono pl-0.5"
                  />
                </div>
              </div>

              {/* Drag/drop custom logo simulation */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Workspace Logo (Optional)</label>
                <div className="border border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-black/20 cursor-pointer relative overflow-hidden transition-all group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {logoPreview ? (
                    <div className="flex items-center gap-3 w-full">
                      <img src={logoPreview} alt="Logo preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                      <div>
                        <span className="text-xs font-bold text-white block">Logo Loaded</span>
                        <span className="text-[10px] text-white/40 block">Click or drag again to change</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-white/40 group-hover:text-blue-400 transition-colors" />
                      <div className="text-center">
                        <span className="text-xs text-white/60 font-medium block">Click to select logo</span>
                        <span className="text-[10px] text-white/30 block">PNG, JPG up to 2MB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={onBackToLanding}
                  className="text-xs font-semibold text-white/40 hover:text-white/80 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button 
                  disabled={!workspaceName.trim()}
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-3 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Next: Project Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Set Up First Project */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">Set Up Your First Project</h2>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  Let's give your workspace its first focal project. You can customize the name, icon emblem, and theme palette below.
                </p>
              </div>

              {/* Project Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Marketing Push, Q4 Launch" 
                  className="w-full bg-black/40 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Project Description</label>
                <input 
                  type="text" 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="e.g., Final roadmap milestone coordination" 
                  className="w-full bg-black/40 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Project Icon Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Project Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {projectIcons.map((ico) => {
                    const IconComp = ico.icon;
                    return (
                      <button 
                        key={ico.name}
                        onClick={() => setSelectedIcon(ico.name)}
                        className={`w-full aspect-square rounded-lg border flex items-center justify-center transition-all cursor-pointer ${selectedIcon === ico.name ? 'bg-blue-500/10 border-blue-500 text-blue-300' : 'bg-black/30 border-white/5 hover:border-white/20 text-white/40'}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Color Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Theme Color Preset</label>
                <div className="flex items-center gap-3">
                  {themeColors.map((color) => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center border-2 transition-all cursor-pointer ${selectedColor === color.name ? 'border-white ring-4' : 'border-transparent hover:scale-105'}`}
                    >
                      {selectedColor === color.name && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-white/40 hover:text-white/80 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button 
                  disabled={!projectName.trim()}
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-3 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Next: Invite Team
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Invite Team */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">Invite Your Team</h2>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  Collaboration multiplies efficiency. Add emails of your developers and stakeholders. You can also send a fast invite link directly.
                </p>
              </div>

              {/* Email Addresses Text Area */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email Addresses (one per line)</label>
                  <span className="text-[10px] text-white/30 font-mono">Optional</span>
                </div>
                <textarea 
                  rows={4}
                  value={teamEmails}
                  onChange={(e) => setTeamEmails(e.target.value)}
                  placeholder="sarah.j@taskflow.io&#10;marcus.c@taskflow.io&#10;elena.r@taskflow.io" 
                  className="w-full bg-black/40 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-white/20 font-mono resize-none leading-relaxed"
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Default Assigned Role</label>
                <select 
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-xs text-white outline-none cursor-pointer transition-all"
                >
                  <option value="Member">Team Member</option>
                  <option value="Designer">UI/UX Designer</option>
                  <option value="Developer">Senior Developer</option>
                  <option value="Manager">Project Manager</option>
                  <option value="Stakeholder">External Stakeholder</option>
                </select>
              </div>

              {/* Copy Invite Link Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Or Send Invite Link</label>
                <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-2">
                  <Globe className="w-4 h-4 text-white/30 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    readOnly
                    value={`https://taskflow.io/join/${workspaceUrl || 'workspace'}`} 
                    className="bg-transparent border-none text-[11px] text-white/60 outline-none w-full font-mono"
                  />
                  <button 
                    onClick={copyInviteLink}
                    className="text-xs bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ml-2 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-white/40 hover:text-white/80 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button 
                  onClick={() => setStep(4)}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white text-xs font-bold px-5 py-3 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Next: Launch Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: You're all set! */}
          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">You're all set!</h2>
                <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                  Your new TaskFlow workspace has been successfully initialized. We've optimized your database cache for high-speed clientside rendering.
                </p>
              </div>

              {/* Summary Workspace Card */}
              <div className="w-full bg-black/40 border border-white/5 rounded-xl p-5 text-left flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white uppercase shadow-md">
                    {workspaceName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">WORKSPACE</span>
                    <span className="text-sm font-bold text-white block">{workspaceName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-white/40 block font-medium mb-0.5">INITIAL PROJECT</span>
                    <span className="text-white/80 font-bold block">{projectName}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block font-medium mb-0.5">TEAM SIZE</span>
                    <span className="text-white/80 font-bold block">
                      {teamEmails.split('\n').filter(l => l.trim().includes('@')).length + 1} Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4 Actions */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto text-xs font-semibold text-white/40 hover:text-white/80 py-2.5 px-4 cursor-pointer"
                >
                  Modify Details
                </button>

                <button 
                  onClick={handleLaunch}
                  className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white text-xs font-bold py-3 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full text-center mt-8 text-[11px] text-white/20 font-mono">
        &copy; 2026 TaskFlow. No installation required. Fully sandbox persistent.
      </div>
    </div>
  );
}
