import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
} from "../controller/review.controller.js";
const router = express.Router();
import { verifyToken } from "../middleware/jwt.js";

router.post("/", verifyToken, createReview);
router.get("/:gigId", getReview);
router.delete("/:gigId", deleteReview);

export default router;
