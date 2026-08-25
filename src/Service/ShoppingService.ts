import axiosInstance from "@/api/axiosConfig";
import type { ShoppingList, ShoppingListInput } from "@/Redux/shoppingTypes";

export const shoppingService ={
    async fetchLists(userId: string): Promise<ShoppingList[]> {
        const response = await axiosInstance.get(`/lists?userId=${userId}`);
        return response.data;
    },

     async addList(userId: string, data: ShoppingListInput): Promise<ShoppingList> {
        const items = data.items.map((item, index) => ({
            ...item,
            id: `${Date.now()}-${index}`,
        }));

        const response = await axiosInstance.post('/lists', {
            userId,
            name: data.name,
            category: data.category,
            notes: data.notes || '',
            image: data.image || '',
            items,
            createdAt: new Date().toISOString(),
        });

        return response.data;
    },

    async updateList(id: string, data: ShoppingListInput): Promise<ShoppingList> {
        const items = data.items.map((item: any, index) => ({
            ...item,
            id: item.id || `${Date.now()}-${index}`,
        }));

        const response = await axiosInstance.patch(`/lists/${id}`, {
            name: data.name,
            category: data.category,
            notes: data.notes || '',
            image: data.image || '',
            items,
        });

        return response.data;
    },

    async deleteList(id: string): Promise<string> {
        await axiosInstance.delete(`/lists/${id}`);
        return id;
    },
};