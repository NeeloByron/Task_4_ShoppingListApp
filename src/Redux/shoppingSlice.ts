import { createSlice } from '@reduxjs/toolkit'
import type { ShoppingState } from '@/Redux/shoppingTypes'
import { fetchLists, addList, updatelist, deleteList } from '@/Redux/shoppingThunks'

const initialState: ShoppingState = {
    lists: [],
    loading: false,
    error: null,
};

export const shoppingSlice = createSlice({
    name: "shopping",
    initialState,
    reducers: {
          clearShoppingError: (state) => {
            state.error = null;
          },
    },

    extraReducers: (builder) => {
        builder
          .addCase(fetchLists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLists.fulfilled, (state, action) => {
                state.loading = false;
                state.lists = action.payload;
            })
            .addCase(fetchLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addList.fulfilled, (state, action) => {
                state.loading = false;
                state.lists.unshift(action.payload);
            })
            .addCase(addList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatelist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatelist.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.lists.findIndex((l) => l.id === action.payload.id);
                if (index !== -1) {
                    state.lists[index] = action.payload;
                }
            })
            .addCase(updatelist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                state.loading = false;
                state.lists = state.lists.filter((l) => l.id !== action.payload);
            })
            .addCase(deleteList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
})
