import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Star, Tag, FileText, Brain, MessageSquare, Lightbulb, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkillBadge from '../components/SkillBadge';
import { InterviewAgent } from '../agents/InterviewAgent';
import { FeedbackAgent } from '../agents/FeedbackAgent';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DIFF_COLORS = { Easy: 'badge-emerald', Medium: 'badge-amber', Hard: 'badge-rose' };
const TYPE_COLORS = { Behavioral: 'badge-cyan', Technical: 'badge-violet', Coding: 'badge-amber' };

const ScoreRing = ({ score, size = 80, strokeWidth = 6, color = '#7c3aed' }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize={size * 0.22} fontWeight="bold">
        {score}%
      </text>
    </svg>
  );
};

export default function CandidateProfile() {
  const { id } = useParams();
  const { getCandidate, updateCandidateStatus, updateCandidateNotes, updateCandidateTags } = useApp();
  const navigate = useNavigate();
  const candidate = getCandidate(id);

  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState(candidate?.notes || '');
  const [newTag, setNewTag] = useState('');
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluated, setEvaluated] = useState({});
  const [summary, setSummary] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);

  if (!candidate) {
    return (
      <div className="page-container text-center py-20">
        <div className="text-white/30 mb-4">Candidate not found.</div>
        <Link to="/candidates" className="btn-primary">Back to Candidates</Link>
      </div>
    );
  }

  const improvements = FeedbackAgent.getResumeImprovements(candidate);
  const skillRecs = FeedbackAgent.getSkillRecommendations(candidate.missingSkills || []);
  const explainability = FeedbackAgent.explainScore(candidate);

  const radarData = [
    { subject: 'Tech Skills', value: Math.min(100, (candidate.skills?.length || 0) * 8) },
    { subject: 'Experience', value: Math.min(100, (candidate.experience || 0) * 20) },
    { subject: 'ATS Score', value: candidate.atsScore || 0 },
    { subject: 'Resume Score', value: candidate.resumeScore || 0 },
    { subject: 'Match Score', value: candidate.matchScore || 0 },
    { subject: 'Interview', value: candidate.interviewScore || 0 },
  ];

  const generateInterviewQuestions = () => {
    const qs = InterviewAgent.generateQuestions(candidate.skills || [], candidate.experience || 0, candidate.role);
    setQuestions(qs);
    setAnswers({});
    setEvaluated({});
    setSummary(null);
  };

  const evaluateAnswer = (qId) => {
    const q = questions.find(q => q.id === qId);
    const answer = answers[qId] || '';
    const result = InterviewAgent.evaluateAnswer(q, answer);
    setEvaluated(prev => ({ ...prev, [qId]: result }));
  };

  const evaluateAll = () => {
    const results = {};
    questions.forEach(q => {
      const result = InterviewAgent.evaluateAnswer(q, answers[q.id] || '');
      results[q.id] = result;
    });
    setEvaluated(results);
    const answeredQuestions = questions.map(q => ({ ...q, score: results[q.id]?.score || 0 }));
    setSummary(InterviewAgent.generatePerformanceSummary(answeredQuestions, 0));
  };

  const saveNotes = () => updateCandidateNotes(id, notes);
  const addTag = () => {
    if (!newTag.trim()) return;
    const tags = [...(candidate.tags || []), newTag.trim()];
    updateCandidateTags(id, tags);
    setNewTag('');
  };
  const removeTag = (tag) => updateCandidateTags(id, (candidate.tags || []).filter(t => t !== tag));

  const fitColor = { High: '#10b981', Medium: '#f59e0b', Low: '#f43f5e' }[candidate.fitLevel] || '#7c3aed';
  const statusColor = { Shortlisted: 'badge-emerald', 'Under Review': 'badge-amber', Rejected: 'badge-rose' }[candidate.status] || 'badge-amber';

  const TABS = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'interview', label: 'Interview', icon: Brain },
    { id: 'feedback', label: 'AI Feedback', icon: Lightbulb },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => updateCandidateStatus(id, 'Shortlisted')} className="btn-success flex items-center gap-1.5 text-sm py-2">
            <CheckCircle size={14} /> Shortlist
          </button>
          <button onClick={() => updateCandidateStatus(id, 'Rejected')} className="btn-danger flex items-center gap-1.5 text-sm">
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="glass p-6 mb-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start gap-5 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/40 to-cyan-500/30 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
              {candidate.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-white">{candidate.name}</h1>
                {candidate.tags?.includes('Top Candidate') && <Star size={16} className="text-amber-400 fill-amber-400" />}
                <span className={`badge ${statusColor}`}>{candidate.status}</span>
              </div>
              <div className="text-white/50 text-sm mb-3">{candidate.role} · {candidate.experience}y experience · {candidate.location || 'India'}</div>
              <div className="text-xs text-white/40 mb-3">{candidate.email} · {candidate.phone || 'N/A'}</div>
              <div className="flex flex-wrap gap-1.5">
                {(candidate.tags || []).map(tag => (
                  <span key={tag} className="badge-violet flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-white/40 hover:text-white/80 ml-0.5 text-xs">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Score rings */}
          <div className="flex gap-5 justify-center flex-shrink-0">
            <div className="text-center">
              <ScoreRing score={candidate.matchScore || 0} color="#7c3aed" />
              <div className="text-xs text-white/40 mt-1">Match</div>
            </div>
            <div className="text-center">
              <ScoreRing score={candidate.resumeScore || 0} color="#06b6d4" />
              <div className="text-xs text-white/40 mt-1">Resume</div>
            </div>
            <div className="text-center">
              <ScoreRing score={candidate.atsScore || 0} color="#10b981" />
              <div className="text-xs text-white/40 mt-1">ATS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button key={tabId} onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tabId ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25' : 'text-white/40 hover:text-white/70'
            }`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Summary */}
            <div className="glass p-5">
              <h3 className="font-semibold text-white mb-3">AI-Generated Summary</h3>
              <p className="text-sm text-white/65 leading-relaxed">{candidate.summary}</p>
            </div>

            {/* Skills breakdown */}
            <div className="glass p-5">
              <h3 className="font-semibold text-white mb-4">Skills Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Technical', skills: candidate.skills || [], variant: 'tech' },
                  { label: 'Soft Skills', skills: candidate.softSkills || [], variant: 'soft' },
                  { label: 'Tools', skills: candidate.tools || [], variant: 'tools' },
                ].map(({ label, skills, variant }) => skills.length > 0 && (
                  <div key={label}>
                    <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{label}</div>
                    <div className="flex flex-wrap gap-1.5">{skills.map(s => <SkillBadge key={s} skill={s} variant={variant} />)}</div>
                  </div>
                ))}
                {candidate.missingSkills?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-rose-400 uppercase tracking-wider mb-2">Missing Required Skills</div>
                    <div className="flex flex-wrap gap-1.5">{candidate.missingSkills.map(s => <SkillBadge key={s} skill={s} variant="missing" />)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="glass p-5">
              <h3 className="font-semibold text-white mb-4">Experience & Education</h3>
              <div className="flex items-center gap-3 p-3 bg-violet-500/8 border border-violet-500/15 rounded-xl mb-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">{candidate.role}</div>
                  <div className="text-xs text-white/40">{candidate.experience} years of professional experience</div>
                </div>
              </div>
              {(candidate.education || []).map((edu, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cyan-500/8 border border-cyan-500/15 rounded-xl mt-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">{edu.degree}</div>
                    <div className="text-xs text-white/40">{edu.institution} · {edu.year}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            {candidate.projects?.length > 0 && (
              <div className="glass p-5">
                <h3 className="font-semibold text-white mb-4">Projects</h3>
                <div className="space-y-3">
                  {candidate.projects.map((p, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <div className="font-medium text-sm text-white mb-1">{p.name}</div>
                      <div className="text-xs text-white/50 mb-2">{p.description}</div>
                      <div className="flex flex-wrap gap-1">{p.tech?.map(t => <SkillBadge key={t} skill={t} size="xs" />)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Radar */}
            <div className="glass p-5">
              <h3 className="font-semibold text-white mb-3">Competency Radar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Fit & Score */}
            <div className="glass p-5">
              <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Fit Level', value: candidate.fitLevel, badge: true, color: { High: 'badge-emerald', Medium: 'badge-amber', Low: 'badge-rose' }[candidate.fitLevel] },
                  { label: 'Keyword Density', value: `${candidate.keywordDensity || 0}%` },
                  { label: 'Applied Date', value: candidate.appliedDate },
                  { label: 'Domain', value: candidate.domain || 'General' },
                ].map(({ label, value, badge, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{label}</span>
                    {badge ? <span className={`badge ${color} text-[10px]`}>{value}</span>
                      : <span className="text-sm font-medium text-white">{value}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interview' && (
        <div className="animate-fade-in space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white">Interview Intelligence</h2>
              <p className="text-sm text-white/40 mt-1">AI-generated questions tailored to {candidate.name}'s profile</p>
            </div>
            <button onClick={generateInterviewQuestions} className="btn-primary flex items-center gap-2">
              <Brain size={15} /> Generate Questions
            </button>
          </div>

          {!questions && (
            <div className="glass p-12 text-center">
              <Brain size={36} className="mx-auto text-white/15 mb-3" />
              <div className="text-white/30 text-sm">Click "Generate Questions" to create a personalized interview set.</div>
            </div>
          )}

          {questions && (
            <>
              <div className="space-y-3">
                {questions.map(q => {
                  const ev = evaluated[q.id];
                  const isExpanded = expandedQ === q.id;
                  return (
                    <div key={q.id} className="glass">
                      <div className="p-4 flex items-start gap-3 cursor-pointer" onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
                        <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-xs font-bold text-violet-400 flex-shrink-0">
                          {q.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`badge ${TYPE_COLORS[q.type] || 'badge-violet'} text-[10px]`}>{q.type}</span>
                            <span className={`badge ${DIFF_COLORS[q.difficulty] || 'badge-amber'} text-[10px]`}>{q.difficulty}</span>
                            {q.skill && <span className="badge-neutral badge text-[10px]">{q.skill}</span>}
                            {ev && <span className={`badge text-[10px] ${ev.score >= 70 ? 'badge-emerald' : ev.score >= 50 ? 'badge-amber' : 'badge-rose'}`}>Score: {ev.score}%</span>}
                          </div>
                          <div className="text-sm text-white/80">{q.q}</div>
                        </div>
                        {isExpanded ? <ChevronUp size={15} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={15} className="text-white/30 flex-shrink-0" />}
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-white/5 pt-3">
                          <textarea value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Type the candidate's answer here..."
                            className="input-field resize-none text-sm min-h-[100px] mb-3" />
                          {ev && (
                            <div className={`p-3 rounded-xl border text-xs mb-3 ${ev.score >= 70 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>
                              <strong>Score: {ev.score}%</strong> — {ev.feedback}
                            </div>
                          )}
                          <button onClick={() => evaluateAnswer(q.id)} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5">
                            <Send size={12} /> Evaluate Answer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={evaluateAll} className="btn-primary flex items-center gap-2">
                  Evaluate All & Generate Summary
                </button>
              </div>

              {summary && (
                <div className="glass p-5 animate-fade-in">
                  <h3 className="font-bold text-white mb-4">Interview Performance Summary</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-violet-500/10 rounded-xl">
                      <div className="text-2xl font-black gradient-text">{summary.averageScore}%</div>
                      <div className="text-xs text-white/40">Average Score</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-500/10 rounded-xl">
                      <div className="text-lg font-bold text-cyan-400">{summary.overallLevel}</div>
                      <div className="text-xs text-white/40">Performance</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-500/10 rounded-xl">
                      <div className="text-xs font-semibold text-emerald-400 mt-2">{summary.recommendation}</div>
                      <div className="text-xs text-white/40">Recommendation</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="grid lg:grid-cols-2 gap-5 animate-fade-in">
          {/* Explainable AI */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><Brain size={15} className="text-violet-400" /> Why This Score?</h3>
            <p className="text-xs text-white/40 mb-4">Explainable AI — score breakdown</p>
            <div className="space-y-3">
              {explainability.map(item => (
                <div key={item.factor}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70 font-medium">{item.factor} <span className="text-white/30">({item.weight})</span></span>
                    <span className="font-bold text-white">{item.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${item.score}%`,
                      background: item.color === 'emerald' ? '#10b981' : item.color === 'amber' ? '#f59e0b' : '#f43f5e'
                    }} />
                  </div>
                  <div className="text-[10px] text-white/35 mt-1">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume improvements */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><Lightbulb size={15} className="text-amber-400" /> Resume Improvements</h3>
            <p className="text-xs text-white/40 mb-4">AI-powered suggestions to improve this candidate's profile</p>
            <div className="space-y-3">
              {improvements.map((item, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-semibold text-white flex-1">{item.title}</span>
                    <span className={`badge text-[10px] ${item.priority === 'High' ? 'badge-rose' : item.priority === 'Medium' ? 'badge-amber' : 'badge-cyan'}`}>{item.priority}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed ml-7">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill recommendations */}
          {skillRecs.length > 0 && (
            <div className="glass p-5 lg:col-span-2">
              <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><BookOpen size={15} className="text-cyan-400" /> Skill Learning Recommendations</h3>
              <p className="text-xs text-white/40 mb-4">Resources to bridge the skill gap</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {skillRecs.map((rec, i) => (
                  <div key={i} className="p-3 bg-cyan-500/8 border border-cyan-500/15 rounded-xl">
                    <div className="text-sm font-bold text-cyan-400 mb-1">{rec.skill}</div>
                    <div className="text-xs text-white/60 mb-2">{rec.course}</div>
                    <div className="flex items-center gap-2">
                      <span className="badge-cyan text-[10px]">{rec.level}</span>
                      <span className="text-[10px] text-white/30">{rec.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="grid lg:grid-cols-2 gap-5 animate-fade-in">
          {/* Notes */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><MessageSquare size={15} className="text-violet-400" /> Recruiter Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add your private notes about this candidate..."
              className="input-field resize-none min-h-[150px] text-sm mb-3" />
            <button onClick={saveNotes} className="btn-primary text-sm py-2">Save Notes</button>
          </div>

          {/* Tags */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Tag size={15} className="text-cyan-400" /> Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(candidate.tags || []).map(tag => (
                <span key={tag} className="badge-violet flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 text-white/40 hover:text-white/80 text-xs">×</button>
                </span>
              ))}
              {(candidate.tags || []).length === 0 && <span className="text-xs text-white/30">No tags yet</span>}
            </div>
            <div className="flex gap-2">
              <input value={newTag} onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                placeholder="Add tag..." className="input-field text-sm py-2 flex-1" />
              <button onClick={addTag} className="btn-secondary text-sm py-2 px-4">Add</button>
            </div>
            <div className="mt-4">
              <div className="text-xs text-white/30 mb-2">Quick add:</div>
              <div className="flex flex-wrap gap-1.5">
                {['Top Candidate', 'Senior', 'NLP Expert', 'Strong Portfolio', 'Fast Track', 'ML Expert'].map(t => (
                  <button key={t} onClick={() => { setNewTag(t); }} className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
