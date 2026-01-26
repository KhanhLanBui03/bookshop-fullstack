
export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}

export type RegisterResponse = {
    accessToken: string;
    refreshToken: string;
}

export type User = {
    userId: string;
    email: string;
    fullName: string;
    roles: string[];
}

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
}
