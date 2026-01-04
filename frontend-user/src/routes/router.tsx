import MainLayout from "@/layouts/MainLayout"
import AboutPage from "@/pages/AboutPage"
import HomePage from "@/pages/HomePage"
import NotFound from "@/pages/NotFound"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    {
        element:<MainLayout/>,
        children:[
            {path:"/",element:<HomePage/>},
            {path:"/about",element:<AboutPage/>}
        ]
    },
    {
    path: "*",
    element: <NotFound/>,
  },
])
export default router