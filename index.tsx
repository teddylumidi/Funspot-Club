
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// Custom hook to persist state to localStorage
const useStickyState = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        try {
            return stickyValue !== null
                ? JSON.parse(stickyValue)
                : defaultValue;
        } catch (error) {
            console.error(`Error parsing sticky state for key "${key}":`, error);
            window.localStorage.removeItem(key); // Clear corrupted data
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting sticky state for key "${key}":`, error);
        }
    }, [key, value]);

    return [value, setValue];
};


const initialAthletes = [
    { id: 1, name: 'Sarah Wanjiku', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', history: [
        { id: 4, date: '2025-09-12', description: 'Achieved a new high score of 92 in choreography.' },
        { id: 3, date: '2025-09-05', description: 'Completed speed circuit in 120 seconds.' },
        { id: 1, date: '2025-08-28', description: 'Mastered forward swizzles. Freestyle routine score: 85.' },
        { id: 2, date: '2025-08-20', description: 'First time on ice without assistance.' }
    ]},
    { id: 2, name: 'John Kamau', skillLevel: 'Intermediate', activity: 'Swimming', ageGroup: '15-18', history: [] },
    { id: 3, name: 'Aisha Mwalimu', skillLevel: 'Advanced', activity: 'Chess', ageGroup: '15-18', history: [
        { id: 3, date: '2025-09-01', description: 'Won local club tournament.'}
    ] },
    { id: 4, name: 'Peter Kiprotich', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', history: [] },
];

const initialCoaches = [
    { id: 1, name: 'David Omondi', email: 'david.o@example.com', phone: '0712345678', expertise: 'Skating' },
    { id: 2, name: 'Grace Njeri', email: 'grace.n@example.com', phone: '0787654321', expertise: 'Swimming' },
];

const initialEvents = [
    { id: 1, name: 'Annual Skating Gala', date: '2025-10-25', time: '09:00', location: 'Moi Stadium Kasarani', description: 'Our biggest skating event of the year. All levels welcome!', attendees: [1, 4] },
    { id: 2, name: 'Club Chess Tournament', date: '2025-08-15', time: '13:00', location: 'Club House', description: 'A friendly competition for all our chess enthusiasts.', attendees: [3] },
    { id: 3, name: 'Summer Swim Meet', date: '2026-01-10', time: '10:00', location: 'Aquatics Center', description: 'Join us for a fun day of swimming races and relays.', attendees: [] },
];

const initialPayments = [
    { id: 1, name: 'John Mwangi', amount: 2500, method: 'M-Pesa', reference: 'ABC123456789', date: '2025-09-02T10:30:00Z'},
    { id: 2, name: 'Aisha Mwalimu', amount: 1200, method: 'Card', reference: '**** **** **** 4532', date: '2025-09-02T07:45:00Z'},
    { id: 3, name: 'Peter Kiprotich', amount: 800, method: 'Cash', reference: 'CASH001', date: '2025-09-01T15:00:00Z'},
];

const initialAnnouncements = [
    { id: 1, title: 'Upcoming Holiday Closure', content: 'The club will be closed for the public holiday on October 10th. All sessions will be rescheduled.', date: '2025-09-15' },
    { id: 2, title: 'New Intermediate Skating Class', content: 'We are excited to announce a new intermediate skating class starting next month. Please register at the front desk.', date: '2025-09-10' },
];

const initialMessages = [
    {
        id: 1,
        sender: 'David Omondi',
        preview: 'Hi Sarah, great job today! Let\'s work...',
        timestamp: '10:47 AM',
        unread: 0,
        conversation: [
            {sender: 'David Omondi', text: 'Hi Sarah, great job today! Let\'s work on stops next week.', time: '10:45 AM'},
            {sender: 'You', text: 'Thanks, Coach! Sounds good.', time: '10:47 AM'}
        ]
    },
    {
        id: 2,
        sender: 'Grace Njeri',
        preview: 'Reminder: Swim meet practice is at 4pm...',
        timestamp: 'Yesterday',
        unread: 2,
        conversation: [
             {sender: 'Grace Njeri', text: 'Reminder: Swim meet practice is at 4pm tomorrow.', time: 'Yesterday'},
        ]
    }
];

const initialTasks = [
    { id: 1, title: 'Prepare U10 skating routine', completed: false, dueDate: '2025-10-15', assignedTo: 'David Omondi' },
    { id: 2, title: 'Finalize swim meet schedule', completed: true, dueDate: '2025-09-30', assignedTo: 'Grace Njeri' },
    { id: 3, title: 'Order new team uniforms', completed: false, dueDate: '2025-11-01', assignedTo: 'Admin' },
    { id: 4, title: 'Update club website with Gala info', completed: true, dueDate: '2025-09-25', assignedTo: 'Admin' },
];

// --- SVG Icons ---
const LogoIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 6.29c.18-.05.36-.09.55-.12.21-.03.43-.05.65-.05.43 0 .82.04 1.18.13.4.09.76.23 1.09.43.32.19.6.44.82.74.22.3.39.65.51 1.05.12.4.18.84.18 1.33 0 .49-.06.94-.18 1.35s-.29.77-.51 1.07-.49.54-.81.74-.69.34-1.09.43c-.36.09-.75.13-1.18.13-.22 0-.44-.02-.65-.05s-.37-.07-.55-.12V8.29zm-1.5 0v7.42c-.22.06-.44.1-.66.13-.24.03-.48.04-.72.04-.59 0-1.13-.08-1.62-.23s-.9-.38-1.24-.68-.6-.68-.78-1.13-.27-.96-.27-1.53c0-.57.09-1.08.27-1.54s.44-.85.78-1.16.75-.54 1.24-.71c.49-.17 1.03-.25 1.62-.25.24 0 .48.01.72.04.22.03.44.07.66.13z"/>
    </svg>
);
// Other icons (simplified for brevity)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM12 12.75c-1.875 0-3.75-.465-5.25-1.32" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25-2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 3V9" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const HamburgerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- Helper Components ---
const Card = ({ children, className = "" }) => <div className={`card ${className}`}>{children}</div>;
// FIX: Add types to CardHeader props to make them optional and fix missing props errors.
const CardHeader = ({ title, action, children }: { title?: any, action?: any, children?: any }) => (
    <div className="card-header">
        {title && <h3>{title}</h3>}
        {action && <a href="#" onClick={(e) => { e.preventDefault(); action.onClick(); }} className="view-all">{action.label}</a>}
        {children && <div className="card-header-actions">{children}</div>}
    </div>
);
// FIX: Add types to EmptyState props to make `action` optional.
const EmptyState = ({ icon, title, message, action }: { icon: any, title: any, message: any, action?: any }) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{message}</p>
        {action && <button className="btn btn-primary" onClick={action.onClick}>{action.label}</button>}
    </div>
);
const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} className="close-btn"><CloseIcon /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
const Toast = ({ message, type, icon }) => (
    <div className={`toast-notification ${type}`}>
        {icon}
        <span>{message}</span>
    </div>
);

// --- Main Pages ---

const DashboardPage = ({ setCurrentPage, events }) => {
    const upcomingEvent = useMemo(() => {
        const now = new Date();
        const futureEvents = events
            .filter(event => new Date(event.date) > now)
            // FIX: Use .getTime() for date comparison in sort function.
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return futureEvents[0] || null;
    }, [events]);

    const UpcomingEventBanner = ({ event, onClick }) => {
        if (!event) {
            return (
                <div className="upcoming-event-banner info">
                    <CalendarIcon />
                    <div className="banner-content">
                        <h4>No Upcoming Events</h4>
                        <p>Keep an eye on this space for future announcements!</p>
                    </div>
                </div>
            );
        }
        
        const eventDate = new Date(`${event.date}T${event.time}`);
        const formattedDate = eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="upcoming-event-banner" onClick={onClick}>
                <CalendarIcon />
                <div className="banner-content">
                    <h4>{event.name}</h4>
                    <p>{formattedDate} at {formattedTime} - {event.location}</p>
                </div>
                <span className="banner-action">View Details &rarr;</span>
            </div>
        );
    };


    return (
        <div className="page-container">
            <UpcomingEventBanner 
                event={upcomingEvent}
                onClick={() => upcomingEvent && setCurrentPage({ page: 'eventDetails', id: upcomingEvent.id })}
            />
            <div className="stats-grid">
                {/* Stats cards */}
            </div>
            <div className="main-layout">
                <Card>
                    <CardHeader title="Recent Activity" />
                    {/* Activity list */}
                </Card>
                <Card>
                    <CardHeader title="Quick Actions" />
                    <div className="quick-actions">
                         {/* Quick actions list */}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const AthletesPage = ({ athletes, setCurrentPage }) => (
    <div className="page-container">
        <Card>
            <CardHeader title="All Athletes">
                <button className="btn btn-primary" onClick={() => setCurrentPage({ page: 'addAthlete' })}>
                    <PlusIcon /> Add Athlete
                </button>
            </CardHeader>
            <div className="list-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Skill Level</th>
                            <th>Activity</th>
                            <th>Age Group</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {athletes.map(athlete => (
                            <tr key={athlete.id} onClick={() => setCurrentPage({ page: 'athleteProfile', id: athlete.id })} style={{cursor: 'pointer'}}>
                                <td data-label="Name" data-clickable="true">{athlete.name}</td>
                                <td data-label="Skill Level"><span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></td>
                                <td data-label="Activity">{athlete.activity}</td>
                                <td data-label="Age Group">{athlete.ageGroup}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons" onClick={e => e.stopPropagation()}>
                                        <button className="action-btn-icon edit-btn" onClick={() => setCurrentPage({ page: 'editAthlete', id: athlete.id })}><EditIcon /></button>
                                        <button className="action-btn-icon delete-btn"><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const ProgressChart = ({ data }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 250 });

    useEffect(() => {
        if (svgRef.current) {
            setDimensions({ width: svgRef.current.clientWidth, height: 250 });
        }
    }, []);

    if (data.length < 2) return null;

    const { width, height } = dimensions;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };

    const minDate = data[0].date;
    const maxDate = data[data.length - 1].date;
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    const xScale = (date) => {
        const timeDiff = maxDate.getTime() - minDate.getTime();
        if (timeDiff === 0) return padding.left;
        return padding.left + ((date.getTime() - minDate.getTime()) / timeDiff) * (width - padding.left - padding.right);
    };

    const yScale = (value) => {
        const valueRange = maxValue - minValue;
        if (valueRange === 0) return height - padding.bottom;
        return (height - padding.bottom) - ((value - minValue) / valueRange) * (height - padding.top - padding.bottom);
    };

    const linePath = data.map(d => `${xScale(d.date)},${yScale(d.value)}`).join(' L ');
    const areaPath = `M ${xScale(data[0].date)},${height - padding.bottom} L ` + linePath + ` L ${xScale(maxDate)},${height - padding.bottom} Z`;

    const yAxisLabels = () => {
        const ticks = 5;
        const labels = [];
        const range = maxValue - minValue;
        for (let i = 0; i <= ticks; i++) {
            const value = minValue + (range / ticks) * i;
            labels.push({ value: value.toFixed(0), y: yScale(value) });
        }
        return labels;
    };
    
    return (
        <div className="chart-container" ref={svgRef}>
            {width > 0 && (
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary-pink)" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="var(--primary-pink)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <g className="grid-line">
                        {yAxisLabels().map(({ y }, i) => (
                           <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} />
                        ))}
                    </g>
                    
                    {/* Y-axis labels */}
                    {yAxisLabels().map(({ value, y }, i) => (
                        <text key={i} x={padding.left - 8} y={y + 4} textAnchor="end">{value}</text>
                    ))}
                    
                    {/* X-axis labels */}
                     <text x={xScale(minDate)} y={height - padding.bottom + 20} textAnchor="start">{minDate.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</text>
                     <text x={xScale(maxDate)} y={height - padding.bottom + 20} textAnchor="end">{maxDate.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</text>

                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path d={`M ${linePath}`} fill="none" stroke="var(--primary-pink)" strokeWidth="2" />

                    {data.map((d, i) => (
                        <circle key={i} cx={xScale(d.date)} cy={yScale(d.value)} r="4" fill="var(--primary-pink)" stroke="var(--bg-card)" strokeWidth="2" />
                    ))}
                </svg>
            )}
        </div>
    );
};

const AthleteProfilePage = ({ athlete, setCurrentPage }) => {
     const chartData = useMemo(() => {
        if (!athlete || !athlete.history) return [];
        return athlete.history
            .map(item => {
                const match = item.description.match(/(\d+(\.\d+)?)/);
                if (match) {
                    return { date: new Date(item.date), value: parseFloat(match[0]) };
                }
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [athlete]);

    if (!athlete) return <p>Athlete not found.</p>;

    return (
        <div className="page-container">
            <button onClick={() => setCurrentPage({ page: 'athletes' })} className="back-btn"><BackIcon /> Back to Athletes</button>
            <Card>
                <CardHeader title={athlete.name}>
                    <button className="btn btn-secondary" onClick={() => {/* edit */}}><EditIcon /> Edit</button>
                    <button className="btn btn-danger" onClick={() => {/* delete */}}><DeleteIcon /> Delete</button>
                </CardHeader>
                <div className="profile-details">
                    <p><strong>Skill Level:</strong> <span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></p>
                    <p><strong>Primary Activity:</strong> {athlete.activity}</p>
                    <p><strong>Age Group:</strong> {athlete.ageGroup}</p>
                </div>
            </Card>
            <Card>
                <CardHeader title="Progress History" />
                 {chartData.length >= 2 ? (
                    <ProgressChart data={chartData} />
                ) : (
                    <div className="chart-placeholder">
                        <p>Add history logs with numerical data (e.g., "score: 85", "time: 120s") to generate a progress chart.</p>
                    </div>
                )}
                <div className="history-list">
                    {athlete.history.length > 0 ? athlete.history.map(item => (
                        <div key={item.id} className="history-item">
                            <div>
                                <p>{item.description}</p>
                                <small>{item.date}</small>
                            </div>
                        </div>
                    )) : <p>No history entries yet.</p>}
                </div>
            </Card>
        </div>
    );
};

const EventDetailsPage = ({ event, setCurrentPage }) => {
    if (!event) return <p>Event not found.</p>;
    const eventDate = new Date(`${event.date}T${event.time}`);

    return (
         <div className="page-container">
            <button onClick={() => setCurrentPage({ page: 'events' })} className="back-btn"><BackIcon /> Back to Events</button>
            <Card>
                 <CardHeader title={event.name} />
                 <div className="event-details-page-card">
                     <p><strong>Date:</strong> {eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                     <p><strong>Time:</strong> {eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                     <p><strong>Location:</strong> {event.location}</p>
                     <p><strong>Description:</strong> {event.description}</p>
                     <button className="btn btn-primary" style={{marginTop: '20px'}}>Register for Event</button>
                 </div>
            </Card>
        </div>
    );
};

const TasksPage = ({ tasks: initialTasks }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Descending');

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const processedTasks = useMemo(() => {
        let filtered = tasks;
        if (filter !== 'All') {
            filtered = tasks.filter(t => filter === 'Completed' ? t.completed : !t.completed);
        }
        
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            if (sort === 'Ascending') {
                return dateA.getTime() - dateB.getTime();
            }
            return dateB.getTime() - dateA.getTime();
        });
    }, [tasks, filter, sort]);

    return (
        <div className="page-container">
            <Card>
                <CardHeader title="Task Management" />
                <div className="page-controls">
                    <div className="filters">
                         <select value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Completed">Completed</option>
                            <option value="Incomplete">Incomplete</option>
                        </select>
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="Descending">Due Date (Newest)</option>
                            <option value="Ascending">Due Date (Oldest)</option>
                        </select>
                    </div>
                </div>
                
                {processedTasks.length === 0 ? (
                    <EmptyState 
                        icon={<TaskIcon />}
                        title="No Tasks Found"
                        message="There are no tasks matching your current filters."
                    />
                ) : (
                    <div className="list-table">
                        {/* Task list rendering */}
                    </div>
                )}
            </Card>
        </div>
    );
};


// --- App Component ---
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useStickyState(false, 'auth');
    const [currentPage, setCurrentPage] = useStickyState({ page: 'dashboard' }, 'currentPage');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [athletes, setAthletes] = useStickyState(initialAthletes, 'athletes');
    const [coaches, setCoaches] = useStickyState(initialCoaches, 'coaches');
    const [events, setEvents] = useStickyState(initialEvents, 'events');
    const [payments, setPayments] = useStickyState(initialPayments, 'payments');
    const [announcements, setAnnouncements] = useStickyState(initialAnnouncements, 'announcements');
    const [messages, setMessages] = useStickyState(initialMessages, 'messages');
    const [tasks, setTasks] = useStickyState(initialTasks, 'tasks');

    const renderPage = () => {
        switch (currentPage.page) {
            case 'dashboard':
                return <DashboardPage setCurrentPage={setCurrentPage} events={events} />;
            case 'athletes':
                return <AthletesPage athletes={athletes} setCurrentPage={setCurrentPage} />;
            case 'athleteProfile':
                 const athlete = athletes.find(a => a.id === currentPage.id);
                 return <AthleteProfilePage athlete={athlete} setCurrentPage={setCurrentPage} />;
            case 'eventDetails':
                 const event = events.find(e => e.id === currentPage.id);
                 return <EventDetailsPage event={event} setCurrentPage={setCurrentPage} />;
            case 'tasks':
                return <TasksPage tasks={tasks} />;
            default:
                return <DashboardPage setCurrentPage={setCurrentPage} events={events} />;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                         <div className="logo"><LogoIcon /></div>
                        <h1>Welcome Back</h1>
                        <p>Please enter your details to sign in.</p>
                    </div>
                    <form className="login-form" onSubmit={() => setIsAuthenticated(true)}>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        )
    }

    const NavItem = ({ page, icon, label }) => (
        <li>
            <a href="#" className={`nav-item ${currentPage.page === page ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage({ page }); setSidebarOpen(false); }}>
                {icon}
                <span>{label}</span>
            </a>
        </li>
    );

    return (
        <div className="dashboard-layout">
             <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                 <div className="sidebar-header">
                    <div className="logo"><LogoIcon/></div>
                    <h2>Funpot Club</h2>
                    <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}><CloseIcon/></button>
                 </div>
                 <nav className="nav-menu">
                     <ul>
                         <NavItem page="dashboard" icon={<HomeIcon />} label="Dashboard" />
                         <NavItem page="athletes" icon={<UsersIcon />} label="Athletes" />
                         <NavItem page="events" icon={<CalendarIcon />} label="Events" />
                         <NavItem page="payments" icon={<WalletIcon />} label="Payments" />
                         <NavItem page="tasks" icon={<TaskIcon />} label="Tasks" />
                         <NavItem page="messages" icon={<MessageIcon />} label="Messages" />
                     </ul>
                 </nav>
                 <div className="sidebar-footer">
                     <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setIsAuthenticated(false); }}><LogoutIcon /><span>Logout</span></a>
                 </div>
             </div>
             <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
            
            <main className="main-content">
                <header className="main-header">
                    <div className="header-left">
                        <button className="hamburger-menu" onClick={() => setSidebarOpen(true)}><HamburgerIcon/></button>
                        <div>
                            <h1>Dashboard</h1>
                            <p>Welcome back, Admin!</p>
                        </div>
                    </div>
                    <div className="header-right">
                       {/* Header actions */}
                    </div>
                </header>
                {renderPage()}
            </main>

             <nav className="mobile-bottom-nav">
                <a href="#" className={`mobile-nav-item ${currentPage.page === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage({ page: 'dashboard' }); }}><HomeIcon /><span>Home</span></a>
                <a href="#" className={`mobile-nav-item ${currentPage.page === 'athletes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage({ page: 'athletes' }); }}><UsersIcon /><span>Athletes</span></a>
                <a href="#" className={`mobile-nav-item ${currentPage.page === 'events' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage({ page: 'events' }); }}><CalendarIcon /><span>Events</span></a>
                <a href="#" className={`mobile-nav-item ${currentPage.page === 'messages' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage({ page: 'messages' }); }}><MessageIcon /><span>Chat</span></a>
            </nav>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);