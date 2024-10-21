import './styles/index.css'
import { AppRouter } from './router/AppRouter'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <div className='bg-baseBackground h-[100vh] w-[100vw]'>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <AppRouter />
      </ThemeProvider>
    </div>
  )
}

export default App
