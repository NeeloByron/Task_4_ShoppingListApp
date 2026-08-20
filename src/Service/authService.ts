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
                u.password === credentials.password
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

        if (!Checkresponse.ok) {
            throw new Error('Failed to check existing users');
        }

        const users = await Checkresponse.json();
        //does this email exists - case sensentive 

        const exitingUser = users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
        
        if (exitingUser) {
            throw new Error('User with this email already exists');
         }

          //create new user in json server
          const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    cellNumber: data.cellNumber,
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

    async logout(_token: string): Promise<void> {
        // For json-server
        console.log('User logged out');
        return Promise.resolve();
    },
};