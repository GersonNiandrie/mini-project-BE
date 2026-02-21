import { Router } from "express";
import { reviewsController } from "../controllers/reviews.controller";

const reviewsRouter = Router();

reviewsRouter.get("/:eventId", reviewsController.get);
reviewsRouter.post("/", reviewsController.create);
reviewsRouter.delete("/:id", reviewsController.delete);

export default reviewsRouter;
