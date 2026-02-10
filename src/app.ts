import express, { Request, Response } from "express";
import eventsRouter from "./router/events.router";

const PORT: number = 8000;

const app = express();

app.use('/api/events', eventsRouter)

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});