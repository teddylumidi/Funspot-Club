
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

const initialTasks = [
    { id: 1, title: 'Plan new choreography for U10', dueDate: '2025-09-30', completed: false, assignedTo: 1 },
    { id: 2, title: 'Order new team swimsuits', dueDate: '2025-10-05', completed: false, assignedTo: 2 },
    { id: 3, title: 'Finalize Gala schedule', dueDate: '2025-09-28', completed: true, assignedTo: 1 }
];


const fuzzyMatch = (pattern, str) => {
  if (!pattern) return true;
  if (!str) return false;
  const searchPattern = pattern.split('').join('.*');
  const re = new RegExp(searchPattern, 'i');
  return re.test(str);
};

// --- SVG Icons --- //
const LogoIcon = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13.545 2.165a.5.5 0 0 1 .91 0l1.25 2.5a.5.5 0 0 1-.455.717H13.5a.5.5 0 0 1-.5-.5v-2.717ZM8.5 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM14.12 11.882c.111.419.22.848.33 1.287.173.693.355 1.42.553 2.18.293 1.12.63 2.298.532 3.54-.1 1.27-.923 2.04-2.22 2.04-1.01 0-1.74-.6-2.18-1.52-.46-1.02-.38-2.23.28-3.33.56-.91 1.29-1.85 2.18-2.73.92-.92 1.89-1.81 2.73-2.73.19-.21.36-.42.53-.63a.48.48 0 0 0-.01-.73c-.41-.33-.8-.68-1.2-.99-.37-.3-.74-.6-1.11-.9a.48.48 0 0 0-.64.04c-.38.41-.75.83-1.12 1.25-.37.42-.74.84-1.1 1.28-.27.33-.54.65-.81 1a.48.48 0 0 1-.6.04c-.46-.35-.9-.72-1.34-1.07-.42-.35-.85-.68-1.27-1.02a.48.48 0 0 0-.6-.02c-.52.4-1.02.82-1.52 1.25-.48.4-.95.8-1.42 1.2a.48.48 0 0 0-.1.68c.21.49.42.98.64 1.46.22.48.45.96.68 1.43.25.52.52 1.04.8 1.55.28.51.56 1.02.85 1.52.28.5.58 1 .88 1.48.3.49.6.97.92 1.45.32.48.65.95.98 1.4a.48.48 0 0 0 .66.2c.5-.22.98-.46 1.46-.7.48-.24.95-.48 1.42-.73.47-.25.93-.5 1.4-.76.46-.26.92-.53 1.37-.8a.48.48 0 0 0 .14-.65c-.14-.49-.28-.98-.43-1.46-.15-.49-.3-1-.45-1.48-.15-.5-.3-1-.46-1.5-.16-.51-.33-1.01-.5-1.5-.17-.49-.34-.98-.52-1.46a.48.48 0 0 0-.54-.36Z"></path></svg>);
const DashboardIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const AthletesIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const CoachesIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const EventsIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const PaymentsIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>);
const TasksIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>);
const NoticeBoardIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="16" x2="13" y2="16"></line></svg>);
const MessagesIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const LogoutIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const SearchIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const NotificationIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const HamburgerIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const MoreIcon = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>);
const RevenueIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const AttendanceIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>;
const PlusIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ReportIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 17l4 4 4-4"></path><path d="M12 3v18"></path><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"></path><path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"></path></svg>;
const QRIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const EditIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const EmptyIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="8" y2="15.01"></line><line x1="16" y1="15" x2="16" y2="15.01"></line><path d="M9 10h.01"></path><path d="M15 10h.01"></path></svg>;
const ArrowLeftIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SendIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const ChatIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

