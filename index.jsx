import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { createRoot } from 'react-dom/client';

// --- SVG Icons ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.566-.16-1.168.356-1.168.356m3.633.82-1.168-.356m1.168.356c-.566.16-1.533-.205-1.533-.205m2.7 2.062a5.987 5.987 0 0 1-1.533-.205m1.533.205a5.987 5.987 0 0 0-1.533.205m-2.7-2.062a5.987 5.987 0 0 0-1.533.205m1.533-.205L8.25 15.75M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-1.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.062-.163-2.09-.465-3.065A12.015 12.015 0 0 0 17.618 5.984Z" /></svg>;
const RocketLaunchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.028 12.028 0 0 0-5.84 7.38m0-7.38c-3.15.52-5.84-1.28-5.84-4.28 0-1.92.93-3.66 2.34-4.72a9.01 9.01 0 0 1 4.72-2.34c2.99 0 4.8 2.69 4.28 5.84a6.003 6.003 0 0 1-7.38 5.84Z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.3-.1-.9-.3-1.8-.9-.7-.5-1.1-1-1.3-1.5-.1-.2 0-.4.1-.5l.5-.5c.1 0 .2-.1.3-.2l.2-.3c.1-.1.1-.3 0-.4-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.2.8 2.2 1 2.4.1.2 1.5 2.3 3.6 3.2.5.2 1 .3 1.3.4.5.1 1-.1 1.2-.2.3-.2.6-.8.8-1 .1-.2.1-.4 0-.5l-.3-.1zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h-2v-2h2V7a2 2 0 0 1 2-2h2v2h-2v2h2v2h-2v6z"/></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 14c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm3-5c0 1.66-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3z"/></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 .895 4.975A18.97 18.97 0 0 0 4.02 19.52a15.004 15.004 0 0 0 4.234 3.328A12 12 0 0 0 12 23.25a12 12 0 0 0 3.746-1.402 15.003 15.003 0 0 0 4.234-3.328c.36-.43.69-.877.995-1.345l.895-4.975M2.25 12a12.016 12.016 0 0 1 9.75-11.25 12.016 12.016 0 0 1 9.75 11.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a12.023 12.023 0 0 1 3.75 2.063" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v-2.25" /><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 12-2.625 6" /><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 12 2.625 6" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.063M15 19.128v-3.86a2.25 2.25 0 0 0-4.5 0v3.86m0 0a9.337 9.337 0 0 0-4.121-2.063 9.38 9.38 0 0 0-2.625.372M15 19.128v-3.86a2.25 2.25 0 0 0-4.5 0v3.86m4.5 0a9.337 9.337 0 0 0 4.121 2.063m0 0a9.38 9.38 0 0 0 2.625-.372M15 19.128a2.25 2.25 0 0 1-4.5 0M4.5 12a7.5 7.5 0 0 1 15 0v-3a7.5 7.5 0 0 0-15 0v3zM15 6.75a2.25 2.25 0 0 0-4.5 0" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Zm6 0h.008v.008H12V15Zm6 0h.008v.008H18V15Zm-6 0h.008v.008H12V15Z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const EnvelopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;


// --- Data & Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: SetStateAction<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@funport.com', role: 'Admin' },
  { id: 2, name: 'Coach Sarah', email: 'sarah@funport.com', role: 'Coach' },
  { id: 3, name: 'John Doe (Parent)', email: 'john@email.com', role: 'Parent' },
  { id: 4, name: 'Leo Doe', email: 'leo@email.com', role: 'Athlete', parentId: 3, coachId: 2 },
  { id: 5, name: 'Jane Smith (Parent)', email: 'jane@email.com', role: 'Parent' },
  { id: 6, name: 'Mia Smith', email: 'mia@email.com', role: 'Athlete', parentId: 5, coachId: 2 },
];

const initialAthletes = [
    {
        userId: 4,
        name: 'Leo Doe',
        progress: { 'Balance': 80, 'Gliding': 60, 'Stopping': 75, 'Speed': 50 }
    },
    {
        userId: 6,
        name: 'Mia Smith',
        progress: { 'Balance': 90, 'Gliding': 85, 'Stopping': 80, 'Speed': 70 }
    }
];

