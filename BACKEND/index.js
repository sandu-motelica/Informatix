import { createServer } from "node:http";
import "dotenv/config.js";
import { connectDB } from "./utils/db-connection.js";
import { router } from "./routes/index.js";
import UserRouter from "./routes/user.js";
import ProblemRouter from "./routes/problem.js";
import TagRouter from "./routes/tag.js";
import SolutionRouter from "./routes/solution.js";
import ClassRouter from "./routes/classes.js";
import HomeworkRouter from "./routes/homework.js";
import CommentRouter from "./routes/comments.js";

const hostname = "localhost";

const port = 3000;

connectDB()
  .then(async () => {
    console.log("connected");
    const server = createServer(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS,DELETE"
      );
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
