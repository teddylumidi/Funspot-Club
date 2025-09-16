import React, { useState, useEffect, useRef, SetStateAction } from 'react';

// --- SVG Icons ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.566-.16-1.168.356-1.168.356m3.633.82-1.168-.356m1.168.356c-.566.16-1.533-.205-1.533-.205m2.7 2.062a5.987 5.987 0 0 1-1.533-.205m1.533.205a5.987 5.987 0 0 0-1.533.205m-2.7-2.062a5.987 5.987 0 0 0-1.533.205m1.533-.205L8.25 15.75M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-1.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Zm6 0h.008v.008H12V15Zm6 0h.008v.008H18V15Zm-6 0h.008v.008H12V15Z" /></svg>;
const ClipboardDocumentListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 12 2.25a2.251 2.251 0 0 1 1.024.223M7.5 21h9a2.25 2.25 0 0 0 2.25-2.25v-13.5a2.25 2.25 0 0 0-2.25-2.25h-9a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21Z" /></svg>;

// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';

interface User {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  date_of_birth: string;
  parent_id: number | null;
  coach_id?: number;
}

interface Program {
  program_id: number;
  title: string;
  description: string;
  schedule: string;
  coach_id: number;
  price: number;
}

interface Booking {
  booking_id: number;
  user_id: number;
  program_id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  booked_at: string;
}

interface Attendance {
    attendance_id: number;
    athlete_id: number;
    program_id: number;
    date: string;
    status: 'present' | 'absent';
}

interface Progress {
    progress_id: number;
    athlete_id: number;
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    percentage: number; // Added for UI
    updated_at: string;
}

interface Payment {
    payment_id: number;
    user_id: number; // Parent or Athlete
    booking_id: number;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    paid_at: string | null;
}

interface AdminLog {
    log_id: number;
    admin_id: number;
    action: string;
    target_id?: number;
    timestamp: string;
}

// --- Data Simulation & Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: SetStateAction<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

const initialUsers: User[] = [
    { user_id: 1, name: 'Admin User', email: 'admin@funport.com', password_hash: 'password123', role: 'Admin', date_of_birth: '1990-01-01', parent_id: null },
    { user_id: 2, name: 'Coach Sarah', email: 'sarah@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1992-05-15', parent_id: null },
    { user_id: 3, name: 'Coach Mike', email: 'mike@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1988-11-20', parent_id: null },
    { user_id: 4, name: 'John Doe', email: 'john@email.com', password_hash: 'password123', role: 'Parent', date_of_birth: '1985-03-10', parent_id: null },
    { user_id: 5, name: 'Leo Doe', email: 'leo@email.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2014-06-22', parent_id: 4, coach_id: 2 },
    { user_id: 6, name: 'Jane Smith', email: 'jane@email.com', password_hash: 'password123', role: 'Parent', date_of_birth: '1987-09-05', parent_id: null },
    { user_id: 7, name: 'Mia Smith', email: 'mia@email.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2015-02-18', parent_id: 6, coach_id: 2 },
    { user_id: 8, name: 'Anna Belle', email: 'anna@funport.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2002-12-01', parent_id: null, coach_id: 3 },
];

const initialPrograms: Program[] = [
    { program_id: 1, title: 'Summer Weekly Program', description: 'Intensive training on weekdays.', schedule: 'Mon, Wed & Fri 3:30PM–6:00PM', coach_id: 2, price: 8000 },
    { program_id: 2, title: 'Weekend Sessions', description: 'Flexible weekend training.', schedule: 'Sat & Sun 3:30PM–6:00PM', coach_id: 3, price: 6000 },
];

const initialBookings: Booking[] = [
    { booking_id: 1, user_id: 4, program_id: 1, status: 'confirmed', booked_at: '2024-07-01T10:00:00Z' },
    { booking_id: 2, user_id: 6, program_id: 1, status: 'confirmed', booked_at: '2024-07-02T11:00:00Z' },
    { booking_id: 3, user_id: 8, program_id: 2, status: 'pending', booked_at: '2024-07-20T14:00:00Z' },
];

