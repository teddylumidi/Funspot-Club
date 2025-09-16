

import React, { useState, useEffect, useRef, SetStateAction } from 'react';

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
const EnvelopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;


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
  { id: 1, name: 'Admin User', email: 'admin@funport.com', password: 'password123', role: 'Admin' },
  { id: 2, name: 'Coach Sarah', email: 'sarah@funport.com', password: 'password123', role: 'Coach' },
  { id: 3, name: 'John Doe (Parent)', email: 'john@email.com', password: 'password123', role: 'Parent', children: [4] },
  { id: 4, name: 'Leo Doe', email: 'leo@email.com', password: 'password123', role: 'Athlete', parentId: 3, coachId: 2 },
  { id: 5, name: 'Jane Smith (Parent)', email: 'jane@email.com', password: 'password123', role: 'Parent', children: [6] },
  { id: 6, name: 'Mia Smith', email: 'mia@email.com', password: 'password123', role: 'Athlete', parentId: 5, coachId: 2 },
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
    { id: 1, coachId: 2, date: '2024-08-05', time: '16:00', location: 'Main Rink', athleteIds: [4], title: 'Leo D. - Private' },
    { id: 2, coachId: 2, date: '2024-08-05', time: '17:00', location: 'Main Rink', athleteIds: [6], title: 'Mia S. - Private' },
    { id: 3, coachId: 2, date: '2024-08-07', time: '16:30', location: 'Practice Area', athleteIds: [4, 6], title: 'Group Session' },
    { id: 4, coachId: 2, date: '2024-08-09', time: '16:00', location: 'Main Rink', athleteIds: [4, 6], title: 'Group Session' },
];

const initialInvoices = [
    { id: 1, userId: 4, description: 'August Training Fees - Leo Doe', amount: 8000, status: 'Due', dueDate: '2024-08-01' },
    { id: 2, userId: 4, description: 'July Training Fees - Leo Doe', amount: 8000, status: 'Paid', dueDate: '2024-07-01' },
    { id: 3, userId: 6, description: 'August Training Fees - Mia Smith', amount: 8000, status: 'Due', dueDate: '2024-08-01' },
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

// --- Type Definitions ---
type User = (typeof initialUsers)[0];
type Athlete = (typeof initialAthletes)[0];
type Log = (typeof initialLogs)[0];
type Schedule = (typeof initialSchedules)[0];
type Invoice = (typeof initialInvoices)[0];
type Conversation = (typeof initialConversations)[0];
type Message = (typeof initialMessages)[0];

interface ActiveView {
  name: string;
  athleteId?: number;
  conversationId?: number;
}


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
                                You have {unreadCount} unread conversation{unreadCount > 1 ? 's' : ''}.
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
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onNavigate({ name: 'Dashboard' }); }}>
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
                 <Notifications unreadCount={unreadCount} onNotificationClick={() => onNavigate({name: 'Messages'})} />
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

