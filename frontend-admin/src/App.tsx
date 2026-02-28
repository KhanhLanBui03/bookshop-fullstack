import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import { GlobalStyles } from "./shared/GlobalStyles"

function App() {
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  )
}

export default App