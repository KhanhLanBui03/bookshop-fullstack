import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import { GlobalStyles } from "./shared/GlobalStyles"
import { AuthProvider } from "./feature/auth/contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App