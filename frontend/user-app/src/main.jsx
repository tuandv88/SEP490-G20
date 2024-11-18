import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initEditorService } from './lib/code-editor/utils/init'

initEditorService(() => {
  createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <App />
    // </StrictMode>
  )
})
