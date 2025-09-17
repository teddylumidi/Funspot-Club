


import React, { useState, useEffect, useMemo, FC, SetStateAction, useRef } from 'react';

// --- SVG Icons ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.566-.16-1.168.356-1.168.356m3.633.82-1.168-.356m1.168.356c-.566.16-1.533-.205-1.533-.205m2.7 2.062a5.987 5.987 0 0 1-1.533-.205m1.533.205a5.987 5.987 0 0 0-1.533.205m-2.7-2.062a5.987 5.987 0 0 0-1.533.205m1.533-.205L8.25 15.75M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-1.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Zm6 0h.008v.008H12V15Zm6 0h.008v.008H18V15Zm-6 0h.008v.008H12V15Z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const ArrowDownTrayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const CpuChipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25h1.5m-18 0h1.5m15 3.75h1.5m-18 0h1.5m15 3.75h1.5m-18 0h1.5M15.75 21v-1.5m0-15V3" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25v7.5A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25Z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>;

// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
type PaymentStatus = 'paid' | 'pending' | 'failed';
type ToastType = 'success' | 'info' | 'error';
type ActivityType = 'Indoor' | 'Outdoor';

interface User { user_id: number; name: string; email: string; password_hash: string; role: Role; date_of_birth: string; parent_id: number | null; coach_id?: number | null; photo_url?: string; bio?: string; }
interface Program { program_id: number; title: string; description: string; schedule: string; coach_id: number; price: number; duration: string; skillLevel: SkillLevel; }
interface Session { session_id: number; program_id: number; date: string; time: string; title: string; coach_id: number; athlete_ids: number[]; confirmed_athlete_ids: number[]; }
interface Payment { payment_id: number; user_id: number; program_id: number; amount: number; status: PaymentStatus; paid_at: string | null; }
interface Progress { progress_id: number; athlete_id: number; skill: string; percentage: number; updated_at: string; }
interface Activity { activity_id: number; name: string; type: ActivityType; description: string; }
interface Announcement { announcement_id: number; title: string; content: string; created_at: string; author_id: number; }
interface ToastMessage { id: number; message: string; type: ToastType; }

// --- Data Simulation & Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch (error) { console.error(error); return initialValue; }
    });
    const setValue = (value: SetStateAction<T>) => {
        try { const valueToStore = value instanceof Function ? value(storedValue) : value; setStoredValue(valueToStore); window.localStorage.setItem(key, JSON.stringify(valueToStore)); } catch (error) { console.error(error); }
    };
    return [storedValue, setValue];
};

