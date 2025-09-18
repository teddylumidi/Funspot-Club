

import React, { useState, useEffect, useMemo, FC, useRef, useCallback } from 'react';

// --- TYPES ---
type Role = 'Admin' | 'Manager' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
type LocationType = 'Indoor' | 'Outdoor';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  dob: string;
  role: Role;
  parent_id?: string;
  coach_id?: string;
  bio?: string;
  phone?: string;
  address?: string;
  emergencyContact?: { name: string; phone: string };
  photo_url: string;
  created_at: string;
  skill_level?: SkillLevel;
}

interface Program {
  id: string;
  title: string;
  description: string;
  coach_id: string;
  price_cents: number;
  currency: string;
  duration_minutes: number;
  schedule: { day: string; time: string }[];
  skill_level: SkillLevel;
  capacity: number;
  enrolled_count: number;
  location_type: LocationType;
  active: boolean;
  waitlisted_users: string[];
}

interface Transaction {
  id: string;
  userId: string;
  programId: string;
  amount_cents: number;
  currency: string;
  method: 'Card' | 'Mpesa';
  status: 'Completed';
  created_at: string;
}

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

interface ClubEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
}

type ModalState = 
  | { type: 'NONE' }
  | { type: 'PROGRAM_DETAILS'; program: Program }
  | { type: 'PAYMENT'; program: Program }
  | { type: 'CONFIRMATION'; program: Program, transactionId: string }
  | { type: 'USER_FORM'; user?: User }
  | { type: 'DELETE_USER'; user: User }
  | { type: 'EVENT_DETAILS', date: Date, events: ClubEvent[] };


