import { Request, Response } from "express";
import { eventsServices } from "../services/events.service";

export const eventsController = {
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const eventId = await eventsServices.getById(id as string);

    res.status(200).json({
      success: true,
      message: `Get event with id = ${id} success`,
      data: eventId,
    });
  },

  async getByFilter(req: Request, res: Response) {
    const { search, category, type } = req.query;

    const eventCategory = await eventsServices.getByFilter({
      search: search as string,
      category: category as string,
      type: type as string,
    });

    res.status(200).json({
      success: true,
      message: `Get event with filter success`,
      data: eventCategory,
    });
  },
};