const initialUsers: User[] = [
    { user_id: 1, name: 'Admin User', email: 'admin@funport.com', password_hash: 'password123', role: 'Admin', date_of_birth: '1990-01-01', parent_id: null, photo_url: `https://i.pravatar.cc/150?u=1`, bio: "System administrator for Funport Skating Club." }, 
    { user_id: 2, name: 'Coach Sarah', email: 'sarah@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1992-05-15', parent_id: null, photo_url: `https://i.pravatar.cc/150?u=2`, bio: "Head coach for intermediate and advanced programs." }, 
    { user_id: 3, name: 'Coach Mike', email: 'mike@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1988-11-20', parent_id: null, photo_url: `https://i.pravatar.cc/150?u=3`, bio: "Weekend sessions coach, specializing in beginner techniques." }, 
    { user_id: 4, name: 'John Doe', email: 'john@email.com', password_hash: 'password123', role: 'Parent', date_of_birth: '1985-03-10', parent_id: null, photo_url: `https://i.pravatar.cc/150?u=4`, bio: "Parent of Leo Doe." }, 
    { user_id: 5, name: 'Leo Doe', email: 'leo@email.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2014-06-22', parent_id: 4, coach_id: 2, photo_url: `https://i.pravatar.cc/150?u=5`, bio: "Aspiring figure skater in the intermediate program." }, 
];
const initialPrograms: Program[] = [
    { program_id: 1, title: 'Summer Weekly Program', description: 'An intensive 8-week program designed to significantly boost skating skills through rigorous weekday training. Focuses on technique, endurance, and performance routines.', schedule: 'Mon, Wed & Fri 3:30PM–6:00PM', coach_id: 2, price: 8000, duration: '8 Weeks', skillLevel: 'Intermediate' }, { program_id: 2, title: 'Weekend Sessions', description: 'Perfect for those with busy schedules. These ongoing sessions offer flexible training on weekends to help maintain and improve skating abilities at a comfortable pace.', schedule: 'Sat & Sun 3:30PM–6:00PM', coach_id: 3, price: 6000, duration: 'Ongoing', skillLevel: 'All Levels' },
];
const initialSessions: Session[] = [ { session_id: 1, program_id: 1, date: '2024-07-29', time: '3:30PM-6:00PM', title: 'Summer Program - Week 1', coach_id: 2, athlete_ids: [5], confirmed_athlete_ids: [5] }, ];
const initialPayments: Payment[] = [ { payment_id: 1, user_id: 5, program_id: 1, amount: 8000, status: 'paid', paid_at: '2024-07-01T10:05:00Z' }];
const initialProgress: Progress[] = [ { progress_id: 1, athlete_id: 5, skill: 'Balance', percentage: 80, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 2, athlete_id: 5, skill: 'Gliding', percentage: 60, updated_at: '2024-07-18T09:00:00Z' } ];
const initialActivities: Activity[] = [ { activity_id: 1, name: 'Skating', type: 'Outdoor', description: 'Ice or roller skating activities.' }, { activity_id: 2, name: 'Swimming', type: 'Outdoor', description: 'Aquatic training and competitions.' }, { activity_id: 3, name: 'Chess', type: 'Indoor', description: 'Strategic board game training.' } ];
const initialAnnouncements: Announcement[] = [ { announcement_id: 1, title: 'CRITICAL: DarkNet Market Data', content: 'Large credential dump detected on DarkNet market. Financial records (26k+) potentially compromised.', created_at: '2024-07-20T12:23:45Z', author_id: 1 }, { announcement_id: 2, title: 'WARNING: Chatter Spike Detected', content: 'Chatter spike detected mentioning major retailer. 358 mentions in last 2 hours (+72%).', created_at: '2024-07-20T11:58:12Z', author_id: 1 }, ];

interface TooltipState { visible: boolean; content: string; x: number; y: number; }
type ShowTooltipFn = (content: string, event: React.MouseEvent) => void;
type HideTooltipFn = () => void;
type ModalState = { type: null | string; data?: any; warning?: string };