const initialLogs = [
    { id: 1, athleteId: 4, author: 'Coach Sarah', date: '2024-07-20', content: 'Leo worked on his T-stops today. Showing great improvement in control.' },
    { id: 2, athleteId: 4, author: 'Leo Doe', date: '2024-07-21', content: 'Practiced skating backwards for 20 minutes. It was hard but fun!' },
    { id: 3, athleteId: 6, author: 'Coach Sarah', date: '2024-07-22', content: 'Mia has mastered forward gliding. Next week, we will start on crossovers.' },
];

const initialSchedules = [
    { id: 1, coachId: 2, date: '2024-08-05', time: '4:00PM - 5:00PM', location: 'Main Rink', athleteIds: [4] },
    { id: 2, coachId: 2, date: '2024-08-05', time: '5:00PM - 6:00PM', location: 'Main Rink', athleteIds: [6] },
    { id: 3, coachId: 2, date: '2024-08-07', time: '4:30PM - 5:30PM', location: 'Practice Area', athleteIds: [4, 6] },
    { id: 4, coachId: 2, date: '2024-08-09', time: '4:00PM - 5:00PM', location: 'Main Rink', athleteIds: [4, 6] },
];

const initialInvoices = [
    { id: 1, userId: 3, description: 'August Training Fees - Leo Doe', amount: 8000, status: 'Due', dueDate: '2024-08-01' },
    { id: 2, userId: 3, description: 'July Training Fees - Leo Doe', amount: 8000, status: 'Paid', dueDate: '2024-07-01' },
    { id: 3, userId: 5, description: 'August Training Fees - Mia Smith', amount: 8000, status: 'Due', dueDate: '2024-08-01' },
];

const initialConversations = [
    { id: 1, participantIds: [1, 2], lastMessageTimestamp: new Date().toISOString() },
    { id: 2, participantIds: [2, 3], lastMessageTimestamp: new Date().toISOString() },
];

const initialMessages = [
    { id: 1, conversationId: 1, senderId: 1, content: "Hi Sarah, can you please send me the updated roster for this week?", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), readBy: [1] },
    { id: 2, conversationId: 1, senderId: 2, content: "Of course, I'll send it over shortly.", timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), readBy: [1, 2] },
    { id: 3, conversationId: 2, senderId: 3, content: "Hello Coach Sarah, just wanted to confirm Leo's session time for Wednesday.", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), readBy: [2, 3] },
    { id: 4, conversationId: 2, senderId: 2, content: "Hi John! Yes, Leo is confirmed for 4:30 PM on Wednesday.", timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(), readBy: [3] },
];


const programs = [
  { title: 'Summer Weekly Program', days: 'Mon, Wed & Fri', time: '3:30PM - 6:00PM', icon: CalendarIcon, price: 'KES 8,000/month' },
  { title: 'Weekend Sessions', days: 'Sat & Sun', time: '3:30PM - 6:00PM', icon: UserGroupIcon, price: 'KES 6,000/month' },
];

const skills = [
  { title: 'Personal Training', description: 'One-on-one coaching to accelerate your learning and master specific techniques.', icon: CheckBadgeIcon },
  { title: 'Fundamental Skating Skills', description: 'Learn the basics from the ground up, including balance, posture, and forward motion.', icon: RocketLaunchIcon },
  { title: 'Learn how to Glide', description: 'Develop smooth and effortless gliding techniques for a more graceful skating experience.', icon: RocketLaunchIcon },
  { title: 'Stopping Practice', description: 'Master various stopping methods to ensure your safety and build confidence on wheels.', icon: ShieldCheckIcon },
];

// --- Components ---

