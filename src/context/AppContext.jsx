import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CANDIDATES } from '../data/mockCandidates';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([
    { id: '1', title: 'AI/ML Engineer', domain: 'AI', status: 'Active', candidates: 4, posted: '2024-04-10' },
    { id: '2', title: 'Full Stack Developer', domain: 'Web', status: 'Active', candidates: 3, posted: '2024-04-12' },
    { id: '3', title: 'Data Scientist', domain: 'Data', status: 'Active', candidates: 2, posted: '2024-04-15' },
    { id: '4', title: 'DevOps Engineer', domain: 'Infrastructure', status: 'Paused', candidates: 2, posted: '2024-04-08' },
  ]);
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Shortlisted Sneha Patel for AI/ML Engineer', time: '2 min ago', type: 'shortlist' },
    { id: 2, action: 'New candidate Arjun Mehta uploaded resume', time: '15 min ago', type: 'upload' },
    { id: 3, action: 'Interview generated for Ananya Singh', time: '1 hour ago', type: 'interview' },
    { id: 4, action: 'Kavitha Raj shortlisted for Frontend Developer', time: '2 hours ago', type: 'shortlist' },
    { id: 5, action: 'Rejected Aditya Verma for DevOps Engineer', time: '3 hours ago', type: 'reject' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('talentiq_candidates');
    if (saved) {
      try { setCandidates(JSON.parse(saved)); return; } catch {}
    }
    setCandidates(MOCK_CANDIDATES);
    localStorage.setItem('talentiq_candidates', JSON.stringify(MOCK_CANDIDATES));
  }, []);

  const saveCandidates = (updated) => {
    setCandidates(updated);
    localStorage.setItem('talentiq_candidates', JSON.stringify(updated));
  };

  const updateCandidateStatus = (id, status) => {
    const updated = candidates.map(c => c.id === id ? { ...c, status } : c);
    saveCandidates(updated);
    addActivity(`${status} candidate ${candidates.find(c => c.id === id)?.name}`, status === 'Shortlisted' ? 'shortlist' : 'reject');
  };

  const updateCandidateNotes = (id, notes) => {
    const updated = candidates.map(c => c.id === id ? { ...c, notes } : c);
    saveCandidates(updated);
  };

  const updateCandidateTags = (id, tags) => {
    const updated = candidates.map(c => c.id === id ? { ...c, tags } : c);
    saveCandidates(updated);
  };

  const addCandidate = (candidate) => {
    const updated = [candidate, ...candidates];
    saveCandidates(updated);
    addActivity(`New resume uploaded for ${candidate.name}`, 'upload');
  };

  const addActivity = (action, type = 'info') => {
    setActivityLog(prev => [{ id: Date.now(), action, time: 'Just now', type }, ...prev].slice(0, 20));
  };

  const getCandidate = (id) => candidates.find(c => c.id === id);

  return (
    <AppContext.Provider value={{
      candidates, jobs, activityLog,
      updateCandidateStatus, updateCandidateNotes, updateCandidateTags,
      addCandidate, getCandidate, addActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
