import { Router } from "express";
import { reviewsController } from "../controllers/reviews.controller";

const router = Router()

router.get('/:id', reviewsController.get)
router.post('/', reviewsController.create)
router.post('/', reviewsController.delete)

export default router