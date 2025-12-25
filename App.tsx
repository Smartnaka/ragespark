
import React, { useState, useEffect } from 'react';
import { HeatLevel, GeneratorInput, GeneratedContent } from './types.ts';
import { generateRagebait } from './services/geminiService.ts';
import { TUTORIALS } from './constants.tsx';

// --- Sub-components ---

const Header: React.FC = () => (
  <header className="py-12 px-4 text-center">
    <h1 className="text-6xl md:text-8xl font-bungee mb-2 glitch-text tracking-tighter italic select-none">
      RAGESPARK
    </h1>
    <p className="text-red-500 font-bold uppercase tracking-widest text-sm md:text-lg animate-pulse">
      The Engagement Engineering Lab
    </p>
  </header>
);

const TutorialCard: React.FC<{ tutorial: typeof TUTORIALS[0] }> = ({ tutorial }) => (
  <div className="group relative bg-zinc-900 border-2 border-zinc-800 p-8 rounded-2xl hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-default overflow-hidden">
    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="text-5xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 origin-center inline-block">
        {tutorial.icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-red-500 transition-colors duration-300">
        {tutorial.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
        {tutorial.content}
      </p>
      <div className="mt-8 flex items-center text-[10px] font-black text-zinc-600 group-hover:text-red-600 transition-colors duration-300 uppercase tracking-[0.2em]">
        <span className="h-[1px] w-8 bg-zinc-800 group-hover:bg-red-600/50 mr-3 transition-colors duration-300"></span>
        Master Technique
      </div>
    </div>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'academy'>('generator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState(true);

  const [formData, setFormData] = useState<GeneratorInput>({
    topic: '',
    heat: HeatLevel.SPICY,
    platform: 'X/Twitter'
  });

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    try {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Key check failed", e);
    } finally {
      setCheckingKey(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true); // Proceed immediately as per instructions to avoid race conditions
    } catch (e) {
      setError("Failed to open key selector.");
    }
  };

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    setError(null);
    try {
      const content = await generateRagebait(formData);
      setResult(content);
    } catch (e: any) {
      if (e.message.includes("Requested entity was not found")) {
        setError("API Key Error. Please re-authenticate the session.");
        setHasKey(false);
      } else {
        setError(e.message || "The outrage was too much for the servers.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingKey) return <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-bungee animate-pulse">BOOTING LAB...</div>;

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <Header />
        <div className="max-w-md bg-zinc-900 border-2 border-red-600 p-10 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">Engine Activation Required</h2>
          <p className="text-zinc-400 mb-8 text-sm">
            RageSpark uses the Gemini 3 Pro Neural Engine. You must select a paid API key to initialize the controversy generators.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="text-red-500 text-[10px] font-black uppercase tracking-widest block mb-6 hover:underline"
          >
            Review Billing Requirements
          </a>
          <button 
            onClick={handleSelectKey}
            className="w-full fire-gradient py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            ACTIVATE ENGINE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 text-zinc-100">
      <Header />

      <div className="flex justify-center mb-16">
        <div className="bg-zinc-900 p-1 rounded-full flex gap-1 border border-zinc-800 shadow-2xl relative">
          <button 
            onClick={() => setActiveTab('generator')}
            className={`px-10 py-3 rounded-full font-black text-sm tracking-widest transition-all duration-300 ${activeTab === 'generator' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            THE LAB
          </button>
          <button 
            onClick={() => setActiveTab('academy')}
            className={`px-10 py-3 rounded-full font-black text-sm tracking-widest transition-all duration-300 ${activeTab === 'academy' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            ACADEMY
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {activeTab === 'generator' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="bg-zinc-900/40 p-10 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-white">
                <span className="text-red-600 animate-pulse text-3xl">⚡</span> 
                DESIGN THE DISCOURSE
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Trigger Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. JavaScript, Coffee Snobs, Gym Culture..."
                    className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-5 rounded-2xl focus:outline-none focus:border-red-600 text-xl font-bold transition-all placeholder:text-zinc-700 text-white"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Distribution Platform</label>
                  <select 
                    className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-5 rounded-2xl focus:outline-none focus:border-red-600 font-bold appearance-none cursor-pointer text-white"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                  >
                    <option>X/Twitter</option>
                    <option>TikTok</option>
                    <option>Reddit</option>
                    <option>YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Volatility Level</label>
                  <select 
                    className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-5 rounded-2xl focus:outline-none focus:border-red-600 font-bold appearance-none cursor-pointer text-white"
                    value={formData.heat}
                    onChange={(e) => setFormData({...formData, heat: e.target.value as HeatLevel})}
                  >
                    {Object.values(HeatLevel).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !formData.topic}
                className="w-full mt-10 fire-gradient py-6 rounded-2xl text-xl font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 shadow-xl text-white"
              >
                {loading ? 'CALIBRATING CONTROVERSY...' : 'INITIALIZE TRIGGER'}
              </button>
            </div>

            {error && (
              <div className="bg-red-950/20 border border-red-500/50 p-6 rounded-2xl text-red-500 font-black text-center text-sm tracking-widest animate-bounce">
                SYSTEM ERROR: {error}
                <button 
                  onClick={handleSelectKey}
                  className="block mx-auto mt-2 underline text-xs"
                >
                  RE-SELECT API KEY
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="bg-zinc-900/60 p-10 rounded-3xl border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    The Hook
                  </span>
                  <button 
                    className="text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(result.hook);
                      alert('Copied to clipboard!');
                    }}
                  >
                    [ CLICK TO COPY ]
                  </button>
                </div>
                
                <p className="text-4xl md:text-5xl font-bungee mb-10 leading-tight italic tracking-tight text-white/90">
                  "{result.hook}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-zinc-800/50 pt-10">
                  <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase mb-3 tracking-[0.3em]">Payload Strategy</h4>
                    <p className="text-zinc-300 font-bold leading-relaxed">{result.strategy}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase mb-3 tracking-[0.3em]">Neural Trigger</h4>
                    <p className="text-zinc-400 text-sm italic leading-relaxed">{result.psychology}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase italic text-white">The Science of Friction</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Ragebait is the calculated use of <span className="text-red-600 font-bold">cognitive dissonance</span> to bypass the algorithms. 
                Learn the weapons of mass engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TUTORIALS.map(t => (
                <TutorialCard key={t.id} tutorial={t} />
              ))}
            </div>

            <div className="mt-20 bg-gradient-to-br from-zinc-900 to-black border-l-8 border-red-600 p-10 rounded-2xl shadow-2xl">
              <h3 className="text-[10px] font-black text-red-600 uppercase mb-4 tracking-[0.4em]">The Core Directive</h3>
              <p className="text-2xl font-bold text-zinc-100 leading-snug italic">
                "People don't comment because they like you. They comment because they <span className="text-red-600">need</span> to be right. Give them that opportunity."
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] border-t border-zinc-900/50 pt-12 pb-12">
        RAGESPARK // POWERED BY GEMINI 3 PRO // NO LIMITS
      </footer>
    </div>
  );
};

export default App;
