import './styles/index.css'
import { AppRouter } from './router/AppRouter'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from './contexts/UserContext'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
