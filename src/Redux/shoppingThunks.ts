import { createAsyncThunk } from '@reduxjs/toolkit';
import { shoppingService } from '@/Service/ShoppingService';
import type { ShoppingListInput } from '@/Redux/shoppingTypes'
import type { RootState } from '@/Redux/store'
import { use } from 'react';

export const fetchLists = createAsyncThunk (
    'shopping/fetchLists',
    async (_, { getState, rejectWithvalue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.id;
            if (!userId) throw new Error('Not authenticated');
            return await shoppingService.fetchLists(userId);
        } catch (error: any) {
           return rejectWithvalue(error.message || 'Failed to fetch list')
        }
    }
);