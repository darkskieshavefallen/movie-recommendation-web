import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { Toaster } from '@/shared/ui/toast'
import { router } from './app/router'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster>
        <RouterProvider router={router} />
      </Toaster>
    </ThemeProvider>
  </StrictMode>,
)
