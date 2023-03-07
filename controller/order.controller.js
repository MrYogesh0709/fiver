import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import Stripe from "stripe";

const paymentIntent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const gig = await Gig.findById(req.params.id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
    await newOrder.save();
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

//without payment intent
// const createOrder = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);
//     const newOrder = new Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       buyerId: req.userId,
//       sellerId: gig.userId,
//       price: gig.price,
//       payment_intent: "tempory_string",
//     });
//     await newOrder.save();
//     res.status(200).send("Successful");
//   } catch (error) {
//     next(error);
//   }
// };

const confirmPaymentIntent = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send("Order has been confirmed");
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

export { getOrders, paymentIntent, confirmPaymentIntent };
