import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import type { User, AuthState} from "@/Redux/authTypes"
import { loginUser, registerUser, logoutUser } from '@/Redux/authThunks';
import { act } from "react";


{/*initial state*/}
const initialState: AuthState = {
    user: null,
    token: null,
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
     },
      updateUser: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
         state.user = { ...state.user, ...action.payload };
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
       })

       .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
         state.user = null;
         state.token = null;
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
       })

       .addCase(registerUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
         state.user = null;
         state.token = null;
       })

       .addCase(logoutUser.fulfilled, (state) => {
         state.user = null;
         state.token = null;
         state.loading = false;
         state.error = null;
       });
      },
  });
     
export default authSlice.reducer;
export const { logout, updateUser, clearError} = authSlice.actions