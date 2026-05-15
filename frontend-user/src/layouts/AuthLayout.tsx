
import { Outlet } from 'react-router-dom'
import NavigationScroll from '@/components/NavigationScroll'

const AuthLayout = () => {
  return (
    <>
        <NavigationScroll />
        <Outlet/>
    </>
  )
}

export default AuthLayout
