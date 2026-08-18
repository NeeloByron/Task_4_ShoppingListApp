{/*user*/}
export interface User {
    id: string;
    email: string;
    name: string;
    surname: string;
    cellNumber: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    updateUser: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    surname: string;
    cellNumber: number;
}