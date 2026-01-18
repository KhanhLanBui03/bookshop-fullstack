
export type LoginRequest = {
    email: string;
    password: string;
}
export type LoginResponse = {
    token: string;
}
export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}
export type RegisterResponse = {
    token: string;
} 