
import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './routes/router'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from './components/ui/sonner'
import { useCartStore } from './store/cart.store'
import { useEffect} from 'react'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { fetchCart, clearCart } = useCartStore()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      clearCart()
    }
  }, [user])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
