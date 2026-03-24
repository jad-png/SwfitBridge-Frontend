import ThemeProvider from './ThemeProvider'
import { AuthProvider } from '../../features/auth/context/AuthContext'

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  )
}

export default AppProviders
