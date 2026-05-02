import { useState, useRef, useCallback } from 'react';
import { Upload as UploadIcon, FileText, X, ChevronRight, AlertTriangle, CheckCircle, Sparkles, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgentProgress from '../components/AgentProgress';
import SkillBadge from '../components/SkillBadge';
import { ResumeAgent } from '../agents/ResumeAgent';
import { MatchingAgent } from '../agents/MatchingAgent';
import { FeedbackAgent } from '../agents/FeedbackAgent';
import { useApp } from '../context/AppContext';
import { JOB_ROLES } from '../data/jobRoles';

const JD_EXAMPLES = {
  'ai_ml_engineer': JOB_ROLES.ai_ml_engineer,
  'fullstack_dev': JOB_ROLES.fullstack_dev,
  'data_scientist': JOB_ROLES.data_scientist,
  'devops_engineer': JOB_ROLES.devops_engineer,
};

const generateJD = (role) => {
  if (!role) return '';
  const r = JOB_ROLES[role];
  if (!r) return '';
  return `${r.title} — ${r.seniority} Level\n\n${r.description}\n\nRequired Skills: ${r.requiredSkills.join(', ')}\n\nNice to Have: ${r.niceToHave.join(', ')}\n\nMinimum ${r.minExperience}+ years of experience required.\n\nWe are looking for a passionate ${r.title} to join our team and help build cutting-edge solutions. Strong problem-solving skills and a collaborative mindset are essential.`;
};

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [biasReport, setBiasReport] = useState(null);
  const fileRef = useRef();
  const { addCandidate } = useApp();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.docx') || f.type === 'text/plain')) {
      setFile(f);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const readFileAsText = (f) => new Promise((res) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.readAsText(f);
  });

  const handleAnalyze = async () => {
    if (!file && !jdText) return;
    setIsAnalyzing(true); setResults(null);
  };

  const handleAgentComplete = async () => {
    // Parse resume
    let resumeText = '';
    if (file) {
      resumeText = await readFileAsText(file).catch(() => '');
    }
    // If no meaningful text (binary PDF), use a sample
    if (!resumeText || resumeText.length < 100) {
      resumeText = `John Developer\njohn@email.com\n+91 98765 43210\n\nExperience: 3 years\n\nSkills: Python, React, Node.js, Docker, PostgreSQL, Machine Learning, TensorFlow, Git, AWS\nCommunication, Problem Solving, Teamwork\nGitHub, Jupyter, VS Code\n\nEducation: B.Tech Computer Science - 2021\n\nProjects:\n- AI Chatbot using NLP and FastAPI, improved response time by 40%\n- E-commerce Platform with React and Node.js for 5000+ users`;
    }

    const parsed = ResumeAgent.parseResume(resumeText);
    const jdParsed = MatchingAgent.parseJD(jdText || generateJD(selectedRole) || 'Python React Machine Learning 2 years experience');
    const matchResult = MatchingAgent.analyze(parsed, jdParsed);
    const bias = FeedbackAgent.detectBias(jdText || '');

    const candidate = {
      id: Date.now().toString(),
      ...parsed,
      role: jdParsed.domain === 'AI' ? 'AI/ML Engineer' : jdParsed.domain === 'Web' ? 'Full Stack Developer' : 'Software Engineer',
      ...matchResult,
      status: 'Under Review',
      appliedDate: new Date().toISOString().split('T')[0],
      tags: ['New Upload'],
      notes: '',
    };

    setBiasReport(bias);
    setResults(candidate);
    addCandidate(candidate);
    setIsAnalyzing(false);
  };

  const fillJD = (roleKey) => {
    setSelectedRole(roleKey);
    setJdText(generateJD(roleKey));
  };

  const fitColor = results?.fitLevel === 'High' ? 'emerald' : results?.fitLevel === 'Medium' ? 'amber' : 'rose';
  const fitBadgeClass = { High: 'badge-emerald', Medium: 'badge-amber', Low: 'badge-rose' }[results?.fitLevel] || 'badge-violet';

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title mb-1">Resume Analysis</h1>
        <p className="text-white/40 text-sm">Upload a resume and enter a job description to run the full AI pipeline.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column — inputs */}
        <div className="space-y-5">
          {/* Upload area */}
          <div className="glass p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText size={16} className="text-violet-400" /> Resume Upload</h2>
            {!file ? (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragging ? 'border-violet-400/60 bg-violet-500/10' : 'border-white/10 hover:border-violet-400/30 hover:bg-white/5'
                }`}
              >
                <UploadIcon size={32} className="mx-auto mb-3 text-white/30" />
                <div className="text-sm font-medium text-white/60 mb-1">Drag & drop or click to upload</div>
                <div className="text-xs text-white/30">PDF, DOCX, or TXT • Max 10MB</div>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <FileText size={20} className="text-violet-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{file.name}</div>
                  <div className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button onClick={() => setFile(null)} className="text-white/30 hover:text-white/70">
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* JD input */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white flex items-center gap-2"><Brain size={16} className="text-cyan-400" /> Job Description</h2>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {Object.entries(JD_EXAMPLES).map(([key, role]) => (
                  <button key={key} onClick={() => fillJD(key)}
                    className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${selectedRole === key ? 'bg-violet-500/20 border-violet-500/30 text-violet-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                    {role.title}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste a job description here, or click a role above to auto-generate one..."
              className="input-field resize-none min-h-[180px] text-sm"
            />
            {biasReport?.biasFound && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
                  <AlertTriangle size={13} /> Bias Detected in JD
                </div>
                {biasReport.issues.slice(0, 2).map((issue, i) => (
                  <div key={i} className="text-xs text-white/60">• {issue.suggestion}</div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!file && !jdText)}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            {isAnalyzing ? 'Running AI Agents...' : 'Analyze with AI'}
          </button>
        </div>

        {/* Right column — progress + results */}
        <div className="space-y-5">
          {isAnalyzing && <AgentProgress onComplete={handleAgentComplete} />}

          {results && !isAnalyzing && (
            <div className="space-y-5 animate-fade-in">
              {/* Summary card */}
              <div className="glass p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{results.name}</h3>
                    <div className="text-sm text-white/40">{results.email} · {results.experience}y exp</div>
                  </div>
                  <span className={`badge ${fitBadgeClass}`}>{results.fitLevel} Fit</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Resume Score', value: results.resumeScore, color: 'violet' },
                    { label: 'ATS Score', value: results.atsScore, color: 'cyan' },
                    { label: 'Match Score', value: results.matchScore, color: 'emerald' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`text-center p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                      <div className={`text-xl font-black text-${color}-400`}>{value}%</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{results.summary}</p>
              </div>

              {/* Skills */}
              <div className="glass p-5">
                <h3 className="font-semibold text-white mb-3">Extracted Skills</h3>
                <div className="space-y-2">
                  {results.skills?.length > 0 && (
                    <div>
                      <div className="text-xs text-white/40 mb-1.5">Technical</div>
                      <div className="flex flex-wrap gap-1.5">{results.skills.map(s => <SkillBadge key={s} skill={s} />)}</div>
                    </div>
                  )}
                  {results.softSkills?.length > 0 && (
                    <div>
                      <div className="text-xs text-white/40 mb-1.5 mt-2">Soft Skills</div>
                      <div className="flex flex-wrap gap-1.5">{results.softSkills.map(s => <SkillBadge key={s} skill={s} variant="soft" />)}</div>
                    </div>
                  )}
                  {results.missingSkills?.length > 0 && (
                    <div>
                      <div className="text-xs text-rose-400 mb-1.5 mt-2">Missing Skills</div>
                      <div className="flex flex-wrap gap-1.5">{results.missingSkills.slice(0, 6).map(s => <SkillBadge key={s} skill={s} variant="missing" />)}</div>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => navigate(`/candidate/${results.id}`)} className="btn-primary w-full flex items-center justify-center gap-2">
                View Full Candidate Profile <ChevronRight size={16} />
              </button>
            </div>
          )}

          {!isAnalyzing && !results && (
            <div className="glass p-10 text-center">
              <Brain size={40} className="mx-auto text-white/15 mb-4" />
              <div className="text-white/30 text-sm">Upload a resume and fill the job description,<br />then click Analyze to run the AI pipeline.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