const LoginFormModal = ({ isOpen, onClose, onLoginAttempt }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalContentRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const loginError = onLoginAttempt(email, password);
        if (loginError) {
            setError(loginError);
        } else {
            setEmail('');
            setPassword('');
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setError(''); // Reset error on open
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>Club Portal Login</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="login-email">Email Address</label>
                        <input 
                            type="email" 
                            id="login-email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
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
    { name: 'Calendar', icon: CalendarIcon, view: 'Calendar' },
    { name: 'My Athletes', icon: UserGroupIcon, view: 'My Athletes' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
  Parent: [
    { name: 'Dashboard', icon: DashboardIcon, view: 'Dashboard' },
    { name: 'Schedule', icon: CalendarIcon, view: 'Schedule' },
    { name: 'Payments', icon: CreditCardIcon, view: 'Payments' },
    { name: 'Messages', icon: EnvelopeIcon, view: 'Messages' },
  ],
  Athlete: [
    { name: 'My Progress', icon: ChartBarIcon, view: 'My Progress' },
    { name: 'Schedule', icon: CalendarIcon, view: 'Schedule' },
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
                                   onClick={(e) => { e.preventDefault(); onNavigate({name: link.view}); }}
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
        <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
        <p>This is your central hub for managing your activities at Funport Skating Club.</p>
        <p>Select an option from the sidebar to get started.</p>
    </div>
);

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="stat-card">
        <div className="stat-icon"><Icon /></div>
        <div className="stat-content">
            <p className="stat-value">{value}</p>
            <p className="stat-title">{title}</p>
        </div>
    </div>
);

const AdminDashboard = ({ users, schedules, invoices }) => {
    const totalUsers = users.length;
    const totalAthletes = users.filter(u => u.role === 'Athlete').length;
    
    const upcomingSessions = schedules.filter(s => {
        const sessionDate = new Date(s.date);
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        return sessionDate >= today && sessionDate <= nextWeek;
    }).length;

    const pendingPayments = invoices.filter(inv => inv.status === 'Due').length;

    return (
        <div>
            <div className="dashboard-header"><h1>Admin Dashboard</h1></div>
            <div className="stat-card-grid">
                <StatCard title="Total Users" value={totalUsers} icon={UsersIcon} />
                <StatCard title="Active Athletes" value={totalAthletes} icon={UserGroupIcon} />
                <StatCard title="Upcoming Sessions (7 days)" value={upcomingSessions} icon={CalendarIcon} />
                <StatCard title="Pending Payments" value={pendingPayments} icon={CreditCardIcon} />
            </div>
            {/* Additional admin components can be added here */}
        </div>
    );
};


const UserFormModal = ({ isOpen, onClose, onSave, userToEdit, users }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Athlete', coachId: '' });
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                ...userToEdit,
                coachId: userToEdit.coachId || ''
            });
        } else {
            setFormData({ name: '', email: '', role: 'Athlete', coachId: '' });
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
    
    const coaches = users.filter(u => u.role === 'Coach');

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
                    {formData.role === 'Athlete' && (
                         <div className="form-group">
                            <label htmlFor="coachId">Assign Coach</label>
                            <select id="coachId" name="coachId" value={formData.coachId} onChange={handleChange}>
                                <option value="">No Coach</option>
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>{coach.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement = ({ users, onAddUser, onEditUser }) => {
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

    const handleSave = (userData) => {
        if (userData.id) {
            onEditUser(userData);
        } else {
            onAddUser(userData);
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>User Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add User</button>
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
            {isModalOpen && <UserFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} userToEdit={userToEdit} users={users}/>}
        </div>
    );
};

const MyAthletes = ({ users, athletes, onSelectAthlete, currentUser }) => {
    const myAthletes = users.filter(u => u.role === 'Athlete' && u.coachId === currentUser.id);

    return (
        <div>
            <div className="dashboard-header"><h1>My Athletes</h1></div>
            <div className="card-grid">
                {myAthletes.map(athleteUser => {
                    const athleteData = athletes.find(a => a.userId === athleteUser.id);
                    return (
                        <div key={athleteUser.id} className="card">
                            <h3>{athleteUser.name}</h3>
                            <p>Level: Beginner</p>
                            <button className="btn btn-secondary" onClick={() => onSelectAthlete(athleteUser.id)}>View Profile</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const AthleteProfile = ({ athleteId, users, athletes, logs, onAddLog }) => {
    const [logContent, setLogContent] = useState('');
    const athleteUser = users.find(u => u.id === athleteId);
    const athleteData = athletes.find(a => a.userId === athleteId);
    const athleteLogs = logs
        .filter(l => l.athleteId === athleteId)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!athleteUser || !athleteData) return <div>Athlete not found.</div>;

    const handleLogSubmit = (e) => {
        e.preventDefault();
        onAddLog({
            athleteId: athleteId,
            content: logContent,
        });
        setLogContent('');
    };

    return (
        <div>
            <div className="dashboard-header"><h1>{athleteUser.name}'s Profile</h1></div>
            <div className="profile-layout">
                <div className="card">
                    <h3>Progress Overview</h3>
                    {Object.entries(athleteData.progress).map(([skill, value]) => (
                        <div key={skill} className="progress-item">
                            <label>{skill}</label>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${value}%` }}>{String(value)}%</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card">
                    <h3>Activity Log</h3>
                    <form className="log-form" onSubmit={handleLogSubmit}>
                        <div className="form-group">
                            <textarea value={logContent} onChange={(e) => setLogContent(e.target.value)} placeholder="Add a new log entry..."></textarea>
                        </div>
                        <button className="btn btn-primary" type="submit">Add Log</button>
                    </form>
                    <div className="log-list">
                        {athleteLogs.map(log => (
                            <div key={log.id} className="log-entry">
                                <p className="log-content">{log.content}</p>
                                <p className="log-meta">By {log.author} on {new Date(log.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

const MyProgress = ({ currentUser, users, athletes }) => {
    const athleteUser = users.find(u => u.id === currentUser.id);
    const athleteData = athletes.find(a => a.userId === currentUser.id);
    
    if (!athleteUser || !athleteData) return <div>Could not find athlete data.</div>;

    return (
        <div>
            <div className="dashboard-header"><h1>My Progress</h1></div>
            <div className="card">
                <h3>Your Current Skill Levels</h3>
                 {Object.entries(athleteData.progress).map(([skill, value]) => (
                    <div key={skill} className="progress-item">
                        <label>{skill}</label>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${value}%` }}>{String(value)}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PersonalLog = ({ currentUser, logs, onAddLog }) => {
    const [logContent, setLogContent] = useState('');
    const userLogs = logs
        .filter(l => l.athleteId === currentUser.id)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const handleLogSubmit = (e) => {
        e.preventDefault();
        onAddLog({
            athleteId: currentUser.id,
            content: logContent,
        });
        setLogContent('');
    };

    return (
         <div>
            <div className="dashboard-header"><h1>Personal Log</h1></div>
            <div className="card">
                <h3>Your Training Diary</h3>
                <form className="log-form" onSubmit={handleLogSubmit}>
                    <div className="form-group">
                        <textarea value={logContent} onChange={(e) => setLogContent(e.target.value)} placeholder="What did you work on today?"></textarea>
                    </div>
                    <button className="btn btn-primary" type="submit">Add Entry</button>
                </form>
                <div className="log-list">
                    {userLogs.map(log => (
                        <div key={log.id} className="log-entry">
                            <p className="log-content">{log.content}</p>
                            <p className="log-meta">By {log.author} on {new Date(log.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Schedule = ({ schedules, users, currentUser }) => {
    // This component is now a simple list for Parents/Athletes
    let relevantSchedules = [];
    if (currentUser.role === 'Parent' && currentUser.children) {
        relevantSchedules = schedules.filter(s => s.athleteIds.some(id => currentUser.children.includes(id)));
    } else if (currentUser.role === 'Athlete') {
        relevantSchedules = schedules.filter(s => s.athleteIds.includes(currentUser.id));
    }
    
    relevantSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const groupedSchedules = relevantSchedules.reduce((acc, schedule) => {
        const date = new Date(schedule.date).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {});

    return (
        <div>
            <div className="dashboard-header"><h1>My Schedule</h1></div>
             {Object.keys(groupedSchedules).length === 0 ? (
                <div className="card"><p>You have no upcoming sessions.</p></div>
            ) : (
                <div className="schedule-container">
                    {Object.entries(groupedSchedules).map(([date, sessions]) => (
                        <div key={date} className="card schedule-group">
                            <h3 className="schedule-date">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                            {sessions.map((session) => (
                                <div key={session.id} className="session-card">
                                    <h4>{session.time} - {session.title}</h4>
                                    <div className="session-location"><MapPinIcon /> {session.location}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PaymentModal = ({ invoice, onConfirm, onClose }) => {
    const [step, setStep] = useState(1); // 1: choice, 2: confirmation

    const handleConfirm = () => {
        onConfirm();
        setStep(2);
    }
    
    return (
        <div className="modal-overlay show">
            <div className="modal-content">
                {step === 1 ? (
                    <>
                        <div className="modal-header">
                            <h2>Pay Invoice</h2>
                            <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                        </div>
                        <div className="payment-details">
                            <p><strong>Description:</strong> {invoice.description}</p>
                            <p><strong>Amount:</strong> KES {invoice.amount.toLocaleString()}</p>
                            <div className="payment-actions">
                                <p>Choose a payment method:</p>
                                <div className="login-options">
                                    <button onClick={handleConfirm} className="btn btn-primary">Pay with M-Pesa</button>
                                    <button onClick={handleConfirm} className="btn btn-secondary">Pay with Card</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="confirmation-message">
                        <div className="icon"><CheckCircleIcon/></div>
                        <h3>Payment Successful!</h3>
                        <p>Thank you for your payment. Your records have been updated.</p>
                        <button onClick={onClose} className="btn btn-primary">Done</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Payments = ({ currentUser, users, invoices, onPayInvoice }) => {
    const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

    const handleOpenPayModal = (invoice: Invoice) => setInvoiceToPay(invoice);
    const handleClosePayModal = () => setInvoiceToPay(null);

    const handlePay = () => {
        if (invoiceToPay) {
            onPayInvoice(invoiceToPay.id);
            // Modal will show confirmation and then close itself
        }
    };
    
    let userInvoices: Invoice[] = [];
    if (currentUser.role === 'Admin') {
        userInvoices = invoices;
    } else if (currentUser.role === 'Parent' && currentUser.children) {
        const childIds = currentUser.children;
        userInvoices = (invoices as Invoice[]).filter(inv => childIds.includes(inv.userId));
    }

    return (
        <div>
            <div className="dashboard-header"><h1>Payments</h1></div>
            <div className="table-container">
                 <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KES)</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userInvoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.description}</td>
                                <td>{invoice.amount.toLocaleString()}</td>
                                <td><span className={`status-badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td>
                                    {invoice.status === 'Due' && (
                                        <button className="btn btn-primary" onClick={() => handleOpenPayModal(invoice)}>Pay Now</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {invoiceToPay && <PaymentModal invoice={invoiceToPay} onConfirm={handlePay} onClose={handleClosePayModal} />}
        </div>
    )
}

const NewConversationModal = ({ isOpen, onClose, users, currentUser, onCreateConversation }) => {
    const [recipientId, setRecipientId] = useState('');
    const [message, setMessage] = useState('');
    const modalContentRef = useRef(null);
    
    const possibleRecipients = users.filter(u => u.id !== currentUser.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (recipientId && message) {
            onCreateConversation(Number(recipientId), message);
            onClose();
        }
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
                    <h2>New Message</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="recipient">To:</label>
                        <select id="recipient" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required>
                            <option value="">Select a user...</option>
                            {possibleRecipients.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Messaging = ({ currentUser, users, conversations, messages, onSendMessage, onMarkAsRead, onCreateConversation, onNavigate, activeConversationId: initialActiveConvoId }) => {
    const [activeConversationId, setActiveConversationId] = useState<number | null>(initialActiveConvoId || null);
    const [newMessage, setNewMessage] = useState('');
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if(initialActiveConvoId) {
            setActiveConversationId(initialActiveConvoId);
            onMarkAsRead(initialActiveConvoId);
        }
    }, [initialActiveConvoId, onMarkAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversationId]);
    
    const myConversations = (conversations as typeof initialConversations)
        .filter(c => c.participantIds.includes(currentUser.id))
        .sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

    const activeConversation = myConversations.find(c => c.id === activeConversationId);
    const conversationMessages = activeConversation ? (messages as typeof initialMessages)
        .filter(m => m.conversationId === activeConversation.id)
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeConversationId) {
            onSendMessage(activeConversationId, newMessage);
            setNewMessage('');
        }
    };
    
    const handleConversationSelect = (convoId: number) => {
        setActiveConversationId(convoId);
        onMarkAsRead(convoId);
        onNavigate({ name: 'Messages', conversationId: convoId });
    };

    const getLastMessage = (convoId: number): Message | { content: string } => {
        const convoMessages = (messages as typeof initialMessages)
            .filter(m => m.conversationId === convoId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return convoMessages[0] || { content: 'No messages yet' };
    };

    const isUnread = (convo: Conversation) => {
        const lastMsg = getLastMessage(convo.id) as Message;
        return lastMsg.id && !lastMsg.readBy.includes(currentUser.id);
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>Messages</h1>
                <button className="btn btn-primary" onClick={() => setIsNewConvoModalOpen(true)}>New Message</button>
            </div>
            <div className="messaging-layout card">
                <div className="conversation-list">
                    {myConversations.map(convo => {
                        const otherParticipant = users.find(u => u.id !== currentUser.id && convo.participantIds.includes(u.id));
                        if (!otherParticipant) return null;
                        
                        const unread = isUnread(convo);

                        return (
                            <div key={convo.id} 
                                 className={`conversation-item ${activeConversationId === convo.id ? 'active' : ''} ${unread ? 'unread' : ''}`}
                                 onClick={() => handleConversationSelect(convo.id)}>
                                {unread && <div className="unread-indicator"></div>}
                                <div className="avatar">{otherParticipant.name.charAt(0)}</div>
                                <div className="convo-details">
                                    <p className="participant-name">{otherParticipant.name}</p>
                                    <p className="last-message">{(getLastMessage(convo.id) as Message).content}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="chat-window">
                    {activeConversation ? (
                        <>
                            <div className="chat-header">
                                <h3>{users.find(u => u.id === activeConversation.participantIds.find(id => id !== currentUser.id))?.name}</h3>
                            </div>
                            <div className="chat-messages" ref={messagesEndRef}>
                                {conversationMessages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
                                        {msg.content}
                                        <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."/>
                                <button type="submit" className="btn btn-primary btn-icon"><PaperAirplaneIcon /></button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <EnvelopeIcon/>
                            <h3>Select a conversation</h3>
                            <p>Choose from an existing conversation on the left, or start a new one.</p>
                        </div>
                    )}
                </div>
            </div>
            <NewConversationModal 
                isOpen={isNewConvoModalOpen} 
                onClose={() => setIsNewConvoModalOpen(false)} 
                users={users} 
                currentUser={currentUser} 
                onCreateConversation={onCreateConversation} 
            />
        </div>
    )
};

const CalendarView = ({ currentUser, users, schedules, onAdd, onUpdate, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Schedule | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const daysInMonth = endOfMonth.getDate();

    const changeMonth = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setSelectedSession(null);
        setIsModalOpen(true);
    };

    const handleSessionClick = (session) => {
        setSelectedSession(session);
        setSelectedDate(null);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    const allDays = [];
    for (let i = 0; i < startDay; i++) {
        allDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const daySessions = schedules.filter(s => s.date === dateStr);
        
        allDays.push(
            <div key={day} className="calendar-day" onClick={() => handleDayClick(day)}>
                <div className="day-number">{day}</div>
                <div className="sessions-container">
                    {daySessions.map(session => (
                        <div key={session.id} className="session-event" onClick={(e) => { e.stopPropagation(); handleSessionClick(session); }}>
                            <span className="session-time">{session.time}</span> {session.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <div className="dashboard-header">
                <h1>My Calendar</h1>
                <button className="btn btn-primary" onClick={() => { setSelectedDate(new Date()); setSelectedSession(null); setIsModalOpen(true); }}>New Session</button>
            </div>
            <div className="calendar-container card">
                <div className="calendar-header">
                    <button onClick={() => changeMonth(-1)} className="btn-icon"><ChevronLeftIcon /></button>
                    <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="btn-icon"><ChevronRightIcon /></button>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-day-header">Sun</div>
                    <div className="calendar-day-header">Mon</div>
                    <div className="calendar-day-header">Tue</div>
                    <div className="calendar-day-header">Wed</div>
                    <div className="calendar-day-header">Thu</div>
                    <div className="calendar-day-header">Fri</div>
                    <div className="calendar-day-header">Sat</div>
                    {allDays}
                </div>
            </div>
            {isModalOpen && (
                <SessionModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    sessionToEdit={selectedSession}
                    selectedDate={selectedDate}
                    onSave={selectedSession ? onUpdate : onAdd}
                    onDelete={onDelete}
                    users={users}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

// Fix: Define an interface for the session form data to ensure type safety for all properties.
interface SessionFormData {
    id?: number;
    coachId?: number;
    title: string;
    date: string;
    time: string;
    location: string;
    athleteIds: number[];
}

const SessionModal = ({ isOpen, onClose, sessionToEdit, selectedDate, onSave, onDelete, users, currentUser }) => {
    // Fix: Use the SessionFormData interface for the state to prevent type inference issues.
    const [formData, setFormData] = useState<SessionFormData>({
        title: '',
        date: '',
        time: '',
        location: 'Main Rink',
        athleteIds: []
    });
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (sessionToEdit) {
            setFormData({ ...sessionToEdit, athleteIds: sessionToEdit.athleteIds || [] });
        } else if (selectedDate) {
            setFormData({
                title: '',
                date: selectedDate.toISOString().split('T')[0],
                time: '16:00',
                location: 'Main Rink',
                athleteIds: []
            });
        }
    }, [sessionToEdit, selectedDate, isOpen]);

    // Fix: Add types for event handlers to ensure type safety on event targets.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fix: Add types for event handlers to ensure type safety on event targets.
    const handleAthleteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => Number(option.value));
        setFormData(prev => ({ ...prev, athleteIds: selectedIds }));
    };

    // Fix: Add types for event handlers to ensure type safety on event targets.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            id: sessionToEdit ? sessionToEdit.id : undefined,
            coachId: currentUser.id,
        }
        onSave(dataToSave);
        onClose();
    };

    const handleDelete = () => {
        if (sessionToEdit && window.confirm('Are you sure you want to delete this session?')) {
            onDelete(sessionToEdit.id);
            onClose();
        }
    };
    
    const coachAthletes = users.filter(u => u.role === 'Athlete' && u.coachId === currentUser.id);

    return (
        <div className="modal-overlay show">
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>{sessionToEdit ? 'Edit Session' : 'New Session'}</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Group Practice, Leo Private"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <select id="location" name="location" value={formData.location} onChange={handleChange}>
                            <option>Main Rink</option>
                            <option>Practice Area</option>
                            <option>Outdoor Track</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label htmlFor="athleteIds">Athletes</label>
                        <select id="athleteIds" name="athleteIds" multiple value={formData.athleteIds.map(String)} onChange={handleAthleteChange} className="multi-select">
                            {coachAthletes.map(athlete => (
                                <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                         {sessionToEdit && (
                            <button type="button" className="btn-icon delete-btn" onClick={handleDelete} aria-label="Delete session"><TrashIcon /></button>
                        )}
                        <div style={{ flexGrow: 1 }}></div>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Session</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ currentUser, users, athletes, logs, schedules, invoices, conversations, messages, activeView, onNavigate, ...handlers }) => {
    
    const renderContent = () => {
        switch (activeView.name) {
            case 'Dashboard':
                if (currentUser.role === 'Admin') {
                    return <AdminDashboard users={users} schedules={schedules} invoices={invoices} />;
                }
                return <DashboardHome user={currentUser} />;
            case 'User Management':
                return <UserManagement users={users} onAddUser={handlers.onAddUser} onEditUser={handlers.onEditUser} />;
            case 'My Athletes':
                return <MyAthletes users={users} athletes={athletes} onSelectAthlete={handlers.onSelectAthlete} currentUser={currentUser} />;
            case 'Athlete Profile':
                return <AthleteProfile athleteId={activeView.athleteId} users={users} athletes={athletes} logs={logs} onAddLog={handlers.onAddLog} />;
            case 'My Progress':
                return <MyProgress currentUser={currentUser} users={users} athletes={athletes} />;
            case 'Personal Log':
                return <PersonalLog currentUser={currentUser} logs={logs} onAddLog={handlers.onAddLog} />;
            case 'Calendar': // For coaches
                return <CalendarView currentUser={currentUser} users={users} schedules={schedules} onAdd={handlers.onAddSchedule} onUpdate={handlers.onUpdateSchedule} onDelete={handlers.onDeleteSchedule} />;
            case 'Schedule': // For athletes/parents
                return <Schedule schedules={schedules} users={users} currentUser={currentUser} />;
            case 'Payments':
                return <Payments currentUser={currentUser} users={users} invoices={invoices} onPayInvoice={handlers.onPayInvoice} />;
            case 'Messages':
                return <Messaging 
                            currentUser={currentUser} 
                            users={users} 
                            conversations={conversations} 
                            messages={messages} 
                            onSendMessage={handlers.onSendMessage} 
                            onMarkAsRead={handlers.onMarkAsRead}
                            onCreateConversation={handlers.onCreateConversation}
                            onNavigate={onNavigate}
                            activeConversationId={activeView.conversationId}
                       />;
            default:
                return <DashboardHome user={currentUser} />;
        }
    };
    
    return (
        <div className="dashboard-layout">
            <Sidebar userRole={currentUser.role} activeView={activeView.name} onNavigate={onNavigate} />
            <main className="dashboard-content">
                <div className="container">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}


const App = () => {
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [athletes, setAthletes] = useLocalStorage<Athlete[]>('athletes', initialAthletes);
    const [logs, setLogs] = useLocalStorage<Log[]>('logs', initialLogs);
    const [schedules, setSchedules] = useLocalStorage<Schedule[]>('schedules', initialSchedules);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', initialInvoices);
    const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', initialConversations);
    const [messages, setMessages] = useLocalStorage<Message[]>('messages', initialMessages);

    const [activeView, setActiveView] = useState<ActiveView>({ name: 'Dashboard' });
    
    useEffect(() => {
        if (currentUser) {
            const defaultView = sidebarLinks[currentUser.role]?.[0]?.view || 'Dashboard';
            setActiveView({name: defaultView});
        }
    }, [currentUser]);

    const handleLoginAttempt = (email, password) => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            setLoginModalOpen(false);
            return null; // Success
        }
        return "Invalid email or password."; // Error message
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveView({name: 'Dashboard'});
    };
    
    const handleNavigate = (view: ActiveView) => {
        setActiveView(view);
    };

    const handleSelectAthlete = (athleteId: number) => {
        setActiveView({ name: 'Athlete Profile', athleteId });
    };

    const handleAddUser = (userData) => {
        const newUser = { ...userData, id: Math.max(...users.map(u => u.id)) + 1, password: 'password123' };
        setUsers(prev => [...prev, newUser]);
    };
    
    const handleEditUser = (userData) => {
        setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
    };
    
    const handleAddLog = (logData) => {
        const newLog = { 
            ...logData, 
            id: Math.max(...logs.map(l => l.id), 0) + 1,
            author: currentUser.name,
            date: new Date().toISOString().split('T')[0]
        };
        setLogs(prev => [...prev, newLog]);
    };

    const handlePayInvoice = (invoiceId: number) => {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
    };
    
    const handleAddSchedule = (scheduleData) => {
        const newSchedule = { ...scheduleData, id: Math.max(...schedules.map(s => s.id), 0) + 1 };
        setSchedules(prev => [...prev, newSchedule]);
    };

    const handleUpdateSchedule = (scheduleData) => {
        setSchedules(prev => prev.map(s => s.id === scheduleData.id ? scheduleData : s));
    };

    const handleDeleteSchedule = (scheduleId) => {
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    };


    const handleSendMessage = (conversationId: number, content: string) => {
        const newMessage: Message = {
            id: Math.max(...messages.map(m => m.id), 0) + 1,
            conversationId,
            senderId: currentUser.id,
            content,
            timestamp: new Date().toISOString(),
            readBy: [currentUser.id]
        };
        setMessages(prev => [...prev, newMessage]);
        setConversations(prev => prev.map(c => c.id === conversationId ? {...c, lastMessageTimestamp: newMessage.timestamp } : c));
    };

    const handleMarkConversationAsRead = (conversationId: number) => {
        setMessages(prev => prev.map(msg => 
            msg.conversationId === conversationId && !msg.readBy.includes(currentUser.id)
                ? { ...msg, readBy: [...msg.readBy, currentUser.id] }
                : msg
        ));
    };

    const handleCreateConversation = (recipientId: number, firstMessage: string) => {
        const existingConvo = conversations.find(c =>
            c.participantIds.includes(currentUser.id) && c.participantIds.includes(recipientId)
        );

        if (existingConvo) {
            handleSendMessage(existingConvo.id, firstMessage);
            setActiveView({ name: 'Messages', conversationId: existingConvo.id });
            return;
        }

        const newConversationId = Math.max(...conversations.map(c => c.id), 0) + 1;
        const newConversation: Conversation = {
            id: newConversationId,
            participantIds: [currentUser.id, recipientId],
            lastMessageTimestamp: new Date().toISOString()
        };
        setConversations(prev => [...prev, newConversation]);
        handleSendMessage(newConversationId, firstMessage);
        setActiveView({ name: 'Messages', conversationId: newConversationId });
    };


    const unreadCount = currentUser ? conversations
        .filter(c => c.participantIds.includes(currentUser.id))
        .filter(c => {
            const lastMsg = messages
                .filter(m => m.conversationId === c.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            return lastMsg && !lastMsg.readBy.includes(currentUser.id);
        }).length : 0;

    const dashboardHandlers = {
        onAddUser: handleAddUser,
        onEditUser: handleEditUser,
        onSelectAthlete: handleSelectAthlete,
        onAddLog: handleAddLog,
        onPayInvoice: handlePayInvoice,
        onAddSchedule: handleAddSchedule,
        onUpdateSchedule: handleUpdateSchedule,
        onDeleteSchedule: handleDeleteSchedule,
        onSendMessage: handleSendMessage,
        onMarkAsRead: handleMarkConversationAsRead,
        onCreateConversation: handleCreateConversation,
    };

    return (
        <>
            <Header 
                onBookNowClick={() => setBookingModalOpen(true)} 
                onLoginClick={() => setLoginModalOpen(true)}
                user={currentUser}
                onLogout={handleLogout}
                unreadCount={unreadCount}
                onNavigate={handleNavigate}
            />
            
            {currentUser ? (
                <Dashboard 
                    currentUser={currentUser} 
                    users={users}
                    athletes={athletes}
                    logs={logs}
                    schedules={schedules}
                    invoices={invoices}
                    conversations={conversations}
                    messages={messages}
                    onNavigate={handleNavigate}
                    activeView={activeView}
                    {...dashboardHandlers}
                />
            ) : (
                <>
                    <LandingPage onBookNowClick={() => setBookingModalOpen(true)} />
                    <Footer />
                </>
            )}
            
            <BookingModal isOpen={isBookingModalOpen} onClose={() => setBookingModalOpen(false)} />
            <LoginFormModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setLoginModalOpen(false)}
                onLoginAttempt={handleLoginAttempt}
            />
        </>
    );
};

export default App;
