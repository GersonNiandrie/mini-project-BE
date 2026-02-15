import { Promotion } from "../../generated/prisma/client";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";

export const promotionService = {
  async get(id: string) {
    return prisma.promotion.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  async create({
    promoName,
    promoStartDate,
    promoEndDate,
    quota,
    discAmount,
    eventId,
    userId,
  }: Pick<
    Promotion,
    | "promoName"
    | "promoStartDate"
    | "promoEndDate"
    | "quota"
    | "discAmount"
    | "eventId"
    | "userId"
  >) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw AppError("event not found", 404);
    }

    if (event.userId !== userId) {
      throw AppError("user must be same as creator promo", 403);
    }

    const isInvalidDate =
      new Date(promoStartDate) > new Date(promoEndDate) ||
      new Date(promoStartDate) < event.startDate ||
      new Date(promoEndDate) > event.endDate;

    if (isInvalidDate)
      throw AppError("Promo dates must be within event duration", 400);

    const duplicatePromo = await prisma.promotion.findFirst({
      where: {
        promoName,
        eventId,
        deletedAt: null,

      },
    });

    if (duplicatePromo) {
      throw AppError("Promo has already exists for this event", 400);
    }

    return await prisma.promotion.create({
      data: {
        promoName,
        promoStartDate: new Date(promoStartDate),
        promoEndDate: new Date(promoEndDate),
        quota,
        discAmount,
        event: {
          connect: { id: eventId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  },

  async update(
    id: string,
    {
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      eventId,
      userId,
    }: Pick<
      Promotion,
      | "promoName"
      | "promoStartDate"
      | "promoEndDate"
      | "quota"
      | "discAmount"
      | "eventId"
      | "userId"
    >,
  ) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw AppError("event not found", 404);
    }

    if (event.userId !== userId) {
      throw AppError("user must be same as creator promo", 403);
    }

    const isInvalidDate =
      new Date(promoStartDate) > new Date(promoEndDate) ||
      new Date(promoStartDate) < event.startDate ||
      new Date(promoEndDate) > event.endDate;

    if (isInvalidDate)
      throw AppError("Promo dates must be within event duration", 400);

    const duplicatePromo = await prisma.promotion.findFirst({
      where: {
        promoName,
        eventId,
        deletedAt: null,
        id: {
            not: id
        }
      },
    });

    if (duplicatePromo) {
      throw AppError("Promo has already exists for this event", 400);
    }

    return await prisma.promotion.update({
      where: { id },
      data: {
        promoName,
        promoStartDate: new Date(promoStartDate),
        promoEndDate: new Date(promoEndDate),
        quota,
        discAmount,
        event: {
          connect: { id: eventId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  },

  async delete(id: string) {
    return await prisma.promotion.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
