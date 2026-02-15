import { Request, Response } from "express";
import { promotionService } from "../services/promotion.service";

export const promotionController = {
  async get(req: Request, res: Response) {
    const { id } = req.params;

    const promo = await promotionService.get(id as string);

    res.status(200).json({
      success: true,
      message: `Get promotion with id = ${id} success`,
      data: promo,
    });
  },

  async create(req: Request, res: Response) {
    const {
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      eventId,
      userId,
    } = req.body;

    const promo = await promotionService.create({
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      eventId,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "create promotion success",
      data: promo,
    });
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const {
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      eventId,
      userId,
    } = req.body;

    const promo = await promotionService.update(id as string, {
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      eventId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "update promotion success",
      data: promo,
    });
  },

  async delete(req: Request, res: Response) {
    const {id} = req.params

    const promo = await promotionService.delete(id as string)

    res.status(200).json({
      success: true,
      message: "deleted promotion success",
      data: promo
    });
  },
};
