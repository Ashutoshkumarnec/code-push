const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
// const ApiError = require("./utils/ApiError");
// const networkSecurityHandler = require("./middlewares/networkSecurityHandler");
// const networkServiceLogs = require("./middlewares/networkServiceLogs");

const app = express();

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.secret
});

// if (config.env !== "test") {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }

// set security HTTP headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

// parse json request body
app.use(express.json({ limit: "50mb" }));
let server = app;
// if (config.socket) {
//   server = http.createServer(app);
//   configure(server, app);
// }

// parse urlencoded request body
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: config.whitelistedURL,
    credentials: true
  })
);
app.options("*", cors());
// app.use(networkSecurityHandler);
// app.use(networkServiceLogs);
// jwt authentication
app.use(cookieParser());
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
app.use(authLimiter)

app.use((req, res, next) => {
  process.currentReq = req;
  next();
});

// v1 api routes
app.use("/v1", routes);

// running status
app.get("/runningStatus", function (req, res) {
  res.send({ status: httpStatus.OK, message: "server running" });
});

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

module.exports = server;