const initialAttendance: Attendance[] = [
    { attendance_id: 1, athlete_id: 5, program_id: 1, date: '2024-07-15', status: 'present' },
    { attendance_id: 2, athlete_id: 7, program_id: 1, date: '2024-07-15', status: 'present' },
    { attendance_id: 3, athlete_id: 5, program_id: 1, date: '2024-07-17', status: 'absent' },
    { attendance_id: 4, athlete_id: 7, program_id: 1, date: '2024-07-17', status: 'present' },
];

const initialProgress: Progress[] = [
    { progress_id: 1, athlete_id: 5, skill: 'Balance', level: 'intermediate', percentage: 80, updated_at: '2024-07-18T09:00:00Z' },
    { progress_id: 2, athlete_id: 5, skill: 'Gliding', level: 'beginner', percentage: 60, updated_at: '2024-07-18T09:00:00Z' },
    { progress_id: 3, athlete_id: 7, skill: 'Stopping', level: 'intermediate', percentage: 85, updated_at: '2024-07-18T09:00:00Z' },
    { progress_id: 4, athlete_id: 8, skill: 'Speed', level: 'advanced', percentage: 90, updated_at: '2024-07-19T09:00:00Z' },
];

const initialPayments: Payment[] = [
    { payment_id: 1, user_id: 4, booking_id: 1, amount: 8000, status: 'paid', paid_at: '2024-07-01T10:05:00Z' },
    { payment_id: 2, user_id: 6, booking_id: 2, amount: 8000, status: 'pending', paid_at: null },
    { payment_id: 3, user_id: 8, booking_id: 3, amount: 6000, status: 'pending', paid_at: null },
];

const initialAdminLogs: AdminLog[] = [
    { log_id: 1, admin_id: 1, action: 'User account created', target_id: 8, timestamp: '2024-07-15T12:00:00Z' },
];

// --- Components ---

const LoginPage = ({ onLogin, error }) => {
    const [email, setEmail] = useState('admin@funport.com');
    const [password, setPassword] = useState('password123');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">
                    <span className="funpot">funpot </span>
                    <span className="skating">SKATING</span>
                </h1>
                <p className="login-subtitle">Club Management Portal</p>
                <form onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Login</button>
                </form>
            </div>
        </div>
    );
};

