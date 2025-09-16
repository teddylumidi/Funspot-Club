import React, { useState, useEffect, useRef, SetStateAction, useMemo, FC } from 'react';

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

// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
type PaymentStatus = 'paid' | 'pending' | 'failed';

interface User { user_id: number; name: string; email: string; password_hash: string; role: Role; date_of_birth: string; parent_id: number | null; coach_id?: number; }
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
const initialPayments: Payment[] = [
    { payment_id: 1, user_id: 4, program_id: 1, amount: 8000, status: 'paid', paid_at: '2024-07-01T10:05:00Z' }, { payment_id: 2, user_id: 6, program_id: 1, amount: 8000, status: 'pending', paid_at: null }, { payment_id: 3, user_id: 8, program_id: 2, amount: 6000, status: 'failed', paid_at: null }, { payment_id: 4, user_id: 4, program_id: 3, amount: 5000, status: 'paid', paid_at: '2024-06-15T10:05:00Z' },
];
const initialProgress: Progress[] = [
    { progress_id: 1, athlete_id: 5, skill: 'Balance', percentage: 80, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 2, athlete_id: 5, skill: 'Gliding', percentage: 60, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 3, athlete_id: 7, skill: 'Stopping', percentage: 85, updated_at: '2024-07-18T09:00:00Z' }, { progress_id: 4, athlete_id: 8, skill: 'Spins', percentage: 90, updated_at: '2024-07-19T09:00:00Z' },
];

// --- Tooltip State ---
interface Tooltip { visible: boolean; content: string; x: number; y: number; }
const [tooltip, setTooltip] = useState<Tooltip>({ visible: false, content: '', x: 0, y: 0 });
const showTooltip = (content: string, event: React.MouseEvent) => {
    setTooltip({ visible: true, content, x: event.clientX, y: event.clientY });
};
const hideTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));

// --- Reusable Components ---
const StatCard: FC<{ title: string; value: string; subValue?: string }> = ({ title, value, subValue }) => (
    <div className="stat-card">
        <h4 className="stat-title">{title}</h4>
        <p className="stat-value">{value}</p>
        {subValue && <p className="stat-sub-value">{subValue}</p>}
    </div>
);

