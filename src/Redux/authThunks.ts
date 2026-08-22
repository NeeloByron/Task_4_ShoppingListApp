import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from '@/Service/authService'
import type { LoginCredentials, RegisterData } from "@/Redux/authTypes";
import type { RootState } from  "@/Redux/store";

export const loginUser = createAsyncThunk (
    'auth/loginUser',
    async (credentials: LoginCredentials, { rejectWithValue}) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (data: RegisterData, { rejectWithValue }) => {
      try {
        const response = await authService.register(data);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;
            if (token) {
                await authService.logout(token);
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

