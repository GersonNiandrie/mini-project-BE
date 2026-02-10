import { Router } from "express";
import { eventsController } from "../controllers/events.controller";

const router = Router()


router.get("/", eventsController.getByFilter);
router.get('/:id', eventsController.getById)


export default router