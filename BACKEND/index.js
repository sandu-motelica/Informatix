import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './utils/db-connection.js';
import { router } from './routes/index.js';
import userRouter from './routes/user.js';


const hostname = 'localhost';
const port = 3000;

connectDB().then(async ()=> {
  console.log("connected");
  const server =  createServer(async (req, res) => {
    // cookieParser()(req, res, async () => {
      let body = '';
      await req
        .on('data', chunk => {
          body += chunk;
          req.data = body;
          router.lookup(req,res);
        })
    // });
  });
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
  
})
.catch((e)=>{
  console.log(e)
})

