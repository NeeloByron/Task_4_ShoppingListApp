import CryptoJS from 'crypto-js'
import axiosInstance from '@/api/axiosConfig';
import type { User, RegisterData, LoginCredentials, updateProfileData, ChangePasswordData } from "@/Redux/authTypes";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
}
export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await axiosInstance.get('/users');
        const users = response.data;
        const hashedInput = hashPassword(credentials.password)

        const user = users.find((u: any) =>
          u.email === credentials.email && 
          u.password === hashedInput
        );

        if (!user) {
            throw new Error ('Invalid email or password');
        }
       const token = 'mock_jwt_token' + Date.now();

       return { user, token}
    },

    async register(data: RegisterData): Promise<{ user: User; token: string }> {
       const checkResponse = await axiosInstance.get('/users');
       const users = checkResponse.data;

       const existingUser = users.find((u: any) => u.email.toLowerCase() === data.email.toLocaleLowerCase());
       if (existingUser) {
        throw new Error('User with this email already exists');
       }

       const hashedPassword = hashPassword(data.password);
       const response = await axiosInstance.post('/users', {
          name: data.name,
          surname: data.surname,
          email: data.email,
          cellNumber: data.cellNumber,
          password: hashedPassword,
          createdAt: new Date().toISOString()
       });

       const newUser = response.data;
       const token = 'mock_jwt_token_' + Date.now();

       return { user: newUser, token}
    },

    async logout(_token: string): Promise<void> {
        // For json-server
        return Promise.resolve();
    },

    async updateProfile(userId: string, data: updateProfileData): Promise<User> {
        //verify if email is already used by another user
        const checkResponse = await axiosInstance.get('/users');
        const users = checkResponse.data;
        const existingUser = users.find(
            (u: any) => u.email.toLowerCase() === data.email.toLowerCase() && u.id !== userId
        );
        if (existingUser) {
            throw new Error('This email is already in use by another account');
        }

        //update user profile
        const response = await axiosInstance.patch(`/users/${userId}`, {
             name: data.name,
             surname: data.surname,
             email: data.email,
             cellNumber: data.cellNumber,
        });

        return response.data;
    },

    async changedPassword(userId: string, data: ChangePasswordData): Promise<void> {
        //get the current user data
        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const user = userResponse.data;

        //verify current password
        const hashedCurrent = hashPassword(data.currentPassword);
        if (user.password !== hashedCurrent) {
            throw new Error('Current password is incorrect');
        }

        // update with new password
        const hashedNew = hashPassword(data.newPassword);
        await axiosInstance.patch(`/users/${userId}`, {
            password: hashedNew,
        });
    },
};