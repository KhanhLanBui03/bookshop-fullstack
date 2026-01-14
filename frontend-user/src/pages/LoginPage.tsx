import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

const LoginPage = () => {
    return (

        <Card className="w-full max-w-sm  mx-auto mt-30 shadow-lg">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button variant={"link"} className="p-0 mt-2">
                        <Link to="/register">Đăng ký</Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-800 dark:text-white">
                    Đăng nhập
                </Button>
                <Button variant="outline" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">
                    Login with Google
                </Button>
                <Link
    to="/"
    className="text-sm text-gray-500 hover:text-blue-600 underline mt-2"
  >
    ← Quay về trang chủ
  </Link>
            </CardFooter>
        </Card>
    )
}
export default LoginPage
