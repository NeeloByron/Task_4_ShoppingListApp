export interface Shoppingitem {
    id: string;
    name: string;
    quantity: number;
    checked: boolean;
}

export interface ShoppingList {
    id: string;
    userId: string;
    name: string;
    category: string;
    notes?: string;
    image?: string;
    items: Shoppingitem[];
    createdAt: string;
}

export interface ShoppingListInput {
    name: string;
    category: string;
    notes?: string;
    image?: string;
    items: Omit<Shoppingitem, 'id'>[];
}

export interface ShoppingState {
    lists: ShoppingList[];
    loading: boolean;
    error: string | null;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    checked: boolean;
    image?: string;
}