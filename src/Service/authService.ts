import { logout } from "@/Redux/authslice";
import type { User, RegisterData, LoginCredentials } from "@/Redux/authTypes";

const API_URL = import.meta.env.NEXT_PUBLIC_API_URL 

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed'); 
        }

        return response.json();
    },

    async register(data: RegisterData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    async logout(token: string): Promise<void> {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
    },
};