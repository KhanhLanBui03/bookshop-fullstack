
export type LoginRequest = {
    email: string;
    password: string;
}
export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
}
export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}
export type RegisterResponse = {
    token: string;
}
