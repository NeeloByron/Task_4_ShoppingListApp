import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { imageApi } from '@/api/imageApi';
import authReducer from '@/Redux/authslice'
import shoppingReducer from '@/Redux/shoppingSlice'

export const store = configureStore ({
    reducer: {
        auth: authReducer,
        shopping: shoppingReducer,
        [imageApi.reducerPath]: imageApi.reducer,
    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(imageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;