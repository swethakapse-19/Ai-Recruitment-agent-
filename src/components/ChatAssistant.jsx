import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

const BOT_RESPONSES = {
  greeting: "Hello! I'm TalentIQ Assistant. I can help you with candidate analysis, job matching, and recruitment insights. What would you like to know?",
  default: "I can help you with candidate screening, skill matching, interview prep, or analytics insights. Try asking me about any specific candidate or topic!",
  candidates: "Currently tracking {n} candidates. {shortlisted} have been shortlisted with an average match score of {avg}%. Want me to help filter by a specific skill or role?",
  interview: "I can generate tailored interview questions for any role. Ask me: 'Generate questions for [role name]' and I'll create a mix of behavioral, technical, and coding questions.",
  skills: "Top skills in demand: Python, React, Machine Learning, Docker, and TypeScript. I can help identify skill gaps for any candidate.",
  score: "Resume scores factor in: ATS compatibility (20%), skill richness (35%), experience level (25%), and quantified achievements (20%). Higher is always better!",
  bias: "I scan job descriptions for potentially biased language including gender-coded words like 'ninja' or 'rockstar', age indicators, and exclusionary phrases. Always aim for inclusive JDs!",
  help: "I can help with:\n• Candidate analysis & scoring\n• Job matching & skill gaps\n• Interview question generation\n• Analytics & funnel insights\n• Resume improvement tips\n• Bias detection in JDs",
};

function getBotResponse(msg, candidates) {
  const lower = msg.toLowerCase();
  if (/hello|hi|hey/.test(lower)) return BOT_RESPONSES.greeting;
  if (/help|what can/.test(lower)) return BOT_RESPONSES.help;
  if (/candidate|how many|total/.test(lower)) {
    const n = candidates?.length || 0;
    const shortlisted = candidates?.filter(c => c.status === 'Shortlisted').length || 0;
    const avg = candidates?.length ? Math.round(candidates.reduce((a, c) => a + c.matchScore, 0) / candidates.length) : 0;
    return BOT_RESPONSES.candidates.replace('{n}', n).replace('{shortlisted}', shortlisted).replace('{avg}', avg);
  }
  if (/interview|question/.test(lower)) return BOT_RESPONSES.interview;
  if (/skill|technology|tech/.test(lower)) return BOT_RESPONSES.skills;
  if (/score|scoring|rating/.test(lower)) return BOT_RESPONSES.score;
  if (/bias|inclusive|diversity/.test(lower)) return BOT_RESPONSES.bias;
  return BOT_RESPONSES.default;
}

export default function ChatAssistant({ candidates }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, from: 'bot', text: "Hi! I'm TalentIQ Assistant. Ask me anything about your recruitment pipeline! 🚀" }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 800));
    const response = getBotResponse(input, candidates);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now(), from: 'bot', text: response }]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-lg shadow-violet-500/40 flex items-center justify-center hover:scale-105 transition-all duration-200 ${open ? 'hidden' : ''}`}
      >
        <MessageCircle size={22} className="text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-space-900" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[450px] glass flex flex-col overflow-hidden shadow-2xl shadow-black/40 animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-violet-500/15 to-cyan-500/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">TalentIQ Assistant</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/30 hover:text-white/70 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                  msg.from === 'user'
                    ? 'bg-violet-500/30 text-white border border-violet-500/30'
                    : 'bg-white/10 text-white/85 border border-white/10'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40"
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 flex items-center justify-center text-violet-400 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
