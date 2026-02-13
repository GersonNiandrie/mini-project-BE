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

  async create(req: Request, res: Response) {
    const {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    } = req.body;

    const files = req.file as Express.Multer.File;

    const event = await eventsServices.create(files, {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Create event successful",
      data: event,
    });
  },

  async update(req: Request, res: Response) {
    const { id } = req?.params;

    const {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    } = req.body;

    const file = req.file as Express.Multer.File;

    const event = await eventsServices.update(id as string, file, {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Update event successful",
      data: event,
    });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const event = await eventsServices.delete(id as string);

    res.status(200).json({
      success: true,
      message: "Delete event Successfull",
      data: event,
    });
  },
};
