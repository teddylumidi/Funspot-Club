import React, { useState, useEffect, createContext, useContext, ReactNode, FC } from 'react';

// --- TYPES ---
type Role = 'Admin' | 'User';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  dob: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
}

// --- ICONS ---
const UserIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EmailIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);


const LogoutIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


// --- AUTHENTICATION CONTEXT ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Seed admin user if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some((u: any) => u.email === 'admin@funspot.com');
    if (!adminExists) {
      const adminUser = {
        id: 'admin-001',
        name: 'Admin',
        email: 'admin@funspot.com',
        role: 'Admin',
        dob: '1990-01-01',
      };
      const adminPass = 'admin123';
      const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
      userPasswords[adminUser.email] = adminPass;
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
    }

    // Check for logged-in user
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const foundUser = users.find((u: User) => u.email === email);

    if (foundUser && userPasswords[email] === password) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    
    if (users.some((u: User) => u.email === userData.email)) {
      return false; // User already exists
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'User',
    };
    
    users.push(newUser);
    userPasswords[newUser.email] = userData.password;
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- AUTH COMPONENTS ---
const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
        setError('Please fill in all fields.');
        return;
    }
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-400 text-center text-sm">{error}</p>}
      <div className="relative">
        <EmailIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="relative">
        <LockIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
        Log In
      </button>
    </form>
  );
};

const RegisterForm: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !dob || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    const success = await register({ name, email, dob, password });
    if (!success) {
      setError('An account with this email already exists.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-center text-sm">{error}</p>}
      <div className="relative">
        <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
      </div>
       <div className="relative">
        <EmailIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
      </div>
      <div className="relative">
        <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
      </div>
      <div className="relative">
        <LockIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
      </div>
      <div className="relative">
        <LockIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
      </div>
      <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors">
        Create Account
      </button>
    </form>
  );
};

const AuthScreen: FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white">Funport Skating Club</h1>
        <div className="flex border-b border-gray-600">
          <button onClick={() => setIsLoginView(true)} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${isLoginView ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
            Login
          </button>
          <button onClick={() => setIsLoginView(false)} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${!isLoginView ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>
            Register
          </button>
        </div>
        {isLoginView ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENTS ---
const UserTable: FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
    }, []);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Date of Birth</th>
                            <th className="p-4 font-semibold">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-700/50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.dob}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-sm rounded-full ${user.role === 'Admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const AdminDashboard: FC = () => {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700 sticky top-0">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{user?.name}</span>
                    <button onClick={logout} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Logout">
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            <main className="p-4 md:p-8">
                <UserTable />
            </main>
        </div>
    );
};

const UserDashboard: FC = () => {
    const { user, logout } = useAuth();
    return (
         <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700 sticky top-0">
                <h1 className="text-xl font-bold text-green-400">Funport Skating Club</h1>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button onClick={logout} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Logout">
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            <main className="p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Welcome Widget */}
                    <div className="md:col-span-2 lg:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                        <p className="text-gray-400">Here's what's happening at the club today.</p>
                    </div>

                    {/* My Programs Widget */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">My Programs</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
                                <h4 className="font-semibold">Advanced Figure Skating</h4>
                                <p className="text-sm text-gray-400">Mon & Wed, 5:00 PM - 6:30 PM</p>
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold">Hockey Power Skating</h4>
                                <p className="text-sm text-gray-400">Fri, 6:00 PM - 7:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events Widget */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-green-400">Dec 15:</span>
                                <span>Winter Gala Showcase</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-green-400">Jan 10:</span>
                                <span>Regional Competition</span>
                            </li>
                        </ul>
                    </div>

                     {/* Club News Widget */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Club News</h3>
                        <p className="text-gray-400 text-sm">New session registration for the Spring term opens next Monday! Be sure to sign up early.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- APP ROUTER ---
export const App: FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return user?.role === 'Admin' ? <AdminDashboard /> : <UserDashboard />;
};

// Error boundary remains unchanged
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  // FIX: In TypeScript, class properties like 'state' must be declared.
  state: { hasError: boolean };
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
            <p className="text-gray-400 mb-6 max-w-sm">We've been notified and are working to fix the issue. Please try refreshing the page.</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}