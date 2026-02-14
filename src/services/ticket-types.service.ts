import { TicketType } from "../../generated/prisma/browser";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";

export const ticketTypesService = {
  async get(id: string) {
    return await prisma.ticketType.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  async create({
    ticketType,
    price,
    seatAvailable,
    eventId,
  }: Pick<TicketType, "ticketType" | "price" | "seatAvailable" | "eventId">) {
    
    const event = await prisma.event.findFirst({
      where: {
        id: eventId, //cari Event yang primary key (id)-nya sama dengan eventId
        deletedAt: null,
      },
    });

    if (!event) {
      throw AppError("Event not found", 404);
    }

    const totalExistingseats = await prisma.ticketType.aggregate({
      where: {
        eventId,
        deletedAt: null,
      },
      _sum: {
        seatAvailable: true,
      },
    });

    const usedSeats = totalExistingseats._sum.seatAvailable ?? 0;

    const incomingSeats = Number(seatAvailable);

    //usedSeats + incomingSeats ≤ seatTotal (yang bener)
    if (usedSeats + incomingSeats > event.seatTotal) {
      throw AppError("Seat available exceeds event seat total", 400);
    }

    const duplicateTicketType = await prisma.ticketType.findFirst({
      where: {
        ticketType,
        eventId,
        deletedAt: null,
      },
    });

    if (duplicateTicketType) {
      throw AppError("Ticket type already exists for this event", 400);
    }

    return await prisma.ticketType.create({
      data: {
        ticketType,
        price: Number(price),
        seatAvailable: Number(seatAvailable),
        event: {
          connect: { id: eventId },
        },
      },
    });
  },

  async update(
  id: string,
  data: Pick<TicketType, "ticketType" | "price" | "seatAvailable" | "eventId">
) {
  // 1. ambil ticket type lama
  const ticket = await prisma.ticketType.findFirst({
    where: { id, deletedAt: null },
  });
  if (!ticket) throw AppError("Ticket type not found", 404);

  // 2. tentukan eventId final + ambil event
  const finalEventId = data.eventId ?? ticket.eventId;

  const event = await prisma.event.findFirst({
    where: { id: finalEventId, deletedAt: null },
  });
  if (!event) throw AppError("Event not found", 404);

  // 3. hitung total seat ticket lain
  const totalOtherSeats = await prisma.ticketType.aggregate({
    where: {
      eventId: finalEventId,
      deletedAt: null,
      NOT: { id },
    },
    _sum: { seatAvailable: true },
  });

  const usedSeats = totalOtherSeats._sum.seatAvailable ?? 0;

  // 4. tentukan seat final
  const finalSeat =
    data.seatAvailable !== undefined
      ? Number(data.seatAvailable)
      : ticket.seatAvailable;

  if (Number.isNaN(finalSeat)) {
    throw AppError("seatAvailable must be a number", 400);
  }

  // 5. validasi kapasitas
  if (usedSeats + finalSeat > event.seatTotal) {
    throw AppError(
      "Total seat of all ticket types exceeds event seat total",
      400
    );
  }

  // 6. update
  return prisma.ticketType.update({
    where: { id },
    data: {
      ticketType: data.ticketType ?? ticket.ticketType,
      price:
        data.price !== undefined ? Number(data.price) : ticket.price,
      seatAvailable: finalSeat,
      eventId: finalEventId,
    },
  });
},


  async delete(id: string) {
    const ticketTypes = await prisma.ticketType.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!ticketTypes) {
      throw AppError("Ticket type not found", 404);
    }

    return await prisma.ticketType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
