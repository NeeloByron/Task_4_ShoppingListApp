import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import type { User, AuthState} from "@/Redux/authTypes"
import { loginUser, registerUser, logoutUser, updateProfile, changePassword } from '@/Redux/authThunks';


const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

{/*initial state*/}
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
};

{/*Slice*/}
export const authSlice = createSlice ({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
     },
      updateUser: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
         state.user = { ...state.user, ...action.payload };
         localStorage.setItem('user', JSON.stringify(state.user));
        }
      },
       clearError: (state) => {
        state.error = null;
       },
    },

  extraReducers: (builder) => {
     builder
       .addCase(loginUser.pending, (state) => {
         state.loading = true;
         state.error = null;
       })

       .addCase(loginUser.fulfilled, (state, action) =>{
         state.loading = false;
         state.user = action.payload.user;
         state.token = action.payload.token;
         state.error = null;
         localStorage.setItem('user', JSON.stringify(action.payload.user));
         localStorage.setItem('token', action.payload.token);
       })

       .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
         state.user = null;
         state.token = null;
         localStorage.removeItem('user');
         localStorage.removeItem('token');
       })

       .addCase(registerUser.pending, (state) => {
         state.loading = true;
         state.error = null;
       })

       .addCase(registerUser.fulfilled, (state, action) => {
         state.loading = false;
         state.user = action.payload.user;
         state.token = action.payload.token;
         state.error = null;
         localStorage.setItem('user', JSON.stringify(action.payload.user));
         localStorage.setItem('token', action.payload.token);
       })

       .addCase(registerUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
         state.user = null;
         state.token = null;
         localStorage.removeItem('user');
         localStorage.removeItem('token');
       })

       .addCase(logoutUser.fulfilled, (state) => {
         state.user = null;
         state.token = null;
         state.loading = false;
         state.error = null;
         localStorage.removeItem('user');
         localStorage.removeItem('token');
       })

       .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
       })

       .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
       })

       .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
       })

       .addCase(changePassword.pending, (state) => {
         state.loading = true;
         state.error = null;
       })

       .addCase(changePassword.fulfilled, (state) => {
         state.loading = false;
       })

       .addCase(changePassword.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
       });
      },
  });
     
export default authSlice.reducer;
export const { logout, updateUser, clearError} = authSlice.actions