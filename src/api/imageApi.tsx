import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const imageApi = createApi({
    reducerPath: 'imageApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.unsplash.com' }),
    endpoints: (builder) => ({
        getImages: builder.query({
            query: (searchTerm) => ({
                url: `search/photos`,
                params: {
                    query: searchTerm,
                    client_id: import.meta.env.VITE_UNSPLASH_KEY,
                    per_page: 8,
                },
            }),
        }),
    }),
});

export const { useGetImagesQuery } = imageApi