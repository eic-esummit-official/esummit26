'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isLoaded: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isLoaded: false,
})

const STORAGE_KEY = 'esummit-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  // Light mode temporarily disabled — enforce dark mode site-wide
  useEffect(() => {
    try {
      setThemeState('dark')
      applyTheme('dark')
    } catch {
      applyTheme('dark')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    // Enforce dark theme
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark')
    root.classList.remove('light')
  }

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // Ignore localStorage errors (private browsing, etc.)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
