import { Router } from "express";
import { ticketTypesController } from "../controllers/ticket-types-controller";

const router = Router()

router.get('/:id', ticketTypesController.get)
router.post('/', ticketTypesController.create)
router.put("/:id", ticketTypesController.update)
router.put('/:id/delete', ticketTypesController.delete)

export default router