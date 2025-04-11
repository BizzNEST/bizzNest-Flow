import app from './config/app.js'
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;  
const HOST = '0.0.0.0';

const ALLOWED_ORIGINS = ['http://flow.bizznest.org', 'http://bfapi.bizznest.org'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

const server = app.listen(process.env.PORT,process.env.HOST,() => {
  console.log(`Server live at http://${HOST}:${PORT}/basePage`)
})
    
export default server;
