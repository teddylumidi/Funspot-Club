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
  parent_id?: