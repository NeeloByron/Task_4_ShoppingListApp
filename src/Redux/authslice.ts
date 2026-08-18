import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import type { User, AuthState} from "@/Redux/authTypes"

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
      /*login action*/
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    /*register action*/
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
     /*Update user*/
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
      state.user = { ...state.user, ...action.payload };
      }
    },  

  },
});

export default authSlice.reducer;
export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout, 
  updateUser
} = authSlice.actions