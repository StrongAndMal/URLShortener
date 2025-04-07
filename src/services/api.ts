import axios from 'axios';

// Use environment variable or fallback to the Railway URL
const API_URL = import.meta.env.VITE_API_URL || 'https://urlshortener-production-40c8.up.railway.app/api';

console.log('API URL initialized as:', API_URL);
console.log('Environment variables:', import.meta.env);

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
    const requestUrl = `${API_URL}/shorten`;
    console.log('Sending request to:', requestUrl);
    
    const response = await axios.post(requestUrl, { url: formattedUrl }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    
    if (!response.data || !response.data.shortUrl) {
      throw new Error('Invalid response from server');
    }
    return response.data.shortUrl;
  } catch (error) {
    console.error('Error details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Is Axios error:', true);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        console.error('Server response data:', error.response.data);
        throw new Error(error.response.data.error || `Failed to shorten URL (Status: ${error.response.status})`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
    throw error;
  }
}; 