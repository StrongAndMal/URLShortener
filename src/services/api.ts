import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

const formatUrl = (url: string): string => {
  // Remove any whitespace
  url = url.trim();
  
  // Add http:// if no protocol is specified
  if (!url.match(/^https?:\/\//i)) {
    url = 'http://' + url;
  }
  
  return url;
};

const isValidUrl = (url: string): boolean => {
  try {
    const formattedUrl = formatUrl(url);
    new URL(formattedUrl);
    return true;
  } catch {
    return false;
  }
};

export const shortenUrl = async (longUrl: string): Promise<string> => {
  console.log('Original URL:', longUrl);
  
  if (!longUrl) {
    throw new Error('Please enter a URL');
  }

  const formattedUrl = formatUrl(longUrl);
  console.log('Formatted URL:', formattedUrl);

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
      } else if (error.request) {
        throw new Error('No response from server. Please check if the backend is running.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
}; 