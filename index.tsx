
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
        } catch (error)
        {
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

// --- Type Definitions ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent' | 'Manager';
type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Unmarked';

interface User {
    id: number;
    name: string;
    role: Role;
    status: 'Active' | 'Inactive';
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    activity?: string;
    ageGroup?: string;
    parentId?: number;
    coachId?: number;
    badges?: string[];
    height?: string;
    weight?: string;
    personalBest?: string;
    goals?: string;
    history?: { id: number; date: string; description: string }[];
    bio?: string;
    expertise?: string;
    // New fields
    emergencyContact?: { name: string; phone: string; relation: string; };
    medicalNotes?: string;
    contactDetails?: { phone: string; email: string; }; // For parents
    certifications?: string[]; // For coaches
    availability?: string; // For coaches
}

interface TrainingSession {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    coachId: number;
    athleteIds: number[];
    attendance: Record<number, AttendanceStatus>;
}

interface Event {
    id: number;
    title: string;
    date: string;
    description: string;
    participants: number[];
    category: 'Competition' | 'Training' | 'Social';
}


// --- Initial Data ---
const initialUsers: User[] = [
    // Athletes
    { id: 1, name: 'Sarah Wanjiku', role: 'Athlete', status: 'Active', skillLevel: 'Beginner', activity: 'Skating', ageGroup: 'U10', parentId: 4, coachId: 6, badges: ['first_competition'], 
        height: "5'4\"", weight: "120 lbs", personalBest: "Triple Salchow attempt", goals: "Qualify for regional championship.",
        emergencyContact: { name: 'David Odhiambo', phone: '+254 712 345 678', relation: 'Father' },
        medicalNotes: 'Mild asthma, carries an inhaler. No known allergies.',
        history: [
            { id: 4, date: '2025-09-12', description: 'New high score: 92 in choreography.' },
            { id: 3, date: '2025-09-05', description: 'Completed speed circuit. Time: 120 seconds.' },
            { id: 1, date: '2025-08-28', description: 'Mastered forward swizzles. Freestyle routine score: 85.' },
            { id: 2, date: '2025-08-20', description: 'First time on ice without assistance.' }
    ]},
    { id: 2, name: 'John Kamau', role: 'Athlete', status: 'Active', skillLevel: 'Intermediate', activity: 'Swimming', ageGroup: '15-18', parentId: 4, coachId: 7, badges: ['distance_award'], history: [] },
    { id: 3, name: 'Emily Akinyi', role: 'Athlete', status: 'Inactive', skillLevel: 'Advanced', activity: 'Skating', ageGroup: 'U10', parentId: 5, coachId: 6, badges: [], history: [] },

    // Parents
    { id: 4, name: 'David Odhiambo', role: 'Parent', status: 'Active', contactDetails: { phone: '+254 712 345 678', email: 'david.o@example.com' } },
    { id: 5, name: 'Maryanne Wambui', role: 'Parent', status: 'Active', contactDetails: { phone: '+254 722 987 654', email: 'mary.w@example.com' } },

    // Coaches
    { id: 6, name: 'Coach Brian', role: 'Coach', status: 'Active', skillLevel: 'Advanced', activity: 'Skating', bio: "10+ years of competitive skating experience.", expertise: "Figure Skating Choreography",
      certifications: ['Certified Skating Coach (Level 3)', 'First Aid & CPR Certified'], availability: 'Mon-Fri, 9am - 5pm' },
    { id: 7, name: 'Coach Alice', role: 'Coach', status: 'Active', skillLevel: 'Intermediate', activity: 'Swimming', bio: "Certified swimming instructor specializing in youth programs.", expertise: "Freestyle & Butterfly",
      certifications: ['Certified Swim Instructor (WSI)', 'Lifeguard Certified'], availability: 'Weekends, 10am - 4pm' },
    
    // Admin
    { id: 8, name: 'Admin User', role: 'Admin', status: 'Active' },
    { id: 9, name: 'Alice Admin', role: 'Admin', status: 'Active' },

    // Manager
    { id: 10, name: 'Grace Nakimuli', role: 'Manager', status: 'Active' },
];

const initialTrainingSessions: TrainingSession[] = [
    { id: 'ts1', title: 'Morning Skate', date: '2025-08-20', startTime: '09:00', endTime: '11:00', coachId: 6, athleteIds: [1, 3], attendance: { 1: 'Present', 3: 'Absent' } },
    { id: 'ts2', title: 'Pool Drills', date: '2025-08-20', startTime: '14:00', endTime: '15:30', coachId: 7, athleteIds: [2], attendance: { 2: 'Unmarked' } },
    { id: 'ts3', title: 'Advanced Choreography', date: '2025-08-22', startTime: '10:00', endTime: '12:00', coachId: 6, athleteIds: [3], attendance: { 3: 'Unmarked' } },
];

const initialEvents: Event[] = [
    { id: 1, title: 'Summer Skate-a-thon', date: '2025-08-30', description: 'Annual club-wide skating marathon and fundraiser.', participants: [1, 3], category: 'Social' },
    { id: 2, title: 'Regional Qualifiers', date: '2025-09-15', description: 'Qualifier event for the national championships.', participants: [3], category: 'Competition' },
    { id: 3, title: 'Swim Meet vs. Sharks', date: '2025-09-20', description: 'Friendly local swim meet.', participants: [2], category: 'Competition' },
];

const initialPayments = [
    { id: 'p1', userId: 4, amount: 15000, date: '2025-08-01', status: 'Paid', description: 'August Fees (S. Wanjiku)' },
    { id: 'p2', userId: 4, amount: 7500, date: '2025-08-05', status: 'Paid', description: 'Swim Meet Entry (J. Kamau)' },
    { id: 'p3', userId: 5, amount: 15000, date: '2025-08-01', status: 'Overdue', description: 'August Fees (E. Akinyi)' },
];

const initialNotifications = [
    { id: 1, userId: 4, type: 'payment', message: 'Your payment of KES 15000 was successful.', timestamp: '2025-08-01T10:00:00Z', read: true },
    { id: 2, userId: 4, type: 'event', message: 'Reminder: Summer Skate-a-thon is this Saturday!', timestamp: '2025-08-28T09:00:00Z', read: false },
];

const initialTasks = [
    { id: 't1', title: 'Finalize competition roster', assignedTo: 6, completed: false, dueDate: '2025-09-10' },
    { id: 't2', title: 'Service skating equipment', assignedTo: 8, completed: true, dueDate: '2025-08-15' },
    { id: 't3', title: 'Update swimmer progress reports', assignedTo: 7, completed: false, dueDate: '2025-08-25' },
];

const initialConversations = [
    {
        id: 'c1',
        participantIds: [4, 6], // Parent David, Coach Brian
        messages: [
            { id: 'm1', senderId: 4, text: "Hi Coach, how is Sarah's new routine coming along?", timestamp: '2025-08-19T14:30:00Z' },
            { id: 'm2', senderId: 6, text: "Excellent! She's landing the double salchow consistently now. We'll be adding it to her program this week.", timestamp: '2025-08-19T15:05:00Z' },
        ],
        lastMessageTimestamp: '2025-08-19T15:05:00Z',
        unreadCount: { 4: 0, 6: 0 }
    },
    {
        id: 'c2',
        participantIds: [8, 7], // Admin User, Coach Alice
        messages: [
            { id: 'm3', senderId: 8, text: "Just a reminder that pool maintenance is scheduled for next Monday.", timestamp: '2025-08-20T10:00:00Z' },
        ],
        lastMessageTimestamp: '2025-08-20T10:00:00Z',
        unreadCount: { 8: 0, 7: 1 }
    }
];

// --- SVG Icons ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253-9.527 9.527 0 0 0-4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 3-1.732a2.25 2.25 0 0 1 3 1.732V19.128M15 19.128A2.25 2.25 0 0 1 12.75 21a2.25 2.25 0 0 1-2.25-1.872M7.5 14.25v-3.86a2.25 2.25 0 0 1 3-1.732a2.25 2.25 0 0 1 3 1.732V14.25M3 14.25a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 3 5.25h1.5A2.25 2.25 0 0 1 6.75 7.5v4.5a2.25 2.25 0 0 1-2.25 2.25H3Z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12m18 0h-2.25M3 12h-2.25" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.05 1.05 0 0 0-1.485 0l-3.72 3.72A2.11 2.11 0 0 1 3 14.893v-4.286c0-.97 0.616-1.813 1.5-2.097M14.25 7.5a2.25 2.25 0 0 0-2.25 2.25v4.5a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25v-4.5a2.25 2.25 0 0 0-2.25-2.25h-1.5Z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const SkatingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v3Zm-9-1h-2v-1h2v1Zm4 0h-2v-1h2v1Z"/><path d="M19 2H5C3.35 2 2 3.35 2 5v7h2V5c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v7h2V5c0-1.65-1.35-3-3-3Z"/></svg>;
const EmptyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 1 1 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.008v.008H12v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c.497 0 .974.197 1.325.55l.288.288a.5.5 0 0 0 .707 0l1.414-1.414a.5.5 0 0 0 0-.707l-.288-.288A2.25 2.25 0 0 0 12 10.5v2.25Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-.497 0-.974.197-1.325.55l-.288.288a.5.5 0 0 1-.707 0L8.266 12.17a.5.5 0 0 1 0-.707l.288-.288A2.25 2.25 0 0 1 12 10.5v2.25Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5s.448-1.105 1.5-1.5 2.052-.5 2.052-.5l.288-.288a.5.5 0 0 0 0-.707L5.424 9.17a.5.5 0 0 0-.707 0l-.288.288s-1.052.052-2.052.5S3 13.5 3 13.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.5s-.448-1.105-1.5-1.5-2.052-.5-2.052-.5l-.288-.288a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 0 1 .707 0l.288.288s1.052.052 2.052.5 1.5 1.5 1.5 1.5Z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 0 1-2.25 2.25h-13.5a2.25 2.25 0 0 1-2.25-2.25V14.15M12 12.375a.375.375 0 0 1 .375.375v1.875c0 .207-.168.375-.375.375h-1.5a.375.375 0 0 1-.375-.375V12.75c0-.207.168.375.375-.375h1.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.875c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375V12.75Zm-6-9h12c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-12A1.125 1.125 0 0 1 4.5 7.875V4.5A1.125 1.125 0 0 1 5.625 3.375Z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m-1.5 12.5h-1.5a3.375 3.375 0 0 1-3.375-3.375V8.625c0-1.002.413-1.911 1.096-2.594A3.375 3.375 0 0 1 5.625 5.25h12.75c1.002 0 1.911.413 2.594 1.096A3.375 3.375 0 0 1 21 8.625v2.625m-15 4.5h15M7.5 15h7.5" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>;
const ArrowUpOnSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M12 12V3m0 0-3.75 3.75M12 3l3.75 3.75" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>;

const ROLES = {
    Admin: <BriefcaseIcon />,
    Manager: <CheckBadgeIcon />,
    Coach: <UsersIcon />,
    Athlete: <SkatingIcon />,
    Parent: <UserCircleIcon />,
};

// --- Main App Component ---
const App = () => {
    // --- State Management ---
    const [page, setPage] = useStickyState({ name: 'dashboard' }, 'app_page');
    const [currentUser, setCurrentUser] = useStickyState(initialUsers[8], 'app_currentUser'); // Default to Admin
    const [users, setUsers] = useStickyState(initialUsers, 'app_users');
    const [trainingSessions, setTrainingSessions] = useStickyState(initialTrainingSessions, 'app_trainingSessions');
    const [events, setEvents] = useStickyState(initialEvents, 'app_events');
    const [payments, setPayments] = useStickyState(initialPayments, 'app_payments');
    const [notifications, setNotifications] = useStickyState(initialNotifications, 'app_notifications');
    const [tasks, setTasks] = useStickyState(initialTasks, 'app_tasks');
    const [conversations, setConversations] = useStickyState(initialConversations, 'app_conversations');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
    const [isRoleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAthleteModalOpen, setIsAthleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Refs ---
    const notificationPanelRef = useRef(null);
    const roleSwitcherRef = useRef(null);
    
    // --- Derived State & Memos ---
    const athletes = useMemo(() => users.filter(u => u.role === 'Athlete'), [users]);
    const coaches = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);
    const parents = useMemo(() => users.filter(u => u.role === 'Parent'), [users]);
    const unreadNotificationCount = useMemo(() => notifications.filter(n => n.userId === currentUser.id && !n.read).length, [notifications, currentUser.id]);

    // Enhanced dynamic notification generation for overdue payments
    useEffect(() => {
        if (currentUser.role !== 'Parent') return;

        // Using a unique key for this type of notification to easily find/update/remove it
        const overdueNotificationKey = `overdue-payment-alert-for-user-${currentUser.id}`;

        const overduePayments = payments.filter(p => p.userId === currentUser.id && p.status === 'Overdue');
        const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

        setNotifications(prevNotifications => {
            const existingNotificationIndex = prevNotifications.findIndex(n => n.key === overdueNotificationKey);
            
            // Case 1: Overdue balance exists
            if (totalOverdue > 0) {
                const newMessage = `You have an outstanding balance of KES ${totalOverdue}. Please settle it soon.`;
                
                // If notification already exists
                if (existingNotificationIndex > -1) {
                    const existingNotification = prevNotifications[existingNotificationIndex];
                    // Update if message is different, otherwise no change
                    if (existingNotification.message !== newMessage) {
                        const updatedNotifications = [...prevNotifications];
                        updatedNotifications[existingNotificationIndex] = {
                            ...existingNotification,
                            message: newMessage,
                            timestamp: new Date().toISOString(),
                            read: false // Mark as unread again if amount changes
                        };
                        return updatedNotifications;
                    }
                    return prevNotifications; // No change needed
                } else {
                    // Create new notification if it doesn't exist
                    const newNotification = {
                        id: (prevNotifications.length > 0 ? Math.max(...prevNotifications.map(n => n.id)) : 0) + 1,
                        key: overdueNotificationKey, // Add our unique key
                        userId: currentUser.id,
                        type: 'payment',
                        message: newMessage,
                        timestamp: new Date().toISOString(),
                        read: false,
                        page: 'payments'
                    };
                    return [...prevNotifications, newNotification];
                }
            } 
            // Case 2: No overdue balance
            else {
                // If notification exists, remove it
                if (existingNotificationIndex > -1) {
                    return prevNotifications.filter((_, index) => index !== existingNotificationIndex);
                }
                return prevNotifications; // No change needed
            }
        });
    }, [currentUser.id, currentUser.role, payments, setNotifications]);

    // useEffect for upcoming training session notifications
    useEffect(() => {
        if (currentUser.role !== 'Athlete' && currentUser.role !== 'Coach') return;

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const relevantSessions = trainingSessions.filter(session => {
            const sessionDate = new Date(`${session.date}T${session.startTime}`);
            return sessionDate > now && sessionDate <= tomorrow;
        });

        if (relevantSessions.length === 0) return;

        setNotifications(prevNotifications => {
            const newNotifications = [];
            
            relevantSessions.forEach(session => {
                const isParticipant = session.coachId === currentUser.id || session.athleteIds.includes(currentUser.id);

                if (isParticipant) {
                    const notificationKey = `session-reminder-${session.id}-for-user-${currentUser.id}`;
                    const alreadyNotified = prevNotifications.some(n => n.key === notificationKey);

                    if (!alreadyNotified) {
                        const sessionDate = new Date(`${session.date}T${session.startTime}`);
                        const timeString = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        newNotifications.push({
                            id: 0, // placeholder id
                            key: notificationKey,
                            userId: currentUser.id,
                            type: 'event',
                            message: `Reminder: Your session "${session.title}" is today at ${timeString}.`,
                            timestamp: new Date().toISOString(),
                            read: false,
                            page: 'schedule'
                        });
                    }
                }
            });

            if (newNotifications.length > 0) {
                let maxId = prevNotifications.length > 0 ? Math.max(...prevNotifications.map(n => n.id)) : 0;
                const notificationsToAdd = newNotifications.map(notification => {
                    maxId++;
                    return { ...notification, id: maxId };
                });
                return [...prevNotifications, ...notificationsToAdd];
            }

            return prevNotifications;
        });

    }, [currentUser.id, currentUser.role, trainingSessions, setNotifications]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- Data Handlers ---
    const handleSaveUser = (userData) => {
        if (userData.id) {
            setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
            showToast('User updated successfully!');
        } else {
            const newUser = { ...userData, id: Math.max(0, ...users.map(u => u.id)) + 1, status: 'Active' };
            setUsers([...users, newUser]);
            showToast('User added successfully!');
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(u => u.id !== userId));
        setDeleteConfirmation(null);
        showToast('User deleted successfully.', 'danger');
    };
    
    const handleSaveAthlete = (athleteData) => {
        const newAthlete = { 
            ...athleteData, 
            id: Math.max(0, ...users.map(u => u.id)) + 1, 
            role: 'Athlete',
            status: 'Active',
            badges: [],
            history: []
        };
        setUsers([...users, newAthlete]);
        showToast('Athlete registered successfully!');
        setIsAthleteModalOpen(false);
    };

    const handleSaveEvent = (eventData) => {
        if (eventData.id) {
            setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } : e));
            showToast('Event updated successfully!');
        } else {
            const newEvent = { ...eventData, id: Math.max(0, ...events.map(e => e.id)) + 1, participants: eventData.participants || [] };
            setEvents([...events, newEvent]);
            showToast('Event created successfully!');
        }
        setIsEventModalOpen(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(events.filter(e => e.id !== eventId));
        setDeleteConfirmation(null);
        showToast('Event deleted successfully.', 'danger');
        setPage({ name: 'events' }); // Navigate away from the deleted event
    };

    const handleSaveTask = (taskData) => {
        if (taskData.id) {
            setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
            showToast('Task updated successfully!');
        } else {
            const newTask = { ...taskData, id: `t${Date.now()}`, completed: false };
            setTasks([...tasks, newTask]);
            showToast('Task added successfully!');
        }
        setIsTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        setDeleteConfirmation(null);
        showToast('Task deleted successfully.', 'danger');
    };

    const handleToggleTask = (taskId) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };

    const handleAttendanceChange = (sessionId, athleteId, status) => {
        setTrainingSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        attendance: {
                            ...session.attendance,
                            [athleteId]: status,
                        },
                    }
                    : session
            )
        );
    };

    const handleMakePayment = (userId, method) => {
        showToast(`Processing ${method} payment...`, 'info');
        setTimeout(() => {
            setPayments(prevPayments =>
                prevPayments.map(p =>
                    p.userId === userId && p.status === 'Overdue'
                        ? { ...p, status: 'Paid', date: new Date().toISOString().split('T')[0] }
                        : p
                )
            );
            showToast(`${method} payment successful! Your balance is cleared.`, 'success');
        }, 2000); // Simulate network delay
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            setPage({ name: 'search', query: searchTerm });
        }
    };
    
    // --- Event Handlers for UI ---
    useOnClickOutside(notificationPanelRef, () => setNotificationPanelOpen(false));
    useOnClickOutside(roleSwitcherRef, () => setRoleSwitcherOpen(false));

    const navigate = (pageName, params = {}) => {
        setPage({ name: pageName, params });
        setIsSidebarOpen(false);
        window.scrollTo(0, 0);
    };

    const switchRole = (role) => {
        const firstUserOfRole = users.find(u => u.role === role);
        if (firstUserOfRole) {
            setCurrentUser(firstUserOfRole);
            setRoleSwitcherOpen(false);
            setPage({ name: 'dashboard' }); // Go to dashboard on role switch
            showToast(`Switched to ${role} view`, 'info');
        } else {
            showToast(`No user found with role: ${role}`, 'warning');
        }
    };

    const onLogin = (user) => {
        setCurrentUser(user);
        setPage({ name: 'dashboard' });
    };

    const onLogout = () => {
        setPage({ name: 'login' });
    };

    // --- Render Logic ---
    if (page.name === 'login') {
        return <LoginPage onLogin={onLogin} users={users} />;
    }

    // Main dashboard layout
    return (
        <div className="dashboard-layout">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={page.name}
                navigate={navigate}
                onLogout={onLogout}
                currentUser={currentUser}
            />
            <div className="main-content">
                <MainHeader
                    onMenuClick={() => setIsSidebarOpen(true)}
                    page={page}
                    currentUser={currentUser}
                    onRoleChange={switchRole}
                    unreadNotificationCount={unreadNotificationCount}
                    onNotificationClick={() => setNotificationPanelOpen(!isNotificationPanelOpen)}
                    isNotificationPanelOpen={isNotificationPanelOpen}
                    notificationPanelRef={notificationPanelRef}
                    notifications={notifications.filter(n => n.userId === currentUser.id)}
                    setNotifications={setNotifications}
                    navigate={navigate}
                    isRoleSwitcherOpen={isRoleSwitcherOpen}
                    onRoleSwitcherClick={() => setRoleSwitcherOpen(!isRoleSwitcherOpen)}
                    roleSwitcherRef={roleSwitcherRef}
                    handleSearch={handleSearch}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <PageContent
                    page={page}
                    navigate={navigate}
                    currentUser={currentUser}
                    users={users}
                    athletes={athletes}
                    coaches={coaches}
                    parents={parents}
                    trainingSessions={trainingSessions}
                    events={events}
                    payments={payments}
                    tasks={tasks}
                    conversations={conversations}
                    setUsers={setUsers}
                    setTrainingSessions={setTrainingSessions}
                    setEvents={setEvents}
                    setPayments={setPayments}
                    setTasks={setTasks}
                    setConversations={setConversations}
                    onEditUser={user => { setEditingUser(user); setIsUserModalOpen(true); }}
                    onDeleteUser={user => setDeleteConfirmation({ type: 'user', data: user, onConfirm: () => handleDeleteUser(user.id) })}
                    onEditEvent={event => { setEditingEvent(event); setIsEventModalOpen(true); }}
                    onDeleteEvent={event => setDeleteConfirmation({ type: 'event', data: event, onConfirm: () => handleDeleteEvent(event.id) })}
                    onEditTask={task => { setEditingTask(task); setIsTaskModalOpen(true); }}
                    onDeleteTask={task => setDeleteConfirmation({ type: 'task', data: task, onConfirm: () => handleDeleteTask(task.id) })}
                    onToggleTask={handleToggleTask}
                    onAddUserClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                    onAddEventClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }}
                    onAddTaskClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                    onAddAthleteClick={() => setIsAthleteModalOpen(true)}
                    handleAttendanceChange={handleAttendanceChange}
                    handleMakePayment={handleMakePayment}
                    showToast={showToast}
                />
            </div>
            <MobileBottomNav currentPage={page.name} navigate={navigate} currentUser={currentUser} />

            {toast && <ToastNotification message={toast.message} type={toast.type} />}
            {isUserModalOpen && <UserFormModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }} onSave={handleSaveUser} user={editingUser} coaches={coaches} parents={parents} />}
            {isEventModalOpen && <EventFormModal isOpen={isEventModalOpen} onClose={() => { setIsEventModalOpen(false); setEditingEvent(null); }} onSave={handleSaveEvent} event={editingEvent} athletes={athletes} />}
            {isTaskModalOpen && <TaskFormModal isOpen={isTaskModalOpen} onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }} onSave={handleSaveTask} task={editingTask} users={users} />}
            {isAthleteModalOpen && <AthleteFormModal isOpen={isAthleteModalOpen} onClose={() => setIsAthleteModalOpen(false)} onSave={handleSaveAthlete} coaches={coaches} parents={parents} />}
            {deleteConfirmation && <ConfirmDeleteModal isOpen={!!deleteConfirmation} onClose={() => setDeleteConfirmation(null)} onConfirm={deleteConfirmation.onConfirm} itemType={deleteConfirmation.type} itemName={deleteConfirmation.data.name || deleteConfirmation.data.title} />}
        </div>
    );
};


