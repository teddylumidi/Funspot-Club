

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

// Custom hook for clicking outside an element
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
};


const initialAthletes = [
    { id: 1, name: 'Sarah Wanjiku', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', badges: ['first_competition'], history: [
        { id: 4, date: '2025-09-12', description: 'New high score: 92 in choreography.' },
        { id: 3, date: '2025-09-05', description: 'Completed speed circuit. Time: 120 seconds.' },
        { id: 1, date: '2025-08-28', description: 'Mastered forward swizzles. Freestyle routine score: 85.' },
        { id: 2, date: '2025-08-20', description: 'First time on ice without assistance.' }
    ]},
    { id: 2, name: 'John Kamau', skillLevel: 'Intermediate', activity: 'Swimming', ageGroup: '15-18', badges: [], history: [] },
    { id: 3, name: 'Aisha Mwalimu', skillLevel: 'Advanced', activity: 'Chess', ageGroup: '15-18', badges: ['first_competition'], history: [
        { id: 3, date: '2025-09-01', description: 'Won local club tournament.'}
    ] },
    { id: 4, name: 'Peter Kiprotich', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', badges: ['first_competition'], history: [] },
];

const initialCoaches = [
    { id: 1, name: 'David Omondi', email: 'david.o@example.com', phone: '0712345678', expertise: 'Skating' },
    { id: 2, name: 'Grace Njeri', email: 'grace.n@example.com', phone: '0787654321', expertise: 'Swimming' },
];

const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

const initialEvents = [
    { id: 1, name: 'Annual Skating Gala', date: getTomorrowDate(), time: '09:00', location: 'Moi Stadium Kasarani', description: 'Our biggest skating event of the year. All levels welcome!', attendees: [1, 4] },
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

const initialBadges = [
    { id: 'first_competition', name: 'First Competition', description: 'Participated in your first official event!', icon: 'trophy' },
];

// --- SVG Icons ---
const LogoIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 6.29c.18-.05.36-.09.55-.12.21-.03.43-.05.65-.05.43 0 .82.04 1.18.13.4.09.76.23 1.09.43.32.19.6.44.82.74.22.3.39.65.51 1.05.12.4.18.84.18 1.33 0 .49-.06.94-.18 1.35s-.29.77-.51 1.07-.49.54-.81.74-.69.34-1.09.43c-.36.09-.75.13-1.18.13-.22 0-.44-.02-.65-.05s-.37-.07-.55-.12V8.29zm-1.5 0v7.42c-.22.06-.44.1-.66.13-.24.03-.48.04-.72.04-.59 0-1.13-.08-1.62-.23s-.9-.38-1.24-.68-.6-.68-.78-1.13-.27-.96-.27-1.53c0-.57.09-1.08.27-1.54s.44-.85.78-1.16.75-.54 1.24-.71c.49-.17 1.03-.25 1.62-.25.24 0 .48.01.72.04.22.03.44.07.66.13z"/>
    </svg>
);
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM12 12.75c-1.875 0-3.75-.465-5.25-1.32" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>;
const PaymentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 1.5m3-1.5l-3-1.5m3 1.5V15m-2.25 1.5l-3-1.5m3 1.5l-3 1.5m3-1.5V15m1.5-1.5l3-1.5m-3 1.5l3 1.5m-3 1.5V15M9 12l-3 1.5m3-1.5l-3-1.5m3 1.5V15" /></svg>;
const MessagesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const NotificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const AuditLogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3-12v.75m0 3v.75m0 3v.75m0 3V18m12-12v.75m0 3v.75m0 3v.75m0 3V18M9.75 6h4.5m-4.5 3h4.5m-4.5 3h4.5m-4.5 3h4.5m-6.75-12h1.5m-1.5 3h1.5m-1.5 3h1.5m-1.5 3h1.5m-6.75-12h1.5m-1.5 3h1.5m-1.5 3h1.5m-1.5 3h1.5" /></svg>;
const HamburgerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const DangerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-8.25 6L3 16.5v-9a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v9l-4.25-2.25m-10.5 2.25a.75.75 0 001.14.63l3.86-1.93a.75.75 0 000-1.26l-3.86-1.93a.75.75 0 00-1.14.63v4.5z" /></svg>;
const CoachIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 01-4.874-1.956 2.25 2.25 0 01-.868-1.956V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v9.6c0 .835-.412 1.624-.868 1.956a9.75 9.75 0 01-4.874 1.956zM16.5 18.75v-6.75a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375v6.75" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

// --- Helper Components ---
const Card = ({ children, className = '' }) => <div className={`card ${className}`}>{children}</div>;
// FIX: Made `action` and `children` optional by providing default values to fix props-related errors.
const CardHeader = ({ title, action = null, children = null }) => (
    <div className="card-header">
        <h3>{title}</h3>
        {action && action}
        {children && <div className="card-header-actions">{children}</div>}
    </div>
);

// FIX: Made `children` optional by providing a default value to fix a props-related error.
const EmptyState = ({ icon, title, message, children = null }) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div>{children}</div>
    </div>
);

const Pill = ({ text, type }) => <span className={`pill ${type}`}>{text}</span>;

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

const ToastNotification = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const icons = {
        success: <CheckCircleIcon />,
        danger: <DangerIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
    };

    return (
        <div className={`toast-notification ${type}`}>
            {icons[type]}
            <span>{message}</span>
        </div>
    );
};

