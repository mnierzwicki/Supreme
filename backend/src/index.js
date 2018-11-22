const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");

const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// decode jwt and include user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    if (userId === undefined) {
      console.log("Token failed jwt.verify(), BAD COOKIE!");
    }

    // add userId to all requests
    req.userId = userId;
  }
  next();
});

// Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) {
    return next();
  }

  const user = await db.query.user({ where: { id: req.userId } }, "{ id, permissions, email, name }");
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  details => {
    console.log(`Server is now running on http://localhost:${details.port}`);
  }
);
