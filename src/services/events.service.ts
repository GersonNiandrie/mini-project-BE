import { EventCategory, EventType } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma-client.config";

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
      },
    });
  },
};
