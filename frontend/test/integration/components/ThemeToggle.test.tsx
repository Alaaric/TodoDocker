import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../../src/components/ThemeToggle';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    key: vi.fn(),
    length: 0,
  };
})();

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true 
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    document.documentElement.removeAttribute('data-theme');
  });

  it('devrait définir le thème sombre par défaut si aucun thème n\'est stocké', () => {

    localStorageMock.getItem.mockReturnValueOnce(null);
    
    render(<ThemeToggle />);

    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('devrait utiliser le thème stocké dans localStorage', () => {

    localStorageMock.getItem.mockReturnValueOnce('light');
    
    render(<ThemeToggle />);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('devrait basculer le thème lorsque le bouton est cliqué', () => {

    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    render(<ThemeToggle />);
    
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('devrait avoir un aria-label approprié pour l\'accessibilité', () => {

    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    render(<ThemeToggle />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Passer au mode clair');
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Passer au mode sombre');
  });
});
