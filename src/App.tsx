
import React, { useState, useEffect, useMemo, FC, SetStateAction } from 'react';

// --- SVG Icons (existing icons are kept for modals, tables, etc.) ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.566-.16-1.168.356-1.168.356m3.633.82-1.168-.356m1.168.356c-.566.16-1.533-.205-1.533-.205m2.7 2.062a5.987 5.987 0 0 1-1.533-.205m1.533.205a5.987 5.987 0 0 0-1.533.205m-2.7-2.062a5.987 5.987 0 0 0-1.533.205m1.533-.205L8.25 15.75M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-1.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Zm6 0h.008v.008H12V15Zm6 0h.008v.008H18V15Zm-6 0h.008v.008H12V15Z" /></svg>;
const FunnelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;


// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
type PaymentStatus = 'paid' | 'pending' | 'failed';

interface User { user_id: number; name: string; email: string; password_hash: string; role: Role; date_of_birth: string; parent_id: number | null; coach_id?: number | null; }
interface Program { program_id: number; title: string; description: string; schedule: string; coach_id: number; price: number; duration: string; skillLevel: SkillLevel; }
interface Session { session_id: number; program_id: number; date: string; time: string; title: string; coach_id: number; athlete_ids: number[]; confirmed_athlete_ids: number[]; }
interface Payment { payment_id: number; user_id: number; program_id: number; amount: number; status: PaymentStatus; paid_at: string | null; }
interface Progress { progress_id: number; athlete_id: number; skill: string; percentage: number; updated_at: string; }

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
    { user_id: 1, name: 'Admin User', email: 'admin@funport.com', password_hash: 'password123', role: 'Admin', date_of_birth: '1990-01-01', parent_id: null }, { user_id: 2, name: 'Coach Sarah', email: 'sarah@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1992-05-15', parent_id: null }, { user_id: 3, name: 'Coach Mike', email: 'mike@funport.com', password_hash: 'password123', role: 'Coach', date_of_birth: '1988-11-20', parent_id: null }, { user_id: 4, name: 'John Doe', email: 'john@email.com', password_hash: 'password123', role: 'Parent', date_of_birth: '1985-03-10', parent_id: null }, { user_id: 5, name: 'Leo Doe', email: 'leo@email.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2014-06-22', parent_id: 4, coach_id: 2 }, { user_id: 6, name: 'Jane Smith', email: 'jane@email.com', password_hash: 'password123', role: 'Parent', date_of_birth: '1987-09-05', parent_id: null }, { user_id: 7, name: 'Mia Smith', email: 'mia@email.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2015-02-18', parent_id: 6, coach_id: 2 }, { user_id: 8, name: 'Anna Belle', email: 'anna@funport.com', password_hash: 'password123', role: 'Athlete', date_of_birth: '2002-12-01', parent_id: null, coach_id: 3 },
];
const initialPrograms: Program[] = [
    { program_id: 1, title: 'Summer Weekly Program', description: 'Intensive training on weekdays.', schedule: 'Mon, Wed & Fri 3:30PM–6:00PM', coach_id: 2, price: 8000, duration: '8 Weeks', skillLevel: 'Intermediate' }, { program_id: 2, title: 'Weekend Sessions', description: 'Flexible weekend training.', schedule: 'Sat & Sun 3:30PM–6:00PM', coach_id: 3, price: 6000, duration: 'Ongoing', skillLevel: 'All Levels' }, { program_id: 3, title: 'Beginner Basics', description: 'Learn to skate from scratch.', schedule: 'Tue & Thu 4:00PM–5:00PM', coach_id: 2, price: 5000, duration: '6 Weeks', skillLevel: 'Beginner' }, { program_id: 4, title: 'Advanced Figure Skating', description: 'Competitive level training.', schedule: 'Mon - Fri 6:00AM-8:00AM', coach_id: 3, price: 12000, duration: '12 Weeks', skillLevel: 'Advanced' },
];
const initialSessions: Session[] = [
    { session_id: 1, program_id: 1, date: '2024-07-29', time: '3:30PM-6:00PM', title: 'Summer Program - Week 1', coach_id: 2, athlete_ids: [5, 7], confirmed_athlete_ids: [5] },
    { session_id: 2, program_id: 2, date: '2024-08-03', time: '3:30PM-6:00PM', title: 'Weekend Session', coach_id: 3, athlete_ids: [8], confirmed_athlete_ids: [8] },
    { session_id: 3, program_id: 1, date: '2024-08-05', time: '3:30PM-6:00PM', title: 'Summer Program - Week 2', coach_id: 2, athlete_ids: [5], confirmed_athlete_ids: [] },
    { session_id: 4, program_id: 3, date: '2024-08-06', time: '4:00PM-5:00PM', title: 'Beginner Basics - Week 1', coach_id: 2, athlete_ids: [], confirmed_athlete_ids: [] },
];
const initialPayments: Payment[] = [
    { payment_id: 1, user_id: 5, program_id: 1, amount: 8000, status: 'paid', paid_at: '2024-07-01T10:05:00Z' }, { payment_id: 2, user_id: 7, program_id: 1, amount: 8000, status: 'pending', paid_at: null }, { payment_id: 3, user_id: 8, program_id: 2, amount: 6000, status: 'failed', paid_at: null }, { payment_id: 4, user_id: 5, program_id: 3, amount: 5000, status: 'paid', paid_at: '2024-06-15T10:05:00Z' },
];
const initialProgress: Progress[] = [
    { progress_id: 1, athlete_id: 5, skill: 'Balance', percentage: 80, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 2, athlete_id: 5, skill: 'Gliding', percentage: 60, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 3, athlete_id: 7, skill: 'Stopping', percentage: 85, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 4, athlete_id: 8, skill: 'Spins', percentage: 90, updated_at: '2024-07-19T09:00:00Z' },
];

