

import React, { useState, useEffect, useMemo, FC, useRef } from 'react';

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

interface AppNotification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'event' | 'message' | 'exam' | 'system';
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

interface TrainingReport {
    id: string;
    athlete_id: string;
    date: string; // YYYY-MM-DD
    score: number; // 1-100
    notes: string;
    status: 'Pending' | 'Approved';
}

interface Activity {
    id: string;
    name: string;
    type: 'Indoor' | 'Outdoor';
    description: string;
}

interface ActionLog {
    id: number;
    userId: string;
    action: string;
    timestamp: string;
}


// --- SVG ICONS ---
const EyeIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const XMarkIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
// FIX: Updated component to accept a `style` prop to resolve assignment error.
const ExclamationTriangleIcon: FC<{ style?: React.CSSProperties }> = ({ style }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={style}><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>;
const SkateIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2c-1.42 0-2.84.4-4.24 1.2L16 2.29V2a1 1 0 0 0-2 0v1.29l-1.76-1.09C10.84.4 9.42 0 8 0 5.25 0 3 2.25 3 5c0 1.42.4 2.84 1.2 4.24L2.29 11H2a1 1 0 0 0 0 2h1.29l-1.09 1.76C.4 16.16 0 17.58 0 19c0 2.75 2.25 5 5 5 1.42 0 2.84-.4 4.24-1.2L11 21.71V22a1 1 0 0 0 2 0v-1.29l1.76 1.09c1.4.8 2.82 1.2 4.24 1.2 2.75 0 5-2.25 5-5 0-1.42-.4-2.84-1.2-4.24L21.71 13H22a1 1 0 0 0 0-2h-1.29l1.09-1.76C23.6 7.84 24 6.42 24 5c0-2.75-2.25-5-5-5zM9 19c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm6 0c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" /></svg>;
const BellIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const BellSlashIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.375-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5M3 16.5v-11.625c0-1.02.42-2.024 1.17-2.774s1.754-1.17 2.774-1.17h11.625c.595 0 1.17.237 1.59.657l-6.878 6.878-6.878 6.878Zm14.25-4.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5-1.5" /></svg>;
const CreditCardIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" /></svg>;
const PhoneIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
const CheckCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const PlusCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const SunIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const MoonIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const InformationCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const EnvelopeIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const ChatBubbleLeftRightIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.534c-.454.065-.92-.093-1.267-.387a1.534 1.534 0 01-.426-1.053v-4.286c0-.97.616-1.813 1.5-2.097a6.5 6.5 0 014.389 4.389z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.811c0-.97.616-1.813 1.5-2.097A6.5 6.5 0 019.64 3.75c.97 0 1.813-.616 2.097-1.5a6.5 6.5 0 014.389 4.389c.283.884 1.128 1.5 2.097 1.5v4.286c0 .97-.616 1.813-1.5 2.097a6.5 6.5 0 01-4.389-4.389c-.283-.884-1.128-1.5-2.097-1.5v-4.286a6.5 6.5 0 01-4.389-4.389z" /></svg>;
const LockClosedIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>;
const UserCircleIcon: FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

// --- MOCK DATA ---
const initialUsers: User[] = [
  { id: 'user_01', name: 'Admin User', email: 'admin@funspot.com', password: 'password123', dob: '1985-01-15', role: 'Admin', photo_url: `https://i.pravatar.cc/150?u=user_01`, created_at: '2023-01-10' },
  { id: 'user_06', name: 'Manager Mary', email: 'manager.m@funspot.com', password: 'password123', dob: '1987-03-22', role: 'Manager', photo_url: `https://i.pravatar.cc/150?u=user_06`, created_at: '2023-01-15' },
  { id: 'user_02', name: 'Coach Davis', email: 'coach.d@funspot.com', password: 'password123', dob: '1990-05-20', role: 'Coach', photo_url: `https://i.pravatar.cc/150?u=user_02`, created_at: '2023-02-20' },
  { id: 'user_03', name: 'Alice Smith (Parent)', email: 'alice.s@email.com', password: 'password123', dob: '1988-08-08', role: 'Parent', photo_url: `https://i.pravatar.cc/150?u=user_03`, created_at: '2023-03-12' },
  { id: 'user_04', name: 'Bobby Smith', email: 'bobby.s@email.com', password: 'password123', dob: '2015-06-30', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_04`, created_at: '2023-03-12', skill_level: 'Beginner' },
  { id: 'user_05', name: 'Charlie Brown', email: 'charlie.b@email.com', password: 'password123', dob: '2016-11-10', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_05`, created_at: '2023-04-01', skill_level: 'Intermediate' },
];

const initialPrograms: Program[] = [
  { id: 'prog_01', title: 'Beginner Skating', description: 'Learn fundamentals: balance, gliding, stopping.', coach_id: 'user_02', price_cents: 15000, currency: 'KES', duration_minutes: 90, skill_level: 'Beginner', capacity: 12, enrolled_count: 8, location_type: 'Outdoor', active: true, schedule: [{ day: 'Mon', time: '15:30' }, { day: 'Wed', time: '15:30' }] },
  { id: 'prog_02', title: 'Intermediate Tricks', description: 'Master ollies, shuvits, and grinds.', coach_id: 'user_02', price_cents: 20000, currency: 'KES', duration_minutes: 90, skill_level: 'Intermediate', capacity: 1, enrolled_count: 1, location_type: 'Outdoor', active: true, schedule: [{ day: 'Tue', time: '16:00' }, { day: 'Thu', time: '16:00' }] },
  { id: 'prog_03', title: 'Indoor Chess Club', description: 'Strategic thinking for all ages.', coach_id: 'user_02', price_cents: 10000, currency: 'KES', duration_minutes: 60, skill_level: 'All', capacity: 20, enrolled_count: 18, location_type: 'Indoor', active: true, schedule: [{ day: 'Fri', time: '17:00' }] }
];

const initialTransactions: Transaction[] = [
    {id: 'txn_1', userId: 'user_04', programId: 'prog_01', amount_cents: 15000, currency: 'KES', method: 'Mpesa', status: 'Completed', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},
    {id: 'txn_2', userId: 'user_05', programId: 'prog_02', amount_cents: 20000, currency: 'KES', method: 'Card', status: 'Completed', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},
    {id: 'txn_3', userId: 'user_04', programId: 'prog_03', amount_cents: 10000, currency: 'KES', method: 'Mpesa', status: 'Completed', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},
    {id: 'txn_4', userId: 'user_05', programId: 'prog_01', amount_cents: 15000, currency: 'KES', method: 'Card', status: 'Completed', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},
    {id: 'txn_5', userId: 'user_03', programId: 'prog_01', amount_cents: 15000, currency: 'KES', method: 'Card', status: 'Completed', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},
];

const initialNotifications: AppNotification[] = [
    { id: 1, message: 'Welcome to Funspot Club! Your dashboard is ready.', timestamp: '1 day ago', read: true, type: 'system' },
    { id: 2, message: 'Coach Davis posted new exam results for Intermediate Tricks.', timestamp: '2 days ago', read: false, type: 'exam' }
];

const initialActivities: Activity[] = [
    { id: 'act_01', name: 'Skating', type: 'Outdoor', description: 'Roller and inline skating sessions for all levels.' },
    { id: 'act_02', name: 'Chess', type: 'Indoor', description: 'Strategic board game club for developing critical thinking.' },
    { id: 'act_03', name: 'Swimming', type: 'Outdoor', description: 'Lessons in our heated pool, from beginners to advanced swimmers.' },
];

const mockEvents: ClubEvent[] = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() is 0-indexed
    const monthStr = month.toString().padStart(2, '0');
    return [
        { id: 'evt_01', title: 'Skate Jam', date: `${year}-${monthStr}-15`, description: 'Annual skate jam competition. All levels welcome. Prizes for best trick and best style.' },
        { id: 'evt_02', title: 'Club Photoshoot', date: `${year}-${monthStr}-22`, description: 'Official club photoshoot for the new season. Wear your club gear!' },
        { id: 'evt_03', title: 'End of Month BBQ', date: `${year}-${monthStr}-28`, description: 'Join us for a casual BBQ to celebrate a great month of skating. Food and drinks provided.' },
        { id: 'evt_04', title: 'Guest Coach Session', date: `${year}-${monthStr}-15`, description: 'A special session with a professional guest coach. Limited spots available.' },
    ];
})();

