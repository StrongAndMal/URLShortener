import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import shortid from 'shortid';

const app = express();
const port = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  // Vercel deployments
  'https://url-shortener-43wfqs0md-strongandmals-projects.vercel.app',
  'https://url-shortener-8o848ps0x-strongandmals-projects.vercel.app',
  'https://url-shortener-fbajvwg49-strongandmals-projects.vercel.app',
  'https://url-shortener-btvut9smz-strongandmals-projects.vercel.app',
  // Local development
  'http://localhost:5173',
  // GitHub Pages
  'https://strongandmal.github.io'
];

// Enable CORS for specific origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`Origin ${origin} is not allowed by CORS`);
      // If not in list but has url-shortener in the domain, allow it (for new Vercel deployments)
      if (origin.includes('url-shortener') && origin.includes('vercel.app')) {
        console.log(`Allowing new Vercel deployment: ${origin}`);
        return callback(null, true);
      }
    }
    
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
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
  // Set CORS headers explicitly for health check
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
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
    
    // Set CORS headers explicitly (helps with some clients)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
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
  // Set CORS headers explicitly for API endpoint
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  res.json({ message: 'URL Shortener API is running', timestamp: new Date().toISOString() });
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