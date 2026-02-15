import { Router } from "express";
import { promotionController } from "../controllers/promotion.controller";

const router = Router()

router.get('/:id', promotionController.get)
router.post('/', promotionController.create)
router.put('/:id', promotionController.update)
router.put('/:id/delete', promotionController.delete)

export default router