const NotificationPanel = ({ notifications, setNotifications, onClose }) => {
    const panelRef = useRef(null);
    useOnClickOutside(panelRef, onClose);

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleNotificationClick = (notification) => {
        notification.link();
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        onClose();
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-panel" ref={panelRef}>
            <div className="notification-panel-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && <button className="link-button" onClick={handleMarkAllRead}>Mark all as read</button>}
            </div>
            <div className="notification-list">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`} onClick={() => handleNotificationClick(n)}>
                            <div className={`notification-icon ${n.type}`}>
                                {n.type === 'event' && <CalendarIcon />}
                                {n.type === 'payment' && <PaymentsIcon />}
                            </div>
                            <div className="notification-content">
                                <p><strong>{n.title}</strong></p>
                                <p>{n.message}</p>
                                <small>{new Date(n.date).toLocaleString()}</small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{padding: '20px', textAlign: 'center', color: 'var(--text-secondary)'}}>No new notifications.</p>
                )}
            </div>
        </div>
    );
};

// --- Main App Components ---
const LoginPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if (!email) {
            setError('Please enter a valid email.');
            return;
        }
        setError('');
        onLogin();
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo"><LogoIcon /></div>
                    <h1>Welcome Back</h1>
                    <p>{isLogin ? 'Sign in to continue to Funpot' : 'Create an account to get started'}</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="••••••••" />
                    </div>
                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        {isLogin && <a href="#" className="forgot-password">Forgot password?</a>}
                    </div>
                    <button type="submit" className="btn btn-primary">{isLogin ? 'Sign In' : 'Sign Up'}</button>
                </form>
                <div className="form-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? ' Sign Up' : ' Sign In'}
                    </a>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ activePage, navigate, role, isSidebarOpen, setSidebarOpen }) => {
    const navItems = {
        Admin: [
            { name: 'Dashboard', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'Athletes', icon: <UsersIcon />, page: 'athletes' },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Payments', icon: <PaymentsIcon />, page: 'payments' },
            { name: 'Tasks', icon: <TasksIcon />, page: 'tasks' },
            { name: 'Messages', icon: <MessagesIcon />, page: 'messages' },
            { name: 'Audit Logs', icon: <AuditLogIcon />, page: 'audit-logs' },
        ],
        Coach: [
            { name: 'Dashboard', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'My Athletes', icon: <UsersIcon />, page: 'athletes' },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Tasks', icon: <TasksIcon />, page: 'tasks' },
            { name: 'Messages', icon: <MessagesIcon />, page: 'messages' },
        ],
        'Parent/Athlete': [
            { name: 'Dashboard', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'My Profile', icon: <UsersIcon />, page: 'athlete-profile', params: { athleteId: 1 } },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Payments', icon: <PaymentsIcon />, page: 'payments' },
            { name: 'Messages', icon: <MessagesIcon />, page: 'messages' },
        ],
    };

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo"><LogoIcon /></div>
                    <h2>Funpot Club</h2>
                    <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}><CloseIcon /></button>
                </div>
                <nav className="nav-menu">
                    <ul>
                        {navItems[role].map(item => (
                            <li key={item.name}>
                                <a href="#" onClick={(e) => { e.preventDefault(); navigate(item.page, item.params || {}); setSidebarOpen(false); }} className={`nav-item ${activePage === item.page ? 'active' : ''}`}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="sidebar-footer">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }} className="nav-item">
                        <LogoutIcon />
                        <span>Logout</span>
                    </a>
                </div>
            </div>
             <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
        </>
    );
};

const RoleSwitcherDropdown = ({ role, setRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useOnClickOutside(dropdownRef, () => setIsOpen(false));

    const roles = {
        Admin: <AdminIcon />,
        Coach: <CoachIcon />,
        'Parent/Athlete': <UsersIcon />,
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setIsOpen(false);
    };

    return (
        <div className="role-switcher-custom" ref={dropdownRef}>
            <button className="role-switcher-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="role-icon">{roles[role]}</span>
                <span className="role-name">{role}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="role-switcher-menu">
                    <ul>
                        {Object.keys(roles).map((roleName) => (
                            <li key={roleName} onClick={() => handleRoleChange(roleName)}>
                                <span className="role-icon">{roles[roleName]}</span>
                                <span>{roleName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Header = ({ title, onMenuClick, role, setRole, navigate, notifications, setNotifications }) => {
    const searchRef = useRef(null);
    const [showNotifications, setShowNotifications] = useState(false);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = searchRef.current.value;
        if (searchTerm.trim()) {
            navigate('search-results', { query: searchTerm.trim() });
            searchRef.current.value = '';
        }
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="hamburger-menu" onClick={onMenuClick}><HamburgerIcon /></button>
                <div>
                    <h1>{title}</h1>
                    <p className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className="header-right">
                <form className="search-bar" onSubmit={handleSearch}>
                    <SearchIcon />
                    <input type="search" ref={searchRef} placeholder="Search..." />
                </form>
                <div className="header-actions">
                     <RoleSwitcherDropdown role={role} setRole={setRole} />
                    <button className="action-btn" onClick={() => setShowNotifications(s => !s)}>
                        <NotificationIcon />
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>
                    {showNotifications && <NotificationPanel notifications={notifications} setNotifications={setNotifications} onClose={() => setShowNotifications(false)} />}
                    <div className="header-user-profile">
                        <div className="avatar">AD</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const MobileBottomNav = ({ activePage, navigate, role }) => {
    const navItems = {
        Admin: [
            { name: 'Home', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'Athletes', icon: <UsersIcon />, page: 'athletes' },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Tasks', icon: <TasksIcon />, page: 'tasks' },
            { name: 'Logs', icon: <AuditLogIcon />, page: 'audit-logs' },
        ],
        Coach: [
            { name: 'Home', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'Athletes', icon: <UsersIcon />, page: 'athletes' },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Tasks', icon: <TasksIcon />, page: 'tasks' },
            { name: 'Messages', icon: <MessagesIcon />, page: 'messages' },
        ],
        'Parent/Athlete': [
            { name: 'Home', icon: <HomeIcon />, page: 'dashboard' },
            { name: 'Profile', icon: <UsersIcon />, page: 'athlete-profile', params: { athleteId: 1 } },
            { name: 'Events', icon: <CalendarIcon />, page: 'events' },
            { name: 'Payments', icon: <PaymentsIcon />, page: 'payments' },
            { name: 'Messages', icon: <MessagesIcon />, page: 'messages' },
        ],
    };
    return (
        <nav className="mobile-bottom-nav">
            {navItems[role].map(item => (
                <a href="#" key={item.name} onClick={(e) => { e.preventDefault(); navigate(item.page, item.params || {}); }} className={`mobile-nav-item ${activePage === item.page ? 'active' : ''}`}>
                    {item.icon}
                    <span>{item.name}</span>
                </a>
            ))}
        </nav>
    );
};

const DashboardPage = ({ navigate, athletes, events, role }) => {
    const totalAthletes = athletes.length;
    const totalEvents = events.length;

    const upcomingEvent = useMemo(() => {
        const now = new Date();
        return events
            .filter(event => new Date(`${event.date}T${event.time}`) >= now)
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];
    }, [events]);

    const quickActions = {
        Admin: [
            { name: 'Add New Athlete', icon: 'add-athlete', action: () => navigate('add-athlete') },
            { name: 'Schedule Training', icon: 'schedule-training', action: () => navigate('events') },
            { name: 'Generate Reports', icon: 'generate-reports', action: () => {} },
            { name: 'QR Code Attendance', icon: 'qr-attendance', action: () => {} },
        ],
        Coach: [
            { name: 'Add Training Report', icon: 'add-athlete', action: () => {} },
            { name: 'Mark Attendance', icon: 'qr-attendance', action: () => {} },
        ],
        'Parent/Athlete': [
            { name: 'Pay Balance', icon: 'generate-reports', action: () => navigate('payments') },
            { name: 'Message Coach', icon: 'schedule-training', action: () => navigate('messages') },
        ],
    };

    return (
        <>
            {upcomingEvent ? (
                 <div className="upcoming-event-banner" onClick={() => navigate('event-details', { eventId: upcomingEvent.id })}>
                    <CalendarIcon />
                    <div className="banner-content">
                        <h4>Next Up: {upcomingEvent.name}</h4>
                        <p>{new Date(`${upcomingEvent.date}T${upcomingEvent.time}`).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} • {upcomingEvent.location}</p>
                    </div>
                    <span className="banner-action">View Details &rarr;</span>
                </div>
            ) : (
                <div className="upcoming-event-banner info">
                    <InfoIcon />
                     <div className="banner-content">
                        <h4>No Upcoming Events</h4>
                        <p>Keep an eye on this space for future announcements.</p>
                    </div>
                </div>
            )}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon blue"><UsersIcon /></div></div>
                    <div className="stat-card-body"><h3>{totalAthletes}</h3><p>Total Athletes</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon teal"><CalendarIcon /></div></div>
                    <div className="stat-card-body"><h3>{totalEvents}</h3><p>Total Events</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon orange"><UsersIcon /></div></div>
                    <div className="stat-card-body"><h3>{initialCoaches.length}</h3><p>Coaches</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon green"><PaymentsIcon /></div></div>
                    <div className="stat-card-body"><h3>Ksh 4,500</h3><p>Fees Collected</p></div>
                </div>
            </div>
            <div className="main-layout">
                <Card>
                    <CardHeader title="Recent Activity" action={<a href="#" className="view-all">View All</a>} />
                     <div className="activity-list">
                         {initialPayments.slice(0, 3).map(p => (
                            <div key={p.id} className="activity-item">
                                <div className="icon" style={{backgroundColor: '#e8f5e9', color: '#2e7d32'}}><PaymentsIcon/></div>
                                <div className="description">
                                    <p>Payment received from <strong>{p.name}</strong></p>
                                    <p>Amount: Ksh {p.amount}</p>
                                </div>
                            </div>
                         ))}
                    </div>
                </Card>
                <Card>
                    <CardHeader title="Quick Actions" />
                    <div className="quick-actions">
                        <ul>
                            {(quickActions[role] || []).map(action => (
                                <li key={action.name}>
                                    <button onClick={action.action} className="action-link">
                                        <span className={`icon ${action.icon}`}><UsersIcon/></span>
                                        {action.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </>
    );
};

const AthletesPage = ({ athletes, navigate, setAthletes, showToast, logAction }) => {
    const [activityFilter, setActivityFilter] = useState('all');
    const [ageGroupFilter, setAgeGroupFilter] = useState('all');
    
    const uniqueActivities = useMemo(() => ['all', ...Array.from(new Set(athletes.map(a => a.activity)))], [athletes]);
    const uniqueAgeGroups = useMemo(() => ['all', ...Array.from(new Set(athletes.map(a => a.ageGroup)))], [athletes]);

    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => {
            const activityMatch = activityFilter === 'all' || athlete.activity === activityFilter;
            const ageGroupMatch = ageGroupFilter === 'all' || athlete.ageGroup === ageGroupFilter;
            return activityMatch && ageGroupMatch;
        });
    }, [athletes, activityFilter, ageGroupFilter]);

    const [athleteToDelete, setAthleteToDelete] = useState(null);

    const handleDeleteClick = (athlete) => {
        setAthleteToDelete(athlete);
    };

    const confirmDelete = () => {
        logAction(`Deleted athlete: ${athleteToDelete.name}`);
        setAthletes(prev => prev.filter(a => a.id !== athleteToDelete.id));
        showToast('Athlete deleted successfully!', 'success');
        setAthleteToDelete(null);
    };
    
    return (
        <div className="page-container">
            <div className="page-controls">
                <div className="filters">
                    <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)}>
                        {uniqueActivities.filter((v): v is string => !!v).map(activity => <option key={activity} value={activity}>{activity === 'all' ? 'All Activities' : activity}</option>)}
                    </select>
                    <select value={ageGroupFilter} onChange={e => setAgeGroupFilter(e.target.value)}>
                        {uniqueAgeGroups.filter((v): v is string => !!v).map(group => <option key={group} value={group}>{group === 'all' ? 'All Age Groups' : group}</option>)}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('add-athlete')}><AddIcon /> Add Athlete</button>
            </div>
            
            <Card>
                <CardHeader title="All Athletes" />
                {filteredAthletes.length > 0 ? (
                    <div className="list-table">
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Skill Level</th><th>Activity</th><th>Age Group</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filteredAthletes.map(athlete => (
                                    <tr key={athlete.id}>
                                        <td data-label="Name" data-clickable="true" onClick={() => navigate('athlete-profile', { athleteId: athlete.id })}>{athlete.name}</td>
                                        <td data-label="Skill Level"><Pill text={athlete.skillLevel} type={athlete.skillLevel.toLowerCase()} /></td>
                                        <td data-label="Activity">{athlete.activity}</td>
                                        <td data-label="Age Group">{athlete.ageGroup}</td>
                                        <td data-label="Actions">
                                            <div className="action-buttons">
                                                <button className="action-btn-icon edit-btn" onClick={() => navigate('edit-athlete', { athleteId: athlete.id })}><EditIcon /></button>
                                                <button className="action-btn-icon delete-btn" onClick={() => handleDeleteClick(athlete)}><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState icon={<UsersIcon />} title="No Athletes Found" message="Try adjusting your filters or add a new athlete." />
                )}
            </Card>

            <Modal show={!!athleteToDelete} onClose={() => setAthleteToDelete(null)} title="Confirm Deletion">
                <p>Are you sure you want to delete <strong>{athleteToDelete?.name}</strong>? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setAthleteToDelete(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDelete}>Delete Athlete</button>
                </div>
            </Modal>
        </div>
    );
};

const AthleteProfilePage = ({ navigate, params, athletes, setAthletes, showToast, logAction, badges }) => {
    const athlete = athletes.find(a => a.id === params.athleteId);
    const [historyFilter, setHistoryFilter] = useState('');

    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [logDescription, setLogDescription] = useState('');

    const handleAddLog = (e) => {
        e.preventDefault();
        if(!logDescription.trim()) return;

        const newLog = {
            id: Date.now(),
            date: logDate,
            description: logDescription,
        };
        
        logAction(`Added progress log for ${athlete.name}: "${logDescription}"`);
        setAthletes(prev => prev.map(a => a.id === athlete.id ? {...a, history: [newLog, ...a.history]} : a));
        setLogDescription('');
        showToast('Progress log added successfully!', 'success');
    };

    const filteredHistory = useMemo(() => {
        if (!historyFilter) return athlete?.history || [];
        return athlete.history.filter(h => h.description.toLowerCase().includes(historyFilter.toLowerCase()));
    }, [athlete, historyFilter]);
    
    const athleteBadges = useMemo(() => {
        if (!athlete || !athlete.badges) return [];
        return athlete.badges.map(badgeId => badges.find(b => b.id === badgeId)).filter(Boolean);
    }, [athlete, badges]);

    if (!athlete) return <p>Athlete not found.</p>;

    return (
        <div className="page-container">
            <Card>
                <CardHeader title={athlete.name}>
                    <button className="btn btn-secondary" onClick={() => navigate('edit-athlete', { athleteId: athlete.id })}>
                        <EditIcon /> Edit
                    </button>
                </CardHeader>
                <div className="profile-details">
                    <p><strong>Skill Level:</strong> <Pill text={athlete.skillLevel} type={athlete.skillLevel.toLowerCase()} /></p>
                    <p><strong>Activity:</strong> {athlete.activity}</p>
                    <p><strong>Age Group:</strong> {athlete.ageGroup}</p>
                </div>
            </Card>

            {athleteBadges.length > 0 && (
                <Card>
                    <CardHeader title="Achievements" />
                    <div className="badge-list">
                        {athleteBadges.map(badge => (
                            <div key={badge.id} className="badge-item">
                                <div className="badge-icon"><TrophyIcon /></div>
                                <span className="badge-name">{badge.name}</span>
                                <div className="badge-tooltip">{badge.description}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <CardHeader title="Progress History" />
                 <ProgressChart history={athlete.history} />
                <div className="add-log-form">
                     <form onSubmit={handleAddLog} className="form-layout">
                        <div className="form-grid">
                             <div className="form-group">
                                <label>Date</label>
                                <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" placeholder="e.g., New high score: 95" value={logDescription} onChange={e => setLogDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-actions">
                             <button type="submit" className="btn btn-primary">Add Log</button>
                        </div>
                    </form>
                </div>
                 <div className="page-controls" style={{paddingTop: '1rem', borderTop: '1px solid var(--border-color)'}}>
                    <input type="search" placeholder="Search history..." value={historyFilter} onChange={e => setHistoryFilter(e.target.value)} style={{width: '100%'}}/>
                </div>
                {filteredHistory.length > 0 ? (
                    <div className="history-list">
                        {filteredHistory.map(log => (
                            <div key={log.id} className="history-item">
                                <div>
                                    <p>{log.description}</p>
                                    <small style={{color: 'var(--text-secondary)'}}>{new Date(log.date).toLocaleDateString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No history entries found.</p>
                )}
            </Card>
        </div>
    );
};

const ProgressChart = ({ history }) => {
    const dataPoints = useMemo(() => {
        const points = history
            .map(log => {
                const match = log.description.match(/(\bscore\b|\btime\b|\bpoints\b)[\s:]*(\d+(\.\d+)?)/i);
                if (match) {
                    return { date: new Date(log.date), value: parseFloat(match[2]) };
                }
                return null;
            })
            .filter(point => point !== null)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
        return points;
    }, [history]);

    if (dataPoints.length < 2) {
        return (
            <div className="chart-placeholder">
                <p>Not enough data to display a chart. Add history logs with keywords like "score", "time", or "points" followed by a number.</p>
            </div>
        );
    }

    const width = 500;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const xMin = dataPoints[0].date.getTime();
    const xMax = dataPoints[dataPoints.length - 1].date.getTime();
    const yMin = Math.min(...dataPoints.map(d => d.value));
    const yMax = Math.max(...dataPoints.map(d => d.value));

    const xScale = (date) => margin.left + (date.getTime() - xMin) / (xMax - xMin) * (width - margin.left - margin.right);
    const yScale = (value) => height - margin.bottom - (value - yMin) / (yMax - yMin) * (height - margin.top - margin.bottom);

    const pathData = "M" + dataPoints.map(d => `${xScale(d.date)},${yScale(d.value)}`).join(" L ");

    return (
        <div className="chart-container">
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                {[...Array(5)].map((_, i) => {
                    const y = yMin + (yMax - yMin) / 4 * i;
                    const yPos = yScale(y);
                    return (
                        <g key={i} className="grid-line">
                            <line x1={margin.left} x2={width - margin.right} y1={yPos} y2={yPos} />
                            <text x={margin.left - 8} y={yPos + 4} textAnchor="end">{y.toFixed(0)}</text>
                        </g>
                    );
                })}

                {dataPoints.map((d, i) => (
                    <text key={i} x={xScale(d.date)} y={height - margin.bottom + 15} textAnchor="middle">
                        {d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                ))}

                <path d={pathData} fill="none" stroke="var(--primary-pink)" strokeWidth="2" />

                {dataPoints.map((d, i) => (
                    <circle key={i} cx={xScale(d.date)} cy={yScale(d.value)} r="4" fill="var(--primary-pink)" />
                ))}
            </svg>
        </div>
    );
};

const AthleteFormPage = ({ navigate, params, athletes, setAthletes, showToast, logAction }) => {
    const isEditMode = !!params?.athleteId;
    const athlete = isEditMode ? athletes.find(a => a.id === params.athleteId) : null;

    const [name, setName] = useState(athlete?.name || '');
    const [skillLevel, setSkillLevel] = useState(athlete?.skillLevel || 'Beginner');
    const [activity, setActivity] = useState(athlete?.activity || '');
    const [ageGroup, setAgeGroup] = useState(athlete?.ageGroup || 'U10');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { name, skillLevel, activity, ageGroup };

        if (isEditMode) {
            logAction(`Updated athlete details for: ${name}`);
            setAthletes(prev => prev.map(a => a.id === athlete.id ? { ...a, ...formData } : a));
            showToast('Athlete details updated!', 'success');
        } else {
            logAction(`Created new athlete: ${name}`);
            setAthletes(prev => [...prev, { id: Date.now(), ...formData, history: [], badges: [] }]);
            showToast('Athlete added successfully!', 'success');
        }
        navigate('athletes');
    };

    return (
        <div className="page-container">
            <Card>
                <CardHeader title={isEditMode ? `Edit ${athlete.name}` : "Add New Athlete"} />
                <form onSubmit={handleSubmit} className="form-layout">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                             <label htmlFor="activity">Activity</label>
                            <input type="text" id="activity" value={activity} onChange={e => setActivity(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="skillLevel">Skill Level</label>
                            <select id="skillLevel" value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ageGroup">Age Group</label>
                            <select id="ageGroup" value={ageGroup} onChange={e => setAgeGroup(e.target.value)}>
                                <option>U10</option>
                                <option>10-14</option>
                                <option>15-18</option>
                                <option>Adult</option>
                            </select>
                        </div>
                    </div>
                     <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('athletes')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Add Athlete'}</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const EventsPage = ({ events, navigate }) => {
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastEvents = events.filter(e => new Date(e.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="page-container">
            <section>
                <h2 className="section-title">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="events-grid">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="event-card" onClick={() => navigate('event-details', { eventId: event.id })}>
                                <div className="event-card-header">
                                    <h4>{event.name}</h4>
                                </div>
                                <div className="event-card-body">
                                    <p>{new Date(event.date).toDateString()} • {event.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No upcoming events.</p>}
            </section>
             <section>
                <h2 className="section-title">Past Events</h2>
                {pastEvents.length > 0 ? (
                    <div className="events-grid">
                        {pastEvents.map(event => (
                           <div key={event.id} className="event-card" onClick={() => navigate('event-details', { eventId: event.id })}>
                                <div className="event-card-header">
                                    <h4>{event.name}</h4>
                                </div>
                                <div className="event-card-body">
                                    <p>{new Date(event.date).toDateString()} • {event.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No past events.</p>}
            </section>
        </div>
    );
};

const EventDetailsPage = ({ params, events, athletes, setEvents, role, showToast, onRegister }) => {
    const event = events.find(e => e.id === params.eventId);
    const eventAttendees = event ? event.attendees.map(id => athletes.find(a => a.id === id)).filter(Boolean) : [];
    
    // For demo: assume Parent/Athlete role is for athleteId=1
    const isRegistered = role === 'Parent/Athlete' && event?.attendees.includes(1);
    const athleteIdToRegister = 1; // Demo athlete

    const handleRegister = () => {
        if (role !== 'Parent/Athlete') return;
        setEvents(prevEvents => prevEvents.map(e => 
            e.id === event.id ? { ...e, attendees: [...e.attendees, athleteIdToRegister] } : e
        ));
        onRegister(athleteIdToRegister); // Trigger badge check
        showToast(`Successfully registered for ${event.name}!`, 'success');
    };

    if (!event) return <p>Event not found.</p>;

    return (
        <div className="page-container">
            <Card>
                <CardHeader title={event.name} />
                <div className="event-details-page-card">
                    <p><strong>Date & Time:</strong> {new Date(`${event.date}T${event.time}`).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Description:</strong> {event.description}</p>
                    
                    {role === 'Parent/Athlete' && new Date(event.date) >= new Date() && (
                        <div className="form-actions" style={{justifyContent: "flex-start", borderTop: 'none', paddingTop: 0}}>
                            <button className="btn btn-primary" onClick={handleRegister} disabled={isRegistered}>
                                {isRegistered ? 'Registered' : 'Register Now'}
                            </button>
                        </div>
                    )}
                </div>
            </Card>
            <Card>
                <CardHeader title="Attendees" />
                {eventAttendees.length > 0 ? (
                    <ul>
                        {eventAttendees.map(attendee => <li key={attendee.id}>{attendee.name}</li>)}
                    </ul>
                ) : <p>No one is registered for this event yet.</p>}
            </Card>
        </div>
    );
};

const PaymentsPage = ({ payments }) => {
    return (
        <div className="page-container">
            <Card>
                <CardHeader title="Transaction History" />
                <div className="transaction-list">
                    {payments.map(payment => (
                        <div className="transaction-item" key={payment.id}>
                            <div className="transaction-details">
                                <h4>{payment.name}</h4>
                                <p>{payment.method} - {payment.reference}</p>
                            </div>
                            <div className="transaction-amount">
                                <h4>Ksh {payment.amount.toLocaleString()}</h4>
                                <p>{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const TasksPage = ({ tasks, setTasks, coaches, showToast, logAction }) => {
    const [taskFilter, setTaskFilter] = useState('all');
    const [taskSort, setTaskSort] = useState('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleAddTask = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
    };

    const confirmDelete = () => {
        logAction(`Deleted task: "${taskToDelete.title}"`);
        setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
        showToast('Task deleted successfully!', 'success');
        setTaskToDelete(null);
    };

    const handleSaveTask = (taskData) => {
        if(taskToEdit) {
            logAction(`Updated task: "${taskData.title}"`);
            setTasks(prev => prev.map(t => t.id === taskToEdit.id ? {...t, ...taskData} : t));
            showToast('Task updated successfully!', 'success');
        } else {
            logAction(`Created new task: "${taskData.title}"`);
            setTasks(prev => [...prev, { id: Date.now(), ...taskData, completed: false }]);
            showToast('Task added successfully!', 'success');
        }
        setIsModalOpen(false);
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };
    
    const filteredAndSortedTasks = useMemo(() => {
        return tasks
            .filter(task => {
                if (taskFilter === 'all') return true;
                if (taskFilter === 'completed') return task.completed;
                if (taskFilter === 'incomplete') return !task.completed;
                return true;
            })
            .sort((a, b) => {
                const dateA = new Date(a.dueDate).getTime();
                const dateB = new Date(b.dueDate).getTime();
                return taskSort === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [tasks, taskFilter, taskSort]);

    return (
        <div className="page-container">
            <div className="page-controls">
                <div className="filters">
                    <select value={taskFilter} onChange={e => setTaskFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                     <select value={taskSort} onChange={e => setTaskSort(e.target.value)}>
                        <option value="desc">Due Date (Newest)</option>
                        <option value="asc">Due Date (Oldest)</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddTask}><AddIcon /> Add Task</button>
            </div>
            
            <Card>
                <CardHeader title="Manage Tasks" />
                 {filteredAndSortedTasks.length > 0 ? (
                    <div className="task-list">
                        {filteredAndSortedTasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <div className="task-main">
                                    <input type="checkbox" className="task-checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} />
                                    <div>
                                        <p className="task-title">{task.title}</p>
                                        <p className="task-meta">Due: {task.dueDate} | Assignee: {task.assignedTo}</p>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="action-btn-icon edit-btn" onClick={() => handleEditTask(task)}><EditIcon /></button>
                                    <button className="action-btn-icon delete-btn" onClick={() => handleDeleteClick(task)}><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <EmptyState icon={<TasksIcon />} title="No Tasks Found" message="Try adjusting filters or adding a new task."/>
                )}
            </Card>

            <TaskFormModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={taskToEdit}
                coaches={coaches}
            />
            
             <Modal show={!!taskToDelete} onClose={() => setTaskToDelete(null)} title="Confirm Deletion">
                <p>Are you sure you want to delete the task "<strong>{taskToDelete?.title}</strong>"?</p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setTaskToDelete(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={confirmDelete}>Delete Task</button>
                </div>
            </Modal>
        </div>
    );
};

const TaskFormModal = ({ show, onClose, onSave, task, coaches }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('Admin');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDueDate(task.dueDate);
            setAssignedTo(task.assignedTo);
        } else {
            setTitle('');
            setDueDate(new Date().toISOString().split('T')[0]);
            setAssignedTo('Admin');
        }
    }, [task, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, dueDate, assignedTo });
    };

    return (
        <Modal show={show} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
            <form onSubmit={handleSubmit} className="form-layout">
                <div className="form-group">
                    <label htmlFor="taskTitle">Title</label>
                    <input type="text" id="taskTitle" value={title} onChange={e => setTitle(e.target.value)} required/>
                </div>
                 <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required/>
                </div>
                 <div className="form-group">
                    <label htmlFor="assignedTo">Assign To</label>
                    <select id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                        <option>Admin</option>
                        {coaches.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Task</button>
                </div>
            </form>
        </Modal>
    );
};

const SearchResultsPage = ({ params, navigate, athletes, coaches, events }) => {
    const query = params.query?.toLowerCase() || '';
    
    const results = useMemo(() => {
        if (!query) return [];
        const athleteResults = athletes
            .filter(a => a.name.toLowerCase().includes(query))
            .map(a => ({ type: 'Athlete', item: a }));
        const coachResults = coaches
            .filter(c => c.name.toLowerCase().includes(query))
            .map(c => ({ type: 'Coach', item: c }));
        const eventResults = events
            .filter(e => e.name.toLowerCase().includes(query))
            .map(e => ({ type: 'Event', item: e }));
        return [...athleteResults, ...coachResults, ...eventResults];
    }, [query, athletes, coaches, events]);

    const handleView = (result) => {
        switch(result.type) {
            case 'Athlete':
                navigate('athlete-profile', { athleteId: result.item.id });
                break;
            case 'Event':
                 navigate('event-details', { eventId: result.item.id });
                break;
            // Add cases for Coach, etc. later
            default:
                break;
        }
    };
    
    return (
        <div className="page-container">
            <Card>
                <CardHeader title={`Search Results for "${params.query}"`} />
                 {results.length > 0 ? (
                    <div className="search-results-list">
                        {results.map((result) => (
                            <div key={`${result.type}-${result.item.id}`} className="search-result-card">
                                <div className="result-icon">
                                    {result.type === 'Athlete' && <UsersIcon />}
                                    {result.type === 'Coach' && <UsersIcon />}
                                    {result.type === 'Event' && <CalendarIcon />}
                                </div>
                                <div className="result-details">
                                    <h4>{result.item.name}</h4>
                                     <p>
                                        {result.type === 'Athlete' && `Activity: ${result.item.activity}`}
                                        {result.type === 'Coach' && `Expertise: ${result.item.expertise}`}
                                        {result.type === 'Event' && `Date: ${new Date(result.item.date).toLocaleDateString()} • ${result.item.location}`}
                                    </p>
                                </div>
                                <div className="result-actions">
                                    <button className="btn btn-secondary" onClick={() => handleView(result)}>View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={<SearchIcon/>} title="No Results Found" message="We couldn't find anything matching your search. Please try again."/>
                )}
            </Card>
        </div>
    );
};

const MessagesPage = ({ messages }) => {
    const [activeConversation, setActiveConversation] = useState(messages[0]);
    
    return (
        <div className="messages-page">
            <Card>
                <div className="messages-layout">
                    <div className="conversations-list">
                        <div className="conversations-header"><h3>All Messages</h3></div>
                        <div className="conversation-items">
                            {messages.map(msg => (
                                <div key={msg.id} className={`conversation-item ${activeConversation.id === msg.id ? 'active' : ''}`} onClick={() => setActiveConversation(msg)}>
                                    <div className="conversation-avatar">{msg.sender.charAt(0)}</div>
                                    <div className="conversation-details">
                                        <p className="conversation-sender">{msg.sender}</p>
                                        <p className="conversation-preview">{msg.preview}</p>
                                    </div>
                                    <div className="conversation-meta">
                                        <p className="conversation-timestamp">{msg.timestamp}</p>
                                        {msg.unread > 0 && <span className="unread-badge">{msg.unread}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-window">
                        {activeConversation ? (
                             <>
                                <div className="chat-header">{activeConversation.sender}</div>
                                <div className="chat-body">
                                    {activeConversation.conversation.map((c, i) => (
                                        <div key={i} className={`message ${c.sender === 'You' ? 'sent' : 'received'}`}>
                                            <p>{c.text}</p>
                                            <span>{c.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-footer">
                                    <form>
                                        <input type="text" placeholder="Type a message..." />
                                        <button type="submit" className="btn btn-primary">Send</button>
                                    </form>
                                </div>
                            </>
                        ) : (
                             <div className="no-chat-selected">
                                <MessagesIcon />
                                <h3>Select a conversation</h3>
                                <p>Start chatting with your coaches and teammates.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

const AuditLogPage = ({ auditLogs }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = useMemo(() => {
        if (!searchTerm) return auditLogs;
        return auditLogs.filter(log =>
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.actor.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [auditLogs, searchTerm]);

    return (
        <div className="page-container">
            <div className="page-controls">
                <input
                    type="search"
                    placeholder="Search logs by action or actor..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>
            <Card>
                <CardHeader title="Audit Logs" />
                {filteredLogs.length > 0 ? (
                    <div className="list-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>Actor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id}>
                                        <td data-label="Timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td data-label="Action">{log.action}</td>
                                        <td data-label="Actor">{log.actor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={<AuditLogIcon />}
                        title="No Logs Found"
                        message="No actions have been logged yet, or your search returned no results."
                    />
                )}
            </Card>
        </div>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useStickyState(false, 'auth');
    const [page, setPage] = useState({ name: 'dashboard', params: {} });
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    const [role, setRole] = useStickyState('Admin', 'userRole');
    const [athletes, setAthletes] = useStickyState(initialAthletes, 'athletes');
    const [coaches, setCoaches] = useStickyState(initialCoaches, 'coaches');
    const [events, setEvents] = useStickyState(initialEvents, 'events');
    const [payments, setPayments] = useStickyState(initialPayments, 'payments');
    const [tasks, setTasks] = useStickyState(initialTasks, 'tasks');
    const [messages, setMessages] = useStickyState(initialMessages, 'messages');
    const [badges, setBadges] = useStickyState(initialBadges, 'badges');
    const [notifications, setNotifications] = useStickyState([], 'notifications');
    const [auditLogs, setAuditLogs] = useStickyState([], 'auditLogs');

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const logAction = useCallback((action) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action: action,
            actor: role,
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }, [role, setAuditLogs]);
    
    const navigate = useCallback((pageName, params = {}) => {
        window.scrollTo(0, 0);
        setPage({ name: pageName, params });
        if(pageName === 'login') {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated]);

    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;
    
    const awardBadges = useCallback((athleteId) => {
        setAthletes(prevAthletes => {
            const athlete = prevAthletes.find(a => a.id === athleteId);
            if (!athlete) return prevAthletes;

            let updatedBadges = [...(athlete.badges || [])];
            let badgeAwarded = false;

            // Badge 1: First Competition
            const hasCompetitionBadge = updatedBadges.includes('first_competition');
            if (!hasCompetitionBadge) {
                const hasAttendedEvent = events.some(e => e.attendees.includes(athleteId));
                if (hasAttendedEvent) {
                    updatedBadges.push('first_competition');
                    badgeAwarded = true;
                    logAction(`Awarded 'First Competition' badge to ${athlete.name}`);
                }
            }

            if (badgeAwarded) {
                return prevAthletes.map(a => a.id === athleteId ? { ...a, badges: updatedBadges } : a);
            }
            return prevAthletes;
        });
    }, [events, setAthletes, logAction]);

    // Check for badges on initial load
    useEffect(() => {
        athletes.forEach(athlete => awardBadges(athlete.id));
    }, []); // Run only once

    useEffect(() => {
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        const upcomingEventNotifications = events
            .filter(event => {
                const eventTime = new Date(`${event.date}T${event.time}`).getTime();
                return eventTime > now && eventTime - now < twentyFourHours;
            })
            .map(event => ({
                id: `event-${event.id}`,
                type: 'event',
                title: 'Upcoming Event Reminder',
                message: `${event.name} is starting soon!`,
                date: new Date().toISOString(),
                read: false,
                link: () => navigateRef.current('event-details', { eventId: event.id })
            }));

        setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotifications = upcomingEventNotifications.filter(n => !existingIds.has(n.id));
            if (newNotifications.length > 0) {
              return [...prev, ...newNotifications].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return prev;
        });
    }, [events, setNotifications]);
    
    const pageTitles = {
        'dashboard': 'Dashboard',
        'athletes': 'Athletes',
        'athlete-profile': 'Athlete Profile',
        'add-athlete': 'Add Athlete',
        'edit-athlete': 'Edit Athlete',
        'events': 'Events',
        'event-details': 'Event Details',
        'payments': 'Payments',
        'tasks': 'Tasks',
        'messages': 'Messages',
        'search-results': 'Search Results',
        'audit-logs': 'Audit Logs',
    };

    const renderPage = () => {
        switch (page.name) {
            case 'dashboard': return <DashboardPage navigate={navigate} athletes={athletes} events={events} role={role} />;
            case 'athletes': return <AthletesPage athletes={athletes} navigate={navigate} setAthletes={setAthletes} showToast={showToast} logAction={logAction} />;
            case 'athlete-profile': return <AthleteProfilePage navigate={navigate} params={page.params} athletes={athletes} setAthletes={setAthletes} showToast={showToast} logAction={logAction} badges={badges} />;
            case 'add-athlete':
            case 'edit-athlete': return <AthleteFormPage navigate={navigate} params={page.params} athletes={athletes} setAthletes={setAthletes} showToast={showToast} logAction={logAction} />;
            case 'events': return <EventsPage events={events} navigate={navigate} />;
            case 'event-details': return <EventDetailsPage params={page.params} events={events} athletes={athletes} setEvents={setEvents} role={role} showToast={showToast} onRegister={awardBadges} />;
            case 'payments': return <PaymentsPage payments={payments} />;
            case 'tasks': return <TasksPage tasks={tasks} setTasks={setTasks} coaches={coaches} showToast={showToast} logAction={logAction}/>;
            case 'messages': return <MessagesPage messages={messages} />;
            case 'search-results': return <SearchResultsPage params={page.params} navigate={navigate} athletes={athletes} coaches={coaches} events={events} />;
            case 'audit-logs': return <AuditLogPage auditLogs={auditLogs} />;
            default: return <DashboardPage navigate={navigate} athletes={athletes} events={events} role={role} />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar activePage={page.name} navigate={navigate} role={role} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div style={{ marginLeft: 0 }}> {/* Simplified for mobile-first; desktop handled by media queries */}
                <main className="main-content">
                    <Header title={pageTitles[page.name] || 'Dashboard'} onMenuClick={() => setSidebarOpen(true)} role={role} setRole={setRole} navigate={navigate} notifications={notifications} setNotifications={setNotifications} />
                    {renderPage()}
                </main>
            </div>
             <MobileBottomNav activePage={page.name} navigate={navigate} role={role} />
             {toast.show && <ToastNotification message={toast.message} type={toast.type} onDismiss={() => setToast({ ...toast, show: false })} />}
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);