const mockTrainingReports: TrainingReport[] = [
    { id: 'tr_01', athlete_id: 'user_04', date: '2024-03-15', score: 65, notes: 'Good balance.', status: 'Approved' },
    { id: 'tr_02', athlete_id: 'user_04', date: '2024-04-15', score: 72, notes: 'Improving speed.', status: 'Approved' },
    { id: 'tr_03', athlete_id: 'user_04', date: '2024-05-15', score: 78, notes: 'Better turns.', status: 'Pending' },
    { id: 'tr_04', athlete_id: 'user_04', date: '2024-06-15', score: 85, notes: 'Consistent performance.', status: 'Approved' },
    { id: 'tr_05', athlete_id: 'user_05', date: '2024-06-20', score: 90, notes: 'Excellent ollie technique.', status: 'Pending' },
];

// --- HELPER COMPONENTS ---

const Modal: FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const Toast: FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(message.id), 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className={`toast toast-${message.type}`}>
      <p>{message.message}</p>
      <button onClick={() => onDismiss(message.id)} className="toast-close-btn"><XMarkIcon /></button>
    </div>
  );
};

const RoleBadge: FC<{ role: Role }> = ({ role }) => <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>;
const SkillBadge: FC<{ level: SkillLevel }> = ({ level }) => <span className={`skill-badge skill-${level.toLowerCase()}`}>{level}</span>;

