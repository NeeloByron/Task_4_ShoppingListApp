import { createAsyncThunk } from '@reduxjs/toolkit';
import { shoppingService } from '@/Service/ShoppingService';
import type { ShoppingListInput } from '@/Redux/shoppingTypes'
import type { RootState } from '@/Redux/store'

export const fetchLists = createAsyncThunk (
    'shopping/fetchLists',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.id;
            if (!userId) throw new Error('Not authenticated');
            return await shoppingService.fetchLists(userId);
        } catch (error: any) {
           return rejectWithValue(error.message || 'Failed to fetch list')
        }
    }
);

export const addList = createAsyncThunk(
    'shopping/addList',
    async (data: ShoppingListInput, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.id;
            if (!userId) throw new Error('Not authenticated');
            return await shoppingService.addList(userId, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add list');
        }
    }
);

export const updatelist = createAsyncThunk(
    'shopping/updateList',
    async ({ id, data }: { id: string; data: ShoppingListInput}, { rejectWithValue }) => {
        try {
            return await shoppingService.updateList(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update list');
        }
    }
);

export const deleteList = createAsyncThunk(
    'shopping/deleteList',
    async (id: string, { rejectWithValue }) => {
       try {
          return await shoppingService.deleteList(id);
       } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to delete list');
       }
    }
);