// --- Reusable Components (StatCard, PieChart, BarChart, Tooltip, Modal) ---
const Tooltip: FC<{ tooltip: TooltipState }> = ({ tooltip }) => { if (!tooltip.visible) return null; return <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }} dangerouslySetInnerHTML={{ __html: tooltip.content }} />; };
const Modal: FC<{ title: string; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg'}> = ({ title, onClose, children, size = 'md' }) => ( <div className="modal-backdrop"><div className={`modal-content modal-${size}`}><div className="modal-header"><h3>{title}</h3><button onClick={onClose} className="btn-icon"><CloseIcon /></button></div><div className="modal-body">{children}</div></div></div> );
const ToastContainer: FC<{ toasts: ToastMessage[]; onClose: (id: number) => void }> = ({ toasts, onClose }) => (
    <div className="toast-container">
        {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
                <p>{toast.message}</p>
                <button onClick={() => onClose(toast.id)} className="toast-close-btn"><CloseIcon /></button>
            </div>
        ))}
    </div>
);
const PieChart: FC<{ data: { label: string; value: number }[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ data, showTooltip, hideTooltip }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0); let cumulative = 0; const radius = 80; const circumference = 2 * Math.PI * radius; const colors = ['#39FF14', '#FF4136', '#B10DC9', '#FFDC00'];
    return ( <div className="pie-chart-container"><svg className="pie-chart" width="200" height="200" viewBox="-100 -100 200 200">{data.map((item, index) => { if (total === 0) return null; const percentage = (item.value / total) * 100; const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`; const strokeDashoffset = (-cumulative / 100) * circumference; cumulative += percentage; return <circle key={index} r={radius} cx="0" cy="0" fill="none" stroke={colors[index % colors.length]} strokeWidth="40" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} onMouseMove={(e) => showTooltip(`<strong>${item.label}</strong>: ${item.value} (${percentage.toFixed(1)}%)`, e)} onMouseLeave={hideTooltip} />; })}</svg></div> );
};
const BarChart: FC<{ data: { label: string; value: number }[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; yAxisLabel?: string; }> = ({ data, showTooltip, hideTooltip, yAxisLabel="Value" }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0); const chartWidth = 300; const chartHeight = 150; const barWidth = data.length > 0 ? chartWidth / data.length : 0;
    return ( <div className="bar-chart-container"><svg width="100%" height="200" viewBox={`0 0 ${chartWidth + 40} ${chartHeight + 40}`}><line className="axis" x1="40" y1="0" x2="40" y2={chartHeight} /><line className="axis" x1="40" y1={chartHeight} x2={chartWidth + 40} y2={chartHeight} />{data.map((item, index) => { const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0; const x = 40 + index * barWidth; const y = chartHeight - barHeight; return ( <g key={index}><rect x={x + barWidth * 0.1} y={y} width={barWidth * 0.8} height={barHeight} onMouseMove={(e) => showTooltip(`<strong>${item.label}</strong>: ${item.value}`, e)} onMouseLeave={hideTooltip} /><text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle">{item.label}</text></g> ); })}<text x="15" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90 15,${chartHeight/2})`}>{yAxisLabel}</text><text x="35" y="10" textAnchor="end">{maxValue}</text><text x="35" y={chartHeight} textAnchor="end">0</text></svg></div> );
};


// --- Dashboards ---
const AdminDashboard: FC<{ users: User[], programs: Program[], payments: Payment[], announcements: Announcement[], showTooltip: ShowTooltipFn, hideTooltip: HideTooltipFn }> = ({ users, programs, payments, announcements, showTooltip, hideTooltip }) => {
    const totalRevenue = useMemo(() => payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0), [payments]);
    const userRoleData = useMemo(() => { const counts = users.reduce((acc: Record<string, number>, user) => { acc[user.role] = (acc[user.role] || 0) + 1; return acc; }, {}); return Object.entries(counts).map(([label, value]) => ({ label, value })); }, [users]);
    const athleteEnrollmentData = useMemo(() => programs.map(program => ({ label: program.title.split(' ').slice(0, 1).join(' '), value: payments.filter(p => p.program_id === program.program_id).length })), [payments, programs]);
    const terminalLines = [ "[+] Crawling 12 marketplaces, 8 forums, 15 channels", "[!] Potential leak detected: financial_institution_db.tar.gz", "[?] Analyzing contents... ◴", "[!] CREDENTIAL ALERT: 26,752 records confirmed valid", "[+] Initiating analysis of chatter patterns...", "[!] Increased mentions of “major_retailer” detected (+72%)", "[+] Scanning pastebin clones for matches...", "[!] MATCH: server_dump.txt contains 438 credentials", "root@shadowatch:~#" ];
    
    return (
        <div className="dashboard-grid">
            <div className="widget-span-3"><div className="widget-header"><h3>Active Threats</h3><span>Realtime Monitoring</span></div><div className="threats-grid"><div className="threat-card red"><div className="threat-card-header"><h4>Credential Leak</h4><span>12 minutes ago</span></div><div className="threat-card-body"><h5>Financial Institution Database</h5><p>{(26752).toLocaleString()} Records</p></div><div className="threat-card-footer"><span className="tag">Redacted Host</span></div></div><div className="threat-card yellow"><div className="threat-card-header"><h4>Chatter Spike</h4><span>34 minutes ago</span></div><div className="threat-card-body"><h5>Mention of Major Retailer</h5><p>358 Mentions</p></div><div className="threat-card-footer"><span className="pill">72% Increase</span></div></div><div className="threat-card purple"><div className="threat-card-header"><h4>Server Breach</h4><span>1 hour ago</span></div><div className="threat-card-body"><h5>Government Contractor</h5><p>Sensitive Data</p></div><div className="threat-card-footer"><span className="tag confirmed">Confirmed</span></div></div></div></div>
            <div className="widget-span-2"><div className="widget-header"><h3>Monitor Terminal</h3></div><div className="terminal"><pre>{terminalLines.map((line, i) => <div key={i}>{line}</div>)}</pre></div></div>
            <div className="widget-span-1"><div className="widget-header"><h3>Alert Feed</h3><span className="pill new">{announcements.length} New</span></div><div className="alert-feed">{announcements.map(a => <div key={a.announcement_id} className={`alert ${a.title.toLowerCase().includes('critical') ? 'critical' : 'warning'}`}><span>{new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><p>{a.content}</p></div>)}</div></div>
            <div className="widget-span-2"><div className="widget-header"><h3>Dark Web Activity Analysis</h3></div><div className="charts-grid"><div className="chart-card"><h4>Threat Types</h4><PieChart data={userRoleData} showTooltip={showTooltip} hideTooltip={hideTooltip}/></div><div className="chart-card"><h4>Forum Activity</h4><BarChart data={athleteEnrollmentData} showTooltip={showTooltip} hideTooltip={hideTooltip} /></div></div></div>
            <div className="widget-span-1"><div className="widget-header"><h3>System Status</h3></div><div className="system-status-grid"><div className="stat-card"><h4>Total Users</h4><p>{users.length}</p></div><div className="stat-card"><h4>Active Programs</h4><p>{programs.length}</p></div><div className="stat-card"><h4>Total Revenue</h4><p>KES {totalRevenue.toLocaleString()}</p></div></div></div>
        </div>
    );
};
const CoachDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[]; announcements: Announcement[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, users, progress, announcements, showTooltip, hideTooltip }) => {
    const assignedAthletes = users.filter(u => u.role === 'Athlete' && u.coach_id === currentUser.user_id);
    const avgProgress = useMemo(() => { const coachProgress = progress.filter(p => assignedAthletes.some(a => a.user_id === p.athlete_id)); if (coachProgress.length === 0) return 0; return coachProgress.reduce((sum, p) => sum + p.percentage, 0) / coachProgress.length; }, [progress, assignedAthletes]);
    const athleteProgressData = useMemo(() => { return assignedAthletes.map(athlete => { const athleteProgress = progress.filter(p => p.athlete_id === athlete.user_id); const avg = athleteProgress.length > 0 ? athleteProgress.reduce((sum, p) => sum + p.percentage, 0) / athleteProgress.length : 0; return { label: athlete.name.split(' ')[0], value: parseFloat(avg.toFixed(1)) }; }); }, [assignedAthletes, progress]);
    return ( <div className="dashboard-grid"><div className="widget-span-2"><div className="widget-header"><h3>Athlete Progress Overview</h3></div><BarChart data={athleteProgressData} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Avg. Progress %"/></div><div className="widget-span-1"><div className="widget-header"><h3>Alert Feed</h3><span className="pill new">{announcements.length} New</span></div><div className="alert-feed">{announcements.map(a => <div key={a.announcement_id} className={`alert ${a.title.toLowerCase().includes('critical') ? 'critical' : 'warning'}`}><span>{new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><p>{a.content}</p></div>)}</div></div></div> );
};
const ParentDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[]; announcements: Announcement[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, users, progress, announcements, showTooltip, hideTooltip }) => {
    const children = users.filter(u => u.role === 'Athlete' && u.parent_id === currentUser.user_id);
    return ( <div className="dashboard-grid"><div className="widget-span-2">{children.length > 0 ? children.map(child => { const childProgress = progress.filter(p => p.athlete_id === child.user_id); return ( <div key={child.user_id} className="widget" style={{ marginBottom: '24px' }}><div className="widget-header"><h3>{child.name}'s Progress</h3></div><BarChart data={childProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/></div> ); }) : <div className="widget"><p>No children found. Please add an athlete user and assign yourself as the parent.</p></div>}</div><div className="widget-span-1"><div className="widget-header"><h3>Alert Feed</h3><span className="pill new">{announcements.length} New</span></div><div className="alert-feed">{announcements.map(a => <div key={a.announcement_id} className={`alert ${a.title.toLowerCase().includes('critical') ? 'critical' : 'warning'}`}><span>{new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><p>{a.content}</p></div>)}</div></div></div> );
};
const AthleteDashboard: FC<{ currentUser: User; progress: Progress[]; announcements: Announcement[], showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, progress, announcements, showTooltip, hideTooltip }) => {
    const athleteProgress = progress.filter(p => p.athlete_id === currentUser.user_id);
    return ( <div className="dashboard-grid"><div className="widget-span-2"><div className="widget-header"><h3>My Progress</h3></div><BarChart data={athleteProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/></div><div className="widget-span-1"><div className="widget-header"><h3>Alert Feed</h3><span className="pill new">{announcements.length} New</span></div><div className="alert-feed">{announcements.map(a => <div key={a.announcement_id} className={`alert ${a.title.toLowerCase().includes('critical') ? 'critical' : 'warning'}`}><span>{new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><p>{a.content}</p></div>)}</div></div></div> );
};

// --- Management Views ---
const UserManagement: FC<{ users: User[], onImpersonate: (user: User) => void, onEdit: (user: User) => void, onDelete: (user: User) => void, onAdd: () => void, onViewProfile: (user:User) => void, searchValue: string, onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ users, onImpersonate, onEdit, onDelete, onAdd, onViewProfile, searchValue, onSearchChange }) => (
    <div className="widget">
        <div className="widget-header"><h3>User Management</h3><div className="header-actions"><input type="text" placeholder="Search by name or email..." value={searchValue} onChange={onSearchChange} className="search-input" /><button className="btn btn-primary" onClick={onAdd}><UserPlusIcon/> Add User</button></div></div>
        <div className="table-container"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>DOB</th><th>Actions</th></tr></thead><tbody>{users.map(user => (<tr key={user.user_id}><td data-label="Name"><div className="user-name-cell"><img src={user.photo_url} alt={user.name} className="table-avatar"/>{user.name}</div></td><td data-label="Email">{user.email}</td><td data-label="Role"><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td><td data-label="DOB">{user.date_of_birth}</td><td data-label="Actions"><div className="action-buttons"><button onClick={() => onViewProfile(user)} className="btn-icon" title="View Profile"><UserCircleIcon/></button><button onClick={() => onImpersonate(user)} className="btn-icon" title="Impersonate"><EyeIcon/></button><button onClick={() => onEdit(user)} className="btn-icon" title="Edit"><PencilIcon/></button><button onClick={() => onDelete(user)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button></div></td></tr>))}</tbody></table></div>
    </div>
);
const ProgramManagement: FC<{ programs: Program[], users: User[], onEdit: (p: Program) => void, onDelete: (p: Program) => void, onAdd: () => void, onView: (p: Program) => void }> = ({ programs, users, onEdit, onDelete, onAdd, onView }) => {
    const getCoachName = (id: number) => users.find(u => u.user_id === id)?.name || 'Unknown';
    return (
        <div className="widget">
            <div className="widget-header"><h3>Program Management</h3><button className="btn btn-primary" onClick={onAdd}><PlusIcon/> Add Program</button></div>
            <div className="table-container"><table><thead><tr><th>Title</th><th>Coach</th><th>Price</th><th>Skill Level</th><th>Actions</th></tr></thead><tbody>{programs.map(p => (<tr key={p.program_id}><td data-label="Title">{p.title}</td><td data-label="Coach">{getCoachName(p.coach_id)}</td><td data-label="Price">KES {p.price.toLocaleString()}</td><td data-label="Skill Level"><span className={`skill-badge skill-${p.skillLevel.split(' ')[0].toLowerCase()}`}>{p.skillLevel}</span></td><td data-label="Actions"><div className="action-buttons"><button onClick={() => onView(p)} className="btn-icon" title="View Details"><EyeIcon/></button><button onClick={() => onEdit(p)} className="btn-icon" title="Edit"><PencilIcon/></button><button onClick={() => onDelete(p)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button></div></td></tr>))}</tbody></table></div>
        </div>
    );
};
const ActivityManagement: FC<{ activities: Activity[], onEdit: (a: Activity) => void, onDelete: (a: Activity) => void, onAdd: () => void }> = ({ activities, onEdit, onDelete, onAdd }) => (
    <div className="widget">
        <div className="widget-header"><h3>Subject Management</h3><button className="btn btn-primary" onClick={onAdd}><PlusIcon/> Add Subject</button></div>
        <div className="table-container"><table><thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Actions</th></tr></thead><tbody>{activities.map(a => (<tr key={a.activity_id}><td data-label="Name">{a.name}</td><td data-label="Type">{a.type}</td><td data-label="Description">{a.description}</td><td data-label="Actions"><div className="action-buttons"><button onClick={() => onEdit(a)} className="btn-icon" title="Edit"><PencilIcon/></button><button onClick={() => onDelete(a)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button></div></td></tr>))}</tbody></table></div>
    </div>
);
const AnnouncementManagement: FC<{ announcements: Announcement[], users: User[], onAdd: () => void, onDelete: (a: Announcement) => void }> = ({ announcements, users, onAdd, onDelete }) => {
    const getAuthorName = (id: number) => users.find(u => u.user_id === id)?.name || 'Unknown';
    return (
        <div className="widget">
            <div className="widget-header"><h3>Announcement Management</h3><button className="btn btn-primary" onClick={onAdd}><PlusIcon/> Add Announcement</button></div>
            <div className="table-container"><table><thead><tr><th>Title</th><th>Content</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead><tbody>{announcements.map(a => (<tr key={a.announcement_id}><td data-label="Title">{a.title}</td><td data-label="Content">{a.content.substring(0,50)}...</td><td data-label="Author">{getAuthorName(a.author_id)}</td><td data-label="Date">{new Date(a.created_at).toLocaleString()}</td><td data-label="Actions"><div className="action-buttons"><button onClick={() => onDelete(a)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button></div></td></tr>))}</tbody></table></div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [programs, setPrograms] = useLocalStorage<Program[]>('programs', initialPrograms);
    const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', initialSessions);
    const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialPayments);
    const [progress, setProgress] = useLocalStorage<Progress[]>('progress', initialProgress);
    const [activities, setActivities] = useLocalStorage<Activity[]>('activities', initialActivities);
    const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', initialAnnouncements);
    const [view, setView] = useState('Dashboard');
    const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0 });
    const [modal, setModal] = useState<ModalState>({ type: null });
    const [viewingProfile, setViewingProfile] = useState<User | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [userSearch, setUserSearch] = useState('');

    const showTooltip: ShowTooltipFn = (content, event) => setTooltip({ visible: true, content, x: event.clientX, y: event.clientY });
    const hideTooltip: HideTooltipFn = () => setTooltip(prev => ({ ...prev, visible: false }));
    const displayUser = impersonatedUser || currentUser;

    const filteredUsers = useMemo(() => {
        if (!userSearch) return users;
        return users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) );
    }, [users, userSearch]);

    const handleLogin = (user: User) => { setCurrentUser(user); };
    const handleLogout = () => { setCurrentUser(null); setImpersonatedUser(null); setViewingProfile(null); setView('Dashboard'); };
    const handleImpersonate = (user: User) => { if (currentUser?.role === 'Admin') { setImpersonatedUser(user); setView('Dashboard'); addToast(`Impersonating ${user.name}`, 'info'); } };
    const stopImpersonating = () => { setImpersonatedUser(null); setView('Dashboard'); addToast(`Returned to admin account`, 'info'); };
    
    const removeToast = (id: number) => { setToasts(prev => prev.filter(t => t.id !== id)); };
    const addToast = (message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    // --- CRUD Handlers ---
    const handleDeleteUser = (user: User) => { setUsers(prev => prev.filter(u => u.user_id !== user.user_id)); setModal({ type: null }); addToast('User deleted.', 'info'); };
    const handleDeleteProgram = (program: Program) => { setPrograms(prev => prev.filter(p => p.program_id !== program.program_id)); setModal({type: null}); addToast('Program deleted.', 'info'); };
    const handleDeleteActivity = (activity: Activity) => { setActivities(prev => prev.filter(a => a.activity_id !== activity.activity_id)); setModal({type: null}); addToast('Subject deleted.', 'info'); };
    const handleDeleteAnnouncement = (announcement: Announcement) => { setAnnouncements(prev => prev.filter(a => a.announcement_id !== announcement.announcement_id)); setModal({type: null}); addToast('Announcement deleted.', 'info'); };
    const handleSaveAnnouncement = (announcement: Announcement) => {
        const isNew = !announcement.announcement_id;
        setAnnouncements(prev => isNew ? [{ ...announcement, announcement_id: Date.now(), created_at: new Date().toISOString(), author_id: currentUser!.user_id }, ...prev] : prev.map(a => a.announcement_id === announcement.announcement_id ? announcement : a));
        setModal({type: null});
        addToast(isNew ? 'Announcement posted!' : 'Announcement updated!');
    };
    
    if (!currentUser) return <LoginPage onLogin={handleLogin} users={users} />;
    
    const navigationLinks = {
        Admin: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Users', icon: UserGroupIcon }, { name: 'Programs', icon: DocumentTextIcon }, { name: 'Subjects', icon: BookOpenIcon }, { name: 'Announcements', icon: BellIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Coach: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Schedule', icon: CalendarIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Parent: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Browse Programs', icon: BookOpenIcon}, { name: 'My Bookings', icon: CreditCardIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Athlete: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Browse Programs', icon: BookOpenIcon}, { name: 'My Bookings', icon: CreditCardIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
    };

    const handleNavClick = (linkName: string) => {
        if (linkName === 'My Profile') { setViewingProfile(displayUser); setView('User Profile'); } 
        else { setViewingProfile(null); setView(linkName); }
    }
    
    const renderView = () => {
        switch (view) {
            case 'Dashboard':
                if (displayUser?.role === 'Admin') return <AdminDashboard users={users} programs={programs} payments={payments} announcements={announcements} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Coach') return <CoachDashboard currentUser={displayUser} users={users} progress={progress} announcements={announcements} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Parent') return <ParentDashboard currentUser={displayUser} users={users} progress={progress} announcements={announcements} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Athlete') return <AthleteDashboard currentUser={displayUser} progress={progress} announcements={announcements} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                return null;
            case 'Users': return <UserManagement users={filteredUsers} onImpersonate={handleImpersonate} onEdit={(u) => {}} onDelete={handleDeleteUser} onAdd={() => {}} onViewProfile={(u) => { setViewingProfile(u); setView('User Profile'); }} searchValue={userSearch} onSearchChange={e => setUserSearch(e.target.value)} />;
            case 'Programs': return <ProgramManagement programs={programs} users={users} onEdit={(p) => {}} onDelete={handleDeleteProgram} onAdd={() => {}} onView={(p) => {}} />;
            case 'Subjects': return <ActivityManagement activities={activities} onEdit={(a) => {}} onDelete={handleDeleteActivity} onAdd={() => {}} />;
            case 'Announcements': return <AnnouncementManagement announcements={announcements} users={users} onAdd={() => setModal({type: 'add-announcement'})} onDelete={handleDeleteAnnouncement} />;
            case 'User Profile': return viewingProfile && <div className="widget"><h3>{viewingProfile.name}</h3><p>Profile page coming soon.</p></div>
            default: return <div>Not Found</div>;
        }
    };
    
    return (
        <>
            <Tooltip tooltip={tooltip} />
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <div className="dashboard-layout">
                <Sidebar user={displayUser!} links={displayUser ? navigationLinks[displayUser.role] : []} activeView={view} onNavClick={handleNavClick} onLogout={handleLogout} />
                <main className="main-content">
                    {impersonatedUser && ( <div className="impersonation-banner"><EyeIcon /><span>Viewing as {impersonatedUser.name} ({impersonatedUser.role})</span><button onClick={stopImpersonating} className="btn-secondary btn-sm">Stop Impersonating</button></div> )}
                    <Header title={viewingProfile ? `${viewingProfile.name}'s Profile` : view} user={displayUser!} />
                    <div className="content-area">{renderView()}</div>
                </main>
            </div>
            {modal.type === 'add-announcement' && <AnnouncementFormModal onSave={handleSaveAnnouncement} onClose={() => setModal({ type: null })} /> }
        </>
    );
};

const Header: FC<{ title: string; user: User; }> = ({ title, user }) => {
    return (
        <header className="header">
            <div className="header-content">
                <h2>{title}</h2>
                <div className="header-right">
                   <div className="header-user-info">
                       <span>{user?.name}</span>
                       <span className="user-role">{user?.role}</span>
                   </div>
                   <img src={user?.photo_url} alt={user.name} className="header-avatar" />
                </div>
            </div>
        </header>
    );
};

const Sidebar: FC<{ user: User, links: { name: string; icon: FC }[]; activeView: string; onNavClick: (view: string) => void; onLogout: () => void; }> = ({ user, links, activeView, onNavClick, onLogout }) => (
    <aside className="sidebar"><div className="sidebar-content"><div className="sidebar-header"><h3>FUNSPOT CLUB</h3><div className="header-status-bar"><span className="status-item active">TOR RELAY: ACTIVE</span><span className="status-item secure">ENCRYPTION: AES-256</span><span className="status-item secure">SESSION: SECURE</span></div></div><nav className="sidebar-nav"><ul>{links.map(link => (<li key={link.name}><a href="#" className={activeView === link.name || (activeView === 'User Profile' && link.name === 'My Profile') ? 'active' : ''} onClick={(e) => { e.preventDefault(); onNavClick(link.name); }}><link.icon /><span>{link.name}</span></a></li>))}</ul></nav><div className="sidebar-footer"><button className="btn btn-danger btn-full" onClick={onLogout}><LogoutIcon/>KILLSWITCH</button><div className="footer-info"><span>SHADOWWATCH v3.7.4</span><span>SECURE SIGNAL: ENCRYPTED</span></div></div></div></aside>
);

const LoginPage: FC<{ onLogin: (user: User) => void; users: User[] }> = ({ onLogin, users }) => {
    const [portal, setPortal] = useState<'selection' | 'admin' | 'member'>('selection');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePortalSelect = (selectedPortal: 'admin' | 'member') => {
        setPortal(selectedPortal); setError('');
        if (selectedPortal === 'admin') { setEmail('admin@funport.com'); setPassword('password123'); } 
        else { setEmail('john@email.com'); setPassword('password123'); }
    };

    const handleLoginAttempt = (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        const user = users.find(u => u.email === email && u.password_hash === password);
        if (!user) { setError('Invalid credentials. Please try again.'); return; }
        if (portal === 'admin') { if (user.role !== 'Admin') { setError('Access denied. You are not an administrator.'); return; } } 
        else if (portal === 'member') { if (user.role === 'Admin') { setError('Administrators must use the Admin Login portal.'); return; } }
        onLogin(user);
    };

    if (portal === 'selection') {
        return (
            <div className="login-container">
                <div className="login-box">
                    <ShieldCheckIcon/>
                    <h1>FUNSPOT CLUB</h1>
                    <p>SYSTEM SECURE. PLEASE SELECT YOUR ACCESS PORTAL.</p>
                    <div className="portal-selection">
                        <button className="btn btn-primary btn-full" onClick={() => handlePortalSelect('admin')}>ADMINISTRATION PORTAL</button>
                        <button className="btn btn-secondary btn-full" onClick={() => handlePortalSelect('member')}>MEMBER PORTAL</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="login-container">
            <div className="login-box">
                 <button className="btn-back" onClick={() => setPortal('selection')}>&larr; Back to Portal Selection</button>
                 <h1 style={{ marginTop: '16px' }}>{portal === 'admin' ? 'Admin Sign In' : 'Member Sign In'}</h1>
                 {error && <p className="form-error">{error}</p>}
                <form onSubmit={handleLoginAttempt}>
                    <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                    <button type="submit" className="btn btn-primary btn-full">AUTHENTICATE</button>
                </form>
                 <div className="social-login-divider"><span>OR</span></div>
                <div className="social-login-buttons"><button className="btn-social">Sign in with Google</button><button className="btn-social">Sign in with Microsoft</button></div>
            </div>
        </div>
    );
};

const AnnouncementFormModal: FC<{ announcement?: Announcement, onSave: (a: Announcement) => void, onClose: () => void }> = ({ announcement, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Announcement, 'announcement_id' | 'created_at' | 'author_id'> & { announcement_id?: number }>( announcement || { title: '', content: '' } );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, announcement_id: formData.announcement_id || 0, created_at: '', author_id: 0}); }
    return ( <Modal title={announcement ? "Edit Announcement" : "New Announcement"} onClose={onClose}><form onSubmit={handleSubmit}><div className="form-group"><label>Title</label><input name="title" value={formData.title} onChange={handleChange} required/></div><div className="form-group"><label>Content</label><textarea name="content" value={formData.content} onChange={handleChange} rows={4} required /></div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Post Announcement</button></div></form></Modal> )
}


export default App;