import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'base_commander' | 'logistics_officer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  baseId?: string;
  baseName?: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator'
    }
  },
  'commander1': {
    password: 'cmd123',
    user: {
      id: '2',
      username: 'commander1',
      role: 'base_commander',
      baseId: '1',
      baseName: 'Fort Liberty',
      firstName: 'John',
      lastName: 'Mitchell'
    }
  },
  'logistics1': {
    password: 'log123',
    user: {
      id: '3',
      username: 'logistics1',
      role: 'logistics_officer',
      baseId: '1',
      baseName: 'Fort Liberty',
      firstName: 'Sarah',
      lastName: 'Chen'
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { password: string; user: User }>>(mockUsers);

  useEffect(() => {
    const storedUser = localStorage.getItem('mams_user');
    const storedUsers = localStorage.getItem('mams_registered_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = registeredUsers[username];
    if (foundUser && foundUser.password === password) {
      setUser(foundUser.user);
      localStorage.setItem('mams_user', JSON.stringify(foundUser.user));
      return true;
    }
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    // Check if username already exists
    if (registeredUsers[userData.username]) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      role: 'logistics_officer', // Default role for new users
      firstName: userData.firstName,
      lastName: userData.lastName
    };

    const newUserRecord = {
      password: userData.password,
      user: newUser
    };

    const updatedUsers = {
      ...registeredUsers,
      [userData.username]: newUserRecord
    };

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('mams_registered_users', JSON.stringify(updatedUsers));
    
    // Auto-login after signup
    setUser(newUser);
    localStorage.setItem('mams_user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mams_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
