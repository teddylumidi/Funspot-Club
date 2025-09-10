
import React, { useState, useMemo, useEffect } from 'react';
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
            console.error("Error parsing sticky state:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};


const initialAthletes = [
    { id: 1, name: 'Sarah Wanjiku', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', history: [
        { id: 1, date: '2025-08-28', description: 'Mastered forward swizzles.' },
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
    { id: 1, name: 'Annual Skating Gala', date: '2025-10-25', time: '09:00', location: 'Moi Stadium Kasarani', description: 'Our biggest skating event of the year. All levels welcome!' },
    { id: 2, name: 'Club Chess Tournament', date: '2025-08-15', time: '13:00', location: 'Club House', description: 'A friendly competition for all our chess enthusiasts.' },
    { id: 3, name: 'Summer Swim Meet', date: '2026-01-10', time: '10:00', location: 'Aquatics Center', description: 'Join us for a fun day of swimming races and relays.' },
];

const initialPayments = [
    { id: 1, name: 'John Mwangi', amount: 2500, method: 'M-Pesa', reference: 'ABC123456789', date: '2025-09-02T10:30:00Z'},
    { id: 2, name: 'Aisha Mwalimu', amount: 1200, method: 'Card', reference: '**** **** **** 4532', date: '2025-09-02T07:45:00Z'},
    { id: 3, name: 'Peter Kiprotich', amount: 800, method: 'Cash', reference: 'CASH001', date: '2025-09-01T15:00:00Z'},
];


const fuzzyMatch = (pattern, str) => {
  if (!pattern) return true;
  if (!str) return false;
  const searchPattern = pattern.split('').join('.*');
  const re = new RegExp(searchPattern, 'i');
  return re.test(str);
};

// --- SVG Icons --- //
const LogoIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16"><path d="M8 16a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-1 0v1a.5.5 0 0 0 .5.5zM3.5 12.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm8 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zM3 10a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5zm10 0a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5zM4.887 3.652A8.484 8.484 0 0 0 8 15.869a8.484 8.484 0 0 0 3.113-12.217.5.5 0 0 0-.707-.707 7.484 7.484 0 0 1-2.406 10.908A7.484 7.484 0 0 1 5.594 2.945a.5.5 0 1 0-.707.707z"></path><path d="M6.21 1.477a.5.5 0 0 0-.707 0l-1.83 1.83a.5.5 0 0 0 0 .707l1.83 1.83a.5.5 0 0 0 .707 0l1.83-1.83a.5.5 0 0 0 0-.707L6.21 1.477zM11.646.354a.5.5 0 0 0-.707 0L8.025 3.268a.5.5 0 0 0 0 .707l2.914 2.914a.5.5 0 0 0 .707 0l2.914-2.914a.5.5 0 0 0 0-.707L11.646.354z"></path></svg>);
const DashboardIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></svg>);
const AthletesIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.859 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1h2z"></path></svg>);
const CoachesIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 2.31-2 6-2 3.7 0 5.79 1.28 6 2H9zm-3-3v-3h3v-2H9V7H7v3H4v2h3v3h2z"></path></svg>);
const TrainingIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19.48 11.23c.27-.19.5-.43.7-.7s.35-.58.46-.9c.11-.32.17-.65.17-.99s-.06-.67-.17-.99c-.11-.32-.26-.63-.46-.9s-.43-.51-.7-.7c-.27-.19-.58-.33-.91-.43-.33-.1-.67-.15-1.02-.15-.73 0-1.41.14-2.02.42-.61.28-1.14.69-1.58 1.21l-7.25 7.25c-.25.25-.4.57-.4.92 0 .34.15.66.4.91l2.5 2.5c.25.25.57.4.91.4.35 0 .67-.15.92-.4l7.25-7.25c.52-.44.93-.97 1.21-1.58.28-.61.42-1.29.42-2.02.01-.35-.04-.69-.14-1.02s-.24-.65-.43-.91zM17.5 8c-.69 0-1.25-.56-1.25-1.25S16.81 5.5 17.5 5.5s1.25.56 1.25 1.25S18.19 8 17.5 8zM5 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S5.83 21 5 21z"></path></svg>);
const AttendanceIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm0 10c-2.206 0-4-1.794-4-4h2c0 1.103.897 2 2 2s2-.897 2-2h2c0 2.206-1.794 4-4 4zm8-4c0 2.206-1.794 4-4 4s-4-1.794-4-4h2c0 1.103.897 2 2 2s2-.897 2-2h2z"></path></svg>);
const PaymentsIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 6h16v2H4V6zm0 12v-6h16.001l.001 6H4z"></path><path d="M6 14h6v2H6z"></path></svg>);
const ReportsIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M6 2h12v2H6zm12 5H6v2h12zm0 4H6v2h12zm0 4H6v2h12zm-3 4H9v2h9z"></path><path d="M4 22h16V7H4v15zM6 9h12v9H6V9zm7 4h3v2h-3v-2zm0-3h3v2h-3v-2zM8 10h3v2H8v-2zm0 3h3v2H8v-2z"></path></svg>);
const EventsIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>);
const LogoutIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>);
const CloseIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>);
const HamburgerIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>);
const SearchIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>);
const NotificationIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>);
const EditIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>);
const DeleteIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>);
const BackIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>);
const OfflineIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 6.34L22.68 17H21.5l-1.44-1.44-.06-.06L14.72 10.2l-3.34 3.34L12 14.17l-1.41-1.41-1.47-1.47L1.32 17H1.11l.88-.88L3.1 15H2.5l-1.44 1.44-.06.06L12 6.34M12 4 1 15h3l8-8 8 8h3L12 4z"></path></svg>);
const OnlineIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 3 1 14h3l8-8 8 8h3L12 3zm0 13.5-4-4h2v-3h4v3h2l-4 4z"></path></svg>);
const SyncingIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"></path></svg>);
const GoogleIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.657-3.356-11.303-7.918l-6.522 5.023C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.836 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>);
const AppleIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19.333 13.042c-0.031 3.396-2.583 5.438-2.615 5.469-0.031 0-1.281 0.969-2.594 0.969-1.219 0-1.781-0.656-3.281-0.656-1.531 0-2.125 0.625-3.281 0.625-1.313 0-2.75-1.063-2.75-3.344 0-2.438 1.844-3.656 3.344-3.656 1.438 0 2.063 0.625 3.313 0.625s1.844-0.813 3.438-0.813c0.438 0 1.531 0.125 2.469 0.781zM15.031 7.422c0.813-0.969 1.344-2.281 1.25-3.625-1.156 0.031-2.438 0.781-3.25 1.75-0.656 0.813-1.313 2.125-1.219 3.438 1.281 0.156 2.563-0.594 3.219-1.563z"></path></svg>);
const MicrosoftIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 21 21"><path d="M10 2.5v7.5h-7.5v-7.5h7.5zm.5 0h7.5v7.5h-7.5v-7.5zm-8 8h7.5v7.5h-7.5v-7.5zm8.5 0h7.5v7.5h-7.5v-7.5z"></path></svg>);

