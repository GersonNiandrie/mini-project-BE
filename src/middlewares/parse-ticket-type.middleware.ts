import { NextFunction, Request, Response } from "express";

export const parseTicketType = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.ticketType === 'string') {
      req.body.ticketType = JSON.parse(req.body.ticketType);
    }
    next()
}