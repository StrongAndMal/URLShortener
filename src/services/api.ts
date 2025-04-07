import axios from 'axios';

// Use environment variable or fallback to the Railway URL
const API_URL = import.meta.env.VITE_API_URL || 'https://urlshortener-production-40c8.up.railway.app/api';

console.log('API URL initialized as:', API_URL);
console.log('Environment variables:', import.meta.env);

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

const formatUrl = (url: string): string => {
  // Remove any whitespace
  url = url.trim();
  
  // Add http:// if no protocol is specified
  if (!url.match(/^https?:\/\//i)) {
    url = 'http://' + url;
  }
  
  return url;
};

// Helper function to retry failed requests
const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Retrying request, ${retries} attempts left...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay);
  }
};

export const shortenUrl = async (longUrl: string): Promise<string> => {
  console.log('Original URL:', longUrl);
  
  if (!longUrl) {
    throw new Error('Please enter a URL');
  }

  const formattedUrl = formatUrl(longUrl);
  console.log('Formatted URL:', formattedUrl);
  console.log('Using API URL:', API_URL);

  const makeRequest = () => {
    const requestUrl = `${API_URL}/shorten`;
    console.log('Sending request to:', requestUrl);
    
    return axios.post(requestUrl, { url: formattedUrl }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false // This can help with CORS issues
    });
  };

  try {
    // Try with retry mechanism
    const response = await retryRequest(makeRequest);
    
    console.log('Response status:', response.status);
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
        console.error('Server response data:', error.response.data);
        throw new Error(error.response.data.error || `Failed to shorten URL (Status: ${error.response.status})`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        
        // Try to ping the server to see if it's reachable
        try {
          const checkServer = await fetch(`${API_URL.split('/api')[0]}/health`);
          if (checkServer.ok) {
            throw new Error('Server is reachable but the API endpoint is not responding. Please try again later.');
          } else {
            throw new Error('Server is unreachable. Please check your connection or try again later.');
          }
        } catch (e) {
          throw new Error('No response received from server. This could be due to network issues or the server may be down.');
        }
      } else {
        console.error('Error message:', error.message);
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
    throw error;
  }
}; 