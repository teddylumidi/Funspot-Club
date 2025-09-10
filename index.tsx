

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
        preview: 'Reminder: The swim meet is this Satur...', 
        timestamp: 'Yesterday', 
        unread: 0, 
        conversation: [
            {sender: 'Grace Njeri', text: 'Reminder: The swim meet is this Saturday. Be there by 8 AM.', time: 'Yesterday'}
        ] 
    },
    { 
        id: 3, 
        sender: 'Skating Group Chat', 
        preview: 'Peter: Don\'t forget your helmets!', 
        timestamp: '3 days ago', 
        unread: 1, 
        conversation: [
            {sender: 'David Omondi', text: 'Practice is at 4 PM tomorrow everyone.', time: '4 days ago'},
            {sender: 'Peter', text: 'Don\'t forget your helmets!', time: '3 days ago'}
        ] 
    },
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
const PaymentsIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 6h16v2H4V6zm0 12v-6h16.001l.001 6H4z"></path><path d="M6 14h6v2H6z"></path></svg>);
const EventsIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>);
const LogoutIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>);
const CloseIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>);
const HamburgerIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>);
const SearchIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>);
const BellIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"></path></svg>;
const MessagesIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>;
const NoticeBoardIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>;
const SettingsIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>;
const GoogleIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8H6.306C9.656 39.663 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.823 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>;
const AppleIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19.62 14.47c-.24-1.42-1.12-2.58-2.31-2.62-.19 0-.38.01-.57.03-.43.05-.85.16-1.25.32-1.13.46-2.22 1.05-3.35 1.05-1.16 0-2.1-.56-3.15-1.05-.34-.17-.7-.27-1.07-.31-.15,0-.3.01-.44.01-1.24.03-2.2.98-2.56,2.29-.01.02,0,.03,0,.05,0,.08-.01.16,0,.23,0,.03,0,.05,0,.08.1.8.38,1.55.82,2.21.54.82,1.25,1.62,2.15,2.15.89.51,1.86.73,2.83.74,1.04,0,2.02-.31,2.92-.81.01,0,.02,0,.03,0,.85-.46,1.62-1.1,2.26-1.89.01-.01.02-.02.02-.03.5-.64.81-1.42.92-2.25.01-.06.01-.13.02-.19h.01c.01-.06.01-.11.01-.17,0-.01,0-.02,0-.03.01-.06.01-.12.01-.18zm-6.11-8.67c.92-.99,1.55-2.29,1.6-3.62-.01.06-.01.12-.02.19-.64.12-1.39.5-2.05,1.05-.87.75-1.6,1.84-2.03,3.01.58.05,1.15-.15,1.69-.45.02,0,.03,0,.04-.01.6-.33,1.13-.76,1.77-1.17z"></path></svg>;
const MicrosoftIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M11.4,11.4H2.2V2.2h9.2V11.4z M21.8,11.4h-9.2V2.2h9.2V11.4z M11.4,21.8H2.2v-9.2h9.2V21.8z M21.8,21.8h-9.2v-9.2h9.2V21.8z"></path></svg>;
const BackIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>;
const EditIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>;
const DeleteIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>;
const SaveIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>;
const OfflineIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path></svg>;
const OnlineIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>;
const SyncIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="spin"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>;
const AddIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;