// --- SVG ICONS ---
const EyeIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532A1.012 1.012 0 0 1 7.5 4.5h9a1.012 1.012 0 0 1 .534.175l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532A1.012 1.012 0 0 1 16.5 19.5h-9a1.012 1.012 0 0 1-.534-.175L2.036 12.322Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
// Fix: Added `style` prop to PencilIcon to allow inline styling.
const PencilIcon: FC<{ className?: string, style?: React.CSSProperties }> = ({ className = "h-6 w-6", style }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const SunIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" /></svg>;
const MoonIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const SearchIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const UserPlusIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.75 20.25a7.5 7.5 0 0 1 15 0" /></svg>;
const XMarkIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const CheckCircleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ArrowLeftOnRectangleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const ExclamationTriangleIcon: FC<{ className?: string, style?: React.CSSProperties }> = ({ className = "h-6 w-6", style }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const CreditCardIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Z" /></svg>;
const DevicePhoneMobileIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const SkateIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M22.2,6.4C22.6,5.6,22,4.7,21.2,4.3C20.6,4,20,4,19.4,4.2l-3.5,1.1L12.5,2c-0.6-0.5-1.5-0.5-2.1,0L7.1,5.3L3.6,4.2 C2.7,4,1.8,4.5,1.5,5.4s0.5,1.8,1.4,2.1L6,8.2V13h2V9.8l3.4,2.1c0.5,0.3,1.1,0.5,1.7,0.5s1.2-0.2,1.7-0.5L18,9.8V13h2V8.2l3.1-0.7 C21.3,7.4,22,7,22.2,6.4z M10,14v6H8v-6H10z M16,14v6h-2v-6H16z"/></svg>;
const HomeIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const BookOpenIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
const CalendarDaysIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h28.5" /></svg>;
const UsersIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 2.25-2.25h3.514a2.25 2.25 0 0 1 2.25 2.25v3.86M15 19.128P12.75 15.75M12 12.75v6.378a3.75 3.75 0 0 1-7.5 0v-6.378m7.5 0a3.75 3.75 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Zm0 0c.043.023.086.046.128.069m-1.288 0c-.043.023-.086.046-.128.069m1.288 0A3.734 3.734 0 0 1 12 12.75M6.75 15.75h.008v.008H6.75v-.008Zm0 0a3.75 3.75 0 0 0 0-6.378m0 6.378a3.75 3.75 0 0 1 0-6.378m0 6.378h.008v.008H6.75v-.008Zm-3.75-3A3.75 3.75 0 0 0 3 12.75M3 12.75c0 .621.149 1.208.405 1.728m0 0a3.75 3.75 0 0 1 3.345-1.728M3 12.75a3.75 3.75 0 0 1 3.75-3.75m0 0a3.75 3.75 0 0 1 3.75 3.75M3.75 12.75h.008v.008H3.75v-.008Z" /></svg>;
const UserCircleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

// --- MOCK DATA ---
const createInitialData = () => {
    const now = new Date();
    const users: User[] = [
        { id: 'usr_admin', name: 'Alex Ray', email: 'alex.ray@funspot.com', password: 'password', dob: '1985-05-20', role: 'Admin', photo_url: `https://i.pravatar.cc/150?u=usr_admin`, created_at: now.toISOString(), bio: 'Club Administrator with 10+ years of experience in sports management.' },
        { id: 'usr_manager', name: 'Brenda Miles', email: 'brenda.miles@funspot.com', password: 'password', dob: '1990-11-12', role: 'Manager', photo_url: `https://i.pravatar.cc/150?u=usr_manager`, created_at: now.toISOString(), bio: 'Passionate about nurturing young talent and creating a positive club environment.' },
        { id: 'usr_coach_1', name: 'Chris Lee', email: 'chris.lee@funspot.com', password: 'password', dob: '1992-02-28', role: 'Coach', photo_url: `https://i.pravatar.cc/150?u=usr_coach_1`, created_at: now.toISOString(), bio: 'Level 2 certified coach specializing in freestyle and spins.' },
        { id: 'usr_coach_2', name: 'Diana Ross', email: 'diana.ross@funspot.com', password: 'password', dob: '1988-07-15', role: 'Coach', photo_url: `https://i.pravatar.cc/150?u=usr_coach_2`, created_at: now.toISOString(), bio: 'Former competitive skater with a focus on choreography and performance.' },
        { id: 'usr_parent_1', name: 'Eva Green', email: 'eva.green@email.com', password: 'password', dob: '1980-06-01', role: 'Parent', photo_url: `https://i.pravatar.cc/150?u=usr_parent_1`, created_at: now.toISOString() },
        { id: 'usr_parent_2', name: 'Frank Ocean', email: 'frank.ocean@email.com', password: 'password', dob: '1982-09-22', role: 'Parent', photo_url: `https://i.pravatar.cc/150?u=usr_parent_2`, created_at: now.toISOString() },
        { id: 'usr_athlete_1', name: 'Grace Green', email: 'grace.green@email.com', password: 'password', dob: '2012-04-10', role: 'Athlete', parent_id: 'usr_parent_1', coach_id: 'usr_coach_1', skill_level: 'Beginner', photo_url: `https://i.pravatar.cc/150?u=usr_athlete_1`, created_at: now.toISOString() },
        { id: 'usr_athlete_2', name: 'Henry Ocean', email: 'henry.ocean@email.com', password: 'password', dob: '2010-08-19', role: 'Athlete', parent_id: 'usr_parent_2', coach_id: 'usr_coach_2', skill_level: 'Intermediate', photo_url: `https://i.pravatar.cc/150?u=usr_athlete_2`, created_at: now.toISOString() },
        { id: 'usr_athlete_3', name: 'Ivy King', email: 'ivy.king@email.com', password: 'password', dob: '2008-12-01', role: 'Athlete', coach_id: 'usr_coach_2', skill_level: 'Advanced', photo_url: `https://i.pravatar.cc/150?u=usr_athlete_3`, created_at: now.toISOString() },
    ];

    const programs: Program[] = [
        { id: 'prog_01', title: 'Learn to Skate', description: 'Fundamentals for all ages. Covers basic balance, forward and backward skating.', coach_id: 'usr_coach_1', price_cents: 8000, currency: 'KES', duration_minutes: 45, schedule: [{ day: 'Saturday', time: '09:00 AM' }], skill_level: 'Beginner', capacity: 15, enrolled_count: 12, location_type: 'Indoor', active: true, waitlisted_users: [] },
        { id: 'prog_02', title: 'Freestyle Foundations', description: 'Introduction to jumps, spins, and footwork. Prerequisite: Learn to Skate.', coach_id: 'usr_coach_1', price_cents: 12000, currency: 'KES', duration_minutes: 60, schedule: [{ day: 'Saturday', time: '10:00 AM' }], skill_level: 'Intermediate', capacity: 10, enrolled_count: 10, location_type: 'Indoor', active: true, waitlisted_users: ['usr_parent_2'] },
        { id: 'prog_03', title: 'Advanced Edges & Turns', description: 'Master complex edge work and powerful turns for competitive performance.', coach_id: 'usr_coach_2', price_cents: 15000, currency: 'KES', duration_minutes: 60, schedule: [{ day: 'Sunday', time: '11:00 AM' }], skill_level: 'Advanced', capacity: 8, enrolled_count: 5, location_type: 'Indoor', active: true, waitlisted_users: [] },
        { id: 'prog_04', title: 'Adult Skating Fitness', description: 'A fun, low-impact workout on ice. All skill levels welcome.', coach_id: 'usr_coach_2', price_cents: 10000, currency: 'KES', duration_minutes: 50, schedule: [{ day: 'Wednesday', time: '07:00 PM' }], skill_level: 'All', capacity: 20, enrolled_count: 18, location_type: 'Indoor', active: true, waitlisted_users: [] },
    ];

    const transactions: Transaction[] = [
        { id: 'txn_01', userId: 'usr_athlete_1', programId: 'prog_01', amount_cents: 8000, currency: 'KES', method: 'Mpesa', status: 'Completed', created_at: new Date(now.setDate(now.getDate() - 10)).toISOString() },
        { id: 'txn_02', userId: 'usr_athlete_2', programId: 'prog_02', amount_cents: 12000, currency: 'KES', method: 'Card', status: 'Completed', created_at: new Date(now.setDate(now.getDate() - 5)).toISOString() },
    ];

    const clubEvents: ClubEvent[] = [
        { id: 'evt_01', title: 'Club Open Day', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15`, description: 'Join us for a fun day of free skating, demos, and registration info!' },
        { id: 'evt_02', title: 'Holiday Ice Show', date: `${now.getFullYear()}-12-20`, description: 'A festive performance by our talented skaters. Tickets on sale soon.' },
        { id: 'evt_03', title: 'Skills Assessment Day', date: `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}-05`, description: 'Skaters will be assessed for placement in the next term\'s programs.' },
        { id: 'evt_04', title: 'Test Event', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, description: 'An event for today to test the calendar.' },
    ];
    return { users, programs, transactions, clubEvents };
};


// --- UTILITY FUNCTIONS ---
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const formatCurrency = (amount_cents: number, currency: string) => `${(amount_cents / 100).toLocaleString('en-US', { style: 'currency', currency })}`;
const getRoleClassName = (role: Role) => `role-${role.toLowerCase()}`;
const getSkillClassName = (skill: SkillLevel) => `skill-${skill.toLowerCase()}`;


// --- HOOKS ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
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

// --- MAIN APP COMPONENT ---
export const App: FC = () => {
    // --- STATE MANAGEMENT ---
    const initialData = useMemo(() => createInitialData(), []);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [users, setUsers] = useState<User[]>(initialData.users);
    const [programs, setPrograms] = useState<Program[]>(initialData.programs);
    const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
    const [clubEvents] = useState<ClubEvent[]>(initialData.clubEvents);
    const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme as 'light' | 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // --- EFFECTS ---
    useEffect(() => {
        document.documentElement.className = `${theme}-theme`;
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // --- DERIVED STATE & MEMOS ---
    const coaches = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);
    const parents = useMemo(() => users.filter(u => u.role === 'Parent'), [users]);
    const athletes = useMemo(() => users.filter(u => u.role === 'Athlete'), [users]);

    const enrolledPrograms = useMemo(() => {
        if (!currentUser) return [];
        let userIds: string[] = [currentUser.id];
        if (currentUser.role === 'Parent') {
            userIds = users.filter(u => u.parent_id === currentUser.id).map(u => u.id);
        }
        
        const enrolledTx = transactions.filter(tx => userIds.includes(tx.userId));
        return enrolledTx.map(tx => {
            const program = programs.find(p => p.id === tx.programId);
            const user = users.find(u => u.id === tx.userId);
            if (!program || !user) return null;
            if ('parent_id' in user && user.parent_id === currentUser?.id) {
                return { ...program, childName: user.name };
            }
            return program;
        }).filter((p): p is Program & { childName?: string } => p !== null);
    }, [currentUser, users, transactions, programs]);


    // --- EVENT HANDLERS & LOGIC ---
    const addToast = (message: string, type: ToastMessage['type']) => {
        const newToast = { id: Date.now(), message, type };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== newToast.id)), 5000);
    };

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        addToast(`Welcome back, ${user.name}!`, 'success');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        addToast('You have been logged out.', 'info');
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleBookProgram = (program: Program) => {
        if (!currentUser) {
            addToast('You must be logged in to book a program.', 'error');
            return;
        }
        const isAlreadyEnrolled = transactions.some(tx => tx.userId === currentUser.id && tx.programId === program.id);
        if (isAlreadyEnrolled) {
            addToast('You are already enrolled in this program.', 'info');
            return;
        }
        setModalState({ type: 'PAYMENT', program });
    };

    const handleJoinWaitlist = (program: Program) => {
        if (!currentUser) return;
        setPrograms(prev => prev.map(p => 
            p.id === program.id 
            ? { ...p, waitlisted_users: [...p.waitlisted_users, currentUser.id] }
            : p
        ));
        setModalState({ type: 'NONE' });
        addToast(`You've been added to the waitlist for ${program.title}.`, 'success');
    };
    
    const handleLeaveWaitlist = (program: Program) => {
        if (!currentUser) return;
        setPrograms(prev => prev.map(p =>
            p.id === program.id
            ? { ...p, waitlisted_users: p.waitlisted_users.filter(id => id !== currentUser.id) }
            : p
        ));
        addToast(`You've been removed from the waitlist for ${program.title}.`, 'info');
    };

    const handleConfirmPayment = (program: Program) => {
        if (!currentUser) return;
        const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            userId: currentUser.id,
            programId: program.id,
            amount_cents: program.price_cents,
            currency: 'KES',
            method: 'Mpesa', // Defaulting for simplicity
            status: 'Completed',
            created_at: new Date().toISOString()
        };
        setTransactions(prev => [...prev, newTransaction]);
        setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, enrolled_count: p.enrolled_count + 1 } : p));
        setModalState({ type: 'CONFIRMATION', program, transactionId: newTransaction.id });
    };

    const handleSaveUser = (user: User) => {
        const isNewUser = !user.id;
        if (isNewUser) {
            const newUser = { 
                ...user, 
                id: `usr_${Date.now()}`,
                created_at: new Date().toISOString(),
                photo_url: user.photo_url || `https://i.pravatar.cc/150?u=usr_${Date.now()}`
            };
            setUsers(prev => [...prev, newUser]);
            addToast('User created successfully.', 'success');
        } else {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            addToast('User updated successfully.', 'success');
            // If the current user is editing their own profile, update the currentUser state as well.
            if(currentUser?.id === user.id) {
                setCurrentUser(user);
            }
        }
        setModalState({ type: 'NONE' });
    };

    const handleDeleteUser = (user: User) => {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setModalState({ type: 'NONE' });
        addToast(`User ${user.name} has been deleted.`, 'success');
    };
    
    const handleEditCurrentUser = () => {
        setModalState({ type: 'USER_FORM', user: currentUser! });
    };

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return null;
        const lowercasedTerm = searchTerm.toLowerCase();

        const foundPrograms = programs.filter(p =>
            p.title.toLowerCase().includes(lowercasedTerm) ||
            p.description.toLowerCase().includes(lowercasedTerm)
        );

        const foundUsers = users.filter(u =>
            u.name.toLowerCase().includes(lowercasedTerm)
        );

        const foundEvents = clubEvents.filter(e =>
            e.title.toLowerCase().includes(lowercasedTerm) ||
            e.description.toLowerCase().includes(lowercasedTerm)
        );

        if (foundPrograms.length === 0 && foundUsers.length === 0 && foundEvents.length === 0) {
            return { programs: [], users: [], events: [] };
        }

        return { programs: foundPrograms, users: foundUsers, events: foundEvents };
    }, [searchTerm, programs, users, clubEvents]);


    // --- RENDER LOGIC ---
    if (!currentUser) {
        return (
            <div className={`${theme}-theme`}>
                <LoginScreen users={users} onLogin={handleLogin} />
            </div>
        );
    }
    
    return (
        <div className={`${theme}-theme`}>
            <DashboardLayout
                currentUser={currentUser}
                onLogout={handleLogout}
                theme={theme}
                onThemeToggle={handleThemeToggle}
                onEditCurrentUser={handleEditCurrentUser}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchResults={searchResults}
                setModalState={setModalState}
            >
                {/* Role-based dashboards */}
                {currentUser.role === 'Admin' && <AdminDashboard users={users} setModalState={setModalState} />}
                {currentUser.role === 'Manager' && <AdminDashboard users={users} setModalState={setModalState} />}
                {currentUser.role === 'Coach' && <CoachDashboard coach={currentUser} users={users} programs={programs} />}
                {currentUser.role === 'Parent' && <ParentDashboard parent={currentUser} users={users} programs={programs} enrolledPrograms={enrolledPrograms} onBookProgram={handleBookProgram} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onShowDetails={p => setModalState({ type: 'PROGRAM_DETAILS', program: p })} coaches={coaches} />}
                {currentUser.role === 'Athlete' && <AthleteDashboard athlete={currentUser} programs={programs} enrolledPrograms={enrolledPrograms} onBookProgram={handleBookProgram} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onShowDetails={p => setModalState({ type: 'PROGRAM_DETAILS', program: p })} coaches={coaches} />}
            </DashboardLayout>

            {/* Modals */}
            {modalState.type === 'PROGRAM_DETAILS' && <ProgramDetailsModal program={modalState.program} onBook={handleBookProgram} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onClose={() => setModalState({ type: 'NONE' })} currentUser={currentUser} transactions={transactions} />}
            {modalState.type === 'PAYMENT' && <PaymentModal program={modalState.program} onConfirm={handleConfirmPayment} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'CONFIRMATION' && <ConfirmationModal program={modalState.program} transactionId={modalState.transactionId} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'USER_FORM' && <UserFormModal user={modalState.user} onSave={handleSaveUser} onClose={() => setModalState({ type: 'NONE' })} coaches={coaches} parents={parents} currentUser={currentUser} />}
            {modalState.type === 'DELETE_USER' && <DeleteUserModal user={modalState.user} onDelete={handleDeleteUser} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'EVENT_DETAILS' && <EventDetailsModal date={modalState.date} events={modalState.events} onClose={() => setModalState({type: 'NONE'})}/>}


            {/* Global Toast Notifications */}
            <ToastContainer toasts={toasts} setToasts={setToasts} />
        </div>
    );
};


