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
    cellNumber: string | number;
}

export interface updateProfileData {
    name: string;
    surname: string;
    email: string;
    cellNumber: string | number;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}