
import React, { useState } from 'react';
import { HeatLevel, GeneratorInput, GeneratedContent } from './types.ts';
import { generateRagebait } from './services/geminiService.ts';
import { TUTORIALS } from './constants.tsx';

// --- Sub-components ---

const Header: React.FC = () => (
  <header className="py-8 md:py-12 px-4 text-center">
    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bungee mb-2 glitch-text tracking-tighter italic select-none break-words">
      RAGESPARK
    </h1>
    <p className="text-red-500 font-bold uppercase tracking-[0.2em] md:tracking-widest text-xs sm:text-sm md:text-lg animate-pulse px-4">
      The Engagement Engineering Lab
    </p>
  </header>
);

const TutorialCard: React.FC<{ tutorial: typeof TUTORIALS[0] }> = ({ tutorial }) => (
  <div className="group relative bg-zinc-900 border-2 border-zinc-800 p-6 md:p-8 rounded-2xl hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 cursor-default overflow-hidden">
    <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="text-4xl md:text-5xl mb-4 md:mb-6 transform group-hover:scale-110 md:group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 origin-center inline-block">
        {tutorial.icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white group-hover:text-red-500 transition-colors duration-300">
        {tutorial.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
        {tutorial.content}
      </p>
      <div className="mt-6 md:mt-8 flex items-center text-[10px] font-black text-zinc-600 group-hover:text-red-600 transition-colors duration-300 uppercase tracking-[0.2em]">
        <span className="h-[1px] w-6 md:w-8 bg-zinc-800 group-hover:bg-red-600/50 mr-3 transition-colors duration-300"></span>
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

  const [formData, setFormData] = useState<GeneratorInput>({
    topic: '',
    heat: HeatLevel.SPICY,
    platform: 'X/Twitter'
  });

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    setError(null);
    try {
      const content = await generateRagebait(formData);
      setResult(content);
    } catch (e: any) {
      setError(e.message || "The outrage was too much for the servers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-12 md:pb-20 text-zinc-100 selection:bg-red-600 selection:text-white">
      <Header />

      {/* Responsive Tabs Navigation */}
      <div className="flex justify-center mb-10 md:mb-16 px-4">
        <div className="bg-zinc-900 p-1 rounded-full flex gap-1 border border-zinc-800 shadow-2xl relative w-full max-w-sm sm:max-w-md">
          <button 
            onClick={() => setActiveTab('generator')}
            className={`flex-1 px-4 sm:px-10 py-2.5 sm:py-3 rounded-full font-black text-[10px] sm:text-sm tracking-widest transition-all duration-300 ${activeTab === 'generator' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            THE LAB
          </button>
          <button 
            onClick={() => setActiveTab('academy')}
            className={`flex-1 px-4 sm:px-10 py-2.5 sm:py-3 rounded-full font-black text-[10px] sm:text-sm tracking-widest transition-all duration-300 ${activeTab === 'academy' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            ACADEMY
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        {activeTab === 'generator' ? (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Input Section */}
            <div className="bg-zinc-900/40 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-zinc-800 backdrop-blur-md shadow-2xl">
              <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 italic text-white uppercase">
                <span className="text-red-600 animate-pulse text-2xl md:text-3xl">⚡</span> 
                Design Discourse
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3">Trigger Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. JavaScript, Coffee, Gym..."
                    className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl focus:outline-none focus:border-red-600 text-lg md:text-xl font-bold transition-all placeholder:text-zinc-700 text-white"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3">Distribution Platform</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl focus:outline-none focus:border-red-600 font-bold appearance-none cursor-pointer text-white"
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                    >
                      <option>X/Twitter</option>
                      <option>TikTok</option>
                      <option>Reddit</option>
                      <option>YouTube</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">▼</div>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3">Volatility Level</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-zinc-950/50 border-2 border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl focus:outline-none focus:border-red-600 font-bold appearance-none cursor-pointer text-white"
                      value={formData.heat}
                      onChange={(e) => setFormData({...formData, heat: e.target.value as HeatLevel})}
                    >
                      {Object.values(HeatLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">▼</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !formData.topic}
                className="w-full mt-8 md:mt-10 fire-gradient py-5 md:py-6 rounded-xl md:rounded-2xl text-lg md:text-xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 shadow-xl text-white"
              >
                {loading ? 'CALIBRATING...' : 'INITIALIZE TRIGGER'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-950/20 border border-red-500/50 p-4 md:p-6 rounded-2xl text-red-500 font-black text-center text-[10px] sm:text-xs md:text-sm tracking-widest animate-bounce">
                SYSTEM ERROR: {error}
              </div>
            )}

            {/* Result Section */}
            {result && !loading && (
              <div className="bg-zinc-900/60 p-6 md:p-10 rounded-2xl md:rounded-3xl border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-in zoom-in-95 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                  <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    The Hook
                  </span>
                  <button 
                    className="text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(result.hook);
                      alert('Copied to clipboard!');
                    }}
                  >
                    <span className="hidden sm:inline">[ CLICK TO COPY ]</span>
                    <span className="sm:hidden">[ COPY ]</span>
                  </button>
                </div>
                
                <p className="text-2xl sm:text-4xl md:text-5xl font-bungee mb-8 md:mb-10 leading-tight italic tracking-tight text-white/90 break-words">
                  "{result.hook}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 border-t border-zinc-800/50 pt-8 md:pt-10">
                  <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase mb-2 md:mb-3 tracking-[0.2em] md:tracking-[0.3em]">Payload Strategy</h4>
                    <p className="text-zinc-300 font-bold text-sm md:text-base leading-relaxed">{result.strategy}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase mb-2 md:mb-3 tracking-[0.2em] md:tracking-[0.3em]">Neural Trigger</h4>
                    <p className="text-zinc-400 text-xs md:text-sm italic leading-relaxed">{result.psychology}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-10 md:mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter uppercase italic text-white">The Science of Friction</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4">
                Ragebait is the calculated use of <span className="text-red-600 font-bold">cognitive dissonance</span> to bypass the algorithms. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {TUTORIALS.map(t => (
                <TutorialCard key={t.id} tutorial={t} />
              ))}
            </div>

            <div className="mt-12 md:mt-20 bg-gradient-to-br from-zinc-900 to-black border-l-4 md:border-l-8 border-red-600 p-6 md:p-10 rounded-2xl shadow-2xl">
              <h3 className="text-[10px] font-black text-red-600 uppercase mb-4 tracking-[0.3em] md:tracking-[0.4em]">The Core Directive</h3>
              <p className="text-xl md:text-2xl font-bold text-zinc-100 leading-snug italic">
                "People don't comment because they like you. They comment because they <span className="text-red-600">need</span> to be right."
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 md:mt-32 text-center text-zinc-800 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] border-t border-zinc-900/50 pt-8 md:pt-12 pb-8 px-4">
        RAGESPARK // POWERED BY GEMINI 3 PRO // UNLIMITED ENGAGEMENT
      </footer>
    </div>
  );
};

export default App;
