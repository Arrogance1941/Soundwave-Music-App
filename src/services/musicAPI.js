import { get, post } from 'aws-amplify/api';
import { getUrl, downloadData, uploadData } from 'aws-amplify/storage';

const generateClient = () => ({
  get: get,
  post: post
});

const client = generateClient();

export const musicAPI = {
  // Get all songs
  getSongs: async () => {
    try {
      const restOperation = client.get({
        apiName: 'musicapi',
        path: '/songs'
      });
      const response = await restOperation.response;
      const data = await response.body.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  },

  // Create a new song record
  createSong: async (songData) => {
    try {
      const restOperation = client.post({
        apiName: 'musicapi',
        path: '/songs',
        options: {
          body: songData
        }
      });
      const response = await restOperation.response;
      return await response.body.json();
    } catch (error) {
      console.error('Error creating song:', error);
      throw error;
    }
  },

  // Get song stream URL from S3
  getSongUrl: async (fileKey) => {
    try {
      const result = await getUrl({ 
        key: fileKey,
        options: {
          expiresIn: 3600 // 1 hour
        }
      });
      return result.url;
    } catch (error) {
      console.error('Error getting song URL:', error);
      throw error;
    }
  },

  // Upload song file to S3
  uploadSongFile: async (fileKey, file) => {
    try {
      const result = await uploadData({
        key: fileKey,
        data: file,
        options: {
          contentType: file.type
        }
      });
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Download song
  downloadSong: async (fileKey) => {
    try {
      const result = await downloadData({ key: fileKey });
      return result;
    } catch (error) {
      console.error('Error downloading song:', error);
      throw error;
    }
  }
};