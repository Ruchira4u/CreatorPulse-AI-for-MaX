import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Bookmark, 
  History, 
  ChevronRight, 
  Play, 
  Eye, 
  Layout, 
  Music, 
  Hash, 
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { animate, motion, AnimatePresence } from 'motion/react';

// Types
interface Blueprint {
  hooks: Array<{
    hookType: string;
    scriptLine: string;
    retentionTactic: string;
  }>;
  script: Array<{
    timestamp: string;
    visualCue: string;
    voiceoverOrDialogue: string;
  }>;
  thumbnails: Array<{
    title: string;
    visualSetup: string;
    boldTextOverlay: string;
  }>;
  titlesAndCaptions: Array<{
    title: string;
    style: string;
  }>;
  hashtags: string[];
  audioVibe: string;
  creatorRetentionHack: string;
}

interface SavedBlueprint {
  id: string;
  date: string;
  topic: string;
  platform: string;
  data: Blueprint;
}

const SAMPLE_IDEAS = [
  {
    topic: "Street Food Tour in Colombo: Kothu vs Burger for under Rs. 1000",
    platform: "TikTok",
    language: "Singlish",
    tone: "Funny & Relatable"
  },
  {
    topic: "How to earn in USD as a Remote Freelancer from Sri Lanka in 2025",
    platform: "YouTube Long-form",
    language: "Sinhala",
    tone: "Tech & Educational"
  },
  {
    topic: "5 AI tools that feel illegal to know about for college students",
    platform: "Instagram Reels",
    language: "English",
    tone: "High-Energy Hype"
  }
];

