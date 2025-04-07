import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import shortid from 'shortid';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for any origin in development/production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

// Store URLs in memory (in production, you'd want to use a database)
const urlMap = new Map<string, string>();

// Base URL for shortened links
const BASE_URL = 'http://localhost:3000';

// Health check endpoint
app.get('/health', (req, res) => {
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
  return shortid.generate().slice(0, 6);
};

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  if (req.body) console.log('Body:', req.body);
  next();
});

// Shorten URL endpoint
app.post('/api/shorten', (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      console.error('No URL provided in request body:', req.body);
      return res.status(400).json({ error: 'URL is required' });
    }

    const formattedUrl = formatUrl(url);
    const shortId = generateShortId();
    const shortUrl = `https://urlshortener-production-40c8.up.railway.app/${shortId}`;
    
    urlMap.set(shortId, formattedUrl);
    
    console.log(`Shortened URL: ${formattedUrl} -> ${shortUrl}`);
    res.json({ shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// Redirect endpoint
app.get('/:shortId', (req, res) => {
  try {
    const { shortId } = req.params;
    const longUrl = urlMap.get(shortId);
    
    console.log(`Lookup for shortId: ${shortId}, found: ${longUrl || 'not found'}`);
    
    if (!longUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    console.log(`Redirecting: ${shortId} -> ${longUrl}`);
    res.redirect(longUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

// API base endpoint for testing
app.get('/api', (req, res) => {
  res.json({ message: 'URL Shortener API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 