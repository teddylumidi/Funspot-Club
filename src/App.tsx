
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
const ExclamationTriangleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>;
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
          {!userToEdit && (
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
          <div className="form-group"><label>Bio</label><textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea></div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div className="photo-upload-container">
                {imagePreview && <img src={imagePreview} alt="Profile Preview" className="profile-preview" />}
                <input type="file" accept="image/*" onChange={handleImageChange}/>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

const AddEditProgramModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Program) => void;
  programToEdit: Program | null;
  users: User[];
}> = ({ isOpen, onClose, onSave, programToEdit, users }) => {
  const [formData, setFormData] = useState<Partial<Program>>({});

  useEffect(() => {
    if (programToEdit) {
      setFormData(programToEdit);
    } else {
      setFormData({
        id: `prog_${String(Date.now()).slice(-4)}`,
        active: true,
        enrolled_count: 0,
        schedule: [{ day: 'Mon', time: '16:00' }],
      });
    }
  }, [programToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };
  
  const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
    const newSchedule = [...(formData.schedule || [])];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleAddSchedule = () => {
    const newSchedule = [...(formData.schedule || []), { day: 'Wed', time: '16:00' }];
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedule = (formData.schedule || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Program);
    onClose();
  };

  const coachOptions = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>{programToEdit ? 'Edit Program' : 'Add New Program'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <div className="form-group"><label>Program Title</label><input name="title" value={formData.title || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} required /></div>
            <div className="form-grid">
                <div className="form-group"><label>Coach</label><select name="coach_id" value={formData.coach_id || ''} onChange={handleChange} required><option value="">Assign Coach</option>{coachOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Price (KES)</label><input type="number" name="price_cents" value={(formData.price_cents || 0) / 100} onChange={e => setFormData(prev => ({ ...prev, price_cents: Number(e.target.value) * 100 }))} required/></div>
            </div>
             <div className="form-grid">
                <div className="form-group"><label>Duration (minutes)</label><input type="number" name="duration_minutes" value={formData.duration_minutes || ''} onChange={handleChange} required /></div>
                <div className="form-group"><label>Capacity</label><input type="number" name="capacity" value={formData.capacity || ''} onChange={handleChange} required /></div>
            </div>
            <div className="form-grid">
                <div className="form-group"><label>Skill Level</label><select name="skill_level" value={formData.skill_level || ''} onChange={handleChange} required><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                <div className="form-group"><label>Location</label><select name="location_type" value={formData.location_type || ''} onChange={handleChange} required><option>Indoor</option><option>Outdoor</option></select></div>
            </div>

            <div className="form-group">
                <label>Schedule</label>
                <div className="schedule-editor">
                    {formData.schedule?.map((s, index) => (
                        <div key={index} className="schedule-item">
                            <select value={s.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)}>
                                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                            <input type="time" value={s.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} />
                            <button type="button" className="btn-icon" onClick={() => handleRemoveSchedule(index)}><TrashIcon /></button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSchedule}>Add Session Time</button>
                </div>
            </div>

        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Program</button>
        </div>
      </form>
    </Modal>
  );
};

const ProgramDetailsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  coach?: User;
  onBook: (program: Program) => void;
  onWaitlist: (program: Program) => void;
  currentUser: User | null;
  waitlistPosition: number | null;
}> = ({ isOpen, onClose, program, coach, onBook, onWaitlist, currentUser, waitlistPosition }) => {
  if (!program) return null;
  const isBookable = currentUser && ['Parent', 'Athlete'].includes(currentUser.role);
  const isFull = program.enrolled_count >= program.capacity;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="modal-header">
        <h3>{program.title}</h3>
        <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
      </div>
      <div className="modal-body program-details">
        <p>{program.description}</p>
        <p><strong>Coach:</strong> {coach?.name || 'N/A'}</p>
        <p><strong>Price:</strong> {program.currency} {program.price_cents / 100}</p>
        <p><strong>Duration:</strong> {program.duration_minutes} minutes</p>
        <p><strong>Skill Level:</strong> <SkillBadge level={program.skill_level} /></p>
        <p><strong>Location:</strong> {program.location_type}</p>
        <p><strong>Schedule:</strong> {program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
        <p><strong>Availability:</strong> {program.enrolled_count} / {program.capacity} spots filled</p>
        {isFull && waitlistPosition && <p className="waitlist-info">You are position #{waitlistPosition} on the waitlist.</p>}
      </div>
      <div className="modal-actions">
        {isBookable && (
          isFull ? (
              <button className="btn btn-secondary" onClick={() => onWaitlist(program)} disabled={!!waitlistPosition}>
                  {waitlistPosition ? 'On Waitlist' : 'Join Waitlist'}
              </button>
          ) : (
              <button className="btn btn-primary" onClick={() => onBook(program)}>
                  Book Now
              </button>
          )
        )}
      </div>
    </Modal>
  );
};

const PaymentModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onConfirmPayment: (method: 'Card' | 'Mpesa') => void;
}> = ({ isOpen, onClose, program, onConfirmPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Mpesa'>('Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      setError('');
      // Simulate API call
      setTimeout(() => {
          // Simulate a random failure for demonstration
          if (Math.random() < 0.1) {
              setError('Payment failed. Please try again.');
              setIsProcessing(false);
          } else {
              onConfirmPayment(paymentMethod);
              setIsProcessing(false);
          }
      }, 2000);
  };
  
  if (!program) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handlePayment}>
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
                <button type="button" className={paymentMethod === 'Card' ? 'active' : ''} onClick={() => setPaymentMethod('Card')}><CreditCardIcon /> Card</button>
                <button type="button" className={paymentMethod === 'Mpesa' ? 'active' : ''} onClick={() => setPaymentMethod('Mpesa')}><PhoneIcon/> Mpesa</button>
            </div>
            {paymentMethod === 'Card' ? (
                <div className="payment-form">
                    <div className="form-group"><label>Card Number</label><input placeholder="0000 0000 0000 0000" required/></div>
                    <div className="form-grid">
                        <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" required /></div>
                        <div className="form-group"><label>CVV</label><input placeholder="123" required /></div>
                    </div>
                </div>
            ) : (
                <div className="payment-form">
                    <div className="form-group"><label>Mpesa Phone Number</label><input placeholder="e.g., 254712345678" required /></div>
                    <p className="mpesa-instructions">You will receive an STK push on your phone to complete the payment.</p>
                </div>
            )}
            {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ${program.currency} ${program.price_cents / 100}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const AddEditActivityModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: Activity) => void;
    activityToEdit: Activity | null;
}> = ({ isOpen, onClose, onSave, activityToEdit }) => {
    const [formData, setFormData] = useState<Partial<Activity>>({});

    useEffect(() => {
        if (activityToEdit) {
            setFormData(activityToEdit);
        } else {
            setFormData({
                id: `act_${String(Date.now()).slice(-4)}`,
            });
        }
    }, [activityToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Activity);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h3>{activityToEdit ? 'Edit Activity' : 'Add New Activity'}</h3>
                    <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group"><label>Activity Name</label><input name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Type</label><select name="type" value={formData.type || ''} onChange={handleChange} required><option value="">Select Type</option><option>Indoor</option><option>Outdoor</option></select></div>
                    <div className="form-group"><label>Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} required></textarea></div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Activity</button>
                </div>
            </form>
        </Modal>
    );
};

const EventDetailsModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    events: ClubEvent[] | null;
}> = ({ isOpen, onClose, events }) => {
    if (!events || events.length === 0) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="modal-header">
                <h3>Events on {new Date(events[0].date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
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
        </Modal>
    );
};

const AboutUsModal: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
        <div className="modal-header">
            <h3>About Funspot Skating Club</h3>
            <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <h4>Our Mission</h4>
            <p>To provide a safe, fun, and inclusive environment for skaters of all ages and skill levels to learn, grow, and connect with the community.</p>
            <h4>Our History</h4>
            <p>Founded in 2023, Funspot started as a small weekend gathering of skate enthusiasts. We've since grown into a vibrant club offering professional coaching, diverse programs, and regular community events. We believe in the power of skating to build confidence, discipline, and lifelong friendships.</p>
            <h4>What We Offer</h4>
            <ul>
                <li>Professional coaching for all skill levels.</li>
                <li>A wide range of programs from skating to chess.</li>
                <li>Regular events, competitions, and social gatherings.</li>
                <li>A state-of-the-art indoor facility and a spacious outdoor park.</li>
            </ul>
        </div>
    </Modal>
);

const ContactUsModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    addToast: (message: string, type: ToastMessage['type']) => void;
}> = ({ isOpen, onClose, addToast }) => {
    const [isSending, setIsSending] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            addToast('Your message has been sent!', 'success');
            onClose();
        }, 1500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h3>Contact Us</h3>
                    <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
                </div>
                <div className="modal-body">
                    <p>Have a question or feedback? Fill out the form below and we'll get back to you soon.</p>
                    <div className="form-group"><label>Your Name</label><input name="name" required /></div>
                    <div className="form-group"><label>Your Email</label><input type="email" name="email" required /></div>
                    <div className="form-group"><label>Subject</label><input name="subject" required /></div>
                    <div className="form-group"><label>Message</label><textarea name="message" rows={4} required></textarea></div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSending}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const BookingConfirmationModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    details: { program: Program; method: string } | null;
}> = ({ isOpen, onClose, details }) => {
    if (!isOpen || !details) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="booking-confirmation">
                <CheckCircleIcon />
                <h3>Booking Confirmed!</h3>
                <p>You're all set for <strong>{details.program.title}</strong>. We're excited to see you!</p>
                <div className="confirmation-details">
                    <div><span>Amount Paid:</span><span>{details.program.currency} {details.program.price_cents / 100}</span></div>
                    <div><span>Payment Method:</span><span>{details.method}</span></div>
                </div>
                <button className="btn btn-primary btn-full" onClick={onClose}>Done</button>
            </div>
        </Modal>
    );
};

