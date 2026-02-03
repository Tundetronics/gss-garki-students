import React, { useState } from 'react';
import { GraduationCap, Volume2, X, Heart, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Gift 1 - Student Success Navigator
 * RC Abuja HighRise Vocational Project 2026
 * Architect: Rtn. Babatunde Adesina — The Agentic Orchestrator
 */

const apiKey = ""; // Runtime provides key

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitize = (text) => text.replace(/[*#_~`\[\]()<>|]/g, '').replace(/\n\s*\n/g, '\n\n').trim();

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text.replace(/\n/g, '. '));
    window.speechSynthesis.speak(speech);
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "You are the Student Navigator for GSS Garki. Provide an 8-day tactical study plan. Use PLAIN CONVERSATIONAL TEXT ONLY. No markdown symbols.";
    const delays = [1000, 2000, 4000, 8000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: sys }] }
          })
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResult(sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text || ""));
        setShowModal(true);
        setIsProcessing(false);
        return;
      } catch (e) {
        if (i === delays.length) {
          setResult("Orchestration interrupted. Please check connection.");
          setShowModal(true);
          setIsProcessing(false);
        } else {
          await new Promise(res => setTimeout(res, delays[i]));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#002147] text-white flex flex-col font-sans">
      <nav className="p-6 border-b border-yellow-500/30 bg-[#00152e] flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-yellow-500" size={28} />
          <span className="font-black uppercase tracking-widest text-sm">RC Abuja HighRise</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/50">Student Navigator</div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-10">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Academic <span className="text-yellow-500">Navigator</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-6 backdrop-blur-xl">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-center text-2xl outline-none border border-white/10 focus:border-yellow-500 transition-all" placeholder="Enter Subjects" />
          <button disabled={isProcessing || !val.trim()} onClick={() => callAI(`Create plan for: ${val}`)} className="w-full bg-yellow-500 py-6 rounded-2xl font-black text-xl uppercase tracking-widest text-[#002147] hover:bg-yellow-400 transition-all">
            {isProcessing ? "Orchestrating..." : "Execute Strike Plan"}
          </button>
        </div>
      </main>
      <footer className="bg-[#00152e] h-24 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="text-left"><p className="text-xs font-black uppercase tracking-widest opacity-60">Vocational Service Gift</p><p className="text-[10px] font-bold uppercase text-yellow-500/50">Rtn. Babatunde Adesina — The Orchestrator</p></div>
        <Heart className="text-red-500 fill-red-500 animate-pulse" />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black uppercase text-yellow-500">Tactical Blueprint</h2>
              <div className="flex gap-4">
                <button onClick={() => speak(result)} className="bg-blue-600 px-8 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"><Volume2 size={20}/> Listen</button>
                <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
