import { body } from "express-validator";
import { EventType, EventCategory } from "../../generated/prisma/enums";
import AppError from "../helpers/app-error.helper";

export const createEventValidator = [
  body("eventName")
    .exists()
    .withMessage("Event name is required")
    .isLength({ min: 6, max: 50 })
    .withMessage("Event name at least have 6 caracter"),

  body("startDate")
    .exists()
    .withMessage("Start date is required")
    .isISO8601() //format tanggal
    .withMessage("Start date must be a valid date format"),

  body("endDate")
    .exists()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date format")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw AppError("End date must be after start date", 422);
      }
      return true;
    }),

  body("imageUrl")
    .optional({ nullable: true })
    .isString()
    .withMessage("Image URL must string"),

  body("location")
    .exists()
    .withMessage("Location is required")
    .isLength({ max: 100 })
    .withMessage("Location maximum 100 caracter"),

  body("description")
    .exists()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Description at least have 10 caracter"),

  body("seatTotal")
    .exists()
    .withMessage("Seat total is required")
    .isInt({ min: 1 })
    .withMessage("Seat total at least have 1 seat"),

  body("eventType")
    .exists()
    .withMessage("Event type is required")
    .isIn(Object.values(EventType)) //untuk type enum (validasi “harus salah satu dari…”)
    .withMessage(
      `Event type must be one of: ${Object.values(EventType).join(", ")}`,
    ),

  body("eventCategory")
    .exists()
    .withMessage("Event category name is required")
    .isIn(Object.values(EventCategory))
    .withMessage(
      `Event category must one of: ${Object.values(EventCategory).join(", ")}`,
    ),

  body("userId")
    .exists()
    .withMessage("User ID name is required")
    .isUUID()
    .withMessage("User ID must valid UUID"),
];