const Notifications = ({ unreadCount, onNotificationClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} aria-label={`${unreadCount} unread notifications`}>
                <BellIcon />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">Notifications</div>
                    <div className="notification-content">
                        {unreadCount > 0 ? (
                            <a href="#" onClick={(e) => { e.preventDefault(); onNotificationClick(); setIsOpen(false); }}>
                                You have {unreadCount} new message{unreadCount > 1 ? 's' : ''}.
                            </a>
                        ) : (
                            <p>No new notifications.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const Header = ({ onBookNowClick, onLoginClick, user, onLogout, unreadCount, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <a href="#" className="logo">
            <span className="funpot">funpot </span>
            <span className="skating">SKATING</span>
          </a>
          {!user ? (
            <>
              <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#programs">Programs</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
              <div className="header-actions">
                <button onClick={onLoginClick} className="btn btn-secondary">Login</button>
                <button onClick={onBookNowClick} className="btn btn-primary">Book Now</button>
              </div>
            </>
          ) : (
            <div className="header-actions">
                <span className="user-role">Welcome, <strong>{user.name.split(' ')[0]}</strong>!</span>
                 <Notifications unreadCount={unreadCount} onNotificationClick={() => onNavigate('Messages')} />
                <button onClick={onLogout} className="btn btn-secondary logout-btn" aria-label="Logout">
                  <LogoutIcon />
                </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const Hero = ({ onBookNowClick }) => (
  <section id="home" className="hero">
    <div className="container">
      <h1 className="learn-text">Learn</h1>
      <h2 className="skating-text">SKATING</h2>
      <p>CONQUER YOUR FEAR, GAIN THE EXPERIENCE</p>
      <button onClick={onBookNowClick} className="btn btn-primary">Book a Session</button>
    </div>
  </section>
);

const Programs = ({ onBookNowClick }) => (
  <section id="programs" className="section">
    <div className="container">
      <div className="section-title">
        <h2>Our Programs</h2>
        <p>Choose the perfect schedule to kickstart your skating journey with our expert coaches.</p>
      </div>
      <div className="program-cards">
        {programs.map((program) => {
          const Icon = program.icon;
          return (
            <div key={program.title} className="program-card">
              <div className="icon"><Icon /></div>
              <h3>{program.title}</h3>
              <p className="days">{program.days}</p>
              <p className="time">{program.time}</p>
              <button onClick={onBookNowClick} className="btn btn-secondary">Join Program</button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="about" className="section section-dark">
    <div className="container">
      <div className="section-title">
        <h2>Become Stronger</h2>
        <p>Our curriculum is designed to build your confidence and skills from beginner to pro.</p>
      </div>
      <div className="skills-list">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div key={skill.title} className="skill-item">
              <div className="icon"><Icon /></div>
              <div>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Location = () => (
  <section id="contact" className="section">
    <div className="container">
      <div className="section-title">
        <h2>Find Us & Get In Touch</h2>
        <p>We're located at the beautiful Buntwani Waterfront. Come say hi or give us a call!</p>
      </div>
      <div className="location-content">
        <div className="location-map">
          <img src="https://images.unsplash.com/photo-1561331822-241b1198e329?q=80&w=2070&auto=format&fit=crop" alt="Map of Buntwani Waterfront, Malindi"/>
        </div>
        <div className="location-details">
          <h3>Our Home Rink</h3>
          <div className="contact-item">
            <div className="icon"><MapPinIcon /></div>
            <div className="details">
              <span>Location</span>
              <p>Buntwani Waterfront, Malindi</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon"><PhoneIcon /></div>
            <div className="details">
              <span>Call or WhatsApp</span>
              <p><a href="tel:+254780941396">+254 780 941 396</a></p>
              <p><a href="tel:+254713715158">+254 713 715 158</a></p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon"><CalendarIcon /></div>
            <div className="details">
              <span>Open Hours</span>
              <p>Mon, Wed, Fri, Sat & Sun: 3:30PM - 6:00PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Equipment = () => (
  <section className="equipment-banner">
    <div className="container">
      <p>All Skating Equipment is Available for Sale at The Club!</p>
    </div>
  </section>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h3>Ready to Roll?</h3>
            <p className="footer-subtitle">Join the Funport Skating Club today!</p>
          </div>
          <div className="footer-right-column">
            <div className="footer-contacts">
               <a href="tel:+254780941396">+254 780 941 396</a>
               <a href="mailto:hello@funportskating.com">hello@funportskating.com</a>
            </div>
            <div className="social-links">
              <a href="#" aria-label="WhatsApp"><WhatsAppIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Funport Skating Club. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const BookingModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const modalContentRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);


  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="modal-content" ref={modalContentRef}>
        {!submitted ? (
          <>
            <div className="modal-header">
              <h2>Book Your Session</h2>
              <button onClick={handleClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="program">Choose a Program</label>
                <select id="program" required>
                  <option value="">Select a program...</option>
                  <option value="weekly">Summer Weekly Program</option>
                  <option value="weekend">Weekend Sessions</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Booking</button>
              </div>
            </form>
          </>
        ) : (
          <div className="confirmation-message">
            <div className="icon"><CheckCircleIcon/></div>
            <h3>Thank You!</h3>
            <p>Your booking request has been received. We will contact you shortly to confirm the details.</p>
            <button onClick={handleClose} className="btn btn-primary">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin, users }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogin = (user) => {
    onLogin(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="modal-content" ref={modalContentRef}>
        <div className="modal-header">
          <h2>Select User to Login</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="login-options">
          {users.map(user => (
            <button key={user.id} onClick={() => handleLogin(user)} className="btn btn-primary">
              {user.name} ({user.role})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onBookNowClick }) => (
    <main>
        <Hero onBookNowClick={onBookNowClick} />
        <Programs onBookNowClick={onBookNowClick} />
        <Skills />
        <Location />
        <Equipment />
    </main>
);

// --- Dashboard Components ---

const sidebarLinks = {
  Admin: [
    { name: 'Dashboard', icon: DashboardIcon, view: 'Dashboard' },
    { name: 'User Management', icon: UsersIcon, view: 'User Management' },
    { name: 'Payments', icon: CreditCardIcon, view: 'Payments' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
  Coach: [
    { name: 'Dashboard', icon: DashboardIcon, view: 'Dashboard' },
    { name: 'My Athletes', icon: UserGroupIcon, view: 'My Athletes' },
    { name: 'Schedule', icon: CalendarIcon, view: 'Schedule' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
  Parent: [
    { name: 'Dashboard', icon: DashboardIcon, view: 'Dashboard' },
    { name: 'Payments', icon: CreditCardIcon, view: 'Payments' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
  Athlete: [
    { name: 'My Progress', icon: ChartBarIcon, view: 'My Progress' },
    { name: 'Personal Log', icon: CheckBadgeIcon, view: 'Personal Log' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
};

const Sidebar = ({ userRole, activeView, onNavigate }) => {
    const links = sidebarLinks[userRole] || [];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {links.map(link => {
                        const Icon = link.icon;
                        return (
                            <li key={link.name}>
                                <a href="#" 
                                   onClick={(e) => { e.preventDefault(); onNavigate(link.view); }}
                                   className={activeView === link.view ? 'active' : ''}
                                >
                                    <Icon />
                                    <span>{link.name}</span>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

const DashboardHome = ({ user }) => (
    <div>
        <h1>Welcome back, {user.name}!</h1>
        <p>This is your central hub for managing your activities at Funport Skating Club.</p>
    </div>
);

const UserFormModal = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Athlete' });
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({ name: '', email: '', role: 'Athlete' });
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                            <option value="Athlete">Athlete</option>
                            <option value="Parent">Parent</option>
                            <option value="Coach">Coach</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement = ({ users, onAddUser, onUpdateUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const handleOpenModal = (user = null) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setUserToEdit(null);
        setIsModalOpen(false);
    };

    const handleSaveUser = (userData) => {
        if (userData.id) {
            onUpdateUser(userData);
        } else {
            onAddUser(userData);
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>User Management</h1>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">Add User</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                                <td>
                                    <button onClick={() => handleOpenModal(user)} className="btn-icon" aria-label="Edit user"><PencilIcon/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                userToEdit={userToEdit}
            />
        </div>
    );
};

const MyAthletes = ({ users, onSelectAthlete }) => {
    const athletes = users.filter(u => u.role === 'Athlete');
    return (
        <div>
            <div className="dashboard-header">
                <h1>My Athletes</h1>
            </div>
            <div className="card-grid">
                {athletes.map(athlete => (
                    <div key={athlete.id} className="card">
                        <h3>{athlete.name}</h3>
                        <p>{athlete.email}</p>
                        <button onClick={() => onSelectAthlete(athlete.id)} className="btn btn-secondary">View Profile</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityLog = ({ logs, onAddLog, currentUser, athlete }) => {
    const [newLog, setNewLog] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newLog.trim()) return;
        onAddLog({
            athleteId: athlete.id,
            author: currentUser.name,
            date: new Date().toISOString().split('T')[0],
            content: newLog
        });
        setNewLog('');
    };

    return (
        <div className="activity-log">
            <h3>Activity Log</h3>
            <form onSubmit={handleSubmit} className="log-form">
                <div className="form-group">
                    <textarea 
                        value={newLog}
                        onChange={(e) => setNewLog(e.target.value)}
                        placeholder="Add a new log entry..."
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Add Entry</button>
                </div>
            </form>
            <div className="log-list">
                {logs.map(log => (
                    <div key={log.id} className="log-entry">
                        <p className="log-content">{log.content}</p>
                        <p className="log-meta">By <strong>{log.author}</strong> on {log.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AthleteProfile = ({ athlete, athleteData, logs, onAddLog, currentUser }) => {
    if (!athlete || !athleteData) return <p>Select an athlete to view their profile.</p>;

    return (
        <div>
            <div className="dashboard-header">
                <h1>{athlete.name}'s Profile</h1>
            </div>
            <div className="profile-layout">
                <div className="progress-section card">
                    <h3>Current Progress</h3>
                    {Object.entries(athleteData.progress).map(([skill, value]) => (
                        <div key={skill} className="progress-item">
                            <label>{skill}</label>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${value}%` }}>{value}%</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="log-section card">
                    <ActivityLog logs={logs} onAddLog={onAddLog} currentUser={currentUser} athlete={athlete}/>
                </div>
            </div>
        </div>
    );
}

const MyProgress = ({ athleteData }) => {
    if (!athleteData) return <p>Loading progress...</p>;

    return (
        <div>
            <div className="dashboard-header">
                <h1>My Progress</h1>
            </div>
            <div className="card">
                <h3>Current Skill Levels</h3>
                {Object.entries(athleteData.progress).map(([skill, value]) => (
                    <div key={skill} className="progress-item">
                        <label>{skill}</label>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${value}%` }}>{value}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PersonalLog = ({ athlete, logs, onAddLog, currentUser }) => {
    return (
        <div>
            <div className="dashboard-header">
                <h1>My Personal Log</h1>
            </div>
             <div className="log-section card">
                <ActivityLog logs={logs} onAddLog={onAddLog} currentUser={currentUser} athlete={athlete}/>
            </div>
        </div>
    );
};

const Schedule = ({ schedules, users, currentUser }) => {
    const mySchedules = schedules.filter(s => s.coachId === currentUser.id);

    const groupedSchedules = mySchedules.reduce((acc, schedule) => {
        const date = new Date(schedule.date).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {});

    const getAthleteName = (id) => users.find(u => u.id === id)?.name || 'Unknown Athlete';

    return (
        <div>
            <div className="dashboard-header">
                <h1>My Schedule</h1>
            </div>
            <div className="schedule-container">
                {Object.entries(groupedSchedules).sort((a,b) => new Date(a[0]) - new Date(b[0])).map(([date, sessions]) => (
                    <div key={date} className="schedule-group">
                        <h3 className="schedule-date">{date}</h3>
                        <div className="card-grid">
                            {sessions.map(session => (
                                <div key={session.id} className="card session-card">
                                    <h4>{session.time}</h4>
                                    <p className="session-location"><MapPinIcon/> {session.location}</p>
                                    <div className="session-athletes">
                                        <strong>Athletes:</strong>
                                        <ul>
                                            {session.athleteIds.map(id => <li key={id}>{getAthleteName(id)}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Messaging = ({ conversations, messages, users, currentUser, onSendMessage }) => {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    const currentConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));
    const selectedConversation = currentConversations.find(c => c.id === selectedConversationId);
    
    const conversationMessages = messages
        .filter(m => m.conversationId === selectedConversationId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const getOtherParticipant = (convo) => {
        const otherId = convo.participantIds.find(id => id !== currentUser.id);
        return users.find(u => u.id === otherId);
    };
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;
        onSendMessage(selectedConversationId, newMessage);
        setNewMessage("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);


    return (
        <div>
            <div className="dashboard-header">
                <h1>Messages</h1>
            </div>
            <div className="messaging-layout card">
                <div className="conversation-list">
                    {currentConversations.map(convo => {
                        const otherUser = getOtherParticipant(convo);
                        return (
                            <div 
                                key={convo.id} 
                                className={`conversation-item ${convo.id === selectedConversationId ? 'active' : ''}`}
                                onClick={() => setSelectedConversationId(convo.id)}
                            >
                                <div className="avatar">{otherUser.name.charAt(0)}</div>
                                <div>
                                    <p className="participant-name">{otherUser.name}</p>
                                    <p className="last-message">Last message placeholder...</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="chat-window">
                    {selectedConversation ? (
                        <>
                            <div className="chat-header">
                                <h3>{getOtherParticipant(selectedConversation).name}</h3>
                            </div>
                            <div className="chat-messages">
                                {conversationMessages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
                                        <p>{msg.content}</p>
                                        <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <EnvelopeIcon/>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PaymentModal = ({ isOpen, onClose, onConfirm, invoice }) => {
    const modalContentRef = useRef(null);
    if (!isOpen || !invoice) return null;

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>Confirm Payment</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                </div>
                <div className="payment-details">
                    <p><strong>Invoice:</strong> {invoice.description}</p>
                    <p><strong>Amount:</strong> KES {invoice.amount.toLocaleString()}</p>
                </div>
                <div className="form-actions payment-actions">
                    <button onClick={() => onConfirm(invoice.id)} className="btn btn-primary">Pay with M-Pesa</button>
                    <button onClick={() => onConfirm(invoice.id)} className="btn btn-primary">Pay with Card</button>
                </div>
                <p className="payment-note">This is a simulated payment process.</p>
            </div>
        </div>
    );
};


const Payments = ({ invoices, onPayInvoice }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handlePayClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentModalOpen(true);
    };
    
    const handleConfirmPayment = (invoiceId) => {
        onPayInvoice(invoiceId);
        setIsPaymentModalOpen(false);
        setSelectedInvoice(null);
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>Payments & Invoices</h1>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KES)</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.description}</td>
                                <td>{invoice.amount.toLocaleString()}</td>
                                <td><span className={`status-badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                                <td>
                                    {invoice.status === 'Due' && (
                                        <button onClick={() => handlePayClick(invoice)} className="btn btn-secondary">Pay Now</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
                invoice={selectedInvoice}
            />
        </div>
    );
};


const Dashboard = ({ user, activeView, onNavigate, users, athletes, logs, schedules, invoices, messages, conversations, onAddUser, onUpdateUser, onAddLog, onSelectAthlete, onSendMessage, onPayInvoice }) => {
    const renderContent = () => {
        const athleteUser = user.role === 'Athlete' ? user : users.find(u => u.id === activeView.athleteId);
        const athleteData = athletes.find(a => a.userId === (athleteUser ? athleteUser.id : null));
        const athleteLogs = logs
            .filter(l => l.athleteId === (athleteUser ? athleteUser.id : null))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        switch (activeView.name) {
            case 'Dashboard':
                return <DashboardHome user={user} />;
            case 'User Management':
                return <UserManagement users={users} onAddUser={onAddUser} onUpdateUser={onUpdateUser} />;
            case 'My Athletes':
                return <MyAthletes users={users.filter(u => u.coachId === user.id)} onSelectAthlete={onSelectAthlete} />;
            case 'Athlete Profile':
                return <AthleteProfile athlete={athleteUser} athleteData={athleteData} logs={athleteLogs} onAddLog={onAddLog} currentUser={user} />;
            case 'My Progress':
                return <MyProgress athleteData={athleteData} />;
            case 'Personal Log':
                 return <PersonalLog athlete={user} logs={athleteLogs} onAddLog={onAddLog} currentUser={user}/>;
            case 'Schedule':
                return <Schedule schedules={schedules} users={users} currentUser={user} />;
            case 'Messages':
                return <Messaging conversations={conversations} messages={messages} users={users} currentUser={user} onSendMessage={onSendMessage} />;
            case 'Payments':
                const userInvoices = user.role === 'Admin' ? invoices : invoices.filter(i => i.userId === user.id || user.children?.includes(i.userId));
                return <Payments invoices={userInvoices} onPayInvoice={onPayInvoice} />;
            default:
                return <DashboardHome user={user} />;
        }
    };
    
    return (
        <div className="dashboard-layout">
            <Sidebar userRole={user.role} activeView={activeView.name} onNavigate={(view) => onNavigate(view)} />
            <main className="dashboard-content">
                <div className="container">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}

const App = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [users, setUsers] = useLocalStorage('users', initialUsers);
    const [athletes, setAthletes] = useLocalStorage('athletes', initialAthletes);
    const [logs, setLogs] = useLocalStorage('logs', initialLogs);
    const [schedules, setSchedules] = useLocalStorage('schedules', initialSchedules);
    const [invoices, setInvoices] = useLocalStorage('invoices', initialInvoices);
    const [conversations, setConversations] = useLocalStorage('conversations', initialConversations);
    const [messages, setMessages] = useLocalStorage('messages', initialMessages);
    const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
    const [activeView, setActiveView] = useState<{ name: string; athleteId?: number }>({ name: 'Dashboard' });

    useEffect(() => {
        document.body.style.overflow = isBookingModalOpen || isLoginModalOpen ? 'hidden' : 'auto';
    }, [isBookingModalOpen, isLoginModalOpen]);
    
    const handleNavigate = (viewName) => setActiveView({ name: viewName });
    const handleSelectAthlete = (athleteId) => setActiveView({ name: 'Athlete Profile', athleteId });
    const handleLogin = (user) => {
        setCurrentUser(user);
        setActiveView({ name: 'Dashboard' });
    }
    const handleLogout = () => setCurrentUser(null);
    const handleAddUser = (newUser) => setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
    const handleUpdateUser = (updatedUser) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    const handleAddLog = (newLog) => setLogs(prev => [{...newLog, id: Date.now() }, ...prev]);
    
    const handleSendMessage = (conversationId, content) => {
        const newMessage = {
            id: Date.now(),
            conversationId,
            senderId: currentUser.id,
            content,
            timestamp: new Date().toISOString(),
            readBy: [currentUser.id]
        };
        setMessages(prev => [...prev, newMessage]);
    };
    
    const handlePayInvoice = (invoiceId) => {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
    };

    const unreadCount = messages.filter(m => {
        const userConvos = conversations.filter(c => c.participantIds.includes(currentUser?.id));
        const isMyConvo = userConvos.some(c => c.id === m.conversationId);
        return isMyConvo && !m.readBy.includes(currentUser?.id);
    }).length;


    return (
        <>
            <Header 
                onBookNowClick={() => setIsBookingModalOpen(true)}
                onLoginClick={() => setIsLoginModalOpen(true)}
                user={currentUser}
                onLogout={handleLogout}
                unreadCount={unreadCount}
                onNavigate={handleNavigate}
            />
            {currentUser ? (
                <Dashboard 
                    user={currentUser} 
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    users={users}
                    athletes={athletes}
                    logs={logs}
                    schedules={schedules}
                    invoices={invoices}
                    messages={messages}
                    conversations={conversations}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onAddLog={handleAddLog}
                    onSelectAthlete={handleSelectAthlete}
                    onSendMessage={handleSendMessage}
                    onPayInvoice={handlePayInvoice}
                />
            ) : (
                <LandingPage onBookNowClick={() => setIsBookingModalOpen(true)} />
            )}
            <Footer />
            <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onLogin={handleLogin}
                users={users}
            />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);