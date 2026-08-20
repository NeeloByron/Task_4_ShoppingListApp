import type { User, RegisterData, LoginCredentials } from "@/Redux/authTypes";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            //get all users from json-server
            const response = await fetch(`${API_URL}/users`);

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = await response.json();

            //find user by login credentials(email and password)
            const user = users.find((u: any) => 
                u.email === credentials.email && 
                u.email === credentials.password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }
            
            //mock token
            const token = 'mock_jwt_token' + Date.now();

            return {
                user: user,
                token: token
            };
            } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(data: RegisterData): Promise<{ user: User; token: string }> {
        try {
            //checks if user exists
        const Checkresponse = await fetch(`${API_URL}/users`);
        const users = await Checkresponse.json();

        const exitingUser = users.find((u: any) => u.email === data.email);
         if (exitingUser) {
            throw new Error('User with this email already exits');
         }

          //create new user in json server
          const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.name,
                    lastName: data.surname,
                    email: data.email,
                    phoneNumber: data.cellNumber,
                    password: data.password,
                    createdAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const newUser = await response.json();
            
            //mock token
            const token = 'mock_jwt_token_' + Date.now();

            return {
                user: newUser,
                token: token
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async logout(token: string): Promise<void> {
        // For json-server
        console.log('User logged out');
        return Promise.resolve();
    },
};