const PieChart: FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let cumulative = 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="pie-chart-container">
            <svg className="pie-chart" width="200" height="200" viewBox="-100 -100 200 200">
                {data.map((item, index) => {
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

const BarChart: FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartWidth = 300;
    const chartHeight = 150;
    const barWidth = chartWidth / data.length;

    return (
        <div className="bar-chart-container">
            <svg width="100%" height="200" viewBox={`0 0 ${chartWidth + 40} ${chartHeight + 40}`}>
                <line className="axis" x1="40" y1="0" x2="40" y2={chartHeight} />
                <line className="axis" x1="40" y1={chartHeight} x2={chartWidth + 40} y2={chartHeight} />

                {data.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
                    const x = 40 + index * barWidth;
                    const y = chartHeight - barHeight;
                    const percentage = (item.value / maxValue * 100).toFixed(1);
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
                 <text x="15" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90 15,${chartHeight/2})`}>Value</text>
                 <text x="25" y="10" textAnchor="end">{maxValue}</text>
                 <text x="25" y={chartHeight} textAnchor="end">0</text>
            </svg>
        </div>
    );
};

const Tooltip: FC<{ tooltip: Tooltip }> = ({ tooltip }) => {
    if (!tooltip.visible) return null;
    return (
        <div
            className="chart-tooltip"
            style={{ left: tooltip.x, top: tooltip.y - 10 }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
    );
};


// --- Dashboards ---
const AdminDashboard: FC<{ users: User[], programs: Program[], payments: Payment[] }> = ({ users, programs, payments }) => {
    const [filters, setFilters] = useState({ role: 'All', skillLevel: 'All', paymentStatus: 'All', dateRange: 'All' });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredUsers = useMemo(() => users.filter(u => filters.role === 'All' || u.role === filters.role), [users, filters.role]);
    const filteredPrograms = useMemo(() => programs.filter(p => filters.skillLevel === 'All' || p.skillLevel === filters.skillLevel), [programs, filters.skillLevel]);
    const filteredPayments = useMemo(() => payments.filter(p => filters.paymentStatus === 'All' || p.status === filters.paymentStatus), [payments, filters.paymentStatus]);
    
    const totalRevenue = useMemo(() => filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0), [filteredPayments]);
    
    const userRoleData = useMemo(() => {
        const counts = filteredUsers.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<Role, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    }, [filteredUsers]);

    const athleteEnrollmentData = useMemo(() => {
        const athleteCounts = filteredPrograms.map(program => {
            const count = filteredUsers.filter(u => u.role === 'Athlete' && programs.find(p => p.program_id === u.coach_id)?.program_id === program.program_id).length;
            return { label: program.title.split(' ')[0], value: count };
        });
        return athleteCounts;
    }, [filteredUsers, filteredPrograms]);
    

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
                    <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} />
                    <StatCard title="Pending Payments" value={filteredPayments.filter(p => p.status === 'pending').length.toString()} />
                </div>
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>User Role Distribution</h3>
                        <PieChart data={userRoleData} />
                    </div>
                    <div className="chart-card">
                        <h3>Athlete Enrollment per Program</h3>
                        <BarChart data={athleteEnrollmentData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

const CoachDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[] }> = ({ currentUser, users, progress }) => {
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
                    <BarChart data={athleteProgressData} />
                </div>
            </div>
        </div>
    );
};

const ParentDashboard: FC<{ currentUser: User; users: User[]; progress: Progress[] }> = ({ currentUser, users, progress }) => {
    const children = users.filter(u => u.role === 'Athlete' && u.parent_id === currentUser.user_id);
    return (
        <div>
            {children.map(child => {
                const childProgress = progress.filter(p => p.athlete_id === child.user_id);
                return (
                    <div key={child.user_id} className="card" style={{ marginBottom: '24px' }}>
                        <h3>{child.name}'s Progress</h3>
                        <BarChart data={childProgress.map(p => ({ label: p.skill, value: p.percentage }))} />
                    </div>
                );
            })}
        </div>
    );
};

const AthleteDashboard: FC<{ currentUser: User; progress: Progress[] }> = ({ currentUser, progress }) => {
    const athleteProgress = progress.filter(p => p.athlete_id === currentUser.user_id);
    return (
        <div className="card">
            <h3>My Progress</h3>
            <BarChart data={athleteProgress.map(p => ({ label: p.skill, value: p.percentage }))} />
        </div>
    );
};

// Placeholder Management Views
const UserManagement = () => <div className="card">User Management Content</div>;
const ProgramManagement = () => <div className="card">Program Management Content</div>;
const PaymentManagement = () => <div className="card">Payment Management Content</div>;
const ScheduleView = () => <div className="card">Schedule Content</div>;
const ProgressView = () => <div className="card">Progress Content</div>;

// --- Main App Component ---
const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [programs, setPrograms] = useLocalStorage<Program[]>('programs', initialPrograms);
    const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialPayments);
    const [progress, setProgress] = useLocalStorage<Progress[]>('progress', initialProgress);

    const [view, setView] = useState('Dashboard');
    const [error, setError] = useState('');

    const displayUser = impersonatedUser || currentUser;

    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password_hash === pass);
        if (user) {
            setCurrentUser(user);
            setError('');
        } else {
            setError('Invalid email or password.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setImpersonatedUser(null);
        setView('Dashboard');
    };

    const handleImpersonate = (user: User) => {
        if (currentUser?.role === 'Admin') {
            setImpersonatedUser(user);
            setView('Dashboard');
        }
    };
    
    const stopImpersonating = () => {
        setImpersonatedUser(null);
        setView('Dashboard');
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} error={error} />;
    }

    const navigationLinks = {
        Admin: [
            { name: 'Dashboard', icon: ChartPieIcon },
            { name: 'Users', icon: UserGroupIcon },
            { name: 'Programs', icon: DocumentTextIcon },
            { name: 'Payments', icon: CreditCardIcon }
        ],
        Coach: [
            { name: 'Dashboard', icon: ChartPieIcon },
            { name: 'My Athletes', icon: UserGroupIcon },
            { name: 'Schedule', icon: CalendarIcon }
        ],
        Parent: [
            { name: 'Dashboard', icon: ChartPieIcon },
            { name: 'My Children', icon: UserGroupIcon },
            { name: 'Schedule', icon: CalendarIcon },
            { name: 'Payments', icon: CreditCardIcon }
        ],
        Athlete: [
            { name: 'Dashboard', icon: ChartPieIcon },
            { name: 'My Progress', icon: ChartBarIcon },
            { name: 'Schedule', icon: CalendarIcon }
        ],
    };

    const renderView = () => {
        switch (view) {
            case 'Dashboard':
                if (displayUser?.role === 'Admin') return <AdminDashboard users={users} programs={programs} payments={payments} />;
                if (displayUser?.role === 'Coach') return <CoachDashboard currentUser={displayUser} users={users} progress={progress} />;
                if (displayUser?.role === 'Parent') return <ParentDashboard currentUser={displayUser} users={users} progress={progress} />;
                if (displayUser?.role === 'Athlete') return <AthleteDashboard currentUser={displayUser} progress={progress} />;
                return null;
            case 'Users': return <UserManagement />;
            case 'Programs': return <ProgramManagement />;
            case 'Payments': return <PaymentManagement />;
            case 'Schedule': case 'My Athletes': case 'My Children': case 'My Progress': return <ScheduleView />;
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
                                        <a href="#" className={view === link.name ? 'active' : ''} onClick={() => setView(link.name)}>
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

export default App;