// --- Main App Component --- //
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useStickyState(false, 'funpot-isLoggedIn');
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [athletes, setAthletes] = useStickyState(initialAthletes, 'funpot-athletes');
    const [coaches, setCoaches] = useStickyState(initialCoaches, 'funpot-coaches');
    const [events, setEvents] = useStickyState(initialEvents, 'funpot-events');
    const [payments, setPayments] = useStickyState(initialPayments, 'funpot-payments');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'info' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        let onlineTimeout, syncTimeout;
        const handleOnline = () => {
            setIsOnline(true);
            setToastInfo({ show: true, message: 'Syncing data...', type: 'syncing' });
            syncTimeout = setTimeout(() => {
                setToastInfo({ show: true, message: 'You are back online!', type: 'online' });
                onlineTimeout = setTimeout(() => setToastInfo(p => ({ ...p, show: false })), 2000);
            }, 1500);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setToastInfo({ show: true, message: 'You are currently offline. Changes will be saved locally.', type: 'offline' });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearTimeout(onlineTimeout);
            clearTimeout(syncTimeout);
        };
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('Dashboard');
    };

    const handleNavigation = (page) => {
        setCurrentPage(page);
        setSearchQuery('');
        setSelectedAthlete(null);
        setSelectedCoach(null);
        setSelectedEvent(null);
        setIsSidebarOpen(false);
    };

    // --- Athlete Handlers --- //
    const handleAddAthlete = (newAthlete) => {
        setAthletes(prev => [...prev, { id: Date.now(), ...newAthlete, history: [] }]);
        handleNavigation('Athletes');
    };

    const handleUpdateAthlete = (athleteId, updatedData) => {
        setAthletes(prev => prev.map(athlete =>
            athlete.id === athleteId ? { ...athlete, ...updatedData } : athlete
        ));
        handleNavigation('Athletes');
    };

    const handleDeleteAthlete = (athleteId) => {
        setAthletes(prev => prev.filter(a => a.id !== athleteId));
    };
    
    const handleAddAthleteLog = (athleteId, newLog) => {
        const newLogEntry = { id: Date.now(), ...newLog };
        let updatedSelectedAthlete = null;
        setAthletes(prev => {
            const newAthletes = prev.map(athlete => {
                if (athlete.id === athleteId) {
                    const updatedAthlete = {
                        ...athlete,
                        history: [newLogEntry, ...athlete.history]
                    };
                    updatedSelectedAthlete = updatedAthlete;
                    return updatedAthlete;
                }
                return athlete;
            });
            return newAthletes;
        });

        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };
    
    const handleUpdateAthleteLog = (athleteId, logId, updatedLog) => {
        let updatedSelectedAthlete = null;
        setAthletes(prev => {
            const newAthletes = prev.map(athlete => {
                if (athlete.id === athleteId) {
                    const updatedHistory = athlete.history.map(log =>
                        log.id === logId ? { ...log, ...updatedLog } : log
                    );
                    const updatedAthlete = { ...athlete, history: updatedHistory };
                    updatedSelectedAthlete = updatedAthlete;
                    return updatedAthlete;
                }
                return athlete;
            });
            return newAthletes;
        });

        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };
    
    const handleDeleteAthleteLog = (athleteId, logId) => {
        let updatedSelectedAthlete = null;
        setAthletes(prev => {
            const newAthletes = prev.map(athlete => {
                if (athlete.id === athleteId) {
                    const updatedHistory = athlete.history.filter(log => log.id !== logId);
                    const updatedAthlete = { ...athlete, history: updatedHistory };
                    updatedSelectedAthlete = updatedAthlete;
                    return updatedAthlete;
                }
                return athlete;
            });
            return newAthletes;
        });
        
        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };

    // --- Coach Handlers --- //
    const handleAddCoach = (newCoach) => {
        setCoaches(prev => [...prev, { id: Date.now(), ...newCoach }]);
        handleNavigation('Coaches');
    };

    const handleUpdateCoach = (coachId, updatedData) => {
        setCoaches(prev => prev.map(coach =>
            coach.id === coachId ? { ...coach, ...updatedData } : coach
        ));
        handleNavigation('Coaches');
    };

    const handleDeleteCoach = (coachId) => {
        setCoaches(prev => prev.filter(c => c.id !== coachId));
    };

    // --- Event Handlers --- //
    const handleAddEvent = (newEvent) => {
        setEvents(prev => [...prev, { id: Date.now(), ...newEvent }]);
        handleNavigation('Events');
    };

    const handleUpdateEvent = (eventId, updatedData) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? { ...event, ...updatedData } : event
        ));
        handleNavigation('Events');
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    // --- Payment Handlers --- //
    const handleAddPayment = (newPayment) => {
        setPayments(prev => [{ id: Date.now(), ...newPayment, date: new Date().toISOString() }, ...prev]);
        handleNavigation('Payments');
    };

    const renderPage = () => {
        const pageProps = { onNavigate: handleNavigation, searchQuery };
        switch(currentPage) {
            case 'Dashboard': return <Dashboard {...pageProps} athletes={athletes} coaches={coaches} payments={payments} />;
            case 'Athletes': return <AthletesPage {...pageProps} athletes={athletes} onSelectAthlete={setSelectedAthlete} onDeleteAthlete={handleDeleteAthlete} />;
            case 'AddAthleteForm': return <AddAthleteForm {...pageProps} onAddAthlete={handleAddAthlete} onUpdateAthlete={handleUpdateAthlete} initialData={null} />;
            case 'EditAthleteForm': return <AddAthleteForm {...pageProps} initialData={selectedAthlete} onUpdateAthlete={handleUpdateAthlete} onAddAthlete={handleAddAthlete} />;
            case 'AthleteProfile': return <AthleteProfilePage {...pageProps} athlete={selectedAthlete} onAddLog={handleAddAthleteLog} onUpdateLog={handleUpdateAthleteLog} onDeleteLog={handleDeleteAthleteLog} />;
            case 'Coaches': return <CoachesPage {...pageProps} coaches={coaches} onSelectCoach={setSelectedCoach} onDeleteCoach={handleDeleteCoach} />;
            case 'AddCoachForm': return <AddCoachForm {...pageProps} onAddCoach={handleAddCoach} onUpdateCoach={handleUpdateCoach} initialData={null} />;
            case 'EditCoachForm': return <AddCoachForm {...pageProps} initialData={selectedCoach} onUpdateCoach={handleUpdateCoach} onAddCoach={handleAddCoach} />;
            case 'CoachProfile': return <CoachProfilePage {...pageProps} coach={selectedCoach} />;
            case 'Events': return <EventsPage {...pageProps} events={events} onSelectEvent={setSelectedEvent} />;
            case 'AddEventForm': return <AddEventForm {...pageProps} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} initialData={null} />;
            case 'EditEventForm': return <AddEventForm {...pageProps} initialData={selectedEvent} onUpdateEvent={handleUpdateEvent} onAddEvent={handleAddEvent} />;
            case 'EventDetails': return <EventDetailsPage {...pageProps} event={selectedEvent} />;
            case 'Payments': return <PaymentsPage {...pageProps} payments={payments} />;
            case 'AddPaymentForm': return <AddPaymentForm {...pageProps} onAddPayment={handleAddPayment} />;
            default: return <Dashboard {...pageProps} athletes={athletes} coaches={coaches} payments={payments} />;
        }
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigation} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="main-content">
                <MainHeader currentPage={currentPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onToggleSidebar={() => setIsSidebarOpen(true)} />
                {renderPage()}
            </main>
            <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigation} />
            <ToastNotification {...toastInfo} />
        </div>
    );
};

