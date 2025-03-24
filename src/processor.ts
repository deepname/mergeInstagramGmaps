import { promises as fs } from 'fs';
import { z } from 'zod';
import { Restaurant } from './types.js';
import { InstagramDataSchema, RestaurantSchema } from './schemas.js';

interface InstagramPost {
    date: string;
    likes: number;
    comments: number;
    caption: string;
    url: string;
    location: string | null;
}

interface InstagramUserData {
    username: string;
    full_name: string;
    biography: string;
    followers: number;
    following: number;
    post_count: number;
    posts: InstagramPost[];
}

interface InstagramData {
    status: string;
    data: InstagramUserData[];
    error: string | null;
}

interface RestaurantWithInstagram extends Restaurant {
    instagramData?: {
        followers: number;
        following: number;
        biography: string;
        post_count: number;
        recent_posts: InstagramPost[];
    };
}

async function readJsonFile<T>(filePath: string, schema?: z.ZodType<T>): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return schema ? schema.parse(data) : data;
    } catch (error) {
        throw new Error(`Failed to read or parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export function extractInstagramUsernames(data: Restaurant[]): string[] {
    return data
        .map(item => {
            if (!item.instagramURL) return '';
            
            try {
                const url = new URL(item.instagramURL);
                const pathParts = url.pathname.split('/');
                return pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || '';
            } catch {
                // If URL is invalid, try to extract username from the raw string
                const username = item.instagramURL.replace('@', '');
                return username || '';
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
        const gmapsData = await readJsonFile<Restaurant[]>(gmapsPath, z.array(RestaurantSchema));
        const instagramData = await readJsonFile<InstagramData>(instagramPath, InstagramDataSchema);

        // Encontrar el restaurante correspondiente en gmapsData
        const updatedGmapsData = gmapsData.map(restaurant => {
            // Extraer el username de la URL de Instagram
            if (!restaurant.instagramURL) return restaurant;
            
            const instagramUrl = restaurant.instagramURL;
            const username = instagramUrl.split('/').filter(Boolean).pop();

            // Buscar los datos de Instagram correspondientes
            const matchingInstagramData = instagramData.data.find(data => data.username === username);

            // Si encontramos datos de Instagram para este restaurante, fusionar la información
            if (matchingInstagramData) {
                return {
                    ...restaurant,
                    instagram_data: {
                        followers: matchingInstagramData.followers,
                        following: matchingInstagramData.following,
                        biography: matchingInstagramData.biography,
                        post_count: matchingInstagramData.post_count,
                        recent_posts: matchingInstagramData.posts
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
