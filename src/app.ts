import express, { NextFunction, Request, Response } from "express";
import eventsRouter from "./router/events.router";

const PORT: number = 8000;

const app = express();

app.use('/api/events', eventsRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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