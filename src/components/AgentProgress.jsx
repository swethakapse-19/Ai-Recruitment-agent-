import { useEffect, useState } from 'react';
import { CheckCircle, Loader, Circle } from 'lucide-react';

const STEPS = [
  { id: 'resume', label: 'Resume Agent', desc: 'Parsing document and extracting text...', color: 'violet' },
  { id: 'skills', label: 'Skill Extraction', desc: 'Identifying and categorizing skills via NLP...', color: 'cyan' },
  { id: 'matching', label: 'Matching Agent', desc: 'Computing semantic similarity with JD...', color: 'emerald' },
  { id: 'interview', label: 'Interview Agent', desc: 'Generating role-specific questions...', color: 'amber' },
  { id: 'feedback', label: 'Feedback Agent', desc: 'Creating improvement recommendations...', color: 'violet' },
];

export default function AgentProgress({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(s => s + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
      setTimeout(() => onComplete?.(), 500);
    }
  }, [currentStep]);

  const colorMap = {
    violet: { active: 'text-violet-400 border-violet-400/50 bg-violet-500/10', done: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10' },
    cyan: { active: 'text-cyan-400 border-cyan-400/50 bg-cyan-500/10', done: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10' },
    emerald: { active: 'text-emerald-400 border-emerald-400/50 bg-emerald-500/10', done: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10' },
    amber: { active: 'text-amber-400 border-amber-400/50 bg-amber-500/10', done: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10' },
  };

  return (
    <div className="glass p-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        <span className="text-sm font-semibold text-white/80">Multi-Agent AI Pipeline Running...</span>
      </div>

      {STEPS.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        const isPending = i > currentStep;
        const colors = colorMap[step.color];

        return (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${
              isDone ? colors.done
                : isActive ? `${colors.active} animate-pulse`
                : 'border-white/5 bg-white/5 opacity-40'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isDone ? <CheckCircle size={16} className="text-emerald-400" />
                : isActive ? <Loader size={16} className="animate-spin" />
                : <Circle size={16} className="text-white/30" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{step.label}</div>
              <div className="text-xs text-white/50 mt-0.5">{isDone ? '✓ Completed' : step.desc}</div>
            </div>
          </div>
        );
      })}

      {/* Progress bar */}
      <div className="progress-bar mt-4">
        <div
          className="progress-fill bg-gradient-to-r from-violet-500 to-cyan-500"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
      <div className="text-xs text-white/40 text-right">{Math.round((currentStep / STEPS.length) * 100)}% complete</div>
    </div>
  );
}
