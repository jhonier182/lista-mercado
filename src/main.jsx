import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Flowbite } from 'flowbite-react'
import './index.css'
import App from './App'

// Configuración del tema oscuro
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const flowbiteTheme = {
  theme: {
    button: {
      color: {
        primary: 'bg-primary-600 hover:bg-primary-700',
      },
    },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Flowbite theme={flowbiteTheme}>
      <App />
    </Flowbite>
  </StrictMode>,
)
