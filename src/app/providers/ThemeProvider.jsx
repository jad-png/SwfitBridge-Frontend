import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextInstance'
const THEME_KEY = 'swiftbridge-theme'
const DEFAULT_THEME = 'swiftbridge'
const THEMES = [DEFAULT_THEME, 'swiftbridge-dark']

function readStoredTheme() {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  return localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStoredTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme)
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      availableThemes: THEMES,
      setTheme,
      toggleTheme: () => {
        setTheme((prev) => (prev === DEFAULT_THEME ? 'swiftbridge-dark' : DEFAULT_THEME))
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