// --- Components ---

const LoginPage = ({ onLogin, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // This is a mock authentication. In a real app, you'd verify credentials against a backend.
        const foundUser = users.find(u => u.name.toLowerCase().replace(' ', '.') + '@club.com' === email.toLowerCase());
        if (foundUser && password === 'password') { // Using a generic password for all users
            setError('');
            onLogin(foundUser);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <header className="login-header">
                    <div className="logo"><SkatingIcon /></div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your Funpot Skating Club account.</p>
                </header>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="e.g., sarah.wanjiku@club.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Default: password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember"/>
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign In</button>
                    <p className="form-toggle">
                        Don't have an account? <a href="#">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

const navConfig = {
    admin: [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { name: 'users', icon: <UsersIcon />, label: 'Manage Users' },
        { name: 'events', icon: <CalendarIcon />, label: 'Events' },
        { name: 'payments', icon: <WalletIcon />, label: 'Payments' },
        { name: 'messages', icon: <MessageIcon />, label: 'Messages' },
        { name: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
    manager: [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { name: 'athletes', icon: <UsersIcon />, label: 'Athletes' },
        { name: 'schedule', icon: <CalendarIcon />, label: 'Schedule' },
        { name: 'events', icon: <CalendarIcon />, label: 'Events' },
        { name: 'payments', icon: <WalletIcon />, label: 'Payments' },
        { name: 'messages', icon: <MessageIcon />, label: 'Messages' },
        { name: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
    coach: [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { name: 'athletes', icon: <UsersIcon />, label: 'My Athletes' },
        { name: 'schedule', icon: <CalendarIcon />, label: 'Schedule' },
        { name: 'attendance', icon: <CheckBadgeIcon />, label: 'Attendance' },
        { name: 'materials', icon: <ArrowUpOnSquareIcon />, label: 'Materials' },
        { name: 'messages', icon: <MessageIcon />, label: 'Messages' },
        { name: 'profile', icon: <UserCircleIcon />, label: 'My Profile'},
        { name: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
    athlete: [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { name: 'schedule', icon: <CalendarIcon />, label: 'My Schedule' },
        { name: 'events', icon: <CalendarIcon />, label: 'Events' },
        { name: 'progress', icon: <ChartIcon />, label: 'My Progress' },
        { name: 'payments', icon: <WalletIcon />, label: 'Payments' },
        { name: 'messages', icon: <MessageIcon />, label: 'Messages' },
        { name: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
    parent: [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { name: 'children', icon: <UsersIcon />, label: 'My Children' },
        { name: 'events', icon: <CalendarIcon />, label: 'Events' },
        { name: 'payments', icon: <WalletIcon />, label: 'Payments' },
        { name: 'messages', icon: <MessageIcon />, label: 'Messages' },
        { name: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
};

const Sidebar = ({ isOpen, onClose, currentPage, navigate, onLogout, currentUser }) => {
    const navItems = navConfig[currentUser.role.toLowerCase()];

    return (
        <>
            <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo"><SkatingIcon /></div>
                    <h2>Funpot Club</h2>
                    <button className="close-sidebar-btn" onClick={onClose} aria-label="Close sidebar"><CloseIcon /></button>
                </div>
                <nav className="nav-menu">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name}>
                                <a href="#" onClick={() => navigate(item.name)} className={`nav-item ${currentPage === item.name ? 'active' : ''}`}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="sidebar-footer">
                     <a href="#" onClick={onLogout} className="nav-item">
                        <LogoutIcon />
                        <span>Logout</span>
                    </a>
                </div>
            </div>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
        </>
    );
};

const MobileBottomNav = ({ currentPage, navigate, currentUser }) => {
    const navItems = navConfig[currentUser.role.toLowerCase()];
    // Select up to 5 main items for the bottom nav
    const mobileNavItems = navItems.slice(0, 5);

    return (
        <nav className="mobile-bottom-nav">
            {mobileNavItems.map(item => (
                 <a href="#" key={item.name} onClick={() => navigate(item.name)} className={`mobile-nav-item ${currentPage === item.name ? 'active' : ''}`}>
                    {item.icon}
                    <span>{item.label.split(' ')[0]}</span>
                </a>
            ))}
        </nav>
    );
}

const MainHeader = ({ onMenuClick, page, currentUser, onRoleChange, unreadNotificationCount, onNotificationClick, isNotificationPanelOpen, notificationPanelRef, notifications, setNotifications, navigate, isRoleSwitcherOpen, onRoleSwitcherClick, roleSwitcherRef, handleSearch, searchTerm, setSearchTerm }) => {
    const pageName = page.name;
    const query = page.query || page.params?.query;

    const pageTitle = pageName === 'search' && query
        ? 'Search Results'
        : pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/([A-Z])/g, ' $1').trim();

    const subTitle = pageName === 'search' && query
        ? `Results for "${query}"`
        : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    return (
        <header className="main-header">
            <div className="header-left">
                <button className="hamburger-menu" onClick={onMenuClick} aria-label="Open menu"><MenuIcon /></button>
                <div>
                    <h1>{pageTitle}</h1>
                    <p className="current-date">{subTitle}</p>
                </div>
            </div>
            <div className="header-right">
                <form className="search-bar" onSubmit={handleSearch}>
                    <SearchIcon />
                    <input type="search" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </form>
                <div className="header-actions">
                    <div className="role-switcher-custom" ref={roleSwitcherRef}>
                        <button className="role-switcher-trigger" onClick={onRoleSwitcherClick}>
                             <span className="role-icon">{ROLES[currentUser.role]}</span>
                            <span>{currentUser.role}</span>
                            <ChevronDownIcon />
                        </button>
                        {isRoleSwitcherOpen && (
                            <div className="role-switcher-menu">
                                <ul>
                                    {Object.entries(ROLES).map(([role, icon]) => (
                                        <li key={role} onClick={() => onRoleChange(role)}>
                                            {icon}
                                            <span>{role}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button className="action-btn" onClick={onNotificationClick} aria-label="View notifications">
                        <BellIcon />
                        {unreadNotificationCount > 0 && <span className="notification-badge">{unreadNotificationCount}</span>}
                    </button>
                    {isNotificationPanelOpen && <NotificationPanel panelRef={notificationPanelRef} notifications={notifications} setNotifications={setNotifications} navigate={navigate} />}

                    <div className="header-user-profile">
                        <div className="avatar">{currentUser.name.charAt(0)}</div>
                        <div>
                            <p style={{fontWeight: 500}}>{currentUser.name}</p>
                            <p style={{fontSize: 12, color: 'var(--text-secondary)'}}>{currentUser.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const NotificationPanel = ({ panelRef, notifications, setNotifications, navigate }) => {
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
    };

    const handleNotificationClick = (notification) => {
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
        if(notification.page) {
            navigate(notification.page);
        }
    }

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="notification-panel" ref={panelRef}>
            <div className="notification-panel-header">
                <h3>Notifications</h3>
                <button className="link-button" onClick={markAllAsRead}>Mark all as read</button>
            </div>
            <div className="notification-list">
                {sortedNotifications.length > 0 ? sortedNotifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`} onClick={() => handleNotificationClick(n)}>
                         <div className={`notification-icon ${n.type}`}>
                            {n.type === 'payment' ? <WalletIcon /> : <CalendarIcon />}
                        </div>
                        <div className="notification-content">
                            <p>{n.message}</p>
                            <small>{new Date(n.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                )) : (
                    <div style={{padding: '20px', textAlign: 'center', color: 'var(--text-secondary)'}}>No new notifications.</div>
                )}
            </div>
        </div>
    );
}

const PageContent = (props) => {
    switch (props.page.name) {
        case 'dashboard': return <DashboardPage {...props} />;
        case 'users': return <ManageUsersPage {...props} />;
        case 'athletes': case 'children': return <AthletesPage {...props} />;
        case 'athleteProfile': return <AthleteProfilePage {...props} />;
        case 'events': return <EventsPage {...props} />;
        case 'eventDetails': return <EventDetailsPage {...props} />;
        case 'payments': return <PaymentsPage {...props} />;
        case 'schedule': return <SchedulePage {...props} />;
        case 'progress': return <ProgressPage {...props} />;
        case 'messages': return <MessagesPage {...props} />;
        case 'settings': return <SettingsPage {...props} />;
        case 'search': return <SearchResultsPage {...props} />;
        case 'tasks': return <TasksPage {...props} />;
        case 'attendance': return <AttendancePage {...props} />;
        case 'materials': return <TrainingMaterialsPage {...props} />;
        case 'profile': return <CoachProfilePage {...props} />;
        default: return <div className="card"><h2>Page not found</h2></div>;
    }
};

// --- Page Components ---

const DashboardPage = ({ currentUser, users, events, payments, navigate }) => {
    const upcomingEvent = useMemo(() => {
        const today = new Date();
        return events
            .filter(e => new Date(e.date) >= today)
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    }, [events]);

    const renderBanner = () => {
        if (currentUser.role === 'Parent') {
            const parentUser = users.find(u => u.id === currentUser.id);
            const overduePayments = payments.filter(p => p.userId === parentUser?.id && p.status === 'Overdue');
            if (overduePayments.length > 0) {
                return (
                    <div className="upcoming-event-banner" onClick={() => navigate('payments')}>
                        <ExclamationCircleIcon />
                        <div className="banner-content">
                            <h4>Action Required: Overdue Payment</h4>
                            <p>You have an outstanding balance of KES {overduePayments.reduce((sum, p) => sum + p.amount, 0)}. Please settle it soon.</p>
                        </div>
                        <div className="banner-action">View Payments</div>
                    </div>
                );
            }
        }

        if (upcomingEvent) {
            return (
                <div className="upcoming-event-banner" onClick={() => navigate('eventDetails', { eventId: upcomingEvent.id })}>
                    <CalendarIcon />
                    <div className="banner-content">
                        <h4>Upcoming Event: {upcomingEvent.title}</h4>
                        <p>Get ready! Your next big event is on {new Date(upcomingEvent.date).toLocaleDateString()}.</p>
                    </div>
                    <div className="banner-action">View Details</div>
                </div>
            );
        }

        return (
            <div className="upcoming-event-banner info">
                <InformationCircleIcon />
                <div className="banner-content">
                    <h4>Welcome, {currentUser.name.split(' ')[0]}!</h4>
                    <p>No upcoming events right now. Check back soon for updates!</p>
                </div>
            </div>
        );
    };

    const renderRoleSpecificDashboard = () => {
        switch(currentUser.role) {
            case 'Admin': return <AdminDashboard users={users} events={events} payments={payments} />;
            case 'Manager': return <ManagerDashboard users={users} events={events} payments={payments} />;
            case 'Coach': return <CoachDashboard currentUser={currentUser} users={users} navigate={navigate} />;
            case 'Athlete': return <AthleteDashboard currentUser={currentUser} events={events} />;
            case 'Parent': return <ParentDashboard currentUser={currentUser} users={users} payments={payments} />;
            default: return null;
        }
    };

    return (
        <div className={`page-container dashboard-${currentUser.role.toLowerCase()}`}>
            {renderBanner()}
            {renderRoleSpecificDashboard()}
        </div>
    );
};

// Role-specific dashboard components
const AdminDashboard = ({ users, events, payments }) => (
    <>
        <div className="stats-grid">
            <div className="card stat-card-lg"><h3>{users.length}</h3><p>Total Users</p></div>
            <div className="card stat-card-lg"><h3>{users.filter(u => u.role === 'Athlete').length}</h3><p>Athletes</p></div>
            <div className="card stat-card-lg"><h3>{events.length}</h3><p>Events</p></div>
            <div className="card stat-card-lg"><h3>KES {payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0)}</h3><p>Revenue</p></div>
        </div>
        <div className="dashboard-grid">
            <div className="card grid-col-span-2">
                <div className="card-header">
                    <h3>Recent Transactions</h3>
                    <a href="#" className="view-all">View All</a>
                </div>
                <div className="transaction-list">
                    {payments.slice(0, 3).map(p => <TransactionItem key={p.id} transaction={p} users={users} />)}
                </div>
            </div>
        </div>
    </>
);

const ManagerDashboard = ({ users, events, payments }) => (
    <>
        <div className="stats-grid">
            <div className="card stat-card-lg"><h3>{users.filter(u => u.role === 'Athlete').length}</h3><p>Total Athletes</p></div>
            <div className="card stat-card-lg"><h3>{users.filter(u => u.role === 'Coach').length}</h3><p>Coaches</p></div>
            <div className="card stat-card-lg"><h3>{events.length}</h3><p>Total Events</p></div>
            <div className="card stat-card-lg"><h3>KES {payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0)}</h3><p>Total Revenue</p></div>
        </div>
        <div className="card">
            <div className="card-header">
                <h3>Team Overview</h3>
            </div>
            <p>Welcome, Manager. You can oversee athlete progress, manage event schedules, and review financial reports.</p>
        </div>
    </>
);

const CoachDashboard = ({ currentUser, users, navigate }) => {
    const myAthletes = users.filter(u => u.role === 'Athlete' && u.coachId === currentUser.id);
    return (
        <>
            <div className="stats-grid">
                <div className="card stat-card-lg"><h3>{myAthletes.length}</h3><p>My Athletes</p></div>
                <div className="card stat-card-lg"><h3>3</h3><p>Upcoming Sessions</p></div>
            </div>
            <div className="card athlete-list-widget">
                <div className="card-header"><h3>My Athletes</h3><a href="#" className="view-all" onClick={() => navigate('athletes')}>View All</a></div>
                {myAthletes.map(athlete => (
                    <div key={athlete.id} className="athlete-list-item" onClick={() => navigate('athleteProfile', { athleteId: athlete.id })}>
                        <p>{athlete.name}</p>
                        <Pill text={athlete.skillLevel} type={athlete.skillLevel.toLowerCase()} />
                    </div>
                ))}
            </div>
        </>
    );
};
const AthleteDashboard = ({ currentUser, events }) => {
    const myEvents = events.filter(e => e.participants.includes(currentUser.id));
    return (
        <div className="dashboard-grid">
            <div className="card">
                <h3>My Next Session</h3>
                <p>Morning Skate: Tomorrow at 9:00 AM</p>
            </div>
             <div className="card">
                <h3>My Registered Events</h3>
                <p>{myEvents.length} events coming up.</p>
            </div>
        </div>
    )
};
const ParentDashboard = ({ currentUser, users, payments }) => {
    const myChildren = users.filter(u => u.role === 'Athlete' && u.parentId === currentUser.id);
    const totalDue = payments.filter(p => p.userId === currentUser.id && p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);
    return (
        <div className="dashboard-grid">
             <div className={`card ${totalDue > 0 ? 'balance-due' : ''}`}>
                <h3>Account Balance</h3>
                <p>{totalDue > 0 ? `You have an outstanding balance of KES ${totalDue}` : 'All payments are up to date.'}</p>
            </div>
            <div className="card">
                <h3>My Children</h3>
                <ul>{myChildren.map(c => <li key={c.id}>{c.name} ({c.activity})</li>)}</ul>
            </div>
        </div>
    )
};

const ManageUsersPage = ({ users, onEditUser, onDeleteUser, onAddUserClick }) => {
    const [roleFilter, setRoleFilter] = useState('All');
    
    const filteredUsers = useMemo(() => {
        if (roleFilter === 'All') return users;
        return users.filter(u => u.role === roleFilter);
    }, [users, roleFilter]);

    return (
        <div className="page-container">
            <div className="page-controls">
                <div className="filters">
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="All">All Roles</option>
                        {Object.keys(ROLES).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                 <button className="btn btn-primary" onClick={onAddUserClick}><PlusIcon/> Add User</button>
            </div>
            <div className="card">
                <UserListTable users={filteredUsers} onEdit={onEditUser} onDelete={onDeleteUser} />
            </div>
        </div>
    );
};

const UserListTable = ({ users, onEdit, onDelete }) => {
    if (users.length === 0) return <EmptyState title="No Users Found" message="There are no users matching the current filters." />;
    
    return (
        <div className="list-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td data-label="Name">{user.name}</td>
                            <td data-label="Role"><Pill text={user.role} type={user.role.toLowerCase().replace('/', '')} /></td>
                            <td data-label="Status"><Pill text={user.status} type={user.status.toLowerCase()} /></td>
                            <td data-label="Actions">
                                <div className="action-buttons">
                                    <button className="action-btn-icon edit-btn" onClick={() => onEdit(user)} aria-label={`Edit ${user.name}`}><EditIcon /></button>
                                    <button className="action-btn-icon delete-btn" onClick={() => onDelete(user)} aria-label={`Delete ${user.name}`}><DeleteIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const AthletesPage = ({ currentUser, users, navigate, onAddAthleteClick }) => {
    let athletesToList = [];
    let pageTitle = "Athletes";
    
    if (currentUser.role === 'Coach') {
        athletesToList = users.filter(u => u.role === 'Athlete' && u.coachId === currentUser.id);
        pageTitle = "My Athletes";
    } else if (currentUser.role === 'Parent') {
        athletesToList = users.filter(u => u.role === 'Athlete' && u.parentId === currentUser.id);
        pageTitle = "My Children";
    } else { // Admin or Manager
        athletesToList = users.filter(u => u.role === 'Athlete');
    }

    const [filters, setFilters] = useState({ activity: 'All', skillLevel: 'All', ageGroup: 'All' });
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredAthletes = useMemo(() => {
        return athletesToList.filter(athlete => {
            return (filters.activity === 'All' || athlete.activity === filters.activity) &&
                   (filters.skillLevel === 'All' || athlete.skillLevel === filters.skillLevel) &&
                   (filters.ageGroup === 'All' || athlete.ageGroup === filters.ageGroup);
        });
    }, [athletesToList, filters]);

    const canAddAthlete = ['Admin', 'Coach', 'Manager'].includes(currentUser.role);
    
    return (
        <div className="page-container">
            <div className="page-controls">
                <div className="filters">
                    <select name="activity" value={filters.activity} onChange={handleFilterChange}>
                        <option value="All">All Activities</option>
                        {[...new Set(athletesToList.map(a => a.activity))].map(act => <option key={act} value={act}>{act}</option>)}
                    </select>
                    <select name="skillLevel" value={filters.skillLevel} onChange={handleFilterChange}>
                        <option value="All">All Skill Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                {canAddAthlete && (
                    <button className="btn btn-primary" onClick={onAddAthleteClick}>
                        <PlusIcon /> Add Athlete
                    </button>
                )}
            </div>
            <div className="card">
                {filteredAthletes.length === 0 ? (
                    <EmptyState title="No Athletes Found" message="Try adjusting your filters or adding a new athlete." />
                ) : (
                    <div className="list-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Activity</th>
                                    <th>Skill Level</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAthletes.map(athlete => (
                                    <tr key={athlete.id}>
                                        <td data-label="Name" data-clickable="true" onClick={() => navigate('athleteProfile', { athleteId: athlete.id })}>{athlete.name}</td>
                                        <td data-label="Activity">{athlete.activity}</td>
                                        <td data-label="Skill Level"><Pill text={athlete.skillLevel} type={athlete.skillLevel.toLowerCase()} /></td>
                                        <td data-label="Status"><Pill text={athlete.status} type={athlete.status.toLowerCase()} /></td>
                                        <td>
                                            <button className="action-btn-icon" onClick={() => navigate('athleteProfile', { athleteId: athlete.id })} aria-label={`View ${athlete.name}'s profile`}>
                                                <EyeIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};


const AthleteProfilePage = ({ page, users, navigate, showToast }) => {
    const { athleteId } = page.params;
    const athlete = users.find(u => u.id === athleteId);
    const coach = users.find(u => u.id === athlete?.coachId);
    const parent = users.find(u => u.id === athlete?.parentId);

    const [logEntry, setLogEntry] = useState({ date: '', description: '' });

    const handleLogChange = (e) => {
        const { name, value } = e.target;
        setLogEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLog = (e) => {
        e.preventDefault();
        // In a real app, this would update the user state
        console.log("Adding log:", logEntry);
        showToast("Log entry added!");
        setLogEntry({ date: '', description: '' });
    };

    if (!athlete) {
        return <div className="card"><p>Athlete not found.</p></div>;
    }
    
    const badges = [
        { key: 'first_competition', name: 'First Competition', icon: <TrophyIcon />, description: 'Participated in their first official competition.' },
        { key: 'distance_award', name: 'Distance Award', icon: <CheckCircleIcon />, description: 'Achieved a new personal best in a distance event.' },
    ];
    
    const athleteBadges = badges.filter(b => athlete.badges?.includes(b.key));

    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h3>{athlete.name}</h3>
                    <Pill text={athlete.status} type={athlete.status.toLowerCase()} />
                </div>
                <div className="profile-details">
                    <p><strong>Activity:</strong> {athlete.activity}</p>
                    <p><strong>Skill Level:</strong> {athlete.skillLevel}</p>
                    <p><strong>Age Group:</strong> {athlete.ageGroup}</p>
                    {coach && <p><strong>Coach:</strong> {coach.name}</p>}
                    {parent && (
                        <>
                            <p><strong>Parent/Guardian:</strong> {parent.name}</p>
                            {parent.contactDetails && (
                                <p><strong>Parent Contact:</strong> {parent.contactDetails.phone} | {parent.contactDetails.email}</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="card card-sensitive">
                <div className="card-header"><h3>Confidential Information</h3></div>
                {athlete.emergencyContact && (
                    <div className="profile-details">
                         <h4>Emergency Contact</h4>
                         <p><strong>Name:</strong> {athlete.emergencyContact.name}</p>
                         <p><strong>Relation:</strong> {athlete.emergencyContact.relation}</p>
                         <p><strong>Phone:</strong> {athlete.emergencyContact.phone}</p>
                    </div>
                )}
                 {athlete.medicalNotes && (
                    <div className="profile-details" style={{marginTop: '16px'}}>
                        <h4>Medical Notes</h4>
                        <p>{athlete.medicalNotes}</p>
                    </div>
                )}
                 {(!athlete.emergencyContact && !athlete.medicalNotes) && (
                    <p>No confidential information on file.</p>
                )}
            </div>

            <div className="card">
                <div className="card-header"><h3>Achievements</h3></div>
                {athleteBadges.length > 0 ? (
                    <div className="badge-list">
                        {athleteBadges.map(badge => (
                            <div key={badge.key} className="badge-item">
                                <div className="badge-icon">{badge.icon}</div>
                                <span className="badge-name">{badge.name}</span>
                                <div className="badge-tooltip">{badge.description}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No achievements earned yet. Keep up the hard work!</p>
                )}
            </div>
            
             <div className="card">
                <div className="card-header">
                    <h3>Performance History</h3>
                </div>
                
                <div className="chart-placeholder">
                    <p>Performance chart coming soon.</p>
                </div>

                <form className="add-log-form form-layout" onSubmit={handleAddLog}>
                    <h4>Add New Log Entry</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="logDate">Date</label>
                            <input type="date" id="logDate" name="date" value={logEntry.date} onChange={handleLogChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="logDescription">Description</label>
                            <input type="text" id="logDescription" name="description" value={logEntry.description} onChange={handleLogChange} placeholder="e.g., Mastered new technique" required />
                        </div>
                    </div>
                    <div className="form-actions">
                         <button type="submit" className="btn btn-primary">Add Log</button>
                    </div>
                </form>

                <div className="history-list">
                     {athlete.history?.length > 0 ? athlete.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
                         <div key={item.id} className="history-item">
                            <div>
                                <p>{item.description}</p>
                                <small style={{color: 'var(--text-secondary)'}}>{new Date(item.date).toLocaleDateString()}</small>
                            </div>
                             <button className="action-btn-icon delete-btn"><DeleteIcon /></button>
                         </div>
                     )) : <p>No history logged yet.</p>}
                </div>
            </div>
        </div>
    );
};

const EventsPage = ({ events, onAddEventClick, navigate, currentUser }) => {
    const [view, setView] = useState('list'); // 'list' or 'calendar'
    
    return (
        <div className="page-container">
            <div className="card">
                <div className="filters-and-actions">
                    <div className="view-switcher">
                         <button className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('list')}>List</button>
                         <button className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('calendar')}>Calendar</button>
                    </div>
                    {['Admin', 'Manager'].includes(currentUser.role) && (
                        <button className="btn btn-primary" onClick={onAddEventClick}>
                            <PlusIcon /> Add Event
                        </button>
                    )}
                </div>
            </div>
            {view === 'list' ? (
                 <EventListView events={events} navigate={navigate} />
            ) : (
                <EventCalendarView events={events} navigate={navigate} />
            )}
        </div>
    );
};

const EventListView = ({ events, navigate }) => {
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastEvents = events.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <div className="page-container">
                <h3 className="section-title">Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="events-grid">
                        {upcomingEvents.map(event => <EventCard key={event.id} event={event} navigate={navigate} />)}
                    </div>
                ) : <div className="card"><p>No upcoming events.</p></div>}
            </div>
            <div className="page-container">
                <h3 className="section-title">Past Events</h3>
                {pastEvents.length > 0 ? (
                     <div className="events-grid">
                        {pastEvents.map(event => <EventCard key={event.id} event={event} navigate={navigate} />)}
                    </div>
                ) : <div className="card"><p>No past events found.</p></div>}
            </div>
        </>
    );
};

const EventCalendarView = ({ events, navigate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    let date = new Date(startDate);
    while (days.length < 42) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    
    const eventsOnSelectedDate = events.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString());

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <div className="card">
            <div className="calendar-header">
                <button className="nav-btn" onClick={() => changeMonth(-1)}><ChevronLeftIcon/></button>
                <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button className="nav-btn" onClick={() => changeMonth(1)}><ChevronRightIcon/></button>
            </div>
            <div className="calendar-grid weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="weekday">{day}</div>)}
            </div>
            <div className="calendar-grid">
                {days.map(day => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    const eventsOnDay = events.filter(event => new Date(event.date).toDateString() === day.toDateString());
                    return (
                        <div
                            key={day.toISOString()}
                            className={`calendar-day ${!isCurrentMonth ? 'empty' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => isCurrentMonth && setSelectedDate(day)}
                        >
                            <span className="day-number">{day.getDate()}</span>
                            {eventsOnDay.length > 0 && <div className="event-dot"></div>}
                        </div>
                    );
                })}
            </div>
            <div className="selected-day-events">
                <h4>Events on {selectedDate.toLocaleDateString()}</h4>
                 {eventsOnSelectedDate.length > 0 ? (
                    eventsOnSelectedDate.map(event => (
                        <div key={event.id} className="event-card-small" onClick={() => navigate('eventDetails', { eventId: event.id })}>
                            <p className="event-name">{event.title}</p>
                        </div>
                    ))
                ) : <p>No events scheduled for this day.</p>}
            </div>
        </div>
    );
};

const EventCard = ({ event, navigate }) => (
    <div className="event-card" onClick={() => navigate('eventDetails', { eventId: event.id })}>
        <div className="event-card-header">
            <h4>{event.title}</h4>
            <Pill text={event.category} type={event.category.toLowerCase()} />
        </div>
        <div className="event-card-body">
            <p>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style={{ marginTop: 8 }}>{event.description.substring(0, 100)}...</p>
        </div>
    </div>
);

const EventDetailsPage = ({ page, events, users, currentUser, onEditEvent, onDeleteEvent }) => {
    const { eventId } = page.params;
    const event = events.find(e => e.id === Number(eventId));
    
    if (!event) return <div className="card">Event not found.</div>;

    const participants = users.filter(u => event.participants.includes(u.id));
    const isRegistered = event.participants.includes(currentUser.id);
    const canManage = ['Admin', 'Manager'].includes(currentUser.role);
    
    return (
        <div className="page-container">
            <div className="card event-details-page-card">
                 <div className="card-header">
                    <h3>{event.title}</h3>
                     {canManage && (
                        <div className="action-buttons">
                            <button className="action-btn-icon edit-btn" onClick={() => onEditEvent(event)}><EditIcon /></button>
                            <button className="action-btn-icon delete-btn" onClick={() => onDeleteEvent(event)}><DeleteIcon /></button>
                        </div>
                     )}
                </div>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Description:</strong> {event.description}</p>

                {currentUser.role === 'Athlete' && (
                    <div style={{marginTop: '16px'}}>
                        <button className="btn btn-primary" disabled={isRegistered}>
                            {isRegistered ? 'Registered' : 'Register Now'}
                        </button>
                    </div>
                )}
            </div>
             <div className="card">
                <h3>Participants ({participants.length})</h3>
                {participants.length > 0 ? (
                    <ul>
                        {participants.map(p => <li key={p.id}>{p.name}</li>)}
                    </ul>
                ) : <p>No participants registered yet.</p>}
            </div>
        </div>
    );
};

const PaymentsPage = ({ payments, users, currentUser, handleMakePayment }) => {
    let userPayments = [];
    if (currentUser.role === 'Admin' || currentUser.role === 'Manager') {
        userPayments = payments;
    } else if (currentUser.role === 'Parent') {
        userPayments = payments.filter(p => p.userId === currentUser.id);
    } else if (currentUser.role === 'Athlete') {
        const parent = users.find(u => u.id === currentUser.parentId);
        userPayments = parent ? payments.filter(p => p.userId === parent.id) : [];
    }
    
    const totalPaid = userPayments.filter(p=>p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
    const totalDue = userPayments.filter(p=>p.status === 'Overdue').reduce((acc, p) => acc + p.amount, 0);

    return (
         <div className="page-container">
            <div className="stats-grid">
                <div className="card"><h4>KES {totalPaid}</h4><p>Total Paid</p></div>
                <div className="card"><h4>KES {totalDue}</h4><p>Total Due</p></div>
            </div>
            {currentUser.role === 'Parent' && totalDue > 0 && (
                 <div className="card">
                     <div className="card-header">
                        <h3>Make a Payment</h3>
                     </div>
                     <p>Select your preferred payment method to clear your outstanding balance of KES {totalDue}.</p>
                     <div className="payment-options">
                        <button className="btn btn-payment mpesa" onClick={() => handleMakePayment(currentUser.id, 'M-Pesa')}>Pay with M-Pesa</button>
                        <button className="btn btn-payment card" onClick={() => handleMakePayment(currentUser.id, 'Card')}>Pay with Card</button>
                        <button className="btn btn-payment paypal" onClick={() => handleMakePayment(currentUser.id, 'PayPal')}>Pay with PayPal</button>
                     </div>
                 </div>
            )}
            <div className="card">
                 <div className="card-header">
                    <h3>Transaction History</h3>
                 </div>
                 <div className="transaction-list">
                    {userPayments.length > 0 ? userPayments.map(p => <TransactionItem key={p.id} transaction={p} users={users} />) : <p>No transactions found.</p>}
                </div>
            </div>
         </div>
    );
};

const TransactionItem = ({ transaction, users }) => {
    const user = users.find(u => u.id === transaction.userId);
    return (
        <div className="transaction-item">
            <div className="transaction-details">
                <h4>{transaction.description}</h4>
                <p>Paid by: {user ? user.name : 'Unknown'} on {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className="transaction-amount">
                <h4 style={{ color: transaction.status === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                    KES {transaction.amount}
                </h4>
                <Pill text={transaction.status} type={transaction.status.toLowerCase()} />
            </div>
        </div>
    );
};


const SchedulePage = () => <div className="card"><h2>Schedule Page</h2><p>Feature coming soon.</p></div>;
const ProgressPage = () => <div className="card"><h2>Progress Page</h2><p>Feature coming soon.</p></div>;

const MessagesPage = ({ conversations, currentUser, users }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);

    const myConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));
    const activeConversation = myConversations.find(c => c.id === activeConversationId);

    return (
        <div className="page-container messages-page">
            <div className="card">
                <div className="messages-layout">
                    <div className="conversations-list">
                        <div className="conversations-header"><h3>Conversations</h3></div>
                        <div className="conversation-items">
                            {myConversations.sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()).map(conv => {
                                const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
                                const otherParticipant = users.find(u => u.id === otherParticipantId);
                                const lastMessage = conv.messages[conv.messages.length - 1];
                                const unreadCount = conv.unreadCount[currentUser.id] || 0;

                                return (
                                    <div key={conv.id} className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`} onClick={() => setActiveConversationId(conv.id)}>
                                        <div className="conversation-avatar">{otherParticipant ? otherParticipant.name.charAt(0) : '?'}</div>
                                        <div className="conversation-details">
                                            <p className="conversation-sender">{otherParticipant ? otherParticipant.name : 'Unknown User'}</p>
                                            <p className="conversation-preview">{lastMessage.text}</p>
                                        </div>
                                        <div className="conversation-meta">
                                            <p className="conversation-timestamp">{new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {activeConversation ? (
                        <ChatWindow conversation={activeConversation} currentUser={currentUser} users={users} />
                    ) : (
                        <div className="no-chat-selected">
                            <MessageIcon />
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ conversation, currentUser, users }) => {
    const chatBodyRef = useRef(null);
    const otherParticipant = users.find(u => u.id === conversation.participantIds.find(id => id !== currentUser.id));

    useEffect(() => {
        if(chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [conversation]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                {otherParticipant ? otherParticipant.name : 'Chat'}
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                {conversation.messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
                        <p>{msg.text}</p>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <form>
                    <input type="text" placeholder="Type a message..." />
                    <button type="submit" className="btn btn-primary"><PaperAirplaneIcon /></button>
                </form>
            </div>
        </div>
    );
}

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notificationTiming: 'immediate',
    });

    const handleToggle = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleTimingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings(prev => ({...prev, notificationTiming: e.target.value}));
    };

    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header"><h3>Notification Settings</h3></div>
                 <div className="settings-list">
                     <div className="settings-item">
                         <div>
                            <h4>Email Notifications</h4>
                            <p>Receive updates and reminders via your registered email address.</p>
                         </div>
                         <label className="toggle-switch">
                            <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleToggle} />
                            <span className="slider"></span>
                         </label>
                     </div>
                     <div className="settings-item">
                         <div>
                            <h4>SMS Notifications</h4>
                            <p>Get critical alerts sent directly to your mobile phone.</p>
                         </div>
                         <label className="toggle-switch">
                            <input type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleToggle} />
                            <span className="slider"></span>
                         </label>
                     </div>
                      <div className="settings-item">
                         <div>
                            <h4>Push Notifications</h4>
                            <p>Enable in-app push notifications for real-time updates.</p>
                         </div>
                         <label className="toggle-switch">
                            <input type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleToggle} />
                            <span className="slider"></span>
                         </label>
                     </div>
                     <div className="settings-item">
                         <div>
                            <h4>Notification Digest</h4>
                            <p>Choose how often you receive summary notifications.</p>
                         </div>
                        <select value={settings.notificationTiming} onChange={handleTimingChange}>
                            <option value="immediate">Immediate</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                        </select>
                     </div>
                 </div>
            </div>
        </div>
    );
};

const SearchResultsPage = ({ page, users, events, navigate, currentUser, onEditUser }) => {
    const query = page.query || page.params?.query || '';
    const lowercasedQuery = query.toLowerCase();

    const userResults = query ? users.filter(u =>
        u.name.toLowerCase().includes(lowercasedQuery) ||
        u.role.toLowerCase().includes(lowercasedQuery) ||
        (u.activity && u.activity.toLowerCase().includes(lowercasedQuery))
    ) : [];

    const eventResults = query ? events.filter(e =>
        e.title.toLowerCase().includes(lowercasedQuery) ||
        e.description.toLowerCase().includes(lowercasedQuery) ||
        e.category.toLowerCase().includes(lowercasedQuery)
    ) : [];

    const handleViewUser = (user) => {
        if (user.role === 'Athlete') {
            navigate('athleteProfile', { athleteId: user.id });
        } else if (user.role === 'Coach' && user.id === currentUser.id) {
            navigate('profile');
        } else if (currentUser.role === 'Admin' || currentUser.role === 'Manager') {
            onEditUser(user);
        }
    };

    const getUserActionInfo = (user) => {
        if (user.role === 'Athlete') {
            return { visible: true, text: 'View Profile' };
        }
        if (user.role === 'Coach' && user.id === currentUser.id) {
            return { visible: true, text: 'View Profile' };
        }
        if (currentUser.role === 'Admin' || currentUser.role === 'Manager') {
            return { visible: true, text: 'Edit User' };
        }
        return { visible: false, text: '' };
    };

    return (
        <div className="page-container">
            
            {userResults.length > 0 && (
                <div className="card">
                    <div className="card-header"><h4>Users</h4></div>
                    <div className="search-results-list">
                    {userResults.map(user => {
                        const actionInfo = getUserActionInfo(user);
                        return (
                            <div key={user.id} className="search-result-card">
                                <div className="result-icon">{ROLES[user.role]}</div>
                                <div className="result-details">
                                    <h4>{user.name}</h4>
                                    <p>{user.role}</p>
                                </div>
                                <div className="result-actions">
                                    {actionInfo.visible && (
                                        <button className="btn btn-secondary" onClick={() => handleViewUser(user)}>{actionInfo.text}</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}
            
            {eventResults.length > 0 && (
                 <div className="card">
                    <div className="card-header"><h4>Events</h4></div>
                     <div className="search-results-list">
                        {eventResults.map(event => (
                            <div key={event.id} className="search-result-card">
                                <div className="result-icon"><CalendarIcon /></div>
                                <div className="result-details">
                                    <h4>{event.title}</h4>
                                    <p>{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div className="result-actions">
                                     <button className="btn btn-secondary" onClick={() => navigate('eventDetails', { eventId: event.id })}>View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {userResults.length === 0 && eventResults.length === 0 && (
                <EmptyState title="No Results Found" message={`Your search for "${query}" did not return any results.`} />
            )}
        </div>
    );
};

const TasksPage = ({ tasks, users, currentUser, onAddTaskClick, onEditTask, onDeleteTask, onToggleTask }) => {
    const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);

    return (
        <div className="page-container">
             <div className="page-controls">
                <div className="filters"></div>
                <button className="btn btn-primary" onClick={onAddTaskClick}><PlusIcon/> Add Task</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <h3>My Tasks</h3>
                </div>
                {myTasks.length > 0 ? (
                    <div className="task-list">
                        {myTasks.map(task => {
                             const assignedByUser = users.find(u => u.id === task.assignedBy) || { name: 'System' };
                             return (
                                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                    <div className="task-main">
                                        <input type="checkbox" className="task-checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
                                        <div>
                                            <p className="task-title">{task.title}</p>
                                            <p className="task-meta">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="action-btn-icon edit-btn" onClick={() => onEditTask(task)}><EditIcon /></button>
                                        <button className="action-btn-icon delete-btn" onClick={() => onDeleteTask(task)}><DeleteIcon /></button>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                ) : (
                    <EmptyState title="No tasks assigned" message="You're all caught up!" />
                )}
            </div>
        </div>
    );
}

const AttendancePage = ({ trainingSessions, users, currentUser, handleAttendanceChange }) => {
    const mySessions = trainingSessions.filter(s => s.coachId === currentUser.id);
    const [selectedSessionId, setSelectedSessionId] = useState(mySessions[0]?.id || null);

    const selectedSession = mySessions.find(s => s.id === selectedSessionId);
    const athletesInSession = users.filter(u => selectedSession?.athleteIds.includes(u.id));

    return (
        <div className="page-container attendance-layout">
            <div className="card session-list-card">
                <div className="card-header"><h3>Training Sessions</h3></div>
                {mySessions.map(session => (
                    <div key={session.id} 
                        className={`athlete-list-item ${session.id === selectedSessionId ? 'active' : ''}`}
                        onClick={() => setSelectedSessionId(session.id)}
                        style={{backgroundColor: session.id === selectedSessionId ? 'var(--primary-pink)' : 'transparent', borderRadius: '8px', padding: '10px'}}
                    >
                        <div>
                            <p>{session.title}</p>
                            <small>{new Date(session.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card attendance-sheet-card">
                 <div className="card-header"><h3>Attendance Sheet</h3></div>
                 {selectedSession ? (
                    <div className="attendance-list">
                        {athletesInSession.map(athlete => {
                             const attendanceStatus = selectedSession.attendance[athlete.id] || 'Unmarked';
                             return (
                                <div key={athlete.id} className="attendance-row">
                                    <p>{athlete.name}</p>
                                    <div className="attendance-actions">
                                        <button className={`btn-attendance present ${attendanceStatus === 'Present' ? 'active' : ''}`} onClick={() => handleAttendanceChange(selectedSession.id, athlete.id, 'Present')}>Present</button>
                                        <button className={`btn-attendance absent ${attendanceStatus === 'Absent' ? 'active' : ''}`} onClick={() => handleAttendanceChange(selectedSession.id, athlete.id, 'Absent')}>Absent</button>
                                        <button className={`btn-attendance late ${attendanceStatus === 'Late' ? 'active' : ''}`} onClick={() => handleAttendanceChange(selectedSession.id, athlete.id, 'Late')}>Late</button>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                 ) : (
                    <EmptyState title="No Session Selected" message="Please select a session from the list to view attendance." />
                 )}
            </div>
        </div>
    );
};

const TrainingMaterialsPage = () => {
    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h3>Training Materials</h3>
                    <button className="btn btn-primary"><ArrowUpOnSquareIcon /> Upload PDF</button>
                </div>
                <EmptyState
                    title="No Materials Uploaded"
                    message="Upload training documents, schedules, or guides for your athletes."
                />
            </div>
        </div>
    );
};

const CoachProfilePage = ({ currentUser, users }) => {
    const coachAthletes = users.filter(u => u.role === 'Athlete' && u.coachId === currentUser.id);

    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h3>{currentUser.name}'s Profile</h3>
                </div>
                <div className="profile-details">
                    <p><strong>Activity Specialization:</strong> {currentUser.activity}</p>
                    <p><strong>Bio:</strong> {currentUser.bio || 'Not provided.'}</p>
                    <p><strong>Areas of Expertise:</strong> {currentUser.expertise || 'Not specified.'}</p>
                    {currentUser.availability && <p><strong>Availability:</strong> {currentUser.availability}</p>}
                    {currentUser.certifications && currentUser.certifications.length > 0 && (
                        <div>
                             <p><strong>Certifications:</strong></p>
                             <ul className="certifications-list">
                                {currentUser.certifications.map((cert, index) => <li key={index}>{cert}</li>)}
                             </ul>
                        </div>
                    )}
                </div>
            </div>
             <div className="card">
                <div className="card-header">
                    <h3>Assigned Athletes ({coachAthletes.length})</h3>
                </div>
                <div className="list-table">
                     <table>
                        <thead><tr><th>Name</th><th>Skill Level</th></tr></thead>
                        <tbody>
                            {coachAthletes.map(athlete => (
                                <tr key={athlete.id}>
                                    <td data-label="Name">{athlete.name}</td>
                                    <td data-label="Skill Level"><Pill text={athlete.skillLevel} type={athlete.skillLevel.toLowerCase()} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Modals and Utility Components ---

const Pill = ({ text, type }) => <span className={`pill ${type}`}>{text}</span>;

const EmptyState = ({ title, message, children }: { title: string; message: string; children?: React.ReactNode }) => (
    <div className="empty-state">
        <div className="empty-state-icon"><EmptyIcon /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
    </div>
);

const ToastNotification = ({ message, type }) => {
    const icon = {
        success: <CheckCircleIcon />,
        danger: <ExclamationCircleIcon />,
        warning: <ExclamationCircleIcon />,
        info: <InformationCircleIcon />,
    }[type];

    return (
        <div className={`toast-notification ${type}`}>
            {icon}
            <span>{message}</span>
        </div>
    );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Confirm Deletion</h3>
                    <button className="close-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete the {itemType} "<strong>{itemName}</strong>"? This action cannot be undone.</p>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const FormModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="modal-body form-layout">
                    {children}
                </div>
            </div>
        </div>
    );
};

const UserFormModal = ({ isOpen, onClose, onSave, user, coaches, parents }) => {
    const [formData, setFormData] = useState({
        id: null, name: '', role: 'Athlete',
        // Athlete specific
        activity: 'Skating', skillLevel: 'Beginner', ageGroup: 'U10', coachId: '', parentId: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '', medicalNotes: '',
        // Coach specific
        certifications: '', availability: '',
        // Parent specific
        contactPhone: '', contactEmail: '',
    });

    useEffect(() => {
        const resetState = {
            id: null, name: '', role: 'Athlete', activity: 'Skating', skillLevel: 'Beginner', ageGroup: 'U10', 
            coachId: '', parentId: '', emergencyContactName: '', emergencyContactPhone: '', 
            emergencyContactRelation: '', medicalNotes: '', certifications: '', availability: '',
            contactPhone: '', contactEmail: '',
        };

        if (user) {
            setFormData({
                ...resetState,
                id: user.id || null, name: user.name || '', role: user.role || 'Athlete',
                activity: user.activity || 'Skating', skillLevel: user.skillLevel || 'Beginner',
                ageGroup: user.ageGroup || 'U10', coachId: user.coachId ? String(user.coachId) : '', parentId: user.parentId ? String(user.parentId) : '',
                emergencyContactName: user.emergencyContact?.name || '',
                emergencyContactPhone: user.emergencyContact?.phone || '',
                emergencyContactRelation: user.emergencyContact?.relation || '',
                medicalNotes: user.medicalNotes || '',
                certifications: user.certifications?.join(', ') || '',
                availability: user.availability || '',
                contactPhone: user.contactDetails?.phone || '',
                contactEmail: user.contactDetails?.email || '',
            });
        } else {
            setFormData(resetState);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const saveData: Partial<User> & { id: number | null; name: string; role: Role } = {
            id: formData.id, name: formData.name, role: formData.role as Role, 
        };

        if (formData.role === 'Athlete') {
            saveData.activity = formData.activity;
            saveData.skillLevel = formData.skillLevel as User['skillLevel'];
            saveData.ageGroup = formData.ageGroup;
            // Fix: Ensure coachId and parentId are converted to numbers before saving.
            saveData.coachId = formData.coachId ? Number(formData.coachId) : undefined;
            saveData.parentId = formData.parentId ? Number(formData.parentId) : undefined;
            if(formData.emergencyContactName) {
                saveData.emergencyContact = {
                    name: formData.emergencyContactName,
                    phone: formData.emergencyContactPhone,
                    relation: formData.emergencyContactRelation,
                };
            }
            saveData.medicalNotes = formData.medicalNotes;
        }

        if (formData.role === 'Coach') {
            saveData.certifications = formData.certifications.split(',').map(c => c.trim()).filter(Boolean);
            saveData.availability = formData.availability;
        }

        if (formData.role === 'Parent') {
            if (formData.contactPhone || formData.contactEmail) {
                saveData.contactDetails = {
                    phone: formData.contactPhone,
                    email: formData.contactEmail,
                };
            }
        }

        onSave(saveData);
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add User'}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        {Object.keys(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                {formData.role === 'Athlete' && (
                    <>
                        <div className="form-section-divider">Basic Info</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Activity</label>
                                <select name="activity" value={formData.activity} onChange={handleChange}>
                                    <option value="Skating">Skating</option>
                                    <option value="Swimming">Swimming</option>
                                    <option value="Gymnastics">Gymnastics</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Skill Level</label>
                                <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-grid">
                             <div className="form-group">
                                <label>Coach</label>
                                <select name="coachId" value={formData.coachId} onChange={handleChange}>
                                    <option value="">Assign a coach</option>
                                    {coaches.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Parent</label>
                                <select name="parentId" value={formData.parentId} onChange={handleChange}>
                                    <option value="">Assign a parent</option>
                                    {parents.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-section-divider">Confidential</div>
                         <div className="form-group">
                            <label>Emergency Contact Name</label>
                            <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
                        </div>
                         <div className="form-grid">
                             <div className="form-group">
                                <label>Emergency Contact Phone</label>
                                <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Relation</label>
                                <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Medical Notes</label>
                            <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="3"></textarea>
                        </div>
                    </>
                )}

                {formData.role === 'Coach' && (
                    <>
                        <div className="form-section-divider">Professional Info</div>
                        <div className="form-group">
                            <label>Certifications (comma-separated)</label>
                            <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Availability</label>
                            <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Mon-Fri, 9am - 5pm"/>
                        </div>
                    </>
                )}
                
                {formData.role === 'Parent' && (
                    <>
                        <div className="form-section-divider">Contact Info</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                            </div>
                        </div>
                    </>
                )}

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </FormModal>
    );
};

const AthleteFormModal = ({ isOpen, onClose, onSave, coaches, parents }) => {
    const [formData, setFormData] = useState({
        name: '', activity: 'Skating', skillLevel: 'Beginner', ageGroup: 'U10', coachId: '', parentId: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '', medicalNotes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { emergencyContactName, emergencyContactPhone, emergencyContactRelation, medicalNotes, parentId, coachId, ...rest } = formData;
        // Fix: Convert parentId and coachId from string to number.
        const athleteData = {
            ...rest,
            parentId: parentId ? Number(parentId) : undefined,
            coachId: coachId ? Number(coachId) : undefined,
            medicalNotes,
            emergencyContact: (emergencyContactName)
                ? { name: emergencyContactName, phone: emergencyContactPhone, relation: emergencyContactRelation }
                : undefined,
        };
        onSave(athleteData);
        // Reset form for next entry
        setFormData({ 
            name: '', activity: 'Skating', skillLevel: 'Beginner', ageGroup: 'U10', coachId: '', parentId: '',
            emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '', medicalNotes: '',
        });
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title="Register New Athlete">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="athleteName">Full Name</label>
                    <input type="text" id="athleteName" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                 <div className="form-grid">
                    <div className="form-group">
                        <label>Age Group</label>
                        <select name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
                            <option value="U10">Under 10</option>
                            <option value="10-14">10-14</option>
                            <option value="15-18">15-18</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label>Activity</label>
                        <select name="activity" value={formData.activity} onChange={handleChange}>
                            <option value="Skating">Skating</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Gymnastics">Gymnastics</option>
                        </select>
                    </div>
                 </div>
                <div className="form-group">
                    <label>Skill Level</label>
                    <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                 <div className="form-grid">
                     <div className="form-group">
                        <label>Coach</label>
                        <select name="coachId" value={formData.coachId} onChange={handleChange}>
                            <option value="">Assign a coach</option>
                            {coaches.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Parent</label>
                        <select name="parentId" value={formData.parentId} onChange={handleChange}>
                            <option value="">Assign a parent</option>
                            {parents.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-section-divider">Confidential (Optional)</div>
                 <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
                </div>
                 <div className="form-grid">
                     <div className="form-group">
                        <label>Emergency Contact Phone</label>
                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Relation</label>
                        <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Medical Notes</label>
                    <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Register Athlete</button>
                </div>
            </form>
        </FormModal>
    );
};

const EventFormModal = ({ isOpen, onClose, onSave, event, athletes }) => {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        date: '',
        description: '',
        category: 'Competition',
        participants: []
    });

    useEffect(() => {
        if (event) {
            setFormData({
                id: event.id || null,
                title: event.title || '',
                date: event.date || '',
                description: event.description || '',
                category: event.category || 'Competition',
                participants: event.participants || []
            });
        } else {
            setFormData({ id: null, title: '', date: '', description: '', category: 'Competition', participants: [] });
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData(prev => ({ ...prev, category: value as Event['category'] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleParticipantsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
        setFormData(prev => ({ ...prev, participants: selectedOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData });
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Create Event'}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Competition">Competition</option>
                            <option value="Training">Training</option>
                            <option value="Social">Social</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
                </div>
                 <div className="form-group">
                    <label>Participants</label>
                    <select multiple name="participants" value={formData.participants.map(String)} onChange={handleParticipantsChange}>
                        {athletes.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Event</button>
                </div>
            </form>
        </FormModal>
    );
};

const TaskFormModal = ({ isOpen, onClose, onSave, task, users }) => {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        assignedTo: '',
        dueDate: ''
    });
    
    useEffect(() => {
        if(task) {
            setFormData({
                id: task.id || null,
                title: task.title || '',
                assignedTo: task.assignedTo ? String(task.assignedTo) : '',
                dueDate: task.dueDate || ''
            });
        } else {
            setFormData({ id: null, title: '', assignedTo: '', dueDate: ''});
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Fix: Convert assignedTo from string to number before saving.
        onSave({ ...formData, assignedTo: Number(formData.assignedTo) });
    };

    const assignableUsers = users.filter(u => ['Admin', 'Coach', 'Manager'].includes(u.role));

    return (
        <FormModal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
             <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="taskTitle">Title</label>
                    <input type="text" id="taskTitle" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="assignedTo">Assign To</label>
                        <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
                            <option value="">Select a user</option>
                            {assignableUsers.map(u => <option key={u.id} value={String(u.id)}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Task</button>
                </div>
            </form>
        </FormModal>
    )
};


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