export default function App() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Singlish");
  const [tone, setTone] = useState("Funny & Relatable");
  const [targetAudience, setTargetAudience] = useState("Modern Youth & Digital Creators");

  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [savedBlueprints, setSavedBlueprints] = useState<SavedBlueprint[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("CP_SAVED_BLUEPRINTS");
    if (saved) {
      try {
        setSavedBlueprints(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved blueprints", e);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied!`);
  };

  const generateBlueprint = async () => {
    if (!topic.trim()) {
      triggerToast("Please enter a topic first!");
      return;
    }

    setLoading(true);
    setBlueprint(null);

    try {
      const response = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, language, tone, targetAudience }),
      });

      if (!response.ok) throw new Error('Failed to generate blueprint');

      const data = await response.json();
      setBlueprint(data);
      
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      triggerToast("Error generating blueprint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveBlueprint = () => {
    if (!blueprint) return;
    const newEntry: SavedBlueprint = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      topic,
      platform,
      data: blueprint
    };
    const updated = [newEntry, ...savedBlueprints].slice(0, 20);
    setSavedBlueprints(updated);
    localStorage.setItem("CP_SAVED_BLUEPRINTS", JSON.stringify(updated));
    triggerToast("Blueprint saved to library!");
  };

  const loadSaved = (sb: SavedBlueprint) => {
    setTopic(sb.topic);
    setPlatform(sb.platform);
    setBlueprint(sb.data);
    triggerToast("Blueprint loaded!");
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Header - Top Bar Contract */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#08090E]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-lg font-display font-bold tracking-tight text-white whitespace-nowrap">
            CreatorPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Generator</a>
          <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Library</a>
          <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Templates</a>
          <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Resources</a>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => triggerToast("History feature coming soon!")}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <History className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-purple-400">
            <Sparkles className="w-3 h-3" />
            Empowering Viral Creators
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] text-wrap-balance">
            Turn Raw Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Viral Blueprints</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Proprietary retention frameworks for short-form and long-form video. 
            Optimized for local culture and global reach.
          </p>
        </section>

        {/* Preset Chips */}
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            Quick Inspiration
            <div className="h-px flex-1 bg-slate-800/50" />
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_IDEAS.map((idea, i) => (
              <button
                key={i}
                onClick={() => {
                  setTopic(idea.topic);
                  setPlatform(idea.platform);
                  setLanguage(idea.language);
                  setTone(idea.tone);
                }}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center gap-2 group"
              >
                <span className="text-[10px] text-purple-400 font-mono group-hover:text-purple-300">[{idea.platform}]</span>
                {idea.topic}
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[#10131E] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-12">
          <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500" />
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs">1</span>
                What's your video concept?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your idea in detail (e.g. 'Testing 5 luxury cars in Sri Lanka under 20 Million LKR')..."
                className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="YouTube Long-form">YouTube Long-form</option>
                  <option value="Facebook Video">Facebook Video</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="Singlish">Singlish (Colloquial)</option>
                  <option value="Sinhala">Sinhala (Authentic)</option>
                  <option value="English">English (Global)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="Funny & Relatable">Funny & Relatable</option>
                  <option value="Tech & Educational">Tech & Educational</option>
                  <option value="High-Energy Hype">High-Energy Hype</option>
                  <option value="Storytelling">Storytelling</option>
                  <option value="Motivational">Motivational</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateBlueprint}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Algorithms...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Viral Blueprint
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <AnimatePresence>
          {blueprint && (
            <motion.div 
              ref={outputRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-sm font-semibold text-purple-200">Blueprint Optimized for {platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={saveBlueprint}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(blueprint, null, 2), "Full Blueprint")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy All
                  </button>
                </div>
              </div>

              {/* 3 Viral Hooks */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Viral Hook Matrix</h3>
                    <p className="text-xs text-slate-500">Psychologically engineered for the first 3 seconds</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blueprint.hooks.map((hook, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{hook.hookType}</span>
                          <span className="text-[10px] text-slate-600 font-mono">01.0{i+1}</span>
                        </div>
                        <p className="text-lg font-semibold text-white leading-snug">"{hook.scriptLine}"</p>
                      </div>
                      <div className="pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                          <span className="text-cyan-400 not-italic font-bold text-[9px] uppercase block mb-1">Retention Tactic:</span>
                          {hook.retentionTactic}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Script Breakdown */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Shot-by-Shot Script</h3>
                    <p className="text-xs text-slate-500">Visual cues and spoken pacing for maximum watch time</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {blueprint.script.map((scene, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 transition-all">
                      <div className="w-full md:w-24 shrink-0">
                        <div className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-center">
                          <span className="text-xs font-mono font-bold text-cyan-400">{scene.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            Visual Direction
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed font-mono">{scene.visualCue}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Dialogue / Voiceover
                          </span>
                          <p className="text-base font-medium text-white leading-relaxed italic">"{scene.voiceoverOrDialogue}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Thumbnails & Audio */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Thumbnails */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">Clickable Thumbnails</h3>
                      <p className="text-xs text-slate-500">Visual concepts designed for high CTR</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {blueprint.thumbnails.map((thumb, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-orange-400">{thumb.title}</span>
                          <button onClick={() => copyToClipboard(thumb.boldTextOverlay, "Thumbnail Text")} className="text-slate-600 hover:text-white transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="aspect-video rounded-xl bg-black/40 border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl z-10">
                             {thumb.boldTextOverlay}
                           </h4>
                           <p className="mt-4 text-[11px] text-slate-500 max-w-xs z-10">{thumb.visualSetup}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Metadata & Hack */}
                <section className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white">Optimization</h3>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Titles / Captions</span>
                        <div className="space-y-2">
                          {blueprint.titlesAndCaptions.map((t, i) => (
                            <button 
                              key={i} 
                              onClick={() => copyToClipboard(t.title, "Title")}
                              className="w-full p-3 rounded-lg bg-black/30 border border-slate-800/50 text-left hover:border-purple-500/30 transition-all group flex items-center justify-between gap-3"
                            >
                              <span className="text-sm text-slate-300 group-hover:text-white">{t.title}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 group-hover:text-purple-400">{t.style}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audio Vibe</span>
                        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-3">
                          <Music className="w-4 h-4 text-cyan-400" />
                          <p className="text-sm text-cyan-100/80">{blueprint.audioVibe}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hashtags</span>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          {blueprint.hashtags.map((tag, i) => (
                            <span key={i} className="hover:text-white cursor-pointer transition-colors">#{tag.replace('#', '')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Retention Hack Callout */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Zap className="w-12 h-12 text-white" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Retention Pro Hack</span>
                      <p className="mt-2 text-base font-semibold text-white leading-relaxed">
                        {blueprint.creatorRetentionHack}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Library Section */}
        {savedBlueprints.length > 0 && (
          <section className="mt-24 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-white">Your Blueprint Library</h3>
              <button 
                onClick={() => {
                  setSavedBlueprints([]);
                  localStorage.removeItem("CP_SAVED_BLUEPRINTS");
                }}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Library
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBlueprints.map((sb) => (
                <div 
                  key={sb.id}
                  onClick={() => loadSaved(sb)}
                  className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-slate-600">{sb.date}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-purple-400 transition-colors">{sb.platform}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-4 group-hover:text-purple-300 transition-colors">{sb.topic}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500">3 Hooks · Full Script</span>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-black/40 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-purple-400" />
            <p className="text-sm text-slate-500">© 2026 CreatorPulse AI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-xl bg-[#10131E] border border-purple-500/30 text-white text-sm font-medium shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