const LoadingSpinner: FC = () => (
    <div className="loading-overlay">
        <div className="spinner"></div>
    </div>
);

const ClubLogo: FC<{ className?: string }> = ({ className }) => (
    <div className={`club-logo ${className || ''}`}>
        <SkateIcon />
        <h3>FUNSPOT</h3>
    </div>
);


// --- MAIN FEATURE COMPONENTS ---

const AddEditUserModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit: User | null;
  users: User[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  currentUser: User | null;
}> = ({ isOpen, onClose, onSave, userToEdit, users, addToast, currentUser }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const isSelfEdit = useMemo(() => currentUser?.id === userToEdit?.id, [currentUser, userToEdit]);

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
      setImagePreview(userToEdit.photo_url);
    } else {
      const newUserId = `user_${String(Date.now()).slice(-4)}`;
      const newPhotoUrl = `https://i.pravatar.cc/150?u=${newUserId}`;
      setFormData({
        id: newUserId,
        created_at: new Date().toISOString().split('T')[0],
        photo_url: newPhotoUrl,
      });
      setImagePreview(newPhotoUrl);
    }
  }, [userToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
            ...(prev[parent as keyof typeof prev] as object || {}),
            [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setFormData(prev => ({ ...prev, photo_url: result }));
        };
        // FIX: Corrected typo from `readDataURL` to `readAsDataURL`.
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role || !formData.dob) {
      addToast('Please fill all required fields.', 'error');
      return;
    }
    if (!userToEdit && !formData.password) {
        addToast('Please set a temporary password for the new user.', 'error');
        return;
    }
    onSave(formData as User);
    onClose();
  };

  const parentOptions = useMemo(() => users.filter(u => u.role === 'Parent'), [users]);
  const coachOptions = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>{isSelfEdit ? 'Edit My Profile' : (userToEdit ? 'Edit User Profile' : 'Add New User')}</h3>
          <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input name="name" value={formData.name || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required /></div>
          </div>
          <div className="form-grid">
             <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} required /></div>
             {!isSelfEdit && (
                <div className="form-group"><label>Role</label><select name="role" value={formData.role || ''} onChange={handleChange} required><option value="">Select Role</option><option>Admin</option><option>Manager</option><option>Coach</option><option>Parent</option><option>Athlete</option></select></div>
             )}
          </div>
          {!userToEdit && !isSelfEdit && (
            <div className="form-group">
                <label>Temporary Password</label>
                <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required />
            </div>
          )}
          {formData.role === 'Athlete' && (
            <div className="form-grid">
              {!isSelfEdit && (
                <>
                  <div className="form-group"><label>Parent/Guardian</label><select name="parent_id" value={formData.parent_id || ''} onChange={handleChange}><option value="">Assign Parent</option>{parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  <div className="form-group"><label>Coach</label><select name="coach_id" value={formData.coach_id || ''} onChange={handleChange}><option value="">Assign Coach</option>{coachOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                </>
              )}
              <div className="form-group"><label>Skill Level</label><select name="skill_level" value={formData.skill_level || ''} onChange={handleChange}><option value="">Select Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
            </div>
          )}
          <div className="form-group"><label>Phone Number</label><input name="phone" value={formData.phone || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Address</label><input name="address" value={formData.address || ''} onChange={handleChange} /></div>
          <div className="form-grid">
            <div className="form-group"><label>Emergency Contact Name</label><input name="emergencyContact.name" value={formData.emergencyContact?.name || ''} onChange={handleChange} /></div>
            <div className="form-group"><label>Emergency Contact Phone</label><input name="emergencyContact.phone" value={formData.emergencyContact?.phone || ''} onChange={handleChange} /></div>
          </div>
          <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea>
          </div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div className="photo-upload-container">
                <img src={imagePreview || 'https://i.pravatar.cc/150'} alt="Profile Preview" className="profile-preview" />
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{userToEdit ? 'Save Changes' : 'Create User'}</button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteConfirmationModal: FC<{
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    itemName: string
}> = ({ isOpen, onClose, onConfirm, itemName }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="modal-header">
            <h3>Confirm Deletion</h3>
            <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <div style={{ textAlign: 'center' }}>
                <ExclamationTriangleIcon style={{ width: 48, height: 48, color: 'var(--red)', margin: '0 auto 1rem' }} />
                <p>Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.</p>
            </div>
        </div>
        <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" style={{ backgroundColor: 'var(--red)' }} onClick={onConfirm}>Delete</button>
        </div>
    </Modal>
);

const ProgramDetailsModal: FC<{
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
    onBook: (program: Program) => void;
    onWaitlist: (program: Program) => void;
    isBooked: boolean;
    isOnWaitlist: boolean;
}> = ({ program, isOpen, onClose, onBook, onWaitlist, isBooked, isOnWaitlist }) => {
    if (!program) return null;

    const coach = initialUsers.find(u => u.id === program.coach_id);
    const isFull = program.enrolled_count >= program.capacity;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="modal-header">
                <h3>{program.title}</h3>
                <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
            </div>
            <div className="modal-body program-details">
                <p>{program.description}</p>
                <p><strong>Coach:</strong> {coach?.name || 'N/A'}</p>
                <p><strong>Price:</strong> {program.currency} {program.price_cents / 100}</p>
                <p><strong>Schedule:</strong> {program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
                <p><strong>Skill Level:</strong> <SkillBadge level={program.skill_level} /></p>
                <p><strong>Capacity:</strong> {program.enrolled_count} / {program.capacity}</p>
                {isFull && <p className="waitlist-info">This program is currently full.</p>}
            </div>
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                {isBooked ? (
                     <button className="btn btn-primary" disabled>Already Enrolled</button>
                ) : isFull ? (
                    isOnWaitlist ? (
                        <button className="btn" disabled>On Waitlist</button>
                    ) : (
                        <button type="button" className="btn btn-primary" onClick={() => onWaitlist(program)}>Join Waitlist</button>
                    )
                ) : (
                    <button type="button" className="btn btn-primary" onClick={() => onBook(program)}>Book Now</button>
                )}
            </div>
        </Modal>
    );
};

const PaymentModal: FC<{
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ program, isOpen, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('mpesa');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onConfirm();
        }, 2000);
    };

    if (!program) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="modal-header">
                <h3>Complete Your Booking</h3>
                 <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
            </div>
            <div className="modal-body">
                <div className="payment-summary">
                    <h4>{program.title}</h4>
                    <p className="price">{program.currency} {program.price_cents / 100}</p>
                </div>
                <div className="payment-tabs">
                    <button onClick={() => setPaymentMethod('mpesa')} className={paymentMethod === 'mpesa' ? 'active' : ''}><PhoneIcon /> M-Pesa</button>
                    <button onClick={() => setPaymentMethod('card')} className={paymentMethod === 'card' ? 'active' : ''}><CreditCardIcon /> Card</button>
                </div>
                {paymentMethod === 'mpesa' && (
                    <div className="mpesa-instructions">
                        <p>To pay with M-Pesa, please use your phone and follow the on-screen prompts.</p>
                        <p>A request will be sent to your registered number shortly.</p>
                    </div>
                )}
                {paymentMethod === 'card' && (
                    <div className="form-group">
                        <label>Card details are not required for this demo.</label>
                    </div>
                )}
            </div>
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ${program.currency} ${program.price_cents / 100}`}
                </button>
            </div>
        </Modal>
    );
};

const BookingConfirmationModal: FC<{
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({ program, isOpen, onClose }) => {
    if (!program) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="booking-confirmation">
                <CheckCircleIcon />
                <h3>Booking Confirmed!</h3>
                <p>You have successfully enrolled in the program. We're excited to see you!</p>
                <div className="confirmation-details">
                    <div><span>Program</span> <span>{program.title}</span></div>
                    <div><span>Amount Paid</span> <span>{program.currency} {program.price_cents / 100}</span></div>
                    <div><span>Date</span> <span>{new Date().toLocaleDateString()}</span></div>
                </div>
                <button className="btn btn-primary btn-full" onClick={onClose}>Done</button>
            </div>
        </Modal>
    );
};

const EventDetailsModal: FC<{
    date: Date;
    events: ClubEvent[];
    isOpen: boolean;
    onClose: () => void;
}> = ({ date, events, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="modal-header">
                <h3>Events for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
            </div>
            <div className="modal-body">
                {events.length > 0 ? (
                    <ul className="event-details-list">
                        {events.map(event => (
                            <li key={event.id} className="event-item">
                                <h4>{event.title}</h4>
                                <p>{event.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : <p>No events scheduled for this day.</p>}
            </div>
        </Modal>
    );
};

// ... more components to follow
const EnrolledProgramsWidget: FC<{ currentUser: User | null, transactions: Transaction[], programs: Program[], users: User[] }> = ({ currentUser, transactions, programs, users }) => {
    const enrolledPrograms = useMemo(() => {
        if (!currentUser) return [];

        if (currentUser.role === 'Athlete') {
            return transactions
                .filter(t => t.userId === currentUser.id)
                .map(t => programs.find(p => p.id === t.programId))
                .filter(Boolean) as Program[];
        }

        if (currentUser.role === 'Parent') {
            const children = users.filter(u => u.parent_id === currentUser.id);
            const childIds = children.map(c => c.id);
            return transactions
                .filter(t => childIds.includes(t.userId))
                .map(t => {
                    const program = programs.find(p => p.id === t.programId);
                    const child = users.find(u => u.id === t.userId);
                    return program ? { ...program, childName: child?.name } : null;
                })
                .filter(Boolean) as (Program & { childName?: string })[];
        }

        return [];
    }, [currentUser, transactions, programs, users]);

    if (currentUser?.role !== 'Athlete' && currentUser?.role !== 'Parent') return null;
    if (enrolledPrograms.length === 0) return null;

    return (
        <div className="widget">
            <div className="widget-header">
                <h3>My Enrolled Programs</h3>
            </div>
            <div className="program-list">
                {enrolledPrograms.map(p => (
                    <div key={p.id} className="program-list-item">
                        <div className="program-item-header">
                            {/* FIX: Use `as any` to bypass TypeScript error for `childName` property which exists on a union type. */}
                            <h4>{p.title} {currentUser.role === 'Parent' && (p as any).childName && `(${(p as any).childName})`}</h4>
                            <SkillBadge level={p.skill_level} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CalendarWidget: FC<{ events: ClubEvent[], onDayClick: (date: Date) => void }> = ({ events, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();

    const days = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            const day = new Date(event.date).getDate() + 1; // Adjust for date parsing issues
            if (!acc[day]) acc[day] = [];
            acc[day].push(event);
            return acc;
        }, {} as Record<number, ClubEvent[]>);
    }, [events]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="widget">
            <div className="widget-header">
                <button className="btn-icon" onClick={() => changeMonth(-1)}>&lt;</button>
                <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button className="btn-icon" onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {weekDays.map(day => <div key={day} className="calendar-header">{day}</div>)}
                {emptyDays.map(i => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                {days.map(day => {
                    const hasEvent = !!eventsByDate[day];
                    const dayEvents = eventsByDate[day] || [];
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    return (
                        <div key={day} className={`calendar-day ${hasEvent ? 'event-day' : ''}`} onClick={() => hasEvent && onDayClick(date)}>
                            {day}
                            {hasEvent && (
                                <div className="event-dots">
                                    {dayEvents.slice(0, 3).map((_, i) => <div key={i} className="dot"></div>)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
// ... rest of the components and the main App component ...

const AthleteDashboard: FC<{ currentUser: User | null, transactions: Transaction[], programs: Program[], users: User[] }> = ({ currentUser, transactions, programs, users }) => {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsEventModalOpen(true);
    };
    
    const eventsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const dateString = selectedDate.toISOString().split('T')[0];
        return mockEvents.filter(e => e.date === dateString);
    }, [selectedDate]);


    return (
        <div className="dashboard-grid">
            <EnrolledProgramsWidget currentUser={currentUser} transactions={transactions} programs={programs} users={users} />
            <CalendarWidget events={mockEvents} onDayClick={handleDayClick} />
            {selectedDate && <EventDetailsModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} date={selectedDate} events={eventsForSelectedDate} />}
        </div>
    )
}

const ParentDashboard: FC<{ currentUser: User, users: User[], transactions: Transaction[], programs: Program[] }> = ({ currentUser, users, transactions, programs }) => {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsEventModalOpen(true);
    };
    
    const eventsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const dateString = selectedDate.toISOString().split('T')[0];
        return mockEvents.filter(e => e.date === dateString);
    }, [selectedDate]);

    return (
        <div className="dashboard-grid">
            <EnrolledProgramsWidget currentUser={currentUser} transactions={transactions} programs={programs} users={users} />
             <CalendarWidget events={mockEvents} onDayClick={handleDayClick} />
            {selectedDate && <EventDetailsModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} date={selectedDate} events={eventsForSelectedDate} />}
        </div>
    )
}


export const App: FC = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [programs, setPrograms] = useState<Program[]>(initialPrograms);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [waitlist, setWaitlist] = useState<Record<string, string[]>>({}); // programId: [userId]
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    
    const [isProgramDetailsModalOpen, setIsProgramDetailsModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [programToPay, setProgramToPay] = useState<Program | null>(null);

    const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] = useState(false);
    const [confirmedProgram, setConfirmedProgram] = useState<Program | null>(null);

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

    useEffect(() => {
        document.body.className = `${theme}-theme`;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const addToast = (message: string, type: ToastMessage['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const handleLogin = (user: User) => {
        setCurrentUser(user);
    }
    
    const handleLogout = () => {
        setCurrentUser(null);
    }
    
    const handleSaveUser = (user: User) => {
        const isNew = !users.some(u => u.id === user.id);
        if (isNew) {
            setUsers(prev => [...prev, user]);
            addToast('User created successfully!', 'success');
        } else {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            addToast('User updated successfully!', 'success');
             if (currentUser?.id === user.id) {
                setCurrentUser(user);
            }
        }
    };
    
    const handleBookProgram = (program: Program) => {
        setProgramToPay(program);
        setIsProgramDetailsModalOpen(false);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentConfirm = () => {
        if (!programToPay || !currentUser) return;
        
        const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            userId: currentUser.id,
            programId: programToPay.id,
            amount_cents: programToPay.price_cents,
            currency: programToPay.currency,
            method: 'Mpesa',
            status: 'Completed',
            created_at: new Date().toISOString()
        };
        setTransactions(prev => [...prev, newTransaction]);
        setPrograms(prev => prev.map(p => p.id === programToPay.id ? {...p, enrolled_count: p.enrolled_count + 1} : p));

        setConfirmedProgram(programToPay);
        setIsPaymentModalOpen(false);
        setIsBookingConfirmationOpen(true);
        addToast(`Successfully booked ${programToPay.title}`, 'success');
    };

    const handleAddToWaitlist = (program: Program) => {
        if (!currentUser) return;
        setWaitlist(prev => ({
            ...prev,
            [program.id]: [...(prev[program.id] || []), currentUser.id]
        }));
        setIsProgramDetailsModalOpen(false);
        addToast(`You've been added to the waitlist for ${program.title}`, 'info');
    };

    const isProgramBooked = (programId: string): boolean => {
        if (!currentUser) return false;
        if(currentUser.role === 'Parent') {
            const children = users.filter(u => u.parent_id === currentUser.id);
            const childrenIds = children.map(c => c.id);
            return transactions.some(t => t.programId === programId && childrenIds.includes(t.userId));
        }
        return transactions.some(t => t.programId === programId && t.userId === currentUser.id);
    };

    const isOnWaitlist = (programId: string): boolean => {
        if (!currentUser) return false;
        return waitlist[programId]?.includes(currentUser.id) || false;
    };
    
    const eventsForSelectedDate = useMemo(() => {
        if (!selectedEventDate) return [];
        const dateString = selectedEventDate.toISOString().split('T')[0];
        return mockEvents.filter(e => e.date === dateString);
    }, [selectedEventDate]);


    if (!currentUser) {
        return (
            <div className={`${theme}-theme`} style={{height: '100%'}}>
              {/* Dummy login screen for now, replace with a real one */}
              <div className="auth-container">
                  <div className="auth-box">
                      <ClubLogo className="auth-logo" />
                      <h2>Welcome to Funspot Club</h2>
                      <p>Please select your user to login.</p>
                      <div className="login-user-list">
                          {users.map(user => (
                              <button key={user.id} className="btn btn-secondary btn-full" onClick={() => handleLogin(user)}>
                                  Login as {user.name} ({user.role})
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
            </div>
        );
    }
    
    const openProgramDetails = (program: Program) => {
        setSelectedProgram(program);
        setIsProgramDetailsModalOpen(true);
    };
    
    const openEditProfileModal = () => {
        setUserToEdit(currentUser);
        setIsUserModalOpen(true);
    }

    const renderDashboard = () => {
        switch (currentUser.role) {
            case 'Athlete':
                return <AthleteDashboard currentUser={currentUser} transactions={transactions} programs={programs} users={users} />;
            case 'Parent':
                return <ParentDashboard currentUser={currentUser} users={users} transactions={transactions} programs={programs} />;
            default:
                return (
                    <div className="widget">
                        <h3>Dashboard for {currentUser.role}</h3>
                        <p>This dashboard is under construction.</p>
                        <ProgramListWidget programs={programs} openProgramDetails={openProgramDetails}/>
                    </div>
                );
        }
    }
    
    const ProgramListWidget: FC<{programs: Program[], openProgramDetails: (program: Program) => void}> = ({programs, openProgramDetails}) => (
        <div className="widget">
            <div className="widget-header">
                <h3>Available Programs</h3>
            </div>
            <div className="program-list">
                {programs.map(p => {
                    const isFull = p.enrolled_count >= p.capacity;
                    const nearingCapacity = p.enrolled_count / p.capacity >= 0.8 && !isFull;
                    return (
                        <div key={p.id} className={`program-list-item ${isFull ? 'full' : ''} ${nearingCapacity ? 'nearing-capacity' : ''}`}>
                            <div className="program-item-header">
                                <h4>{p.title}</h4>
                                {isFull ? <span className='capacity-full'>FULL</span> : nearingCapacity && <span className='capacity-warning'>FILLING UP</span>}
                            </div>
                            <p>{p.description.substring(0, 50)}...</p>
                             <div className="program-item-actions">
                                <button className="btn btn-sm btn-secondary" onClick={() => openProgramDetails(p)}>View Details</button>
                             </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    

    return (
        <div className="dashboard-layout">
            <main className="main-content">
                <header className="header">
                    <div className="header-content">
                        <ClubLogo />
                        <div className="header-right">
                            <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            </button>
                            <div className="header-user-info">
                                <span>{currentUser.name}</span>
                                <img src={currentUser.photo_url} alt="avatar" className="header-avatar" />
                                <button className="btn-icon" title="Edit Profile" onClick={openEditProfileModal}><PencilIcon /></button>
                            </div>
                            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </header>
                <div className="content-area">
                    {renderDashboard()}
                </div>
            </main>
            
            {/* --- MODALS --- */}
            <AddEditUserModal 
                isOpen={isUserModalOpen} 
                onClose={() => setIsUserModalOpen(false)} 
                onSave={handleSaveUser}
                userToEdit={userToEdit}
                users={users}
                addToast={addToast}
                currentUser={currentUser}
            />

            <ProgramDetailsModal 
                isOpen={isProgramDetailsModalOpen}
                onClose={() => setIsProgramDetailsModalOpen(false)}
                program={selectedProgram}
                onBook={handleBookProgram}
                onWaitlist={handleAddToWaitlist}
                isBooked={selectedProgram ? isProgramBooked(selectedProgram.id) : false}
                isOnWaitlist={selectedProgram ? isOnWaitlist(selectedProgram.id) : false}
            />
            
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                program={programToPay}
                onConfirm={handlePaymentConfirm}
            />
            
            <BookingConfirmationModal
                isOpen={isBookingConfirmationOpen}
                onClose={() => setIsBookingConfirmationOpen(false)}
                program={confirmedProgram}
            />
            
            {selectedEventDate && <EventDetailsModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                date={selectedEventDate}
                events={eventsForSelectedDate}
            />}

            {/* --- TOASTS --- */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast} onDismiss={(id) => setToasts(p => p.filter(t => t.id !== id))} />
                ))}
            </div>
        </div>
    );
}
