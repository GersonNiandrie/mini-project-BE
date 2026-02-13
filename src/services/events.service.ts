import { Event } from "../../generated/prisma/client";
import { EventCategory, EventType } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { cloudinaryUpload } from "../helpers/cloudinary.helper";

interface filter {
  search?: string;
  category?: string;
  type?: string;
}

export const eventsServices = {
  async getById(id: string) {
    return await prisma.event.findFirst({
      where: {
        id,
        deletedAt: null
      },
    });
  },

  async getByFilter({ search, category, type }: filter) {
    return await prisma.event.findMany({
      where: {
        eventName: search
          ? { contains: search, mode: "insensitive" }
          : undefined,
        eventCategory: category
          ? (category.toUpperCase() as EventCategory)
          : undefined,
        eventType: type ? (type.toUpperCase() as EventType) : undefined,
        deletedAt: null,
      },
    });
  },

  async create(
    file: Express.Multer.File,
    {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    }: Pick<
      Event,
      | "eventName"
      | "startDate"
      | "endDate"
      | "location"
      | "description"
      | "seatTotal"
      | "eventType"
      | "eventCategory"
      | "userId"
    >,
  ) {
    if (!file) {
      throw AppError("Image is required", 400);
    }

    const uploaded = await cloudinaryUpload(file.buffer);

    const createdEvent = await prisma.event.create({
      data: {
        eventName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl: uploaded.secureUrl,
        location,
        description,
        seatTotal: Number(seatTotal),
        eventType,
        eventCategory,
        user: {
          connect: { id: userId },
        },
      },
    });

    return createdEvent;
  },

  async update(
    id: string,
    file: Express.Multer.File,
    {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    }: Pick<
      Event,
      | "eventName"
      | "startDate"
      | "endDate"
      | "location"
      | "description"
      | "seatTotal"
      | "eventType"
      | "eventCategory"
      | "userId"
    >,
  ) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      throw AppError("Event not found", 404);
    }

    if (!file) {
      throw AppError("Image is required", 400);
    }

    const uploaded = await cloudinaryUpload(file.buffer);

    await prisma.event.update({
      where: {
        id,
      },
      data: {
        eventName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl: uploaded.secureUrl,
        location,
        description,
        seatTotal: Number(seatTotal),
        eventType,
        eventCategory,
        user: {
          connect: { id: userId },
        },
      },
    });
  },
  async delete(id: string) {
    const existingEvent = await prisma.event.findFirst({ where: { id } });

    if (!existingEvent) {
      throw AppError("Event not found", 404);
    }

    await prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
