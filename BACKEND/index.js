import { createServer } from "node:http";
import "dotenv/config.js";
import { connectDB } from "./utils/db-connection.js";
import { router } from "./routes/index.js";
import UserRouter from "./routes/user.js";
import ProblemRuter from "./routes/problem.js";
import TagRuter from "./routes/tag.js";

const hostname = "localhost";

const port = 3000;

connectDB()
  .then(async () => {
    console.log("connected");
    const server = createServer(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      // cookieParser()(req, res, async () => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
        req.data = body;
      });
      router.lookup(req, res);
      // });
    });

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