// --- SUB-COMPONENTS ---
const LoginScreen: FC<{ users: User[], onLogin: (user: User) => void }> = ({ users, onLogin }) => (
    <div className="auth-container">
        <div className="auth-box">
             <ClubLogo className="auth-logo"/>
            <h2>Welcome to Funspot Club</h2>
            <p>Please select your profile to continue.</p>
            <div className="login-user-list">
                {users.map(user => (
                    <button key={user.id} onClick={() => onLogin(user)} className="btn btn-secondary">
                        {user.name} ({user.role})
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const DashboardLayout: FC<{
    currentUser: User;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onEditCurrentUser: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchResults: { programs: Program[], users: User[], events: ClubEvent[] } | null;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    children: React.ReactNode;
}> = ({ currentUser, onLogout, theme, onThemeToggle, onEditCurrentUser, searchTerm, setSearchTerm, searchResults, setModalState, children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header 
                    currentUser={currentUser} 
                    onLogout={onLogout} 
                    theme={theme} 
                    onThemeToggle={onThemeToggle} 
                    onEditCurrentUser={onEditCurrentUser}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchResults={searchResults}
                    setModalState={setModalState}
                />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

const Header: FC<{
    currentUser: User;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onEditCurrentUser: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchResults: { programs: Program[], users: User[], events: ClubEvent[] } | null;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}> = ({ currentUser, onLogout, theme, onThemeToggle, onEditCurrentUser, searchTerm, setSearchTerm, searchResults, setModalState }) => {
    
    const searchRef = useRef<HTMLDivElement>(null);

    const handleResultClick = (item: Program | User | ClubEvent, type: 'program' | 'user' | 'event') => {
        setSearchTerm('');
        if (type === 'program') {
            setModalState({ type: 'PROGRAM_DETAILS', program: item as Program });
        }
        if (type === 'event') {
            const event = item as ClubEvent;
            const eventsOnDate = createInitialData().clubEvents.filter(e => e.date === event.date);
            setModalState({type: 'EVENT_DETAILS', date: new Date(event.date), events: eventsOnDate});
        }
        // Clicking a user does nothing for now, but could navigate to a profile page
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setSearchTerm('');
        }
    }, [setSearchTerm]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
    
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                     <ClubLogo />
                </div>
                 <div className="header-center" ref={searchRef}>
                    <div className="search-container">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search programs, users, events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {searchResults && (
                         <div className="search-results-dropdown">
                            {searchResults.programs.length === 0 && searchResults.users.length === 0 && searchResults.events.length === 0 ? (
                                <div className="search-result-item-empty">No results found.</div>
                            ) : (
                                <>
                                    {searchResults.programs.length > 0 && <div className="search-category-header">Programs</div>}
                                    {searchResults.programs.map(p => (
                                        <div key={p.id} className="search-result-item" onClick={() => handleResultClick(p, 'program')}>
                                            <span className="search-item-title">{p.title}</span>
                                            <span className="search-item-context">{p.skill_level}</span>
                                        </div>
                                    ))}
                                    {searchResults.users.length > 0 && <div className="search-category-header">Users</div>}
                                    {searchResults.users.map(u => (
                                        <div key={u.id} className="search-result-item" onClick={() => handleResultClick(u, 'user')}>
                                            <span className="search-item-title">{u.name}</span>
                                            <span className={`role-badge ${getRoleClassName(u.role)}`}>{u.role}</span>
                                        </div>
                                    ))}
                                    {searchResults.events.length > 0 && <div className="search-category-header">Events</div>}
                                    {searchResults.events.map(e => (
                                        <div key={e.id} className="search-result-item" onClick={() => handleResultClick(e, 'event')}>
                                            <span className="search-item-title">{e.title}</span>
                                            <span className="search-item-context">{formatDate(e.date)}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="header-right">
                    <button onClick={onThemeToggle} className="btn-icon" aria-label="Toggle theme">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <div className="header-user-info">
                        <span>{currentUser.name}</span>
                        <img src={currentUser.photo_url} alt={currentUser.name} className="header-avatar" />
                         <button onClick={onEditCurrentUser} className="btn-icon" aria-label="Edit Profile">
                            <PencilIcon style={{width: '1rem', height: '1rem'}}/>
                        </button>
                    </div>
                    <button onClick={onLogout} className="btn-icon" aria-label="Logout">
                        <ArrowLeftOnRectangleIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

const ClubLogo: FC<{className?: string}> = ({className}) => (
    <a href="#" className={`club-logo ${className || ''}`}>
        <SkateIcon />
        <h3>FUNSPOT</h3>
    </a>
)

const Sidebar: FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <ClubLogo/>
            </div>
            <nav className="sidebar-nav">
                <a href="#" className="nav-item active"><HomeIcon /> Dashboard</a>
                <a href="#" className="nav-item"><BookOpenIcon /> Programs</a>
                <a href="#" className="nav-item"><CalendarDaysIcon /> Events</a>
                <a href="#" className="nav-item"><UsersIcon /> Members</a>
                <a href="#" className="nav-item"><UserCircleIcon/> My Profile</a>
            </nav>
            {/* Can add more elements here, e.g., help link */}
        </aside>
    );
};

// --- WIDGETS ---
const ProgramsWidget: FC<{
    programs: Program[];
    currentUser: User;
    onBookProgram: (program: Program) => void;
    onJoinWaitlist: (program: Program) => void;
    onLeaveWaitlist: (program: Program) => void;
    onShowDetails: (program: Program) => void;
    transactions: Transaction[];
}> = ({ programs, currentUser, onBookProgram, onJoinWaitlist, onLeaveWaitlist, onShowDetails, transactions }) => {
    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header"><h3>Available Programs</h3></div>
            <div className="program-list">
                {programs.map(program => (
                    <ProgramListItem
                        key={program.id}
                        program={program}
                        currentUser={currentUser}
                        onBookProgram={onBookProgram}
                        onJoinWaitlist={onJoinWaitlist}
                        onLeaveWaitlist={onLeaveWaitlist}
                        onShowDetails={onShowDetails}
                        transactions={transactions}
                    />
                ))}
            </div>
        </div>
    );
};

const ProgramListItem: FC<{
    program: Program;
    currentUser: User;
    onBookProgram: (program: Program) => void;
    onJoinWaitlist: (program: Program) => void;
    onLeaveWaitlist: (program: Program) => void;
    onShowDetails: (program: Program) => void;
    transactions: Transaction[];
}> = ({ program, currentUser, onBookProgram, onJoinWaitlist, onLeaveWaitlist, onShowDetails, transactions }) => {
    const isFull = program.enrolled_count >= program.capacity;
    const isNearingCapacity = !isFull && program.enrolled_count / program.capacity >= 0.8;
    const isWaitlisted = program.waitlisted_users.includes(currentUser.id);
    const isEnrolled = transactions.some(tx => (tx.userId === currentUser.id || (currentUser.role === 'Parent' && createInitialData().users.find(u => u.id === tx.userId)?.parent_id === currentUser.id)) && tx.programId === program.id);

    let itemClass = "program-list-item";
    if (isFull) itemClass += " full";
    else if (isNearingCapacity) itemClass += " nearing-capacity";

    return (
        <div className={itemClass}>
            <div className="program-item-header">
                <h4>{program.title}</h4>
                {isNearingCapacity && !isFull && <span className="capacity-warning">FILLING UP!</span>}
                {isFull && <span className="capacity-full">FULL</span>}
            </div>
            <p><strong>Level:</strong> <span className={`skill-badge ${getSkillClassName(program.skill_level)}`}>{program.skill_level}</span> | <strong>Price:</strong> {formatCurrency(program.price_cents, program.currency)}</p>
            <p>{program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
            <div className="program-item-actions">
                <button onClick={() => onShowDetails(program)} className="btn btn-secondary btn-sm"><EyeIcon /> Details</button>
                {isEnrolled ? (
                    <button className="btn btn-sm" disabled><CheckCircleIcon/> Enrolled</button>
                ) : isFull ? (
                    isWaitlisted ? (
                        <button onClick={() => onLeaveWaitlist(program)} className="btn btn-secondary btn-sm">Leave Waitlist</button>
                    ) : (
                        <button onClick={() => onJoinWaitlist(program)} className="btn btn-primary btn-sm">Join Waitlist</button>
                    )
                ) : (
                    <button onClick={() => onBookProgram(program)} className="btn btn-primary btn-sm">Book Now</button>
                )}
            </div>
        </div>
    );
};

const EnrolledProgramsWidget: FC<{ enrolledPrograms: (Program & { childName?: string })[], currentUserRole: Role }> = ({ enrolledPrograms, currentUserRole }) => (
    <div className="widget">
        <div className="widget-header"><h3>My Enrolled Programs</h3></div>
        {enrolledPrograms.length > 0 ? (
             <div className="program-list">
                {enrolledPrograms.map(program => (
                    <div key={program.id} className="program-list-item">
                         <h4>{program.title}</h4>
                         {currentUserRole === 'Parent' && program.childName && <p><strong>Skater:</strong> {program.childName}</p>}
                         <p><strong>Level:</strong> <span className={`skill-badge ${getSkillClassName(program.skill_level)}`}>{program.skill_level}</span></p>
                         <p>{program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p>You are not enrolled in any programs yet.</p>
        )}
    </div>
);

const UsersWidget: FC<{ users: User[], setModalState: React.Dispatch<React.SetStateAction<ModalState>> }> = ({ users, setModalState }) => (
    <div className="widget widget-col-span-4">
        <div className="widget-header">
            <h3>Manage Users</h3>
            <button onClick={() => setModalState({ type: 'USER_FORM' })} className="btn btn-primary btn-sm"><UserPlusIcon /> Add User</button>
        </div>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td data-label="Name">
                                <div className="user-name-cell">
                                    <img src={user.photo_url} alt={user.name} className="table-avatar" />
                                    <span>{user.name}</span>
                                </div>
                            </td>
                            <td data-label="Role"><span className={`role-badge ${getRoleClassName(user.role)}`}>{user.role}</span></td>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="Joined">{formatDate(user.created_at)}</td>
                            <td data-label="Actions">
                                <div className="action-buttons">
                                    <button onClick={() => setModalState({ type: 'USER_FORM', user })} className="btn-icon" aria-label="Edit"><PencilIcon /></button>
                                    <button onClick={() => setModalState({ type: 'DELETE_USER', user })} className="btn-icon" aria-label="Delete"><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CalendarWidget: FC<{ events: ClubEvent[], setModalState: React.Dispatch<React.SetStateAction<ModalState>> }> = ({ events, setModalState }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            (acc[event.date] = acc[event.date] || []).push(event);
            return acc;
        }, {} as Record<string, ClubEvent[]>);
    }, [events]);

    const handleDayClick = (date: Date) => {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (eventsByDate[dateString]) {
            setModalState({ type: 'EVENT_DETAILS', date, events: eventsByDate[dateString] });
        }
    };
    
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day);
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = eventsByDate[dateString];
            const hasEvents = dayEvents && dayEvents.length > 0;

            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${hasEvents ? 'event-day' : ''}`}
                    onClick={() => hasEvents && handleDayClick(fullDate)}
                >
                    <span>{day}</span>
                    {hasEvents && (
                        <div className="event-dots">
                            {dayEvents.slice(0, 3).map((_, i) => <div key={i} className="dot"></div>)}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };
    
    return (
        <div className="widget">
            <div className="widget-header">
                <h3>Events Calendar</h3>
                <h4>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            </div>
            <div className="calendar-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="calendar-header">{day}</div>)}
                {renderCalendar()}
            </div>
        </div>
    );
};

// --- DASHBOARDS ---
const AdminDashboard: FC<{ users: User[], setModalState: React.Dispatch<React.SetStateAction<ModalState>> }> = ({ users, setModalState }) => (
    <div className="dashboard-grid">
        <UsersWidget users={users} setModalState={setModalState} />
    </div>
);

const CoachDashboard: FC<{ coach: User, users: User[], programs: Program[] }> = ({ coach, users, programs }) => {
    const assignedAthletes = useMemo(() => users.filter(u => u.coach_id === coach.id), [users, coach.id]);
    const coachedPrograms = useMemo(() => programs.filter(p => p.coach_id === coach.id), [programs, coach.id]);

    return (
        <div className="dashboard-grid">
            <div className="widget">
                <div className="widget-header"><h3>My Programs</h3></div>
                {coachedPrograms.length > 0 ? (
                    <div className="program-list">
                    {coachedPrograms.map(p => (
                        <div key={p.id} className="program-list-item">
                            <h4>{p.title}</h4>
                            <p><strong>Enrolled:</strong> {p.enrolled_count} / {p.capacity}</p>
                            <p><strong>Waitlist:</strong> {p.waitlisted_users.length}</p>
                        </div>
                    ))}
                    </div>
                ) : <p>You are not assigned to any programs.</p>}
            </div>
             <div className="widget widget-col-span-2">
                <div className="widget-header"><h3>My Athletes ({assignedAthletes.length})</h3></div>
                <div className="table-container">
                     <table>
                        <thead><tr><th>Name</th><th>Skill Level</th><th>Email</th></tr></thead>
                        <tbody>
                            {assignedAthletes.map(athlete => (
                                <tr key={athlete.id}>
                                    <td data-label="Name">
                                        <div className="user-name-cell">
                                            <img src={athlete.photo_url} alt={athlete.name} className="table-avatar"/>
                                            <span>{athlete.name}</span>
                                        </div>
                                    </td>
                                    <td data-label="Skill"><span className={`skill-badge ${getSkillClassName(athlete.skill_level!)}`}>{athlete.skill_level}</span></td>
                                    <td data-label="Email">{athlete.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Fix: Updated function signatures to accept a `Program` argument to match passed props.
const commonUserDashboardProps = {
    onBookProgram: (_program: Program) => {},
    onJoinWaitlist: (_program: Program) => {},
    onLeaveWaitlist: (_program: Program) => {},
    onShowDetails: (_program: Program) => {},
};

const AthleteDashboard: FC<{
    athlete: User;
    programs: Program[];
    enrolledPrograms: (Program & { childName?: string })[];
    coaches: User[];
} & typeof commonUserDashboardProps> = ({ athlete, programs, enrolledPrograms, coaches, ...props }) => {
    const myCoach = coaches.find(c => c.id === athlete.coach_id);
    const availablePrograms = programs.filter(p => p.skill_level === athlete.skill_level || p.skill_level === 'All');

    return (
        <div className="dashboard-grid">
            <ProgramsWidget programs={availablePrograms} currentUser={athlete} transactions={createInitialData().transactions} {...props} />
            <EnrolledProgramsWidget enrolledPrograms={enrolledPrograms} currentUserRole="Athlete"/>
            <CalendarWidget events={createInitialData().clubEvents} setModalState={() => {}}/>
            {myCoach && (
                <div className="widget">
                    <div className="widget-header"><h3>My Coach</h3></div>
                    <div className="user-name-cell" style={{justifyContent: 'flex-start'}}>
                         <img src={myCoach.photo_url} alt={myCoach.name} className="table-avatar" />
                         <span>{myCoach.name}</span>
                    </div>
                    <p>{myCoach.bio}</p>
                </div>
            )}
        </div>
    );
};

const ParentDashboard: FC<{
    parent: User;
    users: User[];
    programs: Program[];
    enrolledPrograms: (Program & { childName?: string })[];
    coaches: User[];
} & typeof commonUserDashboardProps> = ({ parent, users, programs, enrolledPrograms, coaches, ...props }) => {
    const children = useMemo(() => users.filter(u => u.parent_id === parent.id), [users, parent.id]);

    return (
        <div className="dashboard-grid">
            <ProgramsWidget programs={programs} currentUser={parent} transactions={createInitialData().transactions} {...props} />
            <EnrolledProgramsWidget enrolledPrograms={enrolledPrograms} currentUserRole="Parent"/>
            <CalendarWidget events={createInitialData().clubEvents} setModalState={() => {}}/>
            <div className="widget">
                <div className="widget-header"><h3>My Children</h3></div>
                 {children.map(child => {
                     const coach = coaches.find(c => c.id === child.coach_id);
                     return (
                        <div key={child.id} className="program-list-item" style={{marginBottom: '1rem'}}>
                             <div className="user-name-cell" style={{justifyContent: 'flex-start'}}>
                                <img src={child.photo_url} alt={child.name} className="table-avatar" />
                                <div>
                                    <h4>{child.name}</h4>
                                    <p><strong>Skill Level:</strong> {child.skill_level}</p>
                                    {coach && <p><strong>Coach:</strong> {coach.name}</p>}
                                </div>
                            </div>
                        </div>
                     )
                 })}
            </div>
        </div>
    );
};


// --- MODAL COMPONENTS ---

const Modal: FC<{ children: React.ReactNode, onClose: () => void, size?: 'sm'|'md'|'lg' }> = ({ children, onClose, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop">
            <div className={`modal-content modal-${size}`} ref={modalRef}>
                {children}
            </div>
        </div>
    );
};

const ProgramDetailsModal: FC<{ 
    program: Program, 
    onClose: () => void,
    onBook: (program: Program) => void;
    onJoinWaitlist: (program: Program) => void;
    onLeaveWaitlist: (program: Program) => void;
    currentUser: User | null;
    transactions: Transaction[];
}> = ({ program, onClose, onBook, onJoinWaitlist, onLeaveWaitlist, currentUser, transactions }) => {
    const isFull = program.enrolled_count >= program.capacity;
    const isWaitlisted = currentUser ? program.waitlisted_users.includes(currentUser.id) : false;
    const isEnrolled = currentUser ? transactions.some(tx => (tx.userId === currentUser.id || (currentUser.role === 'Parent' && createInitialData().users.find(u => u.id === tx.userId)?.parent_id === currentUser.id)) && tx.programId === program.id) : false;
    const coach = createInitialData().users.find(u => u.id === program.coach_id);

    return (
        <Modal onClose={onClose}>
            <div className="modal-header">
                <h3>{program.title}</h3>
                <button onClick={onClose} className="btn-icon"><XMarkIcon /></button>
            </div>
            <div className="modal-body program-details">
                <p>{program.description}</p>
                <p><strong>Coach:</strong> {coach?.name || 'N/A'}</p>
                <p><strong>Schedule:</strong> {program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
                <p><strong>Duration:</strong> {program.duration_minutes} minutes</p>
                <p><strong>Level:</strong> <span className={`skill-badge ${getSkillClassName(program.skill_level)}`}>{program.skill_level}</span></p>
                <p><strong>Location:</strong> {program.location_type}</p>
                <p><strong>Capacity:</strong> {program.enrolled_count} / {program.capacity}</p>
                <p><strong>Price:</strong> {formatCurrency(program.price_cents, program.currency)}</p>
                {isFull && <p className="waitlist-info">This program is full. You can join the waitlist to be notified if a spot opens up.</p>}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary">Close</button>
                {isEnrolled ? (
                    <button className="btn" disabled><CheckCircleIcon/> Enrolled</button>
                ) : isFull ? (
                    isWaitlisted ? (
                        <button onClick={() => onLeaveWaitlist(program)} className="btn btn-secondary">Leave Waitlist</button>
                    ) : (
                        <button onClick={() => onJoinWaitlist(program)} className="btn btn-primary">Join Waitlist</button>
                    )
                ) : (
                    <button onClick={() => onBook(program)} className="btn btn-primary">Book Now</button>
                )}
            </div>
        </Modal>
    );
};

const PaymentModal: FC<{ program: Program, onClose: () => void, onConfirm: (program: Program) => void }> = ({ program, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('mpesa');
    const [isPaying, setIsPaying] = useState(false);
    
    const handlePay = () => {
        setIsPaying(true);
        setTimeout(() => {
            onConfirm(program);
        }, 1500); // Simulate payment processing
    };
    
    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-header">
                <h3>Complete Your Booking</h3>
                 <button onClick={onClose} className="btn-icon"><XMarkIcon /></button>
            </div>
            <div className="modal-body">
                <div className="payment-summary">
                    <p>{program.title}</p>
                    <div className="price">{formatCurrency(program.price_cents, program.currency)}</div>
                </div>
                <div className="payment-tabs">
                    <button className={paymentMethod === 'card' ? 'active' : ''} onClick={() => setPaymentMethod('card')}><CreditCardIcon /> Card</button>
                    <button className={paymentMethod === 'mpesa' ? 'active' : ''} onClick={() => setPaymentMethod('mpesa')}><DevicePhoneMobileIcon/> M-Pesa</button>
                </div>
                {paymentMethod === 'card' && <p className="mpesa-instructions">Card payments are currently unavailable. Please use M-Pesa.</p>}
                {paymentMethod === 'mpesa' && <p className="mpesa-instructions">You will receive a prompt on your phone to complete the payment.</p>}
            </div>
             <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary" disabled={isPaying}>Cancel</button>
                <button onClick={handlePay} className="btn btn-primary btn-full" disabled={isPaying || paymentMethod === 'card'}>
                    {isPaying ? 'Processing...' : `Pay ${formatCurrency(program.price_cents, program.currency)}`}
                </button>
            </div>
        </Modal>
    );
};

const ConfirmationModal: FC<{ program: Program, transactionId: string, onClose: () => void }> = ({ program, transactionId, onClose }) => (
    <Modal onClose={onClose} size="sm">
        <div className="booking-confirmation">
            <CheckCircleIcon />
            <h3>Booking Confirmed!</h3>
            <p>You are now enrolled in <strong>{program.title}</strong>.</p>
             <div className="confirmation-details">
                <div><span>Program</span><span>{program.title}</span></div>
                <div><span>Amount Paid</span><span>{formatCurrency(program.price_cents, program.currency)}</span></div>
                <div><span>Transaction ID</span><span>{transactionId}</span></div>
            </div>
            <button onClick={onClose} className="btn btn-primary btn-full">Done</button>
        </div>
    </Modal>
);

const UserFormModal: FC<{ 
    user?: User, 
    onClose: () => void, 
    onSave: (user: User) => void,
    coaches: User[],
    parents: User[],
    currentUser: User
}> = ({ user, onClose, onSave, coaches, parents, currentUser }) => {
    const [formData, setFormData] = useState<Partial<User>>(user || { role: 'Athlete' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, photo_url: event.target?.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };
    
    // Admins can edit everything. Other users can only edit their own basic info.
    const canEditSensitiveInfo = currentUser.role === 'Admin' || currentUser.role === 'Manager';
    const isSelfEdit = currentUser.id === user?.id;

    return (
        <Modal onClose={onClose} size="lg">
             <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h3>{user ? 'Edit User' : 'Create User'}</h3>
                    <button type="button" onClick={onClose} className="btn-icon"><XMarkIcon /></button>
                </div>
                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input type="date" id="dob" name="dob" value={formData.dob || ''} onChange={handleChange} required />
                        </div>
                        
                        {(canEditSensitiveInfo && !isSelfEdit) && (
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select id="role" name="role" value={formData.role || ''} onChange={handleChange} required>
                                    <option value="Athlete">Athlete</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        )}
                        
                         {formData.role === 'Athlete' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="skill_level">Skill Level</label>
                                    <select id="skill_level" name="skill_level" value={formData.skill_level || ''} onChange={handleChange}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                 {(canEditSensitiveInfo && !isSelfEdit) && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="coach_id">Assign Coach</label>
                                            <select id="coach_id" name="coach_id" value={formData.coach_id || ''} onChange={handleChange}>
                                                <option value="">None</option>
                                                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_id">Assign Parent</label>
                                            <select id="parent_id" name="parent_id" value={formData.parent_id || ''} onChange={handleChange}>
                                                <option value="">None</option>
                                                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </>
                         )}

                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea>
                        </div>

                         <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Profile Photo</label>
                             <div className="photo-upload-container">
                                <img src={formData.photo_url || 'https://i.pravatar.cc/150'} alt="Profile preview" className="profile-preview"/>
                                <input type="file" id="photo_url" name="photo_url" onChange={handlePhotoChange} accept="image/*" />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};

const DeleteUserModal: FC<{ user: User, onClose: () => void, onDelete: (user: User) => void }> = ({ user, onClose, onDelete }) => (
    <Modal onClose={onClose} size="sm">
        <div className="modal-header">
            <h3>Delete User</h3>
            <button onClick={onClose} className="btn-icon"><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <div className="delete-confirmation">
                <ExclamationTriangleIcon style={{color: 'var(--red)', width: '48px', height: '48px', margin: '0 auto 1rem'}}/>
                <p>Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.</p>
            </div>
        </div>
        <div className="modal-actions">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={() => onDelete(user)} className="btn btn-primary" style={{backgroundColor: 'var(--red)'}}>Delete User</button>
        </div>
    </Modal>
);

const EventDetailsModal: FC<{ date: Date, events: ClubEvent[], onClose: () => void }> = ({ date, events, onClose }) => (
    <Modal onClose={onClose} size="sm">
        <div className="modal-header">
            <h3>Events for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <button onClick={onClose} className="btn-icon"><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <div className="event-details-list">
            {events.map(event => (
                <div key={event.id} className="event-item">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                </div>
            ))}
            </div>
        </div>
        <div className="modal-actions">
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
    </Modal>
);


const ToastContainer: FC<{ toasts: ToastMessage[], setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>> }> = ({ toasts, setToasts }) => {
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="toast-close-btn"><XMarkIcon /></button>
                </div>
            ))}
        </div>
    );
};
