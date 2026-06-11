import { Router } from "express";
import * as reviewsController from "./reviews.controller";
import { authenticate, authorize, validate } from "../../middleware";
import { createReviewSchema, updateReviewSchema } from "./reviews.validation";

export const reviewsRouter = Router();

reviewsRouter.get("/mine", authenticate, authorize("patient"), reviewsController.getMyReviews);
reviewsRouter.get("/:providerType/:providerId", reviewsController.listForProvider);

reviewsRouter.post("/", authenticate, authorize("patient"), validate(createReviewSchema), reviewsController.createReview);
reviewsRouter.patch("/:id", authenticate, authorize("patient"), validate(updateReviewSchema), reviewsController.updateReview);
reviewsRouter.delete("/:id", authenticate, authorize("patient"), reviewsController.deleteReview);
