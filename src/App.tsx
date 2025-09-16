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
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const EnvelopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;


// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';

interface User {
  user_id: number; name: string; email: string; password_hash: string; role: Role; date_of_birth: string; parent_id: number | null; coach_id?: number;
}
interface Program {
  program_id: number; title: string; description: string; schedule: string; coach_id: number; price: number; duration: string; skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}
interface Session {
    session_id: number; program_id: number; date: string; time: string; title: string; coach_id: number; athlete_ids: number[]; confirmed_athlete_ids: number[];
}
interface Booking {
  booking_id: number; user_id: number; program_id: number; status: 'pending' | 'confirmed' | 'cancelled'; booked_at: string;
}
interface Attendance {
    attendance_id: number; athlete_id: number; program_id: number; date: string; status: 'present' | 'absent';
}
interface Progress {
    progress_id: number; athlete_id: number; skill: string; level: 'beginner' | 'intermediate' | 'advanced'; percentage: number; updated_at: string;
}
interface Payment {
    payment_id: number; user_id: number; booking_id: number; amount: number; status: 'paid' | 'pending' | 'failed'; paid_at: string | null;
}
interface AdminLog {
    log_id: number; admin_id: number; action: string; target_id?: number; timestamp: string;
}
interface Reminder {
    reminder_id: number; session_id: number; user_id: number; remind_at: number; // timestamp
}
interface Notification {
    notification_id: number; user_id: number; text: string; type: 'reminder' | 'confirmation'; created_at: number;
}
interface Message {
  message_id: number;
  user_id: number;
  subject: string;
  body: string;
  sent_at: string;
}
type Toast = { id: number; message: string; type: 'success' | 'error'; };

// --- Data Simulation & Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue;
        } catch (error) { console.error(error); return initialValue; }
    });
    const setValue = (value: SetStateAction<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore); window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) { console.error(error); }
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
    { program_id: 1, title: 'Summer Weekly Program', description: 'Intensive training on weekdays.', schedule: 'Mon, Wed & Fri 3:30PM–6:00PM', coach_id: 2, price: 8000, duration: '8 Weeks', skillLevel: 'Intermediate' },
    { program_id: 2, title: 'Weekend Sessions', description: 'Flexible weekend training.', schedule: 'Sat & Sun 3:30PM–6:00PM', coach_id: 3, price: 6000, duration: 'Ongoing', skillLevel: 'All Levels' },
];
const initialBookings: Booking[] = [
    { booking_id: 1, user_id: 4, program_id: 1, status: 'confirmed', booked_at: '2024-07-01T10:00:00Z' }, { booking_id: 2, user_id: 6, program_id: 1, status: 'confirmed', booked_at: '2024-07-02T11:00:00Z' }, { booking_id: 3, user_id: 8, program_id: 2, status: 'pending', booked_at: '2024-07-20T14:00:00Z' },
];
const initialProgress: Progress[] = [
    { progress_id: 1, athlete_id: 5, skill: 'Balance', level: 'intermediate', percentage: 80, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 2, athlete_id: 5, skill: 'Gliding', level: 'beginner', percentage: 60, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 3, athlete_id: 7, skill: 'Stopping', level: 'intermediate', percentage: 85, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 4, athlete_id: 8, skill: 'Speed', level: 'advanced', percentage: 90, updated_at: '2024-07-19T09:00:00Z' },
];
const initialPayments: Payment[] = [
    { payment_id: 1, user_id: 4, booking_id: 1, amount: 8000, status: 'paid', paid_at: '2024-07-01T10:05:00Z' }, { payment_id: 2, user_id: 6, booking_id: 2, amount: 8000, status: 'pending', paid_at: null }, { payment_id: 3, user_id: 8, booking_id: 3, amount: 6000, status: 'pending', paid_at: null },
];
const initialAdminLogs: AdminLog[] = [{ log_id: 1, admin_id: 1, action: 'User account created', target_id: 8, timestamp: '2024-07-15T12:00:00Z' }];
const initialSessions: Session[] = [
    { session_id: 1, program_id: 1, date: '2024-08-12', time: '16:00', title: 'Leo D. - Gliding', coach_id: 2, athlete_ids: [5], confirmed_athlete_ids: [] },
    { session_id: 2, program_id: 1, date: '2024-08-12', time: '17:00', title: 'Mia S. - Stopping', coach_id: 2, athlete_ids: [7], confirmed_athlete_ids: [7] },
    { session_id: 3, program_id: 1, date: '2024-08-14', time: '16:30', title: 'Group Session', coach_id: 2, athlete_ids: [5, 7], confirmed_athlete_ids: [7] },
    { session_id: 4, program_id: 2, date: '2024-08-17', time: '15:30', title: 'Anna B. - Speed', coach_id: 3, athlete_ids: [8], confirmed_athlete_ids: [] },
    { session_id: 5, program_id: 2, date: '2024-08-18', time: '16:00', title: 'Group Session', coach_id: 3, athlete_ids: [8], confirmed_athlete_ids: [] },
];

