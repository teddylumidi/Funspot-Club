// FIX: Import Dispatch and SetStateAction to correctly type the state setter in useLocalStorage.
import React, { useState, useEffect, useMemo, FC, useRef, useCallback, Dispatch, SetStateAction, Component, ErrorInfo, ReactNode } from 'react';

// --- ERROR BOUNDARY ---
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <ExclamationTriangleIcon className="error-icon" />
          <h2>Something went wrong.</h2>
          <p>We've been notified and are working to fix the issue. Please try refreshing the page.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}


// --- TYPES ---
type Role = 'Admin' | 'Manager' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
type LocationType = 'Indoor' | 'Outdoor';
type ProgramCategory = 'Figure Skating' | 'Speed Skating' | 'Synchronized Skating' | 'Hockey Skills' | 'General';

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
  category: ProgramCategory;
  photo_url: string;
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

interface SessionBooking {
    id: string;
    userId: string;
    programId: string;
    transactionId: string;
    session: { day: string; time: string };
    bookedAt: string;
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

interface AppNotification {
    id: string;
    userId: string;
    type: 'WAITLIST_OPENING';
    message: string;
    programId: string;
    createdAt: string;
}

type ModalState = 
  | { type: 'NONE' }
  | { type: 'PROGRAM_DETAILS'; program: Program }
  | { type: 'SESSION_BOOKING'; program: Program }
  | { type: 'PAYMENT'; program: Program; session: { day: string; time: string } }
  | { type: 'CONFIRMATION'; program: Program, transactionId: string }
  | { type: 'USER_FORM'; user?: User }
  | { type: 'DELETE_USER'; user: User }
  | { type: 'EVENT_DETAILS', date: Date, events: ClubEvent[] }
  | { type: 'PROGRAM_FORM', program?: Program }
  | { type: 'DELETE_PROGRAM', program: Program };


// --- SVG ICONS ---
const EyeIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532A1.012 1.012 0 0 1 7.5 4.5h9a1.012 1.012 0 0 1 .534.175l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532A1.012 1.012 0 0 1 16.5 19.5h-9a1.012 1.012 0 0 1-.534-.175L2.036 12.322Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const PencilIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const SunIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" /></svg>;
const MoonIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const SearchIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const UserPlusIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.75 20.25a7.5 7.5 0 0 1 15 0" /></svg>;
const XMarkIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const CheckCircleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ArrowLeftOnRectangleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const ExclamationTriangleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const CreditCardIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m0 0l-3-3m3 3V15m6-1.5h.008v.008H18V15Zm-12 0h.008v.008H6V15Z" /></svg>;
const DevicePhoneMobileIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const SkateIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M22.2,6.4C22.6,5.6,22,4.7,21.2,4.3C20.6,4,20,4,19.4,4.2l-3.5,1.1L12.5,2c-0.6-0.5-1.5-0.5-2.1,0L7.1,5.3L3.6,4.2 C2.7,4,1.8,4.5,1.5,5.4s0.5,1.8,1.4,2.1L6,8.2V13h2V9.8l3.4,2.1c0.5,0.3,1.1,0.5,1.7,0.5s1.2-0.2,1.7-0.5L18,9.8V13h2V8.2l3.1-0.7 C21.3,7.4,22,7,22.2,6.4z M10,14v6H8v-6H10z M16,14v6h-2v-6H16z"/></svg>;
const HomeIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const BookOpenIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
const CalendarDaysIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h28.5" /></svg>;
const UsersIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 2.25-2.25h3.514a2.25 2.25 0 0 1 2.25 2.25v3.86M15 19.128P12.75 15.75M12 12.75v6.378a3.75 3.75 0 0 1-7.5 0v-6.378m7.5 0a3.75 3.75 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Zm0 0c.043.023.086.046.128.069m-1.288 0c-.043.023-.086.046-.128.069m1.288 0A3.734 3.734 0 0 1 12 12.75M6.75 15.75h.008v.008H6.75v-.008Zm0 0a3.75 3.75 0 0 0 0-6.378m0 6.378a3.75 3.75 0 0 1 0-6.378m0 6.378h.008v.008H6.75v-.008Zm-3.75-3A3.75 3.75 0 0 0 3 12.75M3 12.75c0 .621.149 1.208.405 1.728m0 0a3.75 3.75 0 0 1 3.345-1.728M3 12.75a3.75 3.75 0 0 1 3.75-3.75m0 0a3.75 3.75 0 0 1 3.75 3.75M3.75 12.75h.008v.008H3.75v-.008Z" /></svg>;
const UserCircleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const BellIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const ChevronLeftIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
const PlusCircleIcon: FC<{ className?: string }> = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;


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
        { id: 'prog_01', title: 'Learn to Skate', description: 'Fundamentals for all ages. Covers basic balance, forward and backward skating.', coach_id: 'usr_coach_1', price_cents: 8000, currency: 'KES', duration_minutes: 45, schedule: [{ day: 'Saturday', time: '09:00 AM' }], skill_level: 'Beginner', capacity: 1, enrolled_count: 1, location_type: 'Indoor', active: true, waitlisted_users: ['usr_parent_1'], category: 'General', photo_url: 'https://placehold.co/600x400/010409/c9d1d9?text=Learn+to+Skate' },
        { id: 'prog_02', title: 'Freestyle Foundations', description: 'Introduction to jumps, spins, and footwork. Prerequisite: Learn to Skate.', coach_id: 'usr_coach_1', price_cents: 12000, currency: 'KES', duration_minutes: 60, schedule: [{ day: 'Saturday', time: '10:00 AM' }, { day: 'Sunday', time: '10:00 AM' }], skill_level: 'Intermediate', capacity: 10, enrolled_count: 10, location_type: 'Indoor', active: true, waitlisted_users: ['usr_parent_2'], category: 'Figure Skating', photo_url: 'https://placehold.co/600x400/010409/c9d1d9?text=Freestyle' },
        { id: 'prog_03', title: 'Advanced Edges & Turns', description: 'Master complex edge work and powerful turns for competitive performance.', coach_id: 'usr_coach_2', price_cents: 15000, currency: 'KES', duration_minutes: 60, schedule: [{ day: 'Sunday', time: '11:00 AM' }], skill_level: 'Advanced', capacity: 8, enrolled_count: 5, location_type: 'Indoor', active: true, waitlisted_users: [], category: 'Figure Skating', photo_url: 'https://placehold.co/600x400/010409/c9d1d9?text=Edges+%26+Turns' },
        { id: 'prog_04', title: 'Adult Skating Fitness', description: 'A fun, low-impact workout on ice. All skill levels welcome.', coach_id: 'usr_coach_2', price_cents: 10000, currency: 'KES', duration_minutes: 50, schedule: [{ day: 'Wednesday', time: '07:00 PM' }], skill_level: 'All', capacity: 20, enrolled_count: 18, location_type: 'Indoor', active: true, waitlisted_users: [], category: 'General', photo_url: 'https://placehold.co/600x400/010409/c9d1d9?text=Fitness' },
        { id: 'prog_05', title: 'Power Skating', description: 'Improve your speed, agility, and power on the ice. Essential for hockey players.', coach_id: 'usr_coach_2', price_cents: 14000, currency: 'KES', duration_minutes: 60, schedule: [{ day: 'Monday', time: '06:00 PM' }, { day: 'Thursday', time: '06:00 PM' }], skill_level: 'Intermediate', capacity: 12, enrolled_count: 8, location_type: 'Indoor', active: true, waitlisted_users: [], category: 'Hockey Skills', photo_url: 'https://placehold.co/600x400/010409/c9d1d9?text=Power+Skating' },

    ];

    const transactions: Transaction[] = [
        { id: 'txn_01', userId: 'usr_athlete_1', programId: 'prog_01', amount_cents: 8000, currency: 'KES', method: 'Mpesa', status: 'Completed', created_at: new Date(now.setDate(now.getDate() - 10)).toISOString() },
    ];
    
    const sessionBookings: SessionBooking[] = [
        { id: 'book_01', userId: 'usr_athlete_1', programId: 'prog_01', transactionId: 'txn_01', session: { day: 'Saturday', time: '09:00 AM' }, bookedAt: new Date(now.setDate(now.getDate() - 10)).toISOString() }
    ];

    const clubEvents: ClubEvent[] = [
        { id: 'evt_01', title: 'Club Open Day', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15`, description: 'Join us for a fun day of free skating, demos, and registration info!' },
        { id: 'evt_02', title: 'Holiday Ice Show', date: `${now.getFullYear()}-12-20`, description: 'A festive performance by our talented skaters. Tickets on sale soon.' },
        { id: 'evt_03', title: 'Skills Assessment Day', date: `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}-05`, description: 'Skaters will be assessed for placement in the next term\'s programs.' },
        { id: 'evt_04', title: 'Test Event', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, description: 'An event for today to test the calendar.' },
    ];
    return { users, programs, transactions, clubEvents, sessionBookings };
};


// --- UTILITY FUNCTIONS ---
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const formatCurrency = (amount_cents: number, currency: string) => `${(amount_cents / 100).toLocaleString('en-US', { style: 'currency', currency })}`;
const getRoleClassName = (role: Role) => `role-${role.toLowerCase()}`;
const getSkillClassName = (skill: SkillLevel) => `skill-${skill.toLowerCase()}`;


// --- HOOKS ---
// FIX: Update the return type to allow functional updates, consistent with React's useState.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // FIX: Type `value` to accept a value or a function, enabling safe state updates.
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

type View = 'DASHBOARD' | 'USERS';

// --- MAIN APP COMPONENT ---
export const App: FC = () => {
    // --- STATE MANAGEMENT ---
    const initialData = useMemo(() => createInitialData(), []);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [users, setUsers] = useState<User[]>(initialData.users);
    const [programs, setPrograms] = useLocalStorage<Program[]>('programs', initialData.programs);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`transactions`, initialData.transactions);
    const [sessionBookings, setSessionBookings] = useLocalStorage<SessionBooking[]>('sessionBookings', initialData.sessionBookings);
    const [clubEvents] = useState<ClubEvent[]>(initialData.clubEvents);
    const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('notifications', []);
    const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [activeView, setActiveView] = useState<View>('DASHBOARD');
    
    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState<Role | 'All'>('All');
    const [eventDateFilter, setEventDateFilter] = useState('');


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

    useEffect(() => {
        // If a non-admin user somehow gets to the USERS view, redirect them to the dashboard.
        if (activeView === 'USERS' && currentUser && !['Admin', 'Manager'].includes(currentUser.role)) {
            setActiveView('DASHBOARD');
        }
    }, [activeView, currentUser]);
    
    // --- DERIVED STATE & MEMOS ---
    const coaches = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);
    const parents = useMemo(() => users.filter(u => u.role === 'Parent'), [users]);
    const userNotifications = useMemo(() => currentUser ? notifications.filter(n => n.userId === currentUser.id) : [], [notifications, currentUser]);
    
    const userAndChildrenIds = useMemo(() => {
        if (!currentUser) return [];
        const ids = [currentUser.id];
        if (currentUser.role === 'Parent') {
            ids.push(...users.filter(u => u.parent_id === currentUser.id).map(u => u.id));
        }
        return ids;
    }, [currentUser, users]);

    const userBookedSessions = useMemo(() => {
        return sessionBookings.filter(b => userAndChildrenIds.includes(b.userId));
    }, [sessionBookings, userAndChildrenIds]);


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
        setActiveView('DASHBOARD'); // Reset view on logout
        addToast('You have been logged out.', 'info');
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const handleCancelBooking = (programId: string, transactionId: string) => {
        if (!currentUser) return;
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        // Remove transaction and decrement enrolled count
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        setSessionBookings(prev => prev.filter(b => b.transactionId !== transactionId));
        const program = programs.find(p => p.id === programId);

        setPrograms(prev => prev.map(p => p.id === programId ? { ...p, enrolled_count: p.enrolled_count - 1 } : p));
        addToast(`You have cancelled your booking for ${program?.title}.`, 'info');

        // Handle waitlist notification
        if (program && program.waitlisted_users.length > 0) {
            const firstWaitlistedUserId = program.waitlisted_users[0];
            const newNotification: AppNotification = {
                id: `notif_${Date.now()}`,
                userId: firstWaitlistedUserId,
                type: 'WAITLIST_OPENING',
                message: `A spot has opened up in ${program.title}! Book now before it's gone.`,
                programId: program.id,
                createdAt: new Date().toISOString()
            };
            setNotifications(prev => [...prev, newNotification]);
            addToast(`User ${users.find(u=>u.id === firstWaitlistedUserId)?.name} has been notified of an opening.`, 'success');
        }
    };

    const handleInitiateBooking = (program: Program, notificationId?: string) => {
        if (!currentUser) {
            addToast('You must be logged in to book a program.', 'error');
            return;
        }

        const userBookingsForProgram = sessionBookings.filter(b => 
            userAndChildrenIds.includes(b.userId) && b.programId === program.id
        );

        if (userBookingsForProgram.length > 0) {
            addToast('You are already enrolled in this program.', 'info');
            return;
        }

        setModalState({ type: 'SESSION_BOOKING', program });

        // If booking from notification, remove it
        if (notificationId) {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
    };

    const handleProceedToPayment = (program: Program, session: { day: string; time: string }) => {
        setModalState({ type: 'PAYMENT', program, session });
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

    const handleConfirmPayment = (program: Program, session: { day: string; time: string }) => {
        if (!currentUser) return;

        // For parents, find the first child to enroll. A more complex app would let them choose.
        const bookingUserId = currentUser.role === 'Parent' 
            ? (users.find(u => u.parent_id === currentUser.id)?.id || currentUser.id)
            : currentUser.id;

        const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            userId: bookingUserId,
            programId: program.id,
            amount_cents: program.price_cents,
            currency: 'KES',
            method: 'Mpesa', // Defaulting for simplicity
            status: 'Completed',
            created_at: new Date().toISOString()
        };
        setTransactions(prev => [...prev, newTransaction]);

        const newBooking: SessionBooking = {
            id: `book_${Date.now()}`,
            userId: bookingUserId,
            programId: program.id,
            transactionId: newTransaction.id,
            session,
            bookedAt: new Date().toISOString()
        };
        setSessionBookings(prev => [...prev, newBooking]);
        
        // Increment enrolled count and remove user from waitlist
        setPrograms(prev => prev.map(p => p.id === program.id ? { 
            ...p, 
            enrolled_count: p.enrolled_count + 1,
            waitlisted_users: p.waitlisted_users.filter(id => id !== currentUser.id)
        } : p));

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

    const handleSaveProgram = (program: Program) => {
        const isNewProgram = !program.id;
        if (isNewProgram) {
            const newProgram: Program = {
                ...program,
                id: `prog_${Date.now()}`,
                enrolled_count: 0,
                waitlisted_users: [],
                active: true,
                currency: 'KES', // Default currency
                photo_url: program.photo_url || `https://placehold.co/600x400/010409/c9d1d9?text=${program.title.replace(/\s/g, '+')}`
            };
            setPrograms(prev => [...prev, newProgram]);
            addToast('Program created successfully.', 'success');
        } else {
            setPrograms(prev => prev.map(p => p.id === program.id ? program : p));
            addToast('Program updated successfully.', 'success');
        }
        setModalState({ type: 'NONE' });
    };

    const handleDeleteProgram = (program: Program) => {
        // Cascade delete related bookings and transactions
        setSessionBookings(prev => prev.filter(b => b.programId !== program.id));
        setTransactions(prev => prev.filter(t => t.programId !== program.id));
        setPrograms(prev => prev.filter(p => p.id !== program.id));
        setModalState({ type: 'NONE' });
        addToast(`Program "${program.title}" and its bookings have been deleted.`, 'success');
    };
    
    const handleEditCurrentUser = () => {
        setModalState({ type: 'USER_FORM', user: currentUser! });
    };

    const handleDismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const searchResults = useMemo(() => {
        if (!searchTerm.trim() && userRoleFilter === 'All' && !eventDateFilter) return null;
        const lowercasedTerm = searchTerm.toLowerCase();

        const foundPrograms = programs.filter(p =>
            p.title.toLowerCase().includes(lowercasedTerm) ||
            p.description.toLowerCase().includes(lowercasedTerm)
        );

        let filteredUsers = users;
        if (userRoleFilter !== 'All') {
            filteredUsers = filteredUsers.filter(u => u.role === userRoleFilter);
        }
        const foundUsers = filteredUsers.filter(u =>
            u.name.toLowerCase().includes(lowercasedTerm)
        );
        
        let filteredEvents = clubEvents;
        if (eventDateFilter) {
            filteredEvents = filteredEvents.filter(e => e.date === eventDateFilter);
        }
        const foundEvents = filteredEvents.filter(e =>
            e.title.toLowerCase().includes(lowercasedTerm) ||
            e.description.toLowerCase().includes(lowercasedTerm)
        );


        if (foundPrograms.length === 0 && foundUsers.length === 0 && foundEvents.length === 0) {
            return { programs: [], users: [], events: [] };
        }

        return { programs: foundPrograms, users: foundUsers, events: foundEvents };
    }, [searchTerm, programs, users, clubEvents, userRoleFilter, eventDateFilter]);


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
                userRoleFilter={userRoleFilter}
                setUserRoleFilter={setUserRoleFilter}
                eventDateFilter={eventDateFilter}
                setEventDateFilter={setEventDateFilter}
                activeView={activeView}
                setActiveView={setActiveView}
            >
                {activeView === 'DASHBOARD' && (
                    <>
                        {/* Common Widgets */}
                        <NotificationsWidget
                            notifications={userNotifications}
                            programs={programs}
                            onBookProgram={handleInitiateBooking}
                            onDismiss={handleDismissNotification}
                        />

                        {/* Role-based dashboards */}
                        {currentUser.role === 'Admin' && <ManagerDashboard users={users} programs={programs} setModalState={setModalState} clubEvents={clubEvents} coaches={coaches} />}
                        {currentUser.role === 'Manager' && <ManagerDashboard users={users} programs={programs} setModalState={setModalState} clubEvents={clubEvents} coaches={coaches} />}
                        {currentUser.role === 'Coach' && <CoachDashboard coach={currentUser} users={users} programs={programs} />}
                        {currentUser.role === 'Parent' && <ParentDashboard parent={currentUser} users={users} programs={programs} bookedSessions={userBookedSessions} onBookProgram={handleInitiateBooking} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onShowDetails={p => setModalState({ type: 'PROGRAM_DETAILS', program: p })} coaches={coaches} onCancelBooking={handleCancelBooking} setModalState={setModalState} clubEvents={clubEvents}/>}
                        {currentUser.role === 'Athlete' && <AthleteDashboard athlete={currentUser} users={users} programs={programs} bookedSessions={userBookedSessions} onBookProgram={handleInitiateBooking} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onShowDetails={p => setModalState({ type: 'PROGRAM_DETAILS', program: p })} coaches={coaches} onCancelBooking={handleCancelBooking} setModalState={setModalState} clubEvents={clubEvents} />}
                    </>
                )}

                {activeView === 'USERS' && (currentUser.role === 'Admin' || currentUser.role === 'Manager') && (
                    <AdminDashboard users={users} setModalState={setModalState} />
                )}
            </DashboardLayout>

            {/* Modals */}
            {modalState.type === 'PROGRAM_DETAILS' && <ProgramDetailsModal program={modalState.program} users={users} onBook={handleInitiateBooking} onJoinWaitlist={handleJoinWaitlist} onLeaveWaitlist={handleLeaveWaitlist} onClose={() => setModalState({ type: 'NONE' })} currentUser={currentUser} sessionBookings={sessionBookings} userAndChildrenIds={userAndChildrenIds} />}
            {modalState.type === 'SESSION_BOOKING' && <SessionBookingModal program={modalState.program} onProceedToPayment={handleProceedToPayment} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'PAYMENT' && <PaymentModal program={modalState.program} session={modalState.session} onConfirm={handleConfirmPayment} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'CONFIRMATION' && <ConfirmationModal program={modalState.program} transactionId={modalState.transactionId} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'USER_FORM' && <UserFormModal user={modalState.user} onSave={handleSaveUser} onClose={() => setModalState({ type: 'NONE' })} coaches={coaches} parents={parents} />}
            {modalState.type === 'DELETE_USER' && <DeleteConfirmationModal user={modalState.user} onDelete={handleDeleteUser} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'EVENT_DETAILS' && <EventDetailsModal date={modalState.date} events={modalState.events} onClose={() => setModalState({ type: 'NONE' })} />}
            {modalState.type === 'PROGRAM_FORM' && <ProgramFormModal program={modalState.program} onSave={handleSaveProgram} onClose={() => setModalState({ type: 'NONE' })} coaches={coaches} />}
            {modalState.type === 'DELETE_PROGRAM' && <DeleteProgramConfirmationModal program={modalState.program} onDelete={handleDeleteProgram} onClose={() => setModalState({ type: 'NONE' })} />}


            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const ClubLogo: FC<{ className?: string }> = ({ className }) => (
    <a href="#" className={`club-logo ${className}`}>
        <SkateIcon />
        <h3>FUNSPOT</h3>
    </a>
);

interface DashboardLayoutProps {
    currentUser: User;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onEditCurrentUser: () => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    searchResults: { programs: Program[], users: User[], events: ClubEvent[] } | null;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    userRoleFilter: Role | 'All';
    setUserRoleFilter: React.Dispatch<React.SetStateAction<Role | "All">>;
    eventDateFilter: string;
    setEventDateFilter: React.Dispatch<React.SetStateAction<string>>;
    activeView: View;
    setActiveView: React.Dispatch<React.SetStateAction<View>>;
    children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
    currentUser, onLogout, theme, onThemeToggle, onEditCurrentUser, searchTerm, setSearchTerm, searchResults,
    setModalState, userRoleFilter, setUserRoleFilter, eventDateFilter, setEventDateFilter, activeView, setActiveView, children
}) => {
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setSearchTerm]);

    return (
        <div className="dashboard-layout">
            <Sidebar
                currentUser={currentUser}
                onLogout={onLogout}
                onEditCurrentUser={onEditCurrentUser}
                activeView={activeView}
                setActiveView={setActiveView}
            />
            <div className="main-content">
                <Header
                    currentUser={currentUser}
                    onThemeToggle={onThemeToggle}
                    theme={theme}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchResults={searchResults}
                    setModalState={setModalState}
                    userRoleFilter={userRoleFilter}
                    setUserRoleFilter={setUserRoleFilter}
                    eventDateFilter={eventDateFilter}
                    setEventDateFilter={setEventDateFilter}
                    searchRef={searchRef}
                />
                <main className="content-area">
                    <div className="dashboard-grid">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const Sidebar: FC<{
    currentUser: User,
    activeView: View,
    setActiveView: (view: View) => void,
    onLogout: () => void,
    onEditCurrentUser: () => void
}> = ({ currentUser, activeView, setActiveView, onLogout, onEditCurrentUser }) => {
    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: HomeIcon, roles: ['Admin', 'Manager', 'Coach', 'Parent', 'Athlete'] },
        { id: 'USERS', label: 'User Management', icon: UsersIcon, roles: ['Admin', 'Manager'] },
    ];

    return (
        <aside className="sidebar">
            <ClubLogo className="sidebar-logo" />
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    item.roles.includes(currentUser.role) && (
                        <a
                            key={item.id}
                            href="#"
                            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveView(item.id as View);
                            }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </a>
                    )
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="header-user-info">
                    <button onClick={onEditCurrentUser} className="btn-icon" aria-label="Edit Profile">
                        <UserCircleIcon />
                    </button>
                    <button onClick={onLogout} className="btn-icon" aria-label="Logout">
                        <ArrowLeftOnRectangleIcon />
                    </button>
                </div>
            </div>
        </aside>
    );
};