// --- Main App Component --- //
const App = () => {
    // --- State Management --- //
    const [isLoggedIn, setIsLoggedIn] = useStickyState(false, 'isLoggedIn');
    const [currentUser, setCurrentUser] = useStickyState({ id: 1, name: 'Teddy Lumidi', email: 'admin@funpot.com', password: 'password123', role: 'Admin' }, 'currentUser');
    const [users, setUsers] = useStickyState([], 'users');
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
    
    // Data states
    const [athletes, setAthletes] = useStickyState(initialAthletes, 'athletes');
    const [coaches, setCoaches] = useStickyState(initialCoaches, 'coaches');
    const [events, setEvents] = useStickyState(initialEvents, 'events');
    const [payments, setPayments] = useStickyState(initialPayments, 'payments');
    const [announcements, setAnnouncements] = useStickyState(initialAnnouncements, 'announcements');
    const [messages, setMessages] = useStickyState(initialMessages, 'messages');
    const [notifications, setNotifications] = useStickyState([], 'notifications');

    // Selection/Modal states
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [athleteToDelete, setAthleteToDelete] = useState(null);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [coachToDelete, setCoachToDelete] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [logToEdit, setLogToEdit] = useState(null);
    const [logToDelete, setLogToDelete] = useState(null);

    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    // --- Effects --- //
    useEffect(() => {
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
     useEffect(() => {
        // Initialize with default admin if no users exist
        if (users.length === 0) {
            setUsers([{ id: 1, name: 'Teddy Lumidi', email: 'admin@funpot.com', password: 'password123', role: 'Admin' }]);
        }
    }, [users, setUsers]);

    // --- Handlers --- //
    const handleNavigate = (page) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
        setSearchQuery('');
        setSelectedAthlete(null);
        setSelectedCoach(null);
        setSelectedEvent(null);
    };

    // Authentication
    const handleLogin = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };
    
    const handleSignUp = (email, password) => {
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User with this email already exists.' };
        }
        const newUser = { id: Date.now(), name: 'New User', email, password, role: 'Parent' }; // Default role
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setIsLoggedIn(true);
        return { success: true };
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCurrentPage('Dashboard');
    };
    
    const handleRoleChange = (newRole) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, role: newRole });
        }
    };
    
    // Athletes
    const handleAddAthlete = (athlete) => {
        const newAthlete = { ...athlete, id: Date.now(), history: [] };
        setAthletes([...athletes, newAthlete]);
        handleNavigate('Athletes');
    };
    const handleUpdateAthlete = (updatedAthlete) => {
        setAthletes(athletes.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
        handleNavigate('Athletes');
    };
    const handleDeleteAthlete = (id) => {
        setAthletes(athletes.filter(a => a.id !== id));
        setAthleteToDelete(null);
    };

    // Coaches
    const handleAddCoach = (coach) => {
        const newCoach = { ...coach, id: Date.now() };
        setCoaches([...coaches, newCoach]);
        handleNavigate('Coaches');
    };
    const handleUpdateCoach = (updatedCoach) => {
        setCoaches(coaches.map(c => c.id === updatedCoach.id ? updatedCoach : c));
        handleNavigate('Coaches');
    };
    const handleDeleteCoach = (id) => {
        setCoaches(coaches.filter(c => c.id !== id));
        setCoachToDelete(null);
    };

    // Events
    const handleAddEvent = (event) => {
        const newEvent = { ...event, id: Date.now() };
        setEvents([...events, newEvent]);
        addNotification({ type: 'event', text: `New event added: ${event.name}` });
        handleNavigate('Events');
    };
    const handleUpdateEvent = (updatedEvent) => {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        handleNavigate('Events');
    };

    // Payments
    const handleAddPayment = (payment) => {
        const newPayment = { ...payment, id: Date.now(), date: new Date().toISOString() };
        setPayments([newPayment, ...payments]);
        addNotification({ type: 'payment', text: `Payment of KSh ${payment.amount} received from ${payment.name}` });
        handleNavigate('Payments');
    };
    
    // Athlete History
    const handleAddAthleteLog = (athleteId, log) => {
        const newLog = { ...log, id: Date.now() };
        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                return { ...athlete, history: [newLog, ...athlete.history] };
            }
            return athlete;
        });
        setAthletes(updatedAthletes);
        setSelectedAthlete(updatedAthletes.find(a => a.id === athleteId));
    };

    const handleUpdateAthleteLog = (athleteId, updatedLog) => {
        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                const updatedHistory = athlete.history.map(log => log.id === updatedLog.id ? updatedLog : log);
                return { ...athlete, history: updatedHistory };
            }
            return athlete;
        });
        setAthletes(updatedAthletes);
        setSelectedAthlete(updatedAthletes.find(a => a.id === athleteId));
        setLogToEdit(null);
    };

    const handleDeleteAthleteLog = (athleteId, logId) => {
        const updatedAthletes = athletes.map(athlete => {
            if (athlete.id === athleteId) {
                return { ...athlete, history: athlete.history.filter(log => log.id !== logId) };
            }
            return athlete;
        });
        setAthletes(updatedAthletes);
        setSelectedAthlete(updatedAthletes.find(a => a.id === athleteId));
        setLogToDelete(null);
    };

    // Notifications
    const addNotification = (notification) => {
        const newNotification = { ...notification, id: Date.now(), read: false, date: new Date().toISOString() };
        setNotifications([newNotification, ...notifications]);
    };

    const handleMarkNotificationsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
        setIsNotificationPanelOpen(false);
    };
    
    const handleSendMessage = (conversationId, messageText) => {
        const newMessage = {
            sender: 'You',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedMessages = messages.map(msg => {
            if (msg.id === conversationId) {
                return {
                    ...msg,
                    conversation: [...msg.conversation, newMessage],
                    preview: messageText,
                    timestamp: 'Just now'
                };
            }
            return msg;
        });
        setMessages(updatedMessages);
    };
    
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    // --- Render Logic --- //
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
    }

    return (
        <div className="dashboard-layout">
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <Sidebar 
                currentPage={currentPage}
                onNavigate={handleNavigate}
                isSidebarOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                currentUser={currentUser}
            />
            <div className="main-content">
                <MainHeader 
                    page={currentPage}
                    user={currentUser}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearchSubmit={() => handleNavigate('SearchResults')}
                    unreadNotificationsCount={unreadNotificationsCount}
                    onToggleNotificationPanel={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                    onRoleChange={handleRoleChange}
                />
                 {isNotificationPanelOpen && (
                    <NotificationPanel 
                        notifications={notifications} 
                        onClose={handleMarkNotificationsRead}
                    />
                )}
                <MainContent
                    currentPage={currentPage}
                    // Pass all state and handlers
                    athletes={athletes} coaches={coaches} events={events} payments={payments} announcements={announcements} messages={messages}
                    searchQuery={searchQuery}
                    // Athlete Handlers
                    onAddAthlete={handleAddAthlete}
                    onUpdateAthlete={handleUpdateAthlete}
                    onDeleteAthlete={(athlete) => setAthleteToDelete(athlete)}
                    onViewAthlete={(athlete) => { setSelectedAthlete(athlete); handleNavigate('AthleteProfile'); }}
                    onEditAthlete={(athlete) => { setSelectedAthlete(athlete); handleNavigate('EditAthleteForm'); }}
                    selectedAthlete={selectedAthlete}
                    onAddAthleteLog={handleAddAthleteLog}
                    onUpdateAthleteLog={handleUpdateAthleteLog}
                    onDeleteAthleteLog={(log) => setLogToDelete(log)}
                    logToEdit={logToEdit} setLogToEdit={setLogToEdit}
                    logToDelete={logToDelete}
                    // Coach Handlers
                    onAddCoach={handleAddCoach}
                    onUpdateCoach={handleUpdateCoach}
                    onDeleteCoach={(coach) => setCoachToDelete(coach)}
                    onViewCoach={(coach) => { setSelectedCoach(coach); handleNavigate('CoachProfile'); }}
                    onEditCoach={(coach) => { setSelectedCoach(coach); handleNavigate('EditCoachForm'); }}
                    selectedCoach={selectedCoach}
                    // Event Handlers
                    onAddEvent={handleAddEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onViewEvent={(event) => { setSelectedEvent(event); handleNavigate('EventDetails'); }}
                    onEditEvent={(event) => { setSelectedEvent(event); handleNavigate('EditEventForm'); }}
                    selectedEvent={selectedEvent}
                    // Payment Handlers
                    onAddPayment={handleAddPayment}
                    // Message Handlers
                    onSendMessage={handleSendMessage}
                    // Navigation
                    onNavigate={handleNavigate}
                />
            </div>
            <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
            <ToastNotification onlineStatus={onlineStatus} />

            {/* Modals */}
            {athleteToDelete && <ConfirmationDialog title="Delete Athlete" message={`Are you sure you want to delete ${athleteToDelete.name}? This action cannot be undone.`} onConfirm={() => handleDeleteAthlete(athleteToDelete.id)} onCancel={() => setAthleteToDelete(null)} />}
            {coachToDelete && <ConfirmationDialog title="Delete Coach" message={`Are you sure you want to delete ${coachToDelete.name}? This action cannot be undone.`} onConfirm={() => handleDeleteCoach(coachToDelete.id)} onCancel={() => setCoachToDelete(null)} />}
            {logToDelete && selectedAthlete && <ConfirmationDialog title="Delete Log Entry" message="Are you sure you want to delete this training log entry?" onConfirm={() => handleDeleteAthleteLog(selectedAthlete.id, logToDelete.id)} onCancel={() => setLogToDelete(null)} />}
        </div>
    );
};

const LoginPage = ({ onLogin, onSignUp }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSimulatedLogin = () => {
        // Use default admin credentials for simulated social/Microsoft login
        if (!onLogin('admin@funpot.com', 'password123')) {
             setError('Default admin account not found. Please sign up.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (isSignUp) {
            const result = onSignUp(email, password);
            if (!result.success) {
                setError(result.message);
            }
        } else {
            const success = onLogin(email, password);
            if (!success) {
                setError('Invalid email or password.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo"><LogoIcon /></div>
                    <h1>Funpot Skating Club</h1>
                    <p>Management System</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email / Phone</label>
                        <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="e.g., name@example.com or 07..."/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    {!isSignUp && (
                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </form>
                <div className="social-login-divider">or</div>
                <div className="social-login-buttons">
                    <button className="btn social-btn" onClick={handleSimulatedLogin}><GoogleIcon /> Continue with Google</button>
                    <button className="btn social-btn" onClick={handleSimulatedLogin}><AppleIcon /> Continue with Apple</button>
                    <button className="btn social-btn" onClick={handleSimulatedLogin}><MicrosoftIcon /> Continue with Microsoft</button>
                </div>
                 <p className="form-toggle">
                    {isSignUp ? "Already have an account?" : "Need an account?"}{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setError(''); }}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </a>
                </p>
            </div>
        </div>
    );
};

const Sidebar = ({ currentPage, onNavigate, isSidebarOpen, onClose, onLogout, currentUser }) => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
        { name: 'Athletes', icon: <AthletesIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
        { name: 'Coaches', icon: <CoachesIcon />, roles: ['Admin'] },
        { name: 'Payments', icon: <PaymentsIcon />, roles: ['Admin'] },
        { name: 'Events', icon: <EventsIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
        { name: 'Messages', icon: <MessagesIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
        { name: 'Notice Board', icon: <NoticeBoardIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
        { name: 'Settings', icon: <SettingsIcon />, roles: ['Admin', 'Coach', 'Parent', 'Athlete'] },
    ].filter(item => item.roles.includes(currentUser?.role));

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
                <div className="logo"><LogoIcon /></div>
                <h2>Funpot Club</h2>
                <button className="close-sidebar-btn" onClick={onClose}><CloseIcon /></button>
            </div>

            <div className="user-profile">
                <div className="avatar">{currentUser?.name?.charAt(0) || 'U'}</div>
                <div className="user-info">
                    <h4>{currentUser?.name || 'User'}</h4>
                    <p>{currentUser?.role || 'Role'}</p>
                </div>
                <div className="online-indicator"></div>
            </div>

            <nav className="nav-menu">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.name); }} className={`nav-item ${currentPage === item.name ? 'active' : ''}`}>
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
    );
};

const MainHeader = ({ page, user, onToggleSidebar, searchQuery, setSearchQuery, onSearchSubmit, unreadNotificationsCount, onToggleNotificationPanel, onRoleChange }) => {
    const pageTitles = {
        'Dashboard': 'Dashboard',
        'Athletes': 'Athletes Management',
        'Coaches': 'Coaches Management',
        'Payments': 'Payments Management',
        'Events': 'Events & Competitions',
        'AddAthleteForm': 'Add New Athlete',
        'EditAthleteForm': 'Edit Athlete',
        'AthleteProfile': 'Athlete Profile',
        'AddCoachForm': 'Add New Coach',
        'EditCoachForm': 'Edit Coach',
        'CoachProfile': 'Coach Profile',
        'AddEventForm': 'Add New Event',
        'EditEventForm': 'Edit Event',
        'EventDetails': 'Event Details',
        'AddPaymentForm': 'Record Payment',
        'SearchResults': 'Search Results',
        'Notice Board': 'Notice Board',
        'Messages': 'Messages',
        'Settings': 'Settings',
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="hamburger-menu" onClick={onToggleSidebar}><HamburgerIcon /></button>
                <div>
                    <h1>{pageTitles[page] || 'Dashboard'}</h1>
                    <p>Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className="header-right">
                <form className="search-bar" onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}>
                    <SearchIcon />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </form>
                 <div className="role-switcher">
                    <select value={user?.role} onChange={(e) => onRoleChange(e.target.value)}>
                        <option value="Admin">Admin</option>
                        <option value="Coach">Coach</option>
                        <option value="Parent">Parent</option>
                        <option value="Athlete">Athlete</option>
                    </select>
                </div>
                <div className="header-actions">
                    <button className="action-btn" onClick={onToggleNotificationPanel}>
                        <BellIcon />
                        {unreadNotificationsCount > 0 && <span className="notification-badge">{unreadNotificationsCount}</span>}
                    </button>
                </div>
                <div className="header-user-profile">
                     <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                </div>
            </div>
        </header>
    );
};

const MainContent = ({ currentPage, ...props }) => {
    const renderPage = () => {
        switch(currentPage) {
            case 'Dashboard': return <Dashboard onNavigate={props.onNavigate} />;
            case 'Athletes': return <AthletesPage athletes={props.athletes} searchQuery={props.searchQuery} onAddClick={() => props.onNavigate('AddAthleteForm')} onViewClick={props.onViewAthlete} onEditClick={props.onEditAthlete} onDeleteClick={props.onDeleteAthlete} />;
            case 'AddAthleteForm': return <AddAthleteForm onFormSubmit={props.onAddAthlete} onCancel={() => props.onNavigate('Athletes')} />;
            case 'EditAthleteForm': return <AddAthleteForm onFormSubmit={props.onUpdateAthlete} onCancel={() => props.onNavigate('Athletes')} initialData={props.selectedAthlete} />;
            case 'AthleteProfile': return <AthleteProfilePage athlete={props.selectedAthlete} onNavigate={props.onNavigate} onAddLog={props.onAddAthleteLog} onUpdateLog={props.onUpdateAthleteLog} onDeleteLog={props.onDeleteAthleteLog} logToEdit={props.logToEdit} setLogToEdit={props.setLogToEdit} logToDelete={props.logToDelete} />;
            case 'Coaches': return <CoachesPage coaches={props.coaches} searchQuery={props.searchQuery} onAddClick={() => props.onNavigate('AddCoachForm')} onViewClick={props.onViewCoach} onEditClick={props.onEditCoach} onDeleteClick={props.onDeleteCoach} />;
            case 'AddCoachForm': return <AddCoachForm onFormSubmit={props.onAddCoach} onCancel={() => props.onNavigate('Coaches')} />;
            case 'EditCoachForm': return <AddCoachForm onFormSubmit={props.onUpdateCoach} onCancel={() => props.onNavigate('Coaches')} initialData={props.selectedCoach} />;
            case 'CoachProfile': return <CoachProfilePage coach={props.selectedCoach} onNavigate={props.onNavigate} />;
            case 'Payments': return <PaymentsPage payments={props.payments} onAddClick={() => props.onNavigate('AddPaymentForm')} />;
            case 'AddPaymentForm': return <AddPaymentForm onFormSubmit={props.onAddPayment} onCancel={() => props.onNavigate('Payments')} />;
            case 'Events': return <EventsPage events={props.events} searchQuery={props.searchQuery} onAddClick={() => props.onNavigate('AddEventForm')} onViewClick={props.onViewEvent} onEditClick={props.onEditEvent} />;
            case 'AddEventForm': return <AddEventForm onFormSubmit={props.onAddEvent} onCancel={() => props.onNavigate('Events')} />;
            case 'EditEventForm': return <AddEventForm onFormSubmit={props.onUpdateEvent} onCancel={() => props.onNavigate('Events')} initialData={props.selectedEvent} />;
            case 'EventDetails': return <EventDetailsPage event={props.selectedEvent} onNavigate={props.onNavigate} />;
            // FIX: Explicitly pass props to SearchResultsPage to resolve TypeScript error.
            case 'SearchResults': return <SearchResultsPage 
                athletes={props.athletes} 
                coaches={props.coaches} 
                events={props.events} 
                payments={props.payments}
                searchQuery={props.searchQuery}
                onViewAthlete={props.onViewAthlete}
                onViewCoach={props.onViewCoach}
                onViewEvent={props.onViewEvent}
                onNavigate={props.onNavigate}
            />;
            case 'Notice Board': return <NoticeBoardPage announcements={props.announcements} />;
            case 'Messages': return <MessagesPage messages={props.messages} onSendMessage={props.onSendMessage} />;
            case 'Settings': return <SettingsPage />;
            default: return <Dashboard onNavigate={props.onNavigate}/>;
        }
    };
    return (
        <main className="main-content-area">
            {renderPage()}
        </main>
    );
};

// --- Page Components --- //

const Dashboard = ({ onNavigate }) => (
    <div className="page-container">
        <div className="stats-grid">
             <div className="stat-card">
                <div className="stat-card-header"><div className="icon total-athletes"><AthletesIcon /></div></div>
                <div className="stat-card-body">
                    <h3>0</h3>
                    <p>Total Athletes</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-header"><div className="icon active-coaches"><CoachesIcon /></div></div>
                <div className="stat-card-body">
                    <h3>0</h3>
                    <p>Active Coaches</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-header"><div className="icon monthly-revenue"><PaymentsIcon /></div></div>
                <div className="stat-card-body">
                    <h3>KSh 0</h3>
                    <p>Monthly Revenue</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-header"><div className="icon attendance-rate"><EventsIcon /></div></div>
                <div className="stat-card-body">
                    <h3>0%</h3>
                    <p>Attendance Rate</p>
                </div>
            </div>
        </div>
        <div className="main-layout">
            <div className="card">
                <div className="card-header">
                    <h3>Recent Activities</h3>
                    <a href="#" className="view-all">View All</a>
                </div>
                <div className="activity-list">
                    {/* Items here */}
                </div>
            </div>
            <div className="quick-actions">
                 <ul>
                    <li><button onClick={() => onNavigate('AddAthleteForm')} className="action-link"><span className="icon add-athlete"><AthletesIcon /></span> Add New Athlete</button></li>
                    <li><button className="action-link"><span className="icon schedule-training"><EventsIcon /></span> Schedule Training</button></li>
                    <li><button className="action-link"><span className="icon generate-reports"><DashboardIcon /></span> Generate Reports</button></li>
                    <li><button className="action-link"><span className="icon qr-attendance"><CoachesIcon /></span> QR Attendance</button></li>
                </ul>
            </div>
        </div>
    </div>
);

const AthletesPage = ({ athletes, searchQuery, onAddClick, onViewClick, onEditClick, onDeleteClick }) => {
    const [skillFilter, setSkillFilter] = useState('All');
    const [activityFilter, setActivityFilter] = useState('All');
    const [ageFilter, setAgeFilter] = useState('All');

    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => {
            const matchesSearch = fuzzyMatch(searchQuery, athlete.name);
            const matchesSkill = skillFilter === 'All' || athlete.skillLevel === skillFilter;
            const matchesActivity = activityFilter === 'All' || athlete.activity === activityFilter;
            const matchesAge = ageFilter === 'All' || athlete.ageGroup === ageFilter;
            return matchesSearch && matchesSkill && matchesActivity && matchesAge;
        });
    }, [athletes, searchQuery, skillFilter, activityFilter, ageFilter]);
    
    return (
        <div className="page-container">
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
                    <button className="btn btn-primary" onClick={onAddClick}>Add New Athlete</button>
                </div>
            </div>
            {filteredAthletes.length > 0 ? (
                <div className="card list-table">
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
                            {filteredAthletes.map(athlete => (
                                <tr key={athlete.id}>
                                    <td data-label="Name" data-clickable="true" onClick={() => onViewClick(athlete)}>{athlete.name}</td>
                                    <td data-label="Skill Level"><span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></td>
                                    <td data-label="Activity">{athlete.activity}</td>
                                    <td data-label="Age Group">{athlete.ageGroup}</td>
                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                            <button className="action-btn-icon edit-btn" onClick={() => onEditClick(athlete)}><EditIcon /></button>
                                            <button className="action-btn-icon delete-btn" onClick={() => onDeleteClick(athlete)}><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon"><AthletesIcon /></div>
                        <h3>No athletes found</h3>
                        <p>Get started by adding your first athlete to the system.</p>
                        <button className="btn btn-primary" onClick={onAddClick}>Add First Athlete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AddAthleteForm = ({ onFormSubmit, onCancel, initialData = null }) => {
    const [athlete, setAthlete] = useState(initialData || { name: '', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10' });
    const isEditing = !!initialData;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAthlete(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(athlete);
    };
    
    return (
        <div className="card">
            <form className="form-layout" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={athlete.name} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="skillLevel">Skill Level</label>
                        <select id="skillLevel" name="skillLevel" value={athlete.skillLevel} onChange={handleChange}>
                             <option value="Beginner">Beginner</option>
                             <option value="Intermediate">Intermediate</option>
                             <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="activity">Activity</label>
                        <select id="activity" name="activity" value={athlete.activity} onChange={handleChange}>
                            <option value="Skating">Skating</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Chess">Chess</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ageGroup">Age Group</label>
                        <select id="ageGroup" name="ageGroup" value={athlete.ageGroup} onChange={handleChange}>
                             <option value="U10">U10</option>
                             <option value="10-14">10-14</option>
                             <option value="15-18">15-18</option>
                        </select>
                    </div>
                </div>
                 <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Athlete' : 'Add Athlete'}</button>
                </div>
            </form>
        </div>
    );
};

// FIX: Add `logToDelete` to props to fix assignment error.
const AthleteProfilePage = ({ athlete, onNavigate, onAddLog, onUpdateLog, onDeleteLog, logToEdit, setLogToEdit, logToDelete }) => {
    const [newLog, setNewLog] = useState({ date: '', description: '' });

    if (!athlete) return <div className="card"><p>Athlete not found.</p></div>;

    const handleAddLogSubmit = (e) => {
        e.preventDefault();
        if(newLog.description && newLog.date) {
            onAddLog(athlete.id, newLog);
            setNewLog({ date: '', description: '' });
        }
    };

    const handleUpdateLogSubmit = (e, log) => {
        e.preventDefault();
        onUpdateLog(athlete.id, log);
    };

    const HistoryItemEdit = ({ log }) => {
        const [editedLog, setEditedLog] = useState(log);
        return (
            <form className="history-item-edit form-inline" onSubmit={(e) => handleUpdateLogSubmit(e, editedLog)}>
                <input type="date" value={editedLog.date} onChange={(e) => setEditedLog({...editedLog, date: e.target.value})} required/>
                <input type="text" value={editedLog.description} onChange={(e) => setEditedLog({...editedLog, description: e.target.value})} required/>
                <div className="action-buttons">
                    <button type="submit" className="action-btn-icon"><SaveIcon /></button>
                    <button type="button" className="action-btn-icon" onClick={() => setLogToEdit(null)}><CloseIcon /></button>
                </div>
            </form>
        );
    };
    
    return (
        <div className="page-container">
            <div className="card">
                <div className="profile-header">
                    <button onClick={() => onNavigate('Athletes')} className="back-btn"><BackIcon /> Back to Athletes</button>
                    <div className="profile-details">
                        <h2>{athlete.name}</h2>
                        <p><strong>Skill Level:</strong> <span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></p>
                        <p><strong>Activity:</strong> {athlete.activity}</p>
                        <p><strong>Age Group:</strong> {athlete.ageGroup}</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h3>Training History & Achievements</h3></div>
                <div className="add-log-form card">
                    <h4>Add New Log Entry</h4>
                    <form className="form-layout" onSubmit={handleAddLogSubmit}>
                        <div className="form-grid">
                             <div className="form-group">
                                <label>Date</label>
                                <input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} required/>
                            </div>
                            <div className="form-group">
                                <label>Description / Achievement</label>
                                <input type="text" placeholder="e.g., Mastered a new skill" value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} required/>
                            </div>
                        </div>
                        <div className="form-actions" style={{justifyContent: 'flex-start', paddingTop: '10px', borderTop: 'none'}}>
                            <button type="submit" className="btn btn-primary"><AddIcon /> Add Entry</button>
                        </div>
                    </form>
                </div>
                
                <div className="history-list">
                    {athlete.history.length > 0 ? athlete.history.map(log => (
                        logToEdit?.id === log.id ? <HistoryItemEdit key={log.id} log={log} /> :
                        <div className="history-item" key={log.id}>
                            <div>
                                <p><strong>{new Date(log.date + 'T00:00:00').toLocaleDateString()}</strong></p>
                                <p>{log.description}</p>
                            </div>
                            <div className="action-buttons">
                                <button className="action-btn-icon edit-btn" onClick={() => setLogToEdit(log)}><EditIcon /></button>
                                <button className="action-btn-icon delete-btn" onClick={() => onDeleteLog(log)}><DeleteIcon /></button>
                            </div>
                        </div>
                    )) : <p>No training history recorded.</p>}
                </div>
            </div>
        </div>
    );
};

const CoachesPage = ({ coaches, searchQuery, onAddClick, onViewClick, onEditClick, onDeleteClick }) => {
    const filteredCoaches = useMemo(() => {
        return coaches.filter(coach => 
            fuzzyMatch(searchQuery, coach.name) ||
            fuzzyMatch(searchQuery, coach.email) ||
            fuzzyMatch(searchQuery, coach.expertise)
        );
    }, [coaches, searchQuery]);

    return (
        <div className="page-container">
            <div className="card">
                 <div className="page-controls">
                    <div className="filters" style={{flexGrow: 1}}>{/* Placeholder for future filters */}</div>
                    <button className="btn btn-primary" onClick={onAddClick}>Add New Coach</button>
                </div>
            </div>
            {filteredCoaches.length > 0 ? (
                 <div className="card list-table">
                     <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Expertise</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoaches.map(coach => (
                                <tr key={coach.id}>
                                    <td data-label="Name" data-clickable="true" onClick={() => onViewClick(coach)}>{coach.name}</td>
                                    <td data-label="Email">{coach.email}</td>
                                    <td data-label="Phone">{coach.phone}</td>
                                    <td data-label="Expertise">{coach.expertise}</td>
                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                            <button className="action-btn-icon edit-btn" onClick={() => onEditClick(coach)}><EditIcon /></button>
                                            <button className="action-btn-icon delete-btn" onClick={() => onDeleteClick(coach)}><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                 <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon"><CoachesIcon /></div>
                        <h3>No coaches found</h3>
                        <p>Get started by adding your first coach to the system.</p>
                        <button className="btn btn-primary" onClick={onAddClick}>Add First Coach</button>
                    </div>
                </div>
            )}
        </div>
    )
};

const AddCoachForm = ({ onFormSubmit, onCancel, initialData = null }) => {
    const [coach, setCoach] = useState(initialData || { name: '', email: '', phone: '', expertise: 'Skating' });
    const isEditing = !!initialData;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoach(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(coach);
    };
    
    return (
        <div className="card">
            <form className="form-layout" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={coach.name} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={coach.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={coach.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expertise">Expertise</label>
                        <select id="expertise" name="expertise" value={coach.expertise} onChange={handleChange}>
                            <option value="Skating">Skating</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Chess">Chess</option>
                        </select>
                    </div>
                </div>
                 <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Coach' : 'Add Coach'}</button>
                </div>
            </form>
        </div>
    );
};

const CoachProfilePage = ({ coach, onNavigate }) => {
    if (!coach) return <div className="card"><p>Coach not found.</p></div>;
    return (
        <div className="card">
            <div className="profile-header">
                <button onClick={() => onNavigate('Coaches')} className="back-btn"><BackIcon /> Back to Coaches</button>
                <div className="profile-details">
                    <h2>{coach.name}</h2>
                    <p><strong>Email:</strong> {coach.email}</p>
                    <p><strong>Phone:</strong> {coach.phone}</p>
                    <p><strong>Expertise:</strong> {coach.expertise}</p>
                </div>
            </div>
        </div>
    );
};

const PaymentsPage = ({ payments, onAddClick }) => {
    const monthlyRevenue = useMemo(() => payments.reduce((sum, p) => sum + Number(p.amount), 0), [payments]);

    return (
         <div className="page-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-body">
                        <h3>KSh {monthlyRevenue.toLocaleString()}</h3>
                        <p>Total Revenue (Month)</p>
                    </div>
                </div>
                <div className="stat-card">
                     <div className="stat-card-body">
                        <h3>KSh 45,200</h3>
                        <p>Pending Payments</p>
                    </div>
                </div>
                <div className="stat-card">
                     <div className="stat-card-body">
                        <h3>{payments.filter(p => p.method === 'M-Pesa').length}</h3>
                        <p>M-Pesa Transactions</p>
                    </div>
                </div>
            </div>
            <div className="card">
                 <div className="card-header">
                    <h3>Recent Transactions</h3>
                    <button className="btn btn-primary" onClick={onAddClick}>Record Payment</button>
                </div>
                 <div className="transaction-list">
                    {payments.map(payment => (
                        <div className="transaction-item" key={payment.id}>
                            <div className="transaction-details">
                                <h4>{payment.name}</h4>
                                <p>{payment.method} - Ref: {payment.reference}</p>
                            </div>
                            <div className="transaction-amount">
                                <h4>+KSh {Number(payment.amount).toLocaleString()}</h4>
                                <p>{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

const AddPaymentForm = ({ onFormSubmit, onCancel }) => {
    // FIX: Initialize amount as a number and update handleChange to parse input to a number to satisfy TypeScript type inference.
    const [payment, setPayment] = useState({ name: '', amount: 0, method: 'M-Pesa', reference: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            setPayment(prev => ({ ...prev, amount: parseInt(value, 10) || 0 }));
        } else {
            setPayment(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit({...payment, amount: Number(payment.amount) });
    };

    return (
         <div className="card">
            <form className="form-layout" onSubmit={handleSubmit}>
                 <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Payer's Name</label>
                        <input type="text" id="name" name="name" value={payment.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount (KSh)</label>
                        <input type="text" inputMode="numeric" id="amount" name="amount" value={payment.amount} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="method">Payment Method</label>
                        <select id="method" name="method" value={payment.method} onChange={handleChange}>
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Card">Bank Card</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reference">Reference / Receipt No.</label>
                        <input type="text" id="reference" name="reference" value={payment.reference} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Record Payment</button>
                </div>
            </form>
        </div>
    );
};

const EventsPage = ({ events, searchQuery, onAddClick, onViewClick, onEditClick }) => {
     const today = new Date();
     const upcomingEvents = useMemo(() => events.filter(e => new Date(e.date) >= today && fuzzyMatch(searchQuery, e.name)).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events, searchQuery, today]);
     const pastEvents = useMemo(() => events.filter(e => new Date(e.date) < today && fuzzyMatch(searchQuery, e.name)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [events, searchQuery, today]);
    
    const EventCard = ({ event, onEdit, onView }) => (
        <div className="event-card" onClick={() => onView(event)}>
             <div className="event-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(event); }}>
                <button className="action-btn-icon edit-btn"><EditIcon /></button>
            </div>
            <div className="event-card-header">
                <h4>{event.name}</h4>
                 <p>{new Date(event.date + 'T00:00:00').toDateString()}</p>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="card">
                <div className="page-controls">
                    <div className="filters" style={{flexGrow: 1}}>{/* Placeholder for future filters */}</div>
                    <button className="btn btn-primary" onClick={onAddClick}>Add New Event</button>
                </div>
            </div>
            <div className="upcoming-events">
                <h3 className="section-title">Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="events-grid">
                        {upcomingEvents.map(event => <EventCard key={event.id} event={event} onEdit={onEditClick} onView={onViewClick} />)}
                    </div>
                ) : <p>No upcoming events.</p>}
            </div>
             <div className="past-events">
                <h3 className="section-title">Past Events</h3>
                {pastEvents.length > 0 ? (
                    <div className="events-grid">
                        {pastEvents.map(event => <EventCard key={event.id} event={event} onEdit={onEditClick} onView={onViewClick} />)}
                    </div>
                ) : <p>No past events.</p>}
            </div>
        </div>
    );
};

const AddEventForm = ({ onFormSubmit, onCancel, initialData = null }) => {
    const [event, setEvent] = useState(initialData || { name: '', date: '', time: '', location: '', description: '' });
    const isEditing = !!initialData;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(event);
    };
    
    return (
        <div className="card">
            <form className="form-layout" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Event Name</label>
                        <input type="text" id="name" name="name" value={event.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" name="location" value={event.location} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={event.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input type="time" id="time" name="time" value={event.time} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" rows="4" value={event.description} onChange={handleChange}></textarea>
                    </div>
                </div>
                 <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Event' : 'Add Event'}</button>
                </div>
            </form>
        </div>
    );
};

const EventDetailsPage = ({ event, onNavigate }) => {
     if (!event) return <div className="card"><p>Event not found.</p></div>;
    return (
        <div className="card event-details-page-card">
            <div className="profile-header">
                <button onClick={() => onNavigate('Events')} className="back-btn"><BackIcon /> Back to Events</button>
                <h2>{event.name}</h2>
            </div>
            <div className="profile-details">
                <p><strong>Date:</strong> {new Date(event.date + 'T00:00:00').toDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Details:</strong> {event.description || 'No description provided.'}</p>
            </div>
        </div>
    );
};

const NoticeBoardPage = ({ announcements }) => (
    <div className="page-container">
        {announcements.map(announcement => (
            <div className="card announcement-card" key={announcement.id}>
                <h3>{announcement.title}</h3>
                <small>Posted on: {new Date(announcement.date).toDateString()}</small>
                <p>{announcement.content}</p>
            </div>
        ))}
    </div>
);

const MessagesPage = ({ messages, onSendMessage }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [selectedConversation]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation) {
            onSendMessage(selectedConversation.id, newMessage);
            setNewMessage('');
            // After message is sent, we need to get the updated conversation to scroll
            setTimeout(() => {
                 if (chatBodyRef.current) {
                    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
                }
            }, 0);
        }
    };

    return (
        <div className="messages-page card">
            <div className="messages-layout">
                <div className="conversations-list">
                    <div className="conversations-header">
                        <h3>Conversations</h3>
                    </div>
                    <div className="conversation-items">
                        {messages.map(msg => (
                            <div key={msg.id} className={`conversation-item ${selectedConversation?.id === msg.id ? 'active' : ''}`} onClick={() => handleSelectConversation(msg)}>
                                <div className="conversation-avatar">{msg.sender.charAt(0)}</div>
                                <div className="conversation-details">
                                    <p className="conversation-sender">{msg.sender}</p>
                                    <p className="conversation-preview">{msg.preview}</p>
                                </div>
                                <div className="conversation-meta">
                                    <p className="conversation-timestamp">{msg.timestamp}</p>
                                    {msg.unread > 0 && <div className="unread-badge">{msg.unread}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat-window">
                    {selectedConversation ? (
                        <>
                            <div className="chat-header">
                                <h3>{selectedConversation.sender}</h3>
                            </div>
                            <div className="chat-body" ref={chatBodyRef}>
                                {selectedConversation.conversation.map((message, index) => (
                                    <div key={index} className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}>
                                        <p>{message.text}</p>
                                        <span>{message.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-footer">
                                <form onSubmit={handleFormSubmit}>
                                    <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                    <button type="submit" className="btn btn-primary">Send</button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                             <MessagesIcon />
                             <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => (
    <div className="page-container">
        <div className="card">
            <h3>Notification Preferences</h3>
            <p>Manage your notification settings here. (Feature coming soon)</p>
        </div>
        <div className="card">
            <h3>Account Settings</h3>
            <p>Manage your account details here. (Feature coming soon)</p>
        </div>
    </div>
);

// FIX: Update SearchResultsPage to accept and use onView handlers for correct navigation and to fix type errors.
const SearchResultsPage = ({ onNavigate, searchQuery, athletes, coaches, events, payments, onViewAthlete, onViewCoach, onViewEvent }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const allResults = useMemo(() => {
        if (!searchQuery) return [];
        const athleteResults = athletes.filter(a => fuzzyMatch(searchQuery, a.name)).map(a => ({ ...a, type: 'Athlete' }));
        const coachResults = coaches.filter(c => fuzzyMatch(searchQuery, c.name) || fuzzyMatch(searchQuery, c.email)).map(c => ({ ...c, type: 'Coach' }));
        const eventResults = events.filter(e => fuzzyMatch(searchQuery, e.name) || fuzzyMatch(searchQuery, e.location)).map(e => ({ ...e, type: 'Event' }));
        const paymentResults = payments.filter(p => fuzzyMatch(searchQuery, p.name) || fuzzyMatch(searchQuery, p.reference)).map(p => ({ ...p, type: 'Payment' }));
        return [...athleteResults, ...coachResults, ...eventResults, ...paymentResults];
    }, [searchQuery, athletes, coaches, events, payments]);
    
    const totalPages = Math.ceil(allResults.length / itemsPerPage);
    const paginatedResults = allResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getQuickAction = (result) => {
        switch(result.type) {
            case 'Athlete':
                return { text: 'View Profile', action: () => onViewAthlete(result) };
            case 'Coach':
                return { text: 'View Profile', action: () => onViewCoach(result) };
            case 'Event':
                return { text: 'View Details', action: () => onViewEvent(result) };
             case 'Payment':
                return { text: 'View Details', action: () => onNavigate('Payments') }; // Payments don't have a detail page
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h3>Search Results for "{searchQuery}"</h3>
                    <p>{allResults.length} result(s) found</p>
                </div>
                {paginatedResults.length > 0 ? (
                    paginatedResults.map(result => (
                         <div className="search-result-card" key={`${result.type}-${result.id}`}>
                            <div className="result-icon">
                                {result.type === 'Athlete' && <AthletesIcon />}
                                {result.type === 'Coach' && <CoachesIcon />}
                                {result.type === 'Event' && <EventsIcon />}
                                {result.type === 'Payment' && <PaymentsIcon />}
                            </div>
                            <div className="result-details">
                                <h4>{result.name}</h4>
                                <p>{result.type}</p>
                            </div>
                            <div className="result-actions">
                                {getQuickAction(result) && (
                                    <button className="btn btn-secondary" onClick={getQuickAction(result).action}>
                                        {getQuickAction(result).text}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No results found.</p>
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Common Components --- //
const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button className="btn btn-danger" onClick={onConfirm}>Confirm Delete</button>
            </div>
        </div>
    </div>
);

const ToastNotification = ({ onlineStatus }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        clearTimeout(timerRef.current);
        if (onlineStatus) {
            setMessage('Back Online');
            setType('online');
        } else {
            setMessage('You are offline. Changes will be saved locally.');
            setType('offline');
        }
        setVisible(true);
        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timerRef.current);
    }, [onlineStatus]);

    if (!visible) return null;

    return (
         <div className={`toast-notification ${type}`}>
            {type === 'online' && <OnlineIcon />}
            {type === 'offline' && <OfflineIcon />}
            {type === 'syncing' && <SyncIcon />}
            <span>{message}</span>
        </div>
    );
};

const NotificationPanel = ({ notifications, onClose }) => {
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return (
        <div className="notification-panel">
            <div className="notification-panel-header">
                <h3>Notifications</h3>
                <button className="link-button" onClick={onClose}>Mark all as read</button>
            </div>
            <div className="notification-list">
                {sortedNotifications.length > 0 ? sortedNotifications.map(n => (
                    <div className={`notification-item ${n.read ? 'read' : ''}`} key={n.id}>
                        <div className={`notification-icon ${n.type}`}>
                            {n.type === 'payment' && <PaymentsIcon />}
                            {n.type === 'event' && <EventsIcon />}
                        </div>
                        <div className="notification-content">
                            <p>{n.text}</p>
                            <small>{new Date(n.date).toLocaleString()}</small>
                        </div>
                    </div>
                )) : <p style={{padding: '20px', textAlign: 'center', color: 'var(--text-secondary)'}}>No new notifications.</p>}
            </div>
        </div>
    );
}

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
                 <a href="#" key={item.name} onClick={(e) => { e.preventDefault(); onNavigate(item.name); }} className={`mobile-nav-item ${currentPage === item.name ? 'active' : ''}`}>
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