// --- Components ---
const LoginPage = ({ onLogin, error }) => {
    const [email, setEmail] = useState('admin@funport.com'); const [password, setPassword] = useState('password123');
    const handleSubmit = (e) => { e.preventDefault(); onLogin(email, password); };
    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title"><span className="funpot">funpot </span><span className="skating">SKATING</span></h1>
                <p className="login-subtitle">Club Management Portal</p>
                <form onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                    <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                    <button type="submit" className="btn btn-primary btn-full">Login</button>
                </form>
            </div>
        </div>
    );
};
const Header = ({ user, impersonatedUser, onLogout, onStopImpersonating, notifications, onDismissNotification }) => {
    const effectiveUser = impersonatedUser || user;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const notificationRef = useRef(null);
    const userNotifications = notifications.filter(n => n.user_id === effectiveUser.user_id);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="dashboard-header-bar">
            {impersonatedUser && (<div className="impersonation-banner"><ExclamationTriangleIcon/><p>Viewing as <strong>{impersonatedUser.name}</strong> ({impersonatedUser.role}).</p><button onClick={onStopImpersonating} className="btn btn-secondary btn-sm">Return to Admin View</button></div>)}
            <div className="header-content">
                <div className="header-left"><h2 className="header-title">{effectiveUser.role} Dashboard</h2></div>
                <div className="header-right">
                    <div className="notification-bell" ref={notificationRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="btn-icon" aria-label="Notifications">
                            <BellIcon />
                            {userNotifications.length > 0 && <span className="notification-badge">{userNotifications.length}</span>}
                        </button>
                        {isDropdownOpen && (
                            <div className="notification-dropdown">
                                <div className="notification-header">Notifications</div>
                                {userNotifications.length > 0 ? (
                                    userNotifications.map(n => (
                                        <div key={n.notification_id} className="notification-item">
                                            <p>{n.text}</p>
                                            <button onClick={() => onDismissNotification(n.notification_id)} className="btn-icon btn-dismiss" title="Dismiss"><CloseIcon /></button>
                                        </div>
                                    ))
                                ) : ( <div className="notification-empty">No new notifications</div> )}
                            </div>
                        )}
                    </div>
                    <span>Welcome, <strong>{user.name}</strong></span>
                    <button onClick={onLogout} className="btn-icon" aria-label="Logout"><LogoutIcon /></button>
                </div>
            </div>
        </header>
    );
};
const Sidebar = ({ user, onNavigate, activeView }) => {
    const sidebarLinks = {
      Admin: [ { name: 'Dashboard', icon: ChartBarIcon, view: 'AdminDashboard' }, { name: 'Users', icon: UserGroupIcon, view: 'UserManagement' }, { name: 'Programs', icon: CalendarIcon, view: 'ProgramManagement' }, { name: 'Payments', icon: CreditCardIcon, view: 'PaymentManagement' }, { name: 'Messages', icon: EnvelopeIcon, view: 'MessagesView' }, { name: 'Audit Log', icon: DocumentTextIcon, view: 'AdminLog' }, ],
      Coach: [ { name: 'My Athletes', icon: UserGroupIcon, view: 'CoachDashboard' }, { name: 'Calendar', icon: CalendarIcon, view: 'CalendarView' }, { name: 'Contact Admin', icon: EnvelopeIcon, view: 'ContactUs' } ],
      Parent: [ { name: 'My Children', icon: UserGroupIcon, view: 'ParentDashboard' }, { name: 'Schedule', icon: CalendarIcon, view: 'ScheduleView' }, { name: 'Payments', icon: CreditCardIcon, view: 'ParentPayments' }, { name: 'Contact Admin', icon: EnvelopeIcon, view: 'ContactUs' } ],
      Athlete: [ { name: 'My Progress', icon: ChartBarIcon, view: 'AthleteDashboard' }, { name: 'Schedule', icon: CalendarIcon, view: 'ScheduleView' }, { name: 'Contact Admin', icon: EnvelopeIcon, view: 'ContactUs' } ],
    };
    const links = sidebarLinks[user.role] || [];
    return (
        <aside className="sidebar">
            <div className="sidebar-header"><span className="funpot">funpot </span><span className="skating">SKATING</span></div>
            <nav className="sidebar-nav"><ul>{links.map(link => { const Icon = link.icon; return (<li key={link.name}><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(link.view); }} className={activeView === link.view ? 'active' : ''}><Icon /><span>{link.name}</span></a></li>)})}</ul></nav>
        </aside>
    );
};
// --- Modals ---
const UserFormModal = ({ isOpen, onClose, onSave, userToEdit, users }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Athlete', date_of_birth: '', parent_id: '', coach_id: '' });
    const modalContentRef = useRef(null);
    useEffect(() => {
        if (userToEdit) setFormData({ name: userToEdit.name, email: userToEdit.email, role: userToEdit.role, date_of_birth: userToEdit.date_of_birth, parent_id: userToEdit.parent_id || '', coach_id: userToEdit.coach_id || '', });
        else setFormData({ name: '', email: '', role: 'Athlete', date_of_birth: '', parent_id: '', coach_id: '' });
    }, [userToEdit, isOpen]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    useEffect(() => {
        const handleClickOutside = (event) => { if (modalContentRef.current && !modalContentRef.current.contains(event.target)) onClose(); };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    const parents = users.filter(u => u.role === 'Parent'); const coaches = users.filter(u => u.role === 'Coach');
    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header"><h2>{userToEdit ? 'Edit User' : 'Add New User'}</h2><button onClick={onClose} className="close-btn"><CloseIcon /></button></div>
                <form onSubmit={handleSubmit}><div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div><div className="form-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div><div className="form-group"><label>Date of Birth</label><input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required /></div><div className="form-group"><label>Role</label><select name="role" value={formData.role} onChange={handleChange}><option value="Admin">Admin</option><option value="Coach">Coach</option><option value="Parent">Parent</option><option value="Athlete">Athlete</option></select></div>
                    {formData.role === 'Athlete' && (<><div className="form-group"><label>Link to Parent</label><select name="parent_id" value={formData.parent_id} onChange={handleChange}><option value="">No Parent</option>{parents.map(p => <option key={p.user_id} value={p.user_id}>{p.name}</option>)}</select></div><div className="form-group"><label>Assign Coach</label><select name="coach_id" value={formData.coach_id} onChange={handleChange}><option value="">No Coach</option>{coaches.map(c => <option key={c.user_id} value={c.user_id}>{c.name}</option>)}</select></div></>)}
                    <div className="form-actions"><button type="submit" className="btn btn-primary">{userToEdit ? 'Save Changes' : 'Create User'}</button></div>
                </form>
            </div>
        </div>
    );
};
const ProgramFormModal = ({ isOpen, onClose, onSave, programToEdit, coaches }) => {
    const initialFormState = { title: '', description: '', schedule: '', coach_id: '', price: '', duration: '', skillLevel: 'All Levels' };
    const [formData, setFormData] = useState(initialFormState);
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (programToEdit) {
            setFormData({ ...initialFormState, ...programToEdit, price: programToEdit.price.toString(), coach_id: programToEdit.coach_id.toString() });
        } else {
            setFormData(initialFormState);
        }
    }, [programToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, price: parseFloat(formData.price) || 0, coach_id: parseInt(formData.coach_id, 10) });
    };

    useEffect(() => {
        const handleClickOutside = (event) => { if (modalContentRef.current && !modalContentRef.current.contains(event.target)) onClose(); };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header"><h2>{programToEdit ? 'Edit Program' : 'Add New Program'}</h2><button onClick={onClose} className="close-btn"><CloseIcon /></button></div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={3}></textarea></div>
                    <div className="form-group"><label>Schedule</label><input type="text" name="schedule" value={formData.schedule} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Duration</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g., 8 Weeks"/></div>
                    <div className="form-group"><label>Price (KES)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Skill Level</label><select name="skillLevel" value={formData.skillLevel} onChange={handleChange}><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option><option value="All Levels">All Levels</option></select></div>
                    <div className="form-group"><label>Assign Coach</label><select name="coach_id" value={formData.coach_id} onChange={handleChange} required><option value="" disabled>Select a coach</option>{coaches.map(c => <option key={c.user_id} value={c.user_id}>{c.name}</option>)}</select></div>
                    <div className="form-actions"><button type="submit" className="btn btn-primary">{programToEdit ? 'Save Changes' : 'Create Program'}</button></div>
                </form>
            </div>
        </div>
    );
};
const ReminderModal = ({ isOpen, onClose, onSave, session }) => {
    const [reminderTime, setReminderTime] = useState('60'); // default to 1 hour
    const modalContentRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => { if (modalContentRef.current && !modalContentRef.current.contains(event.target)) onClose(); };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    if (!isOpen || !session) return null;
    const handleSubmit = (e) => { e.preventDefault(); onSave(session.session_id, parseInt(reminderTime, 10)); };
    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header"><h2>Set Reminder for {session.title}</h2><button onClick={onClose} className="close-btn"><CloseIcon /></button></div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Notify me before the session:</label>
                        <select value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}>
                            <option value="15">15 minutes before</option>
                            <option value="60">1 hour before</option>
                            <option value="1440">1 day before</option>
                        </select>
                    </div>
                    <div className="form-actions"><button type="submit" className="btn btn-primary">Set Reminder</button></div>
                </form>
            </div>
        </div>
    );
};
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    const modalContentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-btn"><CloseIcon /></button>
                </div>
                <div className="confirmation-modal-body">{children}</div>
                <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className="btn btn-primary">Confirm</button>
                </div>
            </div>
        </div>
    );
};
// --- Dashboard Views ---
const AdminDashboard = ({ users, programs, payments }) => {
    const totalUsers = users.length; const activeAthletes = users.filter(u => u.role === 'Athlete').length; const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0); const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const StatCard = ({ title, value, icon: Icon }) => (<div className="stat-card"><div className="stat-icon"><Icon /></div><div className="stat-content"><p className="stat-value">{value}</p><p className="stat-title">{title}</p></div></div>);
    return (<div><div className="stat-card-grid"><StatCard title="Total Users" value={totalUsers} icon={UserGroupIcon} /><StatCard title="Active Athletes" value={activeAthletes} icon={UserGroupIcon} /><StatCard title="Pending Payments" value={`KES ${pendingPayments.toLocaleString()}`} icon={CreditCardIcon} /><StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={CreditCardIcon} /></div></div>);
}
const UserManagement = ({ users, onImpersonate, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const handleOpenModal = (user: User | null = null) => { setUserToEdit(user); setIsModalOpen(true); };
    const handleSave = (formData) => { if (userToEdit) onEdit({ ...userToEdit, ...formData }); else onAdd(formData); setIsModalOpen(false); };
    return (<div><div className="view-header"><h1>User Management</h1><button className="btn btn-primary" onClick={() => handleOpenModal()}><UserPlusIcon/> Add User</button></div><div className="table-container"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map(user => (<tr key={user.user_id}><td>{user.name}</td><td>{user.email}</td><td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td><td className="action-cell"><button onClick={() => onImpersonate(user)} className="btn-icon" title="Impersonate"><EyeIcon/></button><button onClick={() => handleOpenModal(user)} className="btn-icon" title="Edit"><PencilIcon/></button><button onClick={() => onDelete(user.user_id)} className="btn-icon btn-danger" title="Delete"><TrashIcon/></button></td></tr>))}</tbody></table></div><UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} userToEdit={userToEdit} users={users}/></div>);
};
const ProgramManagement = ({ programs, users, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [programToEdit, setProgramToEdit] = useState<Program | null>(null);
    const coaches = users.filter(u => u.role === 'Coach');

    const handleOpenModal = (program: Program | null = null) => {
        setProgramToEdit(program);
        setIsModalOpen(true);
    };

    const handleSave = (formData) => {
        if (programToEdit) {
            onEdit({ ...programToEdit, ...formData });
        } else {
            onAdd(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="view-header">
                <h1>Program Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <PlusCircleIcon /> Add Program
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Coach</th>
                            <th>Schedule</th>
                            <th>Duration</th>
                            <th>Skill Level</th>
                            <th>Price (KES)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => {
                            const coach = users.find(u => u.user_id === program.coach_id);
                            const skillLevelClass = program.skillLevel.toLowerCase().replace(' ', '-');
                            return (
                                <tr key={program.program_id}>
                                    <td>{program.title}</td>
                                    <td>{coach ? coach.name : 'N/A'}</td>
                                    <td>{program.schedule}</td>
                                    <td>{program.duration}</td>
                                    <td><span className={`skill-badge skill-${skillLevelClass}`}>{program.skillLevel}</span></td>
                                    <td>{program.price.toLocaleString()}</td>
                                    <td className="action-cell">
                                        <button onClick={() => handleOpenModal(program)} className="btn-icon" title="Edit"><PencilIcon /></button>
                                        <button onClick={() => onDelete(program.program_id)} className="btn-icon btn-danger" title="Delete"><TrashIcon /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <ProgramFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} programToEdit={programToEdit} coaches={coaches} />
        </div>
    );
};
const CoachDashboard = ({ coach, users, progress, onUpdateProgress }) => {
    const myAthletes = users.filter(u => u.role === 'Athlete' && u.coach_id === coach.user_id);
    return (<div><div className="view-header"><h1>My Athletes</h1></div><div className="table-container"><table><thead><tr><th>Athlete</th><th>Skill</th><th>Progress</th><th>Actions</th></tr></thead><tbody>{myAthletes.length === 0 ? (<tr><td colSpan={4} style={{textAlign: 'center'}}>You have no assigned athletes.</td></tr>) : myAthletes.map(athlete => { const athleteProgress = progress.filter(p => p.athlete_id === athlete.user_id); return athleteProgress.map((p, index) => (<tr key={p.progress_id}>{index === 0 && <td rowSpan={athleteProgress.length}>{athlete.name}</td>}<td>{p.skill}</td><td><div className="progress-bar-table"><div className="progress-bar-fill" style={{ width: `${p.percentage}%` }}>{p.percentage}%</div></div></td><td><input type="range" min="0" max="100" value={p.percentage} onChange={(e) => onUpdateProgress(p.progress_id, parseInt(e.target.value))}/></td></tr>))})}</tbody></table></div></div>)
};
const ProgressDisplay = ({ title, progressItems }) => (<div className="card customer-card"><h3>{title}</h3>{progressItems.length === 0 ? (<p>No progress to display.</p>) : (<div className="progress-grid">{progressItems.map(p => (<div key={p.progress_id} className="progress-item"><label>{p.skill} <span className="progress-level">({p.level})</span></label><div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${p.percentage}%` }}>{p.percentage}%</div></div></div>))}</div>)}</div>);
const AthleteDashboard = ({ athlete, progress }) => { const myProgress = progress.filter(p => p.athlete_id === athlete.user_id); return (<div><div className="view-header"><h1>My Progress</h1></div><ProgressDisplay title="Your Skill Development" progressItems={myProgress} /></div>)};
const ParentDashboard = ({ parent, users, progress }) => {
    const children = users.filter(u => u.parent_id === parent.user_id);
    return (<div><div className="view-header"><h1>My Children's Progress</h1></div><div className="customer-dashboard-layout">{children.length === 0 ? (<p>No children linked to this account.</p>) : children.map(child => { const childProgress = progress.filter(p => p.athlete_id === child.user_id); return <ProgressDisplay key={child.user_id} title={`${child.name}'s Skills`} progressItems={childProgress} /> })}</div></div>)
}
const PaymentManagement = ({ payments, users }) => (<div><div className="view-header"><h1>Payment Management</h1></div><div className="table-container"><table><thead><tr><th>User</th><th>Amount (KES)</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map(p => { const user = users.find(u => u.user_id === p.user_id); return (<tr key={p.payment_id}><td>{user ? user.name : 'Unknown User'}</td><td>{p.amount.toLocaleString()}</td><td><span className={`status-badge status-${p.status}`}>{p.status}</span></td><td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'N/A'}</td></tr>); })}</tbody></table></div></div>);
const AdminLogView = ({ logs, users }) => (<div><div className="view-header"><h1>Admin Audit Log</h1></div><div className="table-container"><table><thead><tr><th>Admin</th><th>Action</th><th>Target ID</th><th>Timestamp</th></tr></thead><tbody>{logs.map(log => { const admin = users.find(u => u.user_id === log.admin_id); return (<tr key={log.log_id}><td>{admin ? admin.name : 'Unknown Admin'}</td><td>{log.action}</td><td>{log.target_id || 'N/A'}</td><td>{new Date(log.timestamp).toLocaleString()}</td></tr>); })}</tbody></table></div></div>);
const ScheduleView = ({ user, sessions, users, onConfirmBooking, onSetReminder }) => {
    const getAthleteId = () => user.role === 'Athlete' ? user.user_id : null;
    const getChildrenIds = () => user.role === 'Parent' ? users.filter(u => u.parent_id === user.user_id).map(c => c.user_id) : [];

    const userAthleteId = getAthleteId();
    const childrenIds = getChildrenIds();

    const upcomingSessions = sessions
        .filter(s => new Date(s.date) >= new Date())
        .filter(s => {
            if (user.role === 'Athlete') return s.athlete_ids.includes(userAthleteId);
            if (user.role === 'Parent') return s.athlete_ids.some(id => childrenIds.includes(id));
            return false;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div>
            <div className="view-header"><h1>My Schedule</h1></div>
            <div className="schedule-list">
                {upcomingSessions.length === 0 ? (<p>No upcoming sessions.</p>) : upcomingSessions.map(session => {
                    const athleteForSession = user.role === 'Athlete' ? user : users.find(u => session.athlete_ids.includes(u.user_id) && childrenIds.includes(u.user_id));
                    if (!athleteForSession) return null;

                    const isConfirmed = session.confirmed_athlete_ids.includes(athleteForSession.user_id);
                    return (
                        <div className="schedule-item" key={session.session_id}>
                            <div className="schedule-item-date">
                                <span>{new Date(session.date).toLocaleString('en-US', { month: 'short' })}</span>
                                <span>{new Date(session.date).getDate()}</span>
                            </div>
                            <div className="schedule-item-info">
                                <h4>{session.title} {user.role === 'Parent' && `(${athleteForSession.name})`}</h4>
                                <p>{new Date(session.date).toLocaleDateString([], { weekday: 'long' })} at {session.time}</p>
                            </div>
                            <div className="schedule-item-actions">
                                {isConfirmed ? (
                                    <span className="status-badge status-confirmed"><CheckCircleIcon/> Confirmed</span>
                                ) : (
                                    <button className="btn btn-primary btn-sm" onClick={() => onConfirmBooking(session.session_id, athleteForSession.user_id)}>Confirm Booking</button>
                                )}
                                <button className="btn btn-secondary btn-sm" onClick={() => onSetReminder(session)}><ClockIcon/> Set Reminder</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
const CalendarView = ({ coach, sessions, users, onSetReminder }) => {
    const [viewMode, setViewMode] = useState('Month'); // Month, Week, Day
    const [currentDate, setCurrentDate] = useState(new Date());

    const athleteColorMap = useRef({});
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const getAthleteColor = (athleteId) => {
        if (!athleteColorMap.current[athleteId]) {
            athleteColorMap.current[athleteId] = colors[Object.keys(athleteColorMap.current).length % colors.length];
        }
        return athleteColorMap.current[athleteId];
    };
    
    const coachSessions = sessions.filter(s => s.coach_id === coach.user_id);

    const renderHeader = () => {
        const dateFormat = viewMode === 'Month' ? 'MMMM yyyy' : (viewMode === 'Week' ? 'MMMM d, yyyy' : 'MMMM d, yyyy');
        const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: viewMode !== 'Month' ? 'numeric' : undefined }).format(currentDate);

        const changeDate = (amount) => {
            const newDate = new Date(currentDate);
            if(viewMode === 'Month') newDate.setMonth(newDate.getMonth() + amount);
            if(viewMode === 'Week') newDate.setDate(newDate.getDate() + (amount * 7));
            if(viewMode === 'Day') newDate.setDate(newDate.getDate() + amount);
            setCurrentDate(newDate);
        };

        return (
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button onClick={() => changeDate(-1)}>‹</button>
                    <h2>{formattedDate}</h2>
                    <button onClick={() => changeDate(1)}>›</button>
                </div>
                <div className="calendar-view-switcher">
                    <button onClick={() => setViewMode('Month')} className={viewMode === 'Month' ? 'active' : ''}>Month</button>
                    <button onClick={() => setViewMode('Week')} className={viewMode === 'Week' ? 'active' : ''}>Week</button>
                    <button onClick={() => setViewMode('Day')} className={viewMode === 'Day' ? 'active' : ''}>Day</button>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
        
        const days = [];
        let day = new Date(startDate);
        while(day <= endDate) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <>
                <div className="calendar-days-header">{dayNames.map(d => <div key={d}>{d}</div>)}</div>
                <div className="calendar-grid-month">
                    {days.map(d => {
                        const sessionsOnDay = coachSessions.filter(s => new Date(s.date).toDateString() === d.toDateString());
                        const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                        return (
                            <div key={d.toString()} className={`calendar-day ${isCurrentMonth ? '' : 'other-month'}`}>
                                <span className="day-number">{d.getDate()}</span>
                                <div className="sessions-container">
                                {sessionsOnDay.map(s => (
                                    <div key={s.session_id} className="calendar-event" style={{borderColor: s.athlete_ids.length > 1 ? '#8B5CF6' : getAthleteColor(s.athlete_ids[0])}}>
                                        <p>{s.time} {s.title}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    };

    const renderWeekView = () => {
         const weekStart = new Date(currentDate);
         weekStart.setDate(weekStart.getDate() - weekStart.getDay());
         const days = Array.from({length: 7}).map((_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
         });
         return <div className="calendar-grid-week">{days.map(d => {
             const sessionsOnDay = coachSessions.filter(s => new Date(s.date).toDateString() === d.toDateString());
             return (<div key={d.toString()} className="calendar-day-week">
                <h4>{d.toLocaleDateString([], {weekday: 'short', day: 'numeric'})}</h4>
                {sessionsOnDay.map(s => <div key={s.session_id} className="calendar-event" style={{borderColor: s.athlete_ids.length > 1 ? '#8B5CF6' : getAthleteColor(s.athlete_ids[0])}}><p>{s.time} {s.title}</p></div>)}
             </div>)
         })}</div>
    };
    const renderDayView = () => {
        const sessionsOnDay = coachSessions.filter(s => new Date(s.date).toDateString() === currentDate.toDateString());
        return <div className="calendar-grid-day">
            {sessionsOnDay.map(s => <div key={s.session_id} className="calendar-event" style={{borderColor: s.athlete_ids.length > 1 ? '#8B5CF6' : getAthleteColor(s.athlete_ids[0])}}><p>{s.time} {s.title}</p></div>)}
        </div>
    };

    return (<div className="calendar-container">{renderHeader()}{viewMode === 'Month' ? renderMonthView() : viewMode === 'Week' ? renderWeekView() : renderDayView()}</div>);
};
const MessagesView = ({ messages, users }) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    return (
        <div>
            <div className="view-header"><h1>Inbox</h1></div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>From</th><th>Subject</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center' }}>No messages found.</td></tr>
                        ) : (
                            messages.map(msg => {
                                const sender = users.find(u => u.user_id === msg.user_id);
                                return (
                                    <React.Fragment key={msg.message_id}>
                                        <tr>
                                            <td>{sender ? sender.name : 'Unknown User'}</td>
                                            <td>{msg.subject}</td>
                                            <td>{new Date(msg.sent_at).toLocaleString()}</td>
                                            <td className="action-cell">
                                                <button onClick={() => setSelectedMessage(selectedMessage?.message_id === msg.message_id ? null : msg)} className="btn btn-secondary btn-sm">
                                                    {selectedMessage?.message_id === msg.message_id ? 'Hide' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                        {selectedMessage?.message_id === msg.message_id && (
                                            <tr className="message-body-row">
                                                <td colSpan={4}>
                                                    <div className="message-body-content"><p>{selectedMessage.body}</p></div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const ContactUs = ({ onSendMessage, addToast }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) {
            addToast("Please fill out both subject and message.", 'error');
            return;
        }
        onSendMessage(subject, body);
        setSubject('');
        setBody('');
    };

    return (
        <div>
            <div className="view-header"><h1>Contact Admin</h1></div>
            <div className="card customer-card">
                <h3>Send a Message</h3>
                <p>If you have any questions or concerns, please send us a message below.</p>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body">Message</label>
                        <textarea id="body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} required ></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const ToastContainer = ({ toasts, removeToast }) => (
    <div className="toast-container">
        {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
                {toast.message}
                <button onClick={() => removeToast(toast.id)} className="close-btn"><CloseIcon /></button>
            </div>
        ))}
    </div>
);

const DashboardLayout = ({ user, impersonatedUser, onLogout, onStopImpersonating, data, handlers }) => {
    const [activeView, setActiveView] = useState('');
    const effectiveUser = impersonatedUser || user;

    useEffect(() => {
        const defaultViews = { Admin: 'AdminDashboard', Coach: 'CoachDashboard', Parent: 'ParentDashboard', Athlete: 'AthleteDashboard', };
        setActiveView(defaultViews[effectiveUser.role] || '');
    }, [effectiveUser]);

    const renderContent = () => {
        switch (activeView) {
            case 'AdminDashboard': return <AdminDashboard users={data.users} programs={data.programs} payments={data.payments}/>
            case 'UserManagement': return <UserManagement users={data.users} onImpersonate={handlers.impersonateUser} onAdd={handlers.addUser} onEdit={handlers.updateUser} onDelete={handlers.deleteUser} />;
            case 'ProgramManagement': return <ProgramManagement programs={data.programs} users={data.users} onAdd={handlers.addProgram} onEdit={handlers.updateProgram} onDelete={handlers.deleteProgram} />;
            case 'CoachDashboard': return <CoachDashboard coach={effectiveUser} users={data.users} progress={data.progress} onUpdateProgress={handlers.updateProgress}/>;
            case 'ParentDashboard': return <ParentDashboard parent={effectiveUser} users={data.users} progress={data.progress} />;
            case 'AthleteDashboard': return <AthleteDashboard athlete={effectiveUser} progress={data.progress} />;
            case 'PaymentManagement': return <PaymentManagement payments={data.payments} users={data.users} />;
            case 'AdminLog': return <AdminLogView logs={data.adminLogs} users={data.users} />;
            case 'ScheduleView': return <ScheduleView user={effectiveUser} sessions={data.sessions} users={data.users} onConfirmBooking={handlers.confirmBooking} onSetReminder={handlers.openReminderModal}/>;
            case 'CalendarView': return <CalendarView coach={effectiveUser} sessions={data.sessions} users={data.users} onSetReminder={handlers.openReminderModal}/>;
            case 'MessagesView': return <MessagesView messages={data.messages} users={data.users} />;
            case 'ContactUs': return <ContactUs onSendMessage={handlers.sendMessage} addToast={handlers.addToast} />;
            default: return <div>Select a view from the sidebar.</div>;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar user={effectiveUser} onNavigate={setActiveView} activeView={activeView} />
            <div className="main-content">
                <Header user={user} impersonatedUser={impersonatedUser} onLogout={onLogout} onStopImpersonating={onStopImpersonating} notifications={data.notifications} onDismissNotification={handlers.dismissNotification} />
                <main className="dashboard-content-area">{renderContent()}</main>
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
    const [progress, setProgress] = useLocalStorage<Progress[]>('fsc_progress', initialProgress);
    const [payments, setPayments] = useLocalStorage<Payment[]>('fsc_payments', initialPayments);
    const [adminLogs, setAdminLogs] = useLocalStorage<AdminLog[]>('fsc_adminLogs', initialAdminLogs);
    const [sessions, setSessions] = useLocalStorage<Session[]>('fsc_sessions', initialSessions);
    const [reminders, setReminders] = useLocalStorage<Reminder[]>('fsc_reminders', []);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('fsc_notifications', []);
    const [messages, setMessages] = useLocalStorage<Message[]>('fsc_messages', []);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [sessionForReminder, setSessionForReminder] = useState<Session | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ onConfirm: () => void } | null>(null);
    const [confirmModalContent, setConfirmModalContent] = useState({ title: '', body: '' });

    const openConfirmationModal = (title, body, onConfirm) => {
        setConfirmModalContent({ title, body });
        setConfirmAction({ onConfirm });
        setIsConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        if (confirmAction && typeof confirmAction.onConfirm === 'function') {
            confirmAction.onConfirm();
        }
        setIsConfirmModalOpen(false);
        setConfirmAction(null);
    };

    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };
    const removeToast = (id: number) => setToasts(prev => prev.filter(t => t && t.id !== id));

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const dueReminders = reminders.filter(r => r.remind_at <= now);
            if (dueReminders.length > 0) {
                const newNotifications = dueReminders.map(r => {
                    const session = sessions.find(s => s.session_id === r.session_id);
                    return {
                        notification_id: Date.now() + r.reminder_id, user_id: r.user_id, text: `Reminder: ${session?.title} is starting soon.`, type: 'reminder' as 'reminder', created_at: now
                    };
                });
                setNotifications(prev => [...prev, ...newNotifications]);
                setReminders(prev => prev.filter(r => !dueReminders.some(dr => dr.reminder_id === r.reminder_id)));
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [reminders, sessions, setNotifications, setReminders]);
    
    const addAdminLog = (action: string, target_id?: number) => { if (currentUser && currentUser.role === 'Admin') { const newLog: AdminLog = { log_id: Date.now(), admin_id: currentUser.user_id, action, target_id, timestamp: new Date().toISOString(), }; setAdminLogs(prev => [newLog, ...prev]); }};
    const handleLogin = (email, password) => { const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === password); if (user) { setCurrentUser(user); setLoginError(''); addAdminLog('User login'); } else { setLoginError("Invalid email or password."); } };
    const handleLogout = () => { addAdminLog('User logout'); setCurrentUser(null); setImpersonatedUser(null); };
    const handleImpersonate = (userToImpersonate: User) => { if (currentUser && currentUser.role === 'Admin') { addAdminLog('Impersonated user', userToImpersonate.user_id); setImpersonatedUser(userToImpersonate); }};
    const handleStopImpersonating = () => { if(impersonatedUser) { addAdminLog('Stopped impersonating user', impersonatedUser.user_id); setImpersonatedUser(null); }};
    const handleAddUser = (formData) => { const newUser: User = { user_id: Date.now(), name: formData.name, email: formData.email, password_hash: 'password123', role: formData.role, date_of_birth: formData.date_of_birth, parent_id: formData.parent_id ? Number(formData.parent_id) : null, coach_id: formData.coach_id ? Number(formData.coach_id) : undefined, }; setUsers(prev => [...prev, newUser]); addAdminLog('Created user', newUser.user_id); addToast('User created successfully.'); };
    const handleUpdateUser = (updatedUser: User) => { setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u)); addAdminLog('Updated user', updatedUser.user_id); addToast('User updated successfully.'); };
    const handleDeleteUser = (userId: number) => { openConfirmationModal('Delete User', 'Are you sure you want to delete this user? This action cannot be undone.', () => { setUsers(prev => prev.filter(u => u.user_id !== userId)); addAdminLog('Deleted user', userId); addToast('User deleted successfully.'); }); };
    const handleAddProgram = (formData) => { const newProgram: Program = { ...formData, program_id: Date.now() }; setPrograms(prev => [newProgram, ...prev]); addAdminLog('Created program', newProgram.program_id); addToast('Program created successfully.'); };
    const handleUpdateProgram = (updatedProgram: Program) => { setPrograms(prev => prev.map(p => p.program_id === updatedProgram.program_id ? updatedProgram : p)); addAdminLog('Updated program', updatedProgram.program_id); addToast('Program updated successfully.'); };
    const handleDeleteProgram = (programId: number) => { openConfirmationModal('Delete Program', 'Are you sure you want to delete this program?', () => { setPrograms(prev => prev.filter(p => p.program_id !== programId)); addAdminLog('Deleted program', programId); addToast('Program deleted successfully.'); }); };
    const handleUpdateProgress = (progressId: number, newPercentage: number) => { setProgress(prev => prev.map(p => p.progress_id === progressId ? {...p, percentage: newPercentage, updated_at: new Date().toISOString()} : p)); }
    const handleConfirmBooking = (sessionId: number, athleteId: number) => {
        const session = sessions.find(s => s.session_id === sessionId);
        const athlete = users.find(u => u.user_id === athleteId);
        if (!session || !athlete) return;
    
        const executeBooking = () => {
            setSessions(prev => prev.map(s => s.session_id === sessionId ? { ...s, confirmed_athlete_ids: [...s.confirmed_athlete_ids, athleteId] } : s));
            
            const newNotification: Notification = { notification_id: Date.now(), user_id: session.coach_id, text: `${athlete.name} has confirmed for ${session.title}.`, type: 'confirmation', created_at: Date.now() };
            setNotifications(prev => [...prev, newNotification]);
            addToast('Booking confirmed successfully!');
        };
    
        openConfirmationModal(
            'Confirm Booking',
            `Are you sure you want to book the session "${session.title}" for ${athlete.name} on ${new Date(session.date).toLocaleDateString()}?`,
            executeBooking
        );
    };
    const handleOpenReminderModal = (session: Session) => { setSessionForReminder(session); setIsReminderModalOpen(true); };
    const handleSetReminder = (sessionId, minutesBefore) => {
        const session = sessions.find(s => s.session_id === sessionId);
        const user = impersonatedUser || currentUser;
        if(session && user) {
            const sessionTime = new Date(`${session.date}T${session.time}`).getTime();
            const remindAt = sessionTime - (minutesBefore * 60 * 1000);
            const newReminder: Reminder = { reminder_id: Date.now(), session_id: sessionId, user_id: user.user_id, remind_at: remindAt };
            setReminders(prev => [...prev, newReminder]);
            addToast('Reminder set successfully!');
        }
        setIsReminderModalOpen(false);
    };
    const handleDismissNotification = (notificationId) => setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
    const handleSendMessage = (subject: string, body: string) => {
        const user = impersonatedUser || currentUser;
        if (!user) {
            addToast('You must be logged in to send a message.', 'error');
            return;
        }
        const newMessage: Message = { message_id: Date.now(), user_id: user.user_id, subject, body, sent_at: new Date().toISOString(), };
        setMessages(prev => [newMessage, ...prev]);
        addToast('Message sent successfully!');
    };


    const data = { users, programs, progress, payments, adminLogs, sessions, notifications, messages };
    const handlers = {
        impersonateUser: handleImpersonate, addUser: handleAddUser, updateUser: handleUpdateUser, deleteUser: handleDeleteUser, updateProgress: handleUpdateProgress, confirmBooking: handleConfirmBooking, openReminderModal: handleOpenReminderModal, dismissNotification: handleDismissNotification, sendMessage: handleSendMessage, addToast: addToast, addProgram: handleAddProgram, updateProgram: handleUpdateProgram, deleteProgram: handleDeleteProgram
    };

    if (!currentUser) return <LoginPage onLogin={handleLogin} error={loginError} />;

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <DashboardLayout user={currentUser} impersonatedUser={impersonatedUser} onLogout={handleLogout} onStopImpersonating={handleStopImpersonating} data={data} handlers={handlers} />
            <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} onSave={handleSetReminder} session={sessionForReminder} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirm} title={confirmModalContent.title}>
                <p>{confirmModalContent.body}</p>
            </ConfirmationModal>
        </>
    );
};

export default App;
