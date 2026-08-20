import type { User, RegisterData, LoginCredentials } from "@/Redux/authTypes";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api';

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        const text = await response.text();
        console.log('Raw response:', text);

        let jsonData;
         try {
          jsonData = text ? JSON.parse(text) : {};
         } catch (parseError) {
           console.error('Failed to parse JSON:', parseError);
           throw new Error('Server returned invalid response format');
        }

        if (!response.ok) {
            const errorMessage = jsonData.message || jsonData.error || `Server error (${response.status})`;
            throw new Error(errorMessage); 
        }

        if (!jsonData.user || !jsonData.token) {
        console.error('Missing user or token in response:', jsonData);
        throw new Error('Invalid response from server');
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