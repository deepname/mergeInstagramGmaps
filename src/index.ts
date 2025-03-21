import { processJsonFile } from './processor.js';

async function main() {
    // Check if file path is provided as command line argument
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Please provide a JSON file path as argument');
        console.log('Usage: node index.js <path-to-json-file>');
        process.exit(1);
    }

    try {
        const instagramUsernames = await processJsonFile(filePath);
        console.log('Instagram usernames:', instagramUsernames);
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}

main();
