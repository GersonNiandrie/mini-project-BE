import { Request, Response } from "express";
import { ticketTypesService } from "../services/ticket-types.service";

export const ticketTypesController = {
    async get(req: Request, res: Response){
        const {id} = req.params

        const ticketTypeId = await ticketTypesService.get(id as string)

        res.status(200).json({
          success: true,
          message: `Get event with id = ${id} success`,
          data: ticketTypeId
        });
    },

    async create(req: Request, res: Response){
        const {ticketType, price, seatAvailable, eventId} = req.body

        console.log("BODY:", req.body);
        console.log("HEADERS:", req.headers["content-type"]);

        const ticketTypes = await ticketTypesService.create({
          ticketType,
          price,
          seatAvailable,
          eventId,
        });

        res.status(201).json({
          success: true,
          message: `Created ticket type success`,
          data: ticketTypes,
        });
    },

    async update(req: Request, res: Response){
        const {id} = req.params
        const { ticketType, price, seatAvailable, eventId } = req.body;

        console.log(ticketType)

        const ticketTypes = await ticketTypesService.update(id as string ,{
          ticketType,
          price,
          seatAvailable,
          eventId,
        });

        res.status(200).json({
          success: true,
          message: `Updated ticket type success`,
          data: ticketTypes,
        });
    },

    async delete(req: Request, res: Response){
        const {id} = req.params

        const ticketTypes = await ticketTypesService.delete(id as string)

        res.status(200).json({
          success: true,
          message: `Deleted ticket type success`,
          data: ticketTypes,
        });
    }
}