const UserManagementWidget: FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAdd: () => void;
  onImpersonate: (user: User) => void;
  currentUser: User;
}> = ({ users, onEdit, onDelete, onAdd, onImpersonate, currentUser }) => {
  const [filter, setFilter] = useState<Role | 'All'>('All');

  const filteredUsers = useMemo(() => {
    if (filter === 'All') return users;
    return users.filter(user => user.role === filter);
  }, [filter, users]);

  return (
    <div className="widget widget-col-span-2 widget-row-span-2">
      <div className="widget-header">
        <h3>User Management</h3>
        <div className="widget-controls">
            <select value={filter} onChange={e => setFilter(e.target.value as Role | 'All')}>
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Coach">Coach</option>
                <option value="Parent">Parent</option>
                <option value="Athlete">Athlete</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={onAdd}><UserPlusIcon /> Add User</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Role</th><th>Created On</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
                const isTargetAdmin = user.role === 'Admin';
                const isManagerActioningAdmin = currentUser.role === 'Manager' && isTargetAdmin;
                const isSelf = currentUser.id === user.id;

                return (
                  <tr key={user.id}>
                    <td data-label="User"><div className="user-name-cell"><img src={user.photo_url} alt={user.name} className="table-avatar" /><span>{user.name}</span></div></td>
                    <td data-label="Role"><RoleBadge role={user.role} /></td>
                    <td data-label="Created On">{user.created_at}</td>
                    <td data-label="Contact">{user.email}</td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button className="btn-icon" disabled={isSelf} onClick={() => onImpersonate(user)} aria-label={`Impersonate ${user.name}`} title={isSelf ? "Cannot impersonate yourself" : "Impersonate User"}><EyeIcon /></button>
                        <button className="btn-icon" disabled={isManagerActioningAdmin} onClick={() => onEdit(user)} aria-label={`Edit ${user.name}`} title={isManagerActioningAdmin ? "Managers cannot edit Admins" : "Edit User"}><PencilIcon /></button>
                        <button className="btn-icon" disabled={isManagerActioningAdmin || isSelf} onClick={() => onDelete(user.id)} aria-label={`Delete ${user.name}`} title={isManagerActioningAdmin ? "Managers cannot delete Admins" : (isSelf ? "Cannot delete yourself" : "Delete User")}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProgramManagementWidget: FC<{
  programs: Program[],
  users: User[],
  onViewDetails: (program: Program) => void,
  onEditProgram: (program: Program) => void,
  onAddProgram: () => void,
  currentUser: User,
}> = ({ programs, users, onViewDetails, onEditProgram, onAddProgram, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<SkillLevel | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | LocationType>('All');
  
  const canManage = ['Admin', 'Manager'].includes(currentUser.role);

  const filteredPrograms = useMemo(() => {
    const coachMap = new Map(users.filter(u => u.role === 'Coach').map(c => [c.id, c.name.toLowerCase()]));
    return programs.filter(p => {
        const coachName = coachMap.get(p.coach_id) || '';
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch = p.title.toLowerCase().includes(lowerSearch) || coachName.includes(lowerSearch);
        const matchesSkill = skillFilter === 'All' || p.skill_level === skillFilter;
        const matchesLocation = locationFilter === 'All' || p.location_type === locationFilter;

        return matchesSearch && matchesSkill && matchesLocation;
    });
  }, [programs, users, searchTerm, skillFilter, locationFilter]);
  
  const getCoachName = (coachId: string) => users.find(u => u.id === coachId)?.name || 'Unknown';
  
  const getProgramItemClass = (p: Program) => {
    const percentage = p.capacity > 0 ? (p.enrolled_count / p.capacity) * 100 : 0;
    if (percentage >= 100) return 'program-list-item full';
    if (percentage > 75) return 'program-list-item nearing-capacity';
    return 'program-list-item';
  }

  return (
    <div className="widget widget-col-span-2 widget-row-span-2">
      <div className="widget-header">
        <h3>Available Programs</h3>
        {canManage && <button className="btn btn-primary btn-sm" onClick={onAddProgram}><PlusCircleIcon/> Add Program</button>}
      </div>
       <div className="program-filters">
            <input 
                type="text" 
                placeholder="Search by title or coach..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
            />
            <select value={skillFilter} onChange={e => setSkillFilter(e.target.value as SkillLevel | 'All')}>
                <option value="All">All Skills</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All</option>
            </select>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value as LocationType | 'All')}>
                <option value="All">All Locations</option><option>Indoor</option><option>Outdoor</option>
            </select>
        </div>
      <div className="program-list">
        {filteredPrograms.map(p => (
          <div key={p.id} className={getProgramItemClass(p)}>
            <div className="program-item-header">
                <h4>{p.title} <SkillBadge level={p.skill_level} /></h4>
                {p.enrolled_count / p.capacity > 0.75 && p.enrolled_count < p.capacity && <span className="capacity-warning">Filling up fast!</span>}
                {p.enrolled_count >= p.capacity && <span className="capacity-full">Full</span>}
            </div>
            <p>Coach: {getCoachName(p.coach_id)} | Location: {p.location_type}</p>
            <p>Capacity: {p.enrolled_count}/{p.capacity}</p>
            <div className="program-item-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(p)}>View Details</button>
              {canManage && <button className="btn btn-secondary btn-sm" onClick={() => onEditProgram(p)}>Edit</button>}
            </div>
          </div>
        ))}
        {filteredPrograms.length === 0 && <p>No programs match your criteria.</p>}
      </div>
    </div>
  );
};

const TransactionLogWidget: FC<{ transactions: Transaction[], users: User[], programs: Program[] }> = ({ transactions, users, programs }) => {
    const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'N/A';
    const getProgramName = (id: string) => programs.find(p => p.id === id)?.title || 'N/A';

    return (
        <div className="widget widget-col-span-4">
            <div className="widget-header"><h3>Transaction Log</h3></div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Date</th><th>User</th><th>Program</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                    <tbody>
                        {transactions.slice().reverse().map(t => (
                            <tr key={t.id}>
                                <td data-label="Date">{t.created_at}</td>
                                <td data-label="User">{getUserName(t.userId)}</td>
                                <td data-label="Program">{getProgramName(t.programId)}</td>
                                <td data-label="Amount">{t.currency} {t.amount_cents / 100}</td>
                                <td data-label="Method">{t.method}</td>
                                <td data-label="Status"><span className="status-completed">{t.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsWidget: FC<{users: User[], transactions: Transaction[], programs: Program[]}> = ({ users, transactions }) => {
    const roleCounts = useMemo(() => users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<Role, number>), [users]);

    const weeklyRevenue = useMemo(() => {
        const weeks = [0, 0, 0, 0]; // 4 weeks ago, 3, 2, 1
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        transactions.forEach(t => {
            const diff = now - new Date(t.created_at).getTime();
            const weekIndex = Math.floor(diff / oneWeek);
            if (weekIndex < 4) {
                weeks[3 - weekIndex] += t.amount_cents / 100;
            }
        });
        return weeks;
    }, [transactions]);
    
    const maxRoleCount = Math.max(...Object.values(roleCounts), 1);
    const maxRevenue = Math.max(...weeklyRevenue, 1);

    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header"><h3>Club Analytics</h3></div>
            <div className="analytics-grid">
                <div className="stat-card chart-card">
                    <h4>User Roles</h4>
                    <div className="bar-chart">
                        {(Object.keys(roleCounts) as Role[]).sort().map((role) => (
                            <div key={role} className="chart-bar-wrapper">
                                <div className="bar" style={{ height: `${(roleCounts[role] / maxRoleCount) * 100}%` }} title={`${role}: ${roleCounts[role]}`}>
                                    <span className="bar-value">{roleCounts[role]}</span>
                                </div>
                                <div className="bar-label">{role}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="stat-card chart-card">
                    <h4>Revenue (Last 4 Weeks)</h4>
                     <div className="bar-chart">
                         {weeklyRevenue.map((rev, i) => (
                             <div key={i} className="chart-bar-wrapper">
                                 <div className="bar" style={{ height: `${(rev / maxRevenue) * 100}%`}} title={`Week ${i + 1}: KES ${rev.toLocaleString()}`}>
                                    <span className="bar-value-small">~{Math.round(rev/1000)}k</span>
                                 </div>
                                 <div className="bar-label">Wk {i+1}</div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};


const NotificationsWidget: FC<{ notifications: AppNotification[], onMarkAsRead: (id: number) => void }> = ({ notifications, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notifications-widget" ref={widgetRef}>
            <button className="btn-icon" onClick={() => setIsOpen(!isOpen)}>
                <BellIcon />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="dropdown-header"><h4>Notifications</h4></div>
                    <div className="dropdown-content">
                        {notifications.length === 0 ? <p className="no-notifications">No new notifications</p> :
                        notifications.map(n => (
                            <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`} onClick={() => onMarkAsRead(n.id)}>
                                <div className="notification-icon"><CheckCircleIcon/></div>
                                <div className="notification-body">
                                    <p>{n.message}</p>
                                    <span>{n.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const EventsCalendarWidget: FC<{ events: ClubEvent[], onDayClick: (day: number, year: number, month: number) => void }> = ({ events, onDayClick }) => {
    const [date, setDate] = useState(new Date());

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0=Sun, 1=Mon
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const eventsByDay = useMemo(() => {
        const map = new Map<number, ClubEvent[]>();
        events.forEach(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            if(eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear()){
                const day = eventDate.getDate();
                if (!map.has(day)) map.set(day, []);
                map.get(day)!.push(event);
            }
        });
        return map;
    }, [events, date]);

    const calendarDays = [];
    // Adjust for Monday start
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const eventsOnDay = eventsByDay.get(day);
        const eventCount = eventsOnDay?.length || 0;
        calendarDays.push(
            <div 
                key={day} 
                className={`calendar-day ${eventCount > 0 ? 'event-day' : ''}`}
                onClick={eventCount > 0 ? () => onDayClick(day, date.getFullYear(), date.getMonth()) : undefined}
            >
                <span>{day}</span>
                 {eventCount > 0 && (
                    <div className="event-dots">
                        {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => <div key={i} className="dot"></div>)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="widget">
            <div className="widget-header"><h3>{monthName} {year}</h3></div>
            <div className="calendar-grid">
                <div className="calendar-header">Mon</div>
                <div className="calendar-header">Tue</div>
                <div className="calendar-header">Wed</div>
                <div className="calendar-header">Thu</div>
                <div className="calendar-header">Fri</div>
                <div className="calendar-header">Sat</div>
                <div className="calendar-header">Sun</div>
                {calendarDays}
            </div>
        </div>
    );
};

const AthleteProgressWidget: FC<{ reports: TrainingReport[], athlete: User }> = ({ reports, athlete }) => {
    const athleteReports = useMemo(() => 
        reports.filter(r => r.athlete_id === athlete.id && r.status === 'Approved')
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), 
    [reports, athlete.id]);

    const maxScore = 100;

    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header"><h3>Progress: {athlete.name}</h3></div>
            <div className="progress-chart">
                {athleteReports.map(report => (
                    <div key={report.id} className="chart-bar-wrapper">
                        <div 
                            className="chart-bar" 
                            style={{ height: `${(report.score / maxScore) * 100}%`}}
                            title={`Score: ${report.score}`}
                        ></div>
                        <div className="chart-label">
                            {new Date(report.date + 'T00:00:00').toLocaleString('default', { month: 'short' })}
                        </div>
                    </div>
                ))}
                {athleteReports.length === 0 && <p>No approved training reports filed yet.</p>}
            </div>
        </div>
    );
};

const ParentPaymentsWidget: FC<{ transactions: Transaction[], parent: User, users: User[] }> = ({ transactions, parent, users }) => {
    const childrenIds = useMemo(() => users.filter(u => u.parent_id === parent.id).map(u => u.id), [users, parent]);
    
    const { totalPaid, outstanding } = useMemo(() => {
        let totalPaid = 0;
        let outstanding = 5000; // Mock outstanding
        transactions.forEach(t => {
            if (childrenIds.includes(t.userId)) {
                totalPaid += t.amount_cents;
            }
        });
        return { totalPaid: totalPaid / 100, outstanding: outstanding / 100 };
    }, [transactions, childrenIds]);

    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header"><h3>Family Payments Overview</h3></div>
            <div className="payments-overview-grid">
                <div className="stat-card">
                    <h4>Total Paid</h4>
                    <p>KES {totalPaid.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h4>Outstanding Balance</h4>
                    <p className="outstanding">KES {outstanding.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

const AthleteProfileWidget: FC<{ athlete: User }> = ({ athlete }) => {
    return (
        <div className="widget widget-col-span-1 athlete-profile-widget">
            <img src={athlete.photo_url} alt={athlete.name} />
            <h4>{athlete.name}</h4>
            {athlete.skill_level && <SkillBadge level={athlete.skill_level} />}
        </div>
    );
};

const ActivityManagementWidget: FC<{ activities: Activity[], onAdd: () => void, onEdit: (activity: Activity) => void, onDelete: (id: string) => void }> = ({ activities, onAdd, onEdit, onDelete }) => {
    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header">
                <h3>Club Activities</h3>
                <button className="btn btn-primary btn-sm" onClick={onAdd}><PlusCircleIcon/> Add Activity</button>
            </div>
            <div className="activity-list">
                {activities.map(act => (
                    <div key={act.id} className="activity-list-item">
                        <div className="activity-item-content">
                            <h4>{act.name} <span className={`activity-type-badge type-${act.type.toLowerCase()}`}>{act.type}</span></h4>
                            <p>{act.description}</p>
                        </div>
                        <div className="action-buttons">
                            <button className="btn-icon" onClick={() => onEdit(act)}><PencilIcon/></button>
                            <button className="btn-icon" onClick={() => onDelete(act.id)}><TrashIcon/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActionLogWidget: FC<{ logs: ActionLog[], users: User[] }> = ({ logs, users }) => {
    const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;
    
    return (
        <div className="widget widget-col-span-2">
            <div className="widget-header"><h3>User Action Log</h3></div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Timestamp</th><th>User</th><th>Action</th></tr></thead>
                    <tbody>
                        {logs.slice().reverse().map(log => (
                            <tr key={log.id}>
                                <td data-label="Timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                                <td data-label="User">{getUserName(log.userId)}</td>
                                <td data-label="Action">{log.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CoachReportsWidget: FC<{
    reports: TrainingReport[];
    onApprove: (reportId: string) => void;
    coach: User;
    users: User[];
}> = ({ reports, onApprove, coach, users }) => {
    const myAthletesIds = useMemo(() => new Set(users.filter(u => u.coach_id === coach.id).map(u => u.id)), [users, coach.id]);
    const pendingReports = useMemo(() => reports.filter(r => r.status === 'Pending' && myAthletesIds.has(r.athlete_id)), [reports, myAthletesIds]);
    const getAthleteName = (id: string) => users.find(u => u.id === id)?.name || 'N/A';
    
    return (
        <div className="widget widget-col-span-4">
            <div className="widget-header"><h3>Pending Training Reports</h3></div>
            {pendingReports.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead><tr><th>Date</th><th>Athlete</th><th>Score</th><th>Notes</th><th>Action</th></tr></thead>
                        <tbody>
                            {pendingReports.map(r => (
                                <tr key={r.id}>
                                    <td data-label="Date">{r.date}</td>
                                    <td data-label="Athlete">{getAthleteName(r.athlete_id)}</td>
                                    <td data-label="Score">{r.score}</td>
                                    <td data-label="Notes">{r.notes}</td>
                                    <td data-label="Action">
                                        <button className="btn btn-primary btn-sm" onClick={() => onApprove(r.id)}>Approve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No pending reports to review.</p>
            )}
        </div>
    );
};

const ContactWidget: FC = () => (
    <div className="widget">
        <div className="widget-header">
            <h3>Recent Messages</h3>
        </div>
        <div className="contact-widget-body">
            <ChatBubbleLeftRightIcon />
            <p>No new messages</p>
            <span>Messages from the contact form will appear here.</span>
        </div>
    </div>
);

// --- AUTHENTICATION COMPONENTS ---
type AuthMode = 'login' | 'signup' | 'forgot';

const LoginPage: FC<{
    onLogin: (user: User) => void;
    onSwitchMode: (mode: AuthMode) => void;
    users: User[];
    addToast: (message: string, type: ToastMessage['type']) => void;
}> = ({ onLogin, onSwitchMode, users, addToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            addToast('Invalid email or password.', 'error');
        }
    };

    return (
        <>
            <ClubLogo className="auth-logo" />
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group-icon">
                    <EnvelopeIcon className="input-icon" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group-icon">
                    <LockClosedIcon className="input-icon" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="auth-links">
                    <button type="button" className="link-button" onClick={() => onSwitchMode('forgot')}>Forgot Password?</button>
                </div>
                <button type="submit" className="btn btn-primary btn-full">Sign In</button>
            </form>
            <p className="auth-switch">
                Don't have an account? <button type="button" className="link-button" onClick={() => onSwitchMode('signup')}>Sign Up</button>
            </p>
        </>
    );
};

const SignupPage: FC<{
    onSignup: (newUser: Omit<User, 'id' | 'created_at' | 'photo_url' | 'dob' | 'role'>) => void;
    onSwitchMode: (mode: AuthMode) => void;
    users: User[];
    addToast: (message: string, type: ToastMessage['type']) => void;
}> = ({ onSignup, onSwitchMode, users, addToast }) => {
    const [step, setStep] = useState<'choice' | 'form'>('choice');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            addToast('Passwords do not match.', 'error');
            return;
        }
        if (users.some(u => u.email === email)) {
            addToast('An account with this email already exists.', 'error');
            return;
        }
        onSignup({ name, email, password });
    };

    if (step === 'choice') {
        return (
            <>
                <ClubLogo className="auth-logo" />
                <h2>Join Funspot Club</h2>
                <p>How would you like to sign up?</p>
                <div className="signup-choice">
                    <div className="choice-box">
                        <h4>Administrator</h4>
                        <p>Create a new administrator account for a club.</p>
                        <button className="btn btn-primary btn-full" onClick={() => setStep('form')}>Sign Up as Admin</button>
                    </div>
                    <div className="choice-box">
                        <h4>Club Member</h4>
                        <p>Member accounts (Coach, Parent, Athlete) must be created by a club administrator.</p>
                        <button className="btn btn-secondary btn-full" onClick={() => onSwitchMode('login')}>Contact Your Admin</button>
                    </div>
                </div>
                <p className="auth-switch">
                    Already have an account? <button type="button" className="link-button" onClick={() => onSwitchMode('login')}>Sign In</button>
                </p>
            </>
        )
    }

    return (
        <>
            <ClubLogo className="auth-logo" />
            <h2>Create Admin Account</h2>
            <p>Fill in your details to get started.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group-icon">
                    <UserCircleIcon className="input-icon" />
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group-icon">
                    <EnvelopeIcon className="input-icon" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group-icon">
                    <LockClosedIcon className="input-icon" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="form-group-icon">
                    <LockClosedIcon className="input-icon" />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-full">Create Account</button>
            </form>
            <p className="auth-switch">
                Already have an account? <button type="button" className="link-button" onClick={() => onSwitchMode('login')}>Sign In</button>
            </p>
        </>
    );
};

const ForgotPasswordPage: FC<{
    onSwitchMode: (mode: AuthMode) => void;
    addToast: (message: string, type: ToastMessage['type']) => void;
}> = ({ onSwitchMode, addToast }) => {
    const [email, setEmail] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast('If an account exists, a password reset link has been sent.', 'info');
        onSwitchMode('login');
    };

    return (
        <>
            <ClubLogo className="auth-logo" />
            <h2>Reset Password</h2>
            <p>Enter your email and we'll send you a link to get back into your account.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group-icon">
                    <EnvelopeIcon className="input-icon" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-full">Send Reset Link</button>
            </form>
             <p className="auth-switch">
                Remember your password? <button type="button" className="link-button" onClick={() => onSwitchMode('login')}>Sign In</button>
            </p>
        </>
    );
};

// --- APP ---

export const App: FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [trainingReports, setTrainingReports] = useState<TrainingReport[]>(mockTrainingReports);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [waitlists, setWaitlists] = useState<Record<string, string[]>>({});

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [isProgramDetailsModalOpen, setIsProgramDetailsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  const [isAddEditProgramModalOpen, setIsAddEditProgramModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [programToPay, setProgramToPay] = useState<Program | null>(null);
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<ClubEvent[] | null>(null);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<{ program: Program; method: string } | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const storedTheme = localStorage.getItem('funspot-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const effectiveUser = impersonatedUser || currentUser;
  const isAdminOrManager = effectiveUser?.role === 'Admin' || effectiveUser?.role === 'Manager';

  useEffect(() => {
    document.documentElement.className = `${theme}-theme`;
    localStorage.setItem('funspot-theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
        const storedWaitlists = localStorage.getItem('funspot-waitlists');
        if (storedWaitlists) setWaitlists(JSON.parse(storedWaitlists));
    } catch (e) { console.error("Failed to parse waitlists from localStorage", e); }

    Notification.requestPermission().then(setNotificationPermission);
  }, []);

  useEffect(() => {
      localStorage.setItem('funspot-waitlists', JSON.stringify(waitlists));
  }, [waitlists]);
  
  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };
  
  const addLog = (userId: string, action: string) => {
      setActionLogs(prev => [...prev, { id: Date.now(), userId, action, timestamp: new Date().toISOString() }]);
  };
  
  const handleLogin = (user: User) => {
    setIsLoading(true);
    setTimeout(() => {
        setCurrentUser(user);
        addLog(user.id, 'User logged in');
        setIsLoading(false);
    }, 1000);
  };
  
  const handleLogout = () => {
    if (impersonatedUser) {
        addLog(currentUser!.id, `Stopped impersonating ${impersonatedUser.name}`);
        setImpersonatedUser(null);
    } else {
        addLog(currentUser!.id, 'User logged out');
        setCurrentUser(null);
        setAuthMode('login');
    }
  };

  const handleSignup = (newUser: Omit<User, 'id' | 'created_at' | 'photo_url' | 'dob' | 'role'>) => {
    const newUserId = `user_${String(Date.now()).slice(-4)}`;
    const userToSave: User = {
        ...newUser,
        id: newUserId,
        created_at: new Date().toISOString().split('T')[0],
        photo_url: `https://i.pravatar.cc/150?u=${newUserId}`,
        dob: '1990-01-01', // placeholder DOB
        role: 'Admin'
    };
    setUsers(prev => [...prev, userToSave]);
    addToast('Admin account created successfully! Please log in.', 'success');
    setAuthMode('login');
};
  
  const handleImpersonate = (user: User) => {
      if ((currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && currentUser.id !== user.id) {
          setImpersonatedUser(user);
          addLog(currentUser.id, `Started impersonating ${user.name}`);
          addToast(`Now impersonating ${user.name}.`, 'info');
      }
  };

  const handleSaveUser = (user: User) => {
    setUsers(prev => {
      const existing = prev.find(u => u.id === user.id);
      if (existing) {
        addLog(effectiveUser!.id, `Updated profile for ${user.name}`);
        // If current user is updated, update the state as well
        if (currentUser?.id === user.id) {
            setCurrentUser(user);
        }
        return prev.map(u => u.id === user.id ? user : u);
      }
      addLog(effectiveUser!.id, `Created new user: ${user.name}`);
      return [...prev, user];
    });
    addToast(`User ${user.id === userToEdit?.id ? 'updated' : 'created'} successfully!`, 'success');
  };

  const handleEditUser = (user: User) => { 
    if (currentUser?.role === 'Manager' && user.role === 'Admin' && currentUser.id !== user.id) {
        addToast("Managers are not permitted to edit Admin accounts.", 'error');
        return;
    }
    setUserToEdit(user); 
    setIsUserModalOpen(true); 
  };
  const handleAddUser = () => { setUserToEdit(null); setIsUserModalOpen(true); };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userId === currentUser?.id) {
        addToast("You cannot delete your own account.", 'error');
        return;
    }

    if (currentUser?.role === 'Manager' && userToDelete.role === 'Admin') {
        addToast("Managers are not permitted to delete Admin accounts.", 'error');
        return;
    }

    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addLog(effectiveUser!.id, `Deleted user: ${userToDelete.name}`);
      addToast('User deleted successfully.', 'success');
    }
  };

  const handleViewProgramDetails = (program: Program) => { setSelectedProgram(program); setIsProgramDetailsModalOpen(true); };
  const handleEditProgram = (program: Program) => { setProgramToEdit(program); setIsAddEditProgramModalOpen(true); };
  const handleAddProgram = () => { setProgramToEdit(null); setIsAddEditProgramModalOpen(true); };

  const handleSaveProgram = (program: Program) => {
    let promotedUserId: string | undefined;
    
    setPrograms(prev => {
        const oldProgram = prev.find(p => p.id === program.id);

        if (oldProgram) { // This is an update
            const spotsOpened = program.capacity - oldProgram.capacity;
            if (spotsOpened > 0) {
                const waitlist = waitlists[program.id];
                if (waitlist && waitlist.length > 0) {
                    promotedUserId = waitlist[0];
                }
            }
            return prev.map(p => p.id === program.id ? program : p);
        } else { // This is a new program
            return [...prev, program];
        }
    });

    if (promotedUserId) {
        const userToNotify = users.find(u => u.id === promotedUserId);
        if (userToNotify) {
            addToast(`A spot has opened in ${program.title} for ${userToNotify.name}! Please book now.`, 'success');
        }
        setWaitlists(prev => {
            const newWaitlists = { ...prev };
            const newProgramWaitlist = (newWaitlists[program.id] || []).slice(1);
            if (newProgramWaitlist.length === 0) {
                delete newWaitlists[program.id];
            } else {
                newWaitlists[program.id] = newProgramWaitlist;
            }
            return newWaitlists;
        });
    }
    
    const actionText = programToEdit ? 'updated' : 'created';
    addToast(`Program ${actionText} successfully!`, 'success');
    addLog(effectiveUser!.id, `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} program: ${program.title}`);
  };
  
  const handleBookProgram = (program: Program) => { setIsProgramDetailsModalOpen(false); setProgramToPay(program); setIsPaymentModalOpen(true); };

  const handleRequestWaitlist = (program: Program) => {
    if (!effectiveUser) return;
    setWaitlists(prev => {
        const list = prev[program.id] || [];
        if (list.includes(effectiveUser.id)) {
            addToast("You are already on the waitlist.", 'info');
            return prev;
        }
        const newList = [...list, effectiveUser.id];
        addToast(`Successfully joined waitlist for ${program.title}. You are position #${newList.length}.`, 'success');
        addLog(effectiveUser.id, `Joined waitlist for ${program.title}`);
        return { ...prev, [program.id]: newList };
    });
    setIsProgramDetailsModalOpen(false);
  };
  
  const handleConfirmPayment = (method: 'Card' | 'Mpesa') => {
      if (!programToPay || !effectiveUser) return;
      const newTransaction: Transaction = { id: `txn_${Date.now()}`, userId: effectiveUser.id, programId: programToPay.id, amount_cents: programToPay.price_cents, currency: programToPay.currency, method, status: 'Completed', created_at: new Date().toISOString().split('T')[0] };
      setTransactions(prev => [...prev, newTransaction]);
      setPrograms(prev => prev.map(p => p.id === programToPay.id ? {...p, enrolled_count: p.enrolled_count + 1} : p));
      
      setConfirmedBookingDetails({ program: programToPay, method });

      setIsPaymentModalOpen(false); 
      setProgramToPay(null);
      setIsBookingConfirmationOpen(true);

      addLog(effectiveUser.id, `Booked program ${programToPay.title}`);
  };
  
  const handleMarkAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  
  const handleSaveActivity = (activity: Activity) => {
      setActivities(prev => {
          const existing = prev.find(a => a.id === activity.id);
          if (existing) return prev.map(a => a.id === activity.id ? activity : a);
          return [...prev, activity];
      });
      addToast('Activity saved successfully', 'success');
  };
  
  const handleDeleteActivity = (id: string) => {
      if (window.confirm('Delete this activity?')) {
          setActivities(prev => prev.filter(a => a.id !== id));
          addToast('Activity deleted.', 'success');
      }
  };

  const handleApproveReport = (reportId: string) => {
    setTrainingReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Approved' } : r));
    addToast('Training report approved.', 'success');
    addLog(effectiveUser!.id, `Approved training report ${reportId}`);
  };

  const handleDayClick = (day: number, year: number, month: number) => {
    const clickedDate = new Date(year, month, day).toISOString().split('T')[0];
    const eventsOnDay = mockEvents.filter(e => e.date === clickedDate);
    if(eventsOnDay.length > 0) { setSelectedEvents(eventsOnDay); setIsEventModalOpen(true); }
  };

  const handleRequestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
            addToast('Push notifications enabled!', 'success');
            new Notification('Funspot Club', { body: 'You will now receive updates from the club.' });
        } else {
            addToast('Push notifications have been disabled or blocked.', 'info');
        }
    });
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const childrenOfParent = useMemo(() => {
    if (effectiveUser?.role === 'Parent') return users.filter(u => u.parent_id === effectiveUser.id);
    return [];
  }, [users, effectiveUser]);
  
  // --- RENDER LOGIC ---

  if (isLoading) return <LoadingSpinner />;

  if (!currentUser || !effectiveUser) {
    return (
      <div className="auth-container">
        <div className="auth-box">
           {authMode === 'login' && <LoginPage onLogin={handleLogin} onSwitchMode={setAuthMode} users={users} addToast={addToast} />}
           {authMode === 'signup' && <SignupPage onSignup={handleSignup} onSwitchMode={setAuthMode} users={users} addToast={addToast} />}
           {authMode === 'forgot' && <ForgotPasswordPage onSwitchMode={setAuthMode} addToast={addToast} />}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
        <div className="toast-container">
            {toasts.map(toast => <Toast key={toast.id} message={toast} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />)}
        </div>
        
        <AddEditUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} userToEdit={userToEdit} users={users} addToast={addToast} currentUser={currentUser} />
        <AddEditProgramModal isOpen={isAddEditProgramModalOpen} onClose={() => setIsAddEditProgramModalOpen(false)} onSave={handleSaveProgram} programToEdit={programToEdit} users={users} />
        <ProgramDetailsModal isOpen={isProgramDetailsModalOpen} onClose={() => setIsProgramDetailsModalOpen(false)} program={selectedProgram} coach={users.find(u => u.id === selectedProgram?.coach_id)} onBook={handleBookProgram} onWaitlist={handleRequestWaitlist} currentUser={effectiveUser} waitlistPosition={waitlists[selectedProgram?.id || '']?.indexOf(effectiveUser.id) + 1 || null} />
        <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} program={programToPay} onConfirmPayment={handleConfirmPayment} />
        <AddEditActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} onSave={handleSaveActivity} activityToEdit={activityToEdit} />
        <EventDetailsModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} events={selectedEvents} />
        <AboutUsModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        <ContactUsModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} addToast={addToast} />
        <BookingConfirmationModal isOpen={isBookingConfirmationOpen} onClose={() => setIsBookingConfirmationOpen(false)} details={confirmedBookingDetails} />

      <aside className="sidebar">
        <ClubLogo className="sidebar-logo" />
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setIsAboutModalOpen(true); }}><InformationCircleIcon/> About Us</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setIsContactModalOpen(true); }}><EnvelopeIcon/> Contact</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleEditUser(effectiveUser!); }}><UserCircleIcon/> My Profile</a>
        </nav>
        <div className="sidebar-footer">
            <h4>About Funspot</h4>
            <p>A safe, fun, and inclusive environment for skaters of all ages and skill levels.</p>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-content">
             <h2>{effectiveUser.role} Dashboard</h2>
             <div className="header-right">
                <button 
                  className={`btn-icon notification-permission-btn ${notificationPermission}`}
                  onClick={handleRequestNotificationPermission}
                  title={notificationPermission === 'granted' ? 'Notifications Enabled' : 'Click to enable notifications'}
                >
                  {notificationPermission === 'granted' ? <BellIcon /> : <BellSlashIcon />}
                </button>
                <button className="btn-icon theme-toggle" onClick={handleToggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <NotificationsWidget notifications={notifications} onMarkAsRead={handleMarkAsRead}/>
                <div className="header-user-info">
                    <strong>{effectiveUser.name}</strong>
                    <button className="btn-icon" onClick={() => handleEditUser(effectiveUser)} title="Edit My Profile"><PencilIcon /></button>
                </div>
                <img src={effectiveUser.photo_url} alt="User Avatar" className="header-avatar" />
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">{impersonatedUser ? "End Impersonation" : "Logout"}</button>
            </div>
          </div>
        </header>
        
        {impersonatedUser && (
            <div className="impersonation-banner">
                <ExclamationTriangleIcon/>
                <span>Viewing as <strong>{impersonatedUser.name}</strong>. Some actions may be restricted.</span>
            </div>
        )}

        <main className="content-area">
          <div className="dashboard-grid">
            {isAdminOrManager && <>
                <AnalyticsWidget users={users} transactions={transactions} programs={programs}/>
                <EventsCalendarWidget events={mockEvents} onDayClick={handleDayClick}/>
                <ContactWidget />
                <UserManagementWidget users={users} onImpersonate={handleImpersonate} onEdit={handleEditUser} onDelete={handleDeleteUser} onAdd={handleAddUser} currentUser={currentUser} />
                <ProgramManagementWidget programs={programs} users={users} onViewDetails={handleViewProgramDetails} onEditProgram={handleEditProgram} onAddProgram={handleAddProgram} currentUser={effectiveUser}/>
                <TransactionLogWidget transactions={transactions} users={users} programs={programs} />
                <ActivityManagementWidget activities={activities} onAdd={() => {setActivityToEdit(null); setIsActivityModalOpen(true)}} onEdit={(act) => {setActivityToEdit(act); setIsActivityModalOpen(true)}} onDelete={handleDeleteActivity} />
                <ActionLogWidget logs={actionLogs} users={users} />
            </>}

            {effectiveUser.role === 'Coach' && <>
                <CoachReportsWidget reports={trainingReports} onApprove={handleApproveReport} coach={effectiveUser} users={users} />
                <EventsCalendarWidget events={mockEvents} onDayClick={handleDayClick}/>
                <ProgramManagementWidget programs={programs} users={users} onViewDetails={handleViewProgramDetails} onEditProgram={handleEditProgram} onAddProgram={handleAddProgram} currentUser={effectiveUser}/>
            </>}
            
            {effectiveUser.role === 'Athlete' && <>
                <AthleteProfileWidget athlete={effectiveUser} />
                <AthleteProgressWidget reports={trainingReports} athlete={effectiveUser} />
                <EventsCalendarWidget events={mockEvents} onDayClick={handleDayClick}/>
                <ProgramManagementWidget programs={programs} users={users} onViewDetails={handleViewProgramDetails} onEditProgram={handleEditProgram} onAddProgram={handleAddProgram} currentUser={effectiveUser}/>
            </>}
            
            {effectiveUser.role === 'Parent' && <>
                <ParentPaymentsWidget transactions={transactions} parent={effectiveUser} users={users} />
                {childrenOfParent.map(child => (
                    <React.Fragment key={child.id}>
                        <AthleteProfileWidget athlete={child} />
                        <AthleteProgressWidget reports={trainingReports} athlete={child} />
                    </React.Fragment>
                ))}
                <EventsCalendarWidget events={mockEvents} onDayClick={handleDayClick}/>
                <ProgramManagementWidget programs={programs} users={users} onViewDetails={handleViewProgramDetails} onEditProgram={handleEditProgram} onAddProgram={handleAddProgram} currentUser={effectiveUser}/>
            </>}
          </div>
        </main>
      </div>
    </div>
  );
};