// --- Sub-Components --- //

const ConfirmationDialog = ({ message, onConfirm, onCancel, confirmText = "Delete", title = "Are you sure?" }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
            </div>
        </div>
    </div>
);

const ToastNotification = ({ show, message, type }) => {
    if (!show) return null;
    const icons = {
        offline: <OfflineIcon />,
        online: <OnlineIcon />,
        syncing: <SyncingIcon />,
        info: <DashboardIcon/>
    };
    return (
        <div className={`toast-notification ${type}`}>
            {icons[type]}
            <span>{message}</span>
        </div>
    );
};

const LoginPage = ({ onLogin }) => {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo"><LogoIcon /></div>
                    <h1>Funpot Skating Club</h1>
                    <p>Management System</p>
                </div>
                <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div className="input-group">
                        <label htmlFor="email">Email / Phone</label>
                        <input type="email" id="email" defaultValue="lumiditeddy@gmail.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" defaultValue="••••••••" />
                    </div>
                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" defaultChecked />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>
                <div className="social-login-divider"><span>OR</span></div>
                <div className="social-login-buttons">
                    <button className="btn social-btn" onClick={onLogin}><GoogleIcon /> Sign Up with Google</button>
                    <button className="btn social-btn" onClick={onLogin}><AppleIcon /> Sign Up with Apple</button>
                    <button className="btn social-btn" onClick={onLogin}><MicrosoftIcon /> Sign Up with Microsoft</button>
                </div>
                <div className="login-footer">
                    <p>Need help? Contact admin at <a href="tel:+254700123456">+254 700 123 456</a></p>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ currentPage, onNavigate, onLogout, isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Athletes', icon: <AthletesIcon /> },
        { name: 'Coaches', icon: <CoachesIcon /> },
        { name: 'Training Sessions', icon: <TrainingIcon /> },
        { name: 'Attendance', icon: <AttendanceIcon /> },
        { name: 'Payments', icon: <PaymentsIcon /> },
        { name: 'Progress & Reports', icon: <ReportsIcon /> },
        { name: 'Events', icon: <EventsIcon /> },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo"><LogoIcon /></div>
                    <h2>Funpot Club</h2>
                    <button className="close-sidebar-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="user-profile">
                    <div className="avatar">T</div>
                    <div className="user-info">
                        <h4>Teddy Lumidi</h4>
                        <p>Admin</p>
                    </div>
                    <div className="online-indicator"></div>
                </div>
                <nav className="nav-menu">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name}>
                                <a
                                    href="#"
                                    className={`nav-item ${currentPage === item.name ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); onNavigate(item.name); }}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="sidebar-footer">
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                        <LogoutIcon />
                        <span>Logout</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

const MainHeader = ({ currentPage, searchQuery, setSearchQuery, onToggleSidebar }) => {
    const pageTitles = {
        Dashboard: "Dashboard",
        Athletes: "Athletes Management",
        AddAthleteForm: "Add New Athlete",
        EditAthleteForm: "Edit Athlete",
        AthleteProfile: "Athlete Profile",
        Coaches: "Coaches Management",
        AddCoachForm: "Add New Coach",
        EditCoachForm: "Edit Coach",
        CoachProfile: "Coach Profile",
        Events: "Events & Competitions",
        AddEventForm: "Add New Event",
        EditEventForm: "Edit Event",
        EventDetails: "Event Details",
        Payments: "Payments Management",
        AddPaymentForm: "Record Payment",
    };
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="hamburger-menu" onClick={onToggleSidebar}><HamburgerIcon /></button>
                <div>
                    <h1>{pageTitles[currentPage] || "Dashboard"}</h1>
                    <p>{today}</p>
                </div>
            </div>
            <div className="header-right">
                <div className="search-bar">
                     <SearchIcon/>
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="header-actions">
                    <button className="action-btn">
                        <NotificationIcon/>
                        <span className="notification-badge">3</span>
                    </button>
                </div>
                 <div className="header-user-profile">
                    <div className="avatar">T</div>
                </div>
            </div>
        </header>
    );
};

const Dashboard = ({ onNavigate, athletes, coaches, payments }) => {
    return (
        <div className="page-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon total-athletes"><AthletesIcon /></div></div>
                    <div className="stat-card-body"><h3>{athletes.length}</h3><p>Total Athletes</p></div>
                    <div className="stat-card-footer"><span>+12% from last month</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon active-coaches"><CoachesIcon /></div></div>
                    <div className="stat-card-body"><h3>{coaches.length}</h3><p>Active Coaches</p></div>
                    <div className="stat-card-footer"><span>+2 new this month</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="icon monthly-revenue"><PaymentsIcon /></div></div>
                    <div className="stat-card-body"><h3>KSh {payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</h3><p>Monthly Revenue</p></div>
                    <div className="stat-card-footer"><span>+8.5% from last month</span></div>
                </div>
                 <div className="stat-card">
                    <div className="stat-card-header"><div className="icon attendance-rate"><AttendanceIcon /></div></div>
                    <div className="stat-card-body"><h3>92%</h3><p>Attendance Rate</p></div>
                    <div className="stat-card-footer"><span>+3.2% from last week</span></div>
                </div>
            </div>
            <div className="main-layout">
                <div className="card">
                    <div className="card-header"><h3>Recent Activities</h3><a href="#" className="view-all">View All</a></div>
                    <div className="activity-list">
                        <div className="activity-item"><div className="icon" style={{backgroundColor: '#e3f2fd', color: '#1565c0'}}><AthletesIcon /></div><div className="description"><p>New athlete <strong>Sarah Wanjiku</strong> registered for beginner skating</p><p>2 hours ago</p></div></div>
                        <div className="activity-item"><div className="icon" style={{backgroundColor: '#e8f5e9', color: '#2e7d32'}}><TrainingIcon /></div><div className="description"><p>Training session completed for <strong>Advanced Skating Group</strong></p><p>4 hours ago</p></div></div>
                        <div className="activity-item"><div className="icon" style={{backgroundColor: '#fff3e0', color: '#f57c00'}}><PaymentsIcon /></div><div className="description"><p>Payment received from <strong>John Kamau</strong> - KSh 5,500</p><p>6 hours ago</p></div></div>
                    </div>
                </div>
                 <div className="card">
                    <div className="card-header"><h3>Quick Actions</h3></div>
                    <div className="quick-actions">
                        <ul>
                            <li><button className="action-link" onClick={() => onNavigate('AddAthleteForm')}><span className="icon add-athlete"><AthletesIcon /></span> Add New Athlete</button></li>
                            <li><button className="action-link"><span className="icon schedule-training"><TrainingIcon /></span> Schedule Training</button></li>
                            <li><button className="action-link"><span className="icon generate-reports"><ReportsIcon /></span> Generate Reports</button></li>
                            <li><button className="action-link"><span className="icon qr-attendance"><AttendanceIcon /></span> QR Attendance</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AthletesPage = ({ onNavigate, athletes, onSelectAthlete, onDeleteAthlete, searchQuery }) => {
    const [skillFilter, setSkillFilter] = useState('All');
    const [activityFilter, setActivityFilter] = useState('All');
    const [ageFilter, setAgeFilter] = useState('All');
    const [athleteToDelete, setAthleteToDelete] = useState(null);

    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => 
            (skillFilter === 'All' || athlete.skillLevel === skillFilter) &&
            (activityFilter === 'All' || athlete.activity === activityFilter) &&
            (ageFilter === 'All' || athlete.ageGroup === ageFilter) &&
            (fuzzyMatch(searchQuery, athlete.name))
        );
    }, [athletes, skillFilter, activityFilter, ageFilter, searchQuery]);

    const confirmDelete = () => {
        if (athleteToDelete) {
            onDeleteAthlete(athleteToDelete.id);
            setAthleteToDelete(null);
        }
    };

    return (
        <div className="page-container">
            {athleteToDelete && <ConfirmationDialog
                message={`Are you sure you want to delete the record for ${athleteToDelete.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setAthleteToDelete(null)}
            />}
            <div className="card">
                <div className="page-controls">
                    <div className="filters">
                        <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
                             <option value="All">All Activities</option>
                             <option value="Skating">Skating</option>
                             <option value="Swimming">Swimming</option>
                             <option value="Chess">Chess</option>
                        </select>
                         <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                            <option value="All">All Ages</option>
                            <option value="U10">U10</option>
                            <option value="10-14">10-14</option>
                            <option value="15-18">15-18</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => onNavigate('AddAthleteForm')}>Add New Athlete</button>
                </div>
            </div>
            <div className="card">
                {filteredAthletes.length > 0 ? (
                    <div className="list-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th><th>Skill Level</th><th>Activity</th><th>Age Group</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAthletes.map(athlete => (
                                    <tr key={athlete.id}>
                                        <td data-label="Name" data-clickable="true" onClick={() => { onSelectAthlete(athlete); onNavigate('AthleteProfile'); }}>{athlete.name}</td>
                                        <td data-label="Skill Level"><span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></td>
                                        <td data-label="Activity">{athlete.activity}</td>
                                        <td data-label="Age Group">{athlete.ageGroup}</td>
                                        <td data-label="Actions">
                                            <div className="action-buttons">
                                                <button className="action-btn-icon edit-btn" onClick={() => { onSelectAthlete(athlete); onNavigate('EditAthleteForm'); }}><EditIcon /></button>
                                                <button className="action-btn-icon delete-btn" onClick={() => setAthleteToDelete(athlete)}><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><AthletesIcon /></div>
                        <h3>No athletes found</h3>
                        <p>Your search or filter criteria did not match any athletes.</p>
                        <button className="btn btn-primary" onClick={() => onNavigate('AddAthleteForm')}>Add First Athlete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddAthleteForm = ({ onNavigate, onAddAthlete, onUpdateAthlete, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        skillLevel: initialData?.skillLevel || 'Beginner',
        activity: initialData?.activity || 'Skating',
        ageGroup: initialData?.ageGroup || 'U10',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            onUpdateAthlete(initialData.id, formData);
        } else {
            onAddAthlete(formData);
        }
    };
    
    return (
        <div className="page-container">
            <div className="card">
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Age Group</label>
                            <select name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
                                <option>U10</option>
                                <option>10-14</option>
                                <option>15-18</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Skill Level</label>
                            <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Activity</label>
                             <select name="activity" value={formData.activity} onChange={handleChange}>
                                 <option>Skating</option>
                                 <option>Swimming</option>
                                 <option>Chess</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('Athletes')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Update Athlete' : 'Add Athlete'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AthleteProfilePage = ({ onNavigate, athlete, onAddLog, onUpdateLog, onDeleteLog }) => {
    const [logToDelete, setLogToDelete] = useState(null);
    
    if (!athlete) return <div className="page-container"><p>No athlete selected.</p></div>;

    const confirmDelete = () => {
        if (logToDelete) {
            onDeleteLog(athlete.id, logToDelete.id);
            setLogToDelete(null);
        }
    };

    return (
        <div className="page-container">
             {logToDelete && <ConfirmationDialog
                title="Delete Training Log?"
                message={`Are you sure you want to delete this entry? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setLogToDelete(null)}
            />}
            <div className="profile-header">
                <button className="btn btn-secondary back-button" onClick={() => onNavigate('Athletes')}><BackIcon /> Back to List</button>
            </div>
            <div className="profile-card">
                 <div className="profile-card-header">
                    <div className="profile-avatar">{athlete.name.charAt(0)}</div>
                    <div className="profile-info">
                        <h2>{athlete.name}</h2>
                        <p>{athlete.activity}</p>
                    </div>
                 </div>
                 <div className="profile-card-body">
                    <div className="detail-group"><span className="detail-label">Skill Level</span><span className="detail-value">{athlete.skillLevel}</span></div>
                    <div className="detail-group"><span className="detail-label">Age Group</span><span className="detail-value">{athlete.ageGroup}</span></div>
                 </div>
            </div>
            <div className="card">
                <div className="card-header"><h3>Training History & Achievements</h3></div>
                <div className="training-history-content">
                    <div className="add-log-form">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            onAddLog(athlete.id, { date: form.date.value, description: form.description.value });
                            form.reset();
                        }}>
                             <div className="form-grid">
                                <div className="input-group">
                                    <label>Date</label>
                                    <input type="date" name="date" required />
                                </div>
                                <div className="input-group full-width">
                                    <label>Description / Achievement</label>
                                    <input type="text" name="description" placeholder="e.g., Perfected a new technique" required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Add Log</button>
                        </form>
                    </div>
                    <div className="history-list">
                        {athlete.history.length > 0 ? athlete.history.map(log => 
                           <HistoryItem key={log.id} log={log} athlete={athlete} onUpdateLog={onUpdateLog} setLogToDelete={setLogToDelete} />
                        ) : <p className="empty-list-message">No training history recorded yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HistoryItem = ({ log, athlete, onUpdateLog, setLogToDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <HistoryItemEdit log={log} athlete={athlete} onUpdateLog={onUpdateLog} onCancel={() => setIsEditing(false)} />;
    }

    return (
        <div className="history-item">
            <div>
                <span className="history-date">{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <p className="history-description">{log.description}</p>
            </div>
            <div className="history-item-actions">
                <button className="action-btn-icon edit-btn" onClick={() => setIsEditing(true)}><EditIcon/></button>
                <button className="action-btn-icon delete-btn" onClick={() => setLogToDelete(log)}><DeleteIcon/></button>
            </div>
        </div>
    );
};

const HistoryItemEdit = ({ log, athlete, onUpdateLog, onCancel }) => {
    const [formData, setFormData] = useState({ date: log.date, description: log.description });
    
    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSave = () => {
        onUpdateLog(athlete.id, log.id, formData);
        onCancel();
    };

    return (
        <div className="history-item-edit">
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
            <div className="edit-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

const CoachesPage = ({ onNavigate, coaches, onSelectCoach, onDeleteCoach, searchQuery }) => {
    const [coachToDelete, setCoachToDelete] = useState(null);
    
    const filteredCoaches = useMemo(() => {
        return coaches.filter(coach => 
            fuzzyMatch(searchQuery, coach.name) || 
            fuzzyMatch(searchQuery, coach.email) ||
            fuzzyMatch(searchQuery, coach.expertise)
        );
    }, [coaches, searchQuery]);
    
    const confirmDelete = () => {
        if(coachToDelete) {
            onDeleteCoach(coachToDelete.id);
            setCoachToDelete(null);
        }
    };

    return (
         <div className="page-container">
            {coachToDelete && <ConfirmationDialog
                message={`Are you sure you want to delete the record for ${coachToDelete.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setCoachToDelete(null)}
            />}
            <div className="card">
                <div className="page-controls">
                    <div /> {/* Placeholder for alignment */}
                    <button className="btn btn-primary" onClick={() => onNavigate('AddCoachForm')}>Add New Coach</button>
                </div>
            </div>
            <div className="card">
                {filteredCoaches.length > 0 ? (
                     <div className="list-table">
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Expertise</th><th>Actions</th></tr>
                            </thead>
                             <tbody>
                                {filteredCoaches.map(coach => (
                                    <tr key={coach.id}>
                                        <td data-label="Name" data-clickable="true" onClick={() => {onSelectCoach(coach); onNavigate('CoachProfile');}}>{coach.name}</td>
                                        <td data-label="Email">{coach.email}</td>
                                        <td data-label="Phone">{coach.phone}</td>
                                        <td data-label="Expertise">{coach.expertise}</td>
                                        <td data-label="Actions">
                                            <div className="action-buttons">
                                                <button className="action-btn-icon edit-btn" onClick={() => { onSelectCoach(coach); onNavigate('EditCoachForm'); }}><EditIcon /></button>
                                                <button className="action-btn-icon delete-btn" onClick={() => setCoachToDelete(coach)}><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><CoachesIcon /></div>
                        <h3>No coaches found</h3>
                        <p>Get started by adding your first coach to the system.</p>
                        <button className="btn btn-primary" onClick={() => onNavigate('AddCoachForm')}>Add First Coach</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddCoachForm = ({ onNavigate, onAddCoach, onUpdateCoach, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        expertise: initialData?.expertise || 'Skating',
    });

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            onUpdateCoach(initialData.id, formData);
        } else {
            onAddCoach(formData);
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Area of Expertise</label><input type="text" name="expertise" value={formData.expertise} onChange={handleChange} required /></div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('Coaches')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Update Coach' : 'Add Coach'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CoachProfilePage = ({ onNavigate, coach }) => {
    if (!coach) return <div className="page-container"><p>No coach selected.</p></div>;
    return (
        <div className="page-container">
            <div className="profile-header">
                <button className="btn btn-secondary back-button" onClick={() => onNavigate('Coaches')}><BackIcon /> Back to List</button>
            </div>
            <div className="profile-card">
                 <div className="profile-card-header">
                    <div className="profile-avatar">{coach.name.charAt(0)}</div>
                    <div className="profile-info"><h2>{coach.name}</h2><p>{coach.expertise} Coach</p></div>
                 </div>
                 <div className="profile-card-body">
                    <div className="detail-group"><span className="detail-label">Email</span><span className="detail-value">{coach.email}</span></div>
                    <div className="detail-group"><span className="detail-label">Phone</span><span className="detail-value">{coach.phone}</span></div>
                 </div>
            </div>
        </div>
    );
};

const EventsPage = ({ onNavigate, events, onSelectEvent, searchQuery }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEvents = useMemo(() => {
        return events.filter(event => 
            fuzzyMatch(searchQuery, event.name) || 
            fuzzyMatch(searchQuery, event.location)
        );
    }, [events, searchQuery]);

    const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastEvents = filteredEvents.filter(e => new Date(e.date) < today).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const EventCard = ({ event }) => {
        const eventDate = new Date(event.date + 'T00:00:00');
        const month = eventDate.toLocaleString('default', { month: 'short' });
        const day = eventDate.getDate();
        
        const handleCardClick = (e) => {
            if (e.target.closest('.event-edit-btn')) return;
            onSelectEvent(event);
            onNavigate('EventDetails');
        };

        return (
            <div className="event-card" onClick={handleCardClick}>
                <div className="event-date">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                </div>
                <div className="event-details">
                    <h4>{event.name}</h4>
                    <p>{event.time} @ {event.location}</p>
                    <p className="description">{event.description}</p>
                </div>
                <button className="action-btn-icon edit-btn event-edit-btn" onClick={() => { onSelectEvent(event); onNavigate('EditEventForm'); }}><EditIcon/></button>
            </div>
        );
    };

    return (
         <div className="page-container">
            <div className="card">
                <div className="page-controls">
                     <div />
                    <button className="btn btn-primary" onClick={() => onNavigate('AddEventForm')}>Add New Event</button>
                </div>
            </div>

            {upcomingEvents.length > 0 && (
                <div>
                    <h2 className="section-title">Upcoming Events</h2>
                    <div className="events-grid">{upcomingEvents.map(e => <EventCard key={e.id} event={e}/>)}</div>
                </div>
            )}
            
            {pastEvents.length > 0 && (
                 <div>
                    <h2 className="section-title">Past Events</h2>
                    <div className="events-grid">{pastEvents.map(e => <EventCard key={e.id} event={e}/>)}</div>
                </div>
            )}

            {filteredEvents.length === 0 && (
                <div className="card">
                     <div className="empty-state">
                        <div className="empty-state-icon"><EventsIcon /></div>
                        <h3>No Events Found</h3>
                        <p>There are currently no events matching your search.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const AddEventForm = ({ onNavigate, onAddEvent, onUpdateEvent, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        date: initialData?.date || '',
        time: initialData?.time || '',
        location: initialData?.location || '',
        description: initialData?.description || ''
    });

    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            onUpdateEvent(initialData.id, formData);
        } else {
            onAddEvent(formData);
        }
    };
    
    return (
        <div className="page-container">
            <div className="card">
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group full-width"><label>Event Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Time</label><input type="time" name="time" value={formData.time} onChange={handleChange} required /></div>
                        <div className="input-group full-width"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} required /></div>
                        <div className="input-group full-width"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4}></textarea></div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('Events')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Update Event' : 'Create Event'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EventDetailsPage = ({ onNavigate, event }) => {
    if (!event) return <div className="page-container"><p>No event selected.</p></div>;
    const eventDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
        <div className="page-container">
             <div className="profile-header">
                <button className="btn btn-secondary back-button" onClick={() => onNavigate('Events')}><BackIcon /> Back to Events</button>
            </div>
            <div className="card event-details-page-card">
                <div className="event-details-header">
                    <h2>{event.name}</h2>
                    <div className="event-details-meta">
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                    </div>
                </div>
                <div className="event-details-body">
                    <h3>Event Description</h3>
                    <p>{event.description}</p>
                </div>
            </div>
        </div>
    );
};

const PaymentsPage = ({ onNavigate, payments }) => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const mpesaCount = payments.filter(p => p.method === 'M-Pesa').length;

    const timeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="page-container">
             <div className="card">
                <div className="page-controls">
                    <div />
                    <button className="btn btn-primary" onClick={() => onNavigate('AddPaymentForm')}>Record Payment</button>
                </div>
            </div>
            <div className="payment-stats-grid">
                <div className="payment-stat-card">
                    <div className="payment-stat-icon green"><PaymentsIcon/></div>
                    <div>
                        <div className="payment-stat-title">Total Revenue (Month)</div>
                        <div className="payment-stat-value">KSh {totalRevenue.toLocaleString()}</div>
                        <div className="payment-stat-trend green">+15% from last month</div>
                    </div>
                </div>
                 <div className="payment-stat-card">
                    <div className="payment-stat-icon orange"><AttendanceIcon/></div>
                    <div>
                        <div className="payment-stat-title">Pending Payments</div>
                        <div className="payment-stat-value">KSh 45,200</div>
                        <div className="payment-stat-trend orange">8 overdue accounts</div>
                    </div>
                </div>
                <div className="payment-stat-card">
                    <div className="payment-stat-icon blue"><LogoIcon/></div>
                    <div>
                        <div className="payment-stat-title">M-Pesa Transactions</div>
                        <div className="payment-stat-value">{mpesaCount}</div>
                        <div className="payment-stat-trend blue">This month</div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header"><h3>Recent Transactions</h3></div>
                <div className="recent-transactions-list">
                    {payments.map(p => (
                         <div className="transaction-item" key={p.id}>
                            <div className={`transaction-icon ${p.method.toLowerCase()}`}>
                                {p.method === 'M-Pesa' && <LogoIcon/>}
                                {p.method === 'Card' && <PaymentsIcon/>}
                                {p.method === 'Cash' && <AthletesIcon/>}
                            </div>
                            <div className="transaction-details">
                                <div className="transaction-name">{p.name}</div>
                                <div className="transaction-meta">{p.method} • Ref: {p.reference}</div>
                            </div>
                            <div className="transaction-right">
                                <div className="transaction-amount">+KSh {p.amount.toLocaleString()}</div>
                                <div className="transaction-time">{timeAgo(p.date)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AddPaymentForm = ({ onNavigate, onAddPayment }) => {
     const [formData, setFormData] = useState({
        name: '', amount: '', method: 'M-Pesa', reference: ''
    });
    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = e => {
        e.preventDefault();
        onAddPayment({
            name: formData.name,
            amount: parseFloat(formData.amount),
            method: formData.method,
            reference: formData.reference,
        });
    };
    return (
        <div className="page-container">
            <div className="card">
                 <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group"><label>Payer Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Amount (KSh)</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} required /></div>
                        <div className="input-group"><label>Payment Method</label><select name="method" value={formData.method} onChange={handleChange}><option>M-Pesa</option><option>Card</option><option>Cash</option></select></div>
                        <div className="input-group"><label>Reference</label><input type="text" name="reference" value={formData.reference} onChange={handleChange} required /></div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('Payments')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MobileBottomNav = ({ currentPage, onNavigate }) => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Athletes', icon: <AthletesIcon /> },
        { name: 'Events', icon: <EventsIcon /> },
        { name: 'Payments', icon: <PaymentsIcon /> },
    ];
    return (
        <nav className="mobile-bottom-nav">
            {navItems.map(item => (
                <a
                    key={item.name}
                    href="#"
                    className={`mobile-nav-item ${currentPage === item.name ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate(item.name); }}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </a>
            ))}
        </nav>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);