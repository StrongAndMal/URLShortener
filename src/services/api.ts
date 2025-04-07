import axios from 'axios';

// Use environment variable or fallback to the Railway URL
const API_URL = import.meta.env.VITE_API_URL || 'https://urlshortener-production-40c8.up.railway.app/api';

const formatUrl = (url: string): string => {
  // Remove any whitespace
  url = url.trim();
  
  // Add http:// if no protocol is specified
  if (!url.match(/^https?:\/\//i)) {
    url = 'http://' + url;
  }
  
  return url;
};

export const shortenUrl = async (longUrl: string): Promise<string> => {
  console.log('Original URL:', longUrl);
  
  if (!longUrl) {
    throw new Error('Please enter a URL');
  }

  const formattedUrl = formatUrl(longUrl);
  console.log('Formatted URL:', formattedUrl);
  console.log('Using API URL:', API_URL);

  try {
    console.log('Sending request to:', `${API_URL}/shorten`);
    const response = await axios.post(`${API_URL}/shorten`, { url: formattedUrl });
    console.log('Response:', response.data);
    
    if (!response.data || !response.data.shortUrl) {
      throw new Error('Invalid response from server');
    }
    return response.data.shortUrl;
  } catch (error) {
    console.error('Error details:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data.error || 'Failed to shorten URL');
      }
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}; 