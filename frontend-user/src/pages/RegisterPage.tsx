
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
const RegisterPage = () => {
    return (
        <Card className="w-full max-w-sm  mx-auto mt-30 shadow-lg">
            <CardHeader className="text-center">
                <CardTitle>Register for an account</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className='grid gap-2'>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                required
                            />
                        </div>
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
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-800 dark:text-white">
                    Đăng ký
                </Button>
                <CardDescription className="text-center">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </CardDescription>
            </CardFooter>
        </Card>
    )
}

export default RegisterPage
