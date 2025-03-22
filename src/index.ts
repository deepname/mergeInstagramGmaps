import { processJsonFile, mergeGmapsInstagram } from './processor.js';

async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    if (!command) {
        console.error('Please provide a command: extract or merge');
        console.log('Usage:');
        console.log('  Extract usernames: node index.js extract <path-to-gmaps-json>');
        console.log('  Merge data: node index.js merge <path-to-gmaps-json> <path-to-instagram-json> <output-path>');
        process.exit(1);
    }

    try {
        switch (command) {
            case 'extract':
                if (args.length !== 1) {
                    console.error('Please provide the path to the Google Maps JSON file');
                    process.exit(1);
                }
                const instagramUsernames = await processJsonFile(args[0]);
                console.log('Instagram usernames:', instagramUsernames);
                break;

            case 'merge':
                if (args.length !== 3) {
                    console.error('Please provide: <path-to-gmaps-json> <path-to-instagram-json> <output-path>');
                    process.exit(1);
                }
                const [gmapsPath, instagramPath, outputPath] = args;
                await mergeGmapsInstagram(gmapsPath, instagramPath, outputPath);
                break;

            default:
                console.error('Unknown command. Use either "extract" or "merge"');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}

main();