const Header = ({ user, impersonatedUser, onLogout, onStopImpersonating }) => {
    const effectiveUser = impersonatedUser || user;
    return (
        <header className="dashboard-header-bar">
            {impersonatedUser && (
                <div className="impersonation-banner">
                    <ExclamationTriangleIcon/>
                    <p>Viewing as <strong>{impersonatedUser.name}</strong> ({impersonatedUser.role}).</p>
                    <button onClick={onStopImpersonating} className="btn btn-secondary btn-sm">Return to Admin View</button>
                </div>
            )}
            <div className="header-content">
                <div className="header-left">
                    <h2 className="header-title">
                        {effectiveUser.role} Dashboard
                    </h2>
                </div>
                <div className="header-right">
                    <span>Welcome, <strong>{user.name}</strong></span>
                    <button onClick={onLogout} className="btn-icon" aria-label="Logout">
                        <LogoutIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

const Sidebar = ({ user, onNavigate, activeView }) => {
    const sidebarLinks = {
      Admin: [
        { name: 'Dashboard', icon: ChartBarIcon, view: 'AdminDashboard' },
        { name: 'Users', icon: UserGroupIcon, view: 'UserManagement' },
        { name: 'Programs', icon: CalendarIcon, view: 'ProgramManagement' },
        { name: 'Payments', icon: CreditCardIcon, view: 'PaymentManagement' },
        { name: 'Audit Log', icon: DocumentTextIcon, view: 'AdminLog' },
      ],
      Coach: [
        { name: 'My Athletes', icon: UserGroupIcon, view: 'CoachDashboard' },
        { name: 'Schedule', icon: CalendarIcon, view: 'CoachSchedule' },
      ],
      Parent: [
        { name: 'My Children', icon: UserGroupIcon, view: 'ParentDashboard' },
        { name: 'Payments', icon: CreditCardIcon, view: 'ParentPayments' },
      ],
      Athlete: [
        { name: 'My Progress', icon: ChartBarIcon, view: 'AthleteDashboard' },
        { name: 'Schedule', icon: CalendarIcon, view: 'AthleteSchedule' },
      ],
    };
    
    const links = sidebarLinks[user.role] || [];
    
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="funpot">funpot </span>
                <span className="skating">SKATING</span>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {links.map(link => {
                        const Icon = link.icon;
                        return (
                            <li key={link.name}>
                                <a href="#" 
                                   onClick={(e) => { e.preventDefault(); onNavigate(link.view); }}
                                   className={activeView === link.view ? 'active' : ''}>
                                    <Icon />
                                    <span>{link.name}</span>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    );
};

// --- Modals ---
const UserFormModal = ({ isOpen, onClose, onSave, userToEdit, users }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Athlete', date_of_birth: '', parent_id: '', coach_id: '' });
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                role: userToEdit.role,
                date_of_birth: userToEdit.date_of_birth,
                parent_id: userToEdit.parent_id || '',
                coach_id: userToEdit.coach_id || '',
            });
        } else {
            setFormData({ name: '', email: '', role: 'Athlete', date_of_birth: '', parent_id: '', coach_id: '' });
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    
    const parents = users.filter(u => u.role === 'Parent');
    const coaches = users.filter(u => u.role === 'Coach');

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="close-btn"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Admin">Admin</option>
                            <option value="Coach">Coach</option>
                            <option value="Parent">Parent</option>
                            <option value="Athlete">Athlete</option>
                        </select>
                    </div>
                    {formData.role === 'Athlete' && (
                        <>
                            <div className="form-group">
                                <label>Link to Parent</label>
                                <select name="parent_id" value={formData.parent_id} onChange={handleChange}>
                                    <option value="">No Parent</option>
                                    {parents.map(p => <option key={p.user_id} value={p.user_id}>{p.name}</option>)}
                                </select>
                            </div>
                             <div className="form-group">
                                <label>Assign Coach</label>
                                <select name="coach_id" value={formData.coach_id} onChange={handleChange}>
                                    <option value="">No Coach</option>
                                    {coaches.map(c => <option key={c.user_id} value={c.user_id}>{c.name}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{userToEdit ? 'Save Changes' : 'Create User'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Dashboard Views ---

const AdminDashboard = ({ users, programs, payments }) => {
    const totalUsers = users.length;
    const activeAthletes = users.filter(u => u.role === 'Athlete').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    const StatCard = ({ title, value, icon: Icon }) => (
        <div className="stat-card">
            <div className="stat-icon"><Icon /></div>
            <div className="stat-content">
                <p className="stat-value">{value}</p>
                <p className="stat-title">{title}</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="stat-card-grid">
                <StatCard title="Total Users" value={totalUsers} icon={UserGroupIcon} />
                <StatCard title="Active Athletes" value={activeAthletes} icon={UserGroupIcon} />
                <StatCard title="Pending Payments" value={`KES ${pendingPayments.toLocaleString()}`} icon={CreditCardIcon} />
                <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={CreditCardIcon} />
            </div>
        </div>
    );
}

const UserManagement = ({ users, onImpersonate, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleOpenModal = (user: User | null = null) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleSave = (formData) => {
        if (userToEdit) {
            onEdit({ ...userToEdit, ...formData });
        } else {
            onAdd(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="view-header">
                <h1>User Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}><UserPlusIcon/> Add User</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                                <td className="action-cell">
                                    <button onClick={() => onImpersonate(user)} className="btn-icon" title="Impersonate"><EyeIcon/></button>
                                    <button onClick={() => handleOpenModal(user)} className="btn-icon" title="Edit"><PencilIcon/></button>
                                    <button onClick={() => onDelete(user.user_id)} className="btn-icon btn-danger" title="Delete"><TrashIcon/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} userToEdit={userToEdit} users={users}/>
        </div>
    );
};

const CoachDashboard = ({ coach, users, progress, onUpdateProgress }) => {
    const myAthletes = users.filter(u => u.role === 'Athlete' && u.coach_id === coach.user_id);
    
    return (
        <div>
            <div className="view-header"><h1>My Athletes</h1></div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Athlete</th>
                            <th>Skill</th>
                            <th>Progress</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myAthletes.map(athlete => {
                            const athleteProgress = progress.filter(p => p.athlete_id === athlete.user_id);
                            return athleteProgress.map((p, index) => (
                                <tr key={p.progress_id}>
                                    {index === 0 && <td rowSpan={athleteProgress.length}>{athlete.name}</td>}
                                    <td>{p.skill}</td>
                                    <td>
                                        <div className="progress-bar-table">
                                            <div className="progress-bar-fill" style={{ width: `${p.percentage}%` }}>{p.percentage}%</div>
                                        </div>
                                    </td>
                                    <td>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={p.percentage} 
                                            onChange={(e) => onUpdateProgress(p.progress_id, parseInt(e.target.value))}
                                        />
                                    </td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

const ProgressDisplay = ({ title, progressItems }) => (
     <div className="card customer-card">
        <h3>{title}</h3>
        <div className="progress-grid">
            {progressItems.map(p => (
                <div key={p.progress_id} className="progress-item">
                    <label>{p.skill} <span className="progress-level">({p.level})</span></label>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${p.percentage}%` }}>{p.percentage}%</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const AthleteDashboard = ({ athlete, progress }) => {
    const myProgress = progress.filter(p => p.athlete_id === athlete.user_id);
    return (
        <div>
             <div className="view-header"><h1>My Progress</h1></div>
             <ProgressDisplay title="Your Skill Development" progressItems={myProgress} />
        </div>
    )
};

const ParentDashboard = ({ parent, users, progress }) => {
    const children = users.filter(u => u.parent_id === parent.user_id);
    return (
        <div>
            <div className="view-header"><h1>My Children's Progress</h1></div>
            <div className="customer-dashboard-layout">
            {children.map(child => {
                const childProgress = progress.filter(p => p.athlete_id === child.user_id);
                return <ProgressDisplay key={child.user_id} title={`${child.name}'s Skills`} progressItems={childProgress} />
            })}
            </div>
        </div>
    )
}

const PaymentManagement = ({ payments, users }) => (
    <div>
        <div className="view-header"><h1>Payment Management</h1></div>
        <div className="table-container">
            <table>
                <thead>
                    <tr><th>User</th><th>Amount (KES)</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                    {payments.map(p => {
                        const user = users.find(u => u.user_id === p.user_id);
                        return (
                            <tr key={p.payment_id}>
                                <td>{user ? user.name : 'Unknown User'}</td>
                                <td>{p.amount.toLocaleString()}</td>
                                <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                                <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const AdminLogView = ({ logs, users }) => (
    <div>
        <div className="view-header"><h1>Admin Audit Log</h1></div>
        <div className="table-container">
            <table>
                <thead>
                    <tr><th>Admin</th><th>Action</th><th>Target ID</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                    {logs.map(log => {
                        const admin = users.find(u => u.user_id === log.admin_id);
                        return (
                            <tr key={log.log_id}>
                                <td>{admin ? admin.name : 'Unknown Admin'}</td>
                                <td>{log.action}</td>
                                <td>{log.target_id || 'N/A'}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);


const DashboardLayout = ({ user, impersonatedUser, onLogout, onStopImpersonating, data, handlers }) => {
    const [activeView, setActiveView] = useState('');

    const effectiveUser = impersonatedUser || user;

    useEffect(() => {
        // Set default view on user change
        const defaultViews = {
            Admin: 'AdminDashboard',
            Coach: 'CoachDashboard',
            Parent: 'ParentDashboard',
            Athlete: 'AthleteDashboard',
        };
        setActiveView(defaultViews[effectiveUser.role] || '');
    }, [effectiveUser]);

    const renderContent = () => {
        switch (activeView) {
            case 'AdminDashboard':
                return <AdminDashboard users={data.users} programs={data.programs} payments={data.payments}/>
            case 'UserManagement':
                return <UserManagement users={data.users} onImpersonate={handlers.impersonateUser} onAdd={handlers.addUser} onEdit={handlers.updateUser} onDelete={handlers.deleteUser} />;
            case 'CoachDashboard':
                return <CoachDashboard coach={effectiveUser} users={data.users} progress={data.progress} onUpdateProgress={handlers.updateProgress}/>;
            case 'ParentDashboard':
                return <ParentDashboard parent={effectiveUser} users={data.users} progress={data.progress} />;
            case 'AthleteDashboard':
                return <AthleteDashboard athlete={effectiveUser} progress={data.progress} />;
            case 'PaymentManagement':
                 return <PaymentManagement payments={data.payments} users={data.users} />;
            case 'AdminLog':
                 return <AdminLogView logs={data.adminLogs} users={data.users} />;
            default:
                return <div>Select a view from the sidebar.</div>;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar user={effectiveUser} onNavigate={setActiveView} activeView={activeView} />
            <div className="main-content">
                <Header user={user} impersonatedUser={impersonatedUser} onLogout={onLogout} onStopImpersonating={onStopImpersonating} />
                <main className="dashboard-content-area">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [impersonatedUser, setImpersonatedUser] = useLocalStorage<User | null>('impersonatedUser', null);
    const [loginError, setLoginError] = useState('');

    const [users, setUsers] = useLocalStorage<User[]>('fsc_users', initialUsers);
    const [programs, setPrograms] = useLocalStorage<Program[]>('fsc_programs', initialPrograms);
    const [bookings, setBookings] = useLocalStorage<Booking[]>('fsc_bookings', initialBookings);
    const [attendance, setAttendance] = useLocalStorage<Attendance[]>('fsc_attendance', initialAttendance);
    const [progress, setProgress] = useLocalStorage<Progress[]>('fsc_progress', initialProgress);
    const [payments, setPayments] = useLocalStorage<Payment[]>('fsc_payments', initialPayments);
    const [adminLogs, setAdminLogs] = useLocalStorage<AdminLog[]>('fsc_adminLogs', initialAdminLogs);

    const addAdminLog = (action: string, target_id?: number) => {
        if (currentUser && currentUser.role === 'Admin') {
            const newLog: AdminLog = {
                log_id: Date.now(),
                admin_id: currentUser.user_id,
                action,
                target_id,
                timestamp: new Date().toISOString(),
            };
            setAdminLogs(prev => [newLog, ...prev]);
        }
    };
    
    const handleLogin = (email, password) => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === password);
        if (user) {
            setCurrentUser(user);
            setLoginError('');
            addAdminLog('User login');
        } else {
            setLoginError("Invalid email or password.");
        }
    };

    const handleLogout = () => {
        addAdminLog('User logout');
        setCurrentUser(null);
        setImpersonatedUser(null);
    };

    const handleImpersonate = (userToImpersonate: User) => {
        if (currentUser && currentUser.role === 'Admin') {
            addAdminLog('Impersonated user', userToImpersonate.user_id);
            setImpersonatedUser(userToImpersonate);
        }
    };

    const handleStopImpersonating = () => {
        if(impersonatedUser) {
           addAdminLog('Stopped impersonating user', impersonatedUser.user_id);
           setImpersonatedUser(null);
        }
    };
    
    // --- CRUD Handlers ---
    const handleAddUser = (formData) => {
        const newUser: User = {
            user_id: Date.now(),
            name: formData.name,
            email: formData.email,
            password_hash: 'password123', // Default password
            role: formData.role,
            date_of_birth: formData.date_of_birth,
            parent_id: formData.parent_id ? Number(formData.parent_id) : null,
            coach_id: formData.coach_id ? Number(formData.coach_id) : undefined,
        };
        setUsers(prev => [...prev, newUser]);
        addAdminLog('Created user', newUser.user_id);
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
        addAdminLog('Updated user', updatedUser.user_id);
    };

    const handleDeleteUser = (userId: number) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setUsers(prev => prev.filter(u => u.user_id !== userId));
            addAdminLog('Deleted user', userId);
        }
    };
    
    const handleUpdateProgress = (progressId: number, newPercentage: number) => {
        setProgress(prev => prev.map(p => p.progress_id === progressId ? {...p, percentage: newPercentage, updated_at: new Date().toISOString()} : p));
    }


    const data = { users, programs, bookings, attendance, progress, payments, adminLogs };
    const handlers = {
        impersonateUser: handleImpersonate,
        addUser: handleAddUser,
        updateUser: handleUpdateUser,
        deleteUser: handleDeleteUser,
        updateProgress: handleUpdateProgress,
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} error={loginError} />;
    }

    return (
        <DashboardLayout
            user={currentUser}
            impersonatedUser={impersonatedUser}
            onLogout={handleLogout}
            onStopImpersonating={handleStopImpersonating}
            data={data}
            handlers={handlers}
        />
    );
};

export default App;
