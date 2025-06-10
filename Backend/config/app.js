import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import routes from '../routes/routes.js';

const app = express();
 
// ✅ Allow CORS for all routes (Including images)
app.use(cors({
  origin: "*", // Allow any frontend to access static files
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Disposition"]
}));

// ✅ Serve static files with proper CORS headers
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*"); // ✅ Allow all origins
    res.set("Cross-Origin-Resource-Policy", "cross-origin"); // ✅ Prevent same-origin policy issues
  }
}));

console.log("📁 Serving static files from:", uploadsPath);

// ✅ Security middlewares
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// ✅ Load routes
routes(app);

// ✅ Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
