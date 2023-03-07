import express from "express";
import {
  confirmPaymentIntent,
  getOrders,
  paymentIntent,
} from "../controller/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, paymentIntent);
router.put("/", verifyToken, confirmPaymentIntent);

export default router;
