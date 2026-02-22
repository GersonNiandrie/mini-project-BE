import { NextFunction, Request, Response, Router } from "express";
import { jwtVerify} from "../middlewares/auth.middleware";
import { eventsController } from "../controllers/events.controller";
import { expressRequestValidation } from "../middlewares/express.request.validation.middleware";
import { createEventValidator } from "../validators/event.validator";
import { multerUpload } from "../helpers/multer.helper";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { parseTicketType } from "../middlewares/parse-ticket-type.middleware";
import { organizerOnly } from "../middlewares/organizerOnly.middleware";

const router = Router()


router.get("/", eventsController.getByFilter);
router.get('/:id', eventsController.getById)

router.post(
  "/",
  jwtVerify(JWT_TOKEN_SECRET_KEY!),
  organizerOnly,
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("image"),
  parseTicketType,
  createEventValidator,
  expressRequestValidation,
  eventsController.create,
);

router.put(
  "/:id",
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("image"),
  createEventValidator,
  expressRequestValidation,
  eventsController.update
);
router.put('/:id/delete', eventsController.delete)

export default router