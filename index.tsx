
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Custom hook to persist state to localStorage
const useStickyState = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};


const initialAthletes = [
    { id: 1, name: 'Sarah Wanjiku', skillLevel: 'Beginner', activity: 'Skating', history: [
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

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setToastInfo({ show: true, message: 'Syncing data...', type: 'syncing' });
            setTimeout(() => {
                setToastInfo({ show: true, message: 'You are back online!', type: 'online' });
                setTimeout(() => setToastInfo(p => ({ ...p, show: false })), 2000);
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
        };
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('Dashboard');
    };

    const handleAddAthlete = (newAthlete) => {
        setAthletes(prev => [...prev, { id: Date.now(), ...newAthlete, history: [] }]);
        setCurrentPage('Athletes');
    };

    const handleUpdateAthlete = (athleteId, updatedData) => {
        setAthletes(prev => prev.map(athlete =>
            athlete.id === athleteId ? { ...athlete, ...updatedData } : athlete
        ));
        setCurrentPage('Athletes');
        setSelectedAthlete(null);
    };

    const handleDeleteAthlete = (athleteId) => {
        setAthletes(prev => prev.filter(a => a.id !== athleteId));
    };
    
    const handleAddAthleteLog = (athleteId, newLog) => {
        const newLogEntry = { id: Date.now(), ...newLog };
        let updatedSelectedAthlete = null;

        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                const updatedHistory = [...(athlete.history || []), newLogEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const updatedAthlete = { ...athlete, history: updatedHistory };
                if (selectedAthlete && selectedAthlete.id === athleteId) {
                    updatedSelectedAthlete = updatedAthlete;
                }
                return updatedAthlete;
            }
            return athlete;
        });

        setAthletes(updatedAthletes);
        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };
    
    const handleUpdateAthleteLog = (athleteId, logId, updatedLog) => {
        let updatedSelectedAthlete = null;
        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                const updatedHistory = athlete.history.map(log => log.id === logId ? { ...log, ...updatedLog } : log)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const updatedAthlete = { ...athlete, history: updatedHistory };
                if (selectedAthlete && selectedAthlete.id === athleteId) {
                    updatedSelectedAthlete = updatedAthlete;
                }
                return updatedAthlete;
            }
            return athlete;
        });

        setAthletes(updatedAthletes);
        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };

    const handleDeleteAthleteLog = (athleteId, logId) => {
        let updatedSelectedAthlete = null;
        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                const updatedHistory = athlete.history.filter(log => log.id !== logId);
                const updatedAthlete = { ...athlete, history: updatedHistory };
                 if (selectedAthlete && selectedAthlete.id === athleteId) {
                    updatedSelectedAthlete = updatedAthlete;
                }
                return updatedAthlete;
            }
            return athlete;
        });
        setAthletes(updatedAthletes);
        if (updatedSelectedAthlete) {
            setSelectedAthlete(updatedSelectedAthlete);
        }
    };

    const handleAddCoach = (newCoach) => {
        setCoaches(prev => [...prev, { id: Date.now(), ...newCoach }]);
        setCurrentPage('Coaches');
    };
    
    const handleUpdateCoach = (coachId, updatedData) => {
        setCoaches(prev => prev.map(coach => 
            coach.id === coachId ? { ...coach, ...updatedData } : coach
        ));
