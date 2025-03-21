import { promises as fs } from 'fs';
import { Restaurant } from './types.js';

export async function processJsonFile(filePath: string): Promise<string[]> {
    try {
        // Read and parse the JSON file
        const jsonData = JSON.parse(await fs.readFile(filePath, 'utf8')) as Restaurant[];

        // Process each item that has an instagramURL and collect usernames
        const instagramUsernames = jsonData
            .filter(item => item.instagramURL)
            .map(item => {
                const urlWithoutProtocol = item.instagramURL.replace(/^https?:\/\//, '');
                const urlParts = urlWithoutProtocol.split('/');
                return urlParts[1] || ''; // Get the username part
            })
            .filter(username => username !== ''); // Remove empty usernames

        return instagramUsernames;

    } catch (error) {
        console.error('Error processing file:', error instanceof Error ? error.message : 'Unknown error');
        return [];
    }
}
