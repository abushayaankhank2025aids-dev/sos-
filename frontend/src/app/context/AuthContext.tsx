import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RescuerUser {
  id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  user: RescuerUser | null;
  login: (name: string, phone: string, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RescuerUser | null>(() => {
    const saved = localStorage.getItem('rescuer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (name: string, phone: string, id?: string) => {
    // Generate a consistent rescuerId if not provided
    const rescuerId = id || `rescuer_${phone.replace(/\D/g, '').slice(-4)}`;
    const newUser = { id: rescuerId, name, phone };
    setUser(newUser);
    localStorage.setItem('rescuer_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rescuer_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
