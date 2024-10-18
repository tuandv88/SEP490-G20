import { MainRouter } from './routers'
import { Button } from "@/components/ui/button"
import './styles/index.css'

function App() {
  return (
    <div className='bg-baseBackground h-[100vh] w-[100vw]'>
      <h1 className='text-3xl font-bold underline'>Hello Icoder</h1>
      <Button>Click me</Button>
      <MainRouter />
    </div>
  )
}

export default App
