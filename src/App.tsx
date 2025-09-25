import React, { useState, useContext, createContext, useMemo, ReactNode } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LayoutDashboard, Users, BarChart3, Calendar, ShieldCheck, LogOut, FileText, User, DollarSign, Crown } from 'lucide-react';

// --- GEMINI API SETUP ---
// This would be in a separate config file in a real application
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TYPESCRIPT DEFINITIONS (Based on Spec) ---
type UserRole = 'admin' | 'coach' | 'parent' | 'athlete';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

interface Athlete {
  id: number;
  userId: number;
  parentId: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  lastPromotion: string;
}

interface TrainingSession {
  id: number;
  activity: string;
  coachId: number;
  dateTime: string;
  location: string;
}

// --- MOCK DATA (Simulating a database) ---
const mockUsers: User[] = [
  { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@skate.com', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
  { id: 2, firstName: 'Coach', lastName: 'Carter', email: 'coach@skate.com', role: 'coach', avatarUrl: 'https://i.pravatar.cc/150?u=coach' },
  { id: 3, firstName: 'Parent', lastName: 'Smith', email: 'parent@skate.com', role: 'parent', avatarUrl: 'https://i.pravatar.cc/150?u=parent' },
  { id: 4, firstName: 'Leo', lastName: 'Smith', email: 'leo@skate.com', role: 'athlete', avatarUrl: 'https://i.pravatar.cc/150?u=leo' }
];

const mockAthletes: Athlete[] = [
  { id: 101, userId: 4, parentId: 3, level: 'intermediate', lastPromotion: '2023-05-10' }
];

const mockSessions: TrainingSession[] = [
    { id: 1, activity: 'Skating Fundamentals', coachId: 2, dateTime: '2024-07-25T16:00:00Z', location: 'Main Rink'},
    { id: 2, activity: 'Advanced Gliding', coachId: 2, dateTime: '2024-07-27T17:00:00Z', location: 'Main Rink'}
];


// --- AUTHENTICATION CONTEXT ---
interface AuthContextType {
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- SHARED UI COMPONENTS ---

const Card: React.FC<{ title: string; value: string; icon: ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Sidebar: React.FC<{ role: UserRole }> = ({ role }) => {
    const { logout } = useAuth();
    const navItems = {
        admin: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { icon: <Users size={20} />, label: 'Users' },
            { icon: <Calendar size={20} />, label: 'Events' },
            { icon: <DollarSign size={20} />, label: 'Finances' },
        ],
        coach: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { icon: <Users size={20} />, label: 'My Athletes' },
            { icon: <FileText size={20} />, label: 'Reports' },
        ],
        parent: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { icon: <User size={20} />, label: 'My Child' },
            { icon: <DollarSign size={20} />, label: 'Payments' },
        ],
        athlete: []
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
                SkateClub
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    {navItems[role].map(item => (
                        <li key={item.label} className="mb-2">
                            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                {item.icon}
                                <span className="ml-4">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                 <button onClick={logout} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <LogOut size={20} />
                    <span className="ml-4">Logout</span>
                </button>
            </div>
        </aside>
    );
};

const Header: React.FC = () => {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    return (
        <header className="bg-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Welcome, {currentUser.firstName}!</h1>
            <div className="flex items-center">
                <img src={currentUser.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full"/>
            </div>
        </header>
    );
};

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role={currentUser.role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- ROLE-SPECIFIC DASHBOARDS ---

const AdminDashboard: React.FC = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card title="Total Users" value="152" icon={<Users size={24} color="white"/>} color="bg-blue-500" />
            <Card title="Active Trainings" value="12" icon={<Calendar size={24} color="white"/>} color="bg-green-500" />
            <Card title="Pending Payments" value="$1,230" icon={<DollarSign size={24} color="white"/>} color="bg-yellow-500" />
            <Card title="New Athletes" value="8" icon={<BarChart3 size={24} color="white"/>} color="bg-purple-500" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td><span className="capitalize px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">{user.role}</span></td>
                    <td><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
);

const ParentDashboard: React.FC = () => {
    const childAthlete = mockAthletes[0];
    const childUser = mockUsers.find(u => u.id === childAthlete.userId)!;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Parent Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold mb-4">Child's Progress: {childUser.firstName} {childUser.lastName}</h3>
                         <div className="flex items-center space-x-8">
                            <div>
                                <p className="text-sm text-gray-500">Current Level</p>
                                <p className="text-xl font-bold capitalize flex items-center"><Crown size={20} className="mr-2 text-yellow-500"/>{childAthlete.level}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Last Promotion</p>
                                <p className="text-xl font-bold">{childAthlete.lastPromotion}</p>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Upcoming Training Sessions</h3>
                        <ul>
                            {mockSessions.map(session => (
                                <li key={session.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{session.activity}</p>
                                        <p className="text-sm text-gray-500">{new Date(session.dateTime).toLocaleString()} at {session.location}</p>
                                    </div>
                                    <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">Details</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Account Balance</h3>
                    <p className="text-4xl font-bold text-red-500 mb-4">$75.00</p>
                    <p className="text-sm text-gray-500 mb-4">Due: August 1, 2024</p>
                    <button className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">Pay Now</button>
                </div>
            </div>
        </div>
    );
};

const CoachDashboard: React.FC = () => {
    const [notes, setNotes] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSummary = async () => {
        if (!notes.trim()) {
            setSummary("Please enter some notes first.");
            return;
        }
        setIsLoading(true);
        setSummary('');
        try {
            const prompt = `You are a helpful coaching assistant. Summarize the following roller skating training notes into a concise, encouraging, and parent-friendly paragraph. Focus on progress and areas for improvement. Notes: "${notes}"`;
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction: "You are a helpful coaching assistant for a skating club.",
              }
            });
            setSummary(response.text);
        } catch (error) {
            console.error("Gemini API error:", error);
            setSummary("Sorry, I couldn't generate a summary right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Coach Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Submit Training Report</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Athlete</label>
                            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option>Leo Smith</option>
                                <option>Jane Doe</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Training Notes</label>
                            <textarea
                                rows={5}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Leo showed great improvement in his balance today. Worked on crossovers and stopping. Needs to keep his knees bent more."
                            ></textarea>
                        </div>
                        <div>
                            <button
                                onClick={handleGenerateSummary}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300"
                            >
                                {isLoading ? 'Generating...' : '✨ Generate Summary with AI'}
                            </button>
                        </div>
                        {summary && (
                             <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                <h4 className="font-semibold text-gray-800">AI Generated Summary:</h4>
                                <p className="text-gray-700 text-sm mt-1">{summary}</p>
                            </div>
                        )}
                        <button className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Submit Report</button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">My Athletes</h3>
                    <ul>
                        <li className="py-2 border-b">Leo Smith - Intermediate</li>
                        <li className="py-2 border-b">Jane Doe - Beginner</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- LOGIN PAGE ---
const LoginPage: React.FC = () => {
    const { login } = useAuth();
    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-2">SkateClub Portal</h1>
            <p className="text-lg text-gray-300 mb-8">Select a role to login as</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                <button onClick={() => login('admin')} className="p-8 bg-gray-700 rounded-lg hover:bg-blue-600 transition-colors">
                    <ShieldCheck className="mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-semibold">Admin</h2>
                </button>
                 <button onClick={() => login('coach')} className="p-8 bg-gray-700 rounded-lg hover:bg-green-600 transition-colors">
                    <User className="mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-semibold">Coach</h2>
                </button>
                 <button onClick={() => login('parent')} className="p-8 bg-gray-700 rounded-lg hover:bg-purple-600 transition-colors">
                    <Users className="mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-semibold">Parent</h2>
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT (ROUTER) ---
const AppContent: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <LoginPage />;
    }

    const renderDashboard = () => {
        switch (currentUser.role) {
            case 'admin': return <AdminDashboard />;
            case 'coach': return <CoachDashboard />;
            case 'parent': return <ParentDashboard />;
            default: return <div>Dashboard coming soon.</div>;
        }
    };

    return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};


// --- ERROR BOUNDARY ---
// Fix: Replaced constructor with a class property for state initialization. This is a more modern syntax and resolves TypeScript errors with `this.state` and `this.props`.
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

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