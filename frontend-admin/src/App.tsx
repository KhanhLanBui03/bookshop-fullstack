import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import { AuthProvider } from "./feature/auth/contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App