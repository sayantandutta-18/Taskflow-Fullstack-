import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Terminal, 
  Compass, 
  Zap, 
  Shield, 
  BarChart2, 
  Users, 
  Sliders,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';

interface LandingPageProps {
  onStartSetup: () => void;
  onSkipToApp: () => void;
}

export default function LandingPage({ onStartSetup, onSkipToApp }: LandingPageProps) {
  // Dynamic Pricing Slider State
  const [teamSize, setTeamSize] = useState<number>(5);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Pro price per user: $10 monthly, $8 yearly (billed annually)
  const baseUserPrice = billingCycle === 'monthly' ? 10 : 8;
  const calculatedPrice = teamSize * baseUserPrice;

  const faqs = [
    {
      q: "How does the workspace onboarding setup wizard work?",
      a: "Our onboarding guides you through creating a secure, tailored collaborative workspace. You can configure your workspace name, create your initial high-performance project, customize styling themes, and invite your core team members in under two minutes."
    },
    {
      q: "Can I use TaskFlow entirely offline or locally?",
      a: "Yes! TaskFlow utilizes optimized clientside persistence (localStorage). Your data is automatically structured and cached in your browser. All stats, timers, tasks, and settings will remain fully responsive and saved without requiring cloud endpoints."
    },
    {
      q: "What is the Command Menu (Press Cmd+K)?",
      a: "The Command Menu is a global navigation and utility shortcut bar. Just press Cmd+K or Ctrl+K anywhere inside the app to search tasks, create actions instantly, filter projects, or jump between tabs seamlessly without touching your mouse."
    },
    {
      q: "Is there a limit on team members or projects on the free tier?",
      a: "The Free Plan is perfect for small squads, supporting up to 5 team members and 3 active projects. If you need advanced SVG analytics, dynamic Gantt schedules, and unlimited workspace storage, our Pro tier scales organically with your team size."
    }
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-[#0d0d15] bg-[radial-gradient(ellipse_at_top,rgba(30,27,75,0.4),rgba(13,13,21,0.95))] text-white/90 font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background Noise / Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none" />

      {/* Global Navigation Bar */}
      <header id="landing-header" className="sticky top-0 z-40 backdrop-blur-lg bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#flow-state" className="hover:text-white transition-colors">Flow State</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              id="landing-skip-btn"
              onClick={onSkipToApp} 
              className="text-sm font-medium text-white/40 hover:text-white transition-colors px-4 py-2"
            >
              Skip to Dashboard
            </button>
            <button 
              id="landing-get-started-btn"
              onClick={onStartSetup} 
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white text-sm font-semibold px-5 py-2.5 transition-all shadow-md hover:shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          TaskFlow Release 2.0
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6"
        >
          Precision for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            high-performance
          </span> teams.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          TaskFlow removes friction from your daily operations, allowing your team to enter a state of deep focus. Orchestrate complex projects with elegant simplicity.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button 
            id="hero-primary-btn"
            onClick={onStartSetup}
            className="w-full sm:w-auto rounded-xl bg-white text-[#0d0d15] hover:bg-white/90 px-8 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 group"
          >
            Get Started for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            id="hero-secondary-btn"
            onClick={onSkipToApp}
            className="w-full sm:w-auto rounded-xl glass-card-interactive text-white/80 hover:text-white px-8 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            Launch Demo Workspace
          </button>
        </motion.div>

        {/* Dashboard Preview Frame Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-2xl glass-panel p-3 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />
          {/* Top chrome header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 px-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="text-xs text-white/40 font-mono bg-black/40 px-6 py-1.5 rounded-md border border-white/5">
              taskflow.io/acme-corp/hq/dashboard
            </div>
            <div className="w-12 h-1 bg-transparent" />
          </div>

          {/* Simulated App Screenshot / UI Layout Mockup */}
          <div className="relative rounded-lg bg-black/30 p-6 text-left border border-white/5 flex flex-col md:flex-row gap-6 min-h-[350px]">
            {/* Left sidebar */}
            <div className="w-full md:w-1/4 shrink-0 flex flex-col gap-5 border-r border-white/5 md:pr-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">TF</div>
                <div className="text-sm font-bold text-white">Acme Corp</div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="h-7 rounded bg-blue-500/10 text-blue-300 flex items-center px-2.5 text-xs font-semibold border border-blue-500/20">Dashboard</div>
                <div className="h-7 rounded bg-transparent text-white/40 flex items-center px-2.5 text-xs font-medium">My Tasks</div>
                <div className="h-7 rounded bg-transparent text-white/40 flex items-center px-2.5 text-xs font-medium">Calendar</div>
                <div className="h-7 rounded bg-transparent text-white/40 flex items-center px-2.5 text-xs font-medium">Analytics</div>
              </div>
            </div>
            {/* Main content body */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Welcome back, Alex</h3>
                  <p className="text-[11px] text-white/40">You have 4 tasks due today.</p>
                </div>
                <div className="w-20 h-6 rounded bg-black/40 border border-white/5 flex items-center justify-center text-[10px] text-white/60">Pro Active</div>
              </div>

              {/* Stats and items */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg glass-card-interactive">
                  <span className="text-[10px] text-white/40 block mb-1">COMPLETED TASKS</span>
                  <span className="text-lg font-bold text-blue-400">84%</span>
                </div>
                <div className="p-3 rounded-lg glass-card-interactive">
                  <span className="text-[10px] text-white/40 block mb-1">FOCUS HOURS</span>
                  <span className="text-lg font-bold text-violet-400">124h</span>
                </div>
                <div className="p-3 rounded-lg glass-card-interactive">
                  <span className="text-[10px] text-white/40 block mb-1">CYCLE TIME</span>
                  <span className="text-lg font-bold text-emerald-400">3.2d</span>
                </div>
              </div>

              <div className="p-3 rounded-lg glass-card-interactive flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">Deploy Q4 Authentication Modules</span>
                </div>
                <span className="text-[10px] text-white/30 font-mono">TODAY</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Engineered for Focus.
          </h2>
          <p className="text-white/50">
            Everything you need, nothing you don't. We built TaskFlow to remove cognitive clutter and streamline rapid execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl glass-card-interactive transition-all flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">Automated Workflows</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Define status change rules and notification triggers. Tasks transition seamlessly from ideation to production.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl glass-card-interactive transition-all flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Deep Analytics</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Interactive high-resolution charts visualise cycle times, task completion rates, and historical performance tracking.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl glass-card-interactive transition-all flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Team Synergy</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Keep everyone in perfect sync. Dynamic team feeds highlight who is active and which critical milestones are resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Focus Mode & Shortcut Features */}
      <section id="flow-state" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 block">EFFORTLESS VELOCITY</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
              Enter the Flow State.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              We designed TaskFlow to be invisible when you don't need it, and immensely powerful when you do. Avoid multiple menu clicks and focus on actual output.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 mt-1 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Global Command Menu</h4>
                  <p className="text-xs text-white/40">Press <kbd className="bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/60 font-mono">Cmd+K</kbd> to launch actions, filter projects, or view stats instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center text-violet-400 mt-1 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Focus Filters</h4>
                  <p className="text-xs text-white/40">Isolate critical path tasks using quick filter tags and clean calendar milestones.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">High-Precision Styling</h4>
                  <p className="text-xs text-white/40">Eye-safe color choices and visual spacing structured specifically for developers and creatives.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Command Menu Mockup */}
          <div className="relative rounded-xl glass-panel p-5 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-white/40 pb-3 border-b border-white/5 mb-4 font-mono">
              <span>Command Palette Interface</span>
              <span className="text-blue-400">Active</span>
            </div>

            <div className="bg-black/40 rounded-lg p-3 border border-white/5 mb-4 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-blue-400" />
              <input 
                type="text" 
                readOnly 
                value="Create new task: Secure database routes" 
                className="bg-transparent border-none text-xs text-white outline-none w-full"
              />
              <span className="text-[10px] text-white/30 font-mono">Enter</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-white">
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Create New Task...</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">T</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded hover:bg-white/5 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Navigate to Calendar Tab</span>
                </div>
                <span className="text-[10px] text-white/20 font-mono">C</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded hover:bg-white/5 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Workspace Styling</span>
                </div>
                <span className="text-[10px] text-white/20 font-mono">S</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Interactive Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 block">TRANSPARENT VALUE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-white/50 text-sm md:text-base">
            No long term contracts. Choose the plan that matches your production load. Toggle below to estimate your cost dynamically.
          </p>

          {/* Monthly/Yearly Toggle Button */}
          <div className="inline-flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 mt-8">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/10' : 'text-white/40 hover:text-white'}`}
            >
              Monthly Billed
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/10' : 'text-white/40 hover:text-white'}`}
            >
              Yearly Billed
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Cost Estimator Slider */}
        <div className="max-w-2xl mx-auto mb-16 glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Interactive Pro Plan Slider Cost Estimator
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60 font-medium">Estimated Team Size:</span>
              <span className="text-white font-extrabold text-lg">{teamSize} {teamSize === 1 ? 'member' : 'members'}</span>
            </div>

            {/* Range Slider container */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTeamSize(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/80"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none bg-black/40 accent-blue-500 cursor-pointer"
              />
              <button 
                onClick={() => setTeamSize(prev => Math.min(50, prev + 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/80"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/40 block uppercase tracking-wider">ESTIMATED PRO COST</span>
                <span className="text-3xl font-extrabold text-white">
                  ${calculatedPrice}
                  <span className="text-xs font-semibold text-white/40">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">
                  Based on ${baseUserPrice}/user/mo billed {billingCycle}.
                </span>
              </div>
              <button 
                onClick={onStartSetup}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                Launch with Pro Tier
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Traditional Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Tier 1 */}
          <div className="p-8 rounded-2xl glass-card-interactive transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white/40 mb-2">Free Plan</h3>
              <div className="text-3xl font-extrabold text-white mb-4">$0 <span className="text-xs font-normal text-white/30">/ forever</span></div>
              <p className="text-xs text-white/50 leading-relaxed mb-6">
                Perfect for independent developers and tiny project teams seeking simple workflow caches.
              </p>
              <ul className="flex flex-col gap-3 mb-8 text-xs text-white/70">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Up to 5 team members</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> 3 high-speed projects</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Core list & Kanban tabs</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Local JSON client cache</li>
              </ul>
            </div>
            <button 
              onClick={onStartSetup}
              className="w-full py-2.5 rounded-xl bg-black/30 hover:bg-black/50 text-white/80 font-semibold text-xs border border-white/5 transition-all"
            >
              Choose Free
            </button>
          </div>

          {/* Tier 2 (Pro) */}
          <div className="p-8 rounded-2xl glass-panel border-2 border-blue-500/50 shadow-xl shadow-blue-500/5 relative flex flex-col justify-between">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </span>
            <div>
              <h3 className="text-base font-bold text-white mb-2">Pro Plan</h3>
              <div className="text-3xl font-extrabold text-white mb-4">
                ${billingCycle === 'monthly' ? '49' : '39'} 
                <span className="text-xs font-normal text-white/40">/ mo</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Unlocks responsive visual analytics, unlimited collaborative projects, calendar timelines, and customized project styling colors.
              </p>
              <ul className="flex flex-col gap-3 mb-8 text-xs text-white/90 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Up to 15 team members</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Unlimited active projects</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Interactive Monthly Calendars</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Custom theme color presets</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> High-res SVG analytics charts</li>
              </ul>
            </div>
            <button 
              onClick={onStartSetup}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20"
            >
              Get Started with Pro
            </button>
          </div>

          {/* Tier 3 (Enterprise) */}
          <div className="p-8 rounded-2xl glass-card-interactive transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white/40 mb-2">Enterprise</h3>
              <div className="text-3xl font-extrabold text-white mb-4">Custom <span className="text-xs font-normal text-white/30">/ quote</span></div>
              <p className="text-xs text-white/50 leading-relaxed mb-6">
                Engineered for global scale, dedicated infrastructure, priority routing SLAs, and specialized integration audits.
              </p>
              <ul className="flex flex-col gap-3 mb-8 text-xs text-white/70">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Unlimited members & workspaces</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> SSO & SAML Authentication</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Dedicated support team</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Custom database configurations</li>
              </ul>
            </div>
            <button 
              onClick={onStartSetup}
              className="w-full py-2.5 rounded-xl bg-black/30 hover:bg-black/50 text-white/80 font-semibold text-xs border border-white/5 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-white/40 text-sm">Got questions about TaskFlow? We've got answers.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="rounded-xl glass-card-interactive overflow-hidden"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-slate-200 hover:text-white font-bold text-sm transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`text-white/40 transition-transform ${activeFaq === idx ? 'rotate-45' : 'rotate-0'}`}>
                  <Plus className="w-4 h-4" />
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 pt-1 text-xs text-white/50 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Page Footer */}
      <footer id="landing-footer" className="backdrop-blur-lg bg-black/20 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">TF</div>
            <span className="text-sm font-bold text-white">TaskFlow</span>
          </div>

          <p className="text-xs text-white/40 text-center md:text-right">
            &copy; 2026 TaskFlow Inc. Precision performance layout. All rights reserved. Built with Vite and Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
}
