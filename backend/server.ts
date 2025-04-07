import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import shortid from 'shortid';

const app = express();
const port = 3000;

// In-memory storage for URLs
const urlMap = new Map<string, string>();

// Base URL for shortened links
const BASE_URL = 'http://localhost:3000';

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const formatUrl = (url: string): string => {
  // Remove any whitespace
  url = url.trim();
  
  // Add http:// if no protocol is specified
  if (!url.match(/^https?:\/\//i)) {
    url = 'http://' + url;
  }
  
  return url;
};

// Generate a shorter ID (similar to bit.ly format)
const generateShortId = (): string => {
  // Generate a random string of 6 characters
  return shortid.generate().substring(0, 6);
};

// Shorten URL endpoint
app.post('/api/shorten', (req, res) => {
  console.log('Received request body:', req.body);
  const { url } = req.body;
  
  if (!url) {
    console.log('No URL provided');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Format and validate URL
    const formattedUrl = formatUrl(url);
    console.log('Formatted URL:', formattedUrl);
    
    new URL(formattedUrl);
    console.log('URL validation successful');
    
    // Generate a short ID
    const shortId = generateShortId();
    console.log('Generated short ID:', shortId);
    
    // Store the mapping
    urlMap.set(shortId, formattedUrl);
    
    // Return the shortened URL
    const shortUrl = `${BASE_URL}/${shortId}`;
    console.log('Returning short URL:', shortUrl);
    
    res.json({ shortUrl });
  } catch (error) {
    console.error('Error processing URL:', error);
    if (error instanceof TypeError) {
      return res.status(400).json({ error: 'Please enter a valid URL (e.g., example.com or https://example.com)' });
    }
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// Redirect endpoint
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  console.log('Looking up short ID:', shortId);
  
  const originalUrl = urlMap.get(shortId);
  console.log('Found URL:', originalUrl);
  
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 