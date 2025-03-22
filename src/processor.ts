import { promises as fs } from 'fs';
import { Restaurant } from './types.js';

interface InstagramPost {
    date: string;
    likes: number;
    comments: number;
    caption: string;
    url: string;
    location: string | null;
}

interface InstagramData {
    status: string;
    data: {
        username: string;
        full_name: string;
        biography: string;
        followers: number;
        following: number;
        post_count: number;
        posts: InstagramPost[];
    };
    error: string | null;
}

interface RestaurantWithInstagram extends Restaurant {
    instagram_data?: {
        followers: number;
        following: number;
        biography: string;
        post_count: number;
        recent_posts: InstagramPost[];
    };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        throw new Error(`Failed to read or parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function extractInstagramUsernames(data: Restaurant[]): string[] {
    return data
        .map(item => {
            if (!item.instagramURL) return '';
            
            try {
                const url = new URL(item.instagramURL);
                const pathParts = url.pathname.split('/');
                return pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || '';
            } catch {
                // If URL is invalid, try to extract username from the raw string
                const parts = item.instagramURL.split('/');
                return parts[parts.length - 1] || parts[parts.length - 2] || '';
            }
        })
        .filter(username => username !== ''); // Remove empty usernames
}

export async function processJsonFile(filePath: string): Promise<string[]> {
    try {
        const data = await readJsonFile<Restaurant[]>(filePath);
        return extractInstagramUsernames(data);
    } catch (error) {
        throw new Error(`Failed to process JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function mergeGmapsInstagram(gmapsPath: string, instagramPath: string, outputPath: string): Promise<void> {
    try {
        // Leer ambos archivos JSON
        const gmapsData = await readJsonFile<Restaurant[]>(gmapsPath);
        const instagramData = await readJsonFile<InstagramData>(instagramPath);

        // Encontrar el restaurante correspondiente en gmapsData
        const updatedGmapsData = gmapsData.map(restaurant => {
            // Extraer el username de la URL de Instagram
            if (!restaurant.instagramURL) return restaurant;
            
            const instagramUrl = restaurant.instagramURL;
            const username = instagramUrl.split('/').filter(Boolean).pop();

            // Si el username coincide con los datos de Instagram, fusionar la información
            if (username === instagramData.data.username) {
                return {
                    ...restaurant,
                    instagram_data: {
                        followers: instagramData.data.followers,
                        following: instagramData.data.following,
                        biography: instagramData.data.biography,
                        post_count: instagramData.data.post_count,
                        recent_posts: instagramData.data.posts
                    }
                } as RestaurantWithInstagram;
            }
            return restaurant;
        });

        // Escribir el resultado en el archivo de salida
        await fs.writeFile(outputPath, JSON.stringify(updatedGmapsData, null, 2));
        console.log(`Merged data written to ${outputPath}`);
    } catch (error) {
        throw new Error(`Failed to merge JSON files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
