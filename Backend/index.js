import app from './config/app.js'
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;  
const HOST = '0.0.0.0';
const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server live at http://${HOST}:${PORT}/basePage`)
})
 
export default server;
