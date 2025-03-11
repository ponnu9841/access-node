import express, { type Express } from "express";
import cors from "cors";
import User from "./routes/User";
import Banner from "./routes/Banner";
import About from "./routes/About";
import Partner from "./routes/Partner";
import Service from "./routes/Service";

const app: Express = express();
const PORT = 8000;
app.use(
   cors({
      origin: function (origin, callback) {
         const allowedOrigins =
            process.env.NODE_ENV === "development"
               ? [
                    "http://localhost:3000", //add your frontend domain urls here
                 ]
               : ["https://api.accesstech.in"];
         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
         } else {
            callback(new Error("Not allowed by CORS"));
         }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
         "Content-Type",
         "Authorization",
         "X-Requested-With",
         "Accept",
      ],
      credentials: true,
   })
);
app.options("*", cors());

// Middleware to parse JSON bodies
app.use(express.static("public"));
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api", User);
app.use("/api/banner", Banner);
app.use("/api/about", About);
app.use("/api/partner", Partner);
app.use("/api/service", Service);

app.listen(PORT);

module.exports = app;
