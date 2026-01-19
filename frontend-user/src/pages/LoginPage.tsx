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
import { Book, BookOpen } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const LoginPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    return (
        <div className="min-h-screen bg-blue-600 flex relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-blue-600"></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* 3D Book elements */}
                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        top: `${20 + mousePosition.y * 0.02}px`,
                        left: `${10 + mousePosition.x * 0.02}px`,
                    }}
                >
                    <div className="relative">
                        <div className="w-32 h-40 bg-white opacity-5 rounded-lg transform -rotate-12 shadow-2xl"></div>
                        <div className="absolute top-2 left-2 w-32 h-40 bg-white opacity-10 rounded-lg transform -rotate-6 shadow-2xl"></div>
                    </div>
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        bottom: `${15 + mousePosition.y * 0.015}px`,
                        right: `${15 + mousePosition.x * 0.015}px`,
                    }}
                >
                    <div className="relative">
                        <div className="w-40 h-48 bg-white opacity-5 rounded-lg transform rotate-12 shadow-2xl"></div>
                        <div className="absolute top-2 right-2 w-40 h-48 bg-white opacity-10 rounded-lg transform rotate-6 shadow-2xl"></div>
                    </div>
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        top: `${50 + mousePosition.y * 0.01}%`,
                        right: `${10 + mousePosition.x * 0.01}px`,
                    }}
                >
                    <BookOpen className="w-24 h-24 text-white opacity-5" />
                </div>

                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        bottom: `${30 + mousePosition.y * 0.012}%`,
                        left: `${15 + mousePosition.x * 0.012}px`,
                    }}
                >
                    <Book className="w-20 h-20 text-white opacity-5" />
                </div>

                {/* Animated particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>

            <Card className="w-full max-w-sm  mx-auto mt-30 shadow-lg z-50">
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
        </div>
    )
}
export default LoginPage