interface TooltipState { visible: boolean; content: string; x: number; y: number; }
type ShowTooltipFn = (content: string, event: React.MouseEvent) => void;
type HideTooltipFn = () => void;
type ModalState = { type: null | string; data?: any; };

// --- Reusable Components ---
const StatCard: FC<{ title: string; value: string; subValue?: string }> = ({ title, value, subValue }) => (
    <div className="stat-card">
        <h4 className="stat-title">{title}</h4>
        <p className="stat-value">{value}</p>
        {subValue && <p className="stat-sub-value">{subValue}</p>}
    </div>
);

const PieChart: FC<{ data: { label: string; value: number }[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ data, showTooltip, hideTooltip }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let cumulative = 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="pie-chart-container">
            <svg className="pie-chart" width="200" height="200" viewBox="-100 -100 200 200">
                {data.map((item, index) => {
                    if (total === 0) return null;
                    const percentage = (item.value / total) * 100;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = (-cumulative / 100) * circumference;
                    cumulative += percentage;
                    return (
                        <circle
                            key={index}
                            r={radius}
                            cx="0"
                            cy="0"
                            fill="none"
                            strokeWidth="40"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            onMouseMove={(e) => showTooltip(`<strong>${item.label}</strong>: ${item.value} (${percentage.toFixed(1)}%)`, e)}
                            onMouseLeave={hideTooltip}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

const BarChart: FC<{ data: { label: string; value: number }[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; yAxisLabel?: string; }> = ({ data, showTooltip, hideTooltip, yAxisLabel="Value" }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartWidth = 300;
    const chartHeight = 150;
    const barWidth = data.length > 0 ? chartWidth / data.length : 0;

    return (
        <div className="bar-chart-container">
            <svg width="100%" height="200" viewBox={`0 0 ${chartWidth + 40} ${chartHeight + 40}`}>
                <line className="axis" x1="40" y1="0" x2="40" y2={chartHeight} />
                <line className="axis" x1="40" y1={chartHeight} x2={chartWidth + 40} y2={chartHeight} />

                {data.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
                    const x = 40 + index * barWidth;
                    const y = chartHeight - barHeight;
                    return (
                        <g key={index}>
                            <rect
                                x={x + barWidth * 0.1}
                                y={y}
                                width={barWidth * 0.8}
                                height={barHeight}
                                onMouseMove={(e) => showTooltip(`<strong>${item.label}</strong>: ${item.value}`, e)}
                                onMouseLeave={hideTooltip}
                            />
                            <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle">{item.label}</text>
                        </g>
                    );
                })}
                 <text x="15" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90 15,${chartHeight/2})`}>{yAxisLabel}</text>
                 <text x="35" y="10" textAnchor="end">{maxValue}</text>
                 <text x="35" y={chartHeight} textAnchor="end">0</text>
            </svg>
        </div>
    );
};

const Tooltip: FC<{ tooltip: TooltipState }> = ({ tooltip }) => {
    if (!tooltip.visible) return null;
    return (
        <div
            className="chart-tooltip"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
    );
};

const Modal: FC<{ title: string; onClose: () => void; children: React.ReactNode; }> = ({ title, onClose, children }) => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <div className="modal-header">
                <h3>{title}</h3>
                <button onClick={onClose} className="btn-icon"><CloseIcon /></button>
            </div>
            <div className="modal-body">{children}</div>
        </div>
    </div>
);


// --- Dashboards ---
const AdminDashboard: FC<{ users: User[], programs: Program[], payments: Payment[], showTooltip: ShowTooltipFn, hideTooltip: HideTooltipFn }> = ({ users, programs, payments, showTooltip, hideTooltip }) => {
    const [filters, setFilters] = useState({ role: 'All', skillLevel: 'All Levels', paymentStatus: 'All' });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredUsers = useMemo(() => users.filter(u => filters.role === 'All' || u.role === filters.role), [users, filters.role]);
    const filteredPrograms = useMemo(() => programs.filter(p => filters.skillLevel === 'All Levels' || p.skillLevel === filters.skillLevel), [programs, filters.skillLevel]);
    const filteredPayments = useMemo(() => payments.filter(p => filters.paymentStatus === 'All' || p.status === filters.paymentStatus), [payments, filters.paymentStatus]);
    
    const totalRevenue = useMemo(() => filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0), [filteredPayments]);
    
    const userRoleData = useMemo(() => {
        const counts = filteredUsers.reduce((acc: Record<string, number>, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    }, [filteredUsers]);

    const athleteEnrollmentData = useMemo(() => {
        return filteredPrograms.map(program => {
            const enrollments = filteredPayments.filter(p => p.program_id === program.program_id).length;
            return { label: program.title.split(' ').slice(0, 2).join(' '), value: enrollments };
        });
    }, [filteredPayments, filteredPrograms]);
    

    return (
        <div className="admin-dashboard-layout">
            <aside className="filter-sidebar">
                <h4><FunnelIcon/> Filters</h4>
                <div className="filter-group">
                    <label>User Role</label>
                    <select name="role" value={filters.role} onChange={handleFilterChange}>
                        <option>All</option>
                        <option>Admin</option>
                        <option>Coach</option>
                        <option>Parent</option>
                        <option>Athlete</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Program Skill Level</label>
                    <select name="skillLevel" value={filters.skillLevel} onChange={handleFilterChange}>
                        <option>All Levels</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Payment Status</label>
                    <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
                        <option>All</option>
                        <option>paid</option>
                        <option>pending</option>
                        <option>failed</option>
                    </select>
                </div>
            </aside>
            <main className="admin-dashboard-main">
                <div className="stats-grid">
                    <StatCard title="Total Users" value={filteredUsers.length.toString()} />
                    <StatCard title="Total Programs" value={filteredPrograms.length.toString()} />
                    <StatCard title="Total Revenue" value={`KES ${(totalRevenue).toLocaleString()}`} />
                    <StatCard title="Pending Payments" value={filteredPayments.filter(p => p.status === 'pending').length.toString()} />
                </div>
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>User Role Distribution</h3>
                        <PieChart data={userRoleData} showTooltip={showTooltip} hideTooltip={hideTooltip} />
                    </div>
                    <div className="chart-card">
                        <h3>Athlete Enrollment per Program</h3>
                        <BarChart data={athleteEnrollmentData} showTooltip={showTooltip} hideTooltip={hideTooltip} />
                    </div>
                </div>
            </main>
        </div>
    );
};

const CoachDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, users, progress, showTooltip, hideTooltip }) => {
    const assignedAthletes = users.filter(u => u.role === 'Athlete' && u.coach_id === currentUser.user_id);
    const avgProgress = useMemo(() => {
        const coachProgress = progress.filter(p => assignedAthletes.some(a => a.user_id === p.athlete_id));
        if (coachProgress.length === 0) return 0;
        return coachProgress.reduce((sum, p) => sum + p.percentage, 0) / coachProgress.length;
    }, [progress, assignedAthletes]);

    const athleteProgressData = useMemo(() => {
        return assignedAthletes.map(athlete => {
            const athleteProgress = progress.filter(p => p.athlete_id === athlete.user_id);
            const avg = athleteProgress.length > 0 ? athleteProgress.reduce((sum, p) => sum + p.percentage, 0) / athleteProgress.length : 0;
            return { label: athlete.name.split(' ')[0], value: parseFloat(avg.toFixed(1)) };
        });
    }, [assignedAthletes, progress]);

    return (
        <div>
            <div className="stats-grid">
                <StatCard title="Assigned Athletes" value={assignedAthletes.length.toString()} />
                <StatCard title="Average Progress" value={`${avgProgress.toFixed(1)}%`} />
            </div>
            <div className="charts-grid" style={{ marginTop: '24px' }}>
                <div className="chart-card">
                    <h3>Athlete Progress Overview</h3>
                    <BarChart data={athleteProgressData} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Avg. Progress %"/>
                </div>
            </div>
        </div>
    );
};

const ParentDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, users, progress, showTooltip, hideTooltip }) => {
    const children = users.filter(u => u.role === 'Athlete' && u.parent_id === currentUser.user_id);
    return (
        <div>
            {children.length > 0 ? children.map(child => {
                const childProgress = progress.filter(p => p.athlete_id === child.user_id);
                return (
                    <div key={child.user_id} className="card" style={{ marginBottom: '24px' }}>
                        <h3>{child.name}'s Progress</h3>
                        <BarChart data={childProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/>
                    </div>
                );
            }) : <div className="card"><p>No children found. Please add an athlete user and assign yourself as the parent.</p></div>}
        </div>
    );
};

const AthleteDashboard: FC<{ currentUser: User; progress: Progress[]; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ currentUser, progress, showTooltip, hideTooltip }) => {
    const athleteProgress = progress.filter(p => p.athlete_id === currentUser.user_id);
    return (
        <div className="card">
            <h3>My Progress</h3>
            <BarChart data={athleteProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/>
        </div>
    );
};

// --- Management Views ---
const UserManagement: FC<{ users: User[], onImpersonate: (user: User) => void, onEdit: (user: User) => void, onDelete: (user: User) => void, onAdd: () => void, onViewProfile: (user:User) => void }> = ({ users, onImpersonate, onEdit, onDelete, onAdd, onViewProfile }) => (
    <div className="card">
        <div className="card-header">
            <h3>User Management</h3>
            <button className="btn btn-primary" onClick={onAdd}><UserPlusIcon/> Add User</button>
        </div>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>DOB</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                            <td>{user.date_of_birth}</td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => onViewProfile(user)} className="btn-icon" title="View Profile"><UserCircleIcon/></button>
                                    <button onClick={() => onImpersonate(user)} className="btn-icon" title="Impersonate"><EyeIcon/></button>
                                    <button onClick={() => onEdit(user)} className="btn-icon" title="Edit"><PencilIcon/></button>
                                    <button onClick={() => onDelete(user)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ProgramManagement: FC<{ programs: Program[], users: User[], onEdit: (p: Program) => void, onDelete: (p: Program) => void, onAdd: () => void }> = ({ programs, users, onEdit, onDelete, onAdd }) => {
    const getCoachName = (id: number) => users.find(u => u.user_id === id)?.name || 'Unknown';
    return (
    <div className="card">
        <div className="card-header">
            <h3>Program Management</h3>
            <button className="btn btn-primary" onClick={onAdd}><PlusIcon/> Add Program</button>
        </div>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Coach</th>
                        <th>Schedule</th>
                        <th>Price</th>
                        <th>Skill Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map(p => (
                        <tr key={p.program_id}>
                            <td>{p.title}</td>
                            <td>{getCoachName(p.coach_id)}</td>
                            <td>{p.schedule}</td>
                            <td>KES {p.price.toLocaleString()}</td>
                            <td><span className={`skill-badge skill-${p.skillLevel.split(' ')[0].toLowerCase()}`}>{p.skillLevel}</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => onEdit(p)} className="btn-icon" title="Edit"><PencilIcon/></button>
                                    <button onClick={() => onDelete(p)} className="btn-icon btn-icon-danger" title="Delete"><TrashIcon/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)};

const MyBookingsView: FC<{ currentUser: User; users: User[]; payments: Payment[]; programs: Program[]; sessions: Session[] }> = ({ currentUser, users, payments, programs, sessions }) => {
    const userOrChildrenIds = useMemo(() => {
        if (currentUser.role === 'Parent') {
            return users.filter(u => u.parent_id === currentUser.user_id).map(u => u.user_id);
        }
        return [currentUser.user_id];
    }, [currentUser, users]);

    const bookings = useMemo(() => {
        return payments
            .filter(p => userOrChildrenIds.includes(p.user_id))
            .map(payment => {
                const program = programs.find(prog => prog.program_id === payment.program_id);
                const user = users.find(u => u.user_id === payment.user_id);
                const upcomingSessions = sessions.filter(s => s.program_id === payment.program_id && new Date(s.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                return { payment, program, user, upcomingSessions };
            })
            .filter(booking => booking.program); // Filter out bookings with no matching program
    }, [userOrChildrenIds, payments, programs, sessions, users]);

    return (
        <div className="bookings-container">
            {bookings.length > 0 ? bookings.map(({ payment, program, user, upcomingSessions }) => (
                <div key={payment.payment_id} className="card booking-card">
                    <div className="booking-card-header">
                        <div>
                            <h3>{program!.title}</h3>
                            {currentUser.role === 'Parent' && <p className="booking-card-athlete">For: {user?.name}</p>}
                        </div>
                        <div className="booking-card-payment-info">
                            <span className="booking-card-price">KES {payment.amount.toLocaleString()}</span>
                            <span className={`payment-status status-${payment.status}`}>{payment.status}</span>
                        </div>
                    </div>
                    <div className="booking-card-body">
                        <h4>Upcoming Sessions</h4>
                        {upcomingSessions.length > 0 ? (
                            <ul className="booking-session-list">
                                {upcomingSessions.map(session => (
                                    <li key={session.session_id}>
                                        <span>{new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span>{session.time}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No upcoming sessions scheduled for this program.</p>
                        )}
                    </div>
                     <div className="booking-card-footer">
                        {payment.status === 'pending' && <button className="btn btn-primary btn-sm">Pay Now</button>}
                        {payment.status === 'failed' && <button className="btn btn-secondary btn-sm">Retry Payment</button>}
                    </div>
                </div>
            )) : (
                 <div className="card">
                    <h3>No Bookings Found</h3>
                    <p>You have not booked any programs yet. Visit the "Browse Programs" section to get started.</p>
                </div>
            )}
        </div>
    );
};


const BrowseProgramsView: FC<{ programs: Program[], currentUser: User, payments: Payment[], onBook: (program: Program) => void, users: User[] }> = ({ programs, currentUser, payments, onBook, users }) => {
    const isEnrolled = (programId: number) => {
        if(currentUser.role === 'Parent') {
            const children = users.filter(u => u.parent_id === currentUser.user_id);
            return children.some(child => payments.some(p => p.program_id === programId && p.user_id === child.user_id));
        }
        return payments.some(p => p.program_id === programId && p.user_id === currentUser.user_id);
    }
    const getCoachName = (id: number) => users.find(u => u.user_id === id)?.name || 'Unknown';
    return(
    <div className="program-booking-grid">
        {programs.map(p => (
            <div key={p.program_id} className="card program-card">
                <h3>{p.title}</h3>
                <p className="program-card-coach">with {getCoachName(p.coach_id)}</p>
                <p>{p.description}</p>
                <div className="program-card-details">
                    <span><strong>Schedule:</strong> {p.schedule}</span>
                    <span><strong>Duration:</strong> {p.duration}</span>
                    <span><strong>Level:</strong> <span className={`skill-badge skill-${p.skillLevel.split(' ')[0].toLowerCase()}`}>{p.skillLevel}</span></span>
                </div>
                <div className="program-card-footer">
                    <span className="program-card-price">KES {p.price.toLocaleString()}</span>
                    <button className="btn btn-primary" onClick={() => onBook(p)} disabled={isEnrolled(p.program_id)}>
                        {isEnrolled(p.program_id) ? 'Enrolled' : 'Book Now'}
                    </button>
                </div>
            </div>
        ))}
    </div>
)};

const ScheduleView: FC<{ sessions: Session[], programs: Program[], users: User[], onSessionClick: (session: Session) => void }> = ({ sessions, programs, users, onSessionClick }) => {
    const getProgramTitle = (id: number) => programs.find(p => p.program_id === id)?.title || 'Unknown Program';
    const getCoachName = (id: number) => users.find(u => u.user_id === id)?.name || 'Unknown Coach';
    
    const groupedSessions = sessions.reduce((acc, session) => {
        const date = new Date(session.date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    return (
        <div className="schedule-container">
            {Object.entries(groupedSessions).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, dateSessions]) => (
                <div key={date}>
                    <h3 className="schedule-date-header">{date}</h3>
                    <div className="schedule-list">
                        {dateSessions.sort((a,b) => a.time.localeCompare(b.time)).map(session => (
                            <div key={session.session_id} className="schedule-item card" onClick={() => onSessionClick(session)}>
                                <div className="schedule-item-time">{session.time}</div>
                                <div className="schedule-item-details">
                                    <h4>{getProgramTitle(session.program_id)}</h4>
                                    <p>{session.title}</p>
                                    <p>Coach: {getCoachName(session.coach_id)}</p>
                                </div>
                                <div className="schedule-item-attendees">{session.athlete_ids.length} Registered</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

const UserProfilePage: FC<{ profileUser: User; currentUser: User; users: User[]; progress: Progress[]; onEditUser: (user: User) => void; showTooltip: ShowTooltipFn; hideTooltip: HideTooltipFn; }> = ({ profileUser, currentUser, users, progress, onEditUser, showTooltip, hideTooltip }) => {
    const isOwnProfile = profileUser.user_id === currentUser.user_id;
    const canEdit = currentUser.role === 'Admin';
    const children = profileUser.role === 'Parent' ? users.filter(u => u.parent_id === profileUser.user_id) : [];
    const assignedAthletes = profileUser.role === 'Coach' ? users.filter(u => u.coach_id === profileUser.user_id) : [];
    const userProgress = profileUser.role === 'Athlete' ? progress.filter(p => p.athlete_id === profileUser.user_id) : [];

    const getParentName = (id: number | null) => id ? users.find(u => u.user_id === id)?.name : 'N/A';
    const getCoachName = (id: number | null) => id ? users.find(u => u.user_id === id)?.name : 'N/A';

    return (
        <div className="profile-container">
            <div className="card profile-header-card">
                <div className="profile-info">
                    <h2>{profileUser.name}</h2>
                    <p>{profileUser.email}</p>
                    <span className={`role-badge role-${profileUser.role.toLowerCase()}`}>{profileUser.role}</span>
                </div>
                {canEdit && <button className="btn btn-primary" onClick={() => onEditUser(profileUser)}><PencilIcon/> Edit User</button>}
            </div>
            
            <div className="card profile-details-card">
                <h3>Personal Information</h3>
                <div className="profile-details-grid">
                    <div><strong>Full Name:</strong> {profileUser.name}</div>
                    <div><strong>Email:</strong> {profileUser.email}</div>
                    <div><strong>Date of Birth:</strong> {profileUser.date_of_birth}</div>
                    {profileUser.role === 'Athlete' && <>
                        <div><strong>Parent:</strong> {getParentName(profileUser.parent_id)}</div>
                        <div><strong>Assigned Coach:</strong> {getCoachName(profileUser.coach_id)}</div>
                    </>}
                </div>
            </div>

            {profileUser.role === 'Athlete' && userProgress.length > 0 && (
                <div className="card">
                    <h3>My Progress</h3>
                    <BarChart data={userProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/>
                </div>
            )}

            {profileUser.role === 'Parent' && children.length > 0 && (
                <div className="card">
                    <h3>My Children</h3>
                    {children.map(child => {
                        const childProgress = progress.filter(p => p.athlete_id === child.user_id);
                        return (
                            <div key={child.user_id} className="profile-child-section">
                                <h4>{child.name}'s Progress</h4>
                                {childProgress.length > 0 ? (
                                    <BarChart data={childProgress.map(p => ({ label: p.skill, value: p.percentage }))} showTooltip={showTooltip} hideTooltip={hideTooltip} yAxisLabel="Progress %"/>
                                ) : <p>No progress data available for {child.name}.</p>}
                            </div>
                        )
                    })}
                </div>
            )}
            
            {profileUser.role === 'Coach' && assignedAthletes.length > 0 && (
                <div className="card">
                    <h3>Assigned Athletes</h3>
                    <div className="table-container">
                        <table>
                            <thead><tr><th>Name</th><th>Date of Birth</th><th>Parent</th></tr></thead>
                            <tbody>
                                {assignedAthletes.map(athlete => (
                                    <tr key={athlete.user_id}>
                                        <td>{athlete.name}</td>
                                        <td>{athlete.date_of_birth}</td>
                                        <td>{getParentName(athlete.parent_id)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}


// --- Main App Component ---
const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [programs, setPrograms] = useLocalStorage<Program[]>('programs', initialPrograms);
    const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', initialSessions);
    const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialPayments);
    const [progress, setProgress] = useLocalStorage<Progress[]>('progress', initialProgress);

    const [view, setView] = useState('Dashboard');
    const [error, setError] = useState('');
    const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0 });
    const [modal, setModal] = useState<ModalState>({ type: null });
    const [viewingProfile, setViewingProfile] = useState<User | null>(null);

    const showTooltip: ShowTooltipFn = (content, event) => setTooltip({ visible: true, content, x: event.clientX, y: event.clientY });
    const hideTooltip: HideTooltipFn = () => setTooltip(prev => ({ ...prev, visible: false }));

    const displayUser = impersonatedUser || currentUser;

    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password_hash === pass);
        if (user) { setCurrentUser(user); setError(''); } else { setError('Invalid email or password.'); }
    };
    const handleLogout = () => { setCurrentUser(null); setImpersonatedUser(null); setViewingProfile(null); setView('Dashboard'); };
    const handleImpersonate = (user: User) => { if (currentUser?.role === 'Admin') { setImpersonatedUser(user); setView('Dashboard'); } };
    const stopImpersonating = () => { setImpersonatedUser(null); setView('Dashboard'); };

    // --- CRUD Handlers ---
    const handleSaveUser = (user: User) => {
        setUsers(prev => user.user_id ? prev.map(u => u.user_id === user.user_id ? user : u) : [...prev, { ...user, user_id: Date.now() }]);
        if(viewingProfile?.user_id === user.user_id) setViewingProfile(user); // Update profile view if editing the current profile
        setModal({type: null});
    };
    const handleDeleteUser = (user: User) => {
        setUsers(prev => prev.filter(u => u.user_id !== user.user_id));
        setModal({type: null});
    };
     const handleSaveProgram = (program: Program) => {
        setPrograms(prev => program.program_id ? prev.map(p => p.program_id === program.program_id ? program : p) : [...prev, { ...program, program_id: Date.now() }]);
        setModal({type: null});
    };
    const handleDeleteProgram = (program: Program) => {
        setPrograms(prev => prev.filter(p => p.program_id !== program.program_id));
        setModal({type: null});
    };
    const handleConfirmBooking = (program: Program, athleteId: number) => {
        if (!athleteId) return;
        const isEnrolled = payments.some(p => p.program_id === program.program_id && p.user_id === athleteId);
        if (isEnrolled) {
            alert('This athlete is already enrolled in this program.');
            setModal({type: null});
            return;
        }

        const newPayment: Payment = { payment_id: Date.now(), user_id: athleteId, program_id: program.program_id, amount: program.price, status: 'pending', paid_at: null };
        setPayments(prev => [...prev, newPayment]);
        alert(`${program.title} booked! Please complete the payment from the My Bookings section.`);
        setModal({type: null});
    };
    const handleSessionRegister = (sessionId: number, athleteId: number, register: boolean) => {
        setSessions(prev => prev.map(s => {
            if(s.session_id !== sessionId) return s;
            const updatedAthletes = register 
                ? [...s.athlete_ids, athleteId]
                : s.athlete_ids.filter(id => id !== athleteId);
            return {...s, athlete_ids: Array.from(new Set(updatedAthletes))}; // Ensure unique IDs
        }));
    }
    const handleUpdateAttendance = (sessionId: number, confirmedIds: number[]) => {
        setSessions(prev => prev.map(s => s.session_id === sessionId ? {...s, confirmed_athlete_ids: confirmedIds} : s));
        setModal({type: null});
        alert('Attendance saved!');
    }


    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} error={error} />;
    }

    const navigationLinks = {
        Admin: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Users', icon: UserGroupIcon }, { name: 'Programs', icon: DocumentTextIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Coach: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Schedule', icon: CalendarIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Parent: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Browse Programs', icon: BookOpenIcon}, { name: 'My Bookings', icon: CreditCardIcon }, { name: 'Schedule', icon: CalendarIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
        Athlete: [ { name: 'Dashboard', icon: ChartPieIcon }, { name: 'Browse Programs', icon: BookOpenIcon}, { name: 'My Bookings', icon: CreditCardIcon }, { name: 'Schedule', icon: CalendarIcon }, { name: 'My Profile', icon: UserCircleIcon } ],
    };

    const renderView = () => {
        switch (view) {
            case 'Dashboard':
                if (displayUser?.role === 'Admin') return <AdminDashboard users={users} programs={programs} payments={payments} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Coach') return <CoachDashboard currentUser={displayUser} users={users} progress={progress} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Parent') return <ParentDashboard currentUser={displayUser} users={users} progress={progress} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                if (displayUser?.role === 'Athlete') return <AthleteDashboard currentUser={displayUser} progress={progress} showTooltip={showTooltip} hideTooltip={hideTooltip} />;
                return null;
            case 'Users': return <UserManagement users={users} onImpersonate={handleImpersonate} onEdit={(u) => setModal({type: 'edit-user', data: u})} onDelete={(u) => setModal({type: 'delete-user', data: u})} onAdd={() => setModal({type: 'add-user'})} onViewProfile={(u) => { setViewingProfile(u); setView('User Profile'); }} />;
            case 'Programs': return <ProgramManagement programs={programs} users={users} onEdit={(p) => setModal({type: 'edit-program', data: p})} onDelete={(p) => setModal({type: 'delete-program', data: p})} onAdd={() => setModal({type: 'add-program'})} />;
            case 'My Bookings': return <MyBookingsView currentUser={displayUser!} users={users} payments={payments} programs={programs} sessions={sessions} />;
            case 'Browse Programs': return <BrowseProgramsView programs={programs} currentUser={displayUser!} payments={payments} users={users} onBook={(p) => setModal({ type: 'book-program', data: p })} />;
            case 'Schedule': return <ScheduleView sessions={sessions} programs={programs} users={users} onSessionClick={(s) => setModal({type: 'session-details', data: s})} />;
            case 'My Profile': setView('User Profile'); setViewingProfile(displayUser); return null;
            case 'User Profile': return viewingProfile && <UserProfilePage profileUser={viewingProfile} currentUser={displayUser!} users={users} progress={progress} onEditUser={(u) => setModal({type: 'edit-user', data: u})} showTooltip={showTooltip} hideTooltip={hideTooltip}/>;
            default: return <div>Not Found</div>;
        }
    };
    
    return (
        <>
            <Tooltip tooltip={tooltip} />
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <div>
                        <div className="sidebar-header"><h3>Funport Club</h3></div>
                        <nav className="sidebar-nav">
                            <ul>
                                {displayUser && navigationLinks[displayUser.role].map(link => (
                                    <li key={link.name}>
                                        <a href="#" className={view === link.name ? 'active' : ''} onClick={(e) => { e.preventDefault(); setViewingProfile(null); setView(link.name); }}>
                                            <link.icon />
                                            <span>{link.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                <main className="main-content">
                    {impersonatedUser && (
                        <div className="impersonation-banner">
                            <EyeIcon />
                            <span>Viewing as {impersonatedUser.name} ({impersonatedUser.role})</span>
                            <button onClick={stopImpersonating} className="btn-secondary btn-sm">Stop Impersonating</button>
                        </div>
                    )}
                    <header className="header">
                        <div className="header-content">
                            <h2>{view}</h2>
                            <div className="header-right">
                                <span>Welcome, {displayUser?.name}</span>
                                <button className="btn-icon" onClick={handleLogout} title="Logout">
                                    <LogoutIcon />
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="content-area">
                        {renderView()}
                    </div>
                </main>
            </div>
            {modal.type === 'session-details' && modal.data && <SessionDetailsModal session={modal.data} users={users} programs={programs} currentUser={displayUser!} onRegister={handleSessionRegister} onUpdateAttendance={handleUpdateAttendance} onClose={() => setModal({ type: null })} />}
            {(modal.type === 'add-user' || modal.type === 'edit-user') && <UserFormModal user={modal.data} users={users} onSave={handleSaveUser} onClose={() => setModal({ type: null })} />}
            {(modal.type === 'add-program' || modal.type === 'edit-program') && <ProgramFormModal program={modal.data} users={users} onSave={handleSaveProgram} onClose={() => setModal({ type: null })} />}
            {(modal.type === 'delete-user' || modal.type === 'delete-program') && (
                <ConfirmationModal
                    title={`Delete ${modal.type.includes('user') ? 'User' : 'Program'}`}
                    message={`Are you sure you want to delete ${modal.data.name || modal.data.title}? This action cannot be undone.`}
                    onConfirm={() => modal.type === 'delete-user' ? handleDeleteUser(modal.data) : handleDeleteProgram(modal.data)}
                    onCancel={() => setModal({ type: null })}
                />
            )}
            {modal.type === 'book-program' && modal.data && <ProgramBookingModal program={modal.data} currentUser={displayUser!} users={users} onConfirm={handleConfirmBooking} onClose={() => setModal({ type: null })} />}
        </>
    );
};

const LoginPage: FC<{ onLogin: (email: string, pass: string) => void, error: string }> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('admin@funport.com');
    const [password, setPassword] = useState('password123');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Funport Skating Club</h1>
                <p>Welcome! Please sign in to your account.</p>
                {error && <p className="form-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Login</button>
                </form>
            </div>
        </div>
    );
};

const ConfirmationModal: FC<{ title: string, message: string, onConfirm: () => void, onCancel: () => void }> = ({ title, message, onConfirm, onCancel }) => (
    <Modal title={title} onClose={onCancel}>
        <p>{message}</p>
        <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Confirm Delete</button>
        </div>
    </Modal>
);

const UserFormModal: FC<{ user?: User, users: User[], onSave: (user: User) => void, onClose: () => void }> = ({ user, users, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<User, 'user_id' | 'password_hash'> & {user_id?: number} >(
        user || { name: '', email: '', role: 'Athlete', date_of_birth: '', parent_id: null, coach_id: null }
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'parent_id' || name === 'coach_id' ? (value ? Number(value) : null) : value }));
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, password_hash: user?.password_hash || 'password123', user_id: formData.user_id || 0}); // Add password hashing in real app
    }
    const coaches = users.filter(u => u.role === 'Coach');
    const parents = users.filter(u => u.role === 'Parent');
    
    return (
        <Modal title={user ? "Edit User" : "Add User"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required/>
                    </div>
                     <div className="form-group">
                        <label>Date of Birth</label>
                        <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option>Admin</option><option>Coach</option><option>Parent</option><option>Athlete</option>
                        </select>
                    </div>
                    {formData.role === 'Athlete' && <>
                        <div className="form-group">
                            <label>Parent</label>
                            <select name="parent_id" value={formData.parent_id || ''} onChange={handleChange}>
                                <option value="">None</option>
                                {parents.map(p => <option key={p.user_id} value={p.user_id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Coach</label>
                            <select name="coach_id" value={formData.coach_id || ''} onChange={handleChange}>
                                <option value="">None</option>
                                {coaches.map(c => <option key={c.user_id} value={c.user_id}>{c.name}</option>)}
                            </select>
                        </div>
                    </>}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save User</button>
                </div>
            </form>
        </Modal>
    )
}

const ProgramFormModal: FC<{ program?: Program, users: User[], onSave: (p: Program) => void, onClose: () => void }> = ({ program, users, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Program, 'program_id'> & { program_id?: number }>(
        program || { title: '', description: '', schedule: '', coach_id: 0, price: 0, duration: '', skillLevel: 'All Levels' }
    );
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'coach_id' || name === 'price' ? Number(value) : value }));
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.coach_id) { alert('Please select a coach.'); return; }
        onSave({ ...formData, program_id: formData.program_id || 0});
    }
    const coaches = users.filter(u => u.role === 'Coach');

    return (
        <Modal title={program ? "Edit Program" : "Add Program"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                </div>
                 <div className="form-grid">
                    <div className="form-group">
                        <label>Schedule</label>
                        <input name="schedule" value={formData.schedule} onChange={handleChange} required/>
                    </div>
                     <div className="form-group">
                        <label>Duration</label>
                        <input name="duration" value={formData.duration} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Price (KES)</label>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Coach</label>
                        <select name="coach_id" value={formData.coach_id} onChange={handleChange} required>
                            <option value={0} disabled>Select a coach</option>
                            {coaches.map(c => <option key={c.user_id} value={c.user_id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Skill Level</label>
                        <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                            <option>All Levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Program</button>
                </div>
            </form>
        </Modal>
    )
}

const SessionDetailsModal: FC<{ session: Session, users: User[], programs: Program[], currentUser: User, onRegister: (sessionId: number, athleteId: number, register: boolean) => void, onUpdateAttendance: (sessionId: number, confirmedIds: number[]) => void, onClose: () => void }> = ({ session, users, programs, currentUser, onRegister, onUpdateAttendance, onClose }) => {
    const program = programs.find(p => p.program_id === session.program_id);
    const coach = users.find(u => u.user_id === session.coach_id);
    const registeredAthletes = users.filter(u => session.athlete_ids.includes(u.user_id));
    const children = currentUser.role === 'Parent' ? users.filter(u => u.parent_id === currentUser.user_id) : [];

    const [confirmedIds, setConfirmedIds] = useState(new Set(session.confirmed_athlete_ids));
    const handleAttendanceChange = (athleteId: number, isPresent: boolean) => {
        setConfirmedIds(prev => {
            const newSet = new Set(prev);
            if(isPresent) newSet.add(athleteId);
            else newSet.delete(athleteId);
            return newSet;
        });
    }

    return (
        <Modal title={`Session Details: ${program?.title}`} onClose={onClose}>
            <p><strong>Date:</strong> {new Date(session.date).toDateString()}</p>
            <p><strong>Time:</strong> {session.time}</p>
            <p><strong>Coach:</strong> {coach?.name}</p>
            <hr style={{margin: '16px 0'}}/>

            <h4>{currentUser.role === 'Coach' ? 'Take Attendance' : `Registered Athletes (${registeredAthletes.length})`}</h4>
            <ul className="attendee-list">
                {registeredAthletes.length > 0 ? registeredAthletes.map(a => (
                    <li key={a.user_id} className="attendee-item">
                        {currentUser.role === 'Coach' ? (
                            <label>
                                <input type="checkbox" checked={confirmedIds.has(a.user_id)} onChange={(e) => handleAttendanceChange(a.user_id, e.target.checked)}/>
                                {a.name}
                            </label>
                        ) : (
                            <span>{a.name} {session.confirmed_athlete_ids.includes(a.user_id) ? '(Attended)' : ''}</span>
                        )}
                    </li>
                )) : <li>No athletes registered yet.</li>}
            </ul>

            <div className="modal-actions">
                {currentUser.role === 'Athlete' && (
                    !session.athlete_ids.includes(currentUser.user_id) ?
                    <button className="btn btn-primary" onClick={() => onRegister(session.session_id, currentUser.user_id, true)}>Register</button> :
                    <button className="btn btn-danger" onClick={() => onRegister(session.session_id, currentUser.user_id, false)}>Unregister</button>
                )}
                {currentUser.role === 'Parent' && children.map(child => (
                     !session.athlete_ids.includes(child.user_id) ?
                    <button key={child.user_id} className="btn btn-primary" onClick={() => onRegister(session.session_id, child.user_id, true)}>Register {child.name}</button> :
                    <button key={child.user_id} className="btn btn-danger" onClick={() => onRegister(session.session_id, child.user_id, false)}>Unregister {child.name}</button>
                ))}
                {currentUser.role === 'Coach' && <button className="btn btn-primary" onClick={() => onUpdateAttendance(session.session_id, Array.from(confirmedIds))}>Save Attendance</button>}
                 <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
}

const ProgramBookingModal: FC<{ program: Program, currentUser: User, users: User[], onConfirm: (program: Program, athleteId: number) => void, onClose: () => void }> = ({ program, currentUser, users, onConfirm, onClose }) => {
    const children = useMemo(() => users.filter(u => u.role === 'Athlete' && u.parent_id === currentUser.user_id), [users, currentUser]);
    const [selectedChild, setSelectedChild] = useState<number | undefined>(children.length > 0 ? children[0].user_id : undefined);

    const handleConfirm = () => {
        if (currentUser.role === 'Athlete') {
            onConfirm(program, currentUser.user_id);
        } else if (currentUser.role === 'Parent' && selectedChild) {
            onConfirm(program, selectedChild);
        } else {
            alert("Please select a child to enroll.");
        }
    };

    return (
        <Modal title={`Book Program: ${program.title}`} onClose={onClose}>
            <p>You are about to book the following program. This will create a pending payment which you can complete from the My Bookings section.</p>
            <div className="booking-details">
                <span><strong>Price:</strong> KES {program.price.toLocaleString()}</span>
                <span><strong>Duration:</strong> {program.duration}</span>
            </div>

            {currentUser.role === 'Parent' && (
                <div className="form-group" style={{marginTop: '16px'}}>
                    <label>Enroll for which child?</label>
                    {children.length > 0 ? (
                        <select value={selectedChild} onChange={e => setSelectedChild(Number(e.target.value))}>
                            {children.map(child => <option key={child.user_id} value={child.user_id}>{child.name}</option>)}
                        </select>
                    ) : (
                        <p>You have no children registered. Please add a child user first.</p>
                    )}
                </div>
            )}
             {currentUser.role === 'Athlete' && (
                <p style={{marginTop: '16px'}}>This program will be booked for <strong>{currentUser.name}</strong>.</p>
            )}

            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleConfirm} disabled={currentUser.role === 'Parent' && !selectedChild}>Confirm Booking</button>
            </div>
        </Modal>
    );
}

export default App;