interface HeaderProps {
    currentUser: User;
    onThemeToggle: () => void;
    theme: 'light' | 'dark';
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    searchResults: { programs: Program[], users: User[], events: ClubEvent[] } | null;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    userRoleFilter: Role | 'All';
    setUserRoleFilter: React.Dispatch<React.SetStateAction<Role | "All">>;
    eventDateFilter: string;
    setEventDateFilter: React.Dispatch<React.SetStateAction<string>>;
    searchRef: React.RefObject<HTMLDivElement>;
}

const Header: FC<HeaderProps> = ({
    currentUser, onThemeToggle, theme, searchTerm, setSearchTerm, searchResults,
    setModalState, userRoleFilter, setUserRoleFilter, eventDateFilter, setEventDateFilter, searchRef
}) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <ClubLogo className="header-logo" />
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
                            <div className="search-filters">
                                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value as Role | 'All')}>
                                    <option value="All">All Roles</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Athlete">Athlete</option>
                                </select>
                                <input type="date" value={eventDateFilter} onChange={e => setEventDateFilter(e.target.value)} />
                                <button className="btn-icon" onClick={() => { setUserRoleFilter('All'); setEventDateFilter('')}}>
                                    <XMarkIcon />
                                </button>
                            </div>
                            <div style={{ overflowY: 'auto' }}>
                            {searchResults.programs.length === 0 && searchResults.users.length === 0 && searchResults.events.length === 0 ? (
                                <div className="search-result-item-empty">No results found.</div>
                            ) : (
                                <>
                                    {searchResults.programs.length > 0 && <div className="search-category-header">Programs</div>}
                                    {searchResults.programs.map(p => (
                                        <div key={p.id} className="search-result-item" onClick={() => { setModalState({ type: 'PROGRAM_DETAILS', program: p }); setSearchTerm(''); }}>
                                            <span className="search-item-title">{p.title}</span>
                                            <span className={`skill-badge ${getSkillClassName(p.skill_level)}`}>{p.skill_level}</span>
                                        </div>
                                    ))}
                                    {searchResults.users.length > 0 && <div className="search-category-header">Users</div>}
                                    {searchResults.users.map(u => (
                                        <div key={u.id} className="search-result-item" onClick={() => { setModalState({ type: 'USER_FORM', user: u }); setSearchTerm(''); }}>
                                            <span className="search-item-title">{u.name}</span>
                                            <span className={`role-badge ${getRoleClassName(u.role)}`}>{u.role}</span>
                                        </div>
                                    ))}
                                    {searchResults.events.length > 0 && <div className="search-category-header">Events</div>}
                                    {searchResults.events.map(e => (
                                        <div key={e.id} className="search-result-item" onClick={() => { 
                                            const eventDate = new Date(e.date + 'T00:00:00');
                                            const eventsOnDay = searchResults.events.filter(ev => ev.date === e.date);
                                            setModalState({ type: 'EVENT_DETAILS', date: eventDate, events: eventsOnDay });
                                            setSearchTerm(''); 
                                        }}>
                                            <span className="search-item-title">{e.title}</span>
                                            <span className="search-item-context">{formatDate(e.date)}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="header-right">
                    <div className="header-user-info">
                        <div>
                            <strong>{currentUser.name}</strong>
                            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{currentUser.role}</div>
                        </div>
                        <img src={currentUser.photo_url} alt={currentUser.name} className="header-avatar" />
                    </div>
                    <button onClick={onThemeToggle} className="btn-icon theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
        </header>
    )
};

// --- AUTHENTICATION COMPONENTS ---
const LoginScreen: FC<{ users: User[], onLogin: (user: User) => void }> = ({ users, onLogin }) => {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <ClubLogo className="auth-logo" />
                <h2>Welcome to Funspot Club</h2>
                <p>Please select your profile to log in.</p>
                <div className="login-user-list">
                    {users.map(user => (
                        <button key={user.id} onClick={() => onLogin(user)} className="btn btn-secondary btn-full">
                            {user.name} ({user.role})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARD WIDGETS AND VIEWS ---
const NotificationsWidget: FC<{ notifications: AppNotification[], programs: Program[], onBookProgram: (program: Program, notificationId: string) => void, onDismiss: (id: string) => void }> = ({ notifications, programs, onBookProgram, onDismiss }) => {
    if (notifications.length === 0) return null;
    return (
        <div className="widget notification-widget widget-col-span-full">
            <div className="widget-header">
                <h3><BellIcon /> Notifications</h3>
            </div>
            <div className="notification-list">
                {notifications.map(n => {
                    const program = programs.find(p => p.id === n.programId);
                    return (
                        <div key={n.id} className="notification-item">
                            <p>{n.message}</p>
                            <div className="notification-actions">
                                {program && <button className="btn btn-primary btn-sm" onClick={() => onBookProgram(program, n.id)}>Book Now</button>}
                                <button className="btn btn-secondary btn-sm" onClick={() => onDismiss(n.id)}>Dismiss</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

const AdminDashboard: FC<{ users: User[], setModalState: Dispatch<SetStateAction<ModalState>> }> = ({ users, setModalState }) => {
    return (
        <div className="widget widget-col-span-full">
            <div className="widget-header">
                <h3><UsersIcon/> User Management</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setModalState({ type: 'USER_FORM' })}>
                    <UserPlusIcon /> Add User
                </button>
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
                                        <button className="btn-icon" onClick={() => setModalState({ type: 'USER_FORM', user })}>
                                            <PencilIcon className="icon-sm" />
                                        </button>
                                        <button className="btn-icon" onClick={() => setModalState({ type: 'DELETE_USER', user })}>
                                            <TrashIcon className="icon-sm" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ManagerDashboard: FC<{ users: User[], programs: Program[], setModalState: Dispatch<SetStateAction<ModalState>>, clubEvents: ClubEvent[], coaches: User[] }> = ({ users, programs, setModalState, clubEvents, coaches }) => {
    const coachCount = useMemo(() => users.filter(u => u.role === 'Coach').length, [users]);
    const athleteCount = useMemo(() => users.filter(u => u.role === 'Athlete').length, [users]);
    const totalCapacity = useMemo(() => programs.reduce((acc, p) => acc + p.capacity, 0), [programs]);
    const totalEnrolled = useMemo(() => programs.reduce((acc, p) => acc + p.enrolled_count, 0), [programs]);

    return (
        <>
            <div className="widget">
                <h3>At a Glance</h3>
                <p><strong>Coaches:</strong> {coachCount}</p>
                <p><strong>Athletes:</strong> {athleteCount}</p>
                <p><strong>Club Capacity:</strong> {totalEnrolled} / {totalCapacity}</p>
            </div>
            <CalendarWidget clubEvents={clubEvents} setModalState={setModalState} />
            <ProgramManagementWidget programs={programs} coaches={coaches} setModalState={setModalState} />
        </>
    );
};


const CoachDashboard: FC<{ coach: User, users: User[], programs: Program[] }> = ({ coach, users, programs }) => {
    const assignedPrograms = useMemo(() => programs.filter(p => p.coach_id === coach.id), [programs, coach.id]);
    const assignedAthletes = useMemo(() => users.filter(u => u.coach_id === coach.id), [users, coach.id]);

    return (
        <>
            <div className="widget widget-col-span-full">
                <h3>Your Programs</h3>
                <div className="program-list">
                    {assignedPrograms.length > 0 ? assignedPrograms.map(p => (
                        <div key={p.id} className="program-list-item">
                            <div className="program-item-header">
                               <h4>{p.title}</h4>
                                <p>{p.enrolled_count} / {p.capacity} enrolled</p>
                            </div>
                            <p>{p.schedule.map(s => `${s.day} @ ${s.time}`).join(', ')}</p>
                        </div>
                    )) : <p>You are not assigned to any programs.</p>}
                </div>
            </div>
            <div className="widget widget-col-span-full">
                <h3>Your Athletes ({assignedAthletes.length})</h3>
                {/* Athlete list here */}
            </div>
        </>
    );
};

const ParentDashboard: FC<{ parent: User, users: User[], programs: Program[], bookedSessions: SessionBooking[], onBookProgram: (p: Program) => void, onJoinWaitlist: (p: Program) => void, onLeaveWaitlist: (p: Program) => void, onShowDetails: (p: Program) => void, coaches: User[], onCancelBooking: (programId: string, transactionId: string) => void, setModalState: Dispatch<SetStateAction<ModalState>>, clubEvents: ClubEvent[] }> = (props) => {
    const children = useMemo(() => props.users.filter(u => u.parent_id === props.parent.id), [props.users, props.parent.id]);

    return (
        <>
            <div className="widget widget-col-span-full">
                <h3>Your Children</h3>
                {children.map(child => (
                    <div key={child.id}>{child.name} - <span className={`skill-badge ${getSkillClassName(child.skill_level!)}`}>{child.skill_level}</span></div>
                ))}
            </div>
            <MySessionsWidget sessions={props.bookedSessions} programs={props.programs} users={props.users} onCancelBooking={props.onCancelBooking} />
            <AvailableProgramsWidget programs={props.programs} onBookProgram={props.onBookProgram} onJoinWaitlist={props.onJoinWaitlist} onLeaveWaitlist={props.onLeaveWaitlist} onShowDetails={props.onShowDetails} currentUser={props.parent} coaches={props.coaches} />
            <CalendarWidget clubEvents={props.clubEvents} setModalState={props.setModalState} />
        </>
    )
};

const AthleteDashboard: FC<{ athlete: User, users: User[], programs: Program[], bookedSessions: SessionBooking[], onBookProgram: (p: Program) => void, onJoinWaitlist: (p: Program) => void, onLeaveWaitlist: (p: Program) => void, onShowDetails: (p: Program) => void, coaches: User[], onCancelBooking: (programId: string, transactionId: string) => void, setModalState: Dispatch<SetStateAction<ModalState>>, clubEvents: ClubEvent[] }> = (props) => {
    const coach = useMemo(() => props.users.find(u => u.id === props.athlete.coach_id), [props.users, props.athlete.coach_id]);

    return (
        <>
            <div className="widget">
                <h3>My Coach</h3>
                {coach ? <p>{coach.name}</p> : <p>Not Assigned</p>}
            </div>
            <div className="widget">
                <h3>My Skill Level</h3>
                <span className={`skill-badge ${getSkillClassName(props.athlete.skill_level!)}`}>{props.athlete.skill_level}</span>
            </div>
            <MySessionsWidget sessions={props.bookedSessions} programs={props.programs} onCancelBooking={props.onCancelBooking} />
            <AvailableProgramsWidget programs={props.programs} onBookProgram={props.onBookProgram} onJoinWaitlist={props.onJoinWaitlist} onLeaveWaitlist={props.onLeaveWaitlist} onShowDetails={props.onShowDetails} currentUser={props.athlete} coaches={props.coaches} />
            <CalendarWidget clubEvents={props.clubEvents} setModalState={props.setModalState} />
        </>
    )
};

const MySessionsWidget: FC<{ sessions: SessionBooking[], programs: Program[], onCancelBooking: (programId: string, transactionId: string) => void, users?: User[] }> = ({ sessions, programs, onCancelBooking, users }) => (
    <div className="widget widget-col-span-full">
        <h3>My Sessions</h3>
        <div className="program-list">
            {sessions.length > 0 ? sessions.map(booking => {
                const program = programs.find(p => p.id === booking.programId);
                if (!program) return null;
                
                const athlete = users?.find(u => u.id === booking.userId);

                return (
                    <div key={booking.id} className="program-list-item enrolled">
                        <div className="program-item-header">
                            <h4>{program.title} {athlete && `(${athlete.name})`}</h4>
                        </div>
                        <p><strong>Session:</strong> {booking.session.day} at {booking.session.time}</p>
                        <div className="program-item-actions">
                            <button className="btn btn-secondary btn-sm" onClick={() => onCancelBooking(program.id, booking.transactionId)}>Cancel Booking</button>
                        </div>
                    </div>
                )
            }) : <p>You have not booked any sessions.</p>}
        </div>
    </div>
);

const AvailableProgramsWidget: FC<{ programs: Program[], onBookProgram: (p: Program) => void, onJoinWaitlist: (p: Program) => void, onLeaveWaitlist: (p: Program) => void, onShowDetails: (p: Program) => void, currentUser: User, coaches: User[] }> = ({ programs, onBookProgram, onJoinWaitlist, onLeaveWaitlist, onShowDetails, currentUser, coaches }) => {
    const [categoryFilter, setCategoryFilter] = useState<ProgramCategory | 'All'>('All');
    
    const programCategories = useMemo(() => ['All', ...Array.from(new Set(programs.map(p => p.category)))], [programs]);

    const filteredPrograms = useMemo(() => {
        if (categoryFilter === 'All') return programs;
        return programs.filter(p => p.category === categoryFilter);
    }, [programs, categoryFilter]);

    const getCapacityClass = (p: Program) => {
        const percentage = p.enrolled_count / p.capacity;
        if (percentage >= 1) return 'full';
        if (percentage >= 0.8) return 'nearing-capacity';
        return '';
    };

    return (
        <div className="widget widget-col-span-full">
            <div className="widget-header">
                <h3>Available Programs</h3>
                 <div className="program-filter">
                    <label htmlFor="category-filter">Category:</label>
                    <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as ProgramCategory | 'All')}>
                        {programCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <div className="program-grid">
                {filteredPrograms.map(p => {
                    const coach = coaches.find(c => c.id === p.coach_id);
                    const isFull = p.enrolled_count >= p.capacity;
                    const isWaitlisted = p.waitlisted_users.includes(currentUser.id);
                    
                    return (
                        <div key={p.id} className={`program-card ${getCapacityClass(p)}`}>
                            <img src={p.photo_url} alt={p.title} className="program-card-image" />
                            <div className="program-card-content">
                                <div className="program-item-header">
                                    <h4>{p.title}</h4>
                                    <div className="program-badges">
                                        <span className={`category-badge category-${p.category.toLowerCase().replace(' ','-')}`}>{p.category}</span>
                                        <span className={`skill-badge ${getSkillClassName(p.skill_level)}`}>{p.skill_level}</span>
                                    </div>
                                </div>
                                <p><strong>Coach:</strong> {coach?.name}</p>
                                <p>
                                    <strong>Status:</strong> {p.enrolled_count} / {p.capacity} enrolled
                                    {getCapacityClass(p) === 'nearing-capacity' && <span className="capacity-warning"> (Filling up!)</span>}
                                    {isFull && <span className="capacity-full"> (Full)</span>}
                                </p>
                                <div className="program-item-actions">
                                    <button className="btn btn-secondary btn-sm" onClick={() => onShowDetails(p)}><EyeIcon className="h-4 w-4" /> Details</button>
                                    {!isFull && <button className="btn btn-primary btn-sm" onClick={() => onBookProgram(p)}>Book Session</button>}
                                    {isFull && !isWaitlisted && <button className="btn btn-primary btn-sm" onClick={() => onJoinWaitlist(p)}>Join Waitlist</button>}
                                    {isFull && isWaitlisted && <button className="btn btn-secondary btn-sm" onClick={() => onLeaveWaitlist(p)}>Leave Waitlist</button>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CalendarWidget: FC<{ clubEvents: ClubEvent[], setModalState: Dispatch<SetStateAction<ModalState>> }> = ({ clubEvents, setModalState }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `empty-${i}`, empty: true });
        }
        for (let i = 1; i <= lastDateOfMonth; i++) {
            days.push({ key: `${year}-${month}-${i}`, date: new Date(year, month, i), dayOfMonth: i });
        }
        return days;
    }, [currentDate]);

    const eventsByDate = useMemo(() => {
        return clubEvents.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, ClubEvent[]>);
    }, [clubEvents]);

    const handleDayClick = (day: { date: Date }) => {
        const dateString = day.date.toISOString().split('T')[0];
        const events = eventsByDate[dateString];
        if (events && events.length > 0) {
            setModalState({ type: 'EVENT_DETAILS', date: day.date, events });
        }
    };

    return (
        <div className="widget widget-col-span-full">
            <div className="widget-header">
                <h3><CalendarDaysIcon /> Event Calendar</h3>
                <div className="calendar-nav">
                    <button className="btn-icon" onClick={() => changeMonth(-1)}><ChevronLeftIcon /></button>
                    <h4>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <button className="btn-icon" onClick={() => changeMonth(1)}><ChevronRightIcon /></button>
                </div>
            </div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}
                {daysInMonth.map(day => {
                    if (day.empty) return <div key={day.key} className="calendar-day empty"></div>;
                    
                    const dateString = day.date!.toISOString().split('T')[0];
                    const hasEvent = !!eventsByDate[dateString];
                    const isToday = dateString === new Date().toISOString().split('T')[0];

                    return (
                        <div 
                            key={day.key} 
                            className={`calendar-day ${hasEvent ? 'event-day' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => hasEvent && handleDayClick(day as { date: Date })}
                        >
                            <span>{day.dayOfMonth}</span>
                            {hasEvent && <div className="event-dots"><div className="dot"></div></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProgramManagementWidget: FC<{
    programs: Program[],
    coaches: User[],
    setModalState: Dispatch<SetStateAction<ModalState>>
}> = ({ programs, coaches, setModalState }) => {
    return (
        <div className="widget widget-col-span-full">
            <div className="widget-header">
                <h3><BookOpenIcon /> Program Management</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setModalState({ type: 'PROGRAM_FORM' })}>
                    <PlusCircleIcon /> Add Program
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Coach</th>
                            <th>Capacity</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => {
                            const coach = coaches.find(c => c.id === program.coach_id);
                            return (
                                <tr key={program.id}>
                                    <td data-label="Title">{program.title}</td>
                                    <td data-label="Coach">{coach?.name || 'N/A'}</td>
                                    <td data-label="Capacity">{program.enrolled_count} / {program.capacity}</td>
                                    <td data-label="Price">{formatCurrency(program.price_cents, program.currency)}</td>
                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                            <button className="btn-icon" onClick={() => setModalState({ type: 'PROGRAM_FORM', program })} aria-label={`Edit ${program.title}`}>
                                                <PencilIcon className="icon-sm" />
                                            </button>
                                            <button className="btn-icon" onClick={() => setModalState({ type: 'DELETE_PROGRAM', program })} aria-label={`Delete ${program.title}`}>
                                                <TrashIcon className="icon-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MODAL COMPONENTS ---
const Modal: FC<{ children: React.ReactNode, onClose: () => void, size?: 'sm' | 'md' | 'lg' }> = ({ children, onClose, size = 'md' }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className={`modal-content modal-${size}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const ProgramDetailsModal: FC<{ program: Program, users: User[], onBook: (p: Program) => void, onJoinWaitlist: (p: Program) => void, onLeaveWaitlist: (p: Program) => void, onClose: () => void, currentUser: User | null, sessionBookings: SessionBooking[], userAndChildrenIds: string[] }> = ({ program, users, onBook, onJoinWaitlist, onLeaveWaitlist, onClose, currentUser, sessionBookings, userAndChildrenIds }) => {
    const coach = users.find(u => u.id === program.coach_id);
    if (!currentUser) return null;

    const isFull = program.enrolled_count >= program.capacity;
    const isWaitlisted = program.waitlisted_users.includes(currentUser.id);
    
    const isEnrolled = sessionBookings.some(b => b.programId === program.id && userAndChildrenIds.includes(b.userId));

    return (
        <Modal onClose={onClose}>
            <div className="modal-header">
                <h2>{program.title}</h2>
                <button onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
            </div>
            <div className="modal-body program-details">
                <img src={program.photo_url} alt={program.title} className="program-details-image" />
                <p><strong>Coach:</strong> {coach?.name}</p>
                <p>{program.description}</p>
                <p><strong>Category:</strong> <span className={`category-badge category-${program.category.toLowerCase().replace(' ','-')}`}>{program.category}</span></p>
                <p><strong>Skill Level:</strong> <span className={`skill-badge ${getSkillClassName(program.skill_level)}`}>{program.skill_level}</span></p>
                <p><strong>Schedule:</strong> {program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')} ({program.duration_minutes} mins)</p>
                <p><strong>Price:</strong> {formatCurrency(program.price_cents, program.currency)}</p>
                <p><strong>Capacity:</strong> {program.enrolled_count} / {program.capacity} skaters enrolled.</p>
                {isFull && <p className="waitlist-info">This program is currently full.</p>}
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Close</button>
                {isEnrolled ? (
                    <button className="btn btn-primary" disabled>Already Booked</button>
                ) : !isFull ? (
                    <button className="btn btn-primary" onClick={() => onBook(program)}>Book a Session</button>
                ) : isWaitlisted ? (
                    <button className="btn btn-secondary" onClick={() => onLeaveWaitlist(program)}>Leave Waitlist</button>
                ) : (
                    <button className="btn btn-primary" onClick={() => onJoinWaitlist(program)}>Join Waitlist</button>
                )}
            </div>
        </Modal>
    );
};

const SessionBookingModal: FC<{ program: Program, onClose: () => void, onProceedToPayment: (program: Program, session: { day: string; time: string }) => void }> = ({ program, onClose, onProceedToPayment }) => {
    const [selectedSession, setSelectedSession] = useState<string>('');

    const handleProceed = () => {
        const [day, time] = selectedSession.split('|');
        onProceedToPayment(program, { day, time });
    };

    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-header">
                <h2>Select a Session</h2>
                <button onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
            </div>
            <div className="modal-body">
                <h4>{program.title}</h4>
                <p>Please choose one of the available weekly sessions for this program.</p>
                <div className="session-selection-list">
                    {program.schedule.map((s, i) => (
                        <label key={i} className="session-option">
                            <input
                                type="radio"
                                name="session"
                                value={`${s.day}|${s.time}`}
                                checked={selectedSession === `${s.day}|${s.time}`}
                                onChange={(e) => setSelectedSession(e.target.value)}
                            />
                            <div className="session-option-details">
                                <span className="day">{s.day}</span>
                                <span className="time">{s.time}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleProceed} disabled={!selectedSession}>
                    Proceed to Payment
                </button>
            </div>
        </Modal>
    );
};

const PaymentModal: FC<{ program: Program, session: {day: string, time: string}, onConfirm: (p: Program, s: {day: string, time: string}) => void, onClose: () => void }> = ({ program, session, onConfirm, onClose }) => {
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-header">
                <h2>Complete Booking</h2>
                <button onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
            </div>
            <div className="modal-body">
                <div className="payment-summary">
                    <h4>{program.title}</h4>
                    <p><strong>Session:</strong> {session.day} at {session.time}</p>
                    <div className="price">{formatCurrency(program.price_cents, program.currency)}</div>
                </div>
                <div className="payment-tabs">
                    <button className={paymentMethod === 'mpesa' ? 'active' : ''} onClick={() => setPaymentMethod('mpesa')}>
                        <DevicePhoneMobileIcon /> M-Pesa
                    </button>
                    <button className={paymentMethod === 'card' ? 'active' : ''} onClick={() => setPaymentMethod('card')}>
                        <CreditCardIcon /> Card
                    </button>
                </div>
                {paymentMethod === 'mpesa' && <div className="mpesa-instructions">Instructions for M-Pesa payment simulation will appear here. For now, just confirm.</div>}
                {paymentMethod === 'card' && <div className="mpesa-instructions">Card payment is not yet implemented. Please use M-Pesa.</div>}
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={() => onConfirm(program, session)}>Confirm Payment</button>
            </div>
        </Modal>
    );
};

const ConfirmationModal: FC<{ program: Program, transactionId: string, onClose: () => void }> = ({ program, transactionId, onClose }) => {
    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-body booking-confirmation">
                <CheckCircleIcon />
                <h3>Booking Confirmed!</h3>
                <p>You're all set for {program.title}.</p>
                <div className="confirmation-details">
                    <div><span>Program</span> <span>{program.title}</span></div>
                    <div><span>Amount Paid</span> <span>{formatCurrency(program.price_cents, program.currency)}</span></div>
                    <div><span>Transaction ID</span> <span>{transactionId}</span></div>
                </div>
                <button className="btn btn-primary btn-full" onClick={onClose}>Done</button>
            </div>
        </Modal>
    );
};

const UserFormModal: FC<{ user?: User, onSave: (user: User) => void, onClose: () => void, coaches: User[], parents: User[] }> = ({ user, onSave, onClose, coaches, parents }) => {
    const [formData, setFormData] = useState<Partial<User>>(user || { role: 'Athlete' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, photo_url: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };

    return (
        <Modal onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h2>{user ? 'Edit User' : 'Create User'}</h2>
                    <button onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
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
                            <label htmlFor="dob">Date of Birth</label>
                            <input type="date" id="dob" name="dob" value={formData.dob || ''} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                                <option value="Athlete">Athlete</option>
                                <option value="Parent">Parent</option>
                                <option value="Coach">Coach</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                         {formData.role === 'Athlete' && (
                             <>
                                <div className="form-group">
                                    <label htmlFor="skill_level">Skill Level</label>
                                    <select id="skill_level" name="skill_level" value={formData.skill_level} onChange={handleChange}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="coach_id">Assign Coach</label>
                                    <select id="coach_id" name="coach_id" value={formData.coach_id} onChange={handleChange}>
                                        <option value="">None</option>
                                        {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="parent_id">Assign Parent</label>
                                    <select id="parent_id" name="parent_id" value={formData.parent_id} onChange={handleChange}>
                                        <option value="">None</option>
                                        {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </>
                         )}
                        <div className="form-group photo-upload-container">
                            <img src={formData.photo_url || `https://i.pravatar.cc/150`} alt="Profile preview" className="profile-preview" />
                            <div>
                                <label htmlFor="photo_url">Profile Photo</label>
                                <input type="file" id="photo_url_input" name="photo_url_input" onChange={handlePhotoChange} accept="image/*" />
                            </div>
                        </div>
                         <div className="form-group form-grid-span-2">
                             <label htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea>
                         </div>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save User</button>
                </div>
            </form>
        </Modal>
    );
};

const DeleteConfirmationModal: FC<{ user: User, onDelete: (user: User) => void, onClose: () => void }> = ({ user, onDelete, onClose }) => {
    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-body delete-confirmation">
                <ExclamationTriangleIcon className="delete-modal-icon" />
                <h3>Are you sure?</h3>
                <p>This action will permanently delete <strong>{user.name}</strong>. This cannot be undone.</p>
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-danger" onClick={() => onDelete(user)}>Delete</button>
            </div>
        </Modal>
    );
};

const EventDetailsModal: FC<{ date: Date, events: ClubEvent[], onClose: () => void }> = ({ date, events, onClose }) => {
    return (
        <Modal onClose={onClose} size="md">
            <div className="modal-header">
                <h2>Events on {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
                <button onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
            </div>
            <div className="modal-body event-details-list">
                {events.map(event => (
                    <div key={event.id} className="event-item">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
};

const ProgramFormModal: FC<{
    program?: Program,
    onSave: (program: Program) => void,
    onClose: () => void,
    coaches: User[]
}> = ({ program, onSave, onClose, coaches }) => {
    const [formData, setFormData] = useState<Partial<Program>>(program || {
        title: '',
        description: '',
        coach_id: '',
        price_cents: 0,
        duration_minutes: 45,
        schedule: [{ day: 'Monday', time: '10:00' }],
        skill_level: 'All',
        capacity: 10,
        location_type: 'Indoor',
        category: 'General',
        photo_url: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        const isNumber = target.type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
    };

    const handleScheduleChange = (index: number, field: 'day' | 'time', value: string) => {
        const newSchedule = [...(formData.schedule || [])];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setFormData(prev => ({ ...prev, schedule: newSchedule }));
    };

    const addScheduleItem = () => {
        const newSchedule = [...(formData.schedule || []), { day: 'Monday', time: '10:00' }];
        setFormData(prev => ({ ...prev, schedule: newSchedule }));
    };

    const removeScheduleItem = (index: number) => {
        const newSchedule = [...(formData.schedule || [])];
        newSchedule.splice(index, 1);
        setFormData(prev => ({ ...prev, schedule: newSchedule }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.coach_id) {
            alert('Title and Coach are required.'); // A toast would be better
            return;
        }
        onSave(formData as Program);
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const programCategories: ProgramCategory[] = ['Figure Skating', 'Speed Skating', 'Synchronized Skating', 'Hockey Skills', 'General'];
    const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All'];

    return (
        <Modal onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h2>{program ? 'Edit Program' : 'Create Program'}</h2>
                    <button type="button" onClick={onClose} className="btn-icon" aria-label="Close"><XMarkIcon /></button>
                </div>
                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Program Title</label>
                            <input type="text" id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                                {programCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="coach_id">Assign Coach</label>
                            <select id="coach_id" name="coach_id" value={formData.coach_id} onChange={handleChange} required>
                                <option value="">Select a coach</option>
                                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skill_level">Skill Level</label>
                            <select id="skill_level" name="skill_level" value={formData.skill_level} onChange={handleChange} required>
                                {skillLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price_cents">Price (in cents)</label>
                            <input type="number" id="price_cents" name="price_cents" value={formData.price_cents || 0} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration_minutes">Duration (minutes)</label>
                            <input type="number" id="duration_minutes" name="duration_minutes" value={formData.duration_minutes || 0} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="capacity">Capacity</label>
                            <input type="number" id="capacity" name="capacity" value={formData.capacity || 0} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location_type">Location</label>
                            <select id="location_type" name="location_type" value={formData.location_type} onChange={handleChange} required>
                                <option value="Indoor">Indoor</option>
                                <option value="Outdoor">Outdoor</option>
                            </select>
                        </div>
                        <div className="form-group form-grid-span-2">
                            <label htmlFor="photo_url">Photo URL</label>
                            <input type="text" id="photo_url" name="photo_url" value={formData.photo_url || ''} onChange={handleChange} placeholder="https://example.com/image.png" />
                        </div>
                        <div className="form-group form-grid-span-2">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} required></textarea>
                        </div>
                        <div className="form-group form-grid-span-2">
                            <label>Schedule</label>
                            {formData.schedule?.map((s, index) => (
                                <div key={index} className="schedule-item-form">
                                    <select value={s.day} onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}>
                                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                    <input type="time" value={s.time} onChange={(e) => handleScheduleChange(index, 'time', e.target.value)} />
                                    {formData.schedule && formData.schedule.length > 1 &&
                                        <button type="button" className="btn-icon" onClick={() => removeScheduleItem(index)} aria-label="Remove session time"><TrashIcon className="icon-sm" /></button>
                                    }
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addScheduleItem}>Add Session Time</button>
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

const DeleteProgramConfirmationModal: FC<{ program: Program, onDelete: (program: Program) => void, onClose: () => void }> = ({ program, onDelete, onClose }) => {
    return (
        <Modal onClose={onClose} size="sm">
            <div className="modal-body delete-confirmation">
                <ExclamationTriangleIcon className="delete-modal-icon" />
                <h3>Are you sure?</h3>
                <p>This action will permanently delete <strong>{program.title}</strong> and all associated bookings. This cannot be undone.</p>
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-danger" onClick={() => onDelete(program)}>Delete</button>
            </div>
        </Modal>
    );
};


// --- TOAST COMPONENT ---
const Toast: FC<{ message: string, type: ToastMessage['type'], onClose: () => void }> = ({ message, type, onClose }) => (
    <div className={`toast toast-${type}`}>
        <span>{message}</span>
        <button onClick={onClose} className="toast-close-btn"><XMarkIcon /></button>
    </div>
);