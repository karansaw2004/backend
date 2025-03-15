import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()); // Ensure this line is present

// routes import
import userRouter from "./routes/user.routes.js";

// router declaration
app.use("/api/v1", userRouter);

export { app };