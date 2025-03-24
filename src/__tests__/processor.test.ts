import { extractInstagramUsernames } from '../processor.js';
import type { Restaurant } from '../types.js';

describe('extractInstagramUsernames', () => {
  it('should extract usernames from valid Instagram URLs', () => {
    const testData: Restaurant[] = [
      {
        id: '1',
        types: ['restaurant'],
        formattedAddress: 'Test Address 1',
        displayName: { text: 'Test 1', languageCode: 'en' },
        instagramURL: 'https://www.instagram.com/testuser1/',
        businessStatus: 'OPERATIONAL',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: 'en' }
      },
      {
        id: '2',
        types: ['restaurant'],
        formattedAddress: 'Test Address 2',
        displayName: { text: 'Test 2', languageCode: 'en' },
        instagramURL: 'https://instagram.com/testuser2',
        businessStatus: 'OPERATIONAL',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: 'en' }
      },
    ];

    const result = extractInstagramUsernames(testData);
    expect(result).toEqual(['testuser1', 'testuser2']);
  });

  it('should handle invalid URLs and extract usernames from raw strings', () => {
    const testData: Restaurant[] = [
      {
        id: '1',
        types: ['restaurant'],
        formattedAddress: 'Test Address 1',
        displayName: { text: 'Test 1', languageCode: 'en' },
        instagramURL: '@testuser1',
        businessStatus: 'OPERATIONAL',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: 'en' }
      },
    ];

    const result = extractInstagramUsernames(testData);
    expect(result).toEqual(['testuser1']);
  });

  it('should filter out empty usernames', () => {
    const testData: Restaurant[] = [
      {
        id: '1',
        types: ['restaurant'],
        formattedAddress: 'Test Address 1',
        displayName: { text: 'Test 1', languageCode: 'en' },
        instagramURL: '',
        businessStatus: 'OPERATIONAL',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: 'en' }
      },
      {
        id: '2',
        types: ['restaurant'],
        formattedAddress: 'Test Address 2',
        displayName: { text: 'Test 2', languageCode: 'en' },
        instagramURL: '',
        businessStatus: 'OPERATIONAL',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: 'en' }
      },
    ];

    const result = extractInstagramUsernames(testData);
    expect(result).toEqual([]);
  });
});
