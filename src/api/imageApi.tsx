import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Describe the image information 
export interface UnsplashImage {
    id: string;
    urls: { small: string; thumb: string }; // links to different image sizes
    alt_description: string | null;
    user: { name: string; links: { html: string } }; // info about the photographer
}

// Describes the search response
interface ImageSearchResponse { 
    results: UnsplashImage[] 
}

// Create the image API setup
export const imageApi = createApi({
    reducerPath: 'imageApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.unsplash.com' }),
    // Requests our app can make
    endpoints: (builder) => ({
        getImages: builder.query<ImageSearchResponse, string>({
            query: (searchTerm) => ({
                url: `search/photos`,
                params: {
                    query: searchTerm,
                    // read the Unsplash access key from .env
                    client_id: import.meta.env.VITE_UNSPLASH_KEY,
                    per_page: 8,
                },
            }),
        }),
    }),
});

export const { useGetImagesQuery } = imageApi