// Main App Component
const App = () => {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useStickyState(false, 'auth-status');
    // App State
    const [athletes, setAthletes] = useStickyState(initialAthletes, 'athletes-data');
    const [coaches, setCoaches] = useStickyState(initialCoaches, 'coaches-data');
    const [events, setEvents] = useStickyState(initialEvents, 'events-data');
    const [payments, setPayments] = useStickyState(initialPayments, 'payments-data');
    const [announcements, setAnnouncements] = useStickyState(initialAnnouncements, 'announcements-data');
    const [messages, setMessages] = useStickyState(initialMessages, 'messages-data');
    const [tasks, setTasks] = useStickyState(initialTasks, 'tasks-data');

    // UI State
    const [role, setRole] = useStickyState('Admin', 'user-role');
    const [page, setPage] = useStickyState({ name: 'Dashboard', params: {} }, 'current-page');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const navigate = (name, params = {}) => {
        setPage({ name, params });
        setSidebarOpen(false); // Close sidebar on navigation
    };

    // Data handling functions
    const handleRegisterForEvent = (eventId, athleteId) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                if (!event.attendees.includes(athleteId)) {
                    return { ...event, attendees: [...event.attendees, athleteId] };
                }
            }
            return event;
        }));
        showToast('Successfully registered for the event!');
    };

    const handleAddTask = (task) => {
        setTasks(prev => [...prev, { ...task, id: Date.now(), completed: false }]);
    };
    const handleToggleTask = (taskId) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };
    const handleDeleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };
    
    const handleAddAthleteHistory = (athleteId, log) => {
        setAthletes(prev => prev.map(a => 
            a.id === athleteId
                ? { ...a, history: [{...log, id: Date.now()}, ...a.history] } // Add new log to the beginning
                : a
        ));
        showToast('Progress log added successfully!');
    };

    const handleUpdateAthlete = (updatedAthlete) => {
        setAthletes(prev => prev.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
        showToast('Athlete details updated successfully!');
    };

    const handleDeleteAthlete = (athleteId) => {
        setAthletes(prev => prev.filter(a => a.id !== athleteId));
        showToast('Athlete deleted successfully.', 'danger');
        navigate('Athletes'); // Go back to the list after deletion
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    const renderPage = () => {
        switch (page.name) {
            case 'Dashboard':
                return <DashboardPage athletes={athletes} coaches={coaches} payments={payments} announcements={announcements} events={events} navigate={navigate} />;
            case 'Athletes':
                return <AthletesPage athletes={athletes} navigate={navigate} />;
            case 'AthleteProfile':
                return <AthleteProfilePage 
                            athlete={athletes.find(a => a.id === page.params.id)}
                            onAddHistory={handleAddAthleteHistory}
                            onUpdateAthlete={handleUpdateAthlete}
                            onDeleteAthlete={handleDeleteAthlete}
                            navigate={navigate} 
                        />;
            case 'Events':
                return <EventsPage events={events} navigate={navigate} />;
            case 'EventDetails':
                return <EventDetailsPage
                    event={events.find(e => e.id === page.params.id)}
                    athletes={athletes}
                    role={role}
                    onRegister={handleRegisterForEvent}
                    navigate={navigate}
                />;
            case 'Payments':
                return <PaymentsPage payments={payments} />;
            case 'Notice Board':
                return <NoticeBoardPage announcements={announcements} />;
            case 'Messages':
                return <MessagesPage messages={messages} />;
            case 'Tasks':
                 return <TasksPage tasks={tasks} coaches={coaches} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />;
            case 'Search':
                return <SearchResultsPage 
                            query={page.params.query}
                            athletes={athletes}
                            coaches={coaches}
                            events={events}
                            navigate={navigate}
                        />;
            case 'Profile': // For Parent/Athlete role
                 return <AthleteProfilePage 
                            athlete={athletes.find(a => a.id === 1)} // Demo: linked to first athlete
                            onAddHistory={handleAddAthleteHistory}
                            onUpdateAthlete={handleUpdateAthlete}
                            onDeleteAthlete={handleDeleteAthlete}
                            navigate={navigate} 
                        />;

            default:
                return <h1>Page not found</h1>;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                role={role}
                currentPage={page.name}
                navigate={navigate}
                onLogout={() => setIsAuthenticated(false)}
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <main className="main-content">
                <Header 
                    role={role}
                    setRole={setRole}
                    onMenuClick={() => setSidebarOpen(true)}
                    navigate={navigate}
                />
                {renderPage()}
            </main>
            <MobileBottomNav role={role} currentPage={page.name} navigate={navigate} />
            {toast && <div className={`toast-notification ${toast.type}`}>{toast.message}</div>}
        </div>
    );
};

// --- SCREENS & PAGES --- //

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            onLogin();
        } else {
            setError('Please enter your email and password.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo"><LogoIcon /></div>
                    <h1>Welcome Back</h1>
                    <p>Login to manage your club activities.</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

const UpcomingEventBanner = ({ event, navigate }) => {
    if (!event) {
        return (
            <div className="upcoming-event-banner info">
                <EventsIcon />
                <div className="banner-content">
                    <h4>No Upcoming Events</h4>
                    <p>Check back later for new events and announcements.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="upcoming-event-banner" onClick={() => navigate('EventDetails', { id: event.id })}>
            <EventsIcon />
            <div className="banner-content">
                <h4>Next Event: {event.name}</h4>
                <p>{new Date(event.date).toDateString()} at {event.time} - {event.location}</p>
            </div>
            <div className="banner-action">
                <span>View Details &rarr;</span>
            </div>
        </div>
    );
};


const DashboardPage = ({ athletes, coaches, payments, announcements, events, navigate }) => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const nextEvent = useMemo(() => {
        const upcomingEvents = events
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    }, [events]);


    return (
        <>
            <UpcomingEventBanner event={nextEvent} navigate={navigate} />
            <div className="stats-grid">
                <StatCard icon={<AthletesIcon />} title="Total Athletes" value={athletes.length} color="blue" />
                <StatCard icon={<CoachesIcon />} title="Active Coaches" value={coaches.length} color="teal" />
                <StatCard icon={<RevenueIcon />} title="Monthly Revenue" value={`KES ${totalRevenue.toLocaleString()}`} color="orange" />
                <StatCard icon={<AttendanceIcon />} title="Attendance Rate" value="92%" color="green" />
            </div>
            <div className="main-layout">
                <div className="card">
                    <CardHeader title="Recent Announcements" onViewAll={() => navigate('Notice Board')} />
                    <div className="activity-list">
                        {announcements.slice(0, 3).map(item => (
                            <div key={item.id} className="activity-item">
                                <div className="icon" style={{ backgroundColor: 'var(--blue-light)', color: 'var(--blue-dark)'}}><NoticeBoardIcon /></div>
                                <div className="description">
                                    <p>{item.title}</p>
                                    <p>{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <CardHeader title="Quick Actions" />
                    <div className="quick-actions">
                        <ul>
                            <li><button className="action-link" onClick={() => navigate('Athletes')}><span className="icon add-athlete"><PlusIcon /></span> Add New Athlete</button></li>
                            <li><button className="action-link" onClick={() => navigate('Events')}><span className="icon schedule-training"><EventsIcon /></span> Schedule Training</button></li>
                            <li><button className="action-link"><span className="icon generate-reports"><ReportIcon /></span> Generate Reports</button></li>
                             <li><button className="action-link"><span className="icon qr-attendance"><QRIcon /></span> QR Attendance</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

const AthletesPage = ({ athletes, navigate }) => (
    <div className="card">
        <CardHeader title="Athletes" />
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
                        <tr key={athlete.id} onClick={() => navigate('AthleteProfile', { id: athlete.id })} style={{cursor: 'pointer'}}>
                            <td data-label="Name">{athlete.name}</td>
                            <td data-label="Skill Level"><span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></td>
                            <td data-label="Activity">{athlete.activity}</td>
                            <td data-label="Age Group">{athlete.ageGroup}</td>
                            <td data-label="Actions">
                                <div className="action-buttons" onClick={e => e.stopPropagation()}>
                                    <button className="action-btn-icon edit-btn" aria-label="Edit"><EditIcon /></button>
                                    <button className="action-btn-icon delete-btn" aria-label="Delete"><DeleteIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ProgressChart = ({ data }) => {
    const svgRef = useRef(null);
    const [width, setWidth] = useState(0);
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    useEffect(() => {
        if (svgRef.current) {
            setWidth(svgRef.current.parentElement.offsetWidth);
        }
        const handleResize = () => {
            if (svgRef.current?.parentElement) {
                setWidth(svgRef.current.parentElement.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (width === 0 || data.length < 2) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const minDate = data[0].date;
    const maxDate = data[data.length - 1].date;
    const minValue = Math.min(...data.map(d => d.value)) * 0.9;
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1;

    const xScale = (date) => margin.left + ((date.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime() || 1)) * innerWidth;
    const yScale = (value) => margin.top + innerHeight - (((value - minValue) / (maxValue - minValue || 1)) * innerHeight);

    const linePath = data.map((d, i) => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
    }).join(' ');
    
    const areaPath = `${linePath} V ${margin.top + innerHeight} H ${margin.left} Z`;
    
    const yAxisTicks = Array.from({length: 3}, (_, i) => minValue + i * (maxValue - minValue) / 2);
    const xAxisTicks = [data[0], data[Math.floor((data.length - 1) / 2)], data[data.length - 1]];


    return (
        <svg ref={svgRef} width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
                <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: 'var(--primary-pink)', stopOpacity: 0.4}} />
                    <stop offset="100%" style={{stopColor: 'var(--primary-pink)', stopOpacity: 0.05}} />
                </linearGradient>
            </defs>
            
            {yAxisTicks.map((tick, i) => (
                <g key={i} className="grid-line">
                    <line x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} />
                    <text x={margin.left - 8} y={yScale(tick)} dy="0.32em" textAnchor="end">{Math.round(tick)}</text>
                </g>
            ))}

            {xAxisTicks.map((d, i) => (
                <g key={i} className="axis-label" transform={`translate(${xScale(d.date)}, ${height - margin.bottom + 15})`}>
                    <text textAnchor="middle">{d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>
                </g>
            ))}
            
            <path d={areaPath} fill="url(#area-gradient)" />
            <path d={linePath} fill="none" stroke="var(--primary-pink)" strokeWidth="2" />
            
            {data.map((d, i) => (
                <circle key={i} cx={xScale(d.date)} cy={yScale(d.value)} r="4" fill="var(--primary-pink)" stroke="var(--bg-card)" strokeWidth="2" />
            ))}
        </svg>
    );
};

const AthleteProfilePage = ({ athlete, onAddHistory, onUpdateAthlete, onDeleteAthlete, navigate }) => {
    const [historyFilter, setHistoryFilter] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const [newLogDescription, setNewLogDescription] = useState('');
    const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);

    const chartData = useMemo(() => {
        const dataPoints = [];
        const regex = /(?:score|time|seconds|points)[\s:]*(\d+\.?\d*)/i;

        athlete?.history.forEach(log => {
            const match = log.description.match(regex);
            if (match && match[1]) {
                dataPoints.push({
                    date: new Date(log.date),
                    value: parseFloat(match[1])
                });
            }
        });
        return dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [athlete?.history]);

    if (!athlete) {
        return <div className="card"><p>Athlete not found. They may have been deleted.</p></div>;
    }
    
    const handleAddLog = (e) => {
        e.preventDefault();
        if (!newLogDescription.trim()) return;
        onAddHistory(athlete.id, { date: newLogDate, description: newLogDescription });
        setNewLogDescription('');
    };
    
    const filteredHistory = athlete.history.filter(log =>
        log.description.toLowerCase().includes(historyFilter.toLowerCase())
    );

    return (
        <div className="page-container">
             <div className="profile-header">
                <button className="back-btn" onClick={() => navigate('Athletes')}><ArrowLeftIcon /> Back to Athletes</button>
            </div>
            <div className="card">
                <CardHeader title={athlete.name}>
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => setEditModalOpen(true)}><EditIcon /> Edit</button>
                        <button className="btn btn-danger" onClick={() => setDeleteModalOpen(true)}><DeleteIcon /> Delete</button>
                    </div>
                </CardHeader>
                <div className="profile-details">
                    <p><strong>Activity:</strong> {athlete.activity}</p>
                    <p><strong>Skill Level:</strong> <span className={`pill ${athlete.skillLevel.toLowerCase()}`}>{athlete.skillLevel}</span></p>
                    <p><strong>Age Group:</strong> {athlete.ageGroup}</p>
                </div>
            </div>
            <div className="card">
                <CardHeader title="Progress History" />
                {chartData.length >= 2 ? (
                    <div className="chart-container">
                        <ProgressChart data={chartData} />
                    </div>
                ) : (
                    <div className="chart-placeholder">
                        <p>No numerical progress data available to generate a chart. Add logs with keywords like "score", "time", or "points" to see a chart.</p>
                    </div>
                )}
                <form onSubmit={handleAddLog} className="add-log-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="logDate">Date</label>
                            <input 
                                type="date" 
                                id="logDate"
                                value={newLogDate}
                                onChange={(e) => setNewLogDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="logDescription">Description</label>
                            <input 
                                type="text" 
                                id="logDescription"
                                placeholder="e.g., Mastered new skill, score: 95" 
                                value={newLogDescription}
                                onChange={(e) => setNewLogDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions" style={{paddingTop: '10px', marginTop: 0, borderTop: 'none', justifyContent: 'flex-start'}}>
                        <button type="submit" className="btn btn-primary"><PlusIcon /> Add Log</button>
                    </div>
                </form>

                <div className="form-group" style={{marginBottom: '20px'}}>
                  <input 
                    type="text" 
                    placeholder="Filter history..." 
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                  />
                </div>
                {filteredHistory.length > 0 ? (
                    <div className="history-list">
                        {filteredHistory.map(log => (
                            <div key={log.id} className="history-item">
                                <span>{log.description}</span>
                                <span>{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No history records found.</p>
                )}
            </div>

            {isEditModalOpen && (
                <EditAthleteModal 
                    athlete={athlete}
                    onSave={(updatedAthlete) => {
                        onUpdateAthlete(updatedAthlete);
                        setEditModalOpen(false);
                    }}
                    onClose={() => setEditModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && (
                 <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    title="Delete Athlete"
                    message={`Are you sure you want to permanently delete ${athlete.name}? This action cannot be undone.`}
                    onConfirm={() => {
                        onDeleteAthlete(athlete.id);
                        setDeleteModalOpen(false);
                    }}
                    onClose={() => setDeleteModalOpen(false)}
                    confirmText="Confirm Delete"
                    confirmButtonClass="btn-danger"
                />
            )}
        </div>
    );
};

const EventsPage = ({ events, navigate }) => (
    <div className="page-container">
        <div className="section-title">Upcoming Events</div>
        <div className="events-grid">
            {events.filter(e => new Date(e.date) >= new Date()).map(event => (
                <div key={event.id} className="event-card" onClick={() => navigate('EventDetails', { id: event.id })}>
                    <div className="event-card-header">
                        <h4>{event.name}</h4>
                    </div>
                    <div className="event-card-body">
                         <p>{new Date(event.date).toDateString()} at {event.time}</p>
                         <p>{event.location}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="section-title">Past Events</div>
        <div className="events-grid">
            {events.filter(e => new Date(e.date) < new Date()).map(event => (
                <div key={event.id} className="event-card" onClick={() => navigate('EventDetails', { id: event.id })}>
                     <div className="event-card-header">
                        <h4>{event.name}</h4>
                    </div>
                    <div className="event-card-body">
                         <p>{new Date(event.date).toDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const EventDetailsPage = ({ event, athletes, role, onRegister, navigate }) => {
    if (!event) return <div className="card"><p>Event not found.</p></div>;
    
    // For demo, assume 'Parent/Athlete' role is for athlete with id: 1
    const currentAthleteId = 1;
    const isRegistered = event.attendees.includes(currentAthleteId);

    const attendeesDetails = event.attendees.map(id => athletes.find(a => a.id === id)).filter(Boolean);

    return (
        <div className="page-container">
            <div className="profile-header">
                <button className="back-btn" onClick={() => navigate('Events')}><ArrowLeftIcon /> Back to Events</button>
            </div>
            <div className="card">
                <CardHeader title={event.name} />
                <div className="event-details-page-card">
                    <p><strong>Date & Time:</strong> {new Date(event.date).toDateString()} at {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Description:</strong> {event.description}</p>
                    {new Date(event.date) >= new Date() && (role === 'Parent/Athlete' || role === 'Admin') && (
                        <div className="form-actions" style={{paddingTop: 0, marginTop: 10, borderTop: 'none'}}>
                            {isRegistered ? (
                                <button className="btn" disabled>Registered</button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => onRegister(event.id, currentAthleteId)}>Register</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
             <div className="card">
                <CardHeader title={`Attendees (${attendeesDetails.length})`} />
                {attendeesDetails.length > 0 ? (
                    <ul>
                        {attendeesDetails.map(a => <li key={a.id}>{a.name}</li>)}
                    </ul>
                ) : <p>No one is registered yet.</p>}
            </div>
        </div>
    );
};

const PaymentsPage = ({ payments }) => (
    <div className="card">
        <CardHeader title="Payment History" />
        <div className="transaction-list">
            {payments.map(p => (
                <div key={p.id} className="transaction-item">
                    <div className="transaction-details">
                        <h4>{p.name}</h4>
                        <p>{p.method} - {p.reference}</p>
                    </div>
                    <div className="transaction-amount">
                        <h4>KES {p.amount.toLocaleString()}</h4>
                        <p>{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NoticeBoardPage = ({ announcements }) => (
    <div className="page-container">
        {announcements.map(item => (
            <div key={item.id} className="card announcement-card">
                <h3>{item.title}</h3>
                <small>Posted on {new Date(item.date).toLocaleDateString()}</small>
                <p>{item.content}</p>
            </div>
        ))}
    </div>
);

const MessagesPage = ({ messages }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const activeConversation = messages.find(m => m.id === activeConversationId);

    return (
        <div className="messages-page">
            <div className="card">
                <div className="messages-layout">
                    <div className="conversations-list">
                        <div className="conversations-header">
                            <h3>Conversations</h3>
                        </div>
                        <div className="conversation-items">
                            {messages.map(msg => (
                                <div key={msg.id} className={`conversation-item ${msg.id === activeConversationId ? 'active' : ''}`} onClick={() => setActiveConversationId(msg.id)}>
                                    <div className="conversation-avatar">{msg.sender.charAt(0)}</div>
                                    <div className="conversation-details">
                                        <div className="conversation-sender">{msg.sender}</div>
                                        <div className="conversation-preview">{msg.preview}</div>
                                    </div>
                                    <div className="conversation-meta">
                                        <div className="conversation-timestamp">{msg.timestamp}</div>
                                        {msg.unread > 0 && <div className="unread-badge">{msg.unread}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-window">
                        {activeConversation ? (
                            <>
                                <div className="chat-header">
                                    <h3>{activeConversation.sender}</h3>
                                </div>
                                <div className="chat-body">
                                    {activeConversation.conversation.map((chat, i) => (
                                        <div key={i} className={`message ${chat.sender === 'You' ? 'sent' : 'received'}`}>
                                            <p>{chat.text}</p>
                                            <span>{chat.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-footer">
                                    <form onSubmit={e => e.preventDefault()}>
                                        <input type="text" placeholder="Type your message..." />
                                        <button className="btn btn-primary" aria-label="Send"><SendIcon /></button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                <ChatIcon />
                                <p>Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TasksPage = ({ tasks, coaches, onAddTask, onToggleTask, onDeleteTask }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!title) return;
        onAddTask({ title, dueDate, assignedTo: parseInt(assignedTo) });
        setTitle('');
        setDueDate('');
        setAssignedTo('');
    };

    const processedTasks = useMemo(() => {
        let filtered = tasks;
        if (filterStatus === 'completed') {
            filtered = tasks.filter(t => t.completed);
        } else if (filterStatus === 'incomplete') {
            filtered = tasks.filter(t => !t.completed);
        }
        
        return [...filtered].sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [tasks, filterStatus, sortOrder]);


    return (
        <div className="page-container">
            <div className="card">
                <CardHeader title="Add New Task" />
                <form className="form-layout" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="taskTitle">Task Title</label>
                            <input type="text" id="taskTitle" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Prepare training schedule" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="assignedTo">Assign To</label>
                            <select id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                                <option value="">Select a coach</option>
                                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Add Task</button>
                    </div>
                </form>
            </div>
            <div className="card">
                 <CardHeader title="Task List" />
                 <div className="page-controls">
                    <div className="filters">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="desc">Due Date (Newest)</option>
                            <option value="asc">Due Date (Oldest)</option>
                        </select>
                    </div>
                </div>

                <div className="list-table">
                     <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Task</th>
                                <th>Due Date</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedTasks.map(task => {
                                const coach = coaches.find(c => c.id === task.assignedTo);
                                return (
                                    <tr key={task.id} style={{textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1}}>
                                        <td data-label="Status">
                                            <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
                                        </td>
                                        <td data-label="Task">{task.title}</td>
                                        <td data-label="Due Date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                        <td data-label="Assigned To">{coach?.name || 'Unassigned'}</td>
                                        <td data-label="Actions">
                                            <div className="action-buttons">
                                                <button className="action-btn-icon delete-btn" onClick={() => onDeleteTask(task.id)} aria-label="Delete"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SearchResultsPage = ({ query, athletes, coaches, events, navigate }) => {
    const searchResults = useMemo(() => {
        if (!query) return [];
        const results = [];
        athletes.forEach(a => {
            if (fuzzyMatch(query, a.name)) {
                results.push({ type: 'Athlete', item: a, onClick: () => navigate('AthleteProfile', { id: a.id }) });
            }
        });
        coaches.forEach(c => {
            if (fuzzyMatch(query, c.name)) {
                results.push({ type: 'Coach', item: c, onClick: () => {} });
            }
        });
        events.forEach(e => {
            if (fuzzyMatch(query, e.name)) {
                results.push({ type: 'Event', item: e, onClick: () => navigate('EventDetails', { id: e.id }) });
            }
        });
        return results;
    }, [query, athletes, coaches, events, navigate]);

    const getIcon = (type) => {
        switch(type) {
            case 'Athlete': return <AthletesIcon />;
            case 'Coach': return <CoachesIcon />;
            case 'Event': return <EventsIcon />;
            default: return null;
        }
    }

    return (
        <div className="card">
            <CardHeader title={`Search Results for "${query}"`} />
            {searchResults.length > 0 ? searchResults.map(({ type, item, onClick }, index) => (
                <div className="search-result-card" key={`${type}-${item.id}-${index}`}>
                    <div className="result-icon">{getIcon(type)}</div>
                    <div className="result-details">
                        <h4>{item.name}</h4>
                        <p>{type}</p>
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-secondary" onClick={onClick}>View</button>
                    </div>
                </div>
            )) : <EmptyState title="No Results Found" message="Try searching for something else." />}
        </div>
    );
};

// --- LAYOUT COMPONENTS --- //

const navConfig = {
    Admin: ['Dashboard', 'Athletes', 'Coaches', 'Events', 'Payments', 'Tasks', 'Notice Board', 'Messages'],
    Coach: ['Dashboard', 'Athletes', 'Events', 'Tasks', 'Messages'],
    'Parent/Athlete': ['Dashboard', 'Profile', 'Events', 'Payments', 'Notice Board', 'Messages']
};

const navIcons = {
    Dashboard: <DashboardIcon />,
    Athletes: <AthletesIcon />,
    Coaches: <CoachesIcon />,
    Events: <EventsIcon />,
    Payments: <PaymentsIcon />,
    Tasks: <TasksIcon />,
    'Notice Board': <NoticeBoardIcon />,
    Messages: <MessagesIcon />,
    Profile: <AthletesIcon />
};

const Header = ({ role, setRole, onMenuClick, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                navigate('Search', { query: searchTerm });
            }
        }, 500); // Debounce search
        return () => clearTimeout(handler);
    }, [searchTerm, navigate]);


    return (
        <header className="main-header">
            <div className="header-left">
                <button className="hamburger-menu" onClick={onMenuClick}><HamburgerIcon /></button>
            </div>
            <div className="header-right">
                <div className="search-bar">
                    <SearchIcon />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="role-switcher">
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Admin">Admin</option>
                        <option value="Coach">Coach</option>
                        <option value="Parent/Athlete">Parent/Athlete</option>
                    </select>
                </div>
            </div>
        </header>
    );
};


const Sidebar = ({ role, currentPage, navigate, onLogout, isOpen, setIsOpen }) => {
    const navItems = navConfig[role];
    return (
        <>
            <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo"><LogoIcon /></div>
                    <h2>Funpot Club</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}><CloseIcon /></button>
                </div>
                <nav className="nav-menu">
                    <ul>
                        {navItems.map(item => (
                             <li key={item}>
                                <a
                                    href="#"
                                    className={`nav-item ${currentPage === item ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); navigate(item); }}
                                >
                                    {navIcons[item]}
                                    <span>{item}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-item" onClick={(e) => {e.preventDefault(); onLogout()}}>
                        <LogoutIcon />
                        <span>Logout</span>
                    </a>
                </div>
            </div>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>
        </>
    );
};

const MobileBottomNav = ({ role, currentPage, navigate }) => {
    const navItems = navConfig[role].slice(0, 5); // Show first 5 items
    return (
        <nav className="mobile-bottom-nav">
            {navItems.map(item => (
                <a 
                    key={item} 
                    href="#" 
                    className={`mobile-nav-item ${currentPage === item ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigate(item); }}
                >
                    {navIcons[item]}
                    <span>{item}</span>
                </a>
            ))}
        </nav>
    );
};


// --- UI COMPONENTS --- //

const StatCard = ({ icon, title, value, color }) => (
    <div className="stat-card">
        <div className="stat-card-header">
            <div className={`icon ${color}`}>{icon}</div>
        </div>
        <div className="stat-card-body">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const CardHeader = ({ title, onViewAll = undefined, children = null }) => (
    <div className="card-header">
        <h3>{title}</h3>
        <div className="card-header-actions">
          {children}
          {onViewAll && <a href="#" onClick={(e) => { e.preventDefault(); onViewAll(); }} className="view-all">View All</a>}
        </div>
    </div>
);

const EmptyState = ({ title, message, children = null }) => (
    <div className="empty-state">
        <div className="empty-state-icon"><EmptyIcon /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmButtonClass = "btn-primary" }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <p>{message}</p>
        <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className={`btn ${confirmButtonClass}`} onClick={onConfirm}>{confirmText}</button>
        </div>
    </Modal>
);

const EditAthleteModal = ({ athlete, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...athlete });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Edit ${athlete.name}`}>
            <form onSubmit={handleSubmit} className="form-layout">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="skillLevel">Skill Level</label>
                    <select id="skillLevel" name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label htmlFor="activity">Activity</label>
                    <input type="text" id="activity" name="activity" value={formData.activity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="ageGroup">Age Group</label>
                    <input type="text" id="ageGroup" name="ageGroup" value={formData.ageGroup} onChange={handleChange} required />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
