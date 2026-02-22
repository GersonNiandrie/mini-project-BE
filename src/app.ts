import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import authRouter from './routers/auth.router';
import profileRouter from './routers/profile.router';
import dashboardRouter from './routers/dashboard.router';
import eventsRouter from "./routers/events.router";
import cors from 'cors';
import { corsOptions } from "./config/cors.config";
import cookieParser from "cookie-parser";
import "./config/main.config";

const PORT: number = 8080;
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/dashboard', dashboardRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.expose === true ? err.statusCode : 500;
  const message = err.expose === true ? err.message : 'Something went wrong';
  console.log(err);
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/api/events", eventsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err);
  const statusCode = err.expose === true ? err.statusCode : 500;
  const message = err.expose === true ? err.message : "Semothing went wrong";

  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
