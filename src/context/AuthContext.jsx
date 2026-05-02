import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: '1', email: 'admin@talentiq.ai', password: 'admin123', name: 'Swetha Kapse', role: 'admin', avatar: null },
  { id: '2', email: 'recruiter@talentiq.ai', password: 'recruit123', name: 'Priya Recruiter', role: 'recruiter', avatar: null },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('talentiq_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 800)); // simulate API delay
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('talentiq_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Try admin@talentiq.ai / admin123' };
  };

  const signup = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser = { id: Date.now().toString(), name, email, role: 'recruiter' };
    setUser(newUser);
    localStorage.setItem('talentiq_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talentiq_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
