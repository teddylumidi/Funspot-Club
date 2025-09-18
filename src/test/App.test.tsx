import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('App Component', () => {
  it('should render user selection login interface when no user is logged in', () => {
    render(<App />);
    expect(screen.getByText('FUNSPOT')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Funspot Club')).toBeInTheDocument();
    expect(screen.getByText('Please select your profile to log in.')).toBeInTheDocument();
    expect(screen.getByText('Alex Ray (Admin)')).toBeInTheDocument();
  });

  it('should handle user selection and login', () => {
    render(<App />);
    const adminButton = screen.getByText('Alex Ray (Admin)');
    
    fireEvent.click(adminButton);

    // Should redirect to dashboard after successful login
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('should render components without error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<App />);
    }).not.toThrow();

    consoleSpy.mockRestore();
  });
});