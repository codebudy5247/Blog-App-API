import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import favicon from "serve-favicon";
import logger from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";


var app = express();

app.use(compression({
   level:6,
   threshold:100 * 1000
}))

dotenv.config();

//Connect to DB
connectDB();

// view engine setup

// app.engine(".hbs", exphbs({ defaultLayout: "layout", extname: ".hbs" }));
// app.set("view engine", ".hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// static public files
//app.use(express.static("public"));

//Import Routes
import blogRoutes from "./routes/blogRoutes.js";
import userRouter from "./routes/userRoutes.js";
import compression from "compression";
app.use("/posts", blogRoutes);
app.use("/user", userRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// } else {

// }

app.get("/", (req, res) => {
  res.send("